/**
 * TypeScript type definitions for MUUF app
 */

// User types
export interface User {
  id: number;
  email: string;
  full_name: string;
  avatar_url?: string;
  company_id?: number;
  team_id?: number;
  date_of_birth?: string;
  height?: number;
  weight?: number;
  sex?: 'M' | 'F';
  imc?: number;
  onboarding_completed: boolean;
  handicap_id?: number;
  is_active: boolean;
  created_at: string;
}

export interface UserStats {
  ritmo_percentage: number;
  ritmo_target_minutes: number;
  ritmo_current_minutes: number;
  balance_percentage: number;
  total_points: number;
  individual_rank?: number;
  team_rank?: number;
  current_streak: number;
  longest_streak: number;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  company_id?: number;
  date_of_birth?: string;
  height?: number;
  weight?: number;
  sex?: 'M' | 'F';
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// Activity types
export enum ActivityType {
  WALKING = 'walking',
  RUNNING = 'running',
  CYCLING = 'cycling',
  GYM = 'gym',
  YOGA = 'yoga',
  TEAM_SPORT = 'team_sport',
  MINDFULNESS = 'mindfulness',
  CROSSFIT = 'crossfit',
  SWIMMING = 'swimming',
  PADEL = 'padel',
  TENNIS = 'tennis',
  MOUNTAIN_BIKE = 'mountain_bike',
  OTHER = 'other',
}

export enum IntensityLevel {
  BAJA = 'baja',
  MEDIA = 'media',
  ALTA = 'alta',
}

export interface Activity {
  id: number;
  user_id: number;
  activity_type: ActivityType;
  title?: string;
  duration_minutes: number;
  distance_km?: number;
  intensity_level?: IntensityLevel;
  base_points: number;
  bonus_multiplier: number;
  points_with_multiplier: number;
  handicap_bonus: number;
  final_points: number;
  performed_at: string;
  created_at: string;
}

export interface ActivityCreateRequest {
  activity_type: ActivityType;
  title?: string;
  duration_minutes: number;
  distance_km?: number;
  intensity_level?: IntensityLevel;
  performed_at: string;
}

// Badge types
export interface Badge {
  id: number;
  badge_type: string;
  name: string;
  description?: string;
  icon_url?: string;
  is_active: boolean;
  display_order: number;
}

export interface UserBadge {
  badge: Badge;
  unlocked_at: string;
  is_featured: boolean;
  progress_data?: any;
}

export interface BadgeProgress {
  badge: Badge;
  is_unlocked: boolean;
  progress_percentage?: number;
  progress_text?: string;
  unlock_condition_description: string;
}

export interface BadgeCollection {
  total_badges: number;
  unlocked_count: number;
  locked_count: number;
  unlocked: UserBadge[];
  locked: BadgeProgress[];
}

// Stats types
export interface RitmoStatus {
  ritmo_percentage: number;
  target_minutes_weekly: number;
  current_minutes_weekly: number;
  minutes_remaining: number;
  is_on_track: boolean;
  incentive?: {
    message: string;
    current_percentage: number;
    target_percentage: number;
    minutes_needed: number;
  };
  breakdown: {
    baseline_by_age: number;
    adjustment_factors: Record<string, string>;
  };
}

export interface BalanceStatus {
  balance_percentage: number;
  is_balanced: boolean;
  total_minutes_last_30_days: number;
  distribution_minutes: Record<string, number>;
  distribution_percentage: Record<string, number>;
  ideal_distribution: Record<string, number>;
  recommendations: Array<{
    category: string;
    action: string;
    message: string;
    current: number;
    ideal: number;
  }>;
  interpretation: string;
}

export interface RankingUser {
  rank: number;
  user_id: number;
  full_name: string;
  avatar_url?: string;
  points: number;
  level: string;
}

export interface IndividualRanking {
  period: string;
  top_users: RankingUser[];
  user_position?: RankingUser;
  total_participants: number;
}

// API Response types
export interface ApiError {
  detail: string;
  status_code?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}
