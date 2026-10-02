import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory cloud sync store for cross-platform data consistency
let cloudSyncStore: any = null;

// Initialize Google Gen AI SDK
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// -------------------------------------------------------------
// AI ENDPOINTS
// -------------------------------------------------------------

// 1. Analyze Personality
app.post('/api/ai/analyze-personality', async (req, res) => {
  try {
    const { pet, scores, archetype } = req.body;
    const customKey = req.headers['x-custom-ai-key'] as string;
    const requestAI = customKey ? new GoogleGenAI({ apiKey: customKey }) : ai;

    if (requestAI) {
      const prompt = `You are a world-class veterinary animal behavioral psychologist.
Pet Profile:
- Name: ${pet.name}
- Species: ${pet.type}
- Breed: ${pet.breed}
- Age: ${pet.age}
- Gender: ${pet.gender}
- Calculated Dominant Archetype: ${archetype}
- Assessment Trait Scores (out of 25):
  * Social: ${scores.social}/25
  * Curious: ${scores.curious}/25
  * Playful: ${scores.playful}/25
  * Affection: ${scores.affection}/25

Provide a concise, warm, highly specific 2-to-3 sentence psychological analysis of ${pet.name}'s behavioral profile, explaining how their dominant trait influences daily bonding and one practical enrichment activity recommendation.`;

      const response = await requestAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({ insights: response.text });
    }

    // Heuristic fallback if no API key provided
    return res.json({
      insights: `${pet.name} demonstrates a signature balance of high-engagement traits. Their ${archetype} disposition shows they find immense comfort in structured play routines and dedicated affection windows with their family.`
    });
  } catch (error: any) {
    console.error('Error in /api/ai/analyze-personality:', error);
    return res.status(500).json({ error: error.message || 'Internal AI error' });
  }
});

// 2. Diary Reflection in Pet's Voice
app.post('/api/ai/diary-insights', async (req, res) => {
  try {
    const { petName, petType, meetup, activity, discovery, notes } = req.body;
    const customKey = req.headers['x-custom-ai-key'] as string;
    const requestAI = customKey ? new GoogleGenAI({ apiKey: customKey }) : ai;

    if (requestAI) {
      const prompt = `You are ${petName}, a sweet and expressive ${petType}.
Write a humorous, affectionate 1-2 sentence reflection of your day in the first person ("I") based on these diary notes:
- Meetup: ${meetup || 'none'}
- Activity: ${activity || 'none'}
- New Discovery: ${discovery || 'none'}
- Notes: ${notes || 'none'}

Keep it playful, loving, and authentic to ${petType} personality.`;

      const response = await requestAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({ reflection: response.text });
    }

    if (petType === 'cat') {
      return res.json({
        reflection: `"${discovery ? `Investigating ${discovery} was critical for household security.` : `A triumphant day of naps and careful observation.`} You may pet me now, human." — ${petName}`
      });
    } else {
      return res.json({
        reflection: `"${activity ? `Doing ${activity} was the best thing ever!!` : `I loved every single second of being near you today!`} Can we play again right now?!" — ${petName}`
      });
    }
  } catch (error: any) {
    console.error('Error in /api/ai/diary-insights:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 3. Generate Custom Quests
app.post('/api/ai/generate-quests', async (req, res) => {
  try {
    const { petName, petType, breed, archetype } = req.body;
    const customKey = req.headers['x-custom-ai-key'] as string;
    const requestAI = customKey ? new GoogleGenAI({ apiKey: customKey }) : ai;

    if (requestAI) {
      const prompt = `Generate 3 fun, healthy, creative daily bonding missions for a ${breed} ${petType} named ${petName} with the personality archetype "${archetype}".
Return ONLY a valid JSON array of 3 short string tasks, e.g. ["Task 1", "Task 2", "Task 3"]. Do not include markdown formatting or backticks.`;

      const response = await requestAI.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const cleaned = (response.text || '').replace(/```json/g, '').replace(/```/g, '').trim();
      const quests = JSON.parse(cleaned);
      return res.json({ quests });
    }

    const defaultTasks = petType === 'cat'
      ? [
          `Set up a cozy high-perch viewing spot for ${petName}`,
          `Engage in two 5-minute laser or feather wand sessions with ${petName}`,
          `Practice slow-blink eye contact to reinforce trust with ${petName}`
        ]
      : [
          `Take ${petName} on a 20-minute sensory decompression sniff walk`,
          `Play 10 rounds of fetch or hide-and-seek with ${petName}`,
          `Give ${petName} a gentle 5-minute ear and shoulder massage`
        ];

    return res.json({ quests: defaultTasks });
  } catch (error: any) {
    console.error('Error in /api/ai/generate-quests:', error);
    return res.status(500).json({ error: error.message });
  }
});

// 4. Test Connection
app.all('/api/ai/test', (req, res) => {
  const customKey = req.headers['x-custom-ai-key'];
  res.json({
    status: 'online',
    message: customKey || ai
      ? 'AI connection ready. A private request key will be used for generation.'
      : 'Server online with heuristic fallback engine active.'
  });
});

// -------------------------------------------------------------
// CLOUD SYNC & BACKUP ENDPOINTS
// -------------------------------------------------------------
app.get('/api/sync', (req, res) => {
  res.json({ data: cloudSyncStore, syncedAt: new Date().toISOString() });
});

app.post('/api/sync', (req, res) => {
  const { data } = req.body;
  cloudSyncStore = data;
  res.json({ success: true, timestamp: new Date().toISOString() });
});

// -------------------------------------------------------------
// VITE DEV MIDDLEWARE OR PRODUCTION SERVE
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Catistify server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
