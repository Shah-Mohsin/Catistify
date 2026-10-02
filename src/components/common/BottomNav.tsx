import React from 'react';
import { Home, Sparkles, Scale, BarChart3 } from 'lucide-react';

interface BottomNavProps {
  currentTab: 'pets' | 'dashboard' | 'compare' | 'analytics';
  onSelectTab: (tab: 'pets' | 'dashboard' | 'compare' | 'analytics') => void;
  hasActivePet: boolean;
  activePetName?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  hasActivePet,
  activePetName,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDFB]/95 backdrop-blur-md border-t border-[#E8DCD1] pb-safe">
      <div className="grid grid-cols-4 items-center h-16">
        {/* Tab 1: Pets */}
        <button
          onClick={() => onSelectTab('pets')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'pets' ? 'text-[#FF9F68]' : 'text-[#8A7465] hover:text-[#4A3B32]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight mt-1">My Pets</span>
        </button>

        {/* Tab 2: Pet Dashboard */}
        <button
          onClick={() => onSelectTab('dashboard')}
          disabled={!hasActivePet}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            !hasActivePet
              ? 'opacity-40 cursor-not-allowed text-[#B5A496]'
              : currentTab === 'dashboard'
              ? 'text-[#8E44AD]'
              : 'text-[#8A7465] hover:text-[#4A3B32]'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight mt-1 truncate max-w-[70px]">
            {activePetName || 'Pet Space'}
          </span>
        </button>

        {/* Tab 3: Compare */}
        <button
          onClick={() => onSelectTab('compare')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'compare' ? 'text-[#D8A7C7]' : 'text-[#8A7465] hover:text-[#4A3B32]'
          }`}
        >
          <Scale className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight mt-1">Compare</span>
        </button>

        {/* Tab 4: Analytics */}
        <button
          onClick={() => onSelectTab('analytics')}
          className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
            currentTab === 'analytics' ? 'text-[#8EC5A4]' : 'text-[#8A7465] hover:text-[#4A3B32]'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight mt-1">Analytics</span>
        </button>
      </div>
    </nav>
  );
};
