// server.js (ESM)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 8080;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.use(express.json());

// CORS
const ORIGIN = process.env.ALLOWED_ORIGIN || "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.post("/api/chat", async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: { message: "Missing GEMINI_API_KEY environment variable." } });
  }
  const { history, message, context } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: { message: "Missing 'message' (string) in request body." } });
  }
  if (!history || !Array.isArray(history)) {
    return res.status(400).json({ error: { message: "Missing 'history' (array) in request body." } });
  }

  // --- IMMEDIATE RESPONSE PHASE ---
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  if (res.socket) {
    res.socket.setNoDelay(true);
  }
  res.flushHeaders();
  res.write(':' + ' '.repeat(2048) + '\n'); // Buffer padding

  const geminiModel = 'gemini-2.5-flash';
  const systemInstruction = context;
  const contents = history.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
  contents.push({ role: 'user', parts: [{ text: message }] });

  const debugInfo = {
    gemini_Request: {
      model: geminiModel,
      config: { systemInstruction: "..." },
      content_sent: contents,
    }
  };
  res.write(`data: ${JSON.stringify({ type: 'debug', payload: debugInfo })}\n\n`);

  // --- BACKGROUND STREAMING PHASE ---
  const streamGeminiResponse = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const stream = await ai.models.generateContentStream({
        model: geminiModel,
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
        }
      });

      for await (const chunk of stream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ type: 'chunk', payload: chunk.text })}\n\n`);
        }
      }
      res.write(`data: ${JSON.stringify({ type: 'done', payload: {} })}\n\n`);
    } catch (e) {
      console.error("Error in Gemini streaming task:", e.message);
      res.write(`data: ${JSON.stringify({ type: 'error', payload: { message: e.message } })}\n\n`);
    } finally {
      res.end();
    }
  };

  streamGeminiResponse();
});


// servir SPA
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));
app.get("/*", (req, res) => {
  try {
    res.sendFile(path.join(distPath, "index.html"));
  } catch {
    res.status(200).send("Backend OK");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API escuchando en http://0.0.0.0:${PORT}`);
});