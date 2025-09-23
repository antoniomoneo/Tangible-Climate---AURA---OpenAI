import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fetch from 'node-fetch';
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
// Prefer API_KEY (Cloud Run secret mapping in infra) but also allow GEMINI_API_KEY.
const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  // In a real production environment, you'd want more robust logging.
  // For this context, console error is sufficient.
  console.error("FATAL ERROR: API_KEY or GEMINI_API_KEY environment variable is not set.");
  // Exit gracefully if no key is found.
  process.exit(1); 
}

const genAI = new GoogleGenerativeAI(API_KEY);

const CALENDAR_URL = "https://calendar.google.com/calendar/ical/mncn.csic.es_j397r1822g1n2m81p4h1nk4c7o%40group.calendar.google.com/public/basic.ics";

// --- MIDDLEWARE ---
app.use(express.json());

// --- API ENDPOINTS ---

// Simple health endpoint for readiness/liveness checks required by Cloud Run
app.get("/healthz", (req, res) => {
  res.status(200).send("ok");
});

// Chat endpoint (streaming)
app.post('/api/chat', async (req, res) => {
  try {
    const { history, message, context } = req.body;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: context,
    });

    const chat = model.startChat({
        history: history || [],
    });

    const result = await chat.sendMessageStream(message);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    for await (const chunk of result.stream) {
      const text = chunk.text();
      res.write(`data: ${JSON.stringify({ type: 'chunk', payload: text })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = `data: ${JSON.stringify({ type: 'error', payload: { message: error.message || 'An unknown error occurred' } })}\n\n`;
    if (!res.headersSent) {
      res.status(500).setHeader('Content-Type', 'text/event-stream').write(errorMessage);
    }
    res.end();
  }
});

// Scenario generation endpoint (JSON)
app.post('/api/scenario', async (req, res) => {
    try {
        const { userInput, historicalData } = req.body;
        const lastDataPoint = historicalData[historicalData.length - 1];
        const PROJECTION_YEARS = 50;

        const prompt = `
            You are a climate science modeling expert.
            Based on the provided historical temperature anomaly data and the user's hypothesis, generate a plausible future data projection.

            Hypothesis to model: "${userInput}"

            Historical Data Summary:
            - Start Year: ${historicalData[0].year}
            - End Year: ${lastDataPoint.year}
            - Final Anomaly: ${lastDataPoint.anomaly.toFixed(2)}°C

            Your task is to:
            1.  Provide a concise, scientific explanation (2-3 sentences) for the simulated trend based on the user's hypothesis.
            2.  Generate an array of simulated data points for ${PROJECTION_YEARS} years, starting from the year after the historical data ends.
            
            The output must be a valid JSON object matching the provided schema. Do not include any text outside of the JSON structure.
        `;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const responseSchema = {
            type: "OBJECT",
            properties: {
                explanation: {
                    type: "STRING",
                    description: "A concise, scientific explanation for the simulated trend based on the user's hypothesis.",
                },
                simulatedData: {
                    type: "ARRAY",
                    description: `An array of data points for ${PROJECTION_YEARS} years, starting from ${lastDataPoint.year + 1}.`,
                    items: {
                        type: "OBJECT",
                        properties: {
                            year: { type: "INTEGER" },
                            anomaly: { type: "NUMBER" }
                        },
                        required: ["year", "anomaly"]
                    }
                }
            },
            required: ["explanation", "simulatedData"]
        };

        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            },
        });

        const jsonText = result.response.text();
        const parsedResponse = JSON.parse(jsonText);
        res.json(parsedResponse);

    } catch (error) {
        console.error('Scenario API error:', error);
        res.status(500).json({ error: { message: 'Failed to generate AI scenario.', details: error.message } });
    }
});


// Calendar proxy endpoint
app.get('/api/calendar', async (req, res) => {
    try {
        const response = await fetch(CALENDAR_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch calendar: ${response.statusText}`);
        }
        const icsData = await response.text();
        res.setHeader('Content-Type', 'text/calendar');
        res.send(icsData);
    } catch (error) {
        console.error('Calendar proxy error:', error);
        res.status(500).json({ error: { message: 'Could not retrieve calendar events.' } });
    }
});

// Text-to-Speech proxy endpoint
app.post('/api/tts', async (req, res) => {
  const { text, language } = req.body;
  if (!text || !language) {
    return res.status(400).json({ error: { message: 'Missing text or language.' } });
  }

  const ttsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;
  
  const voiceConfig = {
    'en': { languageCode: 'en-US', name: 'en-US-Wavenet-D' },
    'es': { languageCode: 'es-ES', name: 'es-ES-Wavenet-B' },
  };

  const body = {
    input: { text },
    voice: voiceConfig[language] || voiceConfig['en'],
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const ttsResponse = await fetch(ttsUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!ttsResponse.ok) {
      const errorBody = await ttsResponse.json();
      console.error('TTS API Error:', errorBody);
      throw new Error(errorBody.error.message || `TTS service failed with status ${ttsResponse.status}`);
    }

    const data = await ttsResponse.json();
    res.json({ audioContent: data.audioContent });

  } catch (error) {
    console.error('TTS proxy error:', error);
    res.status(500).json({ error: { message: error.message || 'Failed to generate speech.' } });
  }
});


// --- STATIC FILE SERVING ---
// This serves the built React app from the 'dist' folder in a production environment
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    
    // For any other request, serve the index.html file.
    // This is crucial to support client-side routing in a Single Page Application (SPA).
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
}


// --- SERVER START ---
// Bind to 0.0.0.0 to be accessible in containerized environments like Cloud Run
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on http://0.0.0.0:${PORT}`);
});
