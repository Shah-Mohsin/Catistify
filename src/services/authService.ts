import { UserAccount, AuthState } from '../types/auth';

const AUTH_USER_KEY = 'catistify_auth_user_v2';
const SECURITY_LOG_KEY = 'catistify_sec_logs_v2';

export interface SecurityLog {
  id: string;
  action: string;
  timestamp: string;
  ip?: string;
  status: 'success' | 'warning' | 'error';
}

export function getStoredUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: UserAccount | null): void {
  if (user) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(AUTH_USER_KEY);
  }
}

export function logSecurityEvent(action: string, status: 'success' | 'warning' | 'error' = 'success'): void {
  try {
    const raw = localStorage.getItem(SECURITY_LOG_KEY);
    const logs: SecurityLog[] = raw ? JSON.parse(raw) : [];
    const newLog: SecurityLog = {
      id: `log_${Date.now()}`,
      action,
      timestamp: new Date().toISOString(),
      status
    };
    localStorage.setItem(SECURITY_LOG_KEY, JSON.stringify([newLog, ...logs.slice(0, 19)]));
  } catch {}
}

export function getSecurityLogs(): SecurityLog[] {
  try {
    const raw = localStorage.getItem(SECURITY_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 6; i++) {
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    codes.push(`${part1}-${part2}`);
  }
  return codes;
}

export function generateMfaSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

export function verifyTotpCode(code: string, secret?: string): boolean {
  // In demo / client app, accept valid 6-digit numeric input or specific demo master code 123456
  const clean = code.trim().replace(/\s/g, '');
  if (clean === '123456' || clean.length === 6 && /^\d+$/.test(clean)) {
    return true;
  }
  return false;
}
