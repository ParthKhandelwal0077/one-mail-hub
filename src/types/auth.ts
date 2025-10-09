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
