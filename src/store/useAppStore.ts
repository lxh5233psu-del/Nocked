import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ArcherProfile,
  Discipline,
  Tool,
  BowProfile,
  BowSetupData,
  ArrowProfile,
  ReleaseProfile,
  SessionSummary,
  ModuleType,
  ScoringRound,
  ShotSession,
} from '@/types';

// ─── State Shape ──────────────────────────────────────────────────────────────

interface AppState {
  // Onboarding
  isOnboarded: boolean;

  // Archer
  archerProfile: ArcherProfile | null;
  discipline: Discipline | null;
  toolInventory: Tool[];

  // Bows (supports multiple)
  bowProfiles: BowProfile[];
  activeBowId: string | null;

  // Arrows
  arrowProfiles: ArrowProfile[];
  activeArrowId: string | null;

  // Release
  releaseProfile: ReleaseProfile | null;

  // Scoring
  scoringRounds: ScoringRound[];
  activeScoringRoundId: string | null;

  // Shot Analyzer
  shotSessions: ShotSession[];
  activeSessionId: string | null;

  // Session tracking
  lastSession: SessionSummary | null;

  // Settings
  formRemindersEnabled: boolean;
  formReminderFrequency: 'every session' | 'daily' | 'weekly' | 'never';
  units: 'Imperial' | 'Metric';
}

// ─── Actions ─────────────────────────────────────────────────────────────────

interface AppActions {
  // Onboarding
  completeOnboarding: () => void;
  resetOnboarding: () => void;

  // Archer profile
  setArcherProfile: (profile: ArcherProfile) => void;
  setDiscipline: (discipline: Discipline) => void;
  setToolInventory: (tools: Tool[]) => void;

  // Bow profiles
  addBowProfile: (bow: BowProfile) => void;
  updateBowProfile: (id: string, updates: Partial<BowProfile>) => void;
  deleteBowProfile: (id: string) => void;
  setActiveBow: (id: string) => void;
  getActiveBow: () => BowProfile | null;
  markBowSetupComplete: (id: string) => void;
  markSetupStepComplete: (bowId: string, step: number) => void;
  updateSetupData: (bowId: string, data: Partial<BowSetupData>) => void;
  markTuningModuleComplete: (bowId: string, module: string) => void;

  // Arrow profiles
  addArrowProfile: (arrow: ArrowProfile) => void;
  updateArrowProfile: (id: string, updates: Partial<ArrowProfile>) => void;
  deleteArrowProfile: (id: string) => void;
  setActiveArrow: (id: string) => void;

  // Release
  setReleaseProfile: (release: ReleaseProfile) => void;

  // Scoring
  addScoringRound: (round: ScoringRound) => void;
  updateScoringRound: (id: string, updates: Partial<ScoringRound>) => void;
  deleteScoringRound: (id: string) => void;
  setActiveScoringRound: (id: string | null) => void;

  // Shot Analyzer
  addShotSession: (session: ShotSession) => void;
  updateShotSession: (id: string, updates: Partial<ShotSession>) => void;
  deleteShotSession: (id: string) => void;
  setActiveSession: (id: string | null) => void;

  // Session
  setLastSession: (session: SessionSummary) => void;

  // Settings
  setFormRemindersEnabled: (enabled: boolean) => void;
  setFormReminderFrequency: (freq: AppState['formReminderFrequency']) => void;
  setUnits: (units: AppState['units']) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

const initialState: AppState = {
  isOnboarded: false,
  archerProfile: null,
  discipline: null,
  toolInventory: [],
  bowProfiles: [],
  activeBowId: null,
  arrowProfiles: [],
  activeArrowId: null,
  releaseProfile: null,
  scoringRounds: [],
  activeScoringRoundId: null,
  shotSessions: [],
  activeSessionId: null,
  lastSession: null,
  formRemindersEnabled: true,
  formReminderFrequency: 'every session',
  units: 'Imperial',
};

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ── Onboarding ──────────────────────────────────────────────────────────
      completeOnboarding: () => set({ isOnboarded: true }),
      resetOnboarding: () => set({ ...initialState }),

      // ── Archer profile ──────────────────────────────────────────────────────
      setArcherProfile: (profile) => set({ archerProfile: profile }),
      setDiscipline: (discipline) => set({ discipline }),
      setToolInventory: (tools) => set({ toolInventory: tools }),

      // ── Bow profiles ────────────────────────────────────────────────────────
      addBowProfile: (bow) =>
        set((state) => ({
          bowProfiles: [...state.bowProfiles, bow],
          activeBowId: state.activeBowId ?? bow.id,
        })),

      updateBowProfile: (id, updates) =>
        set((state) => ({
          bowProfiles: state.bowProfiles.map((b) =>
            b.id === id ? { ...b, ...updates } : b
          ),
        })),

      deleteBowProfile: (id) =>
        set((state) => {
          const remaining = state.bowProfiles.filter((b) => b.id !== id);
          return {
            bowProfiles: remaining,
            activeBowId:
              state.activeBowId === id
                ? (remaining[0]?.id ?? null)
                : state.activeBowId,
          };
        }),

      setActiveBow: (id) => set({ activeBowId: id }),

      getActiveBow: () => {
        const { bowProfiles, activeBowId } = get();
        return bowProfiles.find((b) => b.id === activeBowId) ?? null;
      },

      markBowSetupComplete: (id) =>
        set((state) => ({
          bowProfiles: state.bowProfiles.map((b) =>
            b.id === id ? { ...b, setupComplete: true } : b
          ),
        })),

      markSetupStepComplete: (bowId, step) =>
        set((state) => ({
          bowProfiles: state.bowProfiles.map((b) =>
            b.id === bowId && !b.setupStepsComplete.includes(step)
              ? { ...b, setupStepsComplete: [...b.setupStepsComplete, step] }
              : b
          ),
        })),

      updateSetupData: (bowId, data) =>
        set((state) => ({
          bowProfiles: state.bowProfiles.map((b) =>
            b.id === bowId
              ? { ...b, setupData: { ...b.setupData, ...data } }
              : b
          ),
        })),

      markTuningModuleComplete: (bowId, module) =>
        set((state) => ({
          bowProfiles: state.bowProfiles.map((b) =>
            b.id === bowId && !b.tuningModulesComplete.includes(module)
              ? { ...b, tuningModulesComplete: [...b.tuningModulesComplete, module] }
              : b
          ),
        })),

      // ── Arrow profiles ──────────────────────────────────────────────────────
      addArrowProfile: (arrow) =>
        set((state) => ({
          arrowProfiles: [...state.arrowProfiles, arrow],
          activeArrowId: state.activeArrowId ?? arrow.id,
        })),

      updateArrowProfile: (id, updates) =>
        set((state) => ({
          arrowProfiles: state.arrowProfiles.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      deleteArrowProfile: (id) =>
        set((state) => {
          const remaining = state.arrowProfiles.filter((a) => a.id !== id);
          return {
            arrowProfiles: remaining,
            activeArrowId:
              state.activeArrowId === id
                ? (remaining[0]?.id ?? null)
                : state.activeArrowId,
          };
        }),

      setActiveArrow: (id) => set({ activeArrowId: id }),

      // ── Release ─────────────────────────────────────────────────────────────
      setReleaseProfile: (release) => set({ releaseProfile: release }),

      // ── Scoring ────────────────────────────────────────────────────────────
      addScoringRound: (round) =>
        set((state) => ({
          scoringRounds: [round, ...state.scoringRounds],
          activeScoringRoundId: round.id,
        })),

      updateScoringRound: (id, updates) =>
        set((state) => ({
          scoringRounds: state.scoringRounds.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      deleteScoringRound: (id) =>
        set((state) => ({
          scoringRounds: state.scoringRounds.filter((r) => r.id !== id),
          activeScoringRoundId:
            state.activeScoringRoundId === id ? null : state.activeScoringRoundId,
        })),

      setActiveScoringRound: (id) => set({ activeScoringRoundId: id }),

      // ── Shot Analyzer ────────────────────────────────────────────────────────
      addShotSession: (session) =>
        set((state) => ({
          shotSessions: [session, ...state.shotSessions],
          activeSessionId: session.id,
        })),

      updateShotSession: (id, updates) =>
        set((state) => ({
          shotSessions: state.shotSessions.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteShotSession: (id) =>
        set((state) => ({
          shotSessions: state.shotSessions.filter((s) => s.id !== id),
          activeSessionId:
            state.activeSessionId === id ? null : state.activeSessionId,
        })),

      setActiveSession: (id) => set({ activeSessionId: id }),

      // ── Session ─────────────────────────────────────────────────────────────
      setLastSession: (session) => set({ lastSession: session }),

      // ── Settings ────────────────────────────────────────────────────────────
      setFormRemindersEnabled: (enabled) => set({ formRemindersEnabled: enabled }),
      setFormReminderFrequency: (freq) => set({ formReminderFrequency: freq }),
      setUnits: (units) => set({ units }),
    }),
    {
      name: 'nocked-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
