import React, { useState } from 'react';
import { Pet, TraitCategory } from '../../types/pet';
import { Scale, Check, ArrowLeft, Sparkles, HeartHandshake, HelpCircle } from 'lucide-react';
import { TRAIT_LABELS } from '../../data/quizData';

interface CompareProfilesProps {
  pets: Pet[];
  onBack: () => void;
}

export const CompareProfiles: React.FC<CompareProfilesProps> = ({ pets, onBack }) => {
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>(() => {
    // Select first two by default
    return pets.slice(0, 2).map(p => p.id);
  });

  const toggleSelectPet = (id: string) => {
    if (selectedPetIds.includes(id)) {
      if (selectedPetIds.length <= 2) {
        alert('Please keep at least two pets selected for comparison.');
        return;
      }
      setSelectedPetIds(selectedPetIds.filter(pid => pid !== id));
    } else {
      setSelectedPetIds([...selectedPetIds, id]);
    }
  };

  const selectedPets = pets.filter(p => selectedPetIds.includes(p.id));

  // Analyze similarities and differences (upgraded from python logic)
  const similarities: string[] = [];
  const differences: string[] = [];

  if (selectedPets.length >= 2) {
    // Check species
    const types = selectedPets.map(p => p.type);
    if (types.every(t => t === types[0])) {
      similarities.push(`All selected pets are ${types[0]}s.`);
    } else {
      differences.push(`Species mix: ${selectedPets.map(p => `${p.name} (${p.type})`).join(', ')}.`);
    }

    // Check Breeds
    const breeds = selectedPets.map(p => p.breed.trim().toLowerCase());
    if (breeds[0] && breeds.every(b => b === breeds[0])) {
      similarities.push(`All selected pets share the exact same breed: ${selectedPets[0].breed}.`);
    }

    // Check Genders
    const genders = selectedPets.map(p => p.gender.trim().toLowerCase());
    if (genders.every(g => g === genders[0])) {
      similarities.push(`All selected pets are ${selectedPets[0].gender}.`);
    }

    // Dominant personality
    const dominantPersonalities = selectedPets.map(p => {
      if (!p.personalityScores) return null;
      return Object.entries(p.personalityScores).sort((a, b) => b[1] - a[1])[0][0];
    });

    if (dominantPersonalities.every(d => d && d === dominantPersonalities[0])) {
      similarities.push(`All selected pets share the same dominant trait: ${dominantPersonalities[0]?.toUpperCase()}.`);
    } else if (dominantPersonalities.some(Boolean)) {
      differences.push(
        `Dominant traits vary: ${selectedPets.map(p => `${p.name} (${p.personalityName || 'untested'})`).join(', ')}.`
      );
    }

    // Trait score variance
    const traits: TraitCategory[] = ['social', 'curious', 'playful', 'affection'];
    traits.forEach(trait => {
      const scores = selectedPets
        .map(p => p.personalityScores ? Math.round((p.personalityScores[trait] / 25) * 100) : null)
        .filter((s): s is number => s !== null);

      if (scores.length >= 2) {
        const diff = Math.max(...scores) - Math.min(...scores);
        if (diff <= 15) {
          similarities.push(`Similar ${TRAIT_LABELS[trait].label} drive (difference ≤ ${diff}%).`);
        } else if (diff >= 25) {
          differences.push(`${TRAIT_LABELS[trait].label} levels differ significantly by ${diff} percentage points.`);
        }
      }
    });

    if (similarities.length === 0) {
      similarities.push('These pets have distinct profiles with unique individual temperaments.');
    }
    if (differences.length === 0) {
      differences.push('These pets have remarkably uniform behavioral indicators.');
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 animate-fade-in space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E0D3C5] hover:bg-[#FAF4EE] text-xs font-bold text-[#4A3B32] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>My Pets</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#D8A7C7]">
            Profile Comparison Matrix
          </span>
          <p className="text-[11px] text-[#8A7465]">Discover shared traits & unique differences</p>
        </div>
      </div>

      {/* Pet Selector Chips */}
      <div className="bg-white p-4 rounded-3xl border border-[#EADFD4] shadow-sm space-y-2">
        <span className="text-[11px] font-bold text-[#8A7465] uppercase tracking-wider">
          Select pets to compare (minimum 2):
        </span>
        <div className="flex flex-wrap gap-2 pt-1">
          {pets.map((p) => {
            const isSelected = selectedPetIds.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleSelectPet(p.id)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold border transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'border-[#D8A7C7] bg-[#FAF0F6] text-[#692E54] shadow-sm ring-1 ring-[#D8A7C7]/30'
                    : 'border-[#E0D3C5] bg-white text-[#5A4636] hover:bg-[#FFF8F0]'
                }`}
              >
                <span>{p.type === 'cat' ? '🐱' : '🐶'}</span>
                <span>{p.name}</span>
                <span className="text-[10px] text-[#8A7465]">({p.breed})</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#D8A7C7]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-side Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedPets.map((pet) => (
          <div
            key={pet.id}
            className="bg-white rounded-3xl p-5 border border-[#EADFD4] shadow-sm text-center"
          >
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#FFF1E6] mx-auto mb-2 border border-[#E8DCD1] flex items-center justify-center text-3xl">
              {pet.profilePicture ? (
                <img src={pet.profilePicture} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                <span>{pet.type === 'cat' ? '🐱' : '🐶'}</span>
              )}
            </div>

            <h3 className="font-black text-lg text-[#4A3B32]">{pet.name}</h3>
            <p className="text-xs text-[#8A7465] mt-0.5">
              {pet.type.toUpperCase()} · {pet.breed}
            </p>

            <div className="mt-3 p-2 rounded-xl bg-[#FFF8F0] border border-[#EFE5DC] text-xs">
              <span className="font-bold text-[#4A3B32]">
                {pet.personalityName || 'Quiz Not Taken'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Details Table */}
      <div className="bg-white rounded-3xl p-6 border border-[#EADFD4] shadow-sm space-y-6">
        <div>
          <h3 className="font-black text-base text-[#4A3B32] uppercase tracking-wider mb-3">
            Profile Details Comparison
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#F2E8DF] text-[#8A7465]">
                  <th className="py-2.5 px-3 font-bold uppercase">Attribute</th>
                  {selectedPets.map(p => (
                    <th key={p.id} className="py-2.5 px-3 font-bold text-[#4A3B32]">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7EFE9] text-[#5A4636]">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-[#8A7465]">Type</td>
                  {selectedPets.map(p => (
                    <td key={p.id} className="py-2.5 px-3 font-bold capitalize">
                      {p.type === 'cat' ? '🐱 Cat' : '🐶 Dog'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-[#8A7465]">Age</td>
                  {selectedPets.map(p => (
                    <td key={p.id} className="py-2.5 px-3">{p.age}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-[#8A7465]">Breed</td>
                  {selectedPets.map(p => (
                    <td key={p.id} className="py-2.5 px-3">{p.breed}</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-[#8A7465]">Gender</td>
                  {selectedPets.map(p => (
                    <td key={p.id} className="py-2.5 px-3">{p.gender}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Personality Traits Table */}
        <div className="pt-4 border-t border-[#F2E8DF]">
          <h3 className="font-black text-base text-[#4A3B32] uppercase tracking-wider mb-3">
            Personality Trait Scores (%)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#F2E8DF] text-[#8A7465]">
                  <th className="py-2.5 px-3 font-bold uppercase">Trait Dimension</th>
                  {selectedPets.map(p => (
                    <th key={p.id} className="py-2.5 px-3 font-bold text-[#4A3B32]">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F7EFE9] text-[#5A4636]">
                {(['social', 'curious', 'playful', 'affection'] as TraitCategory[]).map(trait => (
                  <tr key={trait}>
                    <td className="py-2.5 px-3 font-bold text-[#4A3B32]">
                      {TRAIT_LABELS[trait].label}
                    </td>
                    {selectedPets.map(p => {
                      const score = p.personalityScores ? p.personalityScores[trait] : null;
                      const pct = score !== null ? Math.round((score / 25) * 100) : null;
                      return (
                        <td key={p.id} className="py-2.5 px-3 tabular-nums font-semibold">
                          {pct !== null ? `${pct}% (${score}/25)` : 'No Quiz Data'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Similarities & Differences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#F2E8DF]">
          {/* Similarities Box */}
          <div className="p-4 rounded-2xl bg-[#EDF7F1] border border-[#D5EFE0] space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#2E6B47] flex items-center gap-1.5">
              <span>✦ Key Similarities</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-[#2A573D]">
              {similarities.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#8EC5A4] font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Differences Box */}
          <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#EFE5DC] space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#8A5A36] flex items-center gap-1.5">
              <span>✦ Key Differences</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-[#6B4D36]">
              {differences.map((item, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-[#FF9F68] font-bold">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
