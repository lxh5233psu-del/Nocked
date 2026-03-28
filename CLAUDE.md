# Nocked — Claude Code Project Guide

## What this project is
Nocked is a compound archery tuning, coaching, and scoring app. Built with Expo (React Native) + TypeScript. iOS primary, MVP is local SQLite only — no backend.

## Before writing any code, always read:
- project-knowledge/pk_coding-conventions.md
- project-knowledge/pk_folder-structure.md
- project-knowledge/pk_design-system.md
- project-knowledge/pk_key-decisions.md
- project-knowledge/pk_data-models.md
- Any feature-specific PK file listed in the feature kickoff prompt

## Non-negotiables
- No `any` types — TypeScript strict mode
- No UI libraries — custom design system only
- No SQL inline in components or stores — all queries in src/db/queries/
- No business logic in components — all logic in src/logic/
- Never hardcode left/right — always use src/utils/handedness.ts
- Never use green, red, blue, yellow, or purple in the UI
- Never push directly to main — always work in a feature branch
- avg_per_target MUST be stored at session save time, never computed on read
- Arrow plot NEVER calculates or overrides the entered score

## Branch naming convention
sprint-[number]-[short-description]
Example: sprint-10-scoring-active-session

## After every sprint, remind the user to:
1. Review the PR before merging
2. Update any project-knowledge files that changed
3. Run the maintenance checklist (pk_maintenance-checklist.md)
