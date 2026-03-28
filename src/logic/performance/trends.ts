import { ScoringRound, ScoringFormat } from '@/types';

export interface SessionTrendPoint {
  avgPerTarget: number;
  totalScore: number;
  date: number;
  format: ScoringFormat;
}

export type TrendDirection = '↑' | '↓' | '→';

/** Rolling N-session average of avg-per-target. */
export function computeRollingAvg(sessions: SessionTrendPoint[], window = 5): number {
  const slice = sessions.slice(-window);
  if (slice.length === 0) return 0;
  return slice.reduce((sum, s) => sum + s.avgPerTarget, 0) / slice.length;
}

/**
 * Compare last 5 sessions vs previous 5 to determine improvement direction.
 * Returns '→' if fewer than 2 sessions are available for comparison.
 */
export function computeTrendDirection(sessions: SessionTrendPoint[]): TrendDirection {
  const recent = sessions.slice(-5);
  const older = sessions.slice(-10, -5);

  if (recent.length < 2) return '→';

  const recentAvg = recent.reduce((s, r) => s + r.avgPerTarget, 0) / recent.length;

  if (older.length === 0) return '→';

  const olderAvg = older.reduce((s, r) => s + r.avgPerTarget, 0) / older.length;
  const diff = recentAvg - olderAvg;

  if (diff > 0.5) return '↑';
  if (diff < -0.5) return '↓';
  return '→';
}

/** Build trend points from completed scoring rounds, sorted oldest → newest. */
export function buildTrendPoints(rounds: ScoringRound[]): SessionTrendPoint[] {
  return rounds
    .filter((r) => r.completed)
    .sort((a, b) => a.date - b.date)
    .map((r) => ({
      avgPerTarget: r.avgPerTarget,
      totalScore: r.totalScore,
      date: r.date,
      format: r.format,
    }));
}

/**
 * Average score per target number across all provided rounds.
 * Returns a map from targetNumber → { avgScore, count }.
 */
export function computePerTargetAvgs(
  rounds: ScoringRound[]
): Map<number, { avgScore: number; count: number }> {
  const accumulator = new Map<number, { sum: number; count: number }>();

  rounds.forEach((r) => {
    r.shots.forEach((shot) => {
      const existing = accumulator.get(shot.targetNumber) ?? { sum: 0, count: 0 };
      accumulator.set(shot.targetNumber, {
        sum: existing.sum + shot.score,
        count: existing.count + 1,
      });
    });
  });

  const result = new Map<number, { avgScore: number; count: number }>();
  accumulator.forEach((value, targetNum) => {
    result.set(targetNum, {
      avgScore: value.sum / value.count,
      count: value.count,
    });
  });

  return result;
}

/**
 * Per-target-type breakdown: average score for each unique targetType.
 * Returns a map from targetType → { avgScore, count }.
 */
export function computePerTargetTypeAvgs(
  rounds: ScoringRound[]
): Map<string, { avgScore: number; count: number }> {
  const accumulator = new Map<string, { sum: number; count: number }>();

  rounds.forEach((r) => {
    r.shots.forEach((shot) => {
      if (!shot.targetType) return;
      const existing = accumulator.get(shot.targetType) ?? { sum: 0, count: 0 };
      accumulator.set(shot.targetType, {
        sum: existing.sum + shot.score,
        count: existing.count + 1,
      });
    });
  });

  const result = new Map<string, { avgScore: number; count: number }>();
  accumulator.forEach((value, targetType) => {
    result.set(targetType, {
      avgScore: value.sum / value.count,
      count: value.count,
    });
  });

  return result;
}
