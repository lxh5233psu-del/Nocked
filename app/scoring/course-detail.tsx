import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { AnimatedEntry } from '@/components/ui/AnimatedEntry';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { getFormatConfig } from '@/data/scoring-formats';
import {
  buildTrendPoints,
  computeRollingAvg,
  computeTrendDirection,
  computePerTargetTypeAvgs,
} from '@/logic/performance/trends';
import { buildTargetHeatMap } from '@/logic/performance/heatmap';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateShort(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export default function CourseDetailScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const courses = useAppStore((s) => s.courses);
  const scoringRounds = useAppStore((s) => s.scoringRounds);

  const course = courses.find((c) => c.id === courseId);

  const courseRounds = useMemo(
    () =>
      scoringRounds
        .filter((r) => r.completed && r.courseId === courseId)
        .sort((a, b) => a.date - b.date),
    [scoringRounds, courseId]
  );

  const trendPoints = useMemo(() => buildTrendPoints(courseRounds), [courseRounds]);
  const rollingAvg = useMemo(() => computeRollingAvg(trendPoints), [trendPoints]);
  const trend = useMemo(() => computeTrendDirection(trendPoints), [trendPoints]);

  const formatConfig = course ? getFormatConfig(course.format) : undefined;
  const maxScore = formatConfig?.maxScorePerTarget ?? 0;

  const personalBest = useMemo(
    () => Math.max(0, ...courseRounds.map((r) => r.totalScore)),
    [courseRounds]
  );

  const heatMapCells = useMemo(
    () => (courseRounds.length >= 2 ? buildTargetHeatMap(courseRounds, maxScore) : []),
    [courseRounds, maxScore]
  );

  // Per-target-type breakdown
  const targetTypeAvgs = useMemo(
    () => computePerTargetTypeAvgs(courseRounds),
    [courseRounds]
  );
  const targetTypeEntries = useMemo(
    () =>
      Array.from(targetTypeAvgs.entries()).sort(
        ([, a], [, b]) => b.avgScore - a.avgScore
      ),
    [targetTypeAvgs]
  );

  // Score over time — sparkline
  const sparkMax = useMemo(
    () => Math.max(1, ...trendPoints.map((p) => p.avgPerTarget)),
    [trendPoints]
  );

  if (!course) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.errorText}>Course not found.</Text>
      </SafeAreaView>
    );
  }

  const hasData = courseRounds.length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{course.name}</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedEntry delay={60}>
          {/* Course meta */}
          <View style={styles.courseMeta}>
            <Text style={styles.courseTitle}>{course.name}</Text>
            {course.location && (
              <Text style={styles.courseLocation}>{course.location}</Text>
            )}
            <Text style={styles.courseSubMeta}>
              {course.format} · {course.targets.length} targets
            </Text>
          </View>

          {!hasData && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No completed rounds yet</Text>
              <Text style={styles.emptyText}>
                Score this course to start tracking your progress.
              </Text>
            </View>
          )}

          {hasData && (
            <>
              {/* Summary stats */}
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{courseRounds.length}</Text>
                  <Text style={styles.statLabel}>Rounds</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{rollingAvg.toFixed(1)}</Text>
                  <Text style={styles.statLabel}>5-Sess Avg</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{personalBest}</Text>
                  <Text style={styles.statLabel}>Best Score</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{trend}</Text>
                  <Text style={styles.statLabel}>Trend</Text>
                </View>
              </View>

              {/* Score history sparkline */}
              {trendPoints.length >= 2 && (
                <>
                  <Text style={styles.sectionLabel}>Avg / Target Over Time</Text>
                  <View style={styles.sparkCard}>
                    <View style={styles.sparkBars}>
                      {trendPoints.map((point, i) => {
                        const heightPct = sparkMax > 0 ? point.avgPerTarget / sparkMax : 0;
                        const isLatest = i === trendPoints.length - 1;
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
                            <Text style={styles.sparkBarLabel}>
                              {formatDateShort(point.date)}
                            </Text>
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

              {/* Round list */}
              <Text style={styles.sectionLabel}>All Rounds</Text>
              <View style={styles.roundList}>
                {courseRounds
                  .slice()
                  .reverse()
                  .map((round) => {
                    const maxPossible = formatConfig
                      ? formatConfig.maxScorePerTarget * round.totalTargets
                      : 0;
                    const pct =
                      maxPossible > 0
                        ? Math.round((round.totalScore / maxPossible) * 100)
                        : 0;
                    return (
                      <TouchableOpacity
                        key={round.id}
                        onPress={() =>
                          router.push({
                            pathname: '/scoring/round-summary',
                            params: { roundId: round.id },
                          })
                        }
                        activeOpacity={0.7}
                        style={styles.roundRow}
                      >
                        <View style={styles.roundRowLeft}>
                          <Text style={styles.roundDate}>{formatDate(round.date)}</Text>
                          <Text style={styles.roundMeta}>
                            {round.missCount}M · {round.xCount}X · {pct}%
                          </Text>
                        </View>
                        <View style={styles.roundRowRight}>
                          <Text style={styles.roundTotal}>{round.totalScore}</Text>
                          <Text style={styles.roundAvg}>
                            {round.avgPerTarget.toFixed(1)}/tgt
                          </Text>
                        </View>
                        <ChevronRight size={14} color={Colors.greyLight} strokeWidth={1.5} />
                      </TouchableOpacity>
                    );
                  })}
              </View>

              {/* Per-target-type breakdown */}
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
                    Darker = higher avg score across {courseRounds.length} rounds.
                  </Text>
                  <View style={styles.heatMapGrid}>
                    {heatMapCells.map((cell) => (
                      <View
                        key={cell.targetNumber}
                        style={[styles.heatMapCell, { backgroundColor: cell.color }]}
                      >
                        <Text style={[styles.heatMapCellNumber, { color: cell.textColor }]}>
                          {cell.targetNumber}
                        </Text>
                        <Text style={[styles.heatMapCellScore, { color: cell.textColor }]}>
                          {cell.avgScore.toFixed(1)}
                        </Text>
                        {cell.targetType && (
                          <Text
                            style={[styles.heatMapCellType, { color: cell.textColor }]}
                            numberOfLines={1}
                          >
                            {cell.targetType}
                          </Text>
                        )}
                      </View>
                    ))}
                  </View>
                </>
              )}

              {/* Course target roster */}
              {course.targets.length > 0 && (
                <>
                  <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>
                    Course Layout
                  </Text>
                  <View style={styles.targetRoster}>
                    {course.targets.map((t) => {
                      const cellData = heatMapCells.find(
                        (c) => c.targetNumber === t.targetNumber
                      );
                      return (
                        <View key={t.targetNumber} style={styles.targetRosterRow}>
                          <View style={styles.targetRosterNum}>
                            <Text style={styles.targetRosterNumText}>{t.targetNumber}</Text>
                          </View>
                          <View style={styles.targetRosterInfo}>
                            <Text style={styles.targetRosterType}>{t.targetType}</Text>
                            {t.yardage && (
                              <Text style={styles.targetRosterYardage}>{t.yardage} yds</Text>
                            )}
                          </View>
                          {cellData && (
                            <Text style={styles.targetRosterAvg}>
                              {cellData.avgScore.toFixed(1)} avg
                            </Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </>
              )}
            </>
          )}
        </AnimatedEntry>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  errorText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    textAlign: 'center',
    marginTop: Spacing.xxxl,
  },

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
    flex: 1,
    textAlign: 'center',
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },

  courseMeta: { marginBottom: Spacing.xl, gap: 3 },
  courseTitle: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxl,
    color: Colors.textPrimary,
  },
  courseLocation: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
  courseSubMeta: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },

  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  statLabel: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyLight,
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
    paddingBottom: 16,
  },
  sparkYLabel: {
    ...Typography.label,
    fontSize: 7,
    color: Colors.greyLight,
  },

  // Round list
  roundList: { marginBottom: Spacing.xs },
  roundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  roundRowLeft: { flex: 1, gap: 2 },
  roundDate: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  roundMeta: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  roundRowRight: { alignItems: 'flex-end', gap: 1 },
  roundTotal: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  roundAvg: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },

  // Target type
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

  // Target roster
  targetRoster: {
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  targetRosterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  targetRosterNum: {
    width: 28,
    height: 28,
    borderRadius: Radius.sm,
    backgroundColor: Colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetRosterNumText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
  },
  targetRosterInfo: { flex: 1, gap: 1 },
  targetRosterType: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  targetRosterYardage: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  targetRosterAvg: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayMid,
  },

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
});
