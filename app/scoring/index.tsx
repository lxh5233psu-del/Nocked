import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Clock, ChevronRight, Award, TrendingUp } from 'lucide-react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Colors, Typography, FontSizes, Spacing, Radius } from '@/constants/theme';

// ─── Placeholder data ─────────────────────────────────────────────────────────

type ScoringFormat = 'ASA' | 'IBO' | 'NFAA';

const FORMAT_INFO: Record<ScoringFormat, {
  targets: number;
  scoring: string;
  note: string;
  maxScore: number;
}> = {
  ASA: {
    targets: 20,
    scoring: '12 / 10 / 8 / 5 / M',
    note: '14-ring bonus available',
    maxScore: 240,
  },
  IBO: {
    targets: 30,
    scoring: '11 / 10 / 8 / 5 / M',
    note: '30 targets per round',
    maxScore: 330,
  },
  NFAA: {
    targets: 28,
    scoring: 'X / 5 / 4 / 3 / M',
    note: 'Field · Hunter · Animal',
    maxScore: 140,
  },
};

const RECENT_ROUNDS = [
  {
    id: '1',
    format: 'ASA' as ScoringFormat,
    date: 'Mar 24, 2026',
    total: 198,
    targets: 20,
    completed: true,
  },
  {
    id: '2',
    format: 'IBO' as ScoringFormat,
    date: 'Mar 19, 2026',
    total: 267,
    targets: 30,
    completed: true,
  },
  {
    id: '3',
    format: 'ASA' as ScoringFormat,
    date: 'Mar 12, 2026',
    total: 15,
    targets: 3,
    completed: false,
  },
];

const PERSONAL_BESTS: Partial<Record<ScoringFormat, number>> = {
  ASA: 218,
  IBO: 282,
};

// ─── New Round Sheet ──────────────────────────────────────────────────────────

function NewRoundSheet({
  onClose,
}: {
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<ScoringFormat>('ASA');
  const info = FORMAT_INFO[selected];

  return (
    <View style={sheetStyles.container}>
      <View style={sheetStyles.handle} />
      <Text style={sheetStyles.title}>Start New Round</Text>

      {/* Format selector */}
      <View style={sheetStyles.formatRow}>
        {(Object.keys(FORMAT_INFO) as ScoringFormat[]).map((fmt) => (
          <TouchableOpacity
            key={fmt}
            onPress={() => setSelected(fmt)}
            activeOpacity={0.7}
            style={[sheetStyles.fmtBtn, selected === fmt && sheetStyles.fmtBtnActive]}
          >
            <Text style={[sheetStyles.fmtLabel, selected === fmt && sheetStyles.fmtLabelActive]}>
              {fmt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Format detail */}
      <Card style={sheetStyles.detailCard}>
        <View style={sheetStyles.detailRow}>
          <Text style={sheetStyles.detailKey}>Targets</Text>
          <Text style={sheetStyles.detailVal}>{info.targets}</Text>
        </View>
        <View style={sheetStyles.detailRow}>
          <Text style={sheetStyles.detailKey}>Scoring</Text>
          <Text style={sheetStyles.detailVal}>{info.scoring}</Text>
        </View>
        <View style={sheetStyles.detailRow}>
          <Text style={sheetStyles.detailKey}>Note</Text>
          <Text style={sheetStyles.detailVal}>{info.note}</Text>
        </View>
        <View style={sheetStyles.detailRow}>
          <Text style={sheetStyles.detailKey}>Max Score</Text>
          <Text style={sheetStyles.detailVal}>{info.maxScore} pts</Text>
        </View>
      </Card>

      {/* Start button */}
      <TouchableOpacity
        onPress={onClose}
        activeOpacity={0.85}
        style={sheetStyles.startBtn}
      >
        <Text style={sheetStyles.startBtnText}>Start {selected} Round</Text>
        <ChevronRight size={18} color={Colors.bgPrimary} strokeWidth={2} />
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} style={sheetStyles.cancelBtn}>
        <Text style={sheetStyles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const sheetStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgPrimary,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  handle: {
    width: 40,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: Radius.full,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.labelMedium,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  formatRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  fmtBtn: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  fmtBtnActive: { backgroundColor: Colors.clayDark, borderColor: Colors.clayDark },
  fmtLabel: { ...Typography.labelMedium, fontSize: FontSizes.sm, color: Colors.greyMid },
  fmtLabelActive: { color: Colors.bgPrimary },
  detailCard: { gap: Spacing.sm, marginBottom: Spacing.lg },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailKey: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.greyLight },
  detailVal: { ...Typography.bodyMedium, fontSize: FontSizes.sm, color: Colors.textPrimary },
  startBtn: {
    backgroundColor: Colors.clayDark,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  startBtnText: { ...Typography.labelMedium, fontSize: FontSizes.sm, color: Colors.bgPrimary, letterSpacing: 1 },
  cancelBtn: { alignItems: 'center', paddingVertical: Spacing.md },
  cancelText: { ...Typography.label, fontSize: FontSizes.sm, color: Colors.greyMid },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function ScoringScreen() {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Score" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Scoring</Text>
        <Text style={styles.pageSubtitle}>
          Track 3D rounds for ASA, IBO, and NFAA formats.
        </Text>

        {/* New round button */}
        <TouchableOpacity
          onPress={() => setSheetOpen(true)}
          activeOpacity={0.75}
          style={styles.newRoundBtn}
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

        {/* Personal bests */}
        <Text style={styles.sectionLabel}>Personal Bests</Text>
        <View style={styles.pbRow}>
          {(Object.entries(PERSONAL_BESTS) as [ScoringFormat, number][]).map(([fmt, score]) => (
            <Card key={fmt} style={styles.pbCard}>
              <Award size={16} color={Colors.clayMid} strokeWidth={1.5} />
              <Text style={styles.pbScore}>{score}</Text>
              <Text style={styles.pbFormat}>{fmt}</Text>
            </Card>
          ))}
          <Card variant="outlined" style={styles.pbCard}>
            <TrendingUp size={16} color={Colors.greyLight} strokeWidth={1.5} />
            <Text style={styles.pbScoreEmpty}>—</Text>
            <Text style={styles.pbFormat}>NFAA</Text>
          </Card>
        </View>

        {/* Recent rounds */}
        <Text style={styles.sectionLabel}>Recent Rounds</Text>
        {RECENT_ROUNDS.map((round) => {
          const info = FORMAT_INFO[round.format];
          const pct = Math.round((round.targets / info.targets) * 100);
          return (
            <TouchableOpacity
              key={round.id}
              activeOpacity={0.75}
              style={styles.roundCard}
            >
              <View style={styles.roundCardTop}>
                <View>
                  <Text style={styles.roundFormat}>{round.format} Round</Text>
                  <Text style={styles.roundDate}>{round.date}</Text>
                </View>
                <View style={styles.roundScoreBlock}>
                  <Text style={styles.roundScore}>{round.total}</Text>
                  <Text style={styles.roundScoreMax}>/ {info.maxScore}</Text>
                </View>
              </View>
              {/* Progress */}
              <View style={styles.roundProgress}>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: `${pct}%` }]} />
                </View>
                <Text style={styles.roundProgressLabel}>
                  {round.completed ? 'Complete' : `${round.targets} / ${info.targets} targets`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Format reference */}
        <Text style={styles.sectionLabel}>Format Reference</Text>
        <View style={styles.formatCards}>
          {(Object.entries(FORMAT_INFO) as [ScoringFormat, typeof FORMAT_INFO.ASA][]).map(
            ([fmt, info]) => (
              <Card key={fmt} style={styles.fmtRefCard}>
                <Text style={styles.fmtRefName}>{fmt}</Text>
                <Text style={styles.fmtRefDetail}>{info.targets} targets</Text>
                <Text style={styles.fmtRefScoring}>{info.scoring}</Text>
                <Text style={styles.fmtRefNote}>{info.note}</Text>
              </Card>
            )
          )}
        </View>
      </ScrollView>

      {/* New round sheet */}
      {sheetOpen && (
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.overlayDismiss} onPress={() => setSheetOpen(false)} />
          <SafeAreaView edges={['bottom']}>
            <NewRoundSheet onClose={() => setSheetOpen(false)} />
          </SafeAreaView>
        </View>
      )}
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
    marginBottom: Spacing.xl,
  },

  newRoundBtn: {
    backgroundColor: Colors.clayDarkest,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  newRoundIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: Colors.clayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newRoundContent: { flex: 1 },
  newRoundTitle: { ...Typography.labelMedium, fontSize: FontSizes.base, color: Colors.textPrimary },
  newRoundSub: { ...Typography.body, fontSize: FontSizes.xs, color: Colors.greyMid, marginTop: 2 },

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },

  pbRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.xl },
  pbCard: { flex: 1, alignItems: 'center', gap: Spacing.xs, paddingVertical: Spacing.md },
  pbScore: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxl,
    color: Colors.textPrimary,
  },
  pbScoreEmpty: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxl,
    color: Colors.greyLight,
  },
  pbFormat: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.greyMid },

  roundCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
  },
  roundCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  roundFormat: { ...Typography.bodyMedium, fontSize: FontSizes.base, color: Colors.textPrimary },
  roundDate: { ...Typography.body, fontSize: FontSizes.xs, color: Colors.greyMid, marginTop: 2 },
  roundScoreBlock: { flexDirection: 'row', alignItems: 'flex-end', gap: 3 },
  roundScore: { ...Typography.displayBold, fontSize: FontSizes.xxl, color: Colors.textPrimary },
  roundScoreMax: { ...Typography.body, fontSize: FontSizes.sm, color: Colors.greyMid, marginBottom: 2 },
  roundProgress: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  progressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.clayMid, borderRadius: Radius.full },
  roundProgressLabel: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.greyLight, width: 80, textAlign: 'right' },

  formatCards: { flexDirection: 'row', gap: Spacing.sm },
  fmtRefCard: { flex: 1, gap: 3 },
  fmtRefName: { ...Typography.displayBold, fontSize: FontSizes.xl, color: Colors.textPrimary },
  fmtRefDetail: { ...Typography.label, fontSize: FontSizes.xs, color: Colors.greyMid },
  fmtRefScoring: { ...Typography.body, fontSize: FontSizes.xs, color: Colors.textSecondary, marginTop: 2 },
  fmtRefNote: { ...Typography.body, fontSize: FontSizes.xs - 1, color: Colors.greyLight, marginTop: 2 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(46,39,32,0.45)',
    justifyContent: 'flex-end',
  },
  overlayDismiss: { flex: 1 },
});
