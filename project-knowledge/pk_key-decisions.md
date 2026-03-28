# key-decisions.md
# Nocked — Key Decisions (Build-Relevant)

Only decisions with direct implications for how code is written or structured.

---

## Profile & Personalization

| Decision | Rule |
|---|---|
| Handedness | ALL left/right directional text passes through `handedness.ts` utility — never hardcode directions |
| Release type | Drives anchor point instructions (point of jaw vs under jaw) — reference profile, not hardcoded |
| Rest type | Drives which setup steps show (drop-away cable/limb, full capture, shoot-through) |
| Bow make/model | Drives all database lookups — never ask user to look up what app already knows |
| Unknown bow | Show generic instructions + "consult owner's manual" — never block progress |
| Units | Imperial/metric respected throughout — all measurements use `units.ts` utility |
| Multiple bows | Supported — active bow switcher on home screen, all modules reference active bow |

---

## Setup Phase

| Decision | Rule |
|---|---|
| Starting point | Bare bow — every component is a distinct installation step |
| Berger hole bolt | 1/4" Allen wrench standard — note to verify against rest hardware |
| Centershot method | Vice + string level + arrow level — not bow square |
| Arrow alignment | Through center of Berger hole at 90 degrees to string |
| String leveling | Perfectly plumb in BOTH lateral and fore/aft planes before any measurement |
| Nocking point options | Three options: D-loop only / nail knot below / nail knots above and below |
| Nail knot wraps | Upper = 4 wraps, Lower = 6-8 wraps |
| Peep in setup | Temporary wrap only — permanent serve happens after sight-in in tuning |
| First axis | Set at full draw in natural hold — NOT in vice |
| Tiller tuning | Removed — outdated for modern compound bows |
| Cam timing in setup | Visual check only in Step 1 (safety) — full diagnosis in diagnostics module |

---

## Tuning Phase

| Decision | Rule |
|---|---|
| Paper tuning fix priority | 1. Cam shimming 2. Limb pocket adjust 3. Specialty systems 4. Rest (last resort) 5. Arrow spine |
| Rest centershot | Preserve for bare shaft and broadhead tuning — rest moves as last resort in paper tuning |
| Walk-back | Fine-tuning only — micro adjustments, not course corrections |
| Bare shaft prerequisites | Nock tuning complete AND bare shaft produces bullet hole through paper first |
| Group tuning | Advanced module only — mutually exclusive with broadhead tuning |
| Broadhead tuning | Mutually exclusive with group tuning — user chooses one, never both |
| Cam timing/lean | Diagnostics module only — not a tuning variable to manipulate |
| Torque tuning | Advanced module only — risk of disturbing existing tune flagged |
| Draw length in tuning | Fine-tuning only — coarse adjustment happens in setup |

---

## Scoring Module

| Decision | Rule |
|---|---|
| 5 point body hit | NOT a drawn ring — body area outside scored rings scores 5. NEVER draw a 5 ring on any SVG |
| Score entry primary | Number entry only — visual tap-to-score does not exist |
| Arrow plot | Visualization only — NEVER calculates or overrides score |
| Score disagreement | Soft flag suggestion only — entry is always official |
| KWM order | Kill (left) / Miss (center) / Wound (right) |
| KWM kill | Inside 8 ring — 8, 10, 12/11 all count |
| KWM wound | Body hit outside scored rings — not a drawn ring |
| KWM wound value | Negative points — default -5 — fully supported in all score displays |
| KWM wound button | Visually distinct — darker — NEVER red |
| Custom scoring | Fully dynamic — buttons generated from ring definitions — never hardcoded |
| Avg per target | STORED at session save time — never computed on read |
| Course ID | Must be stored on scoring_session when scoring a saved course |
| Group/broadhead | Mutually exclusive — user selects one, app warns, never offers both |

---

## Performance Overview

| Decision | Rule |
|---|---|
| Primary metric | Avg per target (total ÷ targets) — total score is secondary |
| Summary card | Loads first — graphs load progressively |
| Trend direction | Compare last 5 sessions vs sessions 6-10 — use all data if fewer than 10 |
| Rolling average | 5-session — handle gracefully if fewer than 5 |
| Heat map colors | Clay tones only — dark clay = best, cream = miss |
| Minimum data | 3 sessions for trends, 2 same course for course trends |
| All calculations | Client-side SQLite — no backend required |

---

## Shot Analyzer

| Decision | Rule |
|---|---|
| Phase 1 | Manual guided review only — no AI detection |
| Video | Pre-recorded upload or in-app record — side view only |
| Official record | User answers drive results — video is reference |
| Storage | Local device only in MVP |
| Phase detection | Automatic with manual override — user can drag phase markers |

---

## Monetization (affects what to build)

| Decision | Rule |
|---|---|
| MVP | Completely free — no paywalls, no ads, no account required |
| Accounts | Optional — required only when user accesses social features |
| Phase 2 | Freemium + affiliate links — do not implement payment logic in MVP |
| Social features | Phase 2 — do not build in MVP |
