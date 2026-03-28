# folder-structure.md
# Nocked — File & Folder Structure

```
nocked/
├── app/                          # Expo Router pages (file-based routing)
│   ├── profile/                  # Phase 2 — user profiles
│   │   ├── [id].tsx              # Public profile page (pass id='me' for own profile)
│   │   └── edit.tsx              # Edit own profile (bio, bow type, privacy)
│   ├── feed/                     # Phase 2 — activity feed
│   │   └── index.tsx             # Paginated feed of sessions from followed archers
│   ├── (onboarding)/             # Onboarding flow — shown on first launch only
│   │   ├── welcome.tsx
│   │   ├── archer-profile.tsx
│   │   ├── discipline.tsx
│   │   ├── tool-inventory.tsx
│   │   ├── bow-profile.tsx
│   │   ├── arrow-profile.tsx
│   │   ├── release-profile.tsx
│   │   └── setup-check.tsx
│   ├── (tabs)/                   # Main app tab navigation
│   │   ├── index.tsx             # Home screen
│   │   ├── setup/                # Setup phase
│   │   │   ├── index.tsx         # Setup overview / step list
│   │   │   └── [step].tsx        # Dynamic step renderer (steps 1-12)
│   │   ├── form/                 # Form module
│   │   │   ├── index.tsx         # Form overview
│   │   │   └── [component].tsx   # Dynamic component renderer (1-8)
│   │   ├── tune/                 # Tuning phase
│   │   │   ├── index.tsx         # Session selector
│   │   │   ├── standard/         # Standard tuning methods
│   │   │   │   └── [method].tsx
│   │   │   └── advanced/         # Advanced tuning methods
│   │   │       └── [method].tsx
│   │   ├── score/                # Scoring module
│   │   │   ├── index.tsx         # Scoring home
│   │   │   ├── session-setup.tsx
│   │   │   ├── active-session.tsx
│   │   │   ├── session-summary.tsx
│   │   │   ├── arrow-plot.tsx
│   │   │   ├── course-builder/
│   │   │   │   ├── index.tsx
│   │   │   │   └── target-slot.tsx
│   │   │   └── performance/      # Performance Overview
│   │   │       ├── index.tsx
│   │   │       ├── course-trends.tsx
│   │   │       └── target-trend.tsx
│   │   ├── analyzer/             # Shot Analyzer
│   │   │   ├── index.tsx
│   │   │   ├── upload.tsx
│   │   │   ├── phase-detection.tsx
│   │   │   ├── review/
│   │   │   │   └── [component].tsx
│   │   │   ├── results.tsx
│   │   │   └── history.tsx
│   │   └── settings.tsx
│   └── _layout.tsx               # Root layout

├── src/
│   ├── components/               # Reusable UI components
│   │   ├── common/               # Buttons, cards, inputs, modals
│   │   ├── form/                 # SVG form animation components
│   │   ├── scoring/              # Score entry, arrow plot, target faces
│   │   ├── tuning/               # Tuning step cards, tear selectors
│   │   ├── charts/               # Performance Overview chart components
│   │   └── social/               # Phase 2 — social graph components
│   │       ├── ProfileHeader.tsx     # Avatar, bio, follow stats, CTA
│   │       ├── FollowButton.tsx      # Follow / unfollow toggle
│   │       ├── SessionFeedCard.tsx   # Session card in the activity feed
│   │       ├── LikeButton.tsx        # Like / unlike with count
│   │       └── CommentSheet.tsx      # Bottom-sheet comment thread + input
│   │
│   ├── store/                    # Zustand state stores
│   │   ├── useAppStore.ts        # Archer + bow + arrow + release + scoring (persisted)
│   │   └── useSocialStore.ts     # Phase 2 — follows, likes, comments, feed (persisted)
│   │
│   ├── types/
│   │   ├── index.ts              # Core domain types (ArcherProfile, ScoringRound, …)
│   │   └── social.ts             # Phase 2 types (SocialFollow, SessionLike, FeedItem, …)
│   │
│   ├── db/                       # SQLite database layer
│   │   ├── schema.ts             # Table definitions
│   │   ├── migrations.ts         # Schema migrations
│   │   ├── queries/              # Query functions per domain
│   │   │   ├── bowDatabase.ts    # Bow/sight/rest manufacturer data
│   │   │   ├── profile.ts        # User profile CRUD
│   │   │   ├── sessions.ts       # Scoring session CRUD
│   │   │   ├── courses.ts        # Course builder CRUD
│   │   │   └── tuning.ts         # Tuning session logs
│   │   └── seed/                 # Initial bow database seed data
│   │       ├── bows.ts
│   │       ├── sights.ts
│   │       ├── rests.ts
│   │       └── targets.ts
│   │
│   ├── logic/                    # Business logic — no UI
│   │   ├── tuning/
│   │   │   ├── paperTuning.ts    # Tear diagnosis + fix priority logic
│   │   │   ├── walkBack.ts       # Drift diagnosis logic
│   │   │   ├── bareShaft.ts      # Bare shaft comparison logic
│   │   │   └── broadhead.ts      # Broadhead deviation logic
│   │   ├── scoring/
│   │   │   ├── formats.ts        # Scoring format definitions
│   │   │   ├── calculator.ts     # Score calculation, avg per target
│   │   │   └── kwm.ts            # Kill/Wound/Miss zone logic
│   │   └── performance/
│   │       ├── trends.ts         # Rolling avg, trend direction
│   │       └── heatmap.ts        # Heat map data preparation
│   │
│   ├── assets/
│   │   ├── svgs/
│   │   │   ├── targets/          # Animal silhouettes (SVG 1 per animal)
│   │   │   ├── rings/            # Scoring ring zooms (SVG 2 per animal)
│   │   │   ├── form/             # Form animation SVGs
│   │   │   └── logo/             # App logo variants
│   │   └── fonts/                # Cormorant Garamond, Raleway, Montserrat
│   │
│   ├── constants/
│   │   ├── colors.ts             # Full design system palette
│   │   ├── typography.ts         # Font families, sizes, weights
│   │   ├── spacing.ts            # Spacing scale
│   │   └── formats.ts            # Scoring format definitions
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useProfile.ts
│   │   ├── useBowDatabase.ts
│   │   ├── useScoringSession.ts
│   │   └── usePerformanceTrends.ts
│   │
│   └── utils/                    # Pure utility functions
│       ├── handedness.ts         # Flip left/right instructions for LH
│       ├── units.ts              # Imperial/metric conversion
│       ├── drawLength.ts         # Wingspan calculation
│       └── formatting.ts         # Score display, date formatting

├── app.json                      # Expo config
├── tsconfig.json
├── package.json
└── README.md
```

---

## Key Conventions
- All pages live in `app/` — Expo Router file-based routing
- All reusable logic lives in `src/logic/` — no business logic in components
- All DB queries live in `src/db/queries/` — no raw SQL in components or stores
- SVG assets split by purpose — `targets/` for silhouettes, `rings/` for zoom views
- Seed data in `src/db/seed/` — populated at first app launch
