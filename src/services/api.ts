/**
 * API client service using axios
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Config } from '../constants/config';
import type {
  User,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  Activity,
  ActivityCreateRequest,
  BadgeCollection,
  RitmoStatus,
  BalanceStatus,
  IndividualRanking,
  ApiError,
} from '../types';

class ApiClient {
  private client: AxiosInstance;
  private refreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  constructor() {
    this.client = axios.create({
      baseURL: Config.API_URL,
      timeout: Config.API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors and token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiError>) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        // If 401 and not already retrying, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.refreshing) {
            // Wait for refresh to complete
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.refreshing = true;

          try {
            const newToken = await this.refreshAccessToken();
            this.refreshing = false;
            this.onTokenRefreshed(newToken);
            this.refreshSubscribers = [];

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return this.client(originalRequest);
          } catch (refreshError) {
            this.refreshing = false;
            this.refreshSubscribers = [];
            await this.clearTokens();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
  }

  private async getAccessToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(Config.STORAGE_KEYS.ACCESS_TOKEN);
  }

  private async getRefreshToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(Config.STORAGE_KEYS.REFRESH_TOKEN);
  }

  private async setTokens(tokens: AuthTokens) {
    await SecureStore.setItemAsync(
      Config.STORAGE_KEYS.ACCESS_TOKEN,
      tokens.access_token
    );
    await SecureStore.setItemAsync(
      Config.STORAGE_KEYS.REFRESH_TOKEN,
      tokens.refresh_token
    );
  }

  private async clearTokens() {
    await SecureStore.deleteItemAsync(Config.STORAGE_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(Config.STORAGE_KEYS.REFRESH_TOKEN);
    await SecureStore.deleteItemAsync(Config.STORAGE_KEYS.USER);
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = await this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post<AuthTokens>(
      `${Config.API_URL}/auth/refresh`,
      null,
      { params: { refresh_token: refreshToken } }
    );

    await this.setTokens(response.data);
    return response.data.access_token;
  }

  // ==================== AUTH ENDPOINTS ====================

  async login(data: LoginRequest): Promise<{ user: User; tokens: AuthTokens }> {
    const formData = new FormData();
    formData.append('username', data.username);
    formData.append('password', data.password);

    const tokensResponse = await this.client.post<AuthTokens>(
      '/auth/login',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );

    await this.setTokens(tokensResponse.data);

    // Get user profile
    const userResponse = await this.client.get<User>('/users/me');

    // Cache user
    await SecureStore.setItemAsync(
      Config.STORAGE_KEYS.USER,
      JSON.stringify(userResponse.data)
    );

    return {
      user: userResponse.data,
      tokens: tokensResponse.data,
    };
  }

  async register(data: RegisterRequest): Promise<User> {
    const response = await this.client.post<User>('/auth/register', data);
    return response.data;
  }

  async logout() {
    await this.clearTokens();
  }

  // ==================== USER ENDPOINTS ====================

  async getMyProfile(): Promise<User> {
    const response = await this.client.get<User>('/users/me');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.client.put<User>('/users/me', data);
    return response.data;
  }

  async getMyStats(): Promise<User & { stats: any }> {
    const response = await this.client.get('/users/me/stats');
    return response.data;
  }

  // ==================== ACTIVITY ENDPOINTS ====================

  async createActivity(data: ActivityCreateRequest): Promise<Activity> {
    const response = await this.client.post<Activity>('/activities/', data);
    return response.data;
  }

  async getActivities(params?: {
    skip?: number;
    limit?: number;
    activity_type?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<Activity[]> {
    const response = await this.client.get<Activity[]>('/activities/', {
      params,
    });
    return response.data;
  }

  async getActivity(id: number): Promise<Activity> {
    const response = await this.client.get<Activity>(`/activities/${id}`);
    return response.data;
  }

  async deleteActivity(id: number): Promise<void> {
    await this.client.delete(`/activities/${id}`);
  }

  async getActivitySummary(days: number = 30): Promise<any> {
    const response = await this.client.get('/activities/summary/stats', {
      params: { days },
    });
    return response.data;
  }

  // ==================== STATS ENDPOINTS ====================

  async getRitmo(): Promise<RitmoStatus> {
    const response = await this.client.get<RitmoStatus>('/stats/ritmo');
    return response.data;
  }

  async getBalance(): Promise<BalanceStatus> {
    const response = await this.client.get<BalanceStatus>('/stats/balance');
    return response.data;
  }

  async getIndividualRanking(
    period: string = 'weekly',
    limit: number = 10
  ): Promise<IndividualRanking> {
    const response = await this.client.get<IndividualRanking>(
      '/stats/rankings/individual',
      { params: { period, limit } }
    );
    return response.data;
  }

  // ==================== BADGE ENDPOINTS ====================

  async getBadges(): Promise<BadgeCollection> {
    const response = await this.client.get<BadgeCollection>(
      '/gamification/badges'
    );
    return response.data;
  }

  async featureBadge(badgeId: number): Promise<void> {
    await this.client.post(`/gamification/badges/${badgeId}/feature`);
  }

  // ==================== HEALTH CHECK ====================

  async healthCheck(): Promise<{ status: string }> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

// Export singleton instance
export const api = new ApiClient();
