import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserProfile, UserStats } from '@/types/auth';
import { authService } from '@/services/authService';
import { tokenStorage } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userStats: UserStats | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
  refreshUserStats: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

interface AuthProviderProps {
  children: ReactNode;
}

// Inner provider that can use useNavigate
const AuthProviderInner: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && tokenStorage.isAuthenticated();

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = tokenStorage.getUser();
        if (storedUser && tokenStorage.isAuthenticated()) {
          // Verify token is still valid
          const isValid = await authService.verifyToken();
          if (isValid) {
            setUser(storedUser);
            // Load user profile and stats
            await Promise.all([
              refreshUserProfile(),
              refreshUserStats()
            ]);
          } else {
            // Token is invalid, try to refresh
            try {
              await authService.refreshToken();
              const refreshedUser = tokenStorage.getUser();
              if (refreshedUser) {
                setUser(refreshedUser);
                await Promise.all([
                  refreshUserProfile(),
                  refreshUserStats()
                ]);
              }
            } catch {
              // Refresh failed, clear everything
              tokenStorage.clearTokens();
              tokenStorage.clearUser();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        tokenStorage.clearTokens();
        tokenStorage.clearUser();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (phoneNumber: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ phoneNumber, password });
      setUser(response.data.user);
      await Promise.all([
        refreshUserProfile(),
        refreshUserStats()
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (phoneNumber: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.register({ phoneNumber, password });
      setUser(response.data.user);
      await Promise.all([
        refreshUserProfile(),
        refreshUserStats()
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout(() => {
        // Navigate to auth page after logout
        navigate('/auth');
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setUserProfile(null);
      setUserStats(null);
      setIsLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    try {
      const profile = await authService.getUserProfile();
      setUserProfile(profile);
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const refreshUserStats = async () => {
    try {
      const stats = await authService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Failed to load user stats:', error);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    const updatedProfile = await authService.updateProfile(data);
    setUserProfile(updatedProfile);
  };

  const value: AuthContextType = {
    user,
    userProfile,
    userStats,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUserProfile,
    refreshUserStats,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Outer provider that doesn't use useNavigate
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return <AuthProviderInner>{children}</AuthProviderInner>;
};
