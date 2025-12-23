/**
 * Activity type constants and data
 */

import { ActivityType, IntensityLevel } from '../types';

export interface ActivityTypeData {
  type: ActivityType;
  emoji: string;
  label: string;
  description: string;
  requiresDistance?: boolean;
}

export const ACTIVITY_TYPES: ActivityTypeData[] = [
  {
    type: ActivityType.WALKING,
    emoji: '🚶',
    label: 'Caminar',
    description: 'Caminata al aire libre o en cinta',
    requiresDistance: true,
  },
  {
    type: ActivityType.RUNNING,
    emoji: '🏃',
    label: 'Correr',
    description: 'Carrera o jogging',
    requiresDistance: true,
  },
  {
    type: ActivityType.CYCLING,
    emoji: '🚴',
    label: 'Ciclismo',
    description: 'Bicicleta de ruta o spinning',
    requiresDistance: true,
  },
  {
    type: ActivityType.GYM,
    emoji: '🏋️',
    label: 'Gimnasio',
    description: 'Entrenamiento con pesas',
  },
  {
    type: ActivityType.YOGA,
    emoji: '🧘',
    label: 'Yoga',
    description: 'Práctica de yoga o pilates',
  },
  {
    type: ActivityType.SWIMMING,
    emoji: '🏊',
    label: 'Natación',
    description: 'Natación en piscina o aguas abiertas',
    requiresDistance: true,
  },
  {
    type: ActivityType.PADEL,
    emoji: '🎾',
    label: 'Pádel',
    description: 'Partido de pádel',
  },
  {
    type: ActivityType.TENNIS,
    emoji: '🎾',
    label: 'Tenis',
    description: 'Partido de tenis',
  },
  {
    type: ActivityType.TEAM_SPORT,
    emoji: '⚽',
    label: 'Deporte Equipo',
    description: 'Fútbol, baloncesto, etc.',
  },
  {
    type: ActivityType.CROSSFIT,
    emoji: '🏋️',
    label: 'CrossFit',
    description: 'Entrenamiento funcional intenso',
  },
  {
    type: ActivityType.MOUNTAIN_BIKE,
    emoji: '🚵',
    label: 'MTB',
    description: 'Mountain bike o ciclismo de montaña',
    requiresDistance: true,
  },
  {
    type: ActivityType.MINDFULNESS,
    emoji: '🧘',
    label: 'Mindfulness',
    description: 'Meditación y respiración',
  },
  {
    type: ActivityType.OTHER,
    emoji: '💪',
    label: 'Otro',
    description: 'Otra actividad física',
  },
];

export interface IntensityLevelData {
  level: IntensityLevel;
  label: string;
  color: string;
  description: string;
}

export const INTENSITY_LEVELS: IntensityLevelData[] = [
  {
    level: IntensityLevel.BAJA,
    label: 'Baja',
    color: '#4CAF50',
    description: 'Puedes mantener una conversación',
  },
  {
    level: IntensityLevel.MEDIA,
    label: 'Media',
    color: '#FF9800',
    description: 'Puedes hablar pero con algo de dificultad',
  },
  {
    level: IntensityLevel.ALTA,
    label: 'Alta',
    color: '#F44336',
    description: 'Es difícil mantener una conversación',
  },
];
