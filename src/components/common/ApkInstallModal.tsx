import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle2, X, Terminal, ExternalLink, ShieldCheck, Copy, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface ApkInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkInstallModal: React.FC<ApkInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install, isAndroid, isIOS } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'apk_builder'>('android');
  const [installSuccess, setInstallSuccess] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  if (!isOpen) return null;

  const handleDirectInstall = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFDFB] w-full max-w-xl rounded-2xl shadow-2xl border border-[#E8DCD1] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#FF9F68] to-[#8E44AD] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Install Catistify</h3>
              <p className="text-xs text-white/80">Install Catistify on your phone or build a native APK</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/25 flex items-center justify-center transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex border-b border-[#E8DCD1] bg-[#FFF8F0] px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('android')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'android'
                ? 'border-[#FF9F68] text-[#4A3B32]'
                : 'border-transparent text-[#8A7465] hover:text-[#4A3B32]'
            }`}
          >
            <Smartphone className="w-4 h-4 inline-block mr-1.5 align-text-bottom" /> Android 1-Tap (WebAPK)
          </button>
          <button
            onClick={() => setActiveTab('apk_builder')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'apk_builder'
                ? 'border-[#8E44AD] text-[#4A3B32]'
                : 'border-transparent text-[#8A7465] hover:text-[#4A3B32]'
            }`}
          >
            <Download className="w-4 h-4 inline-block mr-1.5 align-text-bottom" /> Standalone .APK File
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-[#4A3B32] text-sm">
          {activeTab === 'android' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#FFF1E6] border border-[#FFD9C0]">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#FF9F68] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-[#4A3B32]">Native Android Experience</h4>
                    <p className="text-xs text-[#6B5B50] mt-1">
                      Installing directly on your Android phone creates a native <strong>WebAPK</strong> in your app drawer. It operates completely fullscreen without browser URL bars and works offline with automatic background sync!
                    </p>
                  </div>
                </div>
              </div>

              {isInstalled ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Catistify is already installed on this device!</p>
                    <p className="text-xs text-emerald-700">Open it anytime directly from your Home Screen or App Drawer.</p>
                  </div>
                </div>
              ) : isInstallable ? (
                <button
                  onClick={handleDirectInstall}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#FF9F68] to-[#E27341] hover:from-[#f58f55] hover:to-[#d66532] text-white font-bold text-sm shadow-lg shadow-[#FF9F68]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                >
                  <Download className="w-5 h-5" />
                  <span>Install App on My Android Device</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs text-[#8A7465]">
                    To install directly on Android using Chrome / Brave / Edge:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-[#5A4636] bg-[#FFF8F0] p-4 rounded-xl border border-[#E8DCD1]">
                    <li>Open this URL on your phone's browser (e.g. Chrome).</li>
                    <li>Tap the <strong>three dots menu (⋮)</strong> at the top right of Chrome.</li>
                    <li>Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                    <li>The Catistify icon will appear in your launcher as a standalone native app!</li>
                  </ol>
                </div>
              )}

              {isIOS && (
                <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-xs">
                  <strong>On iPhone / iPad:</strong> Tap Safari's <strong>Share</strong> button (box with upward arrow), scroll down and tap <strong>"Add to Home Screen"</strong>.
                </div>
              )}
            </div>
          )}

          {activeTab === 'apk_builder' && (
            <div className="space-y-4">
              <p className="text-xs text-[#6B5B50]">
                A browser cannot create and download a signed Android binary by itself. Use the live builder below for a real <code>.apk</code>, or use the Capacitor commands for a fully native Android Studio build.
              </p>

              <div className="p-4 rounded-xl bg-[#F6F0FA] border border-[#E4D5EE] space-y-3">
                <h4 className="font-bold text-sm text-[#4A3B32] flex items-center gap-2">
                  <span>Method 1: Instant APK with PWABuilder (No Code)</span>
                </h4>
                <p className="text-xs text-[#6B5B50]">
                  Microsoft PWABuilder packages this live app into a signed Android APK package in 30 seconds:
                </p>
                <a
                  href={`https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(window.location.origin)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8E44AD] hover:bg-[#783693] text-white text-xs font-semibold transition-colors"
                >
                  <span>Build APK from this site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> Method 2: Local Android Studio Build</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText('npm run build && npx cap add android && npx cap sync android && npx cap open android');
                      setCopiedCommand(true);
                      setTimeout(() => setCopiedCommand(false), 1600);
                    }}
                    className="inline-flex items-center gap-1 text-slate-300 hover:text-white"
                    title="Copy build commands"
                  >
                    {copiedCommand ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCommand ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-black/50 p-2.5 rounded-lg space-y-1 overflow-x-auto text-[11px]">
                  <p className="text-emerald-400"># 1. Build web distribution</p>
                  <p>npm run build</p>
                  <p className="text-emerald-400 mt-2"># 2. Add Android platform & sync</p>
                  <p>npx cap add android</p>
                  <p>npx cap sync android</p>
                  <p className="text-emerald-400 mt-2"># 3. Open in Android Studio to build APK</p>
                  <p>npx cap open android</p>
                </div>
              </div>
            </div>
          )}

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
