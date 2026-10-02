import React, { useState } from 'react';
import { Pet, DailyQuest } from '../../types/pet';
import { ArrowLeft, CheckCircle2, Circle, Plus, Trash2, Sparkles, Trophy, Calendar, Flame } from 'lucide-react';
import { generateCustomDailyQuests } from '../../services/aiService';

interface DailyQuestsProps {
  pet: Pet;
  onBack: () => void;
  onUpdatePet: (updated: Pet) => void;
}

export const DailyQuests: React.FC<DailyQuestsProps> = ({
  pet,
  onBack,
  onUpdatePet,
}) => {
  const isCat = pet.type === 'cat';
  const themeColor = isCat ? '#FF9F68' : '#8E44AD';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newQuestTask, setNewQuestTask] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const quests = pet.dailyQuests || [];
  const completedCount = quests.filter(q => q.completed).length;
  const totalCount = quests.length;
  const allCompleted = totalCount > 0 && completedCount === totalCount;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleQuest = (id: string) => {
    const updated = quests.map(q => {
      if (q.id === id) {
        return {
          ...q,
          completed: !q.completed,
          completedAt: !q.completed ? new Date().toISOString() : undefined
        };
      }
      return q;
    });

    onUpdatePet({
      ...pet,
      dailyQuests: updated,
      updatedAt: new Date().toISOString()
    });
  };

  const deleteQuest = (id: string) => {
    const updated = quests.filter(q => q.id !== id);
    onUpdatePet({
      ...pet,
      dailyQuests: updated,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddCustomQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestTask.trim()) return;

    const newQuest: DailyQuest = {
      id: `quest_${Date.now()}`,
      task: newQuestTask.trim(),
      completed: false,
      category: 'custom'
    };

    onUpdatePet({
      ...pet,
      dailyQuests: [...quests, newQuest],
      updatedAt: new Date().toISOString()
    });

    setNewQuestTask('');
    setIsAddModalOpen(false);
  };

  const handleGenerateAIQuests = async () => {
    setIsGeneratingAI(true);
    try {
      const generated = await generateCustomDailyQuests(pet);
      const newMissions: DailyQuest[] = generated.map((taskText, idx) => ({
        id: `quest_ai_${Date.now()}_${idx}`,
        task: taskText,
        completed: false,
        category: 'bonding'
      }));

      onUpdatePet({
        ...pet,
        dailyQuests: [...quests, ...newMissions],
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Failed to generate quests:', err);
    }
    setIsGeneratingAI(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 animate-fade-in space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E0D3C5] hover:bg-[#FAF4EE] text-xs font-bold text-[#4A3B32] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAIQuests}
            disabled={isGeneratingAI}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6EEFA] border border-[#E4D5EE] text-[#8E44AD] hover:bg-[#EDE1F5] text-xs font-bold transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Generating...' : 'AI Mission Generator'}</span>
          </button>
        </div>
      </div>

      {/* Main Quest Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD4] shadow-sm space-y-6">
        {/* Title */}
        <div className="text-center max-w-lg mx-auto">
          <span className="text-3xl mb-1 inline-block">
            {isCat ? '🐱' : '🐶'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4A3B32] tracking-tight">
            {pet.name}'s Daily Missions
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B50] mt-1">
            Complete small bonding quests every day to keep your pet active and content.
          </p>
        </div>

        {/* Progress Card */}
        <div className={`p-4 rounded-2xl border transition-all ${
          allCompleted
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-[#FFF8F0] border-[#EFE5DC] text-[#4A3B32]'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5">
              {allCompleted ? <Trophy className="w-4 h-4 text-emerald-600" /> : <Flame className="w-4 h-4 text-[#FF9F68]" />}
              <span>Today's Progress</span>
            </span>
            <span className="tabular-nums">
              {completedCount} / {totalCount} Completed ({progressPct}%)
            </span>
          </div>

          <div className="h-2.5 w-full bg-[#E8DCD1] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                allCompleted ? 'bg-emerald-500' : 'bg-[#FF9F68]'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {allCompleted && (
            <p className="text-xs font-bold text-emerald-700 mt-2 text-center animate-bounce">
              🎉 Congratulations! All quests completed for {pet.name} today!
            </p>
          )}
        </div>

        {/* Quests List */}
        <div className="space-y-2.5">
          {quests.map((quest) => (
            <div
              key={quest.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                quest.completed
                  ? 'bg-emerald-50/50 border-emerald-200/80 text-emerald-900'
                  : 'bg-[#FFFDFB] border-[#EADFD4] hover:border-[#D5C2B1] text-[#4A3B32]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleQuest(quest.id)}
                className="flex items-center gap-3 text-left flex-1 focus:outline-none"
              >
                {quest.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-[#C5B5A6] hover:text-[#FF9F68] shrink-0 transition-colors" />
                )}
                <span className={`text-xs sm:text-sm font-semibold leading-snug ${
                  quest.completed ? 'line-through text-[#7A8E80]' : 'text-[#4A3B32]'
                }`}>
                  {quest.task}
                </span>
              </button>

              <button
                type="button"
                onClick={() => deleteQuest(quest.id)}
                className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 flex items-center justify-center transition-colors shrink-0"
                title="Delete quest"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Custom Quest Button */}
        <div className="pt-4 flex justify-center">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-[#8E44AD] hover:bg-[#71368A] text-white font-bold text-xs shadow-md shadow-[#8E44AD]/20 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Quest</span>
          </button>
        </div>
      </div>

      {/* Add Custom Quest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FFFDFB] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#E8DCD1] space-y-4">
            <h3 className="font-black text-lg text-[#4A3B32]">
              ADD YOUR OWN QUEST
            </h3>
            <p className="text-xs text-[#6B5B50]">
              What meaningful challenge should {pet.name} accomplish today?
            </p>

            <form onSubmit={handleAddCustomQuest} className="space-y-4">
              <input
                type="text"
                required
                placeholder="e.g. Try a new puzzle feeder, 15 min sunbath..."
                value={newQuestTask}
                onChange={(e) => setNewQuestTask(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#D8C7B8] bg-[#FFF8F0] text-sm text-[#4A3B32] focus:outline-none focus:ring-2 focus:ring-[#8E44AD]"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8A7465] hover:text-[#4A3B32]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#8E44AD] text-white text-xs font-bold hover:bg-[#71368A] transition-colors"
                >
                  Add Quest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
