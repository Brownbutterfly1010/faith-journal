import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function callHFModel(prompt: string): Promise<string> {
  try {
    const message = await groq.chat.completions.create({
      messages: [
        { role: "user", content: prompt }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 500,
    });

    const text = message.choices[0]?.message?.content || '';
    if (!text || text.trim() === '') {
      throw new Error("Empty response from Groq");
    }
    return text.trim();
  } catch (error: any) {
    console.error("Groq error:", error.message);
    throw error;
  }
}

const entriesFile = path.join(__dirname, '..', 'entries.json');
const devotionsFile = path.join(__dirname, '..', 'devotions.json');
const playlistsFile = path.join(__dirname, '..', 'playlists.json');

// Ensure files exist
if (!fs.existsSync(entriesFile)) {
  fs.writeFileSync(entriesFile, JSON.stringify([]));
}
if (!fs.existsSync(playlistsFile)) {
  fs.writeFileSync(playlistsFile, JSON.stringify([]));
}
if (!fs.existsSync(devotionsFile)) {
  // Initialize with sample devotions
  const sampleDevotions = [
    {
      id: 1,
      date: new Date().toISOString().split('T')[0],
      title: "Finding Peace in Chaos",
      verse: "Philippians 4:6-7",
      content: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
      reflection: "In times of uncertainty, we are reminded that God offers us peace beyond our understanding. When we bring our worries to Him with gratitude, we find strength and clarity."
    }
  ];
  fs.writeFileSync(devotionsFile, JSON.stringify(sampleDevotions, null, 2));
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Faith Journal API Routes
  
  // GET all entries for current user ONLY (identified by X-User-ID header)
  app.get('/api/entries', (req, res) => {
    const userId = req.get('X-User-ID') || 'anonymous';
    const entries = JSON.parse(fs.readFileSync(entriesFile, 'utf-8'));
    const userEntries = entries.filter((e: any) => e.userId === userId);
    res.json(userEntries);
  });

  // POST new entry with auto-suggestion (identified by X-User-ID header)
  app.post('/api/entries', async (req, res) => {
    const userId = req.get('X-User-ID') || 'anonymous';

    const { title, content } = req.body;
    if (!content) {
      return res.json({ success: false, message: 'Content cannot be empty' });
    }

    // Get recent suggestions to avoid repetition (only this user's entries)
    const entries = JSON.parse(fs.readFileSync(entriesFile, 'utf-8'));
    const userEntries = entries.filter((e: any) => e.userId === userId);
    const recentSuggestions = userEntries.slice(-5).map((e: any) => {
      if (e.suggestion) {
        const match = e.suggestion.match(/(\w+\s\d+:\d+)/);
        return match ? match[1] : '';
      }
      return '';
    }).filter((s: string) => s);

    // Check if content is clear enough (not gibberish/unclear)
    const isContentClear = (text: string): boolean => {
      const cleanText = text.toLowerCase().trim();
      const words = cleanText.split(/\s+/);
      
      // Too short = unclear
      if (words.length < 3) return false;
      
      // Count real words (at least 3 letters, valid characters)
      const realWords = words.filter(w => /^[a-z]{3,}$/.test(w.replace(/[.,!?;:'-]/g, ''))).length;
      const wordRatio = realWords / words.length;
      
      // If less than 40% are real words = gibberish
      if (wordRatio < 0.4) return false;
      
      // Check for excessive repeated characters
      if (/(.)\1{3,}/.test(cleanText)) return false;
      
      return true;
    };

    // Use AI to suggest a relevant Bible verse with explanation based on entry content
    let suggestion = "";
    try {
      if (!isContentClear(content)) {
        suggestion = "CHAT_SUGGESTION: Looks like you're having difficulty expressing yourself. Let's chat with me (Elara) instead—I'm here to listen and help you work through what's on your heart. Click the wand button to start chatting.";
      } else {
        const versePrompt = `You are a spiritual advisor. Based on this journal entry, recommend ONE Bible verse from the King James Version that provides relevant guidance, comfort, or reflection. The verse meaning MUST directly relate to what the user wrote about.

Journal entry: "${content.substring(0, 150)}"

Provide ONLY in this exact format with nothing else:
VERSE: [Book Chapter:Verse] (example: Psalms 23:4)
TEXT: [The actual verse text]
MEANING: [2-3 sentences explaining how this verse relates directly to what they shared]

Be specific and meaningful - the meaning must show you understood their entry.`;
        
        const aiResponse = await callHFModel(versePrompt);
        if (aiResponse && aiResponse.trim()) {
          suggestion = aiResponse.substring(0, 600).trim();
        }
      }
    } catch (error) {
      console.error("Verse suggestion error:", error);
    }

    // Save entry with userId (ALWAYS include userId)
    const newEntry = { 
      title: title || 'Untitled', 
      content, 
      date: new Date().toISOString(),
      userId,
      suggestion
    };
    entries.push(newEntry);
    fs.writeFileSync(entriesFile, JSON.stringify(entries, null, 2));
    res.json({ success: true, entry: newEntry, suggestion });
  });

  // DELETE entry by date (identified by X-User-ID header)
  app.delete('/api/entries/:date', (req, res) => {
    const userId = req.get('X-User-ID') || 'anonymous';
    
    const { date } = req.params;
    let entries = JSON.parse(fs.readFileSync(entriesFile, 'utf-8'));
    entries = entries.filter((e: any) => !(e.date === decodeURIComponent(date) && e.userId === userId));
    fs.writeFileSync(entriesFile, JSON.stringify(entries, null, 2));
    res.json({ success: true });
  });

  // GET all devotions
  app.get('/api/devotions', (req, res) => {
    const devotions = JSON.parse(fs.readFileSync(devotionsFile, 'utf-8'));
    res.json(devotions);
  });

  // GET today's devotion
  app.get('/api/devotions/today', (req, res) => {
    const devotions = JSON.parse(fs.readFileSync(devotionsFile, 'utf-8'));
    const today = new Date().toISOString().split('T')[0];
    const todayDevtion = devotions.find((d: any) => d.date === today);
    
    if (todayDevtion) {
      res.json(todayDevtion);
    } else {
      // Return the last devotion if today's doesn't exist
      res.json(devotions[devotions.length - 1]);
    }
  });

  // Bible API Route - Using local ASV database
  app.get('/api/bible-verses', (req, res) => {
    try {
      const { book, chapter } = req.query;
      if (!book || !chapter) {
        return res.status(400).json({ error: 'Book and chapter required' });
      }

      const bookStr = String(book);
      const chapterNum = parseInt(String(chapter));

      const kjvData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'kjv.json'), 'utf-8'));
      const bookData = kjvData.books.find((b: any) => b.name.toLowerCase() === bookStr.toLowerCase());
      
      if (!bookData) {
        return res.json({ verses: [] });
      }

      const chapterData = bookData.chapters.find((c: any) => c.chapter === chapterNum);
      if (!chapterData) {
        return res.json({ verses: [] });
      }

      const verses = chapterData.verses.map((v: any) => ({
        verse: v.verse,
        text: v.text
      }));

      res.json({ verses });
    } catch (error) {
      console.error('Bible error:', error);
      res.json({ verses: [] });
    }
  });

  // Spotify Playlist Routes - User-Specific
  app.get('/api/playlists', (req, res) => {
    const userId = req.get('X-User-ID') || 'anonymous';
    const playlists = JSON.parse(fs.readFileSync(playlistsFile, 'utf-8'));
    const userPlaylists = playlists.filter((p: any) => p.userId === userId);
    res.json(userPlaylists);
  });

  app.post('/api/playlists', (req, res) => {
    const userId = req.get('X-User-ID') || 'anonymous';
    const { id, name, songs } = req.body;
    
    let playlists = JSON.parse(fs.readFileSync(playlistsFile, 'utf-8'));
    const newPlaylist = { id, name, songs, userId };
    playlists.push(newPlaylist);
    fs.writeFileSync(playlistsFile, JSON.stringify(playlists, null, 2));
    res.json({ success: true, playlist: newPlaylist });
  });

  app.delete('/api/playlists/:id', (req, res) => {
    const userId = req.get('X-User-ID') || 'anonymous';
    const { id } = req.params;
    let playlists = JSON.parse(fs.readFileSync(playlistsFile, 'utf-8'));
    playlists = playlists.filter((p: any) => !(p.id === id && p.userId === userId));
    fs.writeFileSync(playlistsFile, JSON.stringify(playlists, null, 2));
    res.json({ success: true });
  });

  // POST new devotion/blog article (server-side only)
  app.post('/api/devotions', (req, res) => {
    const { title, verse, content, reflection, date } = req.body;
    
    if (!title || !content) {
      return res.json({ success: false, message: 'Title and content are required' });
    }

    const devotions = JSON.parse(fs.readFileSync(devotionsFile, 'utf-8'));
    const maxId = Math.max(...devotions.map((d: any) => d.id || 0), 0);
    
    const newDevtion = {
      id: maxId + 1,
      date: date || new Date().toISOString().split('T')[0],
      title,
      verse: verse || 'No verse specified',
      content,
      reflection: reflection || ''
    };
    
    devotions.push(newDevtion);
    fs.writeFileSync(devotionsFile, JSON.stringify(devotions, null, 2));
    
    res.json({ success: true, devotion: newDevtion });
  });

  // POST chat with Elara AI
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, userName } = req.body;

      if (!message) {
        return res.json({ success: false, error: 'Message is required', reply: null });
      }

      const systemPrompt = `You are Elara, a warm and focused spiritual companion for a Christian faith journal. The user's name is ${userName || 'Friend'}.

IMPORTANT: Have a normal conversation. Stay focused on what the user said. Don't ramble or share random thoughts. Respond directly to their message.

Guidelines:
- Reply in 1-2 sentences (short and natural)
- Be warm, supportive, and compassionate
- If appropriate, ask a thoughtful follow-up question to keep the conversation going
- Only mention Bible verses if directly relevant to what they're asking
- Sound like a real friend, not a generic AI

User message: "${message}"

Reply naturally and conversationally:`;

      try {
        const reply = await callHFModel(systemPrompt);
        if (reply && reply.trim()) {
          const cleanedReply = reply.substring(0, 400).trim();
          res.json({ success: true, reply: cleanedReply });
          return;
        }
      } catch (aiError) {
        console.error("AI call failed:", aiError);
      }
      
      // Fallback response if AI fails
      const fallbackReplies = [
        "I'm here to listen and support you on your faith journey. What's on your heart today?",
        "Thank you for sharing. God is with you in this moment. How can I help deepen your reflection?",
        "I'm listening with compassion. Please tell me more about what you're experiencing.",
      ];
      const fallbackReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      res.json({ success: true, reply: fallbackReply });
    } catch (error: any) {
      console.error("Chat error:", error.message || error);
      res.json({ 
        success: false, 
        error: "A temporary issue occurred. Please try again.",
        reply: "I'm here to listen and support you on your faith journey."
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
