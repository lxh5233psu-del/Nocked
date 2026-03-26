import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { getFormatConfig } from '@/data/scoring-formats';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { ScoringFormat, ScoringRound } from '@/types';

const FORMATS: (ScoringFormat | 'All')[] = ['All', 'ASA', 'IBO', 'NFAA'];

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ScoringHistoryScreen() {
  const scoringRounds = useAppStore((s) => s.scoringRounds);
  const [filter, setFilter] = useState<ScoringFormat | 'All'>('All');

  const filtered = scoringRounds.filter((r) => {
    if (filter === 'All') return r.completed;
    return r.completed && r.format === filter;
  });

  // Per-format bests
  const bestByFormat: Partial<Record<ScoringFormat, number>> = {};
  scoringRounds.filter((r) => r.completed).forEach((r) => {
    const prev = bestByFormat[r.format] ?? 0;
    if (r.totalScore > prev) bestByFormat[r.format] = r.totalScore;
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Round History</Text>
        <View style={{ width: 34 }} />
      </View>

      {/* Personal bests */}
      {Object.keys(bestByFormat).length > 0 && (
        <View style={styles.pbRow}>
          {(Object.entries(bestByFormat) as [ScoringFormat, number][]).map(([fmt, score]) => (
            <View key={fmt} style={styles.pbCard}>
              <Text style={styles.pbFormat}>{fmt}</Text>
              <Text style={styles.pbScore}>{score}</Text>
              <Text style={styles.pbLabel}>Personal Best</Text>
            </View>
          ))}
        </View>
      )}

      {/* Format filter */}
      <View style={styles.filterRow}>
        {FORMATS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            activeOpacity={0.7}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {filter === 'All'
                ? 'No completed rounds yet.'
                : `No completed ${filter} rounds yet.`}
            </Text>
          </View>
        )}

        {filtered.map((round) => (
          <HistoryRoundRow key={round.id} round={round} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function HistoryRoundRow({ round }: { round: ScoringRound }) {
  const formatConfig = getFormatConfig(round.format);
  const maxPossible = formatConfig
    ? formatConfig.maxScorePerTarget * round.totalTargets
    : 0;
  const pct = maxPossible > 0 ? Math.round((round.totalScore / maxPossible) * 100) : 0;

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: '/scoring/round-summary', params: { roundId: round.id } })
      }
      activeOpacity={0.7}
      style={styles.historyRow}
    >
      <View style={styles.historyLeft}>
        <View style={styles.historyFormatBadge}>
          <Text style={styles.historyFormatText}>{round.format}</Text>
        </View>
        <View>
          <Text style={styles.historyDate}>{formatDate(round.date)}</Text>
          {round.location && (
            <Text style={styles.historyLocation}>{round.location}</Text>
          )}
          <Text style={styles.historyTargets}>{round.shots.length} targets · {pct}%</Text>
        </View>
      </View>
      <View style={styles.historyRight}>
        <Text style={styles.historyScore}>{round.totalScore}</Text>
        <ChevronRight size={14} color={Colors.greyLight} strokeWidth={1.5} />
      </View>
    </TouchableOpacity>
  );
}

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

  pbRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  pbCard: {
    flex: 1,
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  pbFormat: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  pbScore: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  pbLabel: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyLight,
  },

  filterRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  filterChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.bgPrimary,
  },
  filterChipActive: {
    backgroundColor: Colors.clayDark,
    borderColor: Colors.clayDark,
  },
  filterChipText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  filterChipTextActive: {
    color: Colors.bgPrimary,
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  empty: {
    paddingVertical: Spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyLight,
  },

  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.md,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  historyFormatBadge: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.bgSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyFormatText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.clayDark,
  },
  historyDate: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  historyLocation: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginTop: 1,
  },
  historyTargets: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginTop: 1,
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  historyScore: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
});
