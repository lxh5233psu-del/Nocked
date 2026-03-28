import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { AnimatedEntry } from '@/components/ui/AnimatedEntry';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { ScoringFormat, ScoringRound } from '@/types';
import { getFormatConfig } from '@/data/scoring-formats';
import {
  buildTrendPoints,
  computeRollingAvg,
  computeTrendDirection,
  computePerTargetTypeAvgs,
} from '@/logic/performance/trends';
import { buildTargetHeatMap } from '@/logic/performance/heatmap';

const FORMATS: ScoringFormat[] = ['ASA', 'IBO', 'NFAA'];

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function PerformanceScreen() {
  const scoringRounds = useAppStore((s) => s.scoringRounds);
  const courses = useAppStore((s) => s.courses);
  const [selectedFormat, setSelectedFormat] = useState<ScoringFormat>('ASA');

  const completed = useMemo(
    () => scoringRounds.filter((r) => r.completed),
    [scoringRounds]
  );

  const formatRounds = useMemo(
    () => completed.filter((r) => r.format === selectedFormat),
    [completed, selectedFormat]
  );

  const trendPoints = useMemo(() => buildTrendPoints(formatRounds), [formatRounds]);
  const last10 = useMemo(() => trendPoints.slice(-10), [trendPoints]);
  const rollingAvg = useMemo(() => computeRollingAvg(trendPoints), [trendPoints]);
  const trend = useMemo(() => computeTrendDirection(trendPoints), [trendPoints]);

  const formatConfig = getFormatConfig(selectedFormat);
  const maxScore = formatConfig?.maxScorePerTarget ?? 0;

  const personalBest = useMemo(
    () => Math.max(0, ...formatRounds.map((r) => r.totalScore)),
    [formatRounds]
  );

  const heatMapCells = useMemo(
    () => (formatRounds.length >= 3 ? buildTargetHeatMap(formatRounds, maxScore) : []),
    [formatRounds, maxScore]
  );

  // Target type breakdown — only shows when course data is present
  const targetTypeAvgs = useMemo(
    () => computePerTargetTypeAvgs(formatRounds),
    [formatRounds]
  );
  const targetTypeEntries = useMemo(
    () =>
      Array.from(targetTypeAvgs.entries()).sort(
        ([, a], [, b]) => b.avgScore - a.avgScore
      ),
    [targetTypeAvgs]
  );

  // Courses with multiple sessions in this format
  const coursesWithHistory = useMemo(
    () =>
      courses.filter((c) => {
        if (c.format !== selectedFormat) return false;
        return completed.filter((r) => r.courseId === c.id).length >= 2;
      }),
    [courses, completed, selectedFormat]
  );

  const hasData = formatRounds.length > 0;
  const hasTrend = trendPoints.length >= 3;

  // Spark bar chart max value
  const sparkMax = useMemo(
    () => Math.max(1, ...last10.map((p) => p.avgPerTarget)),
    [last10]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Performance</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* Format tabs */}
      <View style={styles.formatTabs}>
        {FORMATS.map((fmt) => (
          <TouchableOpacity
            key={fmt}
            onPress={() => setSelectedFormat(fmt)}
            activeOpacity={0.7}
            style={[styles.formatTab, selectedFormat === fmt && styles.formatTabActive]}
          >
            <Text style={[styles.formatTabText, selectedFormat === fmt && styles.formatTabTextActive]}>
              {fmt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedEntry delay={60}>
          {!hasData && <EmptyForFormat format={selectedFormat} />}

          {hasData && (
            <>
              {/* Summary card */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryLeft}>
                  <Text style={styles.summaryAvg}>{rollingAvg.toFixed(1)}</Text>
                  <Text style={styles.summaryAvgLabel}>5-session avg / target</Text>
                  <View style={styles.summaryMeta}>
                    <Text style={styles.trendBadge}>{trend}</Text>
                    <Text style={styles.summaryMetaText}>
                      {formatRounds.length} round{formatRounds.length !== 1 ? 's' : ''} · PB{' '}
                      {personalBest}
                    </Text>
                  </View>
                </View>
                <TrendingUp size={40} color={Colors.clayMid} strokeWidth={1} />
              </View>

              {/* Sparkline bar chart */}
              {hasTrend && (
                <>
                  <Text style={styles.sectionLabel}>Avg / Target — Last {last10.length} Sessions</Text>
                  <View style={styles.sparkCard}>
                    <View style={styles.sparkBars}>
                      {last10.map((point, i) => {
                        const heightPct = sparkMax > 0 ? point.avgPerTarget / sparkMax : 0;
                        const isLatest = i === last10.length - 1;
                        return (
                          <View key={point.date} style={styles.sparkBarColumn}>
                            <View style={styles.sparkBarTrack}>
                              <View
                                style={[
                                  styles.sparkBarFill,
                                  { height: `${Math.max(4, heightPct * 100)}%` },
                                  isLatest && styles.sparkBarFillLatest,
                                ]}
                              />
                            </View>
                            <Text style={styles.sparkBarLabel}>{formatDate(point.date)}</Text>
                          </View>
                        );
                      })}
                    </View>
                    <View style={styles.sparkYAxis}>
                      <Text style={styles.sparkYLabel}>{sparkMax.toFixed(1)}</Text>
                      <Text style={styles.sparkYLabel}>0</Text>
                    </View>
                  </View>
                </>
              )}

              {/* Per-session list */}
              <Text style={styles.sectionLabel}>Sessions</Text>
              <View style={styles.sessionList}>
                {trendPoints
                  .slice()
                  .reverse()
                  .slice(0, 8)
                  .map((point, i) => {
                    const round = formatRounds.find((r) => r.date === point.date);
                    return (
                      <TouchableOpacity
                        key={`${point.date}-${i}`}
                        onPress={() =>
                          round &&
                          router.push({
                            pathname: '/scoring/round-summary',
                            params: { roundId: round.id },
                          })
                        }
                        activeOpacity={0.7}
                        style={styles.sessionRow}
                      >
                        <View style={styles.sessionRowLeft}>
                          <Text style={styles.sessionDate}>{formatDate(point.date)}</Text>
                          {round?.location && (
                            <Text style={styles.sessionLocation}>{round.location}</Text>
                          )}
                          <Text style={styles.sessionMeta}>
                            {round?.missCount ?? 0}M · {round?.xCount ?? 0}X
                          </Text>
                        </View>
                        <View style={styles.sessionRowRight}>
                          <Text style={styles.sessionTotal}>{point.totalScore}</Text>
                          <Text style={styles.sessionAvg}>{point.avgPerTarget.toFixed(1)}/tgt</Text>
                        </View>
                        <ChevronRight size={14} color={Colors.greyLight} strokeWidth={1.5} />
                      </TouchableOpacity>
                    );
                  })}
              </View>

              {/* Target type breakdown */}
              {targetTypeEntries.length > 0 && (
                <>
                  <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>
                    By Target Type
                  </Text>
                  <View style={styles.targetTypeBlock}>
                    {targetTypeEntries.map(([type, { avgScore, count }]) => {
                      const pct = maxScore > 0 ? avgScore / maxScore : 0;
                      return (
                        <View key={type} style={styles.targetTypeRow}>
                          <Text style={styles.targetTypeLabel}>{type}</Text>
                          <View style={styles.targetTypeBarTrack}>
                            <View
                              style={[
                                styles.targetTypeBarFill,
                                { width: `${Math.round(pct * 100)}%` },
                              ]}
                            />
                          </View>
                          <Text style={styles.targetTypeAvg}>{avgScore.toFixed(1)}</Text>
                          <Text style={styles.targetTypeCount}>({count})</Text>
                        </View>
                      );
                    })}
                  </View>
                </>
              )}

              {/* Target heat map */}
              {heatMapCells.length > 0 && (
                <>
                  <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>
                    Target Heat Map — Avg Score
                  </Text>
                  <Text style={styles.heatMapNote}>
                    Based on {formatRounds.filter((r) => r.completed).length} rounds.{' '}
                    Darker = higher avg.
                  </Text>
                  <HeatMapGrid cells={heatMapCells} />
                </>
              )}

              {/* Course-specific trends */}
              {coursesWithHistory.length > 0 && (
                <>
                  <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>Courses</Text>
                  {coursesWithHistory.map((course) => {
                    const courseRounds = completed
                      .filter((r) => r.courseId === course.id)
                      .sort((a, b) => b.date - a.date);
                    const latest = courseRounds[0];
                    const trend = computeTrendDirection(buildTrendPoints(courseRounds));

                    return (
                      <TouchableOpacity
                        key={course.id}
                        onPress={() =>
                          router.push({
                            pathname: '/scoring/course-detail',
                            params: { courseId: course.id },
                          })
                        }
                        activeOpacity={0.7}
                        style={styles.courseCard}
                      >
                        <View style={styles.courseCardLeft}>
                          <Text style={styles.courseName}>{course.name}</Text>
                          {course.location && (
                            <Text style={styles.courseLocation}>{course.location}</Text>
                          )}
                          <Text style={styles.courseMeta}>
                            {courseRounds.length} rounds · Last {formatDate(latest.date)}
                          </Text>
                        </View>
                        <View style={styles.courseCardRight}>
                          <Text style={styles.courseTrend}>{trend}</Text>
                          <Text style={styles.courseAvg}>
                            {latest.avgPerTarget.toFixed(1)}
                          </Text>
                          <Text style={styles.courseAvgLabel}>avg/tgt</Text>
                        </View>
                        <ChevronRight size={14} color={Colors.greyLight} strokeWidth={1.5} />
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </>
          )}
        </AnimatedEntry>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Heat Map Grid ─────────────────────────────────────────────────────────────

interface HeatMapGridProps {
  cells: ReturnType<typeof buildTargetHeatMap>;
}

function HeatMapGrid({ cells }: HeatMapGridProps) {
  return (
    <View style={styles.heatMapGrid}>
      {cells.map((cell) => (
        <View key={cell.targetNumber} style={[styles.heatMapCell, { backgroundColor: cell.color }]}>
          <Text style={[styles.heatMapCellNumber, { color: cell.textColor }]}>
            {cell.targetNumber}
          </Text>
          <Text style={[styles.heatMapCellScore, { color: cell.textColor }]}>
            {cell.avgScore.toFixed(1)}
          </Text>
          {cell.targetType && (
            <Text style={[styles.heatMapCellType, { color: cell.textColor }]} numberOfLines={1}>
              {cell.targetType}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

// ─── Empty State ───────────────────────────────────────────────────────────────

function EmptyForFormat({ format }: { format: ScoringFormat }) {
  return (
    <View style={styles.emptyState}>
      <TrendingUp size={32} color={Colors.greyLight} strokeWidth={1} />
      <Text style={styles.emptyTitle}>No {format} data yet</Text>
      <Text style={styles.emptyText}>
        Complete {format} rounds to track your performance over time.
      </Text>
      <TouchableOpacity
        onPress={() => router.push('/scoring/new-round')}
        activeOpacity={0.7}
        style={styles.emptyButton}
      >
        <Text style={styles.emptyButtonText}>Start a Round</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: { padding: Spacing.xs },
  headerTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },

  formatTabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  formatTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.bgPrimary,
  },
  formatTabActive: {
    backgroundColor: Colors.clayDark,
    borderColor: Colors.clayDark,
  },
  formatTabText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
  formatTabTextActive: {
    color: Colors.bgPrimary,
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },

  // Summary card
  summaryCard: {
    backgroundColor: Colors.clayDarkest,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  summaryLeft: { gap: Spacing.xs },
  summaryAvg: {
    ...Typography.displayBold,
    fontSize: 48,
    color: Colors.bgPrimary,
    lineHeight: 52,
  },
  summaryAvgLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayLight,
    letterSpacing: 1,
  },
  summaryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  trendBadge: {
    ...Typography.displayBold,
    fontSize: FontSizes.lg,
    color: Colors.bgPrimary,
  },
  summaryMetaText: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.clayLight,
  },

  // Sparkline
  sparkCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.sm,
  },
  sparkBars: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 80,
  },
  sparkBarColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    height: '100%',
    justifyContent: 'flex-end',
  },
  sparkBarTrack: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  sparkBarFill: {
    width: '100%',
    backgroundColor: Colors.clayMid,
    borderRadius: 2,
    minHeight: 4,
  },
  sparkBarFillLatest: {
    backgroundColor: Colors.clayDarkest,
  },
  sparkBarLabel: {
    ...Typography.label,
    fontSize: 6,
    color: Colors.greyLight,
    textAlign: 'center',
  },
  sparkYAxis: {
    width: 28,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 16, // accounts for label row under bars
  },
  sparkYLabel: {
    ...Typography.label,
    fontSize: 7,
    color: Colors.greyLight,
  },

  // Session list
  sessionList: {
    marginBottom: Spacing.xs,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  sessionRowLeft: { flex: 1, gap: 2 },
  sessionDate: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  sessionLocation: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  sessionMeta: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  sessionRowRight: { alignItems: 'flex-end', gap: 1 },
  sessionTotal: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  sessionAvg: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },

  // Target type breakdown
  targetTypeBlock: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  targetTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  targetTypeLabel: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
    width: 80,
  },
  targetTypeBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  targetTypeBarFill: {
    height: '100%',
    backgroundColor: Colors.clayMid,
    borderRadius: Radius.full,
  },
  targetTypeAvg: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
    width: 32,
    textAlign: 'right',
  },
  targetTypeCount: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    width: 28,
  },

  // Heat map
  heatMapNote: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
    marginTop: -Spacing.xs,
  },
  heatMapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: Spacing.xl,
  },
  heatMapCell: {
    width: '18%',
    aspectRatio: 0.9,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 1,
  },
  heatMapCellNumber: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    lineHeight: 14,
  },
  heatMapCellScore: {
    ...Typography.displayBold,
    fontSize: FontSizes.sm,
    lineHeight: 16,
  },
  heatMapCellType: {
    ...Typography.label,
    fontSize: 6,
    lineHeight: 8,
    textAlign: 'center',
  },

  // Course cards
  courseCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  courseCardLeft: { flex: 1, gap: 2 },
  courseName: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  courseLocation: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  courseMeta: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  courseCardRight: { alignItems: 'center', gap: 1 },
  courseTrend: {
    ...Typography.displayBold,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  courseAvg: {
    ...Typography.displayBold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  courseAvgLabel: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyLight,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
  },
  emptyTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
  emptyText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  emptyButtonText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.clayDark,
  },
});
