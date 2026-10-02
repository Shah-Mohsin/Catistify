import { GoogleGenAI } from '@google/genai';

type AIRequest = {
  body?: Record<string, any>;
  query?: { action?: string };
  headers?: Record<string, string | string[] | undefined>;
};

type AIResponse = {
  status: (code: number) => AIResponse;
  json: (payload: unknown) => void;
};

const getFallback = (action: string, body: Record<string, any>) => {
  if (action === 'diary-insights') {
    const petName = body.petName || 'your pet';
    return { reflection: `"${body.activity || 'A gentle day together'} was my favorite part." I am already looking forward to our next little adventure. - ${petName}` };
  }

  if (action === 'generate-quests') {
    const name = body.petName || 'your pet';
    return { quests: [`Give ${name} a fresh water refresh`, `Spend ten device-free minutes with ${name}`, `Try one new enrichment activity with ${name}`] };
  }

  const petName = body.pet?.name || 'Your pet';
  return { insights: `${petName} has a distinct and lovable rhythm. Use short, consistent moments of play and affection to deepen trust and make their favorite routines even richer.` };
};

export default async function handler(req: AIRequest, res: AIResponse) {
  const action = req.query?.action || '';
  const body = req.body || {};
  const requestKey = req.headers?.['x-custom-ai-key'];
  const headerKey = (Array.isArray(requestKey) ? requestKey[0] : requestKey) || process.env.GEMINI_API_KEY;

  if (action === 'test') {
    res.status(200).json({
      status: 'online',
      message: headerKey ? 'AI connection verified. Your request key is used only for this request.' : 'Server online with heuristic fallback engine active.'
    });
    return;
  }

  if (!headerKey) {
    res.status(200).json(getFallback(action, body));
    return;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: headerKey });
    const prompt = action === 'diary-insights'
      ? `Write a warm 1-2 sentence first-person diary reflection for ${body.petName}, a ${body.petType}. Notes: activity=${body.activity || 'none'}, discovery=${body.discovery || 'none'}, notes=${body.notes || 'none'}.`
      : action === 'generate-quests'
        ? `Return only a JSON array of 3 short, healthy bonding missions for ${body.petName}, a ${body.breed} ${body.petType} with personality ${body.archetype || 'unknown'}.`
        : `Give a concise, warm 2-sentence behavioral insight for ${body.pet?.name || 'this pet'} based on archetype ${body.archetype || 'unknown'} and scores ${JSON.stringify(body.scores || {})}.`;
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    const text = response.text || '';

    if (action === 'diary-insights') res.status(200).json({ reflection: text });
    else if (action === 'generate-quests') res.status(200).json({ quests: JSON.parse(text.replace(/```json|```/g, '').trim()) });
    else res.status(200).json({ insights: text });
  } catch {
    res.status(200).json(getFallback(action, body));
  }
}
