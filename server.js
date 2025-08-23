// server.js (RAÍZ)
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID   = process.env.OPENAI_ASSISTANT_ID;
const API = "https://api.openai.com/v1";

app.use(express.json());

// CORS simple (ajusta ORIGIN a tu dominio cuando lo tengas)
const ORIGIN = process.env.ALLOWED_ORIGIN || "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

app.post("/api/chat", async (req, res) => {
  try {
    if (!OPENAI_API_KEY || !ASSISTANT_ID) {
      return res.status(500).json({ error: "Faltan secretos OPENAI_API_KEY o OPENAI_ASSISTANT_ID" });
    }
    const { message, threadId: clientThreadId } = req.body || {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Falta 'message' (string)" });
    }

    const headers = {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "OpenAI-Beta": "assistants=v2",
      "Content-Type": "application/json",
    };

    // 1) thread (si no viene uno)
    let threadId = clientThreadId;
    if (!threadId) {
      const th = await fetch(`${API}/threads`, { method: "POST", headers, body: "{}" });
      if (!th.ok) throw new Error(await th.text());
      const thData = await th.json();
      threadId = thData.id;
    }

    // 2) message
    const msg = await fetch(`${API}/threads/${threadId}/messages`, {
      method: "POST", headers, body: JSON.stringify({ role: "user", content: message }),
    });
    if (!msg.ok) throw new Error(await msg.text());

    // 3) run
    const run = await fetch(`${API}/threads/${threadId}/runs`, {
      method: "POST", headers, body: JSON.stringify({ assistant_id: ASSISTANT_ID }),
    });
    if (!run.ok) throw new Error(await run.text());
    const runData = await run.json();

    // 4) poll
    let finalText = null;
    for (let i = 0; i < 60; i++) {
      await sleep(1000);
      const r = await fetch(`${API}/threads/${threadId}/runs/${runData.id}`, { headers });
      if (!r.ok) throw new Error(await r.text());
      const rData = await r.json();
      if (rData.status === "completed") {
        const ms = await fetch(`${API}/threads/${threadId}/messages`, { headers });
        if (!ms.ok) throw new Error(await ms.text());
        const msData = await ms.json();
        const assistantMsg = (msData.data || []).find(m => m.role === "assistant" && m.run_id === runData.id);
        finalText = assistantMsg?.content?.[0]?.text?.value || "";
        break;
      }
      if (["failed","cancelled","expired"].includes(rData.status)) {
        throw new Error(`Run ${rData.status}: ${rData.last_error?.message || ""}`);
      }
    }
    if (!finalText) throw new Error("Timeout esperando respuesta del asistente.");

    res.json({ threadId, message: finalText });
  } catch (e) {
    console.error("Error /api/chat:", e);
    res.status(500).json({ error: "No se pudo procesar la solicitud." });
  }
});

// servir la SPA de Vite si existe /dist
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  try {
    res.sendFile(path.join(distPath, "index.html"));
  } catch {
    res.status(200).send("Backend OK");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API escuchando en http://0.0.0.0:${PORT}`);
});