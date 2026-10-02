import React, { useState } from 'react';
import { Pet, Gender } from '../../types/pet';
import { ArrowLeft, Edit3, Check, Upload, Trash2, Calendar, Heart, Shield, Sparkles } from 'lucide-react';

interface PetProfileViewProps {
  pet: Pet;
  onBack: () => void;
  onUpdatePet: (updated: Pet) => void;
  onDeletePet: (petId: string, petName: string) => void;
}

export const PetProfileView: React.FC<PetProfileViewProps> = ({
  pet,
  onBack,
  onUpdatePet,
  onDeletePet,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(pet.name);
  const [age, setAge] = useState(pet.age);
  const [breed, setBreed] = useState(pet.breed);
  const [gender, setGender] = useState<Gender>(pet.gender);
  const [profilePicture, setProfilePicture] = useState(pet.profilePicture || '');

  const isCat = pet.type === 'cat';
  const themeColor = isCat ? '#FF9F68' : '#8E44AD';

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updated: Pet = {
      ...pet,
      name: name.trim() || pet.name,
      age: age.trim() || pet.age,
      breed: breed.trim() || pet.breed,
      gender,
      profilePicture,
      updatedAt: new Date().toISOString(),
    };
    onUpdatePet(updated);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 animate-fade-in space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E0D3C5] hover:bg-[#FAF4EE] text-xs font-bold text-[#4A3B32] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E0D3C5] hover:bg-[#FAF4EE] text-xs font-bold text-[#4A3B32] transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#FF9F68]" />
            <span>Edit Profile</span>
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        )}
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFD4] shadow-sm text-center">
        {/* Avatar */}
        <div className="relative inline-block mx-auto mb-4">
          <div className="w-32 h-32 rounded-3xl overflow-hidden bg-[#FFF1E6] border-2 border-[#E8DCD1] flex items-center justify-center text-5xl shadow-md">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={pet.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{isCat ? '🐱' : '🐶'}</span>
            )}
          </div>
          {isEditing && (
            <label className="absolute bottom-0 right-0 p-2 rounded-xl bg-[#4A3B32] text-white shadow hover:bg-black cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
          )}
        </div>

        {/* Name */}
        {!isEditing ? (
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#4A3B32]">
              {pet.name}
            </h1>
            <span
              className="inline-block mt-1 px-2.5 py-0.5 rounded-lg text-white text-[11px] font-black uppercase tracking-wider"
              style={{ backgroundColor: themeColor }}
            >
              {pet.type}
            </span>
          </div>
        ) : (
          <div className="max-w-xs mx-auto mb-4">
            <label className="block text-[11px] font-bold text-[#8A7465] uppercase mb-1">Pet Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D5C2B1] text-center font-bold text-lg text-[#4A3B32]"
            />
          </div>
        )}

        {/* Profile Details List */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          {/* Age */}
          <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#EFE5DC]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A7465]">Age</p>
            {!isEditing ? (
              <p className="text-sm font-bold text-[#4A3B32] mt-0.5">{pet.age}</p>
            ) : (
              <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full mt-1 px-2 py-1 rounded-lg border text-xs text-[#4A3B32] bg-white"
              />
            )}
          </div>

          {/* Breed */}
          <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#EFE5DC]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A7465]">Breed</p>
            {!isEditing ? (
              <p className="text-sm font-bold text-[#4A3B32] mt-0.5 truncate">{pet.breed}</p>
            ) : (
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full mt-1 px-2 py-1 rounded-lg border text-xs text-[#4A3B32] bg-white"
              />
            )}
          </div>

          {/* Gender */}
          <div className="p-3.5 rounded-2xl bg-[#FFF8F0] border border-[#EFE5DC]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A7465]">Gender</p>
            {!isEditing ? (
              <p className="text-sm font-bold text-[#4A3B32] mt-0.5">{pet.gender}</p>
            ) : (
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                className="w-full mt-1 px-2 py-1 rounded-lg border text-xs text-[#4A3B32] bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unknown">Unknown</option>
              </select>
            )}
          </div>
        </div>

        {/* Personality Badge in Profile */}
        <div className="mt-6 p-4 rounded-2xl bg-white border border-[#E0D3C5] text-left">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A7465]">
              Psychological Archetype
            </span>
            <span className="text-xs text-[#FF9F68] font-semibold">20-Question Matrix</span>
          </div>
          <p className="text-base font-black text-[#4A3B32] mt-1">
            {pet.personalityName || 'Quiz Not Taken Yet'}
          </p>
          <p className="text-xs text-[#6B5B50] mt-1">
            {pet.personalityDescription || 'Take the quiz from the dashboard to analyze psychological traits.'}
          </p>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 pt-6 border-t border-[#F2E8DF] flex justify-end">
          <button
            onClick={() => onDeletePet(pet.id, pet.name)}
            className="px-4 py-2 rounded-xl text-red-700 hover:bg-red-50 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Delete {pet.name}'s Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
