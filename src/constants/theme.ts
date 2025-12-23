/**
 * Theme constants for MUUF app
 * Extracted from Figma design
 */

export const Colors = {
  // Primary colors
  primary: '#FF6B35',
  primaryDark: '#E85A2A',
  primaryLight: '#FF8C61',

  // Secondary colors
  secondary: '#4ECDC4',
  secondaryDark: '#3DB8AF',
  secondaryLight: '#6FD9D1',

  // Neutral colors
  background: '#FFFFFF',
  backgroundSecondary: '#F7F7F7',
  surface: '#FFFFFF',
  white: '#FFFFFF',

  // Text colors
  text: '#2D3142',
  textSecondary: '#757575',
  textDisabled: '#BDBDBD',

  // Status colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',

  // UI elements
  border: '#E0E0E0',
  divider: '#EEEEEE',
  disabled: '#9E9E9E',

  // Shadows
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',

  // Transparent
  transparent: 'transparent',

  // Gradients
  gradientStart: '#FF6B35',
  gradientEnd: '#4ECDC4',
};

export const Typography = {
  // Font families
  fontFamily: {
    regular: 'Fustat_400Regular',
    medium: 'Fustat_500Medium',
    semibold: 'Fustat_600SemiBold',
    bold: 'Fustat_700Bold',
    extrabold: 'Fustat_800ExtraBold',
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Alias for fontSize (for backward compatibility)
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },

  // Font weights
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const Layout = {
  containerPadding: Spacing.md,
  maxWidth: 600,
  headerHeight: 64,
  tabBarHeight: 64,
  buttonHeight: 48,
  inputHeight: 48,
};
