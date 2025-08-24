// server.js (ESM)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;
const API = "https://api.openai.com/v1";

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

const handleOpenAIError = async (response) => {
    const errorText = await response.text();
    console.error(`OpenAI API Error (${response.status}): ${errorText}`);
    let errorMessage = `OpenAI API Error: ${response.status}`;
    try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
            errorMessage = errorJson.error.message;
        }
    } catch (e) {
        errorMessage = errorText;
    }
    return new Error(errorMessage);
};

app.post("/api/chat", async (req, res) => {
  if (!OPENAI_API_KEY || !OPENAI_ASSISTANT_ID) {
    return res.status(500).json({ error: { message: "Faltan secretos OPENAI_API_KEY / OPENAI_ASSISTANT_ID" } });
  }
  const { message, threadId: clientThreadId, context } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: { message: "Falta 'message' (string)" } });
  }

  const headers = {
    "Authorization": `Bearer ${OPENAI_API_KEY}`,
    "OpenAI-Beta": "assistants=v2",
    "Content-Type": "application/json",
  };

  try {
    let threadId = clientThreadId;
    if (!threadId) {
      const th = await fetch(`${API}/threads`, { method: "POST", headers, body: "{}" });
      if (!th.ok) throw await handleOpenAIError(th);
      threadId = (await th.json()).id;
    }

    const m = await fetch(`${API}/threads/${threadId}/messages`, {
      method: "POST", headers, body: JSON.stringify({ role: "user", content: `${context}\n\nUser: ${message}` }),
    });
    if (!m.ok) throw await handleOpenAIError(m);

    // Set headers for streaming
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    
    const runResponse = await fetch(`${API}/threads/${threadId}/runs`, {
        method: "POST",
        headers,
        body: JSON.stringify({ assistant_id: OPENAI_ASSISTANT_ID, stream: true }),
    });

    if (!runResponse.ok || !runResponse.body) {
        throw await handleOpenAIError(runResponse);
    }
    
    // Pipe the stream from OpenAI and process it
    const reader = runResponse.body;
    const decoder = new TextDecoder();
    let buffer = '';

    for await (const chunk of reader) {
        buffer += decoder.decode(chunk, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || ''; // Keep potential partial event

        for (const event of events) {
            if (event.trim() === '' || !event.startsWith('event:')) continue;
            
            const eventTypeLine = event.split('\n')[0];
            const dataLine = event.split('\n')[1];

            if (eventTypeLine === 'event: thread.message.delta' && dataLine && dataLine.startsWith('data: ')) {
                const jsonData = dataLine.substring(6);
                try {
                    const parsed = JSON.parse(jsonData);
                    const textChunk = parsed.delta?.content?.[0]?.text?.value;
                    if (textChunk) {
                        res.write(JSON.stringify({ type: 'chunk', payload: textChunk }) + '\n\n');
                    }
                } catch (e) {
                    console.error('Error parsing OpenAI stream data:', jsonData);
                }
            }
        }
    }
    
    res.write(JSON.stringify({ type: 'done', payload: { threadId } }) + '\n\n');
    res.end();

  } catch (e) {
    console.error("Error /api/chat:", e.message);
    // If headers are not sent, send a proper error response
    if (!res.headersSent) {
      res.status(500).json({ error: { message: e.message || "No se pudo procesar la solicitud." } });
    } else {
      // If stream has started, send an error chunk
      res.write(JSON.stringify({ type: 'error', payload: { message: e.message } }) + '\n\n');
      res.end();
    }
  }
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
  console.log(`API escuchando en http://0.-0.0.0:${PORT}`);
});