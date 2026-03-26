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
import { ChevronLeft, CheckCircle } from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { getFormatConfig } from '@/data/scoring-formats';
import { ScalePress } from '@/components/ui/ScalePress';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';
import { ShotScore } from '@/types';

export default function ScorecardScreen() {
  const { roundId } = useLocalSearchParams<{ roundId: string }>();
  const scoringRounds = useAppStore((s) => s.scoringRounds);
  const updateScoringRound = useAppStore((s) => s.updateScoringRound);

  const round = scoringRounds.find((r) => r.id === roundId);
  const formatConfig = round ? getFormatConfig(round.format) : undefined;

  if (!round || !formatConfig) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Text style={styles.errorText}>Round not found.</Text>
      </SafeAreaView>
    );
  }

  const currentTargetNumber = round.shots.length + 1;
  const isComplete = round.shots.length >= round.totalTargets;
  const runningTotal = round.totalScore;

  const maxPossible = formatConfig.maxScorePerTarget * round.totalTargets;
  const pctComplete = Math.round((round.shots.length / round.totalTargets) * 100);

  const handleScore = (zone: { value: number; label: string }) => {
    if (isComplete) return;

    const newShot: ShotScore = {
      targetNumber: currentTargetNumber,
      score: zone.value,
      zoneName: zone.label,
    };

    const newShots = [...round.shots, newShot];
    const newTotal = newShots.reduce((sum, s) => sum + s.score, 0);
    const nowComplete = newShots.length >= round.totalTargets;

    updateScoringRound(round.id, {
      shots: newShots,
      totalScore: newTotal,
      completed: nowComplete,
    });

    if (nowComplete) {
      router.replace({ pathname: '/scoring/round-summary', params: { roundId: round.id } });
    }
  };

  const handleUndoLast = () => {
    if (round.shots.length === 0) return;
    const newShots = round.shots.slice(0, -1);
    const newTotal = newShots.reduce((sum, s) => sum + s.score, 0);
    updateScoringRound(round.id, {
      shots: newShots,
      totalScore: newTotal,
      completed: false,
    });
  };

  const handleAbandon = () => {
    Alert.alert(
      'Abandon Round',
      'This will discard the current round. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Abandon',
          style: 'destructive',
          onPress: () => router.replace('/scoring'),
        },
      ]
    );
  };

  // Recent shots for display (last 5)
  const recentShots = useMemo(() => [...round.shots].reverse().slice(0, 5), [round.shots]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleAbandon} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{round.format} Round</Text>
        <TouchableOpacity onPress={handleUndoLast} hitSlop={12} disabled={round.shots.length === 0}>
          <Text style={[styles.undoText, round.shots.length === 0 && styles.undoDisabled]}>
            Undo
          </Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${pctComplete}%` }]} />
        </View>
        <Text style={styles.progressLabel}>
          {round.shots.length} / {round.totalTargets}
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Score summary */}
        <View style={styles.scoreSummary}>
          <View style={styles.scorePrimary}>
            <Text style={styles.scoreNumber}>{runningTotal}</Text>
            <Text style={styles.scoreMax}>/ {maxPossible}</Text>
          </View>
          <Text style={styles.scoreLabel}>Running Total</Text>
          {round.shots.length > 0 && (
            <Text style={styles.scoreAvg}>
              Avg: {(runningTotal / round.shots.length).toFixed(1)} per target
            </Text>
          )}
        </View>

        {/* Current target prompt */}
        {!isComplete && (
          <View style={styles.targetPrompt}>
            <Text style={styles.targetPromptLabel}>Target {currentTargetNumber}</Text>
            <Text style={styles.targetPromptSub}>Select your score</Text>
          </View>
        )}

        {/* Scoring zones */}
        {!isComplete && (
          <View style={styles.zoneGrid}>
            {formatConfig.zones.map((zone) => (
              <ScalePress
                key={zone.label}
                onPress={() => handleScore(zone)}
                style={[
                  styles.zoneButton,
                  zone.value === 0 && styles.zoneMiss,
                  zone.value === formatConfig.maxScorePerTarget && styles.zoneTop,
                ]}
              >
                <Text
                  style={[
                    styles.zoneButtonLabel,
                    zone.value === 0 && styles.zoneMissLabel,
                    zone.value === formatConfig.maxScorePerTarget && styles.zoneTopLabel,
                  ]}
                >
                  {zone.label}
                </Text>
                {zone.description && (
                  <Text
                    style={[
                      styles.zoneButtonDesc,
                      zone.value === formatConfig.maxScorePerTarget && styles.zoneTopDesc,
                    ]}
                  >
                    {zone.value > 0 ? `${zone.value} pts` : 'Miss'}
                  </Text>
                )}
              </ScalePress>
            ))}
          </View>
        )}

        {/* Recent shots log */}
        {recentShots.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.recentLabel}>Recent</Text>
            {recentShots.map((shot) => (
              <View key={shot.targetNumber} style={styles.recentRow}>
                <Text style={styles.recentTarget}>T{shot.targetNumber}</Text>
                <Text style={styles.recentZone}>{shot.zoneName}</Text>
                <Text style={styles.recentScore}>
                  {shot.score === 0 ? 'M' : `+${shot.score}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Finished state */}
        {isComplete && (
          <View style={styles.completeState}>
            <CheckCircle size={40} color={Colors.statusComplete} strokeWidth={1} />
            <Text style={styles.completeTitle}>Round Complete</Text>
            <Text style={styles.completeScore}>{runningTotal} pts</Text>
            <TouchableOpacity
              onPress={() =>
                router.replace({ pathname: '/scoring/round-summary', params: { roundId: round.id } })
              }
              activeOpacity={0.7}
              style={styles.viewSummaryButton}
            >
              <Text style={styles.viewSummaryText}>View Summary</Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: Spacing.xs,
  },
  backButton: { padding: Spacing.xs },
  headerTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  undoText: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayMid,
    padding: Spacing.xs,
  },
  undoDisabled: { opacity: 0.3 },

  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.clayMid,
    borderRadius: Radius.full,
  },
  progressLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    width: 48,
    textAlign: 'right',
  },

  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  scoreSummary: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  scorePrimary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  scoreNumber: {
    ...Typography.displayBold,
    fontSize: 56,
    color: Colors.textPrimary,
    lineHeight: 60,
  },
  scoreMax: {
    ...Typography.body,
    fontSize: FontSizes.base,
    color: Colors.greyMid,
    marginBottom: Spacing.xs,
  },
  scoreLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginTop: Spacing.xs,
  },
  scoreAvg: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    marginTop: Spacing.xs,
  },

  targetPrompt: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  targetPromptLabel: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  targetPromptSub: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    marginTop: 2,
  },

  zoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  zoneButton: {
    width: '30%',
    aspectRatio: 1.4,
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  zoneTop: {
    backgroundColor: Colors.clayDarkest,
  },
  zoneMiss: {
    backgroundColor: Colors.bgPrimary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  zoneButtonLabel: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  zoneTopLabel: {
    color: Colors.bgPrimary,
  },
  zoneMissLabel: {
    color: Colors.greyLight,
  },
  zoneButtonDesc: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyMid,
  },
  zoneTopDesc: {
    color: Colors.clayLight,
  },

  recentSection: {
    gap: Spacing.xs,
  },
  recentLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.xs,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  recentTarget: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    width: 32,
  },
  recentZone: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    flex: 1,
  },
  recentScore: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.clayMid,
  },

  completeState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.md,
  },
  completeTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  completeScore: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxxl,
    color: Colors.textPrimary,
  },
  viewSummaryButton: {
    backgroundColor: Colors.clayDark,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.sm,
  },
  viewSummaryText: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.bgPrimary,
    letterSpacing: 1,
  },
});
