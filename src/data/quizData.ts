import { TraitCategory, PetType } from '../types/pet';

export interface QuizQuestion {
  id: number;
  question: string;
  category: TraitCategory;
}

export const CAT_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: "How much does your cat enjoy meeting new people?", category: "social" },
  { id: 2, question: "How much does your cat enjoy exploring new places?", category: "curious" },
  { id: 3, question: "How playful is your cat?", category: "playful" },
  { id: 4, question: "How much does your cat enjoy being petted?", category: "affection" },
  { id: 5, question: "How often does your cat approach people first?", category: "social" },
  { id: 6, question: "How interested is your cat in new objects?", category: "curious" },
  { id: 7, question: "How much does your cat enjoy chasing toys?", category: "playful" },
  { id: 8, question: "How often does your cat seek attention?", category: "affection" },
  { id: 9, question: "How comfortable is your cat around visitors?", category: "social" },
  { id: 10, question: "How much does your cat investigate strange sounds?", category: "curious" },
  { id: 11, question: "How energetic is your cat during playtime?", category: "playful" },
  { id: 12, question: "How much does your cat enjoy sitting near you?", category: "affection" },
  { id: 13, question: "How easily does your cat make friends with other animals?", category: "social" },
  { id: 14, question: "How adventurous is your cat?", category: "curious" },
  { id: 15, question: "How excited does your cat get about new toys?", category: "playful" },
  { id: 16, question: "How often does your cat show affection?", category: "affection" },
  { id: 17, question: "How much does your cat enjoy interactive games?", category: "playful" },
  { id: 18, question: "How interested is your cat in its surroundings?", category: "curious" },
  { id: 19, question: "How much does your cat enjoy spending time with people?", category: "social" },
  { id: 20, question: "How strongly does your cat seek comfort from you?", category: "affection" },
];

export const DOG_QUESTIONS: QuizQuestion[] = [
  { id: 1, question: "How much does your dog enjoy meeting new people?", category: "social" },
  { id: 2, question: "How much does your dog enjoy being around other dogs?", category: "social" },
  { id: 3, question: "How interested is your dog in unfamiliar things?", category: "curious" },
  { id: 4, question: "How much does your dog enjoy playing with toys?", category: "playful" },
  { id: 5, question: "How much does your dog enjoy staying close to you?", category: "affection" },
  { id: 6, question: "How excited does your dog get when visitors arrive?", category: "social" },
  { id: 7, question: "How much does your dog investigate new places?", category: "curious" },
  { id: 8, question: "How much does your dog enjoy running and playing?", category: "playful" },
  { id: 9, question: "How much does your dog seek attention from you?", category: "affection" },
  { id: 10, question: "How comfortable is your dog in social situations?", category: "social" },
  { id: 11, question: "How interested is your dog in new sounds and smells?", category: "curious" },
  { id: 12, question: "How often does your dog try to start a game?", category: "playful" },
  { id: 13, question: "How much does your dog like sitting or resting near you?", category: "affection" },
  { id: 14, question: "How much does your dog enjoy getting attention from people?", category: "social" },
  { id: 15, question: "How much does your dog explore its surroundings?", category: "curious" },
  { id: 16, question: "How enthusiastic is your dog during playtime?", category: "playful" },
  { id: 17, question: "How strongly does your dog prefer being with its favorite person?", category: "affection" },
  { id: 18, question: "How much does your dog enjoy going to places where other dogs are?", category: "social" },
  { id: 19, question: "How interested is your dog when something unusual happens?", category: "curious" },
  { id: 20, question: "How much energy does your dog show during fun activities?", category: "playful" },
];

export const PERSONALITY_RESULTS: Record<
  PetType,
  Record<TraitCategory, { name: string; description: string; strengths: string[]; tips: string }>
> = {
  cat: {
    social: {
      name: "THE SOCIAL BUTTERFLY",
      description: "Your cat loves company and enjoys being around people and other animals.",
      strengths: ["Naturally welcoming to guests", "Enjoys shared living spaces", "Responsive to human voices"],
      tips: "Provide social opportunities like watching birds through windows and calm greetings with gentle visitors."
    },
    curious: {
      name: "THE EXPLORER",
      description: "Your cat is curious, adventurous and always interested in discovering something new.",
      strengths: ["High environmental awareness", "Loves vertical climbing spots", "Intrigued by novel puzzle toys"],
      tips: "Introduce cardboard box mazes, cat trees with high viewing perches, and rotating safe novelty items."
    },
    playful: {
      name: "THE PLAYFUL HUNTER",
      description: "Your cat has lots of energy and enjoys games, movement and interactive activities.",
      strengths: ["Fast reflexes and agility", "Enthusiastic hunter drive", "Always ready for an energetic session"],
      tips: "Dedicate two 10-minute laser or feather wand sessions daily to channel predatory energy in healthy ways."
    },
    affection: {
      name: "THE CUDDLE COMPANION",
      description: "Your cat enjoys affection, comfort and peaceful time with its favorite people.",
      strengths: ["Deep empathetic connection", "Comforting purring presence", "Seeks reassuring warmth"],
      tips: "Keep a cozy lap blanket nearby and practice slow-blink eye contact to build trust and calm intimacy."
    }
  },
  dog: {
    social: {
      name: "THE SOCIAL BUTTERFLY",
      description: "Your dog loves interaction and enjoys being around people and other dogs. They are friendly and outgoing.",
      strengths: ["Dog park superstar", "Wags tail at every passerby", "Thrives in active family environments"],
      tips: "Organize regular puppy playdates or group walks, while reinforcing gentle greeting manners."
    },
    curious: {
      name: "THE LITTLE EXPLORER",
      description: "Your dog loves discovering new things and enjoys exploring and investigating its surroundings.",
      strengths: ["Exceptional scent tracking", "Observant and inquisitive", "Quick to investigate novel stimuli"],
      tips: "Take 'sniffaris' (decompression walks where they lead with their nose) and provide snuffle mats."
    },
    playful: {
      name: "THE PLAYFUL ADVENTURER",
      description: "Your dog is energetic and enthusiastic. They enjoy games, toys, movement and fun activities.",
      strengths: ["High stamina and joy", "Always ready for fetch or tug", "Invents their own games"],
      tips: "Incorporate agility drills, frisbee toss, or structured obedience games to work mind and muscles together."
    },
    affection: {
      name: "THE LOYAL COMPANION",
      description: "Your dog loves companionship and enjoys spending time with their favorite people.",
      strengths: ["Unwavering loyalty", "Attuned to owner's emotions", "Prefers cuddling right beside you"],
      tips: "Reward quiet companionship with gentle head massages and secure routines that reinforce confidence."
    }
  }
};

export const TRAIT_LABELS: Record<TraitCategory, { label: string; color: string; description: string }> = {
  social: { label: "Social", color: "#FF9F68", description: "Interest in people, guests, and other animals" },
  curious: { label: "Curious", color: "#6C5CE7", description: "Exploration drive, investigation of sounds & new objects" },
  playful: { label: "Playful", color: "#00B894", description: "Energy during games, interactive toys, agility" },
  affection: { label: "Affection", color: "#E84393", description: "Closeness, seeking comfort, petting, and snuggling" },
};
