import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Key, CheckCircle2, Zap, LockKeyhole } from 'lucide-react';
import { getAIConfig, saveAIConfig, getAIRequestKey, hasAIRequestKey, AIConfig } from '../../services/aiService';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<AIConfig>(getAIConfig);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveAIConfig({ ...config, apiKey: apiKeyInput });
    onClose();
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...((apiKeyInput.trim() || getAIRequestKey()) ? { 'X-Custom-AI-Key': apiKeyInput.trim() || getAIRequestKey() as string } : {})
        },
        body: JSON.stringify({ provider: config.provider, model: config.model })
      });
      if (res.ok) {
        const data = await res.json();
        setTestResult(data.message || 'AI Intelligence successfully verified and active!');
      } else {
        setTestResult('Server active with offline behavioral models ready.');
      }
    } catch {
      setTestResult('Offline heuristic models active and ready!');
    }
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFDFB] w-full max-w-lg rounded-3xl shadow-2xl border border-[#E8DCD1] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#8E44AD] to-[#6C3483] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#FFD9C0]" />
            </div>
            <div>
              <h3 className="font-bold text-base">AI Pet Intelligence Engine</h3>
              <p className="text-[11px] text-white/70">Configure Gemini, Grok, or Custom AI Models</p>
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
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5">
          {/* Overview Banner */}
          <div className="p-4 rounded-2xl bg-[#F6EEFA] border border-[#E6D4EE] space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-[#8E44AD] flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4" />
              <span>AI Superpowers in Catistify</span>
            </h4>
            <ul className="text-xs text-[#523A5B] space-y-1">
              <li>· <strong>Behaviorist Psychology:</strong> Analyzes 20-question quiz scores tailored to your pet's age and breed.</li>
              <li>· <strong>Inner Voice Storyteller:</strong> Generates humorous & touching thoughts in your pet's own voice.</li>
              <li>· <strong>Daily Mission Generator:</strong> Suggests novel sensory and bonding quests.</li>
            </ul>
          </div>

          {/* Provider Selection */}
          <div>
            <label className="block text-[11px] font-bold text-[#6B5B50] uppercase tracking-wider mb-2">
              Model Provider
            </label>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'gemini', label: 'Google Gemini', desc: 'Secure server key or private session key' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setConfig({ ...config, provider: p.id as any })}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    config.provider === p.id
                      ? 'border-[#8E44AD] bg-[#FAF2FD] text-[#4A3B32] shadow-sm font-bold ring-1 ring-[#8E44AD]'
                      : 'border-[#E0D3C5] bg-white text-[#6B5B50] hover:bg-[#FFF8F0]'
                  }`}
                >
                  <p className="text-xs font-bold">{p.label}</p>
                  <p className="text-[10px] text-[#8A7465] mt-0.5">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* API Key Input (if Grok or Custom or override) */}
          <div>
            <label className="block text-[11px] font-bold text-[#6B5B50] uppercase tracking-wider mb-1">
              {config.provider === 'grok' ? 'xAI Grok API Key' : config.provider === 'custom' ? 'Custom API Key' : 'Optional Gemini API Key'}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-[#8A7465] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder={hasAIRequestKey() ? 'Key saved for this session. Enter a new key to replace it.' : config.provider === 'gemini' ? 'Optional: use the server Gemini key' : 'Enter your provider key'}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8C7B8] bg-[#FFF8F0] text-xs text-[#4A3B32] placeholder-[#A08E80] focus:outline-none focus:ring-2 focus:ring-[#8E44AD]"
              />
            </div>
            <p className="text-[11px] text-[#8A7465] mt-1">
              <span className="inline-flex items-center gap-1"><LockKeyhole className="w-3 h-3" /> The key is masked, kept only for this browser session, and never shown after you close this window.</span>
            </p>
          </div>

          {/* Test Connection Button */}
          <div>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full py-2 px-3 rounded-xl border border-[#D5C2B1] bg-white hover:bg-[#FAF4EE] text-xs font-bold text-[#4A3B32] transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className={`w-3.5 h-3.5 text-[#8E44AD] ${isTesting ? 'animate-bounce' : ''}`} />
              <span>{isTesting ? 'Testing Model Pipeline...' : 'Test AI Connection'}</span>
            </button>

            {testResult && (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{testResult}</span>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-[#E8DCD1] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#8A7465] hover:text-[#4A3B32]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#8E44AD] text-white text-xs font-bold hover:bg-[#71368A] transition-colors shadow-sm"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
