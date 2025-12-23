import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface LevelBadgeProps {
  level: number;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  style?: ViewStyle;
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({
  level,
  size = 'medium',
  showLabel = true,
  style,
}) => {
  const getLevelColor = (lvl: number): string => {
    if (lvl >= 50) return '#FFD700'; // Gold
    if (lvl >= 30) return '#C0C0C0'; // Silver
    if (lvl >= 10) return '#CD7F32'; // Bronze
    return Colors.primary;
  };

  const getLevelIcon = (lvl: number): string => {
    if (lvl >= 50) return '👑';
    if (lvl >= 30) return '⭐';
    if (lvl >= 10) return '🌟';
    return '✨';
  };

  const sizeStyles = {
    small: {
      container: { width: 40, height: 40 },
      level: { fontSize: Typography.size.sm },
      icon: { fontSize: 12 },
      label: { fontSize: Typography.size.xs },
    },
    medium: {
      container: { width: 56, height: 56 },
      level: { fontSize: Typography.size.lg },
      icon: { fontSize: 16 },
      label: { fontSize: Typography.size.sm },
    },
    large: {
      container: { width: 72, height: 72 },
      level: { fontSize: Typography.size.xl },
      icon: { fontSize: 20 },
      label: { fontSize: Typography.size.md },
    },
  };

  const levelColor = getLevelColor(level);
  const levelIcon = getLevelIcon(level);

  return (
    <View style={[styles.wrapper, style]}>
      <View
        style={[
          styles.container,
          sizeStyles[size].container,
          { backgroundColor: levelColor },
        ]}
      >
        <Text style={[styles.icon, { fontSize: sizeStyles[size].icon.fontSize }]}>
          {levelIcon}
        </Text>
        <Text style={[styles.level, { fontSize: sizeStyles[size].level.fontSize }]}>
          {level}
        </Text>
      </View>
      {showLabel && (
        <Text style={[styles.label, { fontSize: sizeStyles[size].label.fontSize }]}>
          Nivel {level}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  level: {
    fontWeight: '700',
    color: Colors.white,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  label: {
    marginTop: Spacing.xs,
    fontWeight: '600',
    color: Colors.text,
  },
});
