import React, { useState } from 'react';
import { Pet, PetType, Gender } from '../../types/pet';
import { X, Upload, Sparkles, AlertCircle } from 'lucide-react';
import { getDefaultDailyQuests } from '../../services/storage';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPet: (pet: Pet) => void;
}

const PRESET_AVATARS: Record<PetType, string[]> = {
  cat: [
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=400&q=80"
  ],
  dog: [
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80"
  ]
};

export const AddPetModal: React.FC<AddPetModalProps> = ({
  isOpen,
  onClose,
  onAddPet,
}) => {
  const [step, setStep] = useState<'type_selection' | 'details'>('type_selection');
  const [type, setType] = useState<PetType>('cat');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<Gender>('Male');
  const [profilePicture, setProfilePicture] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectType = (selectedType: PetType) => {
    setType(selectedType);
    setProfilePicture(PRESET_AVATARS[selectedType][0]);
    setStep('details');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your pet\'s name');
      return;
    }
    if (!age.trim()) {
      setError('Please specify pet age (e.g. "2 years" or "6 months")');
      return;
    }
    if (!breed.trim()) {
      setError('Please enter the breed or mix');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const newPet: Pet = {
      id: `pet_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      type,
      name: name.trim(),
      age: age.trim(),
      breed: breed.trim(),
      gender,
      profilePicture: profilePicture || PRESET_AVATARS[type][0],
      personalityScores: { social: 0, curious: 0, playful: 0, affection: 0 },
      personalityName: '',
      personalityDescription: '',
      diary: [],
      dailyQuests: [],
      dailyQuestDate: today,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    newPet.dailyQuests = getDefaultDailyQuests(newPet);

    onAddPet(newPet);
    // Reset state
    setStep('type_selection');
    setName('');
    setAge('');
    setBreed('');
    setGender('Male');
    setProfilePicture('');
    setError(null);
    onClose();
  };

  const themeColor = type === 'cat' ? '#FF9F68' : '#8E44AD';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFDFB] w-full max-w-lg rounded-3xl shadow-2xl border border-[#E8DCD1] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div
          className="px-6 py-5 text-white flex items-center justify-between"
          style={{
            backgroundColor: step === 'type_selection' ? '#FF9F68' : themeColor,
          }}
        >
          <div>
            <h3 className="font-black text-xl tracking-tight">
              {step === 'type_selection' ? 'Add a Pet' : `New ${type.toUpperCase()} Profile`}
            </h3>
            <p className="text-xs text-white/80 mt-0.5">
              {step === 'type_selection'
                ? 'Select your pet species to begin personality tracking'
                : `Fill in ${name ? name : "your pet"}'s identity details`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {step === 'type_selection' ? (
            <div className="space-y-6 py-2">
              <p className="text-center text-sm text-[#6B5B50]">
                Each pet gets a completely independent profile, personality quiz, daily missions, and memory diary.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleSelectType('cat')}
                  className="group p-6 rounded-3xl bg-white border-2 border-[#FFE2D1] hover:border-[#FF9F68] hover:shadow-lg transition-all flex flex-col items-center text-center cursor-pointer active:scale-95"
                >
                  <span className="text-5xl group-hover:scale-110 transition-transform">🐱</span>
                  <span className="mt-4 font-black text-lg text-[#4A3B32]">Cat</span>
                  <span className="text-xs text-[#8A7465] mt-1">Feline personality matrix & quests</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectType('dog')}
                  className="group p-6 rounded-3xl bg-white border-2 border-[#E9D6F3] hover:border-[#8E44AD] hover:shadow-lg transition-all flex flex-col items-center text-center cursor-pointer active:scale-95"
                >
                  <span className="text-5xl group-hover:scale-110 transition-transform">🐶</span>
                  <span className="mt-4 font-black text-lg text-[#4A3B32]">Dog</span>
                  <span className="text-xs text-[#8A7465] mt-1">Canine behavior tests & daily adventures</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Picture Selection */}
              <div>
                <label className="block text-xs font-bold text-[#5A4636] uppercase tracking-wider mb-2">
                  Pet Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#FFF1E6] border border-[#E8DCD1] shrink-0 flex items-center justify-center text-3xl">
                    {profilePicture ? (
                      <img src={profilePicture} alt="Pet Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span>{type === 'cat' ? '🐱' : '🐶'}</span>
                    )}
                  </div>

                  <div className="space-y-2 flex-1">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D5C2B1] bg-white hover:bg-[#FAF4EE] text-xs font-bold text-[#4A3B32] cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="text-[11px] text-[#8A7465]">
                      Or choose a preset avatar:
                    </p>
                    <div className="flex gap-2">
                      {PRESET_AVATARS[type].map((avatarUrl, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setProfilePicture(avatarUrl)}
                          className={`w-8 h-8 rounded-lg overflow-hidden border-2 transition-all ${
                            profilePicture === avatarUrl ? 'border-[#FF9F68] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={avatarUrl} alt="preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#5A4636] uppercase tracking-wider mb-1">
                  Pet Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Luna, Milo, Oliver"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D8C7B8] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9F68] text-sm text-[#4A3B32]"
                />
              </div>

              {/* Age & Breed */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5A4636] uppercase tracking-wider mb-1">
                    Age *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 years, 8 months"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8C7B8] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9F68] text-sm text-[#4A3B32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#5A4636] uppercase tracking-wider mb-1">
                    Breed *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Persian, Golden Retriever"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D8C7B8] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF9F68] text-sm text-[#4A3B32]"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-[#5A4636] uppercase tracking-wider mb-1">
                  Gender
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Male', 'Female', 'Unknown'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        gender === g
                          ? 'border-[#4A3B32] bg-[#4A3B32] text-white'
                          : 'border-[#D8C7B8] bg-white text-[#5A4636] hover:bg-[#FAF4EE]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-[#E8DCD1]">
                <button
                  type="button"
                  onClick={() => setStep('type_selection')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#8A7465] hover:text-[#4A3B32]"
                >
                  ← Back to Type
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  style={{ backgroundColor: themeColor }}
                >
                  Save {type.toUpperCase()} Profile
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
