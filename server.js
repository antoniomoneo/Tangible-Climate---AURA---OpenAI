import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fetch from 'node-fetch';
import { GoogleGenAI, Type } from '@google/genai';

// Inlining game data to resolve module loading issues in production environment.
const questGameData = {
  es: {
    title: "Tangible Climate Quest",
    intro: "Estás en las ruinas polvorientas del antiguo Museo de Ciencias Naturales en Madrid. El aire es espeso. Tu misión: explorar las ruinas, descifrar los huesos del 'Esqueleto del Clima' y descubrir cómo los datos perdidos podían haber cambiado el destino de la humanidad.",
    finale: {
      good_ending: "Reconstruiste la historia climática y redactaste un diagnóstico: 'Hubiéramos cambiado el destino si hubiéramos confiado en los datos'. Has completado la misión y honrado la memoria de los que intentaron advertir al mundo.",
      bad_ending: "Abandonas las ruinas con información incompleta, condenado a repetir los errores del pasado. La historia sigue sin contarse."
    },
    chapters: [
      {
        id: 1,
        name: "El inicio – El hallazgo",
        description: "Dos investigadores entran en las ruinas polvorientas del Museo. El aire es espeso. Encuentran fragmentos de huesos y un extraño símbolo tallado en la piedra.",
        choices: [
          {
            action: "EXAMINAR SIMBOLO",
            result: "Descubres que es un registro de las primeras mediciones de temperatura. ¡Has encontrado una pista clave!",
            reward: { type: 'clue', value: 'Registro de temperatura antiguo' },
            nextChapterId: 2,
          },
          {
            action: "IGNORAR SIMBOLO",
            result: "Mientras avanzas, un techo se derrumba ligeramente, bloqueando el camino por el que viniste. Pierdes tiempo y energía.",
            punishment: { type: 'score', value: -5 },
          }
        ]
      },
      {
        id: 2,
        name: "Sombras de la guerra",
        description: "Encuentras un búnker oculto con restos de la Segunda Guerra Mundial. Dentro, hay mapas, armas oxidadas y un diario con gráficos de emisiones.",
        choices: [
          {
            action: "LEER DIARIO",
            result: "El diario detalla cómo la contaminación industrial de la guerra enmascaró temporalmente el calentamiento. Comprendes una parte crucial de la historia.",
            reward: { type: 'clue', value: 'Efecto de los aerosoles de guerra' },
            nextChapterId: 3,
          },
          {
            action: "TOCAR ARMAS",
            result: "Al tocar un rifle oxidado, activas una trampa antigua. Una reja cae, cerrando la salida del búnker. Te llevará un tiempo encontrar una forma de abrirla.",
            punishment: { type: 'trap', value: 'Atrapado en el búnker' },
          }
        ]
      },
      {
        id: 3,
        name: "La era del ascenso",
        description: "En una cámara sellada encuentras gráficas talladas en piedra que muestran el ascenso de las temperaturas desde los años 60. Hay un pedestal con una balanza rota.",
        choices: [
          {
            action: "COLOCAR HUESO EN BALANZA",
            result: "Colocas uno de los fragmentos de hueso en el plato de la balanza. Se equilibra y un compartimento secreto se abre, revelando un disco de datos.",
            reward: { type: 'clue', value: 'Disco de datos de la "Gran Aceleración"' },
            nextChapterId: 4,
          },
          {
            action: "ROMPER BALANZA",
            result: "Frustrado, golpeas la balanza. Se hace añicos y el suelo tiembla. El polvo que cae del techo te hace perder de vista uno de tus objetos.",
            punishment: { type: 'item_loss', value: 'first' },
          }
        ]
      },
      {
        id: 4,
        name: "La vértebra vacía",
        description: "Llegas al final del esqueleto: la última vértebra está hueca. Representa el presente (2024) y el vacío de decisiones humanas. Es el momento de actuar.",
        choices: [
          {
            action: "INSERTAR PISTAS EN VERTEBRA",
            result: "Colocas los registros y el disco de datos dentro de la vértebra hueca. El esqueleto se ilumina, proyectando el diagnóstico final en la pared.",
            endsGame: 'win',
          },
          {
            action: "SALIR SIN COMPLETAR",
            result: "Decides que es demasiado arriesgado y abandonas las ruinas. El misterio del esqueleto quedará sin resolver.",
            endsGame: 'lose',
          }
        ]
      }
    ],
  },
  en: {
    title: "Tangible Climate Quest",
    intro: "You are in the dusty ruins of the former Museum of Natural Sciences in Madrid. The air is thick. Your mission: explore the ruins, decipher the bones of the 'Climate Skeleton', and discover how lost data could have changed humanity's destiny.",
    finale: {
      good_ending: "You have reconstructed the climate history and written a diagnosis: 'We could have changed our destiny if we had trusted the data.' You have completed the mission and honored the memory of those who tried to warn the world.",
      bad_ending: "You leave the ruins with incomplete information, condemned to repeat the mistakes of the past. The story remains untold."
    },
    chapters: [
      {
        id: 1,
        name: "The Beginning – The Find",
        description: "Two researchers enter the dusty ruins of the Museum. The air is thick. They find bone fragments and a strange symbol carved in stone.",
        choices: [
          {
            action: "EXAMINE SYMBOL",
            result: "You discover it's a record of early temperature measurements. You've found a key clue!",
            reward: { type: 'clue', value: 'Ancient Temperature Record' },
            nextChapterId: 2,
          },
          {
            action: "IGNORE SYMBOL",
            result: "As you move on, a ceiling partially collapses, blocking the way you came. You lose time and energy.",
            punishment: { type: 'score', value: -5 },
          }
        ]
      },
      {
        id: 2,
        name: "Shadows of War",
        description: "You find a hidden bunker with remnants from World War II. Inside, there are maps, rusty weapons, and a diary with emission graphs.",
        choices: [
          {
            action: "READ DIARY",
            result: "The diary details how industrial pollution from the war temporarily masked warming. You understand a crucial part of the story.",
            reward: { type: 'clue', value: 'Effect of War Aerosols' },
            nextChapterId: 3,
          },
          {
            action: "TOUCH WEAPONS",
            result: "Touching a rusty rifle triggers an old trap. A grate falls, sealing the bunker exit. It will take you some time to find a way to open it.",
            punishment: { type: 'trap', value: 'Trapped in the bunker' },
          }
        ]
      },
      {
        id: 3,
        name: "The Age of Ascent",
        description: "In a sealed chamber, you find graphs carved in stone showing the rise in temperatures since the 60s. There is a pedestal with a broken scale.",
        choices: [
          {
            action: "PLACE BONE ON SCALE",
            result: "You place one of the bone fragments on the scale's plate. It balances, and a secret compartment opens, revealing a data disk.",
            reward: { type: 'clue', value: 'Data Disk of the "Great Acceleration"' },
            nextChapterId: 4,
          },
          {
            action: "BREAK SCALE",
            result: "Frustrated, you strike the scale. It shatters, and the floor trembles. The dust falling from the ceiling makes you lose track of one of your items.",
            punishment: { type: 'item_loss', value: 'first' },
          }
        ]
      },
      {
        id: 4,
        name: "The Empty Vertebra",
        description: "You reach the end of the skeleton: the last vertebra is hollow. It represents the present (2024) and the void of human decisions. It's time to act.",
        choices: [
          {
            action: "INSERT CLUES INTO VERTEBRA",
            result: "You place the records and the data disk inside the hollow vertebra. The skeleton lights up, projecting the final diagnosis on the wall.",
            endsGame: 'win',
          },
          {
            action: "LEAVE WITHOUT COMPLETING",
            result: "You decide it's too risky and leave the ruins. The skeleton's mystery will remain unsolved.",
            endsGame: 'lose',
          }
        ]
      }
    ],
  }
};

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
  if (!API_KEY) {
    // This check is redundant due to the global check, but added per patch logic
    return res.status(500).json({ error: { message: "Missing API_KEY environment variable." } });
  }

  // Set headers for streaming immediately
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    const { history, message, context } = req.body;

    // Map client history to the format expected by the Gemini API
    const contents = (history || []).map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
    }));
    contents.push({ role: 'user', parts: [{ text: message }] });
    
    const geminiModel = 'gemini-2.5-flash';
    const debugInfo = {
       gemini_Request: {
         model: geminiModel,
         config: { systemInstruction: "..." }, // Abridged for debug log
         content_sent: contents,
       }
    };
    res.write(`data: ${JSON.stringify({ type: 'debug', payload: debugInfo })}\n\n`);

    const stream = await ai.models.generateContentStream({
        model: geminiModel,
        contents: contents,
        config: {
            systemInstruction: context,
        },
    });

    for await (const chunk of stream) {
      if (chunk.text) {
        res.write(`data: ${JSON.stringify({ type: 'chunk', payload: chunk.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);

  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = `data: ${JSON.stringify({ type: 'error', payload: { message: error.message || 'An unknown error occurred' } })}\n\n`;
    res.write(errorMessage);
  } finally {
    res.end();
  }
});

// Scenario generation endpoint (JSON)
app.post('/api/scenario', async (req, res) => {
    if (!API_KEY) {
        return res.status(500).json({ error: { message: "Missing API_KEY environment variable." } });
    }
    const { userInput, historicalData } = req.body;
    if (!userInput || typeof userInput !== "string" || !historicalData || !Array.isArray(historicalData)) {
        return res.status(400).json({ error: { message: "Request body must contain 'userInput' (string) and 'historicalData' (array)." } });
    }

    const lastDataPoint = historicalData[historicalData.length - 1];
    const PROJECTION_YEARS = 50;

    const prompt = `
You are a climate science simulation expert. Your task is to generate a plausible future climate scenario based on historical data and a user's hypothesis.

Historical Data Summary:
The provided data shows global temperature anomalies from 1880 to ${lastDataPoint.year}.
The last recorded anomaly in ${lastDataPoint.year} was ${lastDataPoint.anomaly.toFixed(2)}°C.
The overall trend shows significant warming, especially since the 1970s.

User's Hypothesis:
"${userInput}"

Your Task:

1. Analyze the Hypothesis: Interpret the user's scenario and its potential impact on global temperature trends.
2. Project a New Trend: Based on your analysis, project the annual temperature anomaly for the next ${PROJECTION_YEARS} years, starting from ${lastDataPoint.year + 1}. The projection should be a scientifically plausible continuation based on the user's premise.
3. Provide a Rationale: Write a concise explanation for your simulation. Justify the trend you've created by linking it to the user's hypothesis and established climate science principles (e.g., effects on GHG emissions, albedo, carbon cycle, etc.).

Output Format:
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
        const response = await ai.models.generateContent({
           model: "gemini-2.5-flash",
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
    } catch (error) {
        console.error("Error in Gemini scenario generation:", error.message);
        res.status(500).json({ error: { message: `AI scenario generation failed: ${error.message}` } });
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
// Define the path to the 'dist' directory where Vite builds the assets.
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// The catch-all is needed for SPA routing. For any request that doesn't match an API
// route or a static file, it serves the main index.html from the 'dist' directory.
// This allows the React router to handle client-side navigation.
app.get(/^\/(?!api|health).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});


// --- SERVER START ---
// Bind to 0.0.0.0 to be accessible in containerized environments like Cloud Run
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is listening on http://0.0.0.0:${PORT}`);
});