import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { TuningStepLayout } from '@/components/tuning/TuningStepLayout';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { DiagnosisTable } from '@/components/setup/DiagnosisTable';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

export default function FrenchTuneScreen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const markTuningModuleComplete = useAppStore((s) => s.markTuningModuleComplete);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const handleComplete = () => {
    if (activeBowId) {
      markTuningModuleComplete(activeBowId, 'french');
      setLastSession({ module: 'Tune', step: 'French Tuning', timestamp: Date.now() });
    }
    router.back();
  };

  return (
    <TuningStepLayout
      title="French Tuning"
      subtitle="French tuning (group-walk method) confirms your tune is consistent across multiple distances. Shoot groups at 20, 30, 40, and 50 yards — if they all center on the same vertical line, your tune is confirmed."
      prerequisite="Paper, walk-back, and bare shaft tuning complete."
      onComplete={handleComplete}
      completeLabel="Mark French Tune Complete"
    >
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Concept</Text>
        <View style={styles.conceptCard}>
          <Text style={styles.conceptText}>
            French tuning is a validation method, not a diagnostic one. You're confirming that your
            tune holds across distance. If previous tuning steps were done correctly, French tuning
            should pass on the first attempt.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Setup</Text>
        <InstructionStep
          number={1}
          title="Sight In at Multiple Distances"
          description="Before French tuning, ensure your sight is set for 20, 30, 40, and 50 yards. Each pin should be zeroed for its respective distance. If using a single-pin sight, set the tape for each distance."
        />
        <InstructionStep
          number={2}
          title="Use a Large Target Face"
          description="Use a target face large enough to contain groups at all distances. A standard 3-spot or large single-spot works well. Place it at 50 yards (your farthest distance)."
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Shooting Process</Text>
        <InstructionStep
          number={3}
          title="Shoot 3-Arrow Group at 20 Yards"
          description="Using your 20-yard pin, shoot a 3-arrow group at the target center. Note the group location — it should be centered if you're sighted in correctly."
        />
        <InstructionStep
          number={4}
          title="Shoot 3-Arrow Group at 30 Yards"
          description="Move to 30 yards. Using your 30-yard pin, shoot a 3-arrow group at the same aiming point. The group should land at the same horizontal position as the 20-yard group."
        />
        <InstructionStep
          number={5}
          title="Repeat at 40 and 50 Yards"
          description="Continue to 40 and 50 yards, using the appropriate pin for each distance. Shoot 3-arrow groups at each distance."
        />
        <InstructionStep
          number={6}
          title="Analyze Horizontal Alignment"
          description="All groups at all distances should be centered on the same vertical line. The groups may vary in height (pin calibration), but the horizontal center should be consistent."
        />
      </View>

      <DiagnosisTable
        title="French Tune Results"
        rows={[
          { condition: 'All groups vertically aligned', result: 'Tune confirmed', action: 'No adjustment needed — tune is consistent across distance' },
          { condition: 'Groups drift LEFT at distance', result: 'Rest slightly right', action: 'Move rest LEFT 1/64 inch, re-test' },
          { condition: 'Groups drift RIGHT at distance', result: 'Rest slightly left', action: 'Move rest RIGHT 1/64 inch, re-test' },
          { condition: 'Inconsistent group drift', result: 'Form variation', action: 'Focus on form consistency, re-test on a calm day' },
        ]}
      />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>After French Tuning</Text>
        <InstructionStep
          number={7}
          title="Re-Confirm Sight Zeros"
          description="If you made any rest adjustments during French tuning, re-verify all your sight pins at each distance. Even small rest moves can shift impact at longer distances."
        />
        <InstructionStep
          number={8}
          title="Document Your Settings"
          description="Record your final rest position, nocking point location, and sight marks. These are your baseline settings. If anything changes (new string, different arrows), you'll want to return to this baseline and re-tune."
        />
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipLabel}>Wind Matters</Text>
        <Text style={styles.tipText}>
          French tuning should be done on a calm day. Wind will cause horizontal group shifts that
          mask or mimic tuning issues. If you can't avoid wind, shoot French tune at shorter
          distances (20-40 yards instead of 20-50).
        </Text>
      </View>
    </TuningStepLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },
  conceptCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  conceptText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  tipCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tipLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayMid,
    marginBottom: Spacing.xs,
  },
  tipText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
