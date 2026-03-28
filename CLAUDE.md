# Nocked — Claude Code Project Notes

## Expo Go Compatibility (Critical)

**Expo Go always runs New Architecture (Fabric/TurboModules), regardless of `newArchEnabled` in app.json.**
- `newArchEnabled: false` is ignored in Expo Go — only affects custom/standalone builds.
- Any native module used must be New Architecture compatible.
- **Never use `react-native-reanimated` v3** — it crashes with `Exception in HostFunction: installTurboModule` on New Architecture + SDK 54.
- Use React Native's built-in `Animated` API instead (`import { Animated } from 'react-native'`).

## SDK Version

- Expo SDK: **54** (`expo: ~54.0.33`)
- React Native: **0.81.5**
- expo-router: **~6.0.23** (v4 is incompatible with expo@54)
- expo-linking: **~7.0.5** (required peer dep for expo-router v6)

## Architecture Rules

- **Named exports** for logic and components (`export function Foo`)
- **Default exports** for page/route files (`export default function Page`) — Expo Router requires this
- State: Zustand with AsyncStorage persistence (`src/store/useAppStore.ts`)
- Logic: pure functions in `src/logic/` — no side effects, no DB calls
- Types: `src/types/index.ts`

## Design System

- Palette: clay/cream only — `Colors.bgPrimary`, `clayLight`, `clayMid`, `clayDark`, `clayDarkest`, `cream`, `border`
- No green, red, or blue in UI
- Fonts: Cormorant Garamond (display) + Raleway + Montserrat (body)
- Flat design, no shadows

## Pushing to Expo Go (Workflow)

After committing and pushing, the user runs on their machine:
```
git pull origin <branch>
rmdir /s /q node_modules   # Windows
del package-lock.json
npm install --legacy-peer-deps
npx expo start --clear
```
Then scans the QR code with Expo Go (iOS/Android).

## Key Files

| File | Purpose |
|------|---------|
| `src/types/index.ts` | All shared TypeScript types |
| `src/store/useAppStore.ts` | Zustand store (bows, rounds, courses) |
| `src/logic/performance/` | Pure scoring/trend logic |
| `src/components/ui/` | Shared UI components (Animated* use built-in Animated only) |
| `app/(home)/index.tsx` | Home screen |
| `app/scoring/` | Scoring flow + performance dashboard |
| `app.json` | Expo config — do not add `newArchEnabled: false` (ignored in Go) |
