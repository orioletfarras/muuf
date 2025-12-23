import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  Platform,
} from 'react-native';
import { Colors, BorderRadius } from '../constants/theme';

interface FloatingActionButtonProps {
  icon?: string;
  label?: string;
  onPress: () => void;
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  backgroundColor?: string;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon = '+',
  label,
  onPress,
  position = 'bottom-right',
  backgroundColor = Colors.primary,
  size = 'large',
  style,
}) => {
  const sizeStyles = {
    small: { width: 48, height: 48 },
    medium: { width: 56, height: 56 },
    large: { width: 64, height: 64 },
  };

  const iconSizes = {
    small: 20,
    medium: 24,
    large: 28,
  };

  const positionStyles: Record<string, ViewStyle> = {
    'bottom-right': { bottom: 20, right: 20 },
    'bottom-center': { bottom: 20, alignSelf: 'center' },
    'bottom-left': { bottom: 20, left: 20 },
  };

  return (
    <TouchableOpacity
      style={[
        styles.fab,
        sizeStyles[size],
        { backgroundColor },
        positionStyles[position],
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.icon, { fontSize: iconSizes[size] }]}>{icon}</Text>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.3,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  icon: {
    color: Colors.white,
    fontWeight: '600',
  },
  label: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
});
