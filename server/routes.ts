import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is using OpenAI's API - blueprint:javascript_openai
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const entriesFile = path.join(process.cwd(), 'entries.json');
const devotionsFile = path.join(process.cwd(), 'devotions.json');
const playlistsFile = path.join(process.cwd(), 'playlists.json');

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
  
  // GET all entries for current user (or all if not logged in)
  app.get('/api/entries', (req, res) => {
    const userId = (req.session as any)?.userId;
    const entries = JSON.parse(fs.readFileSync(entriesFile, 'utf-8'));
    if (userId) {
      const userEntries = entries.filter((e: any) => e.userId === userId);
      res.json(userEntries);
    } else {
      // If not logged in, show entries without userId (for testing)
      const unAuthEntries = entries.filter((e: any) => !e.userId);
      res.json(unAuthEntries);
    }
  });

  // POST new entry with auto-suggestion (using keyword-based matching)
  app.post('/api/entries', async (req, res) => {
    const userId = (req.session as any)?.userId;

    const { title, content } = req.body;
    if (!content) {
      return res.json({ success: false, message: 'Content cannot be empty' });
    }

    // Get recent suggestions to avoid repetition
    const entries = JSON.parse(fs.readFileSync(entriesFile, 'utf-8'));
    const userOrUnAuthEntries = entries.filter((e: any) => userId ? e.userId === userId : !e.userId);
    const recentSuggestions = userOrUnAuthEntries.slice(-5).map((e: any) => {
      if (e.suggestion) {
        const match = e.suggestion.match(/(\w+\s\d+:\d+)/);
        return match ? match[1] : '';
      }
      return '';
    }).filter((s: string) => s);

    // Suggest a random verse from popular Bible verses
    const popularVerses = [
      { book: "John", chapter: 3, verse: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
      { book: "Psalms", chapter: 23, verse: 1, text: "The LORD is my shepherd; I shall not want." },
      { book: "Romans", chapter: 3, verse: 23, text: "For all have sinned, and come short of the glory of God;" },
      { book: "1 John", chapter: 1, verse: 9, text: "If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness." },
      { book: "Philippians", chapter: 4, verse: 13, text: "I can do all things through Christ which strengtheneth me." },
      { book: "Joshua", chapter: 1, verse: 9, text: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest." },
      { book: "Proverbs", chapter: 3, verse: 5, text: "Trust in the LORD with all thine heart; and lean not unto thine own understanding:" },
      { book: "Matthew", chapter: 11, verse: 28, text: "Come unto me, all ye that labour and are heavy laden, and I will give you rest." },
      { book: "Genesis", chapter: 1, verse: 1, text: "In the beginning God created the heaven and the earth." },
    ];
    const randomVerse = popularVerses[Math.floor(Math.random() * popularVerses.length)];
    const suggestion = `${randomVerse.book} ${randomVerse.chapter}:${randomVerse.verse} - "${randomVerse.text}"`;

    // Save entry with optional userId
    const newEntry = { 
      title: title || 'Untitled', 
      content, 
      date: new Date().toISOString(),
      ...(userId && { userId }),
      suggestion
    };
    entries.push(newEntry);
    fs.writeFileSync(entriesFile, JSON.stringify(entries, null, 2));
    res.json({ success: true, entry: newEntry, suggestion });
  });

  // DELETE entry by date (only user's own entries or unauth entries)
  app.delete('/api/entries/:date', (req, res) => {
    const userId = (req.session as any)?.userId;
    const { date } = req.params;
    let entries = JSON.parse(fs.readFileSync(entriesFile, 'utf-8'));
    
    if (userId) {
      entries = entries.filter((e: any) => !(e.date === decodeURIComponent(date) && e.userId === userId));
    } else {
      entries = entries.filter((e: any) => !(e.date === decodeURIComponent(date) && !e.userId));
    }
    
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

  // Bible API Route - Using local KJV database
  app.get('/api/bible-verses', (req, res) => {
    try {
      const { book, chapter } = req.query;
      if (!book || !chapter) {
        return res.status(400).json({ error: 'Book and chapter required' });
      }

      const kjvData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/kjv.json'), 'utf-8'));
      const bookStr = String(book);
      const chapterNum = parseInt(String(chapter));

      // Find the book in the database
      const bookData = kjvData.books.find((b: any) => b.name === bookStr);
      if (!bookData) {
        return res.json({ verses: [] });
      }

      // Find the chapter
      const chapterData = bookData.chapters.find((c: any) => c.chapter === chapterNum);
      if (!chapterData) {
        return res.json({ verses: [] });
      }

      // Extract verses
      const versesArray = chapterData.verses.map((v: any) => ({
        verse: v.verse,
        text: v.text
      }));

      res.json({ verses: versesArray });
    } catch (error) {
      console.error('Bible error:', error);
      res.json({ verses: [] });
    }
  });

  // Spotify Playlist Routes
  app.get('/api/playlists', (req, res) => {
    const playlists = JSON.parse(fs.readFileSync(playlistsFile, 'utf-8'));
    res.json(playlists);
  });

  app.delete('/api/playlists/:id', (req, res) => {
    const { id } = req.params;
    let playlists = JSON.parse(fs.readFileSync(playlistsFile, 'utf-8'));
    playlists = playlists.filter((p: any) => p.id !== id);
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

  const httpServer = createServer(app);

  return httpServer;
}
