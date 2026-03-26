import React from 'react';
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
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { ShotSession } from '@/types';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ShotAnalyzerHistoryScreen() {
  const shotSessions = useAppStore((s) => s.shotSessions);
  const completedSessions = shotSessions.filter((s) => s.completed);

  // Aggregate stats
  const totalArrows = completedSessions.reduce((sum, s) => sum + s.totalArrows, 0);
  const totalEnds = completedSessions.reduce((sum, s) => sum + s.ends.length, 0);

  // All form issues across all sessions
  const issueCounts: Record<string, number> = {};
  completedSessions.forEach((s) => {
    s.ends.forEach((e) => {
      e.formIssues.forEach((tag) => {
        issueCounts[tag] = (issueCounts[tag] ?? 0) + 1;
      });
    });
  });
  const topIssues = Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session History</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Lifetime stats */}
        {completedSessions.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>All-Time</Text>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{completedSessions.length}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{totalArrows}</Text>
                <Text style={styles.statLabel}>Arrows</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{totalEnds}</Text>
                <Text style={styles.statLabel}>Ends</Text>
              </View>
            </View>
          </>
        )}

        {/* Top form issues */}
        {topIssues.length > 0 && (
          <>
            <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>
              Recurring Form Issues
            </Text>
            <View style={styles.issuesBlock}>
              {topIssues.map(([tag, count], i) => {
                const maxCount = topIssues[0][1];
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <View key={tag} style={styles.issueRow}>
                    <Text style={styles.issueTag}>{tag}</Text>
                    <View style={styles.issueBarTrack}>
                      <View style={[styles.issueBarFill, { width: `${pct}%` }]} />
                    </View>
                    <Text style={styles.issueCount}>{count}</Text>
                  </View>
                );
              })}
            </View>
            <TouchableOpacity
              onPress={() => router.push('/form')}
              activeOpacity={0.7}
              style={styles.formLink}
            >
              <Text style={styles.formLinkText}>Review Form Module →</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Session list */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.xl }]}>All Sessions</Text>

        {completedSessions.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No completed sessions yet.</Text>
          </View>
        )}

        {completedSessions.map((session) => (
          <SessionHistoryRow key={session.id} session={session} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function SessionHistoryRow({ session }: { session: ShotSession }) {
  const topIssue = session.ends
    .flatMap((e) => e.formIssues)
    .reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
      return acc;
    }, {});
  const mostCommon = Object.entries(topIssue).sort((a, b) => b[1] - a[1])[0];

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: '/shot-analyzer/session-summary', params: { sessionId: session.id } })
      }
      activeOpacity={0.7}
      style={styles.historyRow}
    >
      <View style={styles.historyLeft}>
        <Text style={styles.historyDate}>{formatDate(session.date)}</Text>
        {session.location && (
          <Text style={styles.historyLocation}>{session.location}</Text>
        )}
        {mostCommon && (
          <Text style={styles.historyIssue}>Top issue: {mostCommon[0]}</Text>
        )}
      </View>
      <View style={styles.historyRight}>
        <Text style={styles.historyArrows}>{session.totalArrows}</Text>
        <Text style={styles.historyArrowsLabel}>arrows</Text>
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
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },

  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xs },
  statCard: {
    flex: 1,
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
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

  issuesBlock: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  issueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  issueTag: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.textPrimary,
    width: 130,
  },
  issueBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  issueBarFill: {
    height: '100%',
    backgroundColor: Colors.statusError,
    borderRadius: Radius.full,
    opacity: 0.7,
  },
  issueCount: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    width: 24,
    textAlign: 'right',
  },

  formLink: {
    marginBottom: Spacing.lg,
  },
  formLinkText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayMid,
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
  historyLeft: { flex: 1, gap: 3 },
  historyDate: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  historyLocation: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  historyIssue: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.statusError,
    opacity: 0.8,
  },
  historyRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  historyArrows: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  historyArrowsLabel: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyLight,
  },
});
