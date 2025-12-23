/**
 * StatCard Component - Display statistics with icon and value
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Card } from './Card';
import { Colors, Typography, Spacing } from '../constants/theme';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  subtitle,
  color = Colors.primary,
  onPress,
  style,
}) => {
  return (
    <Card onPress={onPress} style={[styles.container, style]} elevated>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.label}>{label}</Text>
          <Text style={[styles.value, { color }]}>{value}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: Typography.size.sm,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: Typography.size.xl,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: Typography.size.xs,
    color: Colors.textSecondary,
  },
});
