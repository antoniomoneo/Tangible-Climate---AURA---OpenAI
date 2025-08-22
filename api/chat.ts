/**
 * NOTE: This is an example of an API route handler.
 * The exact request/response objects might differ based on your server framework
 * (e.g., Next.js, Express, Cloud Run with Node.js, etc.).
 * This code assumes a framework that provides `req.body` for the parsed JSON body
 * and a `res.status().json()` method to send responses.
 * You will need to have the 'openai' package installed in your project.
 */
import OpenAI from 'openai';

// This is a generic type definition. Replace with your framework's specific types if available.
interface ApiRequest {
  method?: string;
  body: {
    message: string;
    threadId: string | null;
    context: string;
  };
}

// This is a generic type definition. Replace with your framework's specific types if available.
interface ApiResponse {
  status: (statusCode: number) => {
    json: (body: object) => void;
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const assistantId = process.env.OPENAI_ASSISTANT_ID;

// Helper function to poll the run status. The Assistants API is asynchronous.
const pollRunStatus = async (threadId: string, runId: string): Promise<OpenAI.Beta.Threads.Runs.Run> => {
    const maxRetries = 30; // 30 retries * 1.5s = 45s timeout, adjust as needed
    let retries = 0;

    while (retries < maxRetries) {
        try {
            const run = await openai.beta.threads.runs.retrieve(threadId, runId);
            if (['completed', 'failed', 'cancelled', 'expired', 'requires_action'].includes(run.status)) {
                return run;
            }
        } catch (error) {
            console.error("Error retrieving run status:", error);
            throw new Error("Could not retrieve run status from OpenAI.");
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500)); // Poll every 1.5 seconds
        retries++;
    }
    throw new Error("Run polling timed out.");
};


export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: { message: 'Method Not Allowed' } });
  }

  if (!assistantId) {
    console.error('OPENAI_ASSISTANT_ID environment variable is not set.');
    return res.status(500).json({ error: { message: 'Server is not configured correctly.' } });
  }
   if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY environment variable is not set.');
    return res.status(500).json({ error: { message: 'Server is not configured correctly.' } });
  }

  try {
    const { message, threadId: clientThreadId, context } = req.body;

    if (!message) {
        return res.status(400).json({ error: { message: 'Message is required.' } });
    }

    // 1. Ensure a thread exists. If client doesn't have one, create it.
    let threadId = clientThreadId;
    if (!threadId) {
      const thread = await openai.beta.threads.create();
      threadId = thread.id;
    }

    // 2. Add the user's message to the thread.
    // We combine the game context with the user's direct message for the AI.
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: `Context: ${context}\n\nUser: ${message}`,
    });

    // 3. Create and run the assistant on the thread.
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistantId,
    });

    // 4. Poll for the run to complete.
    const completedRun = await pollRunStatus(threadId, run.id);

    if (completedRun.status !== 'completed') {
       console.error(`Run did not complete successfully. Status: ${completedRun.status}`);
       const errorMessage = completedRun.last_error?.message || `Run finished with status: ${completedRun.status}`;
       return res.status(500).json({ error: { message: `Assistant could not process the request. Reason: ${errorMessage}` } });
    }

    // 5. Retrieve the latest messages from the thread.
    const messagesPage = await openai.beta.threads.messages.list(threadId, { limit: 10 });
    
    // 6. Find the most recent message from the assistant for this run.
    const assistantMessage = messagesPage.data.find(
        (m) => m.role === 'assistant' && m.run_id === run.id
    );

    if (assistantMessage && assistantMessage.content[0].type === 'text') {
      const responseText = assistantMessage.content[0].text.value;
      // 7. Send the successful response back to the client.
      return res.status(200).json({ response: responseText, threadId: threadId });
    } else {
       // This can happen if the assistant doesn't respond with text.
      throw new Error('No text response received from the assistant.');
    }

  } catch (error) {
    console.error('An error occurred in the chat API handler:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown internal server error occurred.';
    return res.status(500).json({ error: { message: errorMessage } });
  }
}
