import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Writable file location for Railway
const entriesFile = path.join('/tmp', 'entries.json');

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
    date: new Date().toISOString(),
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

// AI Suggestion
app.post('/suggest', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.json({
      success: false,
      suggestion: "Please write an entry first.",
    });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are Elara, a compassionate spiritual guide..."
        },
        {
          role: "user",
          content: `Suggest a Bible verse for:\n\n${content}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content);

    res.json({
      success: true,
      suggestion: `${result.verse} - "${result.text}"\n\n${result.message}`
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      suggestion: "Elara is taking a moment to reflect. Try again."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
