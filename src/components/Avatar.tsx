/**
 * Avatar Component
 */

import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Typography } from '../constants/theme';

export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  name?: string;
  imageUrl?: string;
  size?: AvatarSize;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  imageUrl,
  size = 'medium',
  backgroundColor = Colors.primary,
  textColor = Colors.white,
  style,
}) => {
  const sizeStyles = getSizeStyles(size);
  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        { backgroundColor },
        style,
      ]}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={[styles.image, sizeStyles.container]} />
      ) : (
        <Text style={[styles.text, sizeStyles.text, { color: textColor }]}>
          {initials}
        </Text>
      )}
    </View>
  );
};

const getInitials = (name?: string): string => {
  if (!name) return '?';

  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
};

const getSizeStyles = (size: AvatarSize) => {
  const sizes = {
    small: { dimension: 32, fontSize: 14 },
    medium: { dimension: 48, fontSize: 18 },
    large: { dimension: 64, fontSize: 24 },
    xlarge: { dimension: 96, fontSize: 36 },
  };

  const { dimension, fontSize } = sizes[size];

  return {
    container: {
      width: dimension,
      height: dimension,
      borderRadius: dimension / 2,
    },
    text: {
      fontSize,
    },
  };
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontWeight: '700',
  },
});
