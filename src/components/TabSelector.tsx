import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';

export interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface TabSelectorProps {
  tabs: Tab[];
  selectedTab: string;
  onSelectTab: (tabId: string) => void;
  style?: ViewStyle;
  variant?: 'default' | 'pills' | 'underline';
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  selectedTab,
  onSelectTab,
  style,
  variant = 'default',
}) => {
  const renderDefaultTabs = () => (
    <View style={[styles.container, styles.defaultContainer, style]}>
      {tabs.map((tab, index) => {
        const isSelected = selectedTab === tab.id;
        const isFirst = index === 0;
        const isLast = index === tabs.length - 1;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.defaultTab,
              isSelected && styles.defaultTabActive,
              isFirst && styles.defaultTabFirst,
              isLast && styles.defaultTabLast,
            ]}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.defaultTabText,
                isSelected && styles.defaultTabTextActive,
              ]}
            >
              {tab.label}
              {tab.count !== undefined && ` (${tab.count})`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderPillsTabs = () => (
    <View style={[styles.container, styles.pillsContainer, style]}>
      {tabs.map((tab) => {
        const isSelected = selectedTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.pill, isSelected && styles.pillActive]}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
              {tab.label}
              {tab.count !== undefined && ` (${tab.count})`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderUnderlineTabs = () => (
    <View style={[styles.container, styles.underlineContainer, style]}>
      {tabs.map((tab) => {
        const isSelected = selectedTab === tab.id;

        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.underlineTab, isSelected && styles.underlineTabActive]}
            onPress={() => onSelectTab(tab.id)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.underlineTabText,
                isSelected && styles.underlineTabTextActive,
              ]}
            >
              {tab.label}
              {tab.count !== undefined && ` (${tab.count})`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  switch (variant) {
    case 'pills':
      return renderPillsTabs();
    case 'underline':
      return renderUnderlineTabs();
    default:
      return renderDefaultTabs();
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  // Default variant
  defaultContainer: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.md,
    padding: 4,
  },
  defaultTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultTabFirst: {
    borderTopLeftRadius: BorderRadius.sm,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  defaultTabLast: {
    borderTopRightRadius: BorderRadius.sm,
    borderBottomRightRadius: BorderRadius.sm,
  },
  defaultTabActive: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderRadius: BorderRadius.sm,
  },
  defaultTabText: {
    fontSize: Typography.size.sm,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  defaultTabTextActive: {
    color: Colors.text,
    fontWeight: '600',
  },
  // Pills variant
  pillsContainer: {
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  pill: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: Typography.size.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  pillTextActive: {
    color: Colors.white,
  },
  // Underline variant
  underlineContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  underlineTab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  underlineTabActive: {
    borderBottomColor: Colors.primary,
  },
  underlineTabText: {
    fontSize: Typography.size.md,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  underlineTabTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
