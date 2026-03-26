import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle, Circle, ChevronRight, AlertTriangle } from 'lucide-react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Colors, Typography, FontSizes, Spacing, Radius } from '@/constants/theme';

// ─── Placeholder data ─────────────────────────────────────────────────────────

const ACTIVE_BOW = {
  nickname: '2024 Hoyt Carbon RX-9',
  setupComplete: true,
};

const TUNING_METHODS = [
  {
    key: 'sight-in',
    title: 'Initial Sight-In',
    description: '20-yard zero — establish a baseline before tuning begins.',
    prerequisites: [],
    complete: true,
    summary: 'Zeroed at 20 yd · 3 groups confirmed',
  },
  {
    key: 'paper',
    title: 'Paper Tuning',
    description: 'Diagnose arrow flight through paper tears at close range.',
    prerequisites: ['sight-in'],
    complete: true,
    summary: 'Bullet hole achieved · rest moved 1/16" right',
  },
  {
    key: 'walk-back',
    title: 'Walk-Back Tuning',
    description: 'Verify centershot alignment using a vertical reference at distance.',
    prerequisites: ['paper'],
    complete: false,
    summary: null,
  },
  {
    key: 'bare-shaft',
    title: 'Bare Shaft Tuning',
    description: 'Compare fletched vs bare shaft impacts to fine-tune spine and rest.',
    prerequisites: ['walk-back'],
    complete: false,
    summary: null,
  },
  {
    key: 'french',
    title: 'French Tuning',
    description: 'Group-walk method — confirm tune consistency across distances.',
    prerequisites: ['bare-shaft'],
    complete: false,
    summary: null,
  },
  {
    key: 'group',
    title: 'Group Tuning',
    description: 'Micro-adjustments based on group impact at competition distance.',
    prerequisites: ['french'],
    complete: false,
    summary: null,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const completedCount = TUNING_METHODS.filter((m) => m.complete).length;

export default function TuningScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Tuning Phase" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active bow */}
        <View style={styles.bowContext}>
          <Text style={styles.bowContextLabel}>Tuning</Text>
          <Text style={styles.bowContextName}>{ACTIVE_BOW.nickname}</Text>
        </View>

        {/* Progress summary */}
        <Card style={styles.progressCard}>
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              {completedCount} of {TUNING_METHODS.length} methods complete
            </Text>
            <View style={styles.progressDots}>
              {TUNING_METHODS.map((m) => (
                <View
                  key={m.key}
                  style={[styles.dot, m.complete && styles.dotFilled]}
                />
              ))}
            </View>
          </View>
        </Card>

        {/* Prerequisite warning */}
        {!ACTIVE_BOW.setupComplete && (
          <View style={styles.prereqBanner}>
            <AlertTriangle size={14} color={Colors.statusWarning} strokeWidth={1.5} />
            <View style={styles.prereqBody}>
              <Text style={styles.prereqTitle}>Setup Recommended First</Text>
              <Text style={styles.prereqText}>
                Complete the 12-step setup phase before tuning for best results.
              </Text>
            </View>
          </View>
        )}

        {/* Description */}
        <Text style={styles.description}>
          Work through each method in order. Each builds on the previous — start with
          sight-in, then paper tune, and progress through to group tuning.
        </Text>

        {/* Method list */}
        {TUNING_METHODS.map((method, idx) => {
          const isNext = !method.complete && idx === completedCount;

          return (
            <TouchableOpacity
              key={method.key}
              activeOpacity={0.75}
              style={[
                styles.methodRow,
                method.complete && styles.methodRowDone,
                isNext && styles.methodRowNext,
              ]}
            >
              {/* Status icon */}
              <View style={styles.methodIcon}>
                {method.complete ? (
                  <CheckCircle size={20} color={Colors.statusComplete} strokeWidth={1.5} />
                ) : (
                  <Circle
                    size={20}
                    color={isNext ? Colors.clayDark : Colors.border}
                    strokeWidth={1.5}
                  />
                )}
              </View>

              {/* Content */}
              <View style={styles.methodContent}>
                <Text style={[styles.methodTitle, method.complete && styles.methodTitleDone]}>
                  {method.title}
                </Text>
                <Text style={styles.methodDesc}>{method.description}</Text>
                {method.summary && (
                  <Text style={styles.methodSummary}>{method.summary}</Text>
                )}
              </View>

              <ChevronRight size={16} color={Colors.greyLight} strokeWidth={1.5} />
            </TouchableOpacity>
          );
        })}

        {/* All-complete state placeholder */}
        {completedCount === TUNING_METHODS.length && (
          <Card style={styles.completeCard}>
            <CheckCircle size={28} color={Colors.statusComplete} strokeWidth={1} />
            <Text style={styles.completeTitle}>Bow Fully Tuned</Text>
            <Text style={styles.completeText}>
              All 6 methods complete. Your setup and tune baseline is locked in.
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },

  bowContext: { marginBottom: Spacing.lg },
  bowContextLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  bowContextName: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },

  progressCard: { marginBottom: Spacing.lg },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
  progressDots: { flexDirection: 'row', gap: Spacing.xs },
  dot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
  },
  dotFilled: { backgroundColor: Colors.statusComplete },

  prereqBanner: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.bgSecondary,
    borderLeftWidth: 3,
    borderLeftColor: Colors.statusWarning,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  prereqBody: { flex: 1, gap: 3 },
  prereqTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.statusWarning,
  },
  prereqText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },

  description: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },

  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.xs,
  },
  methodRowDone: { opacity: 0.65 },
  methodRowNext: { backgroundColor: Colors.bgSecondary },
  methodIcon: { width: 24, alignItems: 'center' },
  methodContent: { flex: 1 },
  methodTitle: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  methodTitleDone: { color: Colors.greyMid },
  methodDesc: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginTop: 2,
  },
  methodSummary: {
    ...Typography.label,
    fontSize: FontSizes.xs - 1,
    color: Colors.statusComplete,
    marginTop: 4,
  },

  completeCard: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  completeTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
  completeText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    textAlign: 'center',
    lineHeight: 20,
  },
});
