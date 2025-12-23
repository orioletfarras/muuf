import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

interface DateTimeSelectorProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  style?: ViewStyle;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  label,
  value,
  onChange,
  mode = 'datetime',
  minimumDate,
  maximumDate,
  style,
}) => {
  const [show, setShow] = useState(false);

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString('es-ES', options);
  };

  const formatTime = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleTimeString('es-ES', options);
  };

  const formatDateTime = (date: Date): string => {
    if (mode === 'date') return formatDate(date);
    if (mode === 'time') return formatTime(date);
    return `${formatDate(date)} ${formatTime(date)}`;
  };

  const getIcon = (): string => {
    if (mode === 'date') return '📅';
    if (mode === 'time') return '⏰';
    return '📆';
  };

  // For web/demo purposes, we'll use a simple button that cycles through times
  // In a real app, you'd use @react-native-community/datetimepicker
  const handlePress = () => {
    if (Platform.OS === 'web') {
      // Simple demo: add 1 hour
      const newDate = new Date(value);
      newDate.setHours(newDate.getHours() + 1);
      onChange(newDate);
    } else {
      setShow(true);
      // In real implementation, show native picker
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>{getIcon()}</Text>
        <Text style={styles.value}>{formatDateTime(value)}</Text>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.size.sm,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  icon: {
    fontSize: 20,
  },
  value: {
    flex: 1,
    fontSize: Typography.size.md,
    color: Colors.text,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 24,
    color: Colors.textSecondary,
    fontWeight: '300',
  },
});
