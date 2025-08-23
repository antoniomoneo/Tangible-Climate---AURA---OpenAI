// server.js (en la RAÍZ)
import express from "express";
import OpenAI from "openai";

// --- Configuration & Startup Checks ---
const { OPENAI_API_KEY, OPENAI_ASSISTANT_ID, PORT = 8080, ALLOWED_ORIGIN = "*" } = process.env;

if (!OPENAI_API_KEY) {
  throw new Error("The OPENAI_API_KEY environment variable is missing.");
}
if (!OPENAI_ASSISTANT_ID) {
  throw new Error("The OPENAI_ASSISTANT_ID environment variable is missing.");
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const assistantId = OPENAI_ASSISTANT_ID;

// --- Express App Setup ---
const app = express();
app.use(express.json());

// --- CORS Middleware ---
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

// --- Helper Functions ---
const pollRunStatus = async (threadId, runId) => {
    // The Assistants API is asynchronous. We need to poll for the result.
    while (true) {
        const run = await openai.beta.threads.runs.retrieve(threadId, runId);
        if (["completed", "failed", "cancelled", "expired"].includes(run.status)) {
            return run;
        }
        await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 second
    }
};

// --- API Routes ---
app.post("/api/chat", async (req, res) => {
  try {
    const { message, threadId: clientThreadId, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: { message: "The 'message' field is required." } });
    }

    // 1. Get or create a thread
    let threadId = clientThreadId;
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    }

    // 2. Add the user's message to the thread (including context)
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: `Context: ${context}\n\nUser Question: ${message}`,
    });

    // 3. Create a run to process the thread
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // 4. Wait for the run to complete
    const completedRun = await pollRunStatus(threadId, run.id);

    if (completedRun.status !== "completed") {
      const errorMessage = completedRun.last_error?.message || `Run finished with status: ${completedRun.status}`;
      throw new Error(`Assistant run failed. ${errorMessage}`);
    }

    // 5. Retrieve the messages added by the assistant
    const messages = await openai.beta.threads.messages.list(threadId, { limit: 10 });
    const assistantMessage = messages.data.find(m => m.run_id === run.id && m.role === "assistant");

    if (assistantMessage && assistantMessage.content[0].type === 'text') {
      const responseText = assistantMessage.content[0].text.value;
      // 6. Send response back to client, matching frontend expectations
      res.json({ response: responseText, threadId });
    } else {
      throw new Error("No response was received from the assistant.");
    }

  } catch (e) {
    console.error("Error processing chat request:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    res.status(500).json({ error: { message: `Could not process the request. ${errorMessage}` } });
  }
});

app.get("/healthz", (_req, res) => res.send("ok"));

// --- Server Start ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});
