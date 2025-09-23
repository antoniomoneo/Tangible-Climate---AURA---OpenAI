import express from 'express';
import path from 'path';
import url from 'url';
import fetch from 'node-fetch'; // For TTS API
import { GoogleGenerativeAI } from '@google/generative-ai';

// --- SETUP ---
const app = express();
app.use(express.json());

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- GEMINI SETUP ---
// Prefer API_KEY (Cloud Run secret mapping in infra) but also allow GEMINI_API_KEY.
const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

// Check for API key at startup
if (!API_KEY) {
  throw new Error("API_KEY or GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// --- API ENDPOINTS ---

// Simple health endpoint for readiness/liveness checks
app.get("/healthz", (req, res) => {
  res.status(200).send("ok");
});

// 1. CHAT API
app.post('/api/chat', async (req, res) => {
  try {
    const { history, message, context } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', systemInstruction: context });

    // Map frontend roles to Gemini roles
    const geminiHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const contents = [...geminiHistory, { role: 'user', parts: [{ text: message }] }];

    const result = await model.generateContentStream({ contents });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data: ${JSON.stringify({ type: 'chunk', payload: text })}\n\n`);
      }
    }
    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error.message || 'An unexpected error occurred.';
    // Ensure headers are set before writing for streaming error
    if (!res.headersSent) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
    }
    res.write(`data: ${JSON.stringify({ type: 'error', payload: { message: errorMessage } })}\n\n`);
    res.end();
  }
});

// 2. CALENDAR API
app.get('/api/calendar', async (req, res) => {
    // In a real application, you would fetch this from a live URL.
    // For this demo, we provide a static, valid iCal file content.
    const MNCN_CALENDAR_URL = 'https://calendar.google.com/calendar/ical/example%40group.calendar.google.com/public/basic.ics';
    
    // Mock iCal data
    const now = new Date();
    const futureEventDate = new Date(now.setDate(now.getDate() + 14));
    const year = futureEventDate.getUTCFullYear();
    const month = (futureEventDate.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = futureEventDate.getUTCDate().toString().padStart(2, '0');
    
    const mockIcsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Tangible Climate App//NONSGML v1.0//EN
BEGIN:VEVENT
UID:1@tangibleclimate.app
DTSTAMP:${year}${month}${day}T000000Z
DTSTART;VALUE=DATE:${year}${month}${day}
DTEND;VALUE=DATE:${year}${month}${(parseInt(day) + 1).toString().padStart(2, '0')}
SUMMARY:Special Exhibition: Climate Art of the Anthropocene
DESCRIPTION:Explore new artworks that interpret the latest climate data.
LOCATION:Museo Nacional de Ciencias Naturales, Madrid
END:VEVENT
END:VCALENDAR`;

    try {
        // In a real scenario, you'd fetch the URL:
        // const response = await fetch(MNCN_CALENDAR_URL);
        // if (!response.ok) throw new Error('Failed to fetch calendar data');
        // const icsData = await response.text();
        res.setHeader('Content-Type', 'text/calendar');
        res.send(mockIcsData);

    } catch (error) {
        console.error('Calendar API error:', error);
        res.status(500).json({ error: { message: 'Failed to retrieve calendar data.' } });
    }
});

// 3. SCENARIO LAB API
app.post('/api/scenario', async (req, res) => {
    try {
        const { userInput, historicalData } = req.body;
        const lastYear = historicalData[historicalData.length - 1].year;
        const prompt = `
            You are a climate data scientist. Your task is to generate a plausible future climate scenario based on a user's request.
            Analyze the provided historical temperature anomaly data (from 1880 to ${lastYear}) and the user's "what if" scenario.
            
            User's scenario: "${userInput}"

            Based on this, generate:
            1.  An array of 30 future data points, starting from the year ${lastYear + 1}. Each point must have a "year" and an "anomaly" (number). The anomaly should follow a scientifically plausible trend based on the user's request.
            2.  A brief, one-paragraph "explanation" (string) describing the scientific logic behind your generated data trend.

            Historical Data context (first 5 and last 5 points):
            ${JSON.stringify(historicalData.slice(0, 5), null, 2)}
            ...
            ${JSON.stringify(historicalData.slice(-5), null, 2)}

            You MUST return a single, valid JSON object matching the specified schema.
        `;

        const responseSchema = {
            type: "object",
            properties: {
                simulatedData: {
                    type: "array",
                    description: "An array of 30 future data points.",
                    items: {
                        type: "object",
                        properties: {
                            year: { type: "integer" },
                            anomaly: { type: "number" }
                        },
                        required: ["year", "anomaly"],
                    }
                },
                explanation: {
                    type: "string",
                    description: "A brief paragraph explaining the logic for the simulation."
                }
            },
            required: ["simulatedData", "explanation"]
        };
        
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const response = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
          }
        });
        
        const jsonText = response.response.text();
        const data = JSON.parse(jsonText);
        res.json(data);

    } catch (error) {
        console.error('Scenario API error:', error);
        res.status(500).json({ error: { message: 'Failed to generate AI scenario.' } });
    }
});


// 4. TEXT-TO-SPEECH API
app.post('/api/tts', async (req, res) => {
    try {
        const { text, language } = req.body;
        
        const GOOGLE_TTS_API_URL = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;
        
        const voiceConfig = language === 'es' 
            ? { languageCode: 'es-ES', name: 'es-ES-Wavenet-B' }
            : { languageCode: 'en-US', name: 'en-US-Wavenet-D' };

        const requestBody = {
            input: { text },
            voice: voiceConfig,
            audioConfig: { audioEncoding: 'MP3' },
        };
        
        const ttsResponse = await fetch(GOOGLE_TTS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!ttsResponse.ok) {
            const errorBody = await ttsResponse.json();
            console.error('Google TTS API Error:', errorBody);
            throw new Error(errorBody.error?.message || 'TTS service failed.');
        }

        const data = await ttsResponse.json();
        res.json({ audioContent: data.audioContent });

    } catch (error) {
        console.error('TTS API error:', error);
        res.status(500).json({ error: { message: 'Failed to synthesize speech.' } });
    }
});

// --- STATIC FILE SERVING ---
// This serves the built React app from the 'dist' folder in a production environment.
// The 'vite' dev server handles this during development.
app.use(express.static(path.join(__dirname, 'dist')));

// For any other request, serve the index.html file.
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'dist', 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});

// --- SERVER START ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});