/**
 * Progress Bar Component
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius } from '../constants/theme';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  color = Colors.primary,
  backgroundColor = Colors.border,
  showLabel = false,
  label,
  animated = true,
}) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.spring(animatedWidth, {
        toValue: Math.min(Math.max(progress, 0), 100),
        useNativeDriver: false,
        tension: 40,
        friction: 8,
      }).start();
    } else {
      animatedWidth.setValue(Math.min(Math.max(progress, 0), 100));
    }
  }, [progress, animated, animatedWidth]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label || `${Math.round(progress)}%`}</Text>
        </View>
      )}
      <View style={[styles.track, { height, backgroundColor }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              height,
              backgroundColor: color,
              width: widthInterpolated,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  track: {
    width: '100%',
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: BorderRadius.sm,
  },
});
