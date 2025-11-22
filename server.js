import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// This is using OpenAI's API - blueprint:javascript_openai
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const entriesFile = path.join(__dirname, 'entries.json');

// Ensure entries file exists
if (!fs.existsSync(entriesFile)) {
  fs.writeFileSync(entriesFile, JSON.stringify([]));
}

// GET all entries
app.get('/entries', (req, res) => {
  const entries = JSON.parse(fs.readFileSync(entriesFile));
  res.json(entries);
});

// POST new entry
app.post('/entries', (req, res) => {
  const { title, content } = req.body;
  if (!content) {
    return res.json({ success: false, message: 'Content cannot be empty' });
  }

  const entries = JSON.parse(fs.readFileSync(entriesFile));
  const newEntry = { 
    title: title || 'Untitled', 
    content, 
    date: new Date().toISOString() 
  };
  entries.push(newEntry);

  fs.writeFileSync(entriesFile, JSON.stringify(entries, null, 2));
  res.json({ success: true });
});

// DELETE entry by date
app.delete('/entries/:date', (req, res) => {
  const { date } = req.params;
  let entries = JSON.parse(fs.readFileSync(entriesFile));
  entries = entries.filter(e => e.date !== decodeURIComponent(date));
  fs.writeFileSync(entriesFile, JSON.stringify(entries, null, 2));
  res.json({ success: true });
});

// POST /suggest - Get AI-powered Bible verse suggestion
app.post('/suggest', async (req, res) => {
  const { content } = req.body;
  
  if (!content) {
    return res.json({ 
      success: false, 
      suggestion: "Please write an entry first, and Elara will suggest a verse for you." 
    });
  }

  try {
    // Using OpenAI gpt-5 model for Bible verse suggestions
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are Elara, a compassionate spiritual guide. Based on the user's journal entry, suggest ONE relevant Bible verse that speaks to their situation, feelings, or reflections. Respond with JSON in this format: { 'verse': 'Book Chapter:Verse', 'text': 'the verse text', 'message': 'a brief (1-2 sentence) encouraging message about why this verse relates to their entry' }"
        },
        {
          role: "user",
          content: `Please suggest a Bible verse for this journal entry:\n\n${content}`
        }
      ],
      response_format: { type: "json_object" },
      max_completion_tokens: 500
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    res.json({ 
      success: true, 
      suggestion: `${result.verse} - "${result.text}"\n\n${result.message}` 
    });
  } catch (error) {
    console.error('Error getting AI suggestion:', error);
    res.json({ 
      success: false, 
      suggestion: "Elara is taking a moment to reflect. Please try again." 
    });
  }
});

app.listen(PORT, () => console.log(`Faith Journal server running on http://localhost:${PORT}`));
