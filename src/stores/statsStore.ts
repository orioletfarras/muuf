/**
 * Stats store using Zustand
 */

import { create } from 'zustand';
import { api } from '../services/api';
import type { RitmoStatus, BalanceStatus, IndividualRanking } from '../types';

interface StatsState {
  ritmo: RitmoStatus | null;
  balance: BalanceStatus | null;
  ranking: IndividualRanking | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchRitmo: () => Promise<void>;
  fetchBalance: () => Promise<void>;
  fetchRanking: (period?: string, limit?: number) => Promise<void>;
  clearError: () => void;
}

export const useStatsStore = create<StatsState>((set) => ({
  ritmo: null,
  balance: null,
  ranking: null,
  isLoading: false,
  error: null,

  fetchRitmo: async () => {
    set({ isLoading: true, error: null });
    try {
      const ritmo = await api.getRitmo();
      set({ ritmo, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to fetch Ritmo',
      });
    }
  },

  fetchBalance: async () => {
    set({ isLoading: true, error: null });
    try {
      const balance = await api.getBalance();
      set({ balance, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to fetch Balance',
      });
    }
  },

  fetchRanking: async (period = 'weekly', limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const ranking = await api.getIndividualRanking(period, limit);
      set({ ranking, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to fetch ranking',
      });
    }
  },

  clearError: () => set({ error: null }),
}));
