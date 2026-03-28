import { Colors } from '@/constants/theme';
import { ScoringRound } from '@/types';
import { computePerTargetAvgs } from './trends';

export interface HeatMapCell {
  targetNumber: number;
  targetType: string | undefined;
  avgScore: number;
  sessionCount: number;
  color: string;
  /** Hex color for the score number text — light on dark cells, dark on light cells. */
  textColor: string;
}

/**
 * Returns a heat map background color based on score as a percentage of max.
 * Uses clay tones per the design system — never green/red.
 */
export function heatMapColor(score: number, maxScore: number): string {
  if (maxScore === 0 || score === 0) return Colors.bgPrimary;
  const pct = score / maxScore;
  if (pct >= 0.9) return Colors.clayDarkest;
  if (pct >= 0.75) return Colors.clayDark;
  if (pct >= 0.6) return Colors.clayMid;
  if (pct > 0) return Colors.greyLight;
  return Colors.bgPrimary;
}

/** Returns appropriate text color for a given heat map cell background. */
function heatMapTextColor(bgColor: string): string {
  // Dark backgrounds need light text
  if (bgColor === Colors.clayDarkest || bgColor === Colors.clayDark) {
    return Colors.bgPrimary;
  }
  return Colors.textPrimary;
}

/**
 * Build heat map cells from completed rounds.
 * Each cell represents one target position, colored by average score.
 * Only includes target positions that appear in at least one round.
 */
export function buildTargetHeatMap(
  rounds: ScoringRound[],
  maxScorePerTarget: number
): HeatMapCell[] {
  const completed = rounds.filter((r) => r.completed);
  if (completed.length === 0) return [];

  const perTargetAvgs = computePerTargetAvgs(completed);

  return Array.from(perTargetAvgs.entries())
    .sort(([a], [b]) => a - b)
    .map(([targetNumber, { avgScore, count }]) => {
      // Look up the target type from the most recent round that has it
      const targetType = completed
        .slice()
        .reverse()
        .flatMap((r) => r.shots)
        .find((s) => s.targetNumber === targetNumber && s.targetType)?.targetType;

      const color = heatMapColor(avgScore, maxScorePerTarget);

      return {
        targetNumber,
        targetType,
        avgScore,
        sessionCount: count,
        color,
        textColor: heatMapTextColor(color),
      };
    });
}
