export const Colors = {
  // Backgrounds
  bgPrimary: '#F4EFE4',
  bgSecondary: '#E8E0CC',

  // Clay tones
  clayDarkest: '#2E2720',
  clayDark: '#4A3D32',
  clayMid: '#6B5744',
  clayLight: '#8C7260',

  // Greys
  greyDark: '#3A3A3A',
  greyMid: '#5C5C5C',
  greyLight: '#8A8A8A',

  // Text
  textPrimary: '#2E2720',
  textSecondary: '#6B5744',

  // Accent
  accent: '#3A3A3A',

  // Utility
  border: '#D4C9B0',
  borderLight: '#E0D8C4',
  white: '#FFFFFF',

  // Status (earth tones only — no green)
  statusComplete: '#4A3D32',
  statusWarning: '#8C7260',
  statusError: '#6B3A2A',
} as const;

export const Typography = {
  // Cormorant Garamond — display / wordmark
  display: {
    fontFamily: 'CormorantGaramond_500Medium',
    letterSpacing: 0.5,
  },
  displayBold: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    letterSpacing: 0.5,
  },

  // Raleway — body
  body: {
    fontFamily: 'Raleway_300Light',
    letterSpacing: 0.2,
  },
  bodyMedium: {
    fontFamily: 'Raleway_400Regular',
    letterSpacing: 0.2,
  },

  // Montserrat — UI labels
  label: {
    fontFamily: 'Montserrat_200ExtraLight',
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  labelMedium: {
    fontFamily: 'Montserrat_300Light',
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const Radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
} as const;

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  base: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  display: 48,
} as const;
