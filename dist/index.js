// server/index-prod.ts
import fs2 from "node:fs";
import path2 from "node:path";
import express2 from "express";

// server/app.ts
import express from "express";

// server/routes.ts
import { createServer } from "http";
import Groq from "groq-sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});
async function callHFModel(prompt) {
  try {
    const message = await groq.chat.completions.create({
      messages: [
        { role: "user", content: prompt }
      ],
      model: "llama-3.1-70b-versatile",
      temperature: 0.7,
      max_tokens: 500
    });
    const text = message.choices[0]?.message?.content || "";
    if (!text || text.trim() === "") {
      throw new Error("Empty response from Groq");
    }
    return text.trim();
  } catch (error) {
    console.error("Groq error:", error.message);
    throw error;
  }
}
var entriesFile = path.join(__dirname, "..", "entries.json");
var devotionsFile = path.join(__dirname, "..", "devotions.json");
var playlistsFile = path.join(__dirname, "..", "playlists.json");
if (!fs.existsSync(entriesFile)) {
  fs.writeFileSync(entriesFile, JSON.stringify([]));
}
if (!fs.existsSync(playlistsFile)) {
  fs.writeFileSync(playlistsFile, JSON.stringify([]));
}
if (!fs.existsSync(devotionsFile)) {
  const sampleDevotions = [
    {
      id: 1,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      title: "Finding Peace in Chaos",
      verse: "Philippians 4:6-7",
      content: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
      reflection: "In times of uncertainty, we are reminded that God offers us peace beyond our understanding. When we bring our worries to Him with gratitude, we find strength and clarity."
    }
  ];
  fs.writeFileSync(devotionsFile, JSON.stringify(sampleDevotions, null, 2));
}
async function registerRoutes(app2) {
  app2.get("/api/entries", (req, res) => {
    const userId = req.session?.userId || req.ip || "anonymous";
    const entries = JSON.parse(fs.readFileSync(entriesFile, "utf-8"));
    const userEntries = entries.filter((e) => e.userId === userId);
    res.json(userEntries);
  });
  app2.post("/api/entries", async (req, res) => {
    const userId = req.session?.userId || req.ip || "anonymous";
    const { title, content } = req.body;
    if (!content) {
      return res.json({ success: false, message: "Content cannot be empty" });
    }
    const entries = JSON.parse(fs.readFileSync(entriesFile, "utf-8"));
    const userEntries = entries.filter((e) => e.userId === userId);
    const recentSuggestions = userEntries.slice(-5).map((e) => {
      if (e.suggestion) {
        const match = e.suggestion.match(/(\w+\s\d+:\d+)/);
        return match ? match[1] : "";
      }
      return "";
    }).filter((s) => s);
    let suggestion = "";
    try {
      const versePrompt = `You are a spiritual advisor. Based on this journal entry, recommend ONE Bible verse from the King James Version that provides relevant guidance, comfort, or reflection. 

Journal entry: "${content.substring(0, 150)}"

Provide in this exact format:
VERSE: [Book Chapter:Verse]
TEXT: [The actual verse text from KJV]
MEANING: [2-3 sentences explaining how this verse applies to what they wrote]

Be specific, meaningful, and thoughtful.`;
      const aiResponse = await callHFModel(versePrompt);
      if (aiResponse && aiResponse.trim()) {
        suggestion = aiResponse.substring(0, 600).trim();
      }
    } catch (error) {
      console.error("Verse suggestion error:", error);
    }
    const newEntry = {
      title: title || "Untitled",
      content,
      date: (/* @__PURE__ */ new Date()).toISOString(),
      userId,
      suggestion
    };
    entries.push(newEntry);
    fs.writeFileSync(entriesFile, JSON.stringify(entries, null, 2));
    res.json({ success: true, entry: newEntry, suggestion });
  });
  app2.delete("/api/entries/:date", (req, res) => {
    const userId = req.session?.userId || req.ip || "anonymous";
    const { date } = req.params;
    let entries = JSON.parse(fs.readFileSync(entriesFile, "utf-8"));
    entries = entries.filter((e) => !(e.date === decodeURIComponent(date) && e.userId === userId));
    fs.writeFileSync(entriesFile, JSON.stringify(entries, null, 2));
    res.json({ success: true });
  });
  app2.get("/api/devotions", (req, res) => {
    const devotions = JSON.parse(fs.readFileSync(devotionsFile, "utf-8"));
    res.json(devotions);
  });
  app2.get("/api/devotions/today", (req, res) => {
    const devotions = JSON.parse(fs.readFileSync(devotionsFile, "utf-8"));
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const todayDevtion = devotions.find((d) => d.date === today);
    if (todayDevtion) {
      res.json(todayDevtion);
    } else {
      res.json(devotions[devotions.length - 1]);
    }
  });
  app2.get("/api/bible-verses", (req, res) => {
    try {
      const { book, chapter } = req.query;
      if (!book || !chapter) {
        return res.status(400).json({ error: "Book and chapter required" });
      }
      const kjvData = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "public", "kjv.json"), "utf-8"));
      const bookStr = String(book);
      const chapterNum = parseInt(String(chapter));
      const bookData = kjvData.books.find((b) => b.name === bookStr);
      if (!bookData) {
        return res.json({ verses: [] });
      }
      const chapterData = bookData.chapters.find((c) => c.chapter === chapterNum);
      if (!chapterData) {
        return res.json({ verses: [] });
      }
      const versesArray = chapterData.verses.map((v) => ({
        verse: v.verse,
        text: v.text
      }));
      res.json({ verses: versesArray });
    } catch (error) {
      console.error("Bible error:", error);
      res.json({ verses: [] });
    }
  });
  app2.get("/api/playlists", (req, res) => {
    const playlists = JSON.parse(fs.readFileSync(playlistsFile, "utf-8"));
    res.json(playlists);
  });
  app2.delete("/api/playlists/:id", (req, res) => {
    const { id } = req.params;
    let playlists = JSON.parse(fs.readFileSync(playlistsFile, "utf-8"));
    playlists = playlists.filter((p) => p.id !== id);
    fs.writeFileSync(playlistsFile, JSON.stringify(playlists, null, 2));
    res.json({ success: true });
  });
  app2.post("/api/devotions", (req, res) => {
    const { title, verse, content, reflection, date } = req.body;
    if (!title || !content) {
      return res.json({ success: false, message: "Title and content are required" });
    }
    const devotions = JSON.parse(fs.readFileSync(devotionsFile, "utf-8"));
    const maxId = Math.max(...devotions.map((d) => d.id || 0), 0);
    const newDevtion = {
      id: maxId + 1,
      date: date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      title,
      verse: verse || "No verse specified",
      content,
      reflection: reflection || ""
    };
    devotions.push(newDevtion);
    fs.writeFileSync(devotionsFile, JSON.stringify(devotions, null, 2));
    res.json({ success: true, devotion: newDevtion });
  });
  app2.post("/api/chat", async (req, res) => {
    try {
      const { message, userName } = req.body;
      if (!message) {
        return res.json({ success: false, error: "Message is required", reply: null });
      }
      const systemPrompt = `You are Elara, a warm spiritual companion for a Christian faith journal. The user's name is ${userName || "Friend"}. 
Respond warmly with biblical wisdom and encouragement. Keep it short (2-3 sentences). Be supportive and compassionate.
User: "${message}"`;
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
      const fallbackReplies = [
        "I'm here to listen and support you on your faith journey. What's on your heart today?",
        "Thank you for sharing. God is with you in this moment. How can I help deepen your reflection?",
        "I'm listening with compassion. Please tell me more about what you're experiencing."
      ];
      const fallbackReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
      res.json({ success: true, reply: fallbackReply });
    } catch (error) {
      console.error("Chat error:", error.message || error);
      res.json({
        success: false,
        error: "A temporary issue occurred. Please try again.",
        reply: "I'm here to listen and support you on your faith journey."
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/app.ts
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
var app = express();
app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
async function runApp(setup) {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  await setup(app, server);
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
}

// server/index-prod.ts
async function serveStatic(app2, _server) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}
(async () => {
  await runApp(serveStatic);
})();
export {
  serveStatic
};
