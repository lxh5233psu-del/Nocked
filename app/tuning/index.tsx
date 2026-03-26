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
} from 'lucide-react-native';
import { useAppStore } from '@/store/useAppStore';
import { AnimatedEntry } from '@/components/ui/AnimatedEntry';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

const TUNING_METHODS = [
  {
    key: 'sight-in',
    title: 'Initial Sight-In',
    description: '20-yard zero — establish a baseline before tuning',
    route: '/tuning/sight-in',
  },
  {
    key: 'paper',
    title: 'Paper Tuning',
    description: 'Diagnose arrow flight through paper tears at close range',
    route: '/tuning/paper',
  },
  {
    key: 'walk-back',
    title: 'Walk-Back Tuning',
    description: 'Verify centershot alignment using vertical reference at distance',
    route: '/tuning/walk-back',
  },
  {
    key: 'bare-shaft',
    title: 'Bare Shaft Tuning',
    description: 'Compare fletched vs bare shaft impacts to fine-tune spine and rest',
    route: '/tuning/bare-shaft',
  },
  {
    key: 'french',
    title: 'French Tuning',
    description: 'Group-walk method — confirm tune consistency across distances',
    route: '/tuning/french',
  },
  {
    key: 'group',
    title: 'Group Tuning',
    description: 'Micro-adjustments based on group impact at competition distance',
    route: '/tuning/group',
  },
];

export default function TuningHubScreen() {
  const bowProfiles = useAppStore((s) => s.bowProfiles);
  const activeBowId = useAppStore((s) => s.activeBowId);
  const activeBow = bowProfiles.find((b) => b.id === activeBowId);

  const completedModules = activeBow?.tuningModulesComplete ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <ChevronLeft size={22} color={Colors.clayMid} strokeWidth={1.5} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tuning Phase</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AnimatedEntry delay={60}>
        {/* Active bow context */}
        {activeBow && (
          <View style={styles.bowContext}>
            <Text style={styles.bowLabel}>Tuning</Text>
            <Text style={styles.bowName}>{activeBow.nickname}</Text>
          </View>
        )}

        {!activeBow && (
          <View style={styles.noBow}>
            <Text style={styles.noBowText}>
              No bow profile selected. Add a bow profile to begin tuning.
            </Text>
          </View>
        )}

        {/* Setup prerequisite */}
        {activeBow && !activeBow.setupComplete && (
          <View style={styles.prereqBanner}>
            <Text style={styles.prereqTitle}>Setup Recommended First</Text>
            <Text style={styles.prereqText}>
              Complete the 12-step setup phase before tuning for best results.
              You can still proceed, but your baseline may not be optimal.
            </Text>
          </View>
        )}

        {/* Progress summary */}
        <View style={styles.progressSummary}>
          <Text style={styles.progressText}>
            {completedModules.length} of {TUNING_METHODS.length} methods complete
          </Text>
        </View>

        <Text style={styles.description}>
          Work through each tuning method in order. Each builds on the previous —
          start with sight-in, then paper tune, and progress through to group tuning.
        </Text>

        {/* Method list */}
        {TUNING_METHODS.map((method, index) => {
          const isComplete = completedModules.includes(method.key);
          const isNext =
            !isComplete &&
            (index === 0 || completedModules.includes(TUNING_METHODS[index - 1].key));

          return (
            <TouchableOpacity
              key={method.key}
              onPress={() => {
                if (activeBow) {
                  router.push(method.route as any);
                }
              }}
              disabled={!activeBow}
              activeOpacity={0.7}
              style={[
                styles.methodRow,
                isNext && styles.methodRowNext,
                isComplete && styles.methodRowComplete,
              ]}
            >
              <View style={styles.methodLeading}>
                {isComplete ? (
                  <CheckCircle size={20} color={Colors.statusComplete} strokeWidth={1.5} />
                ) : (
                  <Circle
                    size={20}
                    color={isNext ? Colors.clayDark : Colors.border}
                    strokeWidth={1.5}
                  />
                )}
              </View>

              <View style={styles.methodContent}>
                <Text
                  style={[
                    styles.methodTitle,
                    isComplete && styles.methodTitleComplete,
                  ]}
                >
                  {method.title}
                </Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>

              {activeBow && (
                <ChevronRight size={16} color={Colors.greyLight} strokeWidth={1.5} />
              )}
            </TouchableOpacity>
          );
        })}
        </AnimatedEntry>
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
  prereqBanner: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.statusWarning,
  },
  prereqTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.statusWarning,
    marginBottom: Spacing.xs,
  },
  prereqText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  progressSummary: {
    marginBottom: Spacing.sm,
  },
  progressText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
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
  methodRowNext: {
    backgroundColor: Colors.bgSecondary,
  },
  methodRowComplete: {
    opacity: 0.7,
  },
  methodLeading: {
    width: 24,
    alignItems: 'center',
  },
  methodContent: {
    flex: 1,
  },
  methodTitle: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  methodTitleComplete: {
    color: Colors.greyMid,
  },
  methodDescription: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginTop: 2,
  },
});
