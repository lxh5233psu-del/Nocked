# feature-kickoff-template.md
# Nocked — Feature Chat Kickoff Template

Copy and fill in this template at the start of every new Claude Code feature chat.

---

```
## Feature: [Feature Name]

### What I'm building
[One or two sentences describing what this feature does and why it exists in the app]

### Relevant project knowledge files
[List which PK files are most relevant — e.g. scoring-module.md, data-models.md, design-system.md]

### Relevant existing files
[List specific files that will be created or modified — e.g. app/(tabs)/score/active-session.tsx, src/logic/scoring/calculator.ts]

### Current behavior
[What happens right now — or "this is a new feature, nothing exists yet"]

### Desired behavior
[Exactly what should happen when this feature is complete — be specific]

### Constraints and decisions already made
[Any decisions from key-decisions.md that directly apply — copy them here so Claude has them top of mind]
- [Decision 1]
- [Decision 2]

### What I don't want
[Anything Claude might do that would be wrong — common mistakes to avoid]
- [e.g. "Do not use red for the wound button"]
- [e.g. "Arrow plot must never calculate or override the score"]

### Acceptance criteria
[How will I know this is done correctly — list 3-5 specific things that must be true]
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
```

---

## Example (filled in)

```
## Feature: Kill / Wound / Miss Score Entry Screen

### What I'm building
The active session score entry screen for KWM format sessions. Three large buttons (Kill, Miss, Wound) with point values displayed. Running total handles negative scores.

### Relevant project knowledge files
scoring-module.md, design-system.md, data-models.md, key-decisions.md

### Relevant existing files
- app/(tabs)/score/active-session.tsx (modify)
- src/logic/scoring/kwm.ts (create)
- src/components/scoring/KWMButtons.tsx (create)

### Current behavior
active-session.tsx currently only supports number entry for standard formats. KWM has no implementation yet.

### Desired behavior
When session format is 'kwm', the score entry area shows three large buttons labeled with the session's configured Kill/Miss/Wound labels and values. Tapping a button records that score for the current arrow. Running total updates immediately and correctly handles negative values. After all arrows are scored the "Plot arrows" button appears.

### Constraints and decisions already made
- Kill left / Miss center / Wound right — always this order
- Wound button is darker than neutral but NEVER red
- Wound value is negative — running total must handle and display negative correctly
- KWM config values come from scoring_session.scoring_config — not hardcoded
- Number entry is primary — this IS the number entry for KWM (three buttons replace the number pad)

### What I don't want
- Do not make the wound button red or use any color outside the clay/grey palette
- Do not hardcode Kill/Miss/Wound labels — read from scoring_config
- Do not block the "Plot arrows" button from appearing after scoring

### Acceptance criteria
- [ ] Three buttons render with correct labels and values from session config
- [ ] Tapping Kill records positive value, Wound records negative value
- [ ] Running total displays correctly when score goes negative (e.g. "-3")
- [ ] Wound button is visually distinct but not red
- [ ] "Plot arrows" button appears after all arrows in end are scored
```
