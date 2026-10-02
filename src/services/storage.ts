import { Pet, BackupSnapshot, DailyQuest } from '../types/pet';
import { INITIAL_PETS } from '../data/sampleData';

const PETS_STORAGE_KEY = 'catistify_pets_v2';
const ACTIVE_PET_ID_KEY = 'catistify_active_pet_id_v2';
const BACKUPS_STORAGE_KEY = 'catistify_backups_v2';
const SYNC_QUEUE_KEY = 'catistify_sync_queue_v2';

export function getDefaultDailyQuests(pet: Pet): DailyQuest[] {
  return [
    {
      id: `quest_${Date.now()}_1`,
      task: `Give ${pet.name} fresh water`,
      completed: false,
      category: 'care'
    },
    {
      id: `quest_${Date.now()}_2`,
      task: `Spend some quality time with ${pet.name}`,
      completed: false,
      category: 'bonding'
    },
    {
      id: `quest_${Date.now()}_3`,
      task: `Play with ${pet.name} for a while`,
      completed: false,
      category: 'play'
    },
    {
      id: `quest_${Date.now()}_4`,
      task: `Check that ${pet.name}'s space is clean`,
      completed: false,
      category: 'health'
    }
  ];
}

export function checkAndResetDailyQuests(pet: Pet): Pet {
  const today = new Date().toISOString().split('T')[0];
  if (pet.dailyQuestDate !== today) {
    const defaultQuests = getDefaultDailyQuests(pet);
    // Keep custom quests from previous day, but uncheck them
    const customQuests = (pet.dailyQuests || [])
      .filter(q => q.category === 'custom')
      .map(q => ({ ...q, completed: false, completedAt: undefined }));

    return {
      ...pet,
      dailyQuestDate: today,
      dailyQuests: [...defaultQuests, ...customQuests],
      updatedAt: new Date().toISOString()
    };
  }
  return pet;
}

export function loadPets(): Pet[] {
  try {
    const raw = localStorage.getItem(PETS_STORAGE_KEY);
    if (!raw) {
      savePets(INITIAL_PETS);
      return INITIAL_PETS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Check daily quests date for each pet
      const updated = parsed.map(p => checkAndResetDailyQuests(p));
      return updated;
    }
    return INITIAL_PETS;
  } catch (err) {
    console.error('Failed to load pets from storage:', err);
    return INITIAL_PETS;
  }
}

export function savePets(pets: Pet[]): void {
  try {
    localStorage.setItem(PETS_STORAGE_KEY, JSON.stringify(pets));
  } catch (err) {
    console.error('Failed to save pets to storage:', err);
  }
}

export function getActivePetId(): string | null {
  return localStorage.getItem(ACTIVE_PET_ID_KEY);
}

export function setActivePetId(id: string | null): void {
  if (id) {
    localStorage.setItem(ACTIVE_PET_ID_KEY, id);
  } else {
    localStorage.removeItem(ACTIVE_PET_ID_KEY);
  }
}

// -------------------------------------------------------------
// AUTOMATED BACKUPS & SNAPSHOTS
// -------------------------------------------------------------

export function loadBackupSnapshots(): BackupSnapshot[] {
  try {
    const raw = localStorage.getItem(BACKUPS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function triggerAutomatedBackup(pets: Pet[], notes = 'Automated system snapshot'): BackupSnapshot {
  const snapshots = loadBackupSnapshots();
  const totalEntries = pets.reduce((acc, p) => acc + (p.diary?.length || 0), 0);

  const newSnapshot: BackupSnapshot = {
    id: `snap_${Date.now()}`,
    timestamp: new Date().toISOString(),
    petsCount: pets.length,
    entriesCount: totalEntries,
    data: {
      pets,
      activePetId: getActivePetId()
    },
    notes
  };

  // Keep last 10 snapshots to save space
  const updated = [newSnapshot, ...snapshots.slice(0, 9)];
  try {
    localStorage.setItem(BACKUPS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Backup storage limit approached:', e);
  }
  return newSnapshot;
}

export function exportBackupJSON(pets: Pet[]): void {
  const activeId = getActivePetId();
  const exportPayload = {
    app: 'Catistify',
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    pets,
    activePetId: activeId
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `catistify-backup-${dateStr}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function restoreBackupData(jsonData: any): { success: boolean; message: string; pets?: Pet[] } {
  try {
    if (!jsonData || typeof jsonData !== 'object') {
      return { success: false, message: 'Invalid backup file structure.' };
    }

    const pets = jsonData.pets || (Array.isArray(jsonData) ? jsonData : null);
    if (!Array.isArray(pets)) {
      return { success: false, message: 'Backup does not contain a valid pet array.' };
    }

    // Validate minimal pet shape
    const validated: Pet[] = pets.map((p: any, idx: number) => ({
      id: p.id || `pet_restored_${Date.now()}_${idx}`,
      type: p.type === 'dog' ? 'dog' : 'cat',
      name: p.name || 'Unnamed Pet',
      age: p.age || 'Unknown',
      breed: p.breed || 'Mixed',
      gender: p.gender || 'Unknown',
      profilePicture: p.profilePicture || '',
      personalityScores: p.personalityScores || { social: 0, curious: 0, playful: 0, affection: 0 },
      personalityName: p.personalityName || '',
      personalityDescription: p.personalityDescription || '',
      aiPersonalityInsights: p.aiPersonalityInsights || '',
      diary: Array.isArray(p.diary) ? p.diary : [],
      dailyQuests: Array.isArray(p.dailyQuests) ? p.dailyQuests : [],
      dailyQuestDate: p.dailyQuestDate || new Date().toISOString().split('T')[0],
      createdAt: p.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    savePets(validated);
    if (jsonData.activePetId && validated.some(p => p.id === jsonData.activePetId)) {
      setActivePetId(jsonData.activePetId);
    } else if (validated.length > 0) {
      setActivePetId(validated[0].id);
    }

    triggerAutomatedBackup(validated, 'Restored from JSON backup file');
    return { success: true, message: `Successfully restored ${validated.length} pet profile(s)!`, pets: validated };
  } catch (err: any) {
    return { success: false, message: `Failed to restore: ${err?.message || 'Unknown error'}` };
  }
}
