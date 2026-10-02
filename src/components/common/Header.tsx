import React from 'react';
import { PWAInstallButton } from './PWAInstallButton';
import { ShieldCheck, Cloud, User, Sparkles } from 'lucide-react';
import { UserAccount } from '../../types/auth';

interface HeaderProps {
  currentTab: 'pets' | 'dashboard' | 'compare' | 'analytics';
  onSelectTab: (tab: 'pets' | 'dashboard' | 'compare' | 'analytics') => void;
  activePetName?: string;
  hasActivePet: boolean;
  onOpenAuth: () => void;
  onOpenSync: () => void;
  onOpenAISettings: () => void;
  onOpenApkModal: () => void;
  user: UserAccount | null;
  syncStatus: 'synced' | 'syncing' | 'offline';
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  activePetName,
  hasActivePet,
  onOpenAuth,
  onOpenSync,
  onOpenAISettings,
  onOpenApkModal,
  user,
  syncStatus,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-black/10 px-4 sm:px-6 h-16 flex items-center justify-between transition-colors shadow-[0_10px_30px_rgba(24,33,43,0.06)]">
      {/* Zone 1: Single text element wordmark */}
      <button
        onClick={() => onSelectTab('pets')}
        className="brand-mark text-xl sm:text-2xl font-black tracking-tight text-[#18212B] hover:opacity-90 transition-opacity flex items-center gap-1.5 focus:outline-none"
      >
        <span>Catistify</span>
      </button>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#6B5B50]">
        <button
          onClick={() => onSelectTab('pets')}
          className={`transition-colors pb-1 border-b-2 ${
            currentTab === 'pets'
              ? 'border-[#FF9F68] text-[#4A3B32]'
              : 'border-transparent hover:text-[#4A3B32]'
          }`}
        >
          My Pets
        </button>

        {hasActivePet && (
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`transition-colors pb-1 border-b-2 ${
              currentTab === 'dashboard'
                ? 'border-[#8E44AD] text-[#4A3B32]'
                : 'border-transparent hover:text-[#4A3B32]'
            }`}
          >
            {activePetName ? `${activePetName}'s Space` : 'Active Pet'}
          </button>
        )}

        <button
          onClick={() => onSelectTab('compare')}
          className={`transition-colors pb-1 border-b-2 ${
            currentTab === 'compare'
              ? 'border-[#D8A7C7] text-[#4A3B32]'
              : 'border-transparent hover:text-[#4A3B32]'
          }`}
        >
          Compare
        </button>

        <button
          onClick={() => onSelectTab('analytics')}
          className={`transition-colors pb-1 border-b-2 ${
            currentTab === 'analytics'
              ? 'border-[#8EC5A4] text-[#4A3B32]'
              : 'border-transparent hover:text-[#4A3B32]'
          }`}
        >
          Analytics
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sync & Backup status button */}
        <button
          onClick={onOpenSync}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#E0D3C5] bg-white hover:bg-[#FAF4EE] text-xs font-medium text-[#5A4636] transition-colors"
          title="Cross-platform sync & automated backups"
        >
          <Cloud className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-[#FF9F68]' : 'text-[#8EC5A4]'}`} />
          <span className="hidden lg:inline">
            {syncStatus === 'syncing' ? 'Syncing...' : 'Sync & Backup'}
          </span>
        </button>

        {/* AI Settings Trigger */}
        <button
          onClick={onOpenAISettings}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#E0D3C5] bg-white hover:bg-[#FAF4EE] text-xs font-medium text-[#8E44AD] transition-colors"
          title="AI Intelligence & Models (Gemini / Grok)"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#8E44AD]" />
          <span className="hidden lg:inline">AI Brain</span>
        </button>

        {/* In-App Install Prompt / APK trigger */}
        <PWAInstallButton onOpenApkModal={onOpenApkModal} />

        {/* User Account / 2FA Status */}
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-xl bg-white border border-[#E0D3C5] hover:bg-[#FAF4EE] text-xs font-semibold text-[#4A3B32] transition-colors"
        >
          <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#FF9F68] to-[#8E44AD] flex items-center justify-center text-white text-[10px] font-bold">
            {user ? user.name.charAt(0).toUpperCase() : <User className="w-3 h-3 text-white" />}
          </div>
          <span className="hidden sm:inline max-w-[80px] truncate">
            {user ? user.name : 'Account'}
          </span>
          {user?.mfaEnabled && (
            <span title="2FA MFA Active">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
