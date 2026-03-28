# scoring-module.md
# Nocked — Scoring Module Logic

---

## Format Definitions

```typescript
export const ScoringFormats = {
  asa:      { rings: [12, 10, 8], bodyHit: 5, miss: 0 },
  ibo:      { rings: [11, 10, 8], bodyHit: 5, miss: 0 },
  nfaa_3d:  { rings: [10, 8],    bodyHit: 5, miss: 0 },
  vegas:    { rings: ['X', 10, 9], miss: 0, xValue: 10 },
  vegas_5:  { rings: ['X', 10, 9], miss: 0, xValue: 10, spots: 5 },
  nfaa_indoor: { rings: [5, 4, 3, 2, 1], miss: 0 },
  wa:       { rings: ['X', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1], miss: 0, xValue: 10 },
  nfaa_field: { rings: [5, 4, 3, 2, 1], miss: 0 },
  wa_field:   { rings: [6, 5, 4, 3, 2, 1], miss: 0 },
}
```

**CRITICAL:** ASA, IBO, NFAA 3D have NO drawn 5 ring. `bodyHit: 5` means any arrow touching the animal body outside the drawn rings scores 5. Never render a 5 ring SVG.

---

## Kill / Wound / Miss Logic

**Zone definitions:**
- **Kill** = inside the 8 ring (8, 10, 12/11 all count)
- **Miss** = no contact with target
- **Wound** = body hit outside scored rings (same area as 5pts in standard scoring)

**Default config:**
```typescript
const defaultKWM = {
  killLabel: 'Kill',   killValue: 5,
  missLabel: 'Miss',   missValue: 0,
  woundLabel: 'Wound', woundValue: -5,  // negative — fully supported
}
```

**Negative scores must work correctly in:**
- Running total display
- Session summary
- Leaderboard ranking (highest to lowest — negative scores rank below zero correctly)
- Final scorecard

**Button order always:** Kill (left) / Miss (center) / Wound (right)
**Wound button:** visually darker than neutral — NEVER red

---

## Custom Scoring

Custom rounds store ring definitions as JSON in `scoring_config`:

```typescript
interface CustomRing {
  name: string           // free text
  value: number          // any number — positive, negative, or zero
  color: string          // hex color from user's color picker
  isTiebreaker: boolean  // tracked separately like X count
}

interface CustomScoringConfig {
  rings: CustomRing[]    // ordered outside to inside
  missLabel: string
  missValue: number
}
```

Score entry buttons are **dynamically generated** from this config. Never hardcode custom format buttons.

---

## Vegas Five Spot

- 5 independent spots on one target face
- Each spot scored independently
- Score entry: user scores each spot via number entry (5 entries per end)
- X count tracked across all 5 spots combined
- Arrow plot: separate impact circle per spot

---

## X Count

X ring formats: Vegas, Vegas 5-spot, WA (world archery)

```typescript
// X counts as face value toward total
totalScore += xValue  // typically 10

// X count tracked separately
session.xCount += 1

// Display format
`${totalScore} + ${xCount}X`

// Tiebreaker: equal total scores ranked by xCount descending
```

---

## Session Structure

**Ends-based** (indoor, outdoor, field):
- `unit_number` in `scoring_end` = end number
- Display: "End 3 of 10"
- Running total updated after each end

**Targets-based** (3D):
- `unit_number` in `scoring_end` = target number
- Display: "Target 7 of 20"
- Running total updated after each target

---

## Average Per Target Calculation

```typescript
// Calculated ONCE at session save — stored in scoring_session.avg_per_target
const avgPerTarget = totalScore / totalUnits

// Never recalculate on read — always use stored value
```

---

## Arrow Plot

**Two panel screen:**
- Panel 1: target silhouette reference (SVG 1)
- Panel 2: scoring ring zoom — plotting surface (SVG 2)

**Impact circle data structure:**
```typescript
interface ArrowImpact {
  x: number          // 0-1 normalized position on Panel 2
  y: number          // 0-1 normalized position on Panel 2
  score: string | number  // the ring value at that position
  arrowNumber: number
}
```

**Score disagreement — soft flag only:**
- Compare plotted zone ring value vs entered score
- If mismatch → suggest correction — user decides
- Entry is ALWAYS official — plot never overrides

**Kill/Wound/Miss zones on Panel 2:**
- Inside 8 ring = Kill zone (clay overlay ~30% opacity)
- Body area outside scored rings = Wound zone (grey overlay ~30% opacity)
- Outside target = Miss

---

## Course Builder

A course stores target assignments:
```typescript
// Each slot in a course references a target from target_database
// + allows custom override name and optional yardage/notes/difficulty
```

When scoring a saved course:
- `course_id` MUST be stored on `scoring_session`
- `target_database_id` stored on `scoring_end` for SVG asset lookup
- `target_name` (custom) stored on `scoring_end` for display

---

## Performance Overview Data Prep

**Rolling 5-session average:**
```typescript
const last5 = sessions.slice(-5)
const rolling = last5.reduce((sum, s) => sum + s.avgPerTarget, 0) / last5.length
```

**Trend direction:**
```typescript
const recent = sessions.slice(-5)
const older = sessions.slice(-10, -5)
const recentAvg = average(recent.map(s => s.avgPerTarget))
const olderAvg = average(older.map(s => s.avgPerTarget))
const diff = recentAvg - olderAvg
// diff > 0.5 → '↑' / diff < -0.5 → '↓' / else → '→'
```

**Heat map cell color:**
```typescript
function heatMapColor(score: number, maxScore: number): string {
  const pct = score / maxScore
  if (pct >= 0.9) return Colors.clayDarkest   // excellent
  if (pct >= 0.75) return Colors.clayDark     // good
  if (pct >= 0.6) return Colors.clayMid       // average
  if (pct > 0) return Colors.greyLight        // low / body hit
  return Colors.cream                          // miss
}
```
