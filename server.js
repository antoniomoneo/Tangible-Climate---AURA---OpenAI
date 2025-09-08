// server.js (ESM)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

const API_KEY = process.env.GEMINI_API_KEY;

app.use(express.json());

// CORS
const ORIGIN = process.env.ALLOWED_ORIGIN || "*";
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/api/calendar", async (req, res) => {
  const calendarId = 'c_41592e57472725b685e2d4ffb20f05c12f117f9ea2a46431ea621ed686f870ff@group.calendar.google.com';
  const calendarUrl = `https://calendar.google.com/calendar/ical/${calendarId}/public/basic.ics`;

  try {
    const response = await fetch(calendarUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch calendar data from Google: ${response.statusText}`);
    }
    const icsData = await response.text();
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.send(icsData);
  } catch (error) {
    console.error("Error fetching calendar:", error.message);
    res.status(500).json({ error: { message: "Could not retrieve calendar events from the server." } });
  }
});

app.post("/api/tts", async (req, res) => {
  if (!API_KEY) {
    return res.status(500).json({ error: { message: "Missing Google Cloud API key on the server." } });
  }

  const { text, language } = req.body;
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: { message: "Request body must contain 'text' (string)." } });
  }
  if (!language || (language !== 'en' && language !== 'es')) {
    return res.status(400).json({ error: { message: "Request body must contain 'language' ('en' or 'es')." } });
  }

  const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;
  
  const voiceConfig = language === 'en' 
    ? { languageCode: 'en-GB', name: 'en-GB-Wavenet-D' } // Mature, male, narrative voice (similar to David Attenborough)
    : { languageCode: 'es-ES', name: 'es-ES-Wavenet-B' }; // High-quality male Spanish voice

  const requestBody = {
    input: { text },
    voice: voiceConfig,
    audioConfig: { audioEncoding: 'MP3' }
  };

  try {
    const ttsResponse = await fetch(ttsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!ttsResponse.ok) {
      const errorData = await ttsResponse.json();
      console.error("Google TTS API Error:", errorData);
      throw new Error(errorData.error.message || `TTS API request failed with status ${ttsResponse.status}`);
    }

    const data = await ttsResponse.json();
    res.status(200).json(data);

  } catch (error) {
    console.error('Error contacting Google TTS API:', error.message);
    res.status(500).json({ error: { message: 'Failed to synthesize speech.' } });
  }
});


app.post("/api/chat", async (req, res) => {
  if (!API_KEY) {
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
      const ai = new GoogleGenAI({ apiKey: API_KEY });
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

app.post("/api/scenario", async (req, res) => {
    if (!API_KEY) {
        return res.status(500).json({ error: { message: "Missing GEMINI_API_KEY environment variable." } });
    }
    const { userInput, historicalData } = req.body;
    if (!userInput || typeof userInput !== "string" || !historicalData || !Array.isArray(historicalData)) {
        return res.status(400).json({ error: { message: "Request body must contain 'userInput' (string) and 'historicalData' (array)." } });
    }

    const lastDataPoint = historicalData[historicalData.length - 1];
    const PROJECTION_YEARS = 50;

    const prompt = `
You are a climate science simulation expert. Your task is to generate a plausible future climate scenario based on historical data and a user's hypothesis.

**Historical Data Summary:**
The provided data shows global temperature anomalies from 1880 to ${lastDataPoint.year}.
The last recorded anomaly in ${lastDataPoint.year} was ${lastDataPoint.anomaly.toFixed(2)}°C.
The overall trend shows significant warming, especially since the 1970s.

**User's Hypothesis:**
"${userInput}"

**Your Task:**
1.  **Analyze the Hypothesis:** Interpret the user's scenario and its potential impact on global temperature trends.
2.  **Project a New Trend:** Based on your analysis, project the annual temperature anomaly for the next ${PROJECTION_YEARS} years, starting from ${lastDataPoint.year + 1}. The projection should be a scientifically plausible continuation based on the user's premise.
3.  **Provide a Rationale:** Write a concise explanation for your simulation. Justify the trend you've created by linking it to the user's hypothesis and established climate science principles (e.g., effects on GHG emissions, albedo, carbon cycle, etc.).

**Output Format:**
You MUST provide your response as a single, valid JSON object that adheres to the provided schema.
`;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            explanation: {
                type: Type.STRING,
                description: "A concise, scientific explanation for the simulated trend based on the user's hypothesis.",
            },
            simulatedData: {
                type: Type.ARRAY,
                description: `An array of data points for ${PROJECTION_YEARS} years, starting from ${lastDataPoint.year + 1}.`,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        year: { type: Type.INTEGER },
                        anomaly: { type: Type.NUMBER }
                    },
                    required: ["year", "anomaly"]
                }
            }
        },
        required: ["explanation", "simulatedData"]
    };

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });
        
        const jsonText = response.text.trim();
        // Validate if the response is JSON before parsing
        if (jsonText.startsWith('{') && jsonText.endsWith('}')) {
             const jsonResponse = JSON.parse(jsonText);
             res.json(jsonResponse);
        } else {
            throw new Error("AI returned a non-JSON response.");
        }
    } catch (e) {
        console.error("Error in Gemini scenario generation:", e.message);
        res.status(500).json({ error: { message: `AI scenario generation failed: ${e.message}` } });
    }
});


// servir SPA
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// ✅ Catch-all SOLO para rutas que NO empiezan por /api
app.get(/^\/(?!api).*/, (req, res) => {
  try {
    res.sendFile(path.join(distPath, "index.html"));
  } catch {
    res.status(200).send("Backend OK");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API escuchando en http://0.0.0.0:${PORT}`);
});
