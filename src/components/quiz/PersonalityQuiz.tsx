import React, { useState } from 'react';
import { Pet, TraitCategory, PersonalityScores } from '../../types/pet';
import { CAT_QUESTIONS, DOG_QUESTIONS, PERSONALITY_RESULTS, TRAIT_LABELS } from '../../data/quizData';
import { ArrowLeft, ArrowRight, Sparkles, Check, Heart } from 'lucide-react';
import { generatePersonalityInsights } from '../../services/aiService';

interface PersonalityQuizProps {
  pet: Pet;
  onClose: () => void;
  onComplete: (updatedPet: Pet) => void;
}

const ANSWER_OPTIONS = [
  { value: 1, label: "Not at all", color: "#E0D3C5" },
  { value: 2, label: "A little", color: "#D5C2B1" },
  { value: 3, label: "Sometimes", color: "#FFBE98" },
  { value: 4, label: "A lot", color: "#FF9F68" },
  { value: 5, label: "Very much", color: "#E27341" }
];

export const PersonalityQuiz: React.FC<PersonalityQuizProps> = ({
  pet,
  onClose,
  onComplete,
}) => {
  const questions = pet.type === 'cat' ? CAT_QUESTIONS : DOG_QUESTIONS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex) / questions.length) * 100);
  const themeColor = pet.type === 'cat' ? '#FF9F68' : '#8E44AD';

  const handleSelectAnswer = async (score: number) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = score;
    setAnswers(nextAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calculate scores
      await finishQuiz(nextAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const finishQuiz = async (finalAnswers: number[]) => {
    setIsAnalyzing(true);

    const scores: PersonalityScores = {
      social: 0,
      curious: 0,
      playful: 0,
      affection: 0
    };

    finalAnswers.forEach((ans, idx) => {
      const cat = questions[idx].category;
      scores[cat] += ans;
    });

    // Find highest scoring trait
    let dominantTrait: TraitCategory = 'social';
    let highestScore = -1;
    (Object.keys(scores) as TraitCategory[]).forEach((trait) => {
      if (scores[trait] > highestScore) {
        highestScore = scores[trait];
        dominantTrait = trait;
      }
    });

    const archetype = PERSONALITY_RESULTS[pet.type][dominantTrait];

    // Generate AI insights
    let aiInsights = '';
    try {
      aiInsights = await generatePersonalityInsights(pet, scores);
    } catch {
      aiInsights = 'Deeply affectionate and responsive to familiar routines.';
    }

    const updatedPet: Pet = {
      ...pet,
      personalityScores: scores,
      personalityName: archetype.name,
      personalityDescription: archetype.description,
      aiPersonalityInsights: aiInsights,
      updatedAt: new Date().toISOString()
    };

    setIsAnalyzing(false);
    onComplete(updatedPet);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-[#FFFDFB] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8DCD1] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div
          className="px-6 py-4 text-white flex items-center justify-between"
          style={{ backgroundColor: themeColor }}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{pet.type === 'cat' ? '🐱' : '🐶'}</span>
            <div>
              <h3 className="font-black text-base sm:text-lg tracking-tight">
                {pet.name.toUpperCase()}'S PERSONALITY ASSESSMENT
              </h3>
              <p className="text-[11px] text-white/80">
                20-Question Behavioral Psychology Matrix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-[#F0E5DB] h-2 w-full">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: themeColor
            }}
          />
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 flex flex-col justify-between">
          {isAnalyzing ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFF1E6] flex items-center justify-center mx-auto text-[#FF9F68] animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-[#4A3B32]">
                Computing {pet.name}'s Psychological Matrix...
              </h3>
              <p className="text-xs text-[#6B5B50] max-w-sm mx-auto">
                Synthesizing social affinity, curiosity levels, energy drives, and emotional attachment scores with behavioral AI models.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Question Meta */}
              <div className="flex items-center justify-between text-xs text-[#8A7465]">
                <span className="font-bold uppercase tracking-wider text-[#FF9F68]">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#FFF8F0] border border-[#EADFD4] font-semibold text-[#5A4636]">
                  {TRAIT_LABELS[currentQ.category]?.label} Domain
                </span>
              </div>

              {/* Question Text */}
              <div className="py-4">
                <h2 className="text-xl sm:text-2xl font-black text-[#4A3B32] text-center leading-snug">
                  "{currentQ.question}"
                </h2>
                <p className="text-center text-xs text-[#8A7465] mt-2">
                  How accurately does this describe {pet.name}'s natural behavior?
                </p>
              </div>

              {/* Answer Choices (1-5) */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
                {ANSWER_OPTIONS.map((opt) => {
                  const isSelected = answers[currentIndex] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectAnswer(opt.value)}
                      className={`p-3.5 rounded-2xl border text-center transition-all flex sm:flex-col items-center justify-between sm:justify-center gap-2 cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'border-[#4A3B32] bg-[#4A3B32] text-white shadow-md'
                          : 'border-[#E2D5C8] bg-white hover:bg-[#FFF8F0] hover:border-[#FF9F68] text-[#4A3B32]'
                      }`}
                    >
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                        isSelected ? 'bg-white text-[#4A3B32]' : 'bg-[#FFF8F0] text-[#5A4636]'
                      }`}>
                        {opt.value}
                      </span>
                      <span className="text-xs font-bold sm:mt-1">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          {!isAnalyzing && (
            <div className="pt-8 mt-6 border-t border-[#E8DCD1] flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  currentIndex === 0
                    ? 'opacity-30 cursor-not-allowed text-[#B5A496]'
                    : 'text-[#4A3B32] hover:bg-[#FAF4EE]'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex gap-1">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${
                      i < answers.length ? 'bg-[#FF9F68]' : 'bg-[#E0D3C5]'
                    }`}
                  />
                ))}
              </div>

              <span className="text-[11px] font-semibold text-[#8A7465]">
                {answers.filter(Boolean).length} answered
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
