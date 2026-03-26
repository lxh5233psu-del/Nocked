import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus,
  ChevronRight,
  BarChart2,
  Wind,
  Sun,
  CloudRain,
  Tag,
} from 'lucide-react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Colors, Typography, FontSizes, Spacing, Radius } from '@/constants/theme';

// ─── Placeholder data ─────────────────────────────────────────────────────────

const STATS = {
  totalSessions: 12,
  totalArrows: 486,
  avgPerSession: 40,
};

const SESSIONS = [
  {
    id: '1',
    date: 'Mar 24, 2026',
    distance: '20 yd',
    ends: 10,
    arrows: 60,
    condition: 'outdoor',
    wind: 'light',
    topIssue: 'Back tension',
    grouping: 'tight',
    completed: true,
  },
  {
    id: '2',
    date: 'Mar 20, 2026',
    distance: '30 yd',
    ends: 8,
    arrows: 48,
    condition: 'indoor',
    wind: 'none',
    topIssue: 'Grip pressure',
    grouping: 'medium',
    completed: true,
  },
  {
    id: '3',
    date: 'Mar 17, 2026',
    distance: '20 yd',
    ends: 3,
    arrows: 18,
    condition: 'outdoor',
    wind: 'moderate',
    topIssue: null,
    grouping: 'scattered',
    completed: false,
  },
];

const COMMON_ISSUES = [
  { tag: 'Back tension', count: 18 },
  { tag: 'Grip pressure', count: 11 },
  { tag: 'Anchor drift', count: 7 },
  { tag: 'Punching', count: 4 },
  { tag: 'Bow arm drop', count: 3 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const GROUPING_COLORS: Record<string, string> = {
  tight: Colors.statusComplete,
  medium: Colors.statusWarning,
  scattered: '#8A4A4A',
};

function ConditionIcon({ condition, wind }: { condition: string; wind: string }) {
  if (condition === 'indoor') return <Sun size={12} color={Colors.greyLight} strokeWidth={1.5} />;
  if (wind === 'moderate') return <CloudRain size={12} color={Colors.greyLight} strokeWidth={1.5} />;
  return <Wind size={12} color={Colors.greyLight} strokeWidth={1.5} />;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShotAnalyzerScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Shot Analyzer" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Shot Analyzer</Text>
        <Text style={styles.pageSubtitle}>
          Log practice sessions end-by-end. Tag form issues, track conditions, and review patterns over time.
        </Text>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{STATS.totalSessions}</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{STATS.totalArrows}</Text>
            <Text style={styles.statLabel}>Total Arrows</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{STATS.avgPerSession}</Text>
            <Text style={styles.statLabel}>Avg / Session</Text>
          </Card>
        </View>

        {/* Start new session */}
        <TouchableOpacity activeOpacity={0.75} style={styles.newSessionBtn}>
          <View style={styles.newSessionIcon}>
            <Plus size={22} color={Colors.bgPrimary} strokeWidth={2} />
          </View>
          <View style={styles.newSessionContent}>
            <Text style={styles.newSessionTitle}>Start New Session</Text>
            <Text style={styles.newSessionSub}>Log ends, tag form, track conditions</Text>
          </View>
          <ChevronRight size={18} color={Colors.bgPrimary} strokeWidth={1.5} />
        </TouchableOpacity>

        {/* Top form issues */}
        <Text style={styles.sectionLabel}>Top Form Issues</Text>
        <Card style={styles.issuesCard}>
          {COMMON_ISSUES.map((issue, idx) => {
            const barPct = Math.round((issue.count / COMMON_ISSUES[0].count) * 100);
            return (
              <View key={issue.tag} style={styles.issueRow}>
                <View style={styles.issueLeft}>
                  <Tag size={11} color={Colors.clayLight} strokeWidth={1.5} />
                  <Text style={styles.issueTag}>{issue.tag}</Text>
                </View>
                <View style={styles.issueBarWrap}>
                  <View style={[styles.issueBar, { width: `${barPct}%` }]} />
                </View>
                <Text style={styles.issueCount}>{issue.count}</Text>
              </View>
            );
          })}
        </Card>

        {/* Recent sessions */}
        <Text style={styles.sectionLabel}>Recent Sessions</Text>
        {SESSIONS.map((session) => (
          <TouchableOpacity key={session.id} activeOpacity={0.75} style={styles.sessionCard}>
            <View style={styles.sessionTop}>
              {/* Date & meta */}
              <View style={styles.sessionLeft}>
                <Text style={styles.sessionDate}>{session.date}</Text>
                <View style={styles.sessionMeta}>
                  <ConditionIcon condition={session.condition} wind={session.wind} />
                  <Text style={styles.sessionMetaText}>
                    {session.distance} · {session.ends} ends · {session.arrows} arrows
                  </Text>
                </View>
              </View>
              {/* Grouping badge */}
              <View
                style={[
                  styles.groupingBadge,
                  { borderColor: GROUPING_COLORS[session.grouping] },
                ]}
              >
                <Text
                  style={[styles.groupingText, { color: GROUPING_COLORS[session.grouping] }]}
                >
                  {session.grouping}
                </Text>
              </View>
            </View>

            {/* Top issue tag */}
            {session.topIssue && (
              <View style={styles.issueTagRow}>
                <Tag size={11} color={Colors.clayLight} strokeWidth={1.5} />
                <Text style={styles.issueTagText}>{session.topIssue}</Text>
              </View>
            )}

            {/* Incomplete indicator */}
            {!session.completed && (
              <View style={styles.incompleteRow}>
                <View style={styles.incompleteDot} />
                <Text style={styles.incompleteText}>In progress</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Empty state placeholder — hidden when sessions exist */}
        {SESSIONS.length === 0 && (
          <View style={styles.emptyState}>
            <BarChart2 size={36} color={Colors.greyLight} strokeWidth={1} />
            <Text style={styles.emptyTitle}>No sessions yet</Text>
            <Text style={styles.emptyText}>Start a session above to begin logging your practice.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },

  pageTitle: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxl,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  pageSubtitle: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },

  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, gap: 3 },
  statValue: { ...Typography.displayBold, fontSize: FontSizes.xl, color: Colors.textPrimary },
  statLabel: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.greyMid },

  newSessionBtn: {
    backgroundColor: Colors.clayDarkest,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  newSessionIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.clayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newSessionContent: { flex: 1 },
  newSessionTitle: { ...Typography.labelMedium, fontSize: FontSizes.base, color: Colors.textPrimary },
  newSessionSub: { ...Typography.body, fontSize: FontSizes.xs, color: Colors.greyMid, marginTop: 2 },

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },

  issuesCard: { gap: Spacing.md, marginBottom: Spacing.xl },
  issueRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  issueLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, width: 120 },
  issueTag: { ...Typography.body, fontSize: FontSizes.sm, color: Colors.textSecondary },
  issueBarWrap: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  issueBar: { height: '100%', backgroundColor: Colors.clayLight, borderRadius: Radius.full },
  issueCount: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.greyMid, width: 20, textAlign: 'right' },

  sessionCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  sessionTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  sessionLeft: { gap: 3 },
  sessionDate: { ...Typography.bodyMedium, fontSize: FontSizes.base, color: Colors.textPrimary },
  sessionMeta: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  sessionMetaText: { ...Typography.body, fontSize: FontSizes.xs, color: Colors.greyMid },
  groupingBadge: {
    paddingVertical: 3,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  groupingText: { ...Typography.label, fontSize: FontSizes.xs },
  issueTagRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  issueTagText: { ...Typography.body, fontSize: FontSizes.xs, color: Colors.greyMid },
  incompleteRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  incompleteDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.statusWarning,
  },
  incompleteText: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.statusWarning },

  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  emptyTitle: { ...Typography.labelMedium, fontSize: FontSizes.md, color: Colors.greyMid },
  emptyText: { ...Typography.body, fontSize: FontSizes.sm, color: Colors.greyLight, textAlign: 'center', lineHeight: 20 },
});
