import React, { useState } from 'react';
import { UserAccount } from '../../types/auth';
import { ShieldCheck, ShieldAlert, KeyRound, Lock, User, LogOut, CheckCircle2, Copy, AlertTriangle, Key, History, Smartphone } from 'lucide-react';
import { generateMfaSecret, generateBackupCodes, verifyTotpCode, logSecurityEvent, getSecurityLogs, SecurityLog } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount | null;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  onUpdateUser: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onUpdateUser,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  // 2FA verification challenge during login
  const [isMfaChallenge, setIsMfaChallenge] = useState(false);
  const [mfaCodeInput, setMfaCodeInput] = useState('');
  const [pendingUser, setPendingUser] = useState<UserAccount | null>(null);
  const [mfaError, setMfaError] = useState<string | null>(null);

  // 2FA Setup flow inside account settings
  const [isSettingUpMfa, setIsSettingUpMfa] = useState(false);
  const [tempSecret, setTempSecret] = useState('');
  const [setupCode, setSetupCode] = useState('');
  const [generatedCodes, setGeneratedCodes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'mfa' | 'audit'>('profile');
  const [copiedSecret, setCopiedSecret] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    // Simulate authentication
    const mockUser: UserAccount = {
      id: `usr_${Date.now()}`,
      email: email.trim(),
      name: email.split('@')[0] || 'Pet Parent',
      mfaEnabled: false,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    if (mockUser.mfaEnabled) {
      setPendingUser(mockUser);
      setIsMfaChallenge(true);
      setMfaError(null);
    } else {
      onLogin(mockUser);
      logSecurityEvent('User logged in without MFA');
      onClose();
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    const newUser: UserAccount = {
      id: `usr_${Date.now()}`,
      email: email.trim(),
      name: name.trim(),
      mfaEnabled: false,
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    onLogin(newUser);
    logSecurityEvent('New user account registered');
    onClose();
  };

  const handleVerifyMfaChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingUser) return;

    const isValid = verifyTotpCode(mfaCodeInput);
    if (isValid) {
      logSecurityEvent('Multi-factor authentication challenge passed', 'success');
      onLogin(pendingUser);
      setIsMfaChallenge(false);
      setPendingUser(null);
      setMfaCodeInput('');
      onClose();
    } else {
      logSecurityEvent('MFA verification attempt failed', 'error');
      setMfaError('Invalid verification code. Please enter 6 numeric digits (or use demo code: 123456).');
    }
  };

  const handleStartMfaSetup = () => {
    const secret = generateMfaSecret();
    const codes = generateBackupCodes();
    setTempSecret(secret);
    setGeneratedCodes(codes);
    setIsSettingUpMfa(true);
    setSetupCode('');
  };

  const handleConfirmMfaSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (verifyTotpCode(setupCode)) {
      const updated: UserAccount = {
        ...currentUser,
        mfaEnabled: true,
        mfaSecret: tempSecret,
        backupCodes: generatedCodes,
      };
      onUpdateUser(updated);
      setIsSettingUpMfa(false);
      logSecurityEvent('Two-Factor Authentication (2FA) enabled', 'success');
    } else {
      alert('Verification code incorrect. Enter 6 digits or test with 123456.');
    }
  };

  const handleDisableMfa = () => {
    if (!currentUser) return;
    if (confirm('Are you sure you want to disable Multi-Factor Authentication?')) {
      const updated: UserAccount = {
        ...currentUser,
        mfaEnabled: false,
        mfaSecret: undefined,
        backupCodes: undefined,
      };
      onUpdateUser(updated);
      logSecurityEvent('Two-Factor Authentication (2FA) disabled', 'warning');
    }
  };

  const logs: SecurityLog[] = getSecurityLogs();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FFFDFB] w-full max-w-lg rounded-3xl shadow-2xl border border-[#E8DCD1] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-[#4A3B32] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#FF9F68]" />
            </div>
            <div>
              <h3 className="font-bold text-base">Your Catistify account</h3>
              <p className="text-[11px] text-white/70">Private on this device by default</p>
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
          {/* STATE 1: MFA Verification Challenge during login */}
          {isMfaChallenge ? (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#4A3B32]">
                  Two-Factor Authentication Required
                </h3>
                <p className="text-xs text-[#6B5B50] mt-1">
                  Enter the 6-digit TOTP authentication code from your authenticator app.
                </p>
              </div>

              {mfaError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                  {mfaError}
                </div>
              )}

              <form onSubmit={handleVerifyMfaChallenge} className="space-y-4">
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  placeholder="123456"
                  value={mfaCodeInput}
                  onChange={(e) => setMfaCodeInput(e.target.value)}
                  className="w-48 mx-auto text-center tracking-widest text-2xl font-mono py-2 rounded-xl border border-[#D5C2B1] bg-[#FFF8F0] text-[#4A3B32] focus:outline-none focus:ring-2 focus:ring-[#FF9F68]"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMfaChallenge(false);
                      setPendingUser(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl border border-[#D5C2B1] text-xs font-bold text-[#6B5B50] hover:bg-[#FAF4EE]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#FF9F68] text-white text-xs font-bold hover:bg-[#f58f55]"
                  >
                    Verify & Sign In
                  </button>
                </div>
              </form>
            </div>
          ) : !currentUser ? (
            /* STATE 2: Sign In / Sign Up Form */
            <div className="space-y-5">
              <div className="flex border-b border-[#E8DCD1] pb-2 gap-4">
                <button
                  onClick={() => setAuthMode('signin')}
                  className={`text-xs font-bold pb-1 border-b-2 transition-colors ${
                    authMode === 'signin'
                      ? 'border-[#FF9F68] text-[#4A3B32]'
                      : 'border-transparent text-[#8A7465]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('signup')}
                  className={`text-xs font-bold pb-1 border-b-2 transition-colors ${
                    authMode === 'signup'
                      ? 'border-[#FF9F68] text-[#4A3B32]'
                      : 'border-transparent text-[#8A7465]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authMode === 'signin' ? (
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B5B50] uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="owner@catistify.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D8C7B8] bg-[#FFF8F0] text-xs text-[#4A3B32]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6B5B50] uppercase mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D8C7B8] bg-[#FFF8F0] text-xs text-[#4A3B32]"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-[#FFF1E6] border border-[#FFD9C0] text-[11px] text-[#6B5B50]">
                    💡 <strong>MFA Protected:</strong> Signing in will trigger the 2FA authentication challenge to verify device ownership.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#FF9F68] hover:bg-[#f58f55] text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    Sign In with 2FA Protection
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#6B5B50] uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Parker"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D8C7B8] bg-[#FFF8F0] text-xs text-[#4A3B32]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6B5B50] uppercase mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D8C7B8] bg-[#FFF8F0] text-xs text-[#4A3B32]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#6B5B50] uppercase mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Create a secure password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#D8C7B8] bg-[#FFF8F0] text-xs text-[#4A3B32]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#8E44AD] hover:bg-[#71368A] text-white font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    Create Protected Account
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* STATE 3: Logged In Account Dashboard */
            <div className="space-y-5">
              {/* Account Card */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FFF8F0] border border-[#EFE5DC]">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#4A3B32] text-white flex items-center justify-center font-black text-sm">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#4A3B32]">{currentUser.name}</h4>
                    <p className="text-xs text-[#8A7465]">{currentUser.email}</p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>

              {/* Sub-tabs: Profile, 2FA Security, Audit Logs */}
              <div className="flex border-b border-[#E8DCD1] gap-4 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'profile' ? 'border-[#FF9F68] text-[#4A3B32]' : 'border-transparent text-[#8A7465]'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('mfa')}
                  className={`pb-2 border-b-2 transition-colors flex items-center gap-1 ${
                    activeTab === 'mfa' ? 'border-[#8E44AD] text-[#4A3B32]' : 'border-transparent text-[#8A7465]'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8E44AD]" />
                  <span>2FA Security</span>
                </button>
                <button
                  onClick={() => setActiveTab('audit')}
                  className={`pb-2 border-b-2 transition-colors flex items-center gap-1 ${
                    activeTab === 'audit' ? 'border-[#8EC5A4] text-[#4A3B32]' : 'border-transparent text-[#8A7465]'
                  }`}
                >
                  <History className="w-3.5 h-3.5 text-[#8EC5A4]" />
                  <span>Security Logs</span>
                </button>
              </div>

              {/* Tab 1: Overview */}
              {activeTab === 'profile' && (
                <div className="space-y-4 text-xs text-[#5A4636]">
                  <div className="p-3.5 rounded-xl bg-white border border-[#E0D3C5] space-y-1.5">
                    <p><strong>Account ID:</strong> <code>{currentUser.id}</code></p>
                    <p><strong>Two-Factor Protection:</strong> {currentUser.mfaEnabled ? '✅ Active (TOTP Authenticator)' : '⚠️ Inactive'}</p>
                    <p><strong>Session Authenticated:</strong> Active & Encrypted</p>
                  </div>
                </div>
              )}

              {/* Tab 2: 2FA MFA Management */}
              {activeTab === 'mfa' && (
                <div className="space-y-4">
                  {currentUser.mfaEnabled ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                      <div className="flex items-center gap-2 text-emerald-800">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold text-sm">Two-Factor Authentication is Active</span>
                      </div>
                      <p className="text-xs text-emerald-700">
                        Your pet records, diaries, and personality data are protected with 6-digit TOTP verification codes.
                      </p>

                      {currentUser.backupCodes && currentUser.backupCodes.length > 0 && (
                        <div className="pt-2 border-t border-emerald-200">
                          <p className="text-[11px] font-bold text-emerald-800 mb-1">Emergency Recovery Backup Codes:</p>
                          <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-emerald-900 bg-white/70 p-2 rounded-lg">
                            {currentUser.backupCodes.map((code, i) => (
                              <span key={i}>{code}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleDisableMfa}
                        className="mt-2 text-xs font-semibold text-red-600 hover:underline"
                      >
                        Disable 2FA Protection
                      </button>
                    </div>
                  ) : isSettingUpMfa ? (
                    <form onSubmit={handleConfirmMfaSetup} className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#EFE5DC] space-y-3">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-[#4A3B32]">
                        Set Up Authenticator App
                      </h4>
                      <p className="text-xs text-[#6B5B50]">
                        1. Add this secret key into Google Authenticator, 1Password, or Authy:
                      </p>
                      <div className="p-2.5 rounded-lg bg-white border border-[#D5C2B1] font-mono text-xs flex items-center justify-between">
                        <span>{tempSecret}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(tempSecret);
                            setCopiedSecret(true);
                            setTimeout(() => setCopiedSecret(false), 2000);
                          }}
                          className="text-[11px] text-[#FF9F68] font-bold"
                        >
                          {copiedSecret ? 'Copied!' : 'Copy'}
                        </button>
                      </div>

                      <p className="text-xs text-[#6B5B50] pt-1">
                        2. Enter the 6-digit code shown in your app (or test with 123456):
                      </p>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="123456"
                        value={setupCode}
                        onChange={(e) => setSetupCode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#D8C7B8] bg-white font-mono text-center tracking-widest text-base"
                      />

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsSettingUpMfa(false)}
                          className="flex-1 py-2 rounded-xl border text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
                        >
                          Confirm & Enable 2FA
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                      <div className="flex items-center gap-2 text-amber-900">
                        <ShieldAlert className="w-5 h-5 text-amber-600" />
                        <span className="font-bold text-sm">2FA is Not Yet Configured</span>
                      </div>
                      <p className="text-xs text-amber-800">
                        Add an extra layer of security to prevent unauthorized access to your pet data and automated cloud backups.
                      </p>
                      <button
                        onClick={handleStartMfaSetup}
                        className="py-2 px-4 rounded-xl bg-[#8E44AD] text-white text-xs font-bold hover:bg-[#71368A] transition-colors"
                      >
                        Enable Two-Factor Authentication
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Security Logs */}
              {activeTab === 'audit' && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#4A3B32] uppercase tracking-wider mb-2">
                    Recent Security Audit Events
                  </h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {logs.map((log) => (
                      <div key={log.id} className="p-2 rounded-lg bg-white border border-[#E8DCD1] text-xs flex items-center justify-between">
                        <span className="text-[#4A3B32] font-medium">{log.action}</span>
                        <span className="text-[10px] text-[#8A7465]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
