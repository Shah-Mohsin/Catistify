import React from 'react';
import { Pet } from '../../types/pet';
import { Sparkles, BookOpen, CheckSquare, User, ArrowLeft, RefreshCw, BrainCircuit, Heart, Compass, Flame, Smile } from 'lucide-react';
import { TRAIT_LABELS } from '../../data/quizData';

interface PetDashboardProps {
  pet: Pet;
  onBackToPets: () => void;
  onOpenQuiz: () => void;
  onOpenDiary: () => void;
  onOpenQuests: () => void;
  onOpenProfile: () => void;
}

export const PetDashboard: React.FC<PetDashboardProps> = ({
  pet,
  onBackToPets,
  onOpenQuiz,
  onOpenDiary,
  onOpenQuests,
  onOpenProfile,
}) => {
  const isCat = pet.type === 'cat';
  const themeColor = isCat ? '#FF9F68' : '#8E44AD';
  const accentColor = isCat ? '#FFF1E6' : '#F6EEFA';

  const completedQuests = (pet.dailyQuests || []).filter(q => q.completed).length;
  const totalQuests = (pet.dailyQuests || []).length;
  const diaryCount = (pet.diary || []).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 animate-fade-in space-y-8">
      {/* Top Breadcrumb & Pet Switcher */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToPets}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E0D3C5] hover:bg-[#FAF4EE] text-xs font-bold text-[#4A3B32] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>My Pets</span>
        </button>

        <button
          onClick={onOpenProfile}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E0D3C5] hover:bg-[#FAF4EE] text-xs font-bold text-[#4A3B32] transition-colors"
        >
          <User className="w-3.5 h-3.5 text-[#8E44AD]" />
          <span>View Profile</span>
        </button>
      </div>

      {/* Hero Welcome Card */}
      <div className="depth-surface relative overflow-hidden rounded-[2rem] bg-white/80 border border-black/10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-[#FFF1E6] border-2 border-[#E8DCD1] flex items-center justify-center text-4xl shadow-inner">
              {pet.profilePicture ? (
                <img
                  src={pet.profilePicture}
                  alt={pet.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}
              <span className={pet.profilePicture ? 'hidden' : 'block'}>
                {isCat ? '🐱' : '🐶'}
              </span>
            </div>
            <span
              className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg text-white text-[10px] font-black uppercase tracking-wider shadow"
              style={{ backgroundColor: themeColor }}
            >
              {pet.type}
            </span>
          </div>

          <div className="text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#4A3B32] tracking-tight">
                Welcome, {pet.name}!
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#6B5B50] font-medium mt-1">
              {pet.breed} <span className="text-[#C5B5A6]">·</span> {pet.gender} <span className="text-[#C5B5A6]">·</span> {pet.age}
            </p>
            <p className="text-xs text-[#8A7465] mt-2 max-w-xl">
              Your personal sanctuary for {pet.name}'s behavioral psychology, daily adventure records, and bonding rituals.
            </p>
          </div>
        </div>

        {/* Personality Archetype Highlight Banner */}
        {pet.personalityName ? (
          <div className="mt-6 pt-6 border-t border-[#F2E8DF]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7465]">
                  Active Personality Archetype
                </span>
                <h3 className="text-lg sm:text-xl font-black text-[#4A3B32] mt-0.5">
                  {pet.personalityName}
                </h3>
                <p className="text-xs text-[#6B5B50] mt-1 max-w-2xl">
                  {pet.personalityDescription}
                </p>
              </div>

              <button
                onClick={onOpenQuiz}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D5C2B1] bg-[#FFF8F0] hover:bg-white text-xs font-bold text-[#4A3B32] transition-colors shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#FF9F68]" />
                <span>Retake Quiz</span>
              </button>
            </div>

            {/* Trait Progress Rings / Bars */}
            {pet.personalityScores && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-[#F7EFE9]">
                {Object.entries(pet.personalityScores).map(([trait, score]) => {
                  const traitKey = trait as keyof typeof TRAIT_LABELS;
                  const pct = Math.round((score / 25) * 100);
                  return (
                    <div key={trait} className="p-2.5 rounded-2xl bg-[#FFF8F0] border border-[#EFE5DC]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#4A3B32]">{TRAIT_LABELS[traitKey]?.label || trait}</span>
                        <span className="tabular-nums font-bold text-[#8A7465]">{pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-[#EADFD4] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: TRAIT_LABELS[traitKey]?.color || themeColor
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* AI Insights Snippet */}
            {pet.aiPersonalityInsights && (
              <div className="mt-4 p-3.5 rounded-2xl bg-[#F6EEFA] border border-[#E6D4EE] flex items-start gap-3">
                <BrainCircuit className="w-4 h-4 text-[#8E44AD] shrink-0 mt-0.5" />
                <div className="text-xs text-[#523A5B] leading-relaxed">
                  <span className="font-bold text-[#3B2044]">AI Behavioral Analysis: </span>
                  {pet.aiPersonalityInsights}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 p-4 rounded-2xl bg-[#FFF1E6] border border-[#FFD9C0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#FF9F68] shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-[#4A3B32]">Personality Quiz Not Completed</h4>
                <p className="text-xs text-[#6B5B50]">
                  Answer 20 fun behavioral questions to discover {pet.name}'s psychological archetype.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenQuiz}
              className="px-4 py-2 rounded-xl bg-[#FF9F68] hover:bg-[#f58f55] text-white font-bold text-xs shadow transition-colors shrink-0"
            >
              Start 20-Question Quiz
            </button>
          </div>
        )}
      </div>

      {/* 4 Feature Cards Grid (Matches and upgrades Python Catistify) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Card 1: Analyze Personality */}
        <div className="depth-surface lift-on-hover bg-white/80 rounded-[2rem] p-6 border border-black/10 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#FFF1E6] flex items-center justify-center text-[#FF9F68] mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-black text-lg text-[#4A3B32]">
              ANALYZE PERSONALITY
            </h3>
            <p className="text-xs text-[#6B5B50] mt-1 leading-relaxed">
              Take the comprehensive 20-question psychological assessment across Social, Curious, Playful, and Affection metrics.
            </p>
          </div>
          <button
            onClick={onOpenQuiz}
            className="mt-6 w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            style={{ backgroundColor: themeColor }}
          >
            {pet.personalityName ? 'Retake Quiz' : 'Take Personality Quiz'}
          </button>
        </div>

        {/* Card 2: Pet Diary */}
        <div className="depth-surface lift-on-hover bg-white/80 rounded-[2rem] p-6 border border-black/10 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#EDF7F1] flex items-center justify-center text-[#8EC5A4] mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-black text-lg text-[#4A3B32]">
              PET DIARY
            </h3>
            <p className="text-xs text-[#6B5B50] mt-1 leading-relaxed">
              Record meetups, discoveries, playful moments and let AI translate what your pet was thinking today!
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#8A7465]">
              <span className="font-bold text-[#4A3B32]">{diaryCount}</span> logged adventure memories
            </div>
          </div>
          <button
            onClick={onOpenDiary}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#8EC5A4] hover:bg-[#72B58D] text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            Open Diary
          </button>
        </div>

        {/* Card 3: Daily Quests */}
        <div className="depth-surface lift-on-hover bg-white/80 rounded-[2rem] p-6 border border-black/10 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#F6EEFA] flex items-center justify-center text-[#8E44AD] mb-4">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="font-black text-lg text-[#4A3B32]">
              DAILY MISSIONS
            </h3>
            <p className="text-xs text-[#6B5B50] mt-1 leading-relaxed">
              Complete small daily bonding missions, keep your pet active and maintain your care streak.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="font-bold text-[#4A3B32]">{completedQuests}/{totalQuests}</span>
              <span className="text-[#8A7465]">completed today</span>
              {completedQuests === totalQuests && totalQuests > 0 && (
                <span className="text-xs text-[#8E44AD] font-bold">🎉 All done!</span>
              )}
            </div>
          </div>
          <button
            onClick={onOpenQuests}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#8E44AD] hover:bg-[#71368A] text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            View Missions
          </button>
        </div>

        {/* Card 4: Pet Profile */}
        <div className="depth-surface lift-on-hover bg-white/80 rounded-[2rem] p-6 border border-black/10 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-[#FAEFF5] flex items-center justify-center text-[#D8A7C7] mb-4">
              <User className="w-5 h-5" />
            </div>
            <h3 className="font-black text-lg text-[#4A3B32]">
              PET PROFILE
            </h3>
            <p className="text-xs text-[#6B5B50] mt-1 leading-relaxed">
              Review saved profile details, breed lineage, age metrics, and update profile imagery.
            </p>
          </div>
          <button
            onClick={onOpenProfile}
            className="mt-6 w-full py-2.5 px-4 rounded-xl bg-[#D8A7C7] hover:bg-[#C58DB4] text-white font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};
