/**
 * Activity store using Zustand
 */

import { create } from 'zustand';
import { api } from '../services/api';
import type { Activity, ActivityCreateRequest } from '../types';

interface ActivityState {
  activities: Activity[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchActivities: (params?: any) => Promise<void>;
  createActivity: (data: ActivityCreateRequest) => Promise<Activity>;
  deleteActivity: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  isLoading: false,
  error: null,

  fetchActivities: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const activities = await api.getActivities(params);
      set({ activities, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to fetch activities',
      });
    }
  },

  createActivity: async (data: ActivityCreateRequest) => {
    set({ isLoading: true, error: null });
    try {
      const activity = await api.createActivity(data);
      set((state) => ({
        activities: [activity, ...state.activities],
        isLoading: false,
      }));
      return activity;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to create activity',
      });
      throw error;
    }
  },

  deleteActivity: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await api.deleteActivity(id);
      set((state) => ({
        activities: state.activities.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.response?.data?.detail || 'Failed to delete activity',
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
