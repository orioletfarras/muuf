/**
 * Authentication store using Zustand with Supabase
 */

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthenticating: boolean; // Flag to prevent navigation resets during auth flow
  hasCompletedQuestionnaire: boolean; // Flag to track if user completed onboarding

  // Actions
  sendOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  clearError: () => void;
  setAuthenticating: (value: boolean) => void;
  setQuestionnaireCompleted: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isAuthenticating: false,
  hasCompletedQuestionnaire: false,

  sendOTP: async (email: string) => {
    // Don't set isLoading here to avoid re-rendering RootNavigator
    set({ error: null });
    try {
      // For development with Expo Go, we don't need emailRedirectTo
      // Supabase will handle the session automatically
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      set({ error: null });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to send magic link',
      });
      throw error;
    }
  },

  verifyOTP: async (email: string, token: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) throw error;

      if (data.user) {
        // Map Supabase user to our User type
        const user: User = {
          id: parseInt(data.user.id) || 0,
          email: data.user.email || '',
          full_name: data.user.user_metadata?.full_name || '',
          avatar_url: data.user.user_metadata?.avatar_url || null,
          created_at: data.user.created_at || new Date().toISOString(),
        };

        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      }
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'OTP verification failed',
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      // Map Supabase user to our User type
      const user: User = {
        id: parseInt(session.user.id) || 0,
        email: session.user.email || '',
        full_name: session.user.user_metadata?.full_name || '',
        avatar_url: session.user.user_metadata?.avatar_url || null,
        created_at: session.user.created_at || new Date().toISOString(),
      };

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      set({ user: updatedUser });

      // Update Supabase user metadata
      supabase.auth.updateUser({
        data: {
          full_name: updatedUser.full_name,
          avatar_url: updatedUser.avatar_url,
        },
      });
    }
  },

  clearError: () => set({ error: null }),

  setAuthenticating: (value: boolean) => set({ isAuthenticating: value }),

  setQuestionnaireCompleted: (value: boolean) => set({ hasCompletedQuestionnaire: value }),
}));
