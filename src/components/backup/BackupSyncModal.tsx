import React, { useState, useEffect } from 'react';
import { Pet, BackupSnapshot } from '../../types/pet';
import { Cloud, Download, Upload, RefreshCw, CheckCircle2, History, RotateCcw, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import { loadBackupSnapshots, exportBackupJSON, restoreBackupData, triggerAutomatedBackup } from '../../services/storage';

interface BackupSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  pets: Pet[];
  onPetsRestored: (pets: Pet[]) => void;
  syncStatus: 'synced' | 'syncing' | 'offline';
  onTriggerSync: () => void;
}

export const BackupSyncModal: React.FC<BackupSyncModalProps> = ({
  isOpen,
  onClose,
  pets,
  onPetsRestored,
  syncStatus,
  onTriggerSync,
}) => {
  const [snapshots, setSnapshots] = useState<BackupSnapshot[]>([]);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSnapshots(loadBackupSnapshots());
    }
  }, [isOpen, pets]);

  if (!isOpen) return null;

  const handleExport = () => {
    exportBackupJSON(pets);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          const result = restoreBackupData(parsed);
          if (result.success && result.pets) {
            onPetsRestored(result.pets);
            setRestoreMessage(result.message);
            setSnapshots(loadBackupSnapshots());
          } else {
            alert(result.message);
          }
        } catch (err: any) {
          alert('Failed to parse JSON file: ' + err.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleRollbackSnapshot = (snap: BackupSnapshot) => {
    if (confirm(`Roll back all pet profiles and diaries to snapshot from ${new Date(snap.timestamp).toLocaleString()}?`)) {
      if (snap.data?.pets) {
        const result = restoreBackupData(snap.data);
        if (result.success && result.pets) {
          onPetsRestored(result.pets);
          setRestoreMessage(`Restored to snapshot from ${new Date(snap.timestamp).toLocaleTimeString()}`);
          setSnapshots(loadBackupSnapshots());
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFDFB] w-full max-w-xl rounded-3xl shadow-2xl border border-[#E8DCD1] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#4A3B32] to-[#2E241E] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Cloud className="w-4 h-4 text-[#8EC5A4]" />
            </div>
            <div>
              <h3 className="font-bold text-base">Cross-Platform Sync & Backups</h3>
              <p className="text-[11px] text-white/70">Automated disaster recovery snapshots</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {restoreMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{restoreMessage}</span>
            </div>
          )}

          {/* Sync Status Card */}
          <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#EFE5DC] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#4A3B32]">
                <span className={`w-2.5 h-2.5 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-500' : syncStatus === 'syncing' ? 'bg-[#FF9F68] animate-pulse' : 'bg-amber-500'}`} />
                <span>Status: {syncStatus === 'synced' ? 'Synchronized & Backed Up' : syncStatus === 'syncing' ? 'Syncing...' : 'Local Cache Active'}</span>
              </div>
              <p className="text-[11px] text-[#8A7465] mt-1">
                Your data is continuously secured in local browser storage and mirrored during active sync.
              </p>
            </div>

            <button
              onClick={onTriggerSync}
              disabled={syncStatus === 'syncing'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#D5C2B1] hover:bg-[#FAF4EE] text-xs font-bold text-[#4A3B32] shadow-sm transition-all active:scale-95 disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FF9F68] ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>Sync Now</span>
            </button>
          </div>

          {/* Export & Import Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExport}
              className="p-4 rounded-2xl bg-white border border-[#E0D3C5] hover:border-[#FF9F68] hover:shadow-md transition-all text-left flex items-start gap-3 group"
            >
              <div className="p-2 rounded-xl bg-[#FFF1E6] text-[#FF9F68] group-hover:scale-110 transition-transform">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#4A3B32]">Download Backup File</h4>
                <p className="text-[11px] text-[#8A7465] mt-0.5">
                  Export <code>.json</code> bundle with all {pets.length} pets, diaries, and quizzes.
                </p>
              </div>
            </button>

            <label className="p-4 rounded-2xl bg-white border border-[#E0D3C5] hover:border-[#8E44AD] hover:shadow-md transition-all text-left flex items-start gap-3 group cursor-pointer">
              <div className="p-2 rounded-xl bg-[#F6EEFA] text-[#8E44AD] group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#4A3B32]">Restore From File</h4>
                <p className="text-[11px] text-[#8A7465] mt-0.5">
                  Upload previously exported Catistify backup file.
                </p>
                <input
                  type="file"
                  accept=".json,application/json"
                  className="hidden"
                  onChange={handleFileImport}
                />
              </div>
            </label>
          </div>

          {/* Automated Backup History Snapshots */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#F2E8DF] pb-2">
              <div className="flex items-center gap-1.5">
                <History className="w-4 h-4 text-[#8EC5A4]" />
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#4A3B32]">
                  Automated Rollback Snapshots ({snapshots.length})
                </h4>
              </div>
              <span className="text-[10px] text-[#8A7465]">Rolling 10 auto-saves</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {snapshots.length > 0 ? (
                snapshots.map((snap) => (
                  <div
                    key={snap.id}
                    className="p-3 rounded-xl bg-white border border-[#E8DCD1] hover:border-[#D5C2B1] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-[#4A3B32]">
                        {new Date(snap.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(snap.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <p className="text-[11px] text-[#8A7465]">
                        {snap.petsCount} pet profile(s) · {snap.entriesCount} diary entries · {snap.notes || 'Auto-save'}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRollbackSnapshot(snap)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#FFF8F0] hover:bg-[#FFEADA] text-[#FF9F68] font-bold text-[11px] transition-colors shrink-0"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#8A7465] text-center py-4">
                  No automated snapshots recorded yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFF8F0] border-t border-[#E8DCD1] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white border border-[#D5C2B1] hover:bg-[#F9F3ED] text-[#4A3B32] font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
