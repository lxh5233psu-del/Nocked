# coding-conventions.md
# Nocked — Coding Conventions

## TypeScript

- Strict mode enabled — no `any` types
- All props typed with interfaces, not inline types
- Enums for fixed value sets (handedness, rest type, format, etc.)
- Prefer `const` — use `let` only when reassignment is needed
- No default exports from logic files — named exports only
- Default exports for page components (Expo Router requirement)

```typescript
// Good
export interface BowProfile {
  id: number
  nickname: string
  manufacturer: string
  restType: RestType
}

export enum RestType {
  DropCable = 'drop_cable',
  DropLimb = 'drop_limb',
  FullCapture = 'full_capture',
  ShootThrough = 'shoot_through',
}

// Bad
const profile: any = {}
export default function getProfile() {}
```

---

## Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase | `ScoreEntryCard` |
| Pages | kebab-case (Expo Router) | `active-session.tsx` |
| Hooks | camelCase with `use` prefix | `useScoringSession` |
| Store files | camelCase with `Store` suffix | `profileStore.ts` |
| DB query files | camelCase | `sessions.ts` |
| Logic files | camelCase | `paperTuning.ts` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_LIMB_BOLT_TURNS` |
| CSS/style keys | camelCase | `backgroundColor` |

---

## Component Structure

```typescript
// Standard component structure
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Colors } from '@/constants/colors'

interface Props {
  title: string
  onPress: () => void
}

export function ScoreEntryCard({ title, onPress }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cream,
    padding: 16,
  },
  title: {
    fontFamily: 'Raleway_400Regular',
    color: Colors.clayDark,
  },
})
```

---

## State Management (Zustand)

- One store per domain — profile, session, tuning, settings
- No cross-store dependencies
- Selectors for derived data — don't compute in components
- Actions co-located with state in store file

```typescript
// Good
const score = useScoringSession(state => state.currentEndTotal)

// Bad
const session = useScoringSession()
const score = session.scores.reduce((a, b) => a + b, 0)
```

---

## Database

- All SQL in `src/db/queries/` — never inline SQL in components or stores
- Always use parameterized queries — never string interpolation
- Wrap mutations in transactions where multiple writes occur
- `avg_per_target` ALWAYS calculated and stored on session save — never on read

```typescript
// Good
await db.runAsync(
  'INSERT INTO scoring_session (archer_id, format) VALUES (?, ?)',
  [archerId, format]
)

// Bad
await db.runAsync(`INSERT INTO scoring_session (archer_id) VALUES (${archerId})`)
```

---

## Business Logic

- All tuning diagnosis logic in `src/logic/tuning/`
- All scoring calculation logic in `src/logic/scoring/`
- All performance trend calculations in `src/logic/performance/`
- Logic functions are pure — no side effects, no DB calls, no navigation
- Logic functions take typed inputs, return typed outputs

```typescript
// Good — pure logic function
export function diagnosePaperTear(
  tear: TearDirection,
  handedness: Handedness,
  bowId: number,
  availableSystems: TuningSystem[]
): TearDiagnosis {
  // ...
}
```

---

## Handedness

- ALL left/right directional instructions must pass through `src/utils/handedness.ts`
- Never hardcode "left" or "right" in tuning/form instruction strings
- Use the `flipForHandedness(instruction, handedness)` utility

---

## Error Handling

- All DB operations wrapped in try/catch
- User-facing errors displayed via a toast or inline error component
- Never `console.log` in production — use a logger utility
- Loading states always shown for async operations

---

## File Length

- Components: aim for under 200 lines — extract sub-components if longer
- Logic files: no limit but keep functions small and single-purpose
- No file should do more than one thing

---

## Comments

- Comment the WHY not the WHAT
- All public logic functions have a one-line JSDoc description
- No commented-out code committed
