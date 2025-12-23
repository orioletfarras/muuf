/**
 * Activity-related utilities
 */

import { ActivityType, IntensityLevel } from '../types';

/**
 * Get emoji for activity type
 */
export const getActivityEmoji = (type: ActivityType): string => {
  const emojiMap: Record<ActivityType, string> = {
    [ActivityType.WALKING]: '🚶',
    [ActivityType.RUNNING]: '🏃',
    [ActivityType.CYCLING]: '🚴',
    [ActivityType.GYM]: '🏋️',
    [ActivityType.YOGA]: '🧘',
    [ActivityType.TEAM_SPORT]: '⚽',
    [ActivityType.MINDFULNESS]: '🧘',
    [ActivityType.CROSSFIT]: '🏋️',
    [ActivityType.SWIMMING]: '🏊',
    [ActivityType.PADEL]: '🎾',
    [ActivityType.TENNIS]: '🎾',
    [ActivityType.MOUNTAIN_BIKE]: '🚵',
    [ActivityType.OTHER]: '💪',
  };
  return emojiMap[type] || '💪';
};

/**
 * Get readable name for activity type
 */
export const getActivityName = (type: ActivityType): string => {
  const nameMap: Record<ActivityType, string> = {
    [ActivityType.WALKING]: 'Caminar',
    [ActivityType.RUNNING]: 'Correr',
    [ActivityType.CYCLING]: 'Ciclismo',
    [ActivityType.GYM]: 'Gimnasio',
    [ActivityType.YOGA]: 'Yoga',
    [ActivityType.TEAM_SPORT]: 'Deporte en Equipo',
    [ActivityType.MINDFULNESS]: 'Mindfulness',
    [ActivityType.CROSSFIT]: 'CrossFit',
    [ActivityType.SWIMMING]: 'Natación',
    [ActivityType.PADEL]: 'Pádel',
    [ActivityType.TENNIS]: 'Tenis',
    [ActivityType.MOUNTAIN_BIKE]: 'Mountain Bike',
    [ActivityType.OTHER]: 'Otro',
  };
  return nameMap[type] || type;
};

/**
 * Get color for intensity level
 */
export const getIntensityColor = (intensity: IntensityLevel): string => {
  const colorMap: Record<IntensityLevel, string> = {
    [IntensityLevel.BAJA]: '#4CAF50',
    [IntensityLevel.MEDIA]: '#FF9800',
    [IntensityLevel.ALTA]: '#F44336',
  };
  return colorMap[intensity];
};

/**
 * Get readable name for intensity level
 */
export const getIntensityName = (intensity: IntensityLevel): string => {
  const nameMap: Record<IntensityLevel, string> = {
    [IntensityLevel.BAJA]: 'Baja',
    [IntensityLevel.MEDIA]: 'Media',
    [IntensityLevel.ALTA]: 'Alta',
  };
  return nameMap[intensity];
};

/**
 * Calculate activity category
 */
export const getActivityCategory = (type: ActivityType): string => {
  const categoryMap: Record<ActivityType, string> = {
    [ActivityType.WALKING]: 'cardio',
    [ActivityType.RUNNING]: 'cardio',
    [ActivityType.CYCLING]: 'cardio',
    [ActivityType.MOUNTAIN_BIKE]: 'cardio',
    [ActivityType.SWIMMING]: 'cardio',
    [ActivityType.GYM]: 'strength',
    [ActivityType.CROSSFIT]: 'strength',
    [ActivityType.YOGA]: 'flexibility',
    [ActivityType.MINDFULNESS]: 'mindfulness',
    [ActivityType.TEAM_SPORT]: 'social',
    [ActivityType.PADEL]: 'social',
    [ActivityType.TENNIS]: 'social',
    [ActivityType.OTHER]: 'other',
  };
  return categoryMap[type] || 'other';
};

/**
 * Estimate calories burned (rough estimation)
 */
export const estimateCalories = (
  type: ActivityType,
  durationMinutes: number,
  weight: number = 70
): number => {
  // MET values (Metabolic Equivalent of Task)
  const metMap: Record<ActivityType, number> = {
    [ActivityType.WALKING]: 3.5,
    [ActivityType.RUNNING]: 9.0,
    [ActivityType.CYCLING]: 7.0,
    [ActivityType.GYM]: 5.0,
    [ActivityType.YOGA]: 3.0,
    [ActivityType.TEAM_SPORT]: 7.0,
    [ActivityType.MINDFULNESS]: 1.5,
    [ActivityType.CROSSFIT]: 8.0,
    [ActivityType.SWIMMING]: 8.0,
    [ActivityType.PADEL]: 6.0,
    [ActivityType.TENNIS]: 7.0,
    [ActivityType.MOUNTAIN_BIKE]: 8.5,
    [ActivityType.OTHER]: 5.0,
  };

  const met = metMap[type] || 5.0;
  // Calories = MET × weight (kg) × duration (hours)
  const calories = met * weight * (durationMinutes / 60);
  return Math.round(calories);
};

/**
 * Calculate average pace (min/km) for cardio activities
 */
export const calculatePace = (
  durationMinutes: number,
  distanceKm: number
): string => {
  if (!distanceKm || distanceKm === 0) return '-';

  const paceMinutes = durationMinutes / distanceKm;
  const minutes = Math.floor(paceMinutes);
  const seconds = Math.round((paceMinutes - minutes) * 60);

  return `${minutes}:${seconds.toString().padStart(2, '0')} min/km`;
};

/**
 * Calculate average speed (km/h)
 */
export const calculateSpeed = (
  durationMinutes: number,
  distanceKm: number
): string => {
  if (!distanceKm || distanceKm === 0) return '-';

  const speed = (distanceKm / durationMinutes) * 60;
  return `${speed.toFixed(1)} km/h`;
};
