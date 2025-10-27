// Authentication API types
export interface User {
  id: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: Tokens;
  };
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    tokens: Tokens;
  };
}

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface RegisterRequest {
  phoneNumber: string;
  password: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
}

// User profile types
export interface UserProfile {
  id: string;
  phoneNumber: string;
  slackWebhookUrl?: string;
  customWebhookUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  phoneNumber?: string;
  slackWebhookUrl?: string;
  customWebhookUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface UserStats {
  totalEmails: number;
  categorizedEmails: number;
  spamEmails: number;
  lastLoginAt: string;
}

// Email account types
export interface EmailAccount {
  email: string;
  hasRefreshToken: boolean;
  tokenExpiry: string;
}

export interface EmailAccountStatus {
  success: boolean;
  data: {
    userId: string;
    emails: EmailAccount[];
    isAuthenticated: boolean;
    totalAccounts: number;
  };
}

export interface EmailAccountStatusError {
  success: false;
  error: string;
  message?: string;
}

// Gmail OAuth types
export interface GmailAuthUrlResponse {
  success: boolean;
  data: {
    authUrl: string;
    userId: string;
    message: string;
  };
}

export interface GmailCallbackResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    userId: string;
  };
}

export interface GmailCallbackRequest {
  code: string;
  userId: string;
}
