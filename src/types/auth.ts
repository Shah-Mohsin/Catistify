export interface UserAccount {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  backupCodes?: string[];
  mfaMethod?: 'authenticator' | 'sms' | 'email';
  phoneNumber?: string;
  lastLoginAt: string;
  createdAt: string;
}

export interface AuthState {
  user: UserAccount | null;
  isAuthenticated: boolean;
  requiresMfa: boolean;
  tempUserForMfa: UserAccount | null;
}
