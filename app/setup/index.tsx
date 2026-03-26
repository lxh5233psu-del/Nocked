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
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  Lock,
} from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

const SETUP_STEPS = [
  { num: 1, title: 'Safety Check & Initial Inspection', route: '/setup/step-1' },
  { num: 2, title: 'Brace Height & Axle-to-Axle', route: '/setup/step-2' },
  { num: 3, title: 'Rest Installation & Rough Position', route: '/setup/step-3' },
  { num: 4, title: 'Nocking Point / D-Loop', route: '/setup/step-4' },
  { num: 5, title: 'Centershot / Rest Position', route: '/setup/step-5' },
  { num: 6, title: 'Draw Weight', route: '/setup/step-6' },
  { num: 7, title: 'Coarse Draw Length Adjustment', route: null },
  { num: 8, title: 'Sight Installation & Axis Setup', route: null },
  { num: 9, title: 'Peep Sight Alignment', route: null },
  { num: 10, title: 'Drop-Away Rest Timing', route: null },
  { num: 11, title: 'Stabilizer Installation', route: null },
  { num: 12, title: 'First Axis Adjustment', route: null },
];

export default function SetupHubScreen() {
  const bowProfiles = useAppStore((s) => s.bowProfiles);
  const activeBowId = useAppStore((s) => s.activeBowId);
  const activeBow = bowProfiles.find((b) => b.id === activeBowId);

  const completedSteps = activeBow?.setupStepsComplete ?? [];

  const getNextStep = (): number => {
    for (let i = 1; i <= 12; i++) {
      if (!completedSteps.includes(i)) return i;
    }
    return 12;
  };

  const nextStep = getNextStep();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setup Phase</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Active bow context */}
        {activeBow && (
          <View style={styles.bowContext}>
            <Text style={styles.bowLabel}>Setting up</Text>
            <Text style={styles.bowName}>{activeBow.nickname}</Text>
          </View>
        )}

        {!activeBow && (
          <View style={styles.noBow}>
            <Text style={styles.noBowText}>
              No bow profile selected. Add a bow profile to begin setup.
            </Text>
          </View>
        )}

        {/* Progress summary */}
        <View style={styles.progressSummary}>
          <Text style={styles.progressText}>
            {completedSteps.length} of 12 steps complete
          </Text>
        </View>

        {/* Step list */}
        {SETUP_STEPS.map((step) => {
          const isComplete = completedSteps.includes(step.num);
          const isNext = step.num === nextStep;
          const isLocked = step.route === null;
          const isAccessible = step.route !== null;

          return (
            <TouchableOpacity
              key={step.num}
              onPress={() => {
                if (isAccessible && activeBow) {
                  router.push(step.route as any);
                }
              }}
              disabled={!isAccessible || !activeBow}
              activeOpacity={0.7}
              style={[
                styles.stepRow,
                isNext && styles.stepRowNext,
                isComplete && styles.stepRowComplete,
              ]}
            >
              <View style={styles.stepLeading}>
                {isComplete ? (
                  <CheckCircle size={20} color={Colors.statusComplete} strokeWidth={1.5} />
                ) : isLocked ? (
                  <Lock size={16} color={Colors.greyLight} strokeWidth={1.5} />
                ) : (
                  <Circle size={20} color={isNext ? Colors.clayDark : Colors.border} strokeWidth={1.5} />
                )}
              </View>

              <View style={styles.stepContent}>
                <Text style={styles.stepNumber}>Step {step.num}</Text>
                <Text
                  style={[
                    styles.stepTitle,
                    isComplete && styles.stepTitleComplete,
                    isLocked && styles.stepTitleLocked,
                  ]}
                >
                  {step.title}
                </Text>
                {isLocked && (
                  <Text style={styles.stepLocked}>Sprint 3</Text>
                )}
              </View>

              {isAccessible && activeBow && (
                <ChevronRight size={16} color={Colors.greyLight} strokeWidth={1.5} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  bowContext: {
    marginBottom: Spacing.lg,
  },
  bowLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  bowName: {
    ...Typography.displayBold,
    fontSize: FontSizes.xl,
    color: Colors.textPrimary,
  },
  noBow: {
    padding: Spacing.lg,
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
  },
  noBowText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    textAlign: 'center',
  },
  progressSummary: {
    marginBottom: Spacing.lg,
  },
  progressText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: Spacing.xs,
  },
  stepRowNext: {
    backgroundColor: Colors.bgSecondary,
  },
  stepRowComplete: {
    opacity: 0.7,
  },
  stepLeading: {
    width: 24,
    alignItems: 'center',
  },
  stepContent: {
    flex: 1,
  },
  stepNumber: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyLight,
    marginBottom: 1,
  },
  stepTitle: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  stepTitleComplete: {
    color: Colors.greyMid,
  },
  stepTitleLocked: {
    color: Colors.greyLight,
  },
  stepLocked: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyLight,
    marginTop: 2,
  },
});
