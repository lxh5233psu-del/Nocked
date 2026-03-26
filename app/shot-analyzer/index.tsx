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
import { ChevronLeft, ChevronRight, Plus, BarChart2 } from 'lucide-react-native';
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

const GROUP_LABELS: Record<string, string> = {
  tight: 'Tight',
  medium: 'Medium',
  scattered: 'Scattered',
};

export default function ShotAnalyzerHubScreen() {
  const shotSessions = useAppStore((s) => s.shotSessions);
  const recentSessions = shotSessions.slice(0, 3);
  const hasHistory = shotSessions.length > 0;

  // Aggregate stats across all completed sessions
  const totalArrows = shotSessions
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + s.totalArrows, 0);
  const totalSessions = shotSessions.filter((s) => s.completed).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shot Analyzer</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Shot Analyzer</Text>
        <Text style={styles.pageSubtitle}>
          Log practice sessions end-by-end. Tag form issues, track conditions, and review patterns over time.
        </Text>

        {/* Aggregate stats */}
        {totalSessions > 0 && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalSessions}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalArrows}</Text>
              <Text style={styles.statLabel}>Total Arrows</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {totalSessions > 0 ? Math.round(totalArrows / totalSessions) : 0}
              </Text>
              <Text style={styles.statLabel}>Avg / Session</Text>
            </View>
          </View>
        )}

        {/* Start new session */}
        <TouchableOpacity
          onPress={() => router.push('/shot-analyzer/new-session')}
          activeOpacity={0.7}
          style={styles.newSessionButton}
        >
          <View style={styles.newSessionIcon}>
            <Plus size={22} color={Colors.bgPrimary} strokeWidth={2} />
          </View>
          <View style={styles.newSessionContent}>
            <Text style={styles.newSessionTitle}>Start New Session</Text>
            <Text style={styles.newSessionSub}>Log ends, tag form, track conditions</Text>
          </View>
          <ChevronRight size={18} color={Colors.bgPrimary} strokeWidth={1.5} />
        </TouchableOpacity>

        {/* Recent sessions */}
        {hasHistory && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Recent Sessions</Text>
              <TouchableOpacity onPress={() => router.push('/shot-analyzer/history')} hitSlop={8}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>

            {recentSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onPress={() => {
                  if (session.completed) {
                    router.push({ pathname: '/shot-analyzer/session-summary', params: { sessionId: session.id } });
                  } else {
                    router.push({ pathname: '/shot-analyzer/session', params: { sessionId: session.id } });
                  }
                }}
              />
            ))}
          </>
        )}

        {!hasHistory && (
          <View style={styles.emptyState}>
            <BarChart2 size={32} color={Colors.greyLight} strokeWidth={1} />
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptyText}>
              Start a session to begin logging your practice.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SessionCard({ session, onPress }: { session: ShotSession; onPress: () => void }) {
  const topIssue = session.ends
    .flatMap((e) => e.formIssues)
    .reduce<Record<string, number>>((acc, tag) => {
      acc[tag] = (acc[tag] ?? 0) + 1;
      return acc;
    }, {});
  const mostCommon = Object.entries(topIssue).sort((a, b) => b[1] - a[1])[0];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.sessionCard}>
      <View style={styles.sessionCardRow}>
        <View style={styles.sessionCardLeft}>
          <View style={styles.sessionCardHeader}>
            <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>
            {!session.completed && (
              <View style={styles.inProgressBadge}>
                <Text style={styles.inProgressText}>In Progress</Text>
              </View>
            )}
          </View>
          {session.location ? (
            <Text style={styles.sessionLocation}>{session.location}</Text>
          ) : null}
          {session.goal ? (
            <Text style={styles.sessionGoal}>{session.goal}</Text>
          ) : null}
          {mostCommon && (
            <Text style={styles.sessionIssue}>
              Most flagged: {mostCommon[0]} ({mostCommon[1]}×)
            </Text>
          )}
        </View>
        <View style={styles.sessionCardRight}>
          <Text style={styles.sessionArrows}>{session.totalArrows}</Text>
          <Text style={styles.sessionArrowsLabel}>arrows</Text>
          <Text style={styles.sessionEnds}>{session.ends.length} ends</Text>
        </View>
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

  pageTitle: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxl,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  pageSubtitle: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.xl,
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

  newSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.clayDarkest,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  newSessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.clayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newSessionContent: { flex: 1 },
  newSessionTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.base,
    color: Colors.bgPrimary,
  },
  newSessionSub: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayLight,
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  seeAll: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayMid,
  },

  sessionCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  sessionCardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  sessionCardLeft: { flex: 1, gap: 3 },
  sessionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sessionDate: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  inProgressBadge: {
    backgroundColor: Colors.clayLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
  },
  inProgressText: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.clayDarkest,
  },
  sessionLocation: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  sessionGoal: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
  sessionIssue: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.statusWarning,
  },
  sessionCardRight: { alignItems: 'flex-end' },
  sessionArrows: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  sessionArrowsLabel: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyLight,
  },
  sessionEnds: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginTop: 2,
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
