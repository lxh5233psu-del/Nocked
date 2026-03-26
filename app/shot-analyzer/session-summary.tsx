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
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

const WIND_LABELS: Record<string, string> = {
  calm: 'Calm',
  light: 'Light',
  moderate: 'Moderate',
  strong: 'Strong',
};

const LIGHT_LABELS: Record<string, string> = {
  bright: 'Bright Sun',
  overcast: 'Overcast',
  'low-light': 'Low Light',
  indoor: 'Indoor',
};

const GROUP_LABELS: Record<string, string> = {
  tight: 'Tight',
  medium: 'Medium',
  scattered: 'Scattered',
};

export default function SessionSummaryScreen() {
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  const shotSessions = useAppStore((s) => s.shotSessions);
  const deleteShotSession = useAppStore((s) => s.deleteShotSession);
  const bowProfiles = useAppStore((s) => s.bowProfiles);

  const session = shotSessions.find((s) => s.id === sessionId);
  const bow = session?.bowId ? bowProfiles.find((b) => b.id === session.bowId) : undefined;

  const analysis = useMemo(() => {
    if (!session) return null;

    // Most common distance
    const distCounts: Record<number, number> = {};
    session.ends.forEach((e) => {
      distCounts[e.distance] = (distCounts[e.distance] ?? 0) + 1;
    });
    const topDist = Object.entries(distCounts).sort((a, b) => b[1] - a[1])[0];

    // Form issue frequency
    const issueCounts: Record<string, number> = {};
    session.ends.forEach((e) => {
      e.formIssues.forEach((tag) => {
        issueCounts[tag] = (issueCounts[tag] ?? 0) + 1;
      });
    });
    const topIssues = Object.entries(issueCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Group distribution
    const groupCounts: Record<string, number> = { tight: 0, medium: 0, scattered: 0 };
    session.ends.forEach((e) => {
      if (e.groupSize) groupCounts[e.groupSize]++;
    });

    const endsWithIssues = session.ends.filter((e) => e.formIssues.length > 0).length;

    return { topDist, topIssues, groupCounts, endsWithIssues };
  }, [session]);

  if (!session || !analysis) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.errorText}>Session not found.</Text>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert('Delete Session', 'This session will be permanently deleted.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteShotSession(session.id);
          router.replace('/shot-analyzer');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.replace('/shot-analyzer')}
          style={styles.doneButton}
          hitSlop={12}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session Summary</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton} hitSlop={12}>
          <Trash2 size={18} color={Colors.statusError} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroCard}>
          <Text style={styles.heroDate}>{formatDate(session.date)}</Text>
          <Text style={styles.heroArrows}>{session.totalArrows}</Text>
          <Text style={styles.heroArrowsLabel}>arrows · {session.ends.length} ends</Text>
        </View>

        {/* Metadata */}
        <View style={styles.metaBlock}>
          {bow && <MetaRow label="Bow" value={bow.nickname} />}
          {session.location && <MetaRow label="Location" value={session.location} />}
          {session.goal && <MetaRow label="Goal" value={session.goal} />}
          {session.wind && <MetaRow label="Wind" value={WIND_LABELS[session.wind]} />}
          {session.light && <MetaRow label="Light" value={LIGHT_LABELS[session.light]} />}
        </View>

        {/* Stats */}
        <View style={styles.statGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{session.ends.length}</Text>
            <Text style={styles.statLabel}>Ends</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {session.ends.length > 0
                ? (session.totalArrows / session.ends.length).toFixed(1)
                : '—'}
            </Text>
            <Text style={styles.statLabel}>Arrows/End</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{analysis.endsWithIssues}</Text>
            <Text style={styles.statLabel}>Ends w/ Issues</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {analysis.topDist ? `${analysis.topDist[0]}yd` : '—'}
            </Text>
            <Text style={styles.statLabel}>Primary Dist.</Text>
          </View>
        </View>

        {/* Top form issues */}
        {analysis.topIssues.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Most Flagged Form Issues</Text>
            <View style={styles.issuesBlock}>
              {analysis.topIssues.map(([tag, count], i) => (
                <View key={tag} style={styles.issueRow}>
                  <View style={styles.issueRank}>
                    <Text style={styles.issueRankText}>{i + 1}</Text>
                  </View>
                  <Text style={styles.issueTag}>{tag}</Text>
                  <Text style={styles.issueCount}>{count}×</Text>
                </View>
              ))}
            </View>
            <Text style={styles.issueNote}>
              Review the Form module to address these components.
            </Text>
          </>
        )}

        {/* Group distribution */}
        {session.ends.some((e) => e.groupSize) && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>Group Distribution</Text>
            <View style={styles.groupDistRow}>
              {Object.entries(analysis.groupCounts).map(([size, count]) => {
                const total = session.ends.filter((e) => e.groupSize).length;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <View key={size} style={styles.groupDistCard}>
                    <Text style={styles.groupDistPct}>{pct}%</Text>
                    <View style={styles.groupDistBar}>
                      <View style={[styles.groupDistFill, { height: `${pct}%` }]} />
                    </View>
                    <Text style={styles.groupDistLabel}>{GROUP_LABELS[size]}</Text>
                    <Text style={styles.groupDistCount}>{count} ends</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* End log */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>End Log</Text>
        <View style={styles.endLogTable}>
          <View style={styles.endLogHeader}>
            <Text style={[styles.endLogCell, styles.endLogCellEnd]}>End</Text>
            <Text style={[styles.endLogCell, styles.endLogCellDist]}>Dist</Text>
            <Text style={[styles.endLogCell, styles.endLogCellArrows]}>Arrows</Text>
            <Text style={[styles.endLogCell, styles.endLogCellGroup]}>Group</Text>
            <Text style={[styles.endLogCell, styles.endLogCellIssues]}>Issues</Text>
          </View>
          {session.ends.map((end, i) => (
            <View key={end.endNumber} style={[styles.endLogRow, i % 2 === 1 && styles.endLogRowAlt]}>
              <Text style={[styles.endLogCell, styles.endLogCellEnd]}>{end.endNumber}</Text>
              <Text style={[styles.endLogCell, styles.endLogCellDist]}>{end.distance}yd</Text>
              <Text style={[styles.endLogCell, styles.endLogCellArrows]}>{end.arrowCount}</Text>
              <Text style={[styles.endLogCell, styles.endLogCellGroup]}>
                {end.groupSize ? GROUP_LABELS[end.groupSize].slice(0, 4) : '—'}
              </Text>
              <Text style={[styles.endLogCell, styles.endLogCellIssues, end.formIssues.length > 0 && styles.endLogIssue]}>
                {end.formIssues.length > 0 ? end.formIssues.length : '—'}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => router.push('/shot-analyzer/new-session')}
          activeOpacity={0.7}
          style={styles.newSessionButton}
        >
          <Text style={styles.newSessionText}>Start Another Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaRow}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
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
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },

  heroCard: {
    backgroundColor: Colors.clayDarkest,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  heroDate: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayLight,
    letterSpacing: 1,
  },
  heroArrows: {
    ...Typography.displayBold,
    fontSize: 72,
    color: Colors.bgPrimary,
    lineHeight: 76,
  },
  heroArrowsLabel: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.clayLight,
  },

  metaBlock: { gap: Spacing.xs, marginBottom: Spacing.lg },
  metaRow: {
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
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },

  issuesBlock: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  issueRank: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.statusError,
    alignItems: 'center',
    justifyContent: 'center',
  },
  issueRankText: {
    ...Typography.label,
    fontSize: 9,
    color: Colors.bgPrimary,
  },
  issueTag: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    flex: 1,
  },
  issueCount: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.statusError,
  },
  issueNote: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    fontStyle: 'italic',
    marginBottom: Spacing.lg,
  },

  groupDistRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    height: 160,
    alignItems: 'flex-end',
    marginBottom: Spacing.lg,
  },
  groupDistCard: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  groupDistPct: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
  },
  groupDistBar: {
    width: '60%',
    flex: 1,
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  groupDistFill: {
    backgroundColor: Colors.clayMid,
    borderRadius: Radius.sm,
    width: '100%',
    minHeight: 4,
  },
  groupDistLabel: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  groupDistCount: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyLight,
  },

  endLogTable: {
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.xl,
  },
  endLogHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.bgSecondary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  endLogRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    backgroundColor: Colors.bgPrimary,
  },
  endLogRowAlt: { backgroundColor: Colors.bgSecondary },
  endLogCell: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
  },
  endLogCellEnd: { width: 32, color: Colors.greyLight },
  endLogCellDist: { width: 44 },
  endLogCellArrows: { flex: 1 },
  endLogCellGroup: { width: 52 },
  endLogCellIssues: { width: 40, textAlign: 'center' },
  endLogIssue: { color: Colors.statusError },

  newSessionButton: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  newSessionText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.clayDark,
    letterSpacing: 1,
  },
});
