// server.cjs
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// --- Configuración de CORS (ajusta ORIGIN a tu dominio en prod) ---
const ORIGIN = process.env.ALLOWED_ORIGIN || "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

app.use(express.json());

// --- Endpoints básicos ---
app.get("/healthz", (_req, res) => res.send("ok"));
app.get("/api/test", (_req, res) => res.json({ msg: "Backend funcionando 🎉" }));

// --- Endpoint /api/chat con OpenAI Assistants ---
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;
const API = "https://api.openai.com/v1";
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

app.post("/api/chat", async (req, res) => {
  try {
    if (!OPENAI_API_KEY || !OPENAI_ASSISTANT_ID) {
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

    // 1) Crear thread si no hay
    let threadId = clientThreadId;
    if (!threadId) {
      const th = await fetch(`${API}/threads`, { method: "POST", headers, body: "{}" });
      if (!th.ok) throw new Error(await th.text());
      threadId = (await th.json()).id;
    }

    // 2) Mensaje de usuario
    const msg = await fetch(`${API}/threads/${threadId}/messages`, {
      method: "POST", headers, body: JSON.stringify({ role: "user", content: message }),
    });
    if (!msg.ok) throw new Error(await msg.text());

    // 3) Ejecutar run
    const run = await fetch(`${API}/threads/${threadId}/runs`, {
      method: "POST", headers, body: JSON.stringify({ assistant_id: OPENAI_ASSISTANT_ID }),
    });
    if (!run.ok) throw new Error(await run.text());
    const { id: runId } = await run.json();

    // 4) Poll hasta que termine
    let finalText = null;
    for (let i = 0; i < 60; i++) {
      await sleep(1000);
      const st = await fetch(`${API}/threads/${threadId}/runs/${runId}`, { headers });
      if (!st.ok) throw new Error(await st.text());
      const sd = await st.json();
      if (sd.status === "completed") {
        const ms = await fetch(`${API}/threads/${threadId}/messages`, { headers });
        if (!ms.ok) throw new Error(await ms.text());
        const md = await ms.json();
        const aMsg = (md.data || []).find(x => x.role === "assistant" && x.run_id === runId);
        finalText = aMsg?.content?.[0]?.text?.value || "";
        break;
      }
      if (["failed","cancelled","expired"].includes(sd.status)) {
        throw new Error(`Run ${sd.status}: ${sd.last_error?.message || ""}`);
      }
    }

    if (!finalText) throw new Error("Timeout esperando respuesta del asistente.");
    res.json({ threadId, message: finalText });
  } catch (e) {
    console.error("Error /api/chat:", e);
    res.status(500).json({ error: "No se pudo procesar la solicitud." });
  }
});

// --- Servir SPA de Vite (si existe dist/) ---
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));
app.get("/*", (req, res) => {
  try {
    res.sendFile(path.join(distPath, "index.html"));
  } catch {
    res.status(200).send("Backend OK (sin dist)");
  }
});

// --- Arrancar servidor ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ API escuchando en http://0.0.0.0:${PORT}`);
});
