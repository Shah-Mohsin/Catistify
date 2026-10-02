import React, { useState } from 'react';
import { Download, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenApkModal?: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenApkModal }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside installed standalone PWA, show gentle badge or open APK modal
  if (isInstalled) {
    return (
      <button
        onClick={onOpenApkModal}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#8EC5A4]/20 hover:bg-[#8EC5A4]/30 text-[#2B6E46] text-xs font-semibold transition-colors"
        title="App Installed"
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Installed</span>
      </button>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#FF9F68] to-[#E27341] hover:from-[#f58f55] hover:to-[#d66532] text-white text-xs font-bold shadow-md shadow-[#FF9F68]/20 transition-all active:scale-95"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D5C2B1] bg-white hover:bg-[#FAF4EE] text-[#4A3B32] text-xs font-semibold transition-colors"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#8E44AD]" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#E8DCD1]">
              <h3 className="text-base font-bold text-[#4A3B32]">Install on iPhone / iPad</h3>
              <p className="mt-2 text-xs text-[#6B5B50] leading-relaxed">
                1. Tap the <strong className="text-[#4A3B32]">Share</strong> icon at the bottom of Safari.<br />
                2. Scroll down and tap <strong className="text-[#4A3B32]">Add to Home Screen</strong>.<br />
                3. Tap <strong className="text-[#4A3B32]">Add</strong> at the top right to install Catistify.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-[#FF9F68] text-white py-2 text-xs font-bold hover:bg-[#f58f55] transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback: opens the APK & installation helper modal
  return (
    <button
      onClick={onOpenApkModal}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D5C2B1] bg-white hover:bg-[#FAF4EE] text-[#4A3B32] text-xs font-semibold transition-colors"
    >
      <Smartphone className="w-3.5 h-3.5 text-[#FF9F68]" />
      <span className="hidden sm:inline">Install APK</span>
    </button>
  );
};
