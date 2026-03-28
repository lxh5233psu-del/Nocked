# maintenance-checklist.md
# Nocked — Project Knowledge Maintenance Checklist

Review this after every feature is built. Update any file that has changed.

---

## After Every Feature

- [ ] **folder-structure.md** — Did any new files, folders, or pages get created? Update the tree.
- [ ] **data-models.md** — Did any new tables or columns get added? Update the schema.
- [ ] **key-decisions.md** — Were any new decisions made during the build? Add them.

---

## After Specific Feature Types

**After any tuning feature:**
- [ ] **tuning-logic.md** — Did diagnosis logic, fix priority, or re-diagnosis flow change?

**After any scoring feature:**
- [ ] **scoring-module.md** — Did format definitions, KWM logic, custom scoring, or arrow plot logic change?

**After any UI/design work:**
- [ ] **design-system.md** — Were any new component patterns, colors, or conventions introduced?

**After any state or DB work:**
- [ ] **data-models.md** — Verify schema matches what was actually built
- [ ] **coding-conventions.md** — Were any new patterns introduced that should be standardized?

**After adding a new module:**
- [ ] **architecture.md** — Update module list and navigation structure

**After any tech stack change:**
- [ ] **tech-stack.md** — Update library list, versions, and "what not to use" list

---

## Quarterly (or after major milestones)

- [ ] Review all 9 files for accuracy — do they reflect current codebase?
- [ ] Remove outdated decisions from **key-decisions.md**
- [ ] Verify **data-models.md** matches actual SQLite schema
- [ ] Check **folder-structure.md** against actual file tree

---

## Signs a File Needs Updating

- Claude makes a wrong assumption about file location → update **folder-structure.md**
- Claude uses wrong color or font → update **design-system.md**
- Claude implements tuning logic incorrectly → update **tuning-logic.md**
- Claude builds a DB query in the wrong place → update **coding-conventions.md**
- Claude re-asks a question that was already decided → add to **key-decisions.md**
