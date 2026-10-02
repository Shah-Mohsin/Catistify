import React, { useState } from 'react';
import { Pet, PetType } from '../../types/pet';
import { PetCard } from './PetCard';
import { Plus, Scale, Search, Sparkles } from 'lucide-react';

interface PetListProps {
  pets: Pet[];
  activePetId: string | null;
  onSelectPet: (pet: Pet) => void;
  onDeletePet: (petId: string, petName: string) => void;
  onOpenAddModal: () => void;
  onOpenCompare: () => void;
}

export const PetList: React.FC<PetListProps> = ({
  pets,
  activePetId,
  onSelectPet,
  onDeletePet,
  onOpenAddModal,
  onOpenCompare,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'cat' | 'dog'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPets = pets.filter(pet => {
    const matchesType = filterType === 'all' || pet.type === filterType;
    const matchesSearch =
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 animate-fade-in">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="brand-mark text-4xl sm:text-6xl font-black text-[#18212B] tracking-tight">
          Your home, in focus.
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#5B6672] max-w-xl mx-auto leading-relaxed">
          A calmer, more beautiful way to understand the cats and dogs who make your family feel like family.
        </p>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="px-5 py-2.5 rounded-2xl bg-[#8EC5A4] hover:bg-[#72B58D] text-white font-bold text-xs shadow-md shadow-[#8EC5A4]/25 flex items-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Pet Profile</span>
          </button>

          <button
            onClick={onOpenCompare}
            disabled={pets.length < 2}
            className={`px-5 py-2.5 rounded-2xl font-bold text-xs border transition-all flex items-center gap-2 ${
              pets.length < 2
                ? 'bg-white/50 text-[#B8A798] border-[#E8DCD1] cursor-not-allowed'
                : 'bg-white text-[#4A3B32] border-[#D5C2B1] hover:bg-[#FAF4EE] shadow-sm active:scale-95'
            }`}
          >
            <Scale className="w-4 h-4 text-[#D8A7C7]" />
            <span>Compare Profiles ({pets.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="depth-surface flex flex-col sm:flex-row items-center justify-between gap-3 mb-6 bg-white/75 p-3 rounded-[1.5rem] border border-black/10">
        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-[#FFF8F0] rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-white text-[#4A3B32] shadow-sm'
                : 'text-[#8A7465] hover:text-[#4A3B32]'
            }`}
          >
            All Pets ({pets.length})
          </button>
          <button
            onClick={() => setFilterType('cat')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'cat'
                ? 'bg-white text-[#FF9F68] shadow-sm'
                : 'text-[#8A7465] hover:text-[#4A3B32]'
            }`}
          >
            🐱 Cats ({pets.filter(p => p.type === 'cat').length})
          </button>
          <button
            onClick={() => setFilterType('dog')}
            className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterType === 'dog'
                ? 'bg-white text-[#8E44AD] shadow-sm'
                : 'text-[#8A7465] hover:text-[#4A3B32]'
            }`}
          >
            🐶 Dogs ({pets.filter(p => p.type === 'dog').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#8A7465] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name or breed..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E0D3C5] bg-[#FFF8F0] text-xs text-[#4A3B32] placeholder-[#A08E80] focus:outline-none focus:ring-2 focus:ring-[#FF9F68]"
          />
        </div>
      </div>

      {/* Pet Cards Grid */}
      {filteredPets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              isActive={pet.id === activePetId}
              onOpenDashboard={onSelectPet}
              onDelete={onDeletePet}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-[#D8C7B8] p-8">
          <div className="w-16 h-16 rounded-full bg-[#FFF1E6] text-3xl flex items-center justify-center mx-auto mb-4">
            🐾
          </div>
          <h3 className="font-bold text-lg text-[#4A3B32]">No pet profiles found</h3>
          <p className="text-xs text-[#8A7465] mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No pets matched "${searchQuery}". Try clearing your search.`
              : 'Add your first furry companion to begin tracking personalities, memories and daily challenges.'}
          </p>
          <button
            onClick={onOpenAddModal}
            className="mt-5 px-5 py-2.5 rounded-xl bg-[#FF9F68] text-white font-bold text-xs hover:bg-[#f58f55] transition-colors"
          >
            + Create Pet Profile
          </button>
        </div>
      )}
    </div>
  );
};
