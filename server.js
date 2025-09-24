import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fetch from 'node-fetch';
import { GoogleGenAI, Type } from '@google/genai';

// --- DATA INTEGRATION ---
// Re-integrated questGameData directly to ensure it's available in the Cloud Run environment.
const questGameData = {
  es: {
    title: "Misión Climática Tangible",
    intro: "Estás en el año 2150. Te encuentras en un lugar polvoriento, en lo que un día fue el Museo Nacional de Ciencias Naturales. Hay escombros, todo parece desolado. Con tu compañera AURA quitas los escombros y encuentras fragmentos de huesos de los esqueletos que un día estuvieron expuestos en el Museo...",
    finale: {
      good_ending: "Comprendes el mensaje a través del tiempo. Los artistas no predijeron el fin; ofrecieron una elección. Has redescubierto su advertencia y su esperanza. Misión cumplida.",
      bad_ending: "Cansado, abandonas la estructura. Es solo un montón de huesos extraños, un enigma más en un mundo lleno de ellos. El mensaje se pierde de nuevo en el polvo, y la lección sigue sin aprenderse."
    },
    chapters: [
      {
        id: 1,
        name: "El Esqueleto Anómalo",
        description: "...de pronto encuentras un esqueleto completo, pero tiene algo especial. La estructura se asemeja a la espina dorsal de una criatura colosal, con costillas arqueándose hacia el cielo. Pero algo no encaja. La forma es... incorrecta. No se parece a ningún animal que conozcas, ni siquiera de los registros fósiles.",
        choices: [
          {
            action: "EXAMINAR ESTRUCTURA",
            result: "Te acercas. Las 'vértebras' no tienen articulaciones, y las 'costillas' están espaciadas de forma irregular. Esto no es biología; es una construcción deliberada. Has descubierto que no es un fósil.",
            reward: { type: 'clue', value: 'Diseño Artificial' },
            nextChapterId: 2,
          },
          {
            action: "BUSCAR OTROS RESTOS",
            result: "Ignoras la estructura principal y buscas fragmentos más pequeños, pero todo lo que encuentras es polvo y escombros. Has perdido un tiempo valioso.",
            punishment: { type: 'score', value: -5 },
          }
        ]
      },
      {
        id: 2,
        name: "La Base del Tiempo",
        description: "Ahora que sabes que es artificial, tu atención se centra en el pedestal de piedra sobre el que se asienta. Está cubierto por una gruesa capa de sedimento solidificado.",
        choices: [
          {
            action: "LIMPIAR BASE",
            result: "Con cuidado, retiras el polvo. Bajo la mugre, aparecen unas inscripciones finamente talladas: una serie de números que comienzan con '1880' en un extremo y terminan con '2024' en el otro. Es una línea de tiempo.",
            reward: { type: 'clue', value: 'Línea de Tiempo 1880-2024' },
            nextChapterId: 3,
          },
          {
            action: "GOLPEAR BASE",
            result: "Impaciente, golpeas la base con una herramienta. Una grieta recorre la piedra, haciendo ilegibles algunas de las inscripciones. Un recordatorio de que la fuerza bruta rara vez revela la verdad.",
            punishment: { type: 'trap', value: 'Inscripción dañada' },
          }
        ]
      },
      {
        id: 3,
        name: "La Curva Ascendente",
        description: "Una línea de tiempo. Las costillas no son aleatorias; cada una debe corresponder a un año. Observas la escultura en su totalidad. Las costillas cerca de 1880 son pequeñas, con altibajos. Hacia el final, cerca de 2024, se vuelven gigantescas, en una curva ascendente y aterradora.",
        choices: [
          {
            action: "PREGUNTAR A AURA",
            result: "Consultas a tu IA de campo, AURA. 'Analizando... La forma coincide con una representación de datos: una serie temporal. Dada la época y el lugar... esto es una escultura de datos de la anomalía de la temperatura global. Un intento desesperado de hacer visible lo invisible. Una advertencia.'",
            reward: { type: 'clue', value: 'Diagnóstico de AURA: Datos Climáticos' },
            nextChapterId: 4,
          },
          {
            action: "MEDIR COSTILLAS",
            result: "Intentas medir las costillas, pero sin las unidades originales, los datos brutos carecen de sentido. La forma es lo importante, pero el significado se te escapa.",
            punishment: { type: 'score', value: -5 },
          }
        ]
      },
      {
        id: 4,
        name: "La Pregunta Abierta",
        description: "Una advertencia... Sigues la curva hasta la última posición, más allá de 2024. El punto final de la escultura. La culminación del mensaje de los artistas.",
        choices: [
          {
            action: "EXAMINAR FINAL",
            result: "Donde debería estar la última y más grande costilla, no hay nada. Solo un soporte vacío. No es que se haya roto; fue dejada así intencionadamente. La respuesta te golpea: los artistas no estaban prediciendo el futuro. Estaban preguntando a su presente qué harían para cambiarlo.",
            endsGame: 'win',
          },
          {
            action: "MARCHARSE",
            result: "Crees que la escultura está inacabada o rota. Es una historia sin final. Das la espalda al artefacto, dejando su pregunta sin respuesta en el silencio de las ruinas.",
            endsGame: 'lose',
          }
        ]
      }
    ],
  },
  en: {
    title: "Tangible Climate Quest",
    intro: "The year is 2150. You are in a dusty place, in what was once the National Museum of Natural Sciences. There is debris everywhere; it all seems desolate. With your companion AURA, you clear away the rubble and find bone fragments from the skeletons that were once on display in the Museum...",
    finale: {
      good_ending: "You understand the message across time. The artists didn't predict an end; they offered a choice. You have rediscovered their warning and their hope. Mission accomplished.",
      bad_ending: "Weary, you abandon the structure. It's just a pile of strange bones, another riddle in a world full of them. The message is lost again to the dust, and the lesson remains unlearned."
    },
    chapters: [
      {
        id: 1,
        name: "The Anomalous Skeleton",
        description: "...suddenly you find a complete skeleton, but there's something special about it. The structure resembles the spine of a colossal creature, with ribs arching towards the sky. But something is wrong. The shape is... incorrect. It doesn't look like any animal you know, not even from the fossil records.",
        choices: [
          {
            action: "EXAMINE STRUCTURE",
            result: "You get closer. The 'vertebrae' have no joints, and the 'ribs' are irregularly spaced. This isn't biology; it's a deliberate construction. You've discovered it's not a fossil.",
            reward: { type: 'clue', value: 'Artificial Design' },
            nextChapterId: 2,
          },
          {
            action: "SEARCH FOR OTHER REMAINS",
            result: "You ignore the main structure and search for smaller fragments, but all you find is dust and debris. You've wasted valuable time.",
            punishment: { type: 'score', value: -5 },
          }
        ]
      },
      {
        id: 2,
        name: "The Foundation of Time",
        description: "Now that you know it's artificial, your attention shifts to the stone pedestal it rests on. It's covered by a thick layer of solidified sediment.",
        choices: [
          {
            action: "CLEAN BASE",
            result: "Carefully, you brush away the dust. Beneath the grime, finely carved inscriptions appear: a series of numbers starting with '1880' at one end and ending with '2024' at the other. It's a timeline.",
            reward: { type: 'clue', value: 'Timeline 1880-2024' },
            nextChapterId: 3,
          },
          {
            action: "STRIKE BASE",
            result: "Impatient, you hit the base with a tool. A crack runs through the stone, rendering some of the inscriptions illegible. A reminder that brute force rarely reveals the truth.",
            punishment: { type: 'trap', value: 'Damaged Inscription' },
          }
        ]
      },
      {
        id: 3,
        name: "The Rising Curve",
        description: "A timeline. The ribs aren't random; each must correspond to a year. You observe the sculpture as a whole. The ribs near 1880 are small, with ups and downs. Towards the end, near 2024, they become gigantic, in a terrifying, soaring curve.",
        choices: [
          {
            action: "ASK AURA",
            result: "You consult your field AI, AURA. 'Analyzing... The shape matches a data representation: a time series. Given the era and location... this is a data sculpture of the global temperature anomaly. A desperate attempt to make the invisible visible. A warning.'",
            reward: { type: 'clue', value: 'AURA\'s Diagnosis: Climate Data' },
            nextChapterId: 4,
          },
          {
            action: "MEASURE RIBS",
            result: "You try to measure the ribs, but without the original units, the raw numbers are meaningless. The shape is important, but the significance escapes you.",
            punishment: { type: 'score', value: -5 },
          }
        ]
      },
      {
        id: 4,
        name: "The Open Question",
        description: "A warning... You follow the curve to the final position, beyond 2024. The endpoint of the sculpture. The culmination of the artists' message.",
        choices: [
          {
            action: "EXAMINE END",
            result: "Where the last and largest rib should be, there is nothing. Just an empty mount. It's not broken; it was intentionally left this way. The answer hits you: the artists weren't predicting the future. They were asking their present what they would do to change it.",
            endsGame: 'win',
          },
          {
            action: "WALK AWAY",
            result: "You assume the sculpture is unfinished or broken. A story without an ending. You turn your back on the artifact, leaving its question unanswered in the silence of the ruins.",
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

app.post('/api/text-adventure-hint', async (req, res) => {
    try {
        const { language, gameState } = req.body;
        const { chapterId, inventory } = gameState;
        
        const game = questGameData[language];
        const currentChapter = game.chapters.find(c => c.id === chapterId);

        if (!currentChapter) {
            return res.status(404).json({ error: 'Chapter not found for hint.' });
        }

        const prompt = `
          You are AURA, a helpful AI game master for the text adventure 'Tangible Climate Quest'. The user is stuck and has asked for a clear hint.
          Your goal is to provide a direct hint that helps the player progress.

          Current Game State:
          - Language for response: ${language === 'es' ? 'Spanish' : 'English'}
          - Current Scene Description: "${currentChapter.description}"
          - Player Inventory: [${inventory.join(', ')}]
          - Correct Actions for this scene: [${currentChapter.choices.map(c => `'${c.action}'`).join(', ')}]

          Task:
          Generate a clear, direct hint. The hint should explicitly suggest an action or object of interest. If possible, suggest the command format.
          For example, instead of being subtle, say something like: "You should try to EXAMINE the strange SYMBOL on the wall." or "Maybe you can use one of your items, like the bone fragment, on the broken scale. Try 'PLACE BONE ON SCALE'."
          Keep the response concise (1-2 sentences).
        `;
        
        const genAIResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        res.json({ hint: genAIResponse.text });

    } catch (error) {
        console.error('Text Adventure Hint API error:', error);
        res.status(500).json({ error: { message: 'Failed to generate hint.', details: error.message } });
    }
});

app.post('/api/text-adventure-suggestions', async (req, res) => {
    try {
        const { language, gameState } = req.body;
        const { chapterId, inventory } = gameState;
        
        const game = questGameData[language];
        const currentChapter = game.chapters.find(c => c.id === chapterId);

        if (!currentChapter) {
            return res.status(404).json({ error: 'Chapter not found for suggestions.' });
        }

        const prompt = `
            You are a creative Game Master for a retro text adventure. The user needs two suggested actions for their current situation.
            
            Game Style: Post-apocalyptic archaeological mystery, tense atmosphere.
            Location: Ruins of the Museum of Natural Sciences in Madrid.
            Language for suggestions: ${language === 'es' ? 'Spanish' : 'English'}.

            Current Game State:
            - Scene Description: "${currentChapter.description}"
            - Player Inventory: [${inventory.join(', ')}]
            - Pre-defined 'correct' actions available in this scene: [${currentChapter.choices.map(c => `'${c.action}'`).join(', ')}]

            Your Task:
            Generate a JSON array containing exactly two distinct, short, and logical actions (as strings) that the player could take.
            1.  One action should be one of the pre-defined 'correct' actions.
            2.  The other action should be a creative, plausible alternative that makes sense in the context but might not be the optimal path (e.g., exploring something else, trying a different interaction).
            3.  The actions should be in the format of "VERB NOUN", e.g., "EXAMINE SYMBOL" or "GO NORTH".
            4.  Ensure the response is ONLY a valid JSON array.
        `;

        const responseSchema = {
            type: Type.ARRAY,
            items: { type: Type.STRING },
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
        const jsonResponse = JSON.parse(jsonText);
        res.json(jsonResponse);
        
    } catch (error) {
        console.error('Text Adventure Suggestions API error:', error);
        res.status(500).json({ error: { message: 'Failed to generate suggestions.', details: error.message } });
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