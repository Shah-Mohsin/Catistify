import React, { useState } from 'react';
import { Pet, DiaryEntry } from '../../types/pet';
import { ArrowLeft, BookOpen, Plus, Sparkles, Calendar, Search, Trash2, Heart, Smile, Sparkle, Camera, MessageSquareQuote } from 'lucide-react';
import { generateDiaryReflection } from '../../services/aiService';

interface PetDiaryProps {
  pet: Pet;
  onBack: () => void;
  onUpdatePet: (updated: Pet) => void;
}

const MOODS: { id: DiaryEntry['mood']; label: string; icon: string }[] = [
  { id: 'happy', label: 'Happy', icon: '😸' },
  { id: 'playful', label: 'Playful', icon: '🎾' },
  { id: 'curious', label: 'Curious', icon: '🧐' },
  { id: 'sleepy', label: 'Sleepy', icon: '😴' },
  { id: 'grumpy', label: 'Sassy/Grumpy', icon: '😼' }
];

export const PetDiary: React.FC<PetDiaryProps> = ({
  pet,
  onBack,
  onUpdatePet,
}) => {
  const isCat = pet.type === 'cat';
  const themeColor = isCat ? '#FF9F68' : '#8E44AD';

  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(todayStr);
  const [meetup, setMeetup] = useState('');
  const [activity, setActivity] = useState('');
  const [discovery, setDiscovery] = useState('');
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState<DiaryEntry['mood']>('happy');
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetup.trim() && !activity.trim() && !discovery.trim() && !notes.trim()) {
      alert('Please fill in at least one adventure detail (Meetup, Activity, Discovery or Notes).');
      return;
    }

    setIsGeneratingAI(true);
    let aiReflection = '';
    try {
      aiReflection = await generateDiaryReflection(pet, { meetup, activity, discovery, notes });
    } catch {
      aiReflection = `What a memorable day for ${pet.name}!`;
    }
    setIsGeneratingAI(false);

    const newEntry: DiaryEntry = {
      id: `entry_${Date.now()}`,
      date: date || todayStr,
      meetup: meetup.trim() || undefined,
      activity: activity.trim() || undefined,
      discovery: discovery.trim() || undefined,
      notes: notes.trim() || undefined,
      mood,
      photo,
      aiReflection,
      createdAt: new Date().toISOString()
    };

    const updatedDiary = [newEntry, ...(pet.diary || [])];
    const updatedPet: Pet = {
      ...pet,
      diary: updatedDiary,
      updatedAt: new Date().toISOString()
    };

    onUpdatePet(updatedPet);

    // Reset inputs
    setMeetup('');
    setActivity('');
    setDiscovery('');
    setNotes('');
    setPhoto(undefined);
    setSuccessMessage(`Saved adventure memory for ${pet.name}!`);
    setTimeout(() => setSuccessMessage(null), 3500);
  };

  const handleDeleteEntry = (entryId: string) => {
    if (!confirm('Are you sure you want to delete this diary entry?')) return;
    const updatedDiary = (pet.diary || []).filter(e => e.id !== entryId);
    onUpdatePet({
      ...pet,
      diary: updatedDiary,
      updatedAt: new Date().toISOString()
    });
  };

  const filteredEntries = (pet.diary || []).filter(e => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      e.meetup?.toLowerCase().includes(q) ||
      e.activity?.toLowerCase().includes(q) ||
      e.discovery?.toLowerCase().includes(q) ||
      e.notes?.toLowerCase().includes(q) ||
      e.date.includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 animate-fade-in space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#E0D3C5] hover:bg-[#FAF4EE] text-xs font-bold text-[#4A3B32] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Dashboard</span>
        </button>

        <div className="text-right">
          <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: themeColor }}>
            {pet.name}'s Adventure Log
          </span>
          <p className="text-[11px] text-[#8A7465]">Every day has a story.</p>
        </div>
      </div>

      {successMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between animate-fade-in">
          <span>{successMessage}</span>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Main 2-Column Layout (Form on Left, History on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: New Diary Entry Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-[#EADFD4] shadow-sm flex flex-col justify-between">
          <form onSubmit={handleSaveEntry} className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2E8DF] pb-3">
              <h3 className="font-black text-lg text-[#4A3B32] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#8EC5A4]" />
                <span>NEW DIARY ENTRY</span>
              </h3>
              <span className="text-[11px] font-bold text-[#8A7465]">
                {pet.name}
              </span>
            </div>

            {/* Date */}
            <div>
              <label className="block text-[11px] font-bold text-[#6B5B50] uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C7B8] bg-[#FFF8F0] text-xs font-medium text-[#4A3B32]"
              />
            </div>

            {/* Meetups */}
            <div>
              <label className="block text-[11px] font-bold text-[#6B5B50] uppercase tracking-wider mb-1">
                Meetups
              </label>
              <input
                type="text"
                placeholder="Who did your pet meet today? (friends, guests, pets)"
                value={meetup}
                onChange={(e) => setMeetup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C7B8] bg-[#FFF8F0] text-xs text-[#4A3B32] placeholder-[#A08E80]"
              />
            </div>

            {/* Activities */}
            <div>
              <label className="block text-[11px] font-bold text-[#6B5B50] uppercase tracking-wider mb-1">
                Activities
              </label>
              <input
                type="text"
                placeholder="What games or exercises did you do together?"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C7B8] bg-[#FFF8F0] text-xs text-[#4A3B32] placeholder-[#A08E80]"
              />
            </div>

            {/* New Objects / Discoveries */}
            <div>
              <label className="block text-[11px] font-bold text-[#6B5B50] uppercase tracking-wider mb-1">
                New Objects / Discoveries
              </label>
              <input
                type="text"
                placeholder="New toys, strange sounds, scents, or hiding spots..."
                value={discovery}
                onChange={(e) => setDiscovery(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C7B8] bg-[#FFF8F0] text-xs text-[#4A3B32] placeholder-[#A08E80]"
              />
            </div>

            {/* Mood Selector */}
            <div>
              <label className="block text-[11px] font-bold text-[#6B5B50] uppercase tracking-wider mb-1.5">
                Pet Mood Today
              </label>
              <div className="flex gap-1.5 flex-wrap">
                {MOODS.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-all ${
                      mood === m.id
                        ? 'border-[#4A3B32] bg-[#4A3B32] text-white shadow-sm'
                        : 'border-[#E0D3C5] bg-[#FFF8F0] text-[#5A4636] hover:bg-white'
                    }`}
                  >
                    <span>{m.icon}</span>
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-bold text-[#6B5B50] uppercase tracking-wider mb-1">
                Notes & Sweet Moments
              </label>
              <textarea
                rows={3}
                placeholder="Funny habits, purrs, barks, cuddle memories, or health observations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D8C7B8] bg-[#FFF8F0] text-xs text-[#4A3B32] placeholder-[#A08E80] resize-none"
              />
            </div>

            {/* Optional Photo Attachment */}
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D5C2B1] bg-white hover:bg-[#FAF4EE] text-xs font-bold text-[#4A3B32] cursor-pointer transition-colors">
                <Camera className="w-3.5 h-3.5 text-[#8EC5A4]" />
                <span>{photo ? 'Change Photo' : 'Attach Photo'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
              {photo && (
                <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#E8DCD1]">
                  <img src={photo} alt="Attached" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhoto(undefined)}
                    className="absolute inset-0 bg-black/40 text-white text-[10px] flex items-center justify-center opacity-0 hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGeneratingAI}
              className="w-full mt-4 py-3 px-4 rounded-xl text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
              style={{ backgroundColor: themeColor }}
            >
              {isGeneratingAI ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Translating Pet Thoughts with AI...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Save Diary Entry</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Diary History */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-[#EADFD4] shadow-sm flex flex-col">
          {/* Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2E8DF] pb-4 mb-4">
            <div>
              <h3 className="font-black text-lg text-[#4A3B32]">
                DIARY HISTORY
              </h3>
              <p className="text-xs text-[#8A7465]">
                {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} recorded
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-52">
              <Search className="w-3.5 h-3.5 text-[#8A7465] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search memories..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E0D3C5] bg-[#FFF8F0] text-xs text-[#4A3B32] placeholder-[#A08E80]"
              />
            </div>
          </div>

          {/* Entries Feed */}
          <div className="overflow-y-auto space-y-4 max-h-[640px] pr-1">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-2xl bg-[#FFFDFB] border border-[#EADFD4] hover:border-[#D5C2B1] transition-all space-y-3"
                >
                  {/* Top Entry Bar */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-[#4A3B32]">
                        {entry.date}
                      </span>
                      {entry.mood && (
                        <span className="text-base" title={`Mood: ${entry.mood}`}>
                          {MOODS.find(m => m.id === entry.mood)?.icon}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Optional Photo */}
                  {entry.photo && (
                    <div className="rounded-xl overflow-hidden max-h-48 border border-[#E8DCD1]">
                      <img src={entry.photo} alt="Adventure Moment" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Key Fields */}
                  <div className="space-y-1.5 text-xs text-[#5A4636]">
                    {entry.meetup && (
                      <p>
                        <strong className="text-[#4A3B32]">Meetups: </strong>
                        {entry.meetup}
                      </p>
                    )}
                    {entry.activity && (
                      <p>
                        <strong className="text-[#4A3B32]">Activities: </strong>
                        {entry.activity}
                      </p>
                    )}
                    {entry.discovery && (
                      <p>
                        <strong className="text-[#4A3B32]">New Discovery: </strong>
                        {entry.discovery}
                      </p>
                    )}
                    {entry.notes && (
                      <p className="pt-1 text-[#6B5B50] italic border-t border-[#F5EDE6]">
                        "{entry.notes}"
                      </p>
                    )}
                  </div>

                  {/* AI Pet Voice Reflection */}
                  {entry.aiReflection && (
                    <div className="p-3 rounded-xl bg-[#FFF1E6] border border-[#FFD9C0] flex items-start gap-2.5">
                      <MessageSquareQuote className="w-4 h-4 text-[#FF9F68] shrink-0 mt-0.5" />
                      <div className="text-xs text-[#6B4B38] italic">
                        {entry.aiReflection}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-[#FFF8F0] rounded-2xl border border-dashed border-[#D8C7B8] p-6">
                <BookOpen className="w-8 h-8 text-[#B8A798] mx-auto mb-2" />
                <h4 className="font-bold text-sm text-[#4A3B32]">No diary entries found</h4>
                <p className="text-xs text-[#8A7465] mt-1">
                  Fill in today's details on the left to start recording {pet.name}'s life story!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
