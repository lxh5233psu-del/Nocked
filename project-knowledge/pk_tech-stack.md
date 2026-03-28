# tech-stack.md
# Nocked — Tech Stack

## Core

| Layer | Choice | Why |
|---|---|---|
| Framework | Expo (React Native) | Single codebase for iOS + Android, good ecosystem |
| Language | TypeScript | Type safety, catches errors early |
| Navigation | Expo Router | File-based routing, clean structure |
| State Management | Zustand | Lightweight, simple, no boilerplate |
| Local DB | expo-sqlite | On-device SQLite, no backend needed for MVP |
| Async Storage | @react-native-async-storage | Simple key-value for settings and preferences |

## UI & Animation

| Layer | Choice | Notes |
|---|---|---|
| UI Components | Custom only | No UI library — brand-specific design system |
| Icons | Lucide React Native | Consistent, clean icon set |
| Animations | React Native Reanimated | Gesture-driven animations |
| SVG | react-native-svg | Form module animations, logo, target faces, silhouettes |
| Charts | Victory Native | Performance trends, heat maps, bar charts |

## Media

| Layer | Choice | Notes |
|---|---|---|
| Video playback | expo-av | Shot Analyzer playback |
| Camera | expo-camera | Shot Analyzer recording |
| Image picker | expo-image-picker | Shot upload from camera roll |

## Dev & Quality

| Layer | Choice | Notes |
|---|---|---|
| Linting | ESLint + Prettier | Enforced on save |
| Testing | Jest + React Native Testing Library | Unit + component tests |
| Analytics | PostHog | Usage tracking, feature adoption |

## Phase 2 Only (do not implement in MVP)

| Layer | Choice | Notes |
|---|---|---|
| Backend | Supabase | Accounts, social, leaderboards |
| Payments | RevenueCat | In-app purchases, subscriptions |
| AI Pose Detection | MediaPipe | Shot Analyzer Phase 2 |

---

## What NOT to Use
- No UI libraries (NativeBase, React Native Paper, etc.) — design system is custom
- No Redux — Zustand is sufficient
- No Firebase — Supabase chosen for Phase 2
- No Axios — use native fetch
- No moment.js — use date-fns
- No lodash — use native JS where possible
- Do not install backend dependencies in MVP sprint
