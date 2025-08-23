// server.js (RAÍZ)
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ASSISTANT_ID   = process.env.OPENAI_ASSISTANT_ID;
const API = "https://api.openai.com/v1";

app.use(express.json());

// CORS básico (ajusta ORIGIN cuando tengas dominio definitivo del frontend)
const ORIGIN = process.env.ALLOWED_ORIGIN || "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

// Utilidad de espera
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Endpoint /api/chat (Assistants v2)
app.post("/api/chat", async (req, res) => {
  try {
    if (!OPENAI_API_KEY || !ASSISTANT_ID) {
      return res.status(500).json({ error: "Faltan secretos OPENAI_API_KEY / OPENAI_ASSISTANT_ID" });
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

    // 1) Thread (solo si no nos lo pasan)
    let threadId = clientThreadId;
    if (!threadId) {
      const th = await fetch(`${API}/threads`, { method: "POST", headers, body: "{}" });
      if (!th.ok) throw new Error(await th.text());
      threadId = (await th.json()).id;
    }

    // 2) Mensaje de usuario
    const m = await fetch(`${API}/threads/${threadId}/messages`, {
      method: "POST", headers, body: JSON.stringify({ role: "user", content: message }),
    });
    if (!m.ok) throw new Error(await m.text());

    // 3) Run
    const run = await fetch(`${API}/threads/${threadId}/runs`, {
      method: "POST", headers, body: JSON.stringify({ assistant_id: ASSISTANT_ID }),
    });
    if (!run.ok) throw new Error(await run.text());
    const runData = await run.json();

    // 4) Poll hasta completar
    let finalText = null;
    for (let i = 0; i < 60; i++) {
      await sleep(1000);
      const st = await fetch(`${API}/threads/${threadId}/runs/${runData.id}`, { headers });
      if (!st.ok) throw new Error(await st.text());
      const sd = await st.json();

      if (sd.status === "completed") {
        const msgs = await fetch(`${API}/threads/${threadId}/messages`, { headers });
        if (!msgs.ok) throw new Error(await msgs.text());
        const md = await msgs.json();
        const aMsg = (md.data || []).find(x => x.role === "assistant" && x.run_id === runData.id);
        finalText = aMsg?.content?.[0]?.text?.value || "";
        break;
      }
      if (["failed","cancelled","expired"].includes(sd.status)) {
        throw new Error(`Run ${sd.status}: ${sd.last_error?.message || ""}`);
      }
    }

    if (!finalText) throw new Error("Timeout esperando respuesta del asistente.");
    return res.json({ threadId, message: finalText });
  } catch (e) {
    console.error("Error /api/chat:", e);
    return res.status(500).json({ error: "No se pudo procesar la solicitud." });
  }
});

// ---- Servir la SPA de Vite (si existe dist/) ----
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// ⚠️ Express 5: usar "/*" en lugar de "*"
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