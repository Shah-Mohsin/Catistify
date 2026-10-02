import { Pet, PersonalityScores, DiaryEntry } from '../types/pet';

const AI_CONFIG_KEY = 'catistify_ai_config_v2';
const AI_SESSION_KEY = 'catistify_ai_session_key_v1';

export interface AIConfig {
  provider: 'gemini' | 'grok' | 'custom';
  apiKey?: string;
  model?: string;
}

export function getAIConfig(): AIConfig {
  try {
    const raw = localStorage.getItem(AI_CONFIG_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return { provider: parsed.provider || 'gemini', model: parsed.model || 'gemini-2.5-flash' };
  } catch {
    return { provider: 'gemini', model: 'gemini-2.5-flash' };
  }
}

export function saveAIConfig(config: AIConfig): void {
  const { apiKey, ...safeConfig } = config;
  localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(safeConfig));
  if (apiKey?.trim()) {
    sessionStorage.setItem(AI_SESSION_KEY, apiKey.trim());
  }
}

export function getAIRequestKey(): string | undefined {
  try {
    return sessionStorage.getItem(AI_SESSION_KEY) || undefined;
  } catch {
    return undefined;
  }
}

export function hasAIRequestKey(): boolean {
  return Boolean(getAIRequestKey());
}

export async function generatePersonalityInsights(pet: Pet, scores: PersonalityScores): Promise<string> {
  const config = getAIConfig();
  
  try {
    const res = await fetch('/api/ai/analyze-personality', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getAIRequestKey() ? { 'X-Custom-AI-Key': getAIRequestKey() as string } : {})
      },
      body: JSON.stringify({
        pet: {
          name: pet.name,
          type: pet.type,
          age: pet.age,
          breed: pet.breed,
          gender: pet.gender
        },
        scores,
        archetype: pet.personalityName
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.insights) return data.insights;
    }
  } catch (err) {
    console.warn('AI endpoint unavailable, using offline behavior analysis:', err);
  }

  // High-fidelity heuristic fallback
  const topTrait = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const traitDescriptions: Record<string, string> = {
    social: `${pet.name} demonstrates a magnetic, high-trust social temperament. They actively seek human contact and harmonize well with household visitors and other gentle animals. Encourage positive reinforcement during group gatherings.`,
    curious: `${pet.name} possesses an insatiable explorer mentality with sharp investigative focus. They are stimulated by environmental changes and sensory novelties. Providing puzzle feeders and scent trails will keep their cognition razor-sharp.`,
    playful: `${pet.name} vibrates with athletic joy and infectious kinetic energy. High-drive play sessions are essential to fulfill their natural predator/chaser instinct and prevent boredom-induced mischief.`,
    affection: `${pet.name} forms a profound, empathetic bonding anchor. They rely heavily on emotional security and comfort rituals. Consistent gentle grooming sessions and calm resting spots will reinforce their sense of safety.`
  };

  return `${traitDescriptions[topTrait] || "A wonderfully balanced companion."} For a ${pet.age} ${pet.breed}, balancing mental enrichment with structured downtime is the key to lifelong happiness.`;
}

export async function generateDiaryReflection(pet: Pet, entry: Partial<DiaryEntry>): Promise<string> {
  const config = getAIConfig();

  try {
    const res = await fetch('/api/ai/diary-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getAIRequestKey() ? { 'X-Custom-AI-Key': getAIRequestKey() as string } : {})
      },
      body: JSON.stringify({
        petName: pet.name,
        petType: pet.type,
        meetup: entry.meetup,
        activity: entry.activity,
        discovery: entry.discovery,
        notes: entry.notes
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.reflection) return data.reflection;
    }
  } catch (err) {
    console.warn('AI endpoint unavailable, using offline diary storyteller:', err);
  }

  // High-fidelity fallback in pet's voice
  if (pet.type === 'cat') {
    return `"${entry.discovery ? `That mysterious ${entry.discovery} was definitely placed there for my royal inspection.` : `Another successful day supervising the human.`} 10/10 would pounce again!" — ${pet.name}`;
  } else {
    return `"OMG BEST DAY EVER! ${entry.activity ? `We did ${entry.activity} and my tail was wagging at 100mph!` : `I love my human so much!`} Can we do this again tomorrow?!" — ${pet.name}`;
  }
}

export async function generateCustomDailyQuests(pet: Pet): Promise<string[]> {
  const config = getAIConfig();

  try {
    const res = await fetch('/api/ai/generate-quests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(getAIRequestKey() ? { 'X-Custom-AI-Key': getAIRequestKey() as string } : {})
      },
      body: JSON.stringify({
        petName: pet.name,
        petType: pet.type,
        breed: pet.breed,
        archetype: pet.personalityName || 'Companion'
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.quests) && data.quests.length > 0) return data.quests;
    }
  } catch (err) {}

  if (pet.type === 'cat') {
    return [
      `Hide 3 healthy treats in different elevated spots for ${pet.name} to forage`,
      `Practice 5 minutes of calm slow-blink eye contact with ${pet.name}`,
      `Introduce a crinkle paper or safe cardboard box for ${pet.name} to investigate`
    ];
  } else {
    return [
      `Take ${pet.name} on a dedicated 15-minute scent-sniffing exploration walk`,
      `Teach or refresh one fun command (e.g. 'paw' or 'spin') with tasty treats`,
      `Set up a rolled towel treat puzzle for ${pet.name}'s mental enrichment`
    ];
  }
}
