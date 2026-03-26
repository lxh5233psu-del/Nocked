import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { TuningStepLayout } from '@/components/tuning/TuningStepLayout';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { ToolCheck } from '@/components/setup/ToolCheck';
import { DiagnosisTable } from '@/components/setup/DiagnosisTable';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

export default function SightInScreen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const markTuningModuleComplete = useAppStore((s) => s.markTuningModuleComplete);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const handleComplete = () => {
    if (activeBowId) {
      markTuningModuleComplete(activeBowId, 'sight-in');
      setLastSession({ module: 'Tune', step: 'Sight-In', timestamp: Date.now() });
    }
    router.back();
  };

  return (
    <TuningStepLayout
      title="Initial Sight-In"
      subtitle="Establish a 20-yard zero. This gives you a consistent point of aim before any tuning adjustments begin. Without a sight-in, you cannot diagnose tuning issues."
      prerequisite="Setup phase complete. Arrow properly nocked, rest timed, peep aligned."
      onComplete={handleComplete}
      completeLabel="Mark Sight-In Complete"
    >
      <ToolCheck required={['Allen wrench set']} />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Setup</Text>
        <InstructionStep
          number={1}
          title="Set Target at 20 Yards"
          description="Place a single-spot target face at exactly 20 yards. Use a rangefinder if available. 20 yards is the standard baseline distance for compound bow sight-in."
        />
        <InstructionStep
          number={2}
          title="Verify Equipment"
          description="Confirm arrow is nocked properly, rest is in the up position, D-loop is intact, and peep is rotating correctly. Shoot one arrow into a safe backstop to verify everything functions."
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Sight-In Process</Text>
        <InstructionStep
          number={3}
          title="Shoot a 3-Arrow Group"
          description="Using your best form, shoot 3 arrows at the center of the target. Focus on consistent execution — not hitting the center. Where the group lands is irrelevant; what matters is that the group is tight."
          note="If the group is larger than 3 inches at 20 yards, focus on form before adjusting the sight. A scattered group means form issues, not sight issues."
        />
        <InstructionStep
          number={4}
          title="Chase the Arrow — Move the Sight"
          description="Move your sight pin toward where the arrows hit. If arrows hit high, move the sight housing UP. If arrows hit left, move the sight pin LEFT. The pin follows the arrow."
          note="Remember: 'Chase the arrow.' The sight pin moves in the same direction as your miss."
        />
        <InstructionStep
          number={5}
          title="Shoot Another 3-Arrow Group"
          description="After adjusting, shoot another 3-arrow group. Evaluate and adjust again if needed. Repeat until your group is centered on the target at 20 yards."
        />
        <InstructionStep
          number={6}
          title="Confirm with a 5-Arrow Group"
          description="Once centered, shoot a 5-arrow confirmation group. All 5 arrows should be within a reasonable group centered on the target. This is your 20-yard zero."
        />
      </View>

      <DiagnosisTable
        title="Sight Adjustment Reference"
        rows={[
          { condition: 'Arrows hit HIGH', result: 'Sight too low', action: 'Move sight housing UP' },
          { condition: 'Arrows hit LOW', result: 'Sight too high', action: 'Move sight housing DOWN' },
          { condition: 'Arrows hit LEFT', result: 'Pin too far right', action: 'Move pin LEFT' },
          { condition: 'Arrows hit RIGHT', result: 'Pin too far left', action: 'Move pin RIGHT' },
          { condition: 'Group scattered', result: 'Form issue', action: 'Work on form before adjusting sight' },
        ]}
      />

      <View style={styles.tipCard}>
        <Text style={styles.tipLabel}>Pro Tip</Text>
        <Text style={styles.tipText}>
          Make large adjustments first, then fine-tune. If you're more than 6 inches off at 20 yards,
          make a significant sight move. As you get closer, make smaller adjustments. Always shoot
          groups — never adjust based on a single arrow.
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
