import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SetupStepLayout } from '@/components/setup/SetupStepLayout';
import { SafetyWarning } from '@/components/setup/SafetyWarning';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

export default function Step12Screen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const markSetupStepComplete = useAppStore((s) => s.markSetupStepComplete);
  const markBowSetupComplete = useAppStore((s) => s.markBowSetupComplete);
  const updateSetupData = useAppStore((s) => s.updateSetupData);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const handleCheck = (index: number, checked: boolean) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (checked) next.add(index); else next.delete(index);
      return next;
    });
  };

  const allChecked = checkedSteps.size === 7;

  const handleComplete = () => {
    if (!activeBowId) return;
    updateSetupData(activeBowId, { firstAxisSet: true });
    markSetupStepComplete(activeBowId, 12);
    markBowSetupComplete(activeBowId);
    setLastSession({ module: 'Setup', step: 'Setup Complete', timestamp: Date.now() });
    router.replace('/setup');
  };

  return (
    <SetupStepLayout
      stepNumber={12}
      totalSteps={12}
      title="First Axis Adjustment"
      subtitle="Set the first axis at full draw in your natural hold. This must be done AFTER the stabilizer is installed — balance determines natural bow position."
      onComplete={handleComplete}
      canComplete={allChecked}
      completeLabel="Complete Setup Phase"
    >
      <SafetyWarning message="Never draw without an arrow nocked. This step requires drawing to full draw multiple times." />

      {/* Key concept */}
      <Card style={styles.conceptCard}>
        <Text style={styles.conceptTitle}>Why No Vice?</Text>
        <Text style={styles.conceptText}>
          First axis must be set in your actual shooting position — not in a vice. The
          stabilizer balance you just established determines how the bow naturally sits in your
          hand at full draw. The first axis aligns the sight level to YOUR natural hold, not to
          an artificial reference.
        </Text>
      </Card>

      <Card variant="outlined" style={styles.noteCard}>
        <Text style={styles.noteText}>
          Second axis was already married to the Hamskea reference level in Step 8.
          The Hamskea level is not needed here — you're working only with the sight's
          built-in level bubble.
        </Text>
      </Card>

      <Text style={styles.sectionLabel}>Procedure</Text>

      <InstructionStep
        number={1}
        title="Nock an Arrow"
        description="Nock an arrow and prepare to draw. Ensure you're standing on level ground with proper stance."
        checkable
        onCheckedChange={(c) => handleCheck(0, c)}
      />
      <InstructionStep
        number={2}
        title="Draw with Eyes Closed"
        description="Draw to full draw anchor with your eyes closed. Settle into your natural anchor — same process as peep alignment. Let your body find its natural hold position."
        checkable
        onCheckedChange={(c) => handleCheck(1, c)}
      />
      <InstructionStep
        number={3}
        title="Relax into Natural Anchor"
        description="With eyes still closed, relax fully. Feel the bow balance in your hand. Don't grip — let the stabilizers do their job. Your bow hand, grip pressure, and hold should be completely natural."
        checkable
        onCheckedChange={(c) => handleCheck(2, c)}
      />
      <InstructionStep
        number={4}
        title="Open Eyes — Observe Level Bubble"
        description="Open your eyes and immediately observe the sight's built-in level bubble. Note which direction the bubble has drifted from center. Do NOT adjust your hold — the bubble reveals where the first axis needs to be."
        checkable
        onCheckedChange={(c) => handleCheck(3, c)}
      />
      <InstructionStep
        number={5}
        title="Let Down Safely"
        description="Let down safely. Do NOT release the string. Maintain control throughout the letdown."
        checkable
        onCheckedChange={(c) => handleCheck(4, c)}
      />
      <InstructionStep
        number={6}
        title="Adjust First Axis"
        description="Adjust the first axis on your sight in the direction needed to center the bubble. Consult your sight's owner's manual for the first axis adjustment location and method."
        note="The first axis adjustment rotates the entire sight housing around the vertical mounting axis."
        checkable
        onCheckedChange={(c) => handleCheck(5, c)}
      />
      <InstructionStep
        number={7}
        title="Repeat Until 3 Consistent Confirmations"
        description="Repeat the eyes-closed draw, relax, open eyes process. Adjust the first axis after each attempt. Continue until the bubble reads perfectly centered THREE consecutive times when you open your eyes. Three consistent confirmations = lock it down."
        checkable
        onCheckedChange={(c) => handleCheck(6, c)}
      />

      {/* Setup complete celebration card */}
      {allChecked && (
        <Card style={styles.completeCard}>
          <Text style={styles.completeTitle}>Setup Phase Complete</Text>
          <Text style={styles.completeText}>
            Your bow is now set up with a solid mechanical baseline. Every component is installed,
            measurements are recorded, and the sight is aligned.{'\n\n'}
            Next step: Head to the Tuning Phase to sight in, paper tune, and refine your setup
            through the standard tuning methods.
          </Text>
        </Card>
      )}
    </SetupStepLayout>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  conceptCard: {
    marginBottom: Spacing.md,
  },
  conceptTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.sm,
  },
  conceptText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  noteCard: {
    marginBottom: Spacing.lg,
  },
  noteText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    lineHeight: 20,
  },
  completeCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.clayDarkest,
    padding: Spacing.lg,
  },
  completeTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.bgPrimary,
    marginBottom: Spacing.sm,
  },
  completeText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.bgSecondary,
    lineHeight: 20,
  },
});
