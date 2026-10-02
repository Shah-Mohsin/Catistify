import React, { useState, useEffect } from 'react';
import { Pet } from './types/pet';
import { UserAccount } from './types/auth';
import { loadPets, savePets, getActivePetId, setActivePetId, triggerAutomatedBackup, checkAndResetDailyQuests } from './services/storage';
import { getStoredUser, saveStoredUser, logSecurityEvent } from './services/authService';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { ApkInstallModal } from './components/common/ApkInstallModal';
import { PetList } from './components/pets/PetList';
import { PetDashboard } from './components/pets/PetDashboard';
import { PetProfileView } from './components/pets/PetProfileView';
import { AddPetModal } from './components/pets/AddPetModal';
import { PersonalityQuiz } from './components/quiz/PersonalityQuiz';
import { PersonalityResultModal } from './components/quiz/PersonalityResultModal';
import { PetDiary } from './components/diary/PetDiary';
import { DailyQuests } from './components/quests/DailyQuests';
import { CompareProfiles } from './components/compare/CompareProfiles';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { BackupSyncModal } from './components/backup/BackupSyncModal';
import { AISettingsModal } from './components/ai/AISettingsModal';

export default function App() {
  const [pets, setPets] = useState<Pet[]>(() => loadPets());
  const [activePetId, setCurrActivePetId] = useState<string | null>(() => getActivePetId() || (pets[0]?.id ?? null));
  const [currentTab, setCurrentTab] = useState<'pets' | 'dashboard' | 'compare' | 'analytics'>('pets');
  const [dashboardSubView, setDashboardSubView] = useState<'hub' | 'diary' | 'quests' | 'profile'>('hub');

  // Modals
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizResultPet, setQuizResultPet] = useState<Pet | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isAISettingsOpen, setIsAISettingsOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);

  // Auth & Cloud Sync
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getStoredUser());
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Active pet object
  const activePet = pets.find((p) => p.id === activePetId) || pets[0] || null;

  // Persist pets on changes
  useEffect(() => {
    savePets(pets);
  }, [pets]);

  // Persist active pet id
  useEffect(() => {
    setActivePetId(activePetId);
  }, [activePetId]);

  useEffect(() => {
    const refreshDailyQuests = () => {
      setPets((currentPets) => currentPets.map(checkAndResetDailyQuests));
    };

    document.addEventListener('visibilitychange', refreshDailyQuests);
    return () => document.removeEventListener('visibilitychange', refreshDailyQuests);
  }, []);

  // Cloud sync simulation
  const handleTriggerSync = async () => {
    setSyncStatus('syncing');
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { pets, activePetId } }),
      });
      if (!response.ok || !response.headers.get('content-type')?.includes('application/json')) {
        throw new Error('Sync service is unavailable');
      }
      setTimeout(() => {
        setSyncStatus('synced');
      }, 700);
    } catch {
      setSyncStatus('offline');
    }
  };

  const handleSelectPet = (pet: Pet) => {
    setCurrActivePetId(pet.id);
    setDashboardSubView('hub');
    setCurrentTab('dashboard');
  };

  const handleAddPet = (newPet: Pet) => {
    const updated = [newPet, ...pets];
    setPets(updated);
    setCurrActivePetId(newPet.id);
    setDashboardSubView('hub');
    setCurrentTab('dashboard');
    triggerAutomatedBackup(updated, `Created profile for ${newPet.name}`);
    logSecurityEvent(`Added new pet profile: ${newPet.name}`);
  };

  const handleDeletePet = (petId: string, petName: string) => {
    if (confirm(`Are you sure you want to delete ${petName}'s profile?\n\nThis will also remove their diary and personality records.`)) {
      const updated = pets.filter((p) => p.id !== petId);
      setPets(updated);
      if (activePetId === petId) {
        setCurrActivePetId(updated[0]?.id || null);
        setCurrentTab('pets');
      }
      triggerAutomatedBackup(updated, `Deleted profile ${petName}`);
    }
  };

  const handleUpdateActivePet = (updatedPet: Pet) => {
    const updated = pets.map((p) => (p.id === updatedPet.id ? updatedPet : p));
    setPets(updated);
  };

  const handleQuizComplete = (updatedPet: Pet) => {
    handleUpdateActivePet(updatedPet);
    setIsQuizOpen(false);
    setQuizResultPet(updatedPet);
  };

  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    saveStoredUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveStoredUser(null);
    logSecurityEvent('User logged out');
  };

  const handleUpdateUser = (user: UserAccount) => {
    setCurrentUser(user);
    saveStoredUser(user);
  };

  return (
    <div className="app-shell min-h-screen flex flex-col text-[#18212B] font-sans selection:bg-[#FF9F68]/20 selection:text-[#18212B]">
      {/* Top Bar Header adhering to Top Bar Contract */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'compare' && pets.length < 2) return;
          setCurrentTab(tab);
          if (tab === 'dashboard') setDashboardSubView('hub');
        }}
        hasActivePet={!!activePet}
        activePetName={activePet?.name}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenSync={() => setIsSyncModalOpen(true)}
        onOpenAISettings={() => setIsAISettingsOpen(true)}
        onOpenApkModal={() => setIsApkModalOpen(true)}
        user={currentUser}
        syncStatus={syncStatus}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {currentTab === 'pets' && (
          <PetList
            pets={pets}
            activePetId={activePetId}
            onSelectPet={handleSelectPet}
            onDeletePet={handleDeletePet}
            onOpenAddModal={() => setIsAddPetModalOpen(true)}
            onOpenCompare={() => setCurrentTab('compare')}
          />
        )}

        {currentTab === 'dashboard' && activePet && (
          <>
            {dashboardSubView === 'hub' && (
              <PetDashboard
                pet={activePet}
                onBackToPets={() => setCurrentTab('pets')}
                onOpenQuiz={() => setIsQuizOpen(true)}
                onOpenDiary={() => setDashboardSubView('diary')}
                onOpenQuests={() => setDashboardSubView('quests')}
                onOpenProfile={() => setDashboardSubView('profile')}
              />
            )}

            {dashboardSubView === 'diary' && (
              <PetDiary
                pet={activePet}
                onBack={() => setDashboardSubView('hub')}
                onUpdatePet={handleUpdateActivePet}
              />
            )}

            {dashboardSubView === 'quests' && (
              <DailyQuests
                pet={activePet}
                onBack={() => setDashboardSubView('hub')}
                onUpdatePet={handleUpdateActivePet}
              />
            )}

            {dashboardSubView === 'profile' && (
              <PetProfileView
                pet={activePet}
                onBack={() => setDashboardSubView('hub')}
                onUpdatePet={handleUpdateActivePet}
                onDeletePet={handleDeletePet}
              />
            )}
          </>
        )}

        {currentTab === 'compare' && (
          <CompareProfiles
            pets={pets}
            onBack={() => setCurrentTab('pets')}
          />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsDashboard
            pets={pets}
            onBack={() => setCurrentTab('pets')}
          />
        )}
      </main>

      {/* Mobile Ergonomic Bottom Tab Bar */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'compare' && pets.length < 2) return;
          setCurrentTab(tab);
          if (tab === 'dashboard') setDashboardSubView('hub');
        }}
        hasActivePet={!!activePet}
        activePetName={activePet?.name}
      />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />

      {/* Modals */}
      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={() => setIsAddPetModalOpen(false)}
        onAddPet={handleAddPet}
      />

      {isQuizOpen && activePet && (
        <PersonalityQuiz
          pet={activePet}
          onClose={() => setIsQuizOpen(false)}
          onComplete={handleQuizComplete}
        />
      )}

      {quizResultPet && (
        <PersonalityResultModal
          pet={quizResultPet}
          onClose={() => setQuizResultPet(null)}
          onOpenDiary={() => {
            setQuizResultPet(null);
            setDashboardSubView('diary');
            setCurrentTab('dashboard');
          }}
        />
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
      />

      <BackupSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        pets={pets}
        onPetsRestored={(restoredPets) => {
          setPets(restoredPets);
          if (restoredPets.length > 0) setCurrActivePetId(restoredPets[0].id);
        }}
        syncStatus={syncStatus}
        onTriggerSync={handleTriggerSync}
      />

      <AISettingsModal
        isOpen={isAISettingsOpen}
        onClose={() => setIsAISettingsOpen(false)}
      />

      <ApkInstallModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
}
