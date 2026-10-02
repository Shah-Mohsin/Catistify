import React from 'react';
import { Pet, TraitCategory } from '../../types/pet';
import { TRAIT_LABELS } from '../../data/quizData';
import { BarChart3, CheckCircle2, BookOpen, Users, Sparkles, TrendingUp, Award, Calendar, Heart } from 'lucide-react';

interface AnalyticsDashboardProps {
  pets: Pet[];
  onBack: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ pets, onBack }) => {
  const totalPets = pets.length;
  const catCount = pets.filter(p => p.type === 'cat').length;
  const dogCount = pets.filter(p => p.type === 'dog').length;

  const totalDiaries = pets.reduce((acc, p) => acc + (p.diary?.length || 0), 0);
  const totalQuests = pets.reduce((acc, p) => acc + (p.dailyQuests?.length || 0), 0);
  const completedQuests = pets.reduce((acc, p) => acc + (p.dailyQuests?.filter(q => q.completed).length || 0), 0);
  const questSuccessRate = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;

  const petsWithQuiz = pets.filter(p => p.personalityScores && p.personalityName);
  const quizCompletionRate = totalPets > 0 ? Math.round((petsWithQuiz.length / totalPets) * 100) : 0;

  // Average trait scores
  const traitAverages: Record<TraitCategory, number> = {
    social: 0,
    curious: 0,
    playful: 0,
    affection: 0
  };

  if (petsWithQuiz.length > 0) {
    (['social', 'curious', 'playful', 'affection'] as TraitCategory[]).forEach(trait => {
      const sum = petsWithQuiz.reduce((acc, p) => acc + (p.personalityScores?.[trait] || 0), 0);
      traitAverages[trait] = Math.round((sum / petsWithQuiz.length / 25) * 100);
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#4A3B32] tracking-tight">
            Family Pet Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B50] mt-1">
            Real-time behavioral performance, mission streaks, and wellness metrics across all your pets.
          </p>
        </div>

        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white border border-[#E0D3C5] hover:bg-[#FAF4EE] text-xs font-bold text-[#4A3B32] transition-colors"
        >
          Back to Pets
        </button>
      </div>

      {/* Top 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-3xl border border-[#EADFD4] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8A7465] mb-2 font-bold uppercase">
            <span>Furry Family</span>
            <Users className="w-4 h-4 text-[#FF9F68]" />
          </div>
          <div className="text-3xl font-black text-[#4A3B32] tabular-nums">
            {totalPets}
          </div>
          <p className="text-[11px] text-[#6B5B50] mt-1">
            {catCount} 🐱 Cats · {dogCount} 🐶 Dogs
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-3xl border border-[#EADFD4] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8A7465] mb-2 font-bold uppercase">
            <span>Quest Success</span>
            <CheckCircle2 className="w-4 h-4 text-[#8EC5A4]" />
          </div>
          <div className="text-3xl font-black text-[#4A3B32] tabular-nums">
            {questSuccessRate}%
          </div>
          <p className="text-[11px] text-[#6B5B50] mt-1">
            {completedQuests} of {totalQuests} quests done
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-3xl border border-[#EADFD4] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8A7465] mb-2 font-bold uppercase">
            <span>Diary Memories</span>
            <BookOpen className="w-4 h-4 text-[#8E44AD]" />
          </div>
          <div className="text-3xl font-black text-[#4A3B32] tabular-nums">
            {totalDiaries}
          </div>
          <p className="text-[11px] text-[#6B5B50] mt-1">
            Logged moments & stories
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-3xl border border-[#EADFD4] shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#8A7465] mb-2 font-bold uppercase">
            <span>Profiling Rate</span>
            <Award className="w-4 h-4 text-[#D8A7C7]" />
          </div>
          <div className="text-3xl font-black text-[#4A3B32] tabular-nums">
            {quizCompletionRate}%
          </div>
          <p className="text-[11px] text-[#6B5B50] mt-1">
            {petsWithQuiz.length} / {totalPets} pets assessed
          </p>
        </div>
      </div>

      {/* Trait Averages Chart */}
      <div className="bg-white p-6 rounded-3xl border border-[#EADFD4] shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#F2E8DF] pb-3">
          <div>
            <h3 className="font-black text-base text-[#4A3B32] uppercase tracking-wider">
              Family Behavioral Trait Spectrum
            </h3>
            <p className="text-xs text-[#8A7465]">
              Mean psychological distribution across tested cats and dogs
            </p>
          </div>
          <span className="text-xs font-bold text-[#8E44AD]">{petsWithQuiz.length} pets averaged</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(['social', 'curious', 'playful', 'affection'] as TraitCategory[]).map(trait => {
            const pct = traitAverages[trait];
            const info = TRAIT_LABELS[trait];
            return (
              <div key={trait} className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#EFE5DC] space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#4A3B32]">{info.label} Drive</span>
                  <span className="tabular-nums font-black text-[#8A7465]">{pct}%</span>
                </div>
                <div className="h-2.5 w-full bg-[#EADFD4] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: info.color
                    }}
                  />
                </div>
                <p className="text-[11px] text-[#8A7465]">
                  {info.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual Pet Performance Table */}
      <div className="bg-white p-6 rounded-3xl border border-[#EADFD4] shadow-sm space-y-3">
        <h3 className="font-black text-base text-[#4A3B32] uppercase tracking-wider">
          Individual Pet Activity Roster
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#F2E8DF] text-[#8A7465]">
                <th className="py-2.5 px-3 font-bold uppercase">Pet</th>
                <th className="py-2.5 px-3 font-bold uppercase">Type</th>
                <th className="py-2.5 px-3 font-bold uppercase">Dominant Archetype</th>
                <th className="py-2.5 px-3 font-bold uppercase">Today's Missions</th>
                <th className="py-2.5 px-3 font-bold uppercase">Diary Entries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F7EFE9] text-[#5A4636]">
              {pets.map(p => {
                const comp = (p.dailyQuests || []).filter(q => q.completed).length;
                const tot = (p.dailyQuests || []).length;
                return (
                  <tr key={p.id}>
                    <td className="py-3 px-3 font-black text-[#4A3B32] flex items-center gap-2">
                      <span>{p.type === 'cat' ? '🐱' : '🐶'}</span>
                      <span>{p.name}</span>
                    </td>
                    <td className="py-3 px-3 capitalize font-semibold">
                      {p.type}
                    </td>
                    <td className="py-3 px-3 font-bold text-[#8E44AD]">
                      {p.personalityName || 'Pending Quiz'}
                    </td>
                    <td className="py-3 px-3 tabular-nums font-semibold">
                      {comp} / {tot} {comp === tot && tot > 0 ? '✨ (100%)' : ''}
                    </td>
                    <td className="py-3 px-3 tabular-nums font-semibold">
                      {(p.diary || []).length} logs
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
