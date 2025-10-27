import api from '@/api/axios';
import { tokenStorage } from '@/lib/auth';
import {
  AuthResponse,
  RefreshResponse,
  LoginRequest,
  RegisterRequest,
  RefreshRequest,
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  UserStats,
  ApiError,
  EmailAccountStatus,
  GmailAuthUrlResponse,
  GmailCallbackRequest,
  GmailCallbackResponse
} from '@/types/auth';

class AuthService {
  // Register user
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/user/register', data);
      
      if (response.data.success) {
        // Store tokens and user data
        tokenStorage.setTokens(response.data.data.tokens);
        tokenStorage.setUser(response.data.data.user);
      }
      
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Login user
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/user/login', data);
      
      if (response.data.success) {
        // Store tokens and user data
        tokenStorage.setTokens(response.data.data.tokens);
        tokenStorage.setUser(response.data.data.user);
      }
      
      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Logout user
  async logout(onLogout?: () => void): Promise<void> {
    // Clear local tokens and user data
    tokenStorage.clearTokens();
    tokenStorage.clearUser();
    
    // Call the logout callback if provided (for navigation)
    if (onLogout) {
      onLogout();
    }
  }

  // Refresh token
  async refreshToken(): Promise<RefreshResponse> {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post<RefreshResponse>('/user/refresh', {
        refreshToken
      });

      if (response.data.success) {
        // Update stored tokens
        tokenStorage.setTokens(response.data.data.tokens);
      }

      return response.data;
    } catch (error: unknown) {
      // If refresh fails, clear all tokens
      tokenStorage.clearTokens();
      tokenStorage.clearUser();
      throw this.handleError(error);
    }
  }

  // Get user profile
  async getUserProfile(): Promise<UserProfile> {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await api.get<UserProfile>('/user/profile', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Update user profile
  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await api.put<UserProfile>('/user/profile', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      // Update stored user data
      tokenStorage.setUser(response.data);

      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Change password
  async changePassword(data: ChangePasswordRequest): Promise<{ success: boolean; message: string }> {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await api.post('/user/change-password', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Delete account
  async deleteAccount(data: DeleteAccountRequest): Promise<void> {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      await api.delete('/user/account', {
        data,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      // Clear local data after successful deletion
      tokenStorage.clearTokens();
      tokenStorage.clearUser();
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Verify token
  async verifyToken(): Promise<boolean> {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        return false;
      }

      await api.get('/user/verify', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      return true;
    } catch (error) {
      return false;
    }
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await api.get<UserStats>('/user/stats', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Get email account status
  async getEmailAccountStatus(userId: string): Promise<EmailAccountStatus> {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await api.get<EmailAccountStatus>(`/auth/status/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Get Gmail auth URL
  async getGmailAuthUrl(): Promise<GmailAuthUrlResponse> {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await api.get<GmailAuthUrlResponse>('/auth/gmail', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Handle Gmail OAuth callback
  async handleGmailCallback(data: GmailCallbackRequest): Promise<GmailCallbackResponse> {
    try {
      const accessToken = tokenStorage.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await api.post<GmailCallbackResponse>('/auth/gmail/callback', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      return response.data;
    } catch (error: unknown) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  private handleError(error: unknown): Error {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      if (axiosError.response?.data) {
        const apiError = axiosError.response.data as ApiError;
        return new Error(apiError.message || 'An error occurred');
      }
    }
    
    if (error instanceof Error) {
      return new Error(error.message);
    }
    
    return new Error('An unexpected error occurred');
  }
}

export const authService = new AuthService();
