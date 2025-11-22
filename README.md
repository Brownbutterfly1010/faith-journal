# Faith Journal with Elara 🕊️

Your sacred space for reflection and divine guidance, now powered by AI.

## Features

✨ **Beautiful Purple-Themed Design** - Elegant spiritual aesthetic with Playfair Display typography
📝 **Journal Entries** - Write and save your daily reflections with titles
🤖 **AI-Powered Bible Verse Suggestions** - Elara analyzes your entries and suggests relevant Bible verses
📖 **Entry Management** - View all your entries (newest first) and delete when needed
💜 **Responsive Design** - Works beautifully on mobile and desktop

## How to Use

### Running the App

```bash
node server.js
```

Then open your browser to `http://localhost:3000`

### Features Guide

1. **Writing Entries**
   - Type your thoughts in the textarea
   - Add an optional title (defaults to "Untitled")
   - Click "Save Entry" to save your journal entry

2. **Ask Elara for Guidance**
   - Write your entry first
   - Click "Ask Elara 🕊️" button
   - Elara will analyze your writing and suggest a relevant Bible verse
   - The suggestion appears in a beautiful purple gradient box

3. **Managing Entries**
   - All saved entries appear below (newest first)
   - Click the 🗑️ Delete button to remove an entry
   - Entries are saved to `entries.json` file

## Tech Stack

- **Frontend**: Vanilla JavaScript, Custom CSS
- **Backend**: Express.js (Node.js)
- **AI**: OpenAI GPT-5 for Bible verse suggestions
- **Storage**: File-based JSON storage

## Environment Variables

- `OPENAI_API_KEY` - Required for AI-powered Bible verse suggestions

## Files

- `server.js` - Express backend with AI integration
- `public/index.html` - Complete frontend (HTML + CSS + JavaScript all in one file)
- `entries.json` - Your journal entries storage (auto-created)

## Design

The app features a beautiful purple spiritual theme:
- Primary Purple: `#7a1fc3`
- Purple Dark: `#61219a`
- Elegant Playfair Display font for headings
- Clean Inter font for body text
- Gradient overlays and soft shadows
- Fixed bottom navigation with blur effect

## How Elara Works

Elara uses OpenAI's GPT-5 model to:
1. Analyze the themes and emotions in your journal entry
2. Search through biblical wisdom to find a relevant verse
3. Provide the verse reference, text, and a brief encouraging message explaining the connection

May your faith journey be blessed! 🙏✨
