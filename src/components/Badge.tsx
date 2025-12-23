/**
 * Badge Component - Small label/tag component
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

export type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
export type BadgeSize = 'small' | 'medium' | 'large';

interface BadgeComponentProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const BadgeComponent: React.FC<BadgeComponentProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
}) => {
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  return (
    <View style={[styles.container, variantStyles.container, sizeStyles.container, style]}>
      <Text style={[styles.text, variantStyles.text, sizeStyles.text, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const getVariantStyles = (variant: BadgeVariant) => {
  const variants = {
    default: {
      container: { backgroundColor: Colors.backgroundSecondary },
      text: { color: Colors.text },
    },
    success: {
      container: { backgroundColor: `${Colors.success}20` },
      text: { color: Colors.success },
    },
    error: {
      container: { backgroundColor: `${Colors.error}20` },
      text: { color: Colors.error },
    },
    warning: {
      container: { backgroundColor: `${Colors.warning}20` },
      text: { color: Colors.warning },
    },
    info: {
      container: { backgroundColor: `${Colors.info}20` },
      text: { color: Colors.info },
    },
  };

  return variants[variant];
};

const getSizeStyles = (size: BadgeSize) => {
  const sizes = {
    small: {
      container: {
        paddingHorizontal: Spacing.xs,
        paddingVertical: 2,
      },
      text: {
        fontSize: Typography.size.xs,
      },
    },
    medium: {
      container: {
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
      },
      text: {
        fontSize: Typography.size.sm,
      },
    },
    large: {
      container: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
      },
      text: {
        fontSize: Typography.size.md,
      },
    },
  };

  return sizes[size];
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
  },
});
