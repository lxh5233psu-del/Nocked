// ─── Colors ───────────────────────────────────────────────────────────────────

export const Colors = {
  // ── Backgrounds (dark → elevated) ──────────────────────────────────────────
  bgPrimary:   '#0F0F0F',   // page background
  bgSecondary: '#181818',   // cards, first elevation
  bgTertiary:  '#232323',   // inputs, chips, second elevation
  bgElevated:  '#2C2C2C',   // active states, third elevation

  // ── Amber accent (replaces clay) ───────────────────────────────────────────
  // Warm gold that pops against dark grey — premium, archery-appropriate
  clayDarkest: '#1A1A1A',   // deep dark surface (banners, hero blocks)
  clayDark:    '#C4975A',   // primary accent — action buttons, active states
  clayMid:     '#8A6A3C',   // secondary accent
  clayLight:   '#D4AE7A',   // light accent / highlight
  clayPale:    '#E8CC9A',   // very light accent (badges, subtle tints)

  // ── Text ───────────────────────────────────────────────────────────────────
  textPrimary:   '#F0EDE8', // warm white — main content
  textSecondary: '#9A9088', // warm mid-grey — supporting text

  // ── Greys ──────────────────────────────────────────────────────────────────
  greyDark:  '#707070',     // strong secondary text
  greyMid:   '#909090',     // icons, metadata, secondary labels
  greyLight: '#5E5E5E',     // dim labels, captions, section headers

  // ── Borders ────────────────────────────────────────────────────────────────
  border:      '#2A2A2A',   // standard divider / card outline
  borderLight: '#1E1E1E',   // subtle row divider

  // ── Status ─────────────────────────────────────────────────────────────────
  statusComplete: '#5A8A5A', // muted green
  statusWarning:  '#C4975A', // amber (matches accent)
  statusInfo:     '#5A7A9A', // muted steel blue

  // ── Welcome screen ─────────────────────────────────────────────────────────
  welcomeBg:    '#0C0907',
  welcomeBgMid: '#1A110A',
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────

export const Typography = {
  body: {
    fontFamily: 'Exo2_400Regular',
  },
  bodyMedium: {
    fontFamily: 'Exo2_500Medium',
  },
  label: {
    fontFamily: 'Exo2_600SemiBold',
    letterSpacing: 0.4,
  },
  labelMedium: {
    fontFamily: 'Exo2_700Bold',
    letterSpacing: 0.4,
  },
  display: {
    fontFamily: 'Exo2_800ExtraBold',
  },
  displayBold: {
    fontFamily: 'Exo2_900Black',
  },
} as const;

// ─── Font sizes ───────────────────────────────────────────────────────────────

export const FontSizes = {
  xs:      11,
  sm:      13,
  base:    15,
  md:      16,
  lg:      18,
  xl:      20,
  xxl:     24,
  xxxl:    32,
  display: 42,
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────

export const Spacing = {
  xxs:  2,
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  28,
  xxxl: 40,
} as const;

// ─── Border radius ────────────────────────────────────────────────────────────

export const Radius = {
  sm:   6,
  md:   10,
  lg:   14,
  xl:   20,
  xxl:  28,
  full: 999,
} as const;
