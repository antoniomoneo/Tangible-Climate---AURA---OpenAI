import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fetch from 'node-fetch';
import { GoogleGenAI, Type } from '@google/genai';
import { questGameData } from './locales.js';

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

const ai = new GoogleGenAI({ apiKey: API_KEY });

const CALENDAR_URL = "https://calendar.google.com/calendar/ical/c_41592e57472725b685e2d4ffb20f05c12f117f9ea2a46431ea621ed686f870ff%40group.calendar.google.com/public/basic.ics";

// --- MIDDLEWARE ---
app.use(express.json());

// --- API ENDPOINTS ---

// Simple health endpoint for readiness/liveness checks required by Cloud Run
app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

// Chat endpoint (streaming)
app.post('/api/chat', async (req, res) => {
  try {
    const { history, message, context } = req.body;

    // Map client history to the format expected by the Gemini API
    const contents = (history || []).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });

    const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
            systemInstruction: context,
        },
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    for await (const chunk of stream) {
      res.write(`data: ${JSON.stringify({ type: 'chunk', payload: chunk.text })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = `data: ${JSON.stringify({ type: 'error', payload: { message: error.message || 'An unknown error occurred' } })}\n\n`;
    if (!res.headersSent) {
      res.status(500).setHeader('Content-Type', 'text/event-stream').write(errorMessage);
    } else {
      res.write(errorMessage);
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

        const response = await ai.models.generateContent({
           model: "gemini-2.5-flash",
           contents: prompt,
           config: {
             responseMimeType: "application/json",
             responseSchema: responseSchema,
           },
        });

        const jsonText = response.text.trim();
        const parsedResponse = JSON.parse(jsonText);
        res.json(parsedResponse);

    } catch (error) {
        console.error('Scenario API error:', error);
        res.status(500).json({ error: { message: 'Failed to generate AI scenario.', details: error.message } });
    }
});

app.post('/api/text-adventure', async (req, res) => {
    try {
        const { language, command, gameState } = req.body;
        const { chapterId, score, inventory } = gameState;

        const game = questGameData[language];
        const currentChapter = game.chapters.find(c => c.id === chapterId);

        if (!currentChapter) {
            return res.status(404).json({ error: 'Chapter not found' });
        }

        const choice = currentChapter.choices.find(c => c.action.toUpperCase() === command.toUpperCase());

        let responseText = '';
        const newState = { ...gameState };
        let isGameOver = null;
        let newChapterDescription = null;

        if (choice) {
            responseText = choice.result;
            if (choice.reward) {
                switch(choice.reward.type) {
                    case 'clue':
                    case 'item':
                        newState.inventory.push(choice.reward.value);
                        newState.score += 10;
                        break;
                    case 'score':
                        newState.score += choice.reward.value;
                        break;
                }
            }
            if (choice.punishment) {
                switch(choice.punishment.type) {
                    case 'score':
                        newState.score += choice.punishment.value;
                        break;
                    case 'item_loss':
                        if (newState.inventory.length > 0) {
                            const lostItem = newState.inventory.shift();
                            responseText += ` (Has perdido: ${lostItem})`;
                        }
                        break;
                    case 'trap':
                        newState.score -= 5;
                        break;
                }
            }
            if (choice.nextChapterId) {
                newState.chapterId = choice.nextChapterId;
                const nextChapter = game.chapters.find(c => c.id === newState.chapterId);
                if (nextChapter) {
                    newChapterDescription = nextChapter.description;
                }
            }
            if (choice.endsGame) {
                isGameOver = choice.endsGame;
                responseText += `\n\n${isGameOver === 'win' ? game.finale.good_ending : game.finale.bad_ending}`;
            }

        } else { // Generative response for unknown commands
            const prompt = `
              Eres el Game Master de una aventura de texto retro.
              Tema: Aventura arqueológica post-apocalíptica, misterio, tensión.
              Ubicación: Ruinas del Museo de Ciencias Naturales de Madrid.
              Idioma de respuesta: ${language === 'es' ? 'Español' : 'Inglés'}.
              
              Estado actual del jugador:
              - Escena: "${currentChapter.description}"
              - Inventario: [${inventory.join(', ')}]
              
              El jugador ha introducido un comando no estándar: "${command}"
              
              Tu tarea:
              Genera una respuesta creativa y atmosférica que encaje con el tono del juego. La respuesta debe indicar que la acción no es posible o no tiene sentido, sin romper la inmersión. Sé breve (1-2 frases). No des pistas.
            `;
            const genAIResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt
            });
            responseText = genAIResponse.text;
        }

        res.json({ responseText, newGameState: newState, newChapterDescription, isGameOver });

    } catch (error) {
        console.error('Text Adventure API error:', error);
        res.status(500).json({ error: { message: 'Failed to process game command.', details: error.message } });
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
// The original logic caused 404 errors in environments where NODE_ENV is 'production'
// but the app hasn't been built. The AI Studio environment runs from source, so we
// will always serve files from the project root (__dirname).
app.use(express.static(__dirname));

// The catch-all is needed for SPA routing, pointing to the root index.html for any
// request that doesn't match an API route or a static file.
app.get(/^\/(?!api|health).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});


// --- SERVER START ---
// Bind to 0.0.0.0 to be accessible in containerized environments like Cloud Run
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on http://0.0.0.0:${PORT}`);
});