export type PetType = 'cat' | 'dog';
export type Gender = 'Male' | 'Female' | 'Unknown';
export type TraitCategory = 'social' | 'curious' | 'playful' | 'affection';

export interface PersonalityScores {
  social: number;
  curious: number;
  playful: number;
  affection: number;
}

export interface DiaryEntry {
  id: string;
  date: string;
  meetup?: string;
  activity?: string;
  discovery?: string;
  notes?: string;
  mood?: 'happy' | 'playful' | 'sleepy' | 'curious' | 'grumpy';
  photo?: string;
  aiReflection?: string;
  createdAt: string;
}

export interface DailyQuest {
  id: string;
  task: string;
  completed: boolean;
  category?: 'care' | 'play' | 'bonding' | 'health' | 'custom';
  completedAt?: string;
}

export interface Pet {
  id: string;
  type: PetType;
  name: string;
  age: string;
  breed: string;
  gender: Gender;
  profilePicture?: string;
  personalityScores?: PersonalityScores;
  personalityName?: string;
  personalityDescription?: string;
  aiPersonalityInsights?: string;
  diary: DiaryEntry[];
  dailyQuests: DailyQuest[];
  dailyQuestDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackupSnapshot {
  id: string;
  timestamp: string;
  petsCount: number;
  entriesCount: number;
  data: {
    pets: Pet[];
    activePetId: string | null;
  };
  notes?: string;
}
