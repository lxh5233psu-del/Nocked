import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { getFormatConfig } from '@/data/scoring-formats';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function RoundSummaryScreen() {
  const { roundId } = useLocalSearchParams<{ roundId: string }>();
  const scoringRounds = useAppStore((s) => s.scoringRounds);
  const deleteScoringRound = useAppStore((s) => s.deleteScoringRound);
  const bowProfiles = useAppStore((s) => s.bowProfiles);

  const round = scoringRounds.find((r) => r.id === roundId);
  const formatConfig = round ? getFormatConfig(round.format) : undefined;
  const bow = round?.bowId ? bowProfiles.find((b) => b.id === round.bowId) : undefined;

  const stats = useMemo(() => {
    if (!round || !formatConfig) return null;
    const scores = round.shots.map((s) => s.score);
    const misses = scores.filter((s) => s === 0).length;
    const hits = scores.filter((s) => s > 0).length;
    const topZone = formatConfig.maxScorePerTarget;
    const topHits = scores.filter((s) => s === topZone).length;
    const avg = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const maxPossible = topZone * round.totalTargets;
    const pct = maxPossible > 0 ? Math.round((round.totalScore / maxPossible) * 100) : 0;

    return { misses, hits, topHits, avg, maxPossible, pct, topZone };
  }, [round, formatConfig]);

  if (!round || !formatConfig || !stats) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.errorText}>Round not found.</Text>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Round',
      'This round will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteScoringRound(round.id);
            router.replace('/scoring');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.replace('/scoring')}
          style={styles.doneButton}
          hitSlop={12}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Round Summary</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton} hitSlop={12}>
          <Trash2 size={18} color={Colors.statusError} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero score */}
        <View style={styles.heroCard}>
          <Text style={styles.heroFormat}>{round.format}</Text>
          <Text style={styles.heroScore}>{round.totalScore}</Text>
          <Text style={styles.heroMax}>out of {stats.maxPossible}</Text>
          <View style={styles.heroPctRow}>
            <View style={styles.heroPctBar}>
              <View style={[styles.heroPctFill, { width: `${stats.pct}%` }]} />
            </View>
            <Text style={styles.heroPct}>{stats.pct}%</Text>
          </View>
        </View>

        {/* Metadata */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>{formatDate(round.date)}</Text>
          </View>
          {round.location && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Location</Text>
              <Text style={styles.metaValue}>{round.location}</Text>
            </View>
          )}
          {bow && (
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Bow</Text>
              <Text style={styles.metaValue}>{bow.nickname}</Text>
            </View>
          )}
        </View>

        {/* Stat cards */}
        <View style={styles.statGrid}>
          <StatCard label="Targets" value={`${round.shots.length}`} sub={`of ${round.totalTargets}`} />
          <StatCard label="Average" value={stats.avg.toFixed(1)} sub="per target" />
          <StatCard label={`${stats.topZone}-ring`} value={`${stats.topHits}`} sub="hits" />
          <StatCard label="Misses" value={`${stats.misses}`} sub={`${stats.hits} hits`} />
        </View>

        {/* Per-target scorecard */}
        <Text style={styles.sectionLabel}>Scorecard</Text>
        <View style={styles.scorecardTable}>
          <View style={styles.scorecardHeader}>
            <Text style={[styles.scorecardCell, styles.scorecardCellTarget]}>T</Text>
            <Text style={[styles.scorecardCell, styles.scorecardCellZone]}>Zone</Text>
            <Text style={[styles.scorecardCell, styles.scorecardCellScore]}>Pts</Text>
            <Text style={[styles.scorecardCell, styles.scorecardCellRunning]}>Total</Text>
          </View>
          {round.shots.map((shot, i) => {
            const running = round.shots
              .slice(0, i + 1)
              .reduce((sum, s) => sum + s.score, 0);
            return (
              <View
                key={shot.targetNumber}
                style={[styles.scorecardRow, i % 2 === 1 && styles.scorecardRowAlt]}
              >
                <Text style={[styles.scorecardCell, styles.scorecardCellTarget]}>
                  {shot.targetNumber}
                </Text>
                <Text style={[styles.scorecardCell, styles.scorecardCellZone]}>
                  {shot.zoneName}
                </Text>
                <Text
                  style={[
                    styles.scorecardCell,
                    styles.scorecardCellScore,
                    shot.score === 0 && styles.scorecardMiss,
                    shot.score === formatConfig.maxScorePerTarget && styles.scorecardTop,
                  ]}
                >
                  {shot.score === 0 ? 'M' : shot.score}
                </Text>
                <Text style={[styles.scorecardCell, styles.scorecardCellRunning]}>
                  {running}
                </Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/scoring/new-round')}
          activeOpacity={0.7}
          style={styles.newRoundButton}
        >
          <Text style={styles.newRoundText}>Start Another Round</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
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
  doneButton: { padding: Spacing.xs },
  doneText: {
    ...Typography.label,
    fontSize: FontSizes.sm,
    color: Colors.clayMid,
  },
  headerTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  deleteButton: { padding: Spacing.xs },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  heroCard: {
    backgroundColor: Colors.clayDarkest,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  heroFormat: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayLight,
    letterSpacing: 2,
    marginBottom: Spacing.sm,
  },
  heroScore: {
    ...Typography.displayBold,
    fontSize: 72,
    color: Colors.bgPrimary,
    lineHeight: 76,
  },
  heroMax: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.clayLight,
    marginBottom: Spacing.lg,
  },
  heroPctRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: '100%',
  },
  heroPctBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  heroPctFill: {
    height: '100%',
    backgroundColor: Colors.bgPrimary,
    borderRadius: Radius.full,
  },
  heroPct: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayLight,
    width: 36,
    textAlign: 'right',
  },

  metaRow: {
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  metaLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    width: 64,
  },
  metaValue: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    flex: 1,
  },

  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  statCard: {
    width: '47%',
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxl,
    color: Colors.textPrimary,
  },
  statLabel: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  statSub: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },
  scorecardTable: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.xl,
  },
  scorecardHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.bgSecondary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  scorecardRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.bgPrimary,
  },
  scorecardRowAlt: {
    backgroundColor: Colors.bgSecondary,
  },
  scorecardCell: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  scorecardCellTarget: { width: 32, color: Colors.greyLight },
  scorecardCellZone: { flex: 1 },
  scorecardCellScore: { width: 40, textAlign: 'center', fontFamily: 'Exo2_300Light' },
  scorecardCellRunning: { width: 50, textAlign: 'right', color: Colors.greyMid },
  scorecardMiss: { color: Colors.statusError },
  scorecardTop: { color: Colors.statusComplete },

  newRoundButton: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  newRoundText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.clayDark,
    letterSpacing: 1,
  },
});
