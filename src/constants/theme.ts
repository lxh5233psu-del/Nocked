// ─── Colors ───────────────────────────────────────────────────────────────────

export const Colors = {
  // Backgrounds
  bgPrimary: '#F4EFE4',
  bgSecondary: '#EDE7D9',
  bgTertiary: '#E5DDD0',

  // Clay spectrum
  clayDarkest: '#2E2720',
  clayDark: '#4A3D32',
  clayMid: '#6B5744',
  clayLight: '#A08060',
  clayPale: '#C4A882',

  // Text
  textPrimary: '#2E2720',
  textSecondary: '#6B5744',

  // Grey tones
  greyDark: '#5A5048',
  greyMid: '#8A7D70',
  greyLight: '#B5A898',

  // Borders
  border: '#D4C9B8',
  borderLight: '#E8E0D0',

  // Status
  statusComplete: '#5C7A5C',
  statusWarning: '#8A6A2E',
  statusInfo: '#4A6B8A',

  // Welcome screen
  welcomeBg: '#0C0907',
  welcomeBgMid: '#1A110A',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
// All weights use Exo 2 — bold, modern, rugged feel

export const Typography = {
  // Light body text
  body: {
    fontFamily: 'Exo2_400Regular',
  },
  bodyMedium: {
    fontFamily: 'Exo2_500Medium',
  },

  // UI labels and buttons
  label: {
    fontFamily: 'Exo2_600SemiBold',
    letterSpacing: 0.4,
  },
  labelMedium: {
    fontFamily: 'Exo2_700Bold',
    letterSpacing: 0.4,
  },

  // Headings and display
  display: {
    fontFamily: 'Exo2_800ExtraBold',
  },
  displayBold: {
    fontFamily: 'Exo2_900Black',
  },
} as const;

// ─── Font sizes ───────────────────────────────────────────────────────────────

export const FontSizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 42,
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 40,
} as const;

// ─── Border radius ────────────────────────────────────────────────────────────

export const Radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  xxl: 28,
  full: 999,
} as const;
