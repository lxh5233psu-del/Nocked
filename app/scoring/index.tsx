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
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { AnimatedEntry } from '@/components/ui/AnimatedEntry';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { ScoringRound } from '@/types';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function ScoringHubScreen() {
  const scoringRounds = useAppStore((s) => s.scoringRounds);

  const recentRounds = scoringRounds.slice(0, 3);
  const hasRounds = scoringRounds.length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Score</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedEntry delay={60}>
        <Text style={styles.pageTitle}>Scoring</Text>
        <Text style={styles.pageSubtitle}>
          Track your rounds for ASA, IBO, and NFAA formats.
        </Text>

        {/* Start new round */}
        <TouchableOpacity
          onPress={() => router.push('/scoring/new-round')}
          activeOpacity={0.7}
          style={styles.newRoundButton}
        >
          <View style={styles.newRoundIcon}>
            <Plus size={22} color={Colors.bgPrimary} strokeWidth={2} />
          </View>
          <View style={styles.newRoundContent}>
            <Text style={styles.newRoundTitle}>Start New Round</Text>
            <Text style={styles.newRoundSub}>ASA · IBO · NFAA</Text>
          </View>
          <ChevronRight size={18} color={Colors.bgPrimary} strokeWidth={1.5} />
        </TouchableOpacity>

        {/* Recent rounds */}
        {hasRounds && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Recent Rounds</Text>
              <TouchableOpacity onPress={() => router.push('/scoring/history')} hitSlop={8}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>

            {recentRounds.map((round) => (
              <RoundCard
                key={round.id}
                round={round}
                onPress={() => {
                  if (round.completed) {
                    router.push({ pathname: '/scoring/round-summary', params: { roundId: round.id } });
                  } else {
                    router.push({ pathname: '/scoring/scorecard', params: { roundId: round.id } });
                  }
                }}
              />
            ))}
          </>
        )}

        {!hasRounds && (
          <View style={styles.emptyState}>
            <Clock size={32} color={Colors.greyLight} strokeWidth={1} />
            <Text style={styles.emptyTitle}>No rounds yet</Text>
            <Text style={styles.emptyText}>
              Start a round above to begin tracking your scores.
            </Text>
          </View>
        )}

        {/* Format reference */}
        <Text style={styles.sectionLabel}>Format Reference</Text>
        <View style={styles.formatCards}>
          <FormatCard
            name="ASA"
            targets={20}
            scoring="12 / 10 / 8 / 5 / M"
            bonus="14-ring available"
          />
          <FormatCard
            name="IBO"
            targets={30}
            scoring="11 / 10 / 8 / 5 / M"
            bonus="30 targets per round"
          />
          <FormatCard
            name="NFAA"
            targets={28}
            scoring="X / 5 / 4 / 3 / M"
            bonus="Field / Hunter / Animal"
          />
        </View>
        </AnimatedEntry>
      </ScrollView>
    </SafeAreaView>
  );
}

function RoundCard({ round, onPress }: { round: ScoringRound; onPress: () => void }) {
  const progress = round.totalTargets > 0
    ? Math.round((round.shots.length / round.totalTargets) * 100)
    : 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.roundCard}>
      <View style={styles.roundCardTop}>
        <View>
          <View style={styles.roundCardHeader}>
            <Text style={styles.roundFormat}>{round.format}</Text>
            {!round.completed && (
              <View style={styles.inProgressBadge}>
                <Text style={styles.inProgressText}>In Progress</Text>
              </View>
            )}
          </View>
          <Text style={styles.roundDate}>{formatDate(round.date)}</Text>
          {round.location ? <Text style={styles.roundLocation}>{round.location}</Text> : null}
        </View>
        <View style={styles.roundScoreBlock}>
          <Text style={styles.roundScore}>{round.totalScore}</Text>
          <Text style={styles.roundScoreLabel}>
            {round.shots.length}/{round.totalTargets} targets
          </Text>
        </View>
      </View>
      {!round.completed && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      )}
    </TouchableOpacity>
  );
}

function FormatCard({
  name,
  targets,
  scoring,
  bonus,
}: {
  name: string;
  targets: number;
  scoring: string;
  bonus: string;
}) {
  return (
    <View style={styles.formatCard}>
      <Text style={styles.formatName}>{name}</Text>
      <Text style={styles.formatTargets}>{targets} targets</Text>
      <Text style={styles.formatScoring}>{scoring}</Text>
      <Text style={styles.formatBonus}>{bonus}</Text>
    </View>
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
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
    marginBottom: Spacing.xl,
  },

  // New round
  newRoundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.clayDarkest,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  newRoundIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.clayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newRoundContent: { flex: 1 },
  newRoundTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.base,
    color: Colors.bgPrimary,
  },
  newRoundSub: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayLight,
    marginTop: 2,
  },

  // Section
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
    marginBottom: Spacing.md,
  },
  seeAll: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayMid,
  },

  // Round card
  roundCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  roundCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  roundCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 2,
  },
  roundFormat: {
    ...Typography.labelMedium,
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
  roundDate: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },
  roundLocation: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginTop: 1,
  },
  roundScoreBlock: { alignItems: 'flex-end' },
  roundScore: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  roundScoreLabel: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyLight,
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.full,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.clayMid,
    borderRadius: Radius.full,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
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

  // Format reference
  formatCards: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  formatCard: {
    flex: 1,
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    gap: 3,
  },
  formatName: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  formatTargets: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyMid,
  },
  formatScoring: {
    ...Typography.body,
    fontSize: 9,
    color: Colors.textSecondary,
    lineHeight: 14,
    marginTop: 2,
  },
  formatBonus: {
    ...Typography.body,
    fontSize: 9,
    color: Colors.greyLight,
    fontStyle: 'italic',
  },
});
