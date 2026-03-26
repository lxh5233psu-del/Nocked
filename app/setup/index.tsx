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
import { CheckCircle, Circle, ChevronRight, Lock } from 'lucide-react-native';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Colors, Typography, FontSizes, Spacing, Radius } from '@/constants/theme';

// ─── Placeholder data ─────────────────────────────────────────────────────────

const ACTIVE_BOW = '2024 Hoyt Carbon RX-9';

const SETUP_STEPS = [
  {
    num: 1,
    title: 'Limb Alignment Check',
    category: 'Pre-Flight',
    desc: 'Verify both limbs are square and seated properly in the pockets.',
    complete: true,
  },
  {
    num: 2,
    title: 'Cam Synchronization',
    category: 'Pre-Flight',
    desc: 'Confirm cams reach full draw simultaneously for a clean back wall.',
    complete: true,
  },
  {
    num: 3,
    title: 'Brace Height',
    category: 'Pre-Flight',
    desc: 'Measure and set brace height per manufacturer spec.',
    complete: true,
  },
  {
    num: 4,
    title: 'Draw Length Verification',
    category: 'Draw Cycle',
    desc: 'Confirm draw length suits your form — anchor, elbow clearance, and posture.',
    complete: false,
  },
  {
    num: 5,
    title: 'Nocking Point & D-Loop',
    category: 'Draw Cycle',
    desc: 'Set the nocking point height and tie the D-loop to spec.',
    complete: false,
  },
  {
    num: 6,
    title: 'Arrow Rest Position & Tie-In',
    category: 'Draw Cycle',
    desc: 'Center-shot rest left/right and height relative to berger hole.',
    complete: false,
  },
  {
    num: 7,
    title: 'Peep Sight Alignment',
    category: 'Sight System',
    desc: 'Align peep at full draw so it frames the housing naturally.',
    complete: false,
  },
  {
    num: 8,
    title: 'Sight & Pin Setup',
    category: 'Sight System',
    desc: 'Mount sight, level housing, set initial pin gap.',
    complete: false,
  },
  {
    num: 9,
    title: 'Draw Weight Setting',
    category: 'Weight & Speed',
    desc: 'Set final draw weight and record limb bolt turns for reference.',
    complete: false,
  },
  {
    num: 10,
    title: 'Arrow Spine Selection',
    category: 'Arrow Setup',
    desc: 'Verify arrow spine matches draw weight, length, and point weight.',
    complete: false,
  },
  {
    num: 11,
    title: 'Point Weight & FOC',
    category: 'Arrow Setup',
    desc: 'Weigh points and calculate front-of-center balance percentage.',
    complete: false,
  },
  {
    num: 12,
    title: 'Chronograph & Speed',
    category: 'Baseline',
    desc: 'Record arrow speed for future reference and sight calculations.',
    complete: false,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const completedCount = SETUP_STEPS.filter((s) => s.complete).length;
const pct = Math.round((completedCount / SETUP_STEPS.length) * 100);

export default function SetupScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title="Setup Phase" />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active bow context */}
        <View style={styles.bowContext}>
          <Text style={styles.bowContextLabel}>Configuring</Text>
          <Text style={styles.bowContextName}>{ACTIVE_BOW}</Text>
        </View>

        {/* Progress bar */}
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              {completedCount} of {SETUP_STEPS.length} steps complete
            </Text>
            <Text style={styles.progressPct}>{pct}%</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
          <Text style={styles.progressNote}>
            Complete all 12 steps before beginning paper tuning.
          </Text>
        </Card>

        {/* Steps */}
        <Text style={styles.sectionLabel}>12-Step Checklist</Text>

        {SETUP_STEPS.map((step) => {
          const isNext = !step.complete && step.num === completedCount + 1;
          const isLocked = !step.complete && step.num > completedCount + 1;

          return (
            <TouchableOpacity
              key={step.num}
              activeOpacity={isLocked ? 1 : 0.7}
              style={[
                styles.stepRow,
                step.complete && styles.stepRowDone,
                isNext && styles.stepRowNext,
              ]}
            >
              {/* Leading indicator */}
              <View style={styles.stepNum}>
                {step.complete ? (
                  <CheckCircle size={20} color={Colors.statusComplete} strokeWidth={1.5} />
                ) : isLocked ? (
                  <Lock size={14} color={Colors.border} strokeWidth={1.5} />
                ) : (
                  <Circle size={20} color={Colors.clayDark} strokeWidth={1.5} />
                )}
              </View>

              {/* Content */}
              <View style={styles.stepContent}>
                <Text style={styles.stepCategory}>{step.category}</Text>
                <Text style={[styles.stepTitle, step.complete && styles.stepTitleDone]}>
                  {step.title}
                </Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
              </View>

              {/* Chevron */}
              {!isLocked && (
                <ChevronRight size={16} color={Colors.greyLight} strokeWidth={1.5} />
              )}
            </TouchableOpacity>
          );
        })}
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

  progressCard: { marginBottom: Spacing.xl, gap: Spacing.sm },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressTitle: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  progressPct: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.clayMid,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.bgTertiary,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.statusComplete,
    borderRadius: Radius.full,
  },
  progressNote: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
  },

  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    marginBottom: Spacing.xs,
  },
  stepRowDone: { opacity: 0.65 },
  stepRowNext: { backgroundColor: Colors.bgSecondary },

  stepNum: {
    width: 24,
    alignItems: 'center',
    paddingTop: 2,
  },
  stepContent: { flex: 1 },
  stepCategory: {
    ...Typography.label,
    fontSize: FontSizes.xs - 1,
    color: Colors.greyLight,
    marginBottom: 2,
  },
  stepTitle: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  stepTitleDone: { color: Colors.greyMid },
  stepDesc: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
