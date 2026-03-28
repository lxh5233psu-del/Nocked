# design-system.md
# Nocked — Design System

## Color Palette

```typescript
export const Colors = {
  // Backgrounds
  cream:        '#F4EFE4',   // Primary background
  creamDark:    '#E8E0CC',   // Secondary background, cards

  // Clay tones (primary brand colors)
  clayDarkest:  '#2E2720',   // Text primary, darkest fills
  clayDark:     '#4A3D32',   // Dark fills, secondary text
  clayMid:      '#6B5744',   // Mid fills, borders
  clayLight:    '#8C7260',   // Light fills, placeholders, taglines

  // Greys (secondary palette)
  greyDark:     '#3A3A3A',   // Arrow shafts, dark UI elements
  greyMid:      '#5C5C5C',   // Secondary UI elements
  greyLight:    '#8A8A8A',   // Disabled, subtle text

  // Scoring colors (arrow plot, heat map)
  scoreExcellent: '#2E2720', // Dark clay — best score (12/X/kill)
  scoreGood:      '#4A3D32', // Mid clay — good score (10)
  scoreAverage:   '#6B5744', // Light clay — average (8)
  scoreLow:       '#8A8A8A', // Grey — body hit / wound
  scoreMiss:      '#F4EFE4', // Cream — miss (with outline)

  // KWM specific
  kwmKill:        '#6B5744', // Warm clay
  kwmWound:       '#3A3A3A', // Dark grey
  kwmMiss:        '#F4EFE4', // Cream with outline

  // Status
  statusOk:       '#4A3D32', // Approved / good — clay (never green)
  statusWarn:     '#8C7260', // Warning — light clay (never yellow)
  statusStop:     '#2E2720', // Stop / error — darkest clay (never red)

  // Never use
  // green, red, blue, purple, yellow, orange — not in this palette
}
```

---

## Typography

```typescript
export const Typography = {
  // Display / Wordmark — Cormorant Garamond
  display: {
    fontFamily: 'CormorantGaramond_500Medium',
    letterSpacing: 4,
  },
  displayBold: {
    fontFamily: 'CormorantGaramond_600SemiBold',
    letterSpacing: 6,
  },

  // Body — Raleway
  body: {
    fontFamily: 'Raleway_400Regular',
    lineHeight: 1.6,
  },
  bodyLight: {
    fontFamily: 'Raleway_300Light',
  },
  bodySemiBold: {
    fontFamily: 'Raleway_600SemiBold',
  },

  // UI Labels — Montserrat
  label: {
    fontFamily: 'Montserrat_300Light',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  labelMedium: {
    fontFamily: 'Montserrat_400Regular',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
}

// Font size scale
export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 28,
  display: 36,
}
```

---

## Spacing Scale

```typescript
export const Spacing = {
  xs:   4,
  sm:   8,
  md:   16,
  lg:   24,
  xl:   32,
  xxl:  48,
  xxxl: 64,
}
```

---

## Component Patterns

**Cards:**
- Background: `Colors.creamDark`
- Border radius: 4px
- Padding: `Spacing.md`
- No drop shadows — flat design

**Buttons — Primary:**
- Background: `Colors.clayDark`
- Text: `Colors.cream`
- Border radius: 4px
- Font: `Typography.label`
- Padding: `Spacing.sm` vertical / `Spacing.lg` horizontal

**Buttons — Secondary:**
- Background: transparent
- Border: 1px `Colors.clayMid`
- Text: `Colors.clayDark`

**Score Entry Buttons:**
- Large touch targets — minimum 64px height
- Point value displayed below ring name in smaller font
- Dynamically generated — never hardcoded

**Destructive / Warning:**
- Never use red
- Use `Colors.clayDarkest` for hard stops
- Use `Colors.clayLight` for soft warnings
- Wound button in KWM: `Colors.greyDark` background — darker than neutral, not red

---

## SVG Conventions

**Target Silhouettes (SVG 1):**
- ViewBox: 200x200
- Fill: `Colors.clayDark` on `Colors.cream` background
- Flat design — no gradients, no shadows
- Scoring zone overlays: semi-transparent fills, ~30% opacity
- Ring labels: `Typography.label` style, `Colors.cream` fill

**Scoring Ring Zoom (SVG 2):**
- ViewBox: 300x300 (larger for precision plotting)
- Background: `Colors.cream`
- Ring strokes: `Colors.clayDark`, 1.5px
- Ring fill: progressively lighter clay tones from center out
- Labels inside rings: `Colors.clayDarkest`
- NEVER draw a 5 ring on 3D target SVGs

**Form Animation SVGs:**
- Correct side: `Colors.clayDark` figure on `Colors.cream`
- Incorrect side: `Colors.greyMid` figure — visually recessed
- Callout lines: `Colors.clayMid`, dashed
- Side by side layout — correct left, incorrect right
- Looping animation where appropriate

---

## Layout Principles

- Mobile-first — design for 390px width
- One-handed use — primary actions reachable with thumb
- Generous touch targets — minimum 44px
- Form reminder card: collapsible, never blocking
- Progress indicators on all multi-step flows
- Back button always available
- Skip option on all non-critical fields

---

## What Never To Do

- Never use green, red, blue, yellow, or purple anywhere in the UI
- Never use Inter, Roboto, Arial, or system fonts
- Never use drop shadows — flat design throughout
- Never use a UI component library
- Never use bright accent colors for status — stay within clay/grey palette
- Never make the wound button red in KWM scoring
