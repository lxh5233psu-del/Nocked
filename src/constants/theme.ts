// ─── Colors ───────────────────────────────────────────────────────────────────

export const Colors = {
  // Backgrounds
  bgPrimary: '#F4EFE4',
  bgSecondary: '#EDE7D9',
  bgTertiary: '#E5DDD0',

  // Clay spectrum (dark → light) — NO pure green, only archery-warm tones
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

  // Status — muted, on-brand
  statusComplete: '#5C7A5C',
  statusWarning: '#8A6A2E',
  statusInfo: '#4A6B8A',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const Typography = {
  // Cormorant Garamond — display / headings
  display: {
    fontFamily: 'CormorantGaramond_400Regular',
  },
  displayBold: {
    fontFamily: 'CormorantGaramond_700Bold',
  },

  // Raleway — body text
  body: {
    fontFamily: 'Raleway_400Regular',
  },
  bodyMedium: {
    fontFamily: 'Raleway_500Medium',
  },

  // Montserrat — labels, caps, UI chrome
  label: {
    fontFamily: 'Montserrat_500Medium',
    letterSpacing: 0.5,
  },
  labelMedium: {
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 0.5,
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
