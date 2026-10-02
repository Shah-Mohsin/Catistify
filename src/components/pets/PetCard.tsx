import React from 'react';
import { Pet } from '../../types/pet';
import { BookOpen, CheckCircle, Trash2, ArrowRight } from 'lucide-react';

interface PetCardProps {
  pet: Pet;
  isActive: boolean;
  onOpenDashboard: (pet: Pet) => void;
  onDelete: (petId: string, petName: string) => void;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  isActive,
  onOpenDashboard,
  onDelete,
}) => {
  const isCat = pet.type === 'cat';
  const themeColor = isCat ? '#FF9F68' : '#8E44AD';
  const completedQuests = (pet.dailyQuests || []).filter(q => q.completed).length;
  const totalQuests = (pet.dailyQuests || []).length;
  const diaryCount = (pet.diary || []).length;

  return (
    <div
      className={`group relative bg-white rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between ${
        isActive
          ? 'border-[#FF9F68] shadow-lg shadow-[#FF9F68]/10 ring-2 ring-[#FF9F68]/20'
          : 'border-[#EADFD4] hover:border-[#D5C2B1] shadow-sm hover:shadow-md'
      }`}
    >
      <div>
        {/* Top: Avatar & Type Tag */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#FFF1E6] flex items-center justify-center border border-[#E8DCD1] text-3xl">
              {pet.profilePicture ? (
                <img
                  src={pet.profilePicture}
                  alt={pet.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to emoji if image fails to load
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : null}
              {/* Fallback emoji */}
              <span className={pet.profilePicture ? 'hidden' : 'block'}>
                {isCat ? '🐱' : '🐶'}
              </span>
            </div>
            {isActive && (
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md bg-[#FF9F68] text-white text-[9px] font-bold uppercase tracking-wider shadow">
                Active
              </span>
            )}
          </div>

          <div className="text-right">
            <span
              className="text-xs font-black uppercase tracking-wider"
              style={{ color: themeColor }}
            >
              {pet.type}
            </span>
            <p className="text-xs text-[#8A7465] mt-0.5">
              {pet.gender}
            </p>
          </div>
        </div>

        {/* Pet Name & Bio */}
        <h3 className="text-xl font-black text-[#4A3B32] group-hover:text-[#2E241E] transition-colors">
          {pet.name}
        </h3>
        
        <p className="text-xs text-[#6B5B50] font-medium mt-1">
          {pet.breed || 'Unknown breed'} <span className="text-[#C5B5A6]">·</span> Age {pet.age}
        </p>

        {/* Personality Archetype */}
        <div className="mt-3.5 p-2.5 rounded-2xl bg-[#FFF8F0] border border-[#EFE5DC]">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A7465]">
            Personality Archetype
          </p>
          <p className="text-xs font-bold text-[#4A3B32] mt-0.5 truncate">
            {pet.personalityName ? pet.personalityName : 'Quiz not completed yet'}
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#F2E8DF] text-xs text-[#6B5B50]">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#8EC5A4]" />
            <span className="tabular-nums font-semibold text-[#4A3B32]">{completedQuests}/{totalQuests}</span>
            <span className="text-[11px] text-[#8A7465]">quests</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#8E44AD]" />
            <span className="tabular-nums font-semibold text-[#4A3B32]">{diaryCount}</span>
            <span className="text-[11px] text-[#8A7465]">diaries</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 space-y-2">
        <button
          onClick={() => onOpenDashboard(pet)}
          className="w-full py-2.5 px-4 rounded-xl text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ backgroundColor: themeColor }}
        >
          <span>Open Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDelete(pet.id, pet.name)}
          className="w-full py-1.5 px-3 rounded-lg text-[#C0392B] hover:bg-[#FDEDEC] text-[11px] font-semibold transition-colors flex items-center justify-center gap-1.5 opacity-70 hover:opacity-100"
        >
          <Trash2 className="w-3 h-3" />
          <span>Delete Profile</span>
        </button>
      </div>
    </div>
  );
};
