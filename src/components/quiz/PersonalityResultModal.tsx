import React from 'react';
import { Pet } from '../../types/pet';
import { TRAIT_LABELS } from '../../data/quizData';
import { Sparkles, BrainCircuit, BookOpen, ArrowRight, Share2, Check, Download } from 'lucide-react';

interface PersonalityResultModalProps {
  pet: Pet;
  onClose: () => void;
  onOpenDiary: () => void;
}

export const PersonalityResultModal: React.FC<PersonalityResultModalProps> = ({
  pet,
  onClose,
  onOpenDiary,
}) => {
  const isCat = pet.type === 'cat';
  const themeColor = isCat ? '#FF9F68' : '#8E44AD';
  const scores = pet.personalityScores || { social: 0, curious: 0, playful: 0, affection: 0 };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FFFDFB] w-full max-w-xl rounded-3xl shadow-2xl border border-[#E8DCD1] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Banner */}
        <div
          className="px-6 py-6 text-white text-center relative overflow-hidden"
          style={{ backgroundColor: themeColor }}
        >
          <div className="absolute top-2 right-3">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
            >
              ✕
            </button>
          </div>
          <span className="text-4xl inline-block mb-1">
            {isCat ? '🐱' : '🐶'}
          </span>
          <p className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">
            {pet.name.toUpperCase()}'S OFFICIAL ARCHETYPE
          </p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
            {pet.personalityName}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Description */}
          <div className="text-center max-w-md mx-auto">
            <p className="text-sm font-medium text-[#5A4636] leading-relaxed">
              {pet.personalityDescription}
            </p>
          </div>

          {/* Personality Scores Breakdown */}
          <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#EFE5DC] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A3B32]">
                Personality Trait Dimensions
              </h4>
              <span className="text-[11px] text-[#8A7465]">Max 25 pts (100%)</span>
            </div>

            <div className="space-y-2.5">
              {Object.entries(scores).map(([trait, score]) => {
                const traitKey = trait as keyof typeof TRAIT_LABELS;
                const percentage = Math.round((score / 25) * 100);
                const info = TRAIT_LABELS[traitKey];
                return (
                  <div key={trait}>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-[#4A3B32]">{info?.label || trait}</span>
                      <span className="text-[#6B5B50] tabular-nums">{score} / 25 ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-[#EADFD4] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: info?.color || themeColor
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Behavioral Insights */}
          {pet.aiPersonalityInsights && (
            <div className="p-4 rounded-2xl bg-[#F6EEFA] border border-[#E6D4EE] space-y-2">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-[#8E44AD]" />
                <h4 className="text-xs font-bold text-[#8E44AD] uppercase tracking-wider">
                  AI Behavioral Analysis & Care Recommendations
                </h4>
              </div>
              <p className="text-xs text-[#523A5B] leading-relaxed">
                {pet.aiPersonalityInsights}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenDiary();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#8EC5A4] hover:bg-[#72B58D] text-white font-bold text-xs shadow-md shadow-[#8EC5A4]/25 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <BookOpen className="w-4 h-4" />
              <span>Record First Adventure in Diary</span>
            </button>

            <button
              onClick={onClose}
              className="py-3 px-5 rounded-xl border border-[#D5C2B1] bg-white hover:bg-[#FAF4EE] text-[#4A3B32] font-bold text-xs transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
