# tuning-logic.md
# Nocked — Tuning Logic

---

## Paper Tuning

### Tear Diagnosis

```typescript
type TearDirection = 'high' | 'low' | 'left' | 'right' |
  'high_left' | 'high_right' | 'low_left' | 'low_right' | 'bullet_hole'

interface TearDiagnosis {
  issue: string
  fixes: TuningFix[]   // ordered by priority
}
```

**Single tear fixes — RH shooter (LH flips left/right via handedness.ts):**

| Tear | First Fix | Second Fix | Third Fix |
|---|---|---|---|
| High | Lower rest height | Lower nocking point | Check cam timing — top cam ahead |
| Low | Raise rest height | Raise nocking point | Check cam timing — bottom cam ahead |
| Left | Cam shimming → limb pocket → rest right | Arrow spine (too weak) | Check centershot |
| Right | Cam shimming → limb pocket → rest left | Arrow spine (too stiff) | Check centershot |

**Combination tears — always fix vertical first, retest, then horizontal**

### Fix Priority Order (horizontal tears)
1. Cam shimming system (if available on bow — check bow_database)
2. Limb pocket adjustment system (if available — check bow_database)
3. Specialty tuning systems (if available — check bow_database)
4. Rest adjustment (last resort — preserves rest range for bare shaft + broadhead)
5. Arrow spine (if all mechanical adjustments exhausted)

### Re-diagnosis Triggers
If adjustment made and tear unchanged, ask:
- Did tear change direction? → new diagnosis
- Did tear get larger? → adjustment went wrong direction, reverse
- Is form consistent? → flag form issue, return to form module
- Has arrow spine been verified? → flag arrow selection

---

## Walk-back Tuning

**Setup:** Golf tee or target center ring as aiming point. Plumb bob hanging from aiming point. Sight left at 20 yard mark throughout.

**Diagnosis — RH shooter:**
| Arrows relative to plumb | Fix |
|---|---|
| On plumb line | Centershot correct — no adjustment |
| Left of plumb | Move rest left (micro increment) |
| Right of plumb | Move rest right (micro increment) |

**Critical:** This is fine-tuning only. Micro adjustments. Not course correction.

---

## Bare Shaft Tuning

### Prerequisites (both must be true before testing)
1. Nock tuning complete — consistent orientation on all arrows
2. Bare shaft produces bullet hole through paper at 6 feet

### Results Interpretation — RH shooter

**Vertical:**
| Bare shaft position | Fix |
|---|---|
| With fletched group | Correct |
| High of fletched | Nocking point too low → raise nocking point |
| Low of fletched | Nocking point too high → lower nocking point |

**Horizontal:**
| Bare shaft position | First fix | Second fix |
|---|---|---|
| With fletched group | Correct | — |
| Left of fletched | Arrow too stiff → increase point weight | Then micro rest adjustment |
| Right of fletched | Arrow too weak → decrease point weight | Then micro rest adjustment |

**Outlier arrow rule:** Single arrow behaving differently → suspect nock orientation first (rotate 90° and retest) before assuming spine/tune issue

---

## Broadhead Tuning

**Prerequisites:**
- Rest at or very close to centershot
- Group tuning NOT performed (mutually exclusive)

**Broadhead types:**
- Fixed blade: most sensitive — blade surface creates steering
- Mechanical: flies most like field point
- Hybrid: moderate sensitivity

**Deviation fixes — RH shooter:**
| Broadhead impact vs field points | Fix |
|---|---|
| High | Try lighter broadhead OR raise nocking point slightly |
| Low | Try heavier broadhead OR lower nocking point slightly |
| Left | Cam shimming first → micro rest adjustment left |
| Right | Cam shimming first → micro rest adjustment right |
| Large deviation | Arrow spine issue — not a broadhead tuning fix |

**Fixed blade: blade indexing**
- Standard: one blade aligned with cock vane
- If still off: rotate broadhead on insert in small increments until grouping with field points
- Mark inserts for consistent future installation

**Re-tune triggers:**
New arrows / different broadhead / draw weight change / rest position change / string replacement / significant temperature change

---

## Group Tuning (Advanced Only)

**Methodology:**
1. Document + photograph control rest position
2. Shoot 3-5 groups at control — record avg group size (baseline)
3. Move rest smallest increment left → shoot 3-5 groups → record
4. Return to control → move right → shoot 3-5 groups → record
5. Continue in direction of improvement one increment at a time
6. Confirm sweet spot with 5-7 groups
7. If horizontal plateaus → explore vertical (secondary only)

**Warning displayed:** Group tuning intentionally moves rest away from centershot. Mutually exclusive with broadhead tuning.

---

## Handedness Flip

All tuning logic is written for RH shooter. LH instructions are generated via:

```typescript
// src/utils/handedness.ts
export function flipForHandedness(
  direction: 'left' | 'right',
  handedness: 'RH' | 'LH'
): 'left' | 'right' {
  if (handedness === 'LH') {
    return direction === 'left' ? 'right' : 'left'
  }
  return direction
}
```

Apply to:
- Paper tear direction labels
- Rest adjustment instructions
- Walk-back drift instructions
- Bare shaft deviation instructions
- Broadhead deviation instructions

---

## Bow Database Lookups in Tuning

Before suggesting rest movement for horizontal tears:
```typescript
const bow = await getBowFromDatabase(bowProfile.manufacturer, bowProfile.model)

if (bow.camShimSystem) {
  // Show cam shimming instructions first
} else if (bow.limbPocketAdjust) {
  // Show limb pocket instructions
} else {
  // Skip to rest adjustment
}
```

If bow not in database → show generic instructions + "consult owner's manual for available adjustment systems"
