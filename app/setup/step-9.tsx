import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SetupStepLayout } from '@/components/setup/SetupStepLayout';
import { SafetyWarning } from '@/components/setup/SafetyWarning';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

export default function Step9Screen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const markSetupStepComplete = useAppStore((s) => s.markSetupStepComplete);
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

  const allChecked = checkedSteps.size === 8;

  const handleComplete = () => {
    if (!activeBowId) return;
    updateSetupData(activeBowId, {
      peepInserted: true,
      peepTemporaryTied: true,
    });
    markSetupStepComplete(activeBowId, 9);
    setLastSession({ module: 'Setup', step: 'Step 9: Peep Sight', timestamp: Date.now() });
    router.push('/setup/step-10');
  };

  return (
    <SetupStepLayout
      stepNumber={9}
      totalSteps={12}
      title="Peep Sight — Temporary"
      subtitle="Find your natural peep position and install temporarily. Permanent serving happens after sight-in in the tuning phase."
      onComplete={handleComplete}
      canComplete={allChecked}
    >
      <SafetyWarning message="Never draw without an arrow nocked. A partner is recommended for marking the peep position." />

      <Card style={styles.conceptCard}>
        <Text style={styles.conceptTitle}>Why Temporary?</Text>
        <Text style={styles.conceptText}>
          The peep position may shift during sight-in as you refine your anchor point.
          Installing temporarily now lets you adjust freely. Permanent serving happens after
          sight-in is complete and you've confirmed the peep position at your established
          20-40 yard marks.
        </Text>
      </Card>

      <Text style={styles.sectionLabel}>Procedure</Text>

      <InstructionStep
        number={1}
        title="Draw with Eyes Closed"
        description="Nock an arrow. Draw to full draw with your eyes closed. Settle into your natural anchor — let your body find its comfortable position without trying to aim."
        checkable
        onCheckedChange={(c) => handleCheck(0, c)}
      />
      <InstructionStep
        number={2}
        title="Relax at Anchor"
        description="With eyes still closed, relax fully into your anchor. Make sure string contact is on your nose and corner of mouth. Your head should be in its natural position — do not move your head to find the string."
        checkable
        onCheckedChange={(c) => handleCheck(1, c)}
      />
      <InstructionStep
        number={3}
        title="Open Eyes — Partner Marks String"
        description="Open your eyes. Have your partner mark the spot on the string directly in front of your dominant eye. This is where the peep needs to sit for natural alignment."
        checkable
        onCheckedChange={(c) => handleCheck(2, c)}
      />
      <InstructionStep
        number={4}
        title="Repeat 3x for Consistency"
        description="Let down safely. Repeat the eyes-closed draw and marking process two more times. All three marks should be within 1/4&quot; of each other. If marks are scattered, focus on consistent anchor before proceeding."
        checkable
        onCheckedChange={(c) => handleCheck(3, c)}
      />
      <InstructionStep
        number={5}
        title="Insert Peep at Marked Location"
        description="At the center of your three marks, separate the string strands into two equal groups. Insert the peep sight between the strand groups, centering it on the mark."
        note="Equal strands on each side is critical — uneven strand distribution creates peep rotation issues."
        checkable
        onCheckedChange={(c) => handleCheck(4, c)}
      />
      <InstructionStep
        number={6}
        title="Temporary Tie"
        description="Using serving thread, wrap 4-6 times around the OUTSIDE of the peep and string together. This holds the peep in place but can be easily removed. Do NOT serve into the string yet."
        warning="Wrap around the outside only. Do not serve the peep into the string at this stage."
        checkable
        onCheckedChange={(c) => handleCheck(5, c)}
      />
      <InstructionStep
        number={7}
        title="Check Peep Rotation"
        description="Draw the bow (with arrow nocked) and check if the peep rotates to align properly with your eye. If the peep is rotated or angled, add or remove twists from the bowstring to correct the rotation."
        note="Adding twists rotates the peep one direction, removing twists rotates the other way."
        checkable
        onCheckedChange={(c) => handleCheck(6, c)}
      />
      <InstructionStep
        number={8}
        title="Recheck Brace Height & A2A"
        description="If you added or removed string twists to correct peep rotation, recheck your brace height and axle-to-axle measurements. Twists affect both."
        checkable
        onCheckedChange={(c) => handleCheck(7, c)}
      />
    </SetupStepLayout>
  );
}

const styles = StyleSheet.create({
  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  conceptCard: {
    marginBottom: Spacing.lg,
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
});
