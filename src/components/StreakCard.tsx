import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Card } from './Card';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  unit?: 'días' | 'semanas';
  style?: ViewStyle;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
  unit = 'días',
  style,
}) => {
  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🔥';
    if (streak >= 14) return '⚡';
    if (streak >= 7) return '✨';
    if (streak >= 3) return '💪';
    return '🌱';
  };

  const getStreakMessage = (streak: number): string => {
    if (streak === 0) return 'Comienza tu racha hoy';
    if (streak === 1) return '¡Buen comienzo!';
    if (streak < 7) return '¡Sigue así!';
    if (streak < 14) return '¡Increíble constancia!';
    if (streak < 30) return '¡Eres imparable!';
    return '¡Leyenda absoluta!';
  };

  const isNewRecord = currentStreak > 0 && currentStreak === longestStreak;

  return (
    <Card style={style} elevated>
      <View style={styles.header}>
        <Text style={styles.title}>🔥 Racha de Actividad</Text>
      </View>

      <View style={styles.content}>
        {/* Current Streak */}
        <View style={styles.streakContainer}>
          <View style={styles.streakMain}>
            <Text style={styles.streakEmoji}>{getStreakEmoji(currentStreak)}</Text>
            <View style={styles.streakInfo}>
              <Text style={styles.streakNumber}>{currentStreak}</Text>
              <Text style={styles.streakUnit}>{unit}</Text>
            </View>
          </View>
          <Text style={styles.streakLabel}>Racha Actual</Text>
          <Text style={styles.streakMessage}>{getStreakMessage(currentStreak)}</Text>
          {isNewRecord && (
            <View style={styles.recordBadge}>
              <Text style={styles.recordText}>🏆 ¡Nuevo Récord!</Text>
            </View>
          )}
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Longest Streak */}
        <View style={styles.longestStreak}>
          <Text style={styles.longestStreakLabel}>Récord Personal</Text>
          <View style={styles.longestStreakValue}>
            <Text style={styles.longestStreakNumber}>{longestStreak}</Text>
            <Text style={styles.longestStreakUnit}>{unit}</Text>
          </View>
        </View>
      </View>

      {/* Streak Tips */}
      {currentStreak > 0 && (
        <View style={styles.tip}>
          <Text style={styles.tipText}>
            💡 Registra actividad hoy para mantener tu racha
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.size.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    alignItems: 'center',
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  streakMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  streakEmoji: {
    fontSize: 48,
    marginRight: Spacing.md,
  },
  streakInfo: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 56,
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: 56,
  },
  streakUnit: {
    fontSize: Typography.size.md,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  streakLabel: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  streakMessage: {
    fontSize: Typography.size.md,
    color: Colors.text,
    fontWeight: '600',
  },
  recordBadge: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.success,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  recordText: {
    color: Colors.white,
    fontSize: Typography.size.sm,
    fontWeight: '700',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  longestStreak: {
    alignItems: 'center',
  },
  longestStreakLabel: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  longestStreakValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  longestStreakNumber: {
    fontSize: Typography.size.xxl,
    fontWeight: '700',
    color: Colors.secondary,
  },
  longestStreakUnit: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  tip: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  tipText: {
    fontSize: Typography.size.sm,
    color: Colors.text,
    textAlign: 'center',
  },
});
