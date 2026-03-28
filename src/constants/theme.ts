export const Colors = {
  // Backgrounds — elevation through increasing lightness
  bgPrimary: '#0F0F0F',
  bgSecondary: '#181818',
  bgElevated: '#232323',

  // Accent — warm amber/gold
  accent: '#C4975A',

  // Text
  textPrimary: '#F0EDE8',
  textSecondary: '#909090',
  textDim: '#5E5E5E',

  // Borders
  border: '#2A2A2A',
  borderLight: '#333333',

  // Status
  statusComplete: '#5A8A5A',
  statusWarning: '#C4975A',
  statusError: '#8A4A4A',

  // Greys
  greyDark: '#3A3A3A',
  greyMid: '#5C5C5C',
  greyLight: '#8A8A8A',

  // Utility
  white: '#FFFFFF',

  // Clay aliases — remapped to warm amber equivalents for dark mode
  // Older screens use these names; values updated to preserve visual hierarchy
  clayDarkest: '#C4975A',
  clayDark: '#A07840',
  clayMid: '#7A5C30',
  clayLight: '#5A4428',

  // Heatmap tier colors (amber warm gradient on dark bg)
  heatHigh: '#C4975A',
  heatMid: '#7A5C35',
  heatLow: '#3D2E18',
  heatTrace: '#252018',
} as const;

export const Typography = {
  // Exo 2 — display / large headings
  display: {
    fontFamily: 'Exo2_300Light',
    letterSpacing: 0.5,
  },
  displayBold: {
    fontFamily: 'Exo2_600SemiBold',
    letterSpacing: 0.5,
  },

  // Exo 2 — body text
  body: {
    fontFamily: 'Exo2_300Light',
    letterSpacing: 0.2,
  },
  bodyMedium: {
    fontFamily: 'Exo2_400Regular',
    letterSpacing: 0.2,
  },

  // Exo 2 — UI labels
  label: {
    fontFamily: 'Exo2_300Light',
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  labelMedium: {
    fontFamily: 'Exo2_400Regular',
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
