/**
 * Badge store using Zustand
 */

import { create } from 'zustand';
import { api } from '../services/api';
import type { BadgeCollection } from '../types';

interface BadgeState {
  badges: BadgeCollection | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchBadges: () => Promise<void>;
  featureBadge: (badgeId: number) => Promise<void>;
  clearError: () => void;
}

export const useBadgeStore = create<BadgeState>((set) => ({
  badges: null,
  isLoading: false,
  error: null,

  fetchBadges: async () => {
    set({ isLoading: true, error: null });
    try {
      const badges = await api.getBadges();
      set({ badges, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to fetch badges',
      });
    }
  },

  featureBadge: async (badgeId: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.featureBadge(badgeId);
      // Refresh badges to get updated featured status
      const badges = await api.getBadges();
      set({ badges, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to feature badge',
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
