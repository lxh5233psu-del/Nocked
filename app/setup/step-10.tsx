import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SetupStepLayout } from '@/components/setup/SetupStepLayout';
import { ToolCheck } from '@/components/setup/ToolCheck';
import { SafetyWarning } from '@/components/setup/SafetyWarning';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

export default function Step10Screen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const activeBow = useAppStore((s) => s.bowProfiles.find((b) => b.id === activeBowId));
  const markSetupStepComplete = useAppStore((s) => s.markSetupStepComplete);
  const updateSetupData = useAppStore((s) => s.updateSetupData);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const restType = activeBow?.restType;
  const isDropAway = restType === 'Drop-away (cable)' || restType === 'Drop-away (limb)';
  const isCableDriven = restType === 'Drop-away (cable)';

  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const handleCheck = (index: number, checked: boolean) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (checked) next.add(index); else next.delete(index);
      return next;
    });
  };

  // Non-drop-away users skip this step
  const handleSkip = () => {
    if (!activeBowId) return;
    markSetupStepComplete(activeBowId, 10);
    setLastSession({ module: 'Setup', step: 'Step 10: Rest Timing (skipped)', timestamp: Date.now() });
    router.push('/setup/step-11');
  };

  const allChecked = checkedSteps.size === 5;

  const handleComplete = () => {
    if (!activeBowId) return;
    updateSetupData(activeBowId, { restTimingVerified: true });
    markSetupStepComplete(activeBowId, 10);
    setLastSession({ module: 'Setup', step: 'Step 10: Rest Timing', timestamp: Date.now() });
    router.push('/setup/step-11');
  };

  // If not a drop-away, show skip message
  if (!isDropAway) {
    return (
      <SetupStepLayout
        stepNumber={10}
        totalSteps={12}
        title="Drop-Away Rest Timing"
        subtitle="This step applies to drop-away rests only."
        onComplete={handleSkip}
        completeLabel="Skip — Continue to Step 11"
      >
        <Card style={styles.skipCard}>
          <Text style={styles.skipTitle}>Not Applicable</Text>
          <Text style={styles.skipText}>
            Your rest type ({restType}) does not require timing adjustment.
            This step is for drop-away rests (cable-driven and limb-driven) only.
          </Text>
        </Card>
      </SetupStepLayout>
    );
  }

  return (
    <SetupStepLayout
      stepNumber={10}
      totalSteps={12}
      title="Drop-Away Rest Timing"
      subtitle={`Set the timing for your ${isCableDriven ? 'cable-driven' : 'limb-driven'} drop-away rest. The rest must rise and fall at the correct points in the draw cycle.`}
      onComplete={handleComplete}
      canComplete={allChecked}
    >
      <ToolCheck required={['Allen wrench set']} />

      <SafetyWarning message="Never draw without an arrow nocked." />

      {/* Timing concept */}
      <Card style={styles.conceptCard}>
        <Text style={styles.conceptTitle}>Correct Timing</Text>
        <Text style={styles.conceptText}>
          The rest must rise to FULL HEIGHT slightly BEFORE you reach full draw. This ensures
          the arrow is fully supported during the hold and release. The rest must fall completely
          BEFORE the fletching passes through — otherwise the fletching will contact the
          launcher and cause erratic arrow flight.
        </Text>
      </Card>

      <Text style={styles.sectionLabel}>Procedure</Text>

      <InstructionStep
        number={1}
        title={isCableDriven ? 'Attach Cord to Down Cable' : 'Attach Cord to Lower Limb'}
        description={
          isCableDriven
            ? 'Secure the rest cord to the down cable at the attachment point. The cord was routed loosely in Step 3 — now set the connection firmly.'
            : 'Secure the rest cord to the lower limb at the manufacturer-specified attachment point. The cord was routed loosely in Step 3 — now set the connection firmly.'
        }
        checkable
        onCheckedChange={(c) => handleCheck(0, c)}
      />
      <InstructionStep
        number={2}
        title="Draw Slowly — Observe Rest Rise"
        description="Nock an arrow and draw the bow very slowly. Watch the rest launcher carefully. It should begin to rise as you approach full draw and reach full height SLIGHTLY BEFORE you hit the draw stops."
        checkable
        onCheckedChange={(c) => handleCheck(1, c)}
      />
      <InstructionStep
        number={3}
        title="Verify Rest Falls Completely"
        description="Release the draw slowly (let down). Observe that the rest falls completely to the down position well before the arrow would pass. At full speed, the rest must clear the fletching path."
        note="Slow-motion video is STRONGLY recommended to verify timing at draw speed."
        checkable
        onCheckedChange={(c) => handleCheck(2, c)}
      />
      <InstructionStep
        number={4}
        title="Adjust Cord Length"
        description="If timing is off, adjust the cord length. The cord length is the primary timing control."
        checkable
        onCheckedChange={(c) => handleCheck(3, c)}
      />
      <InstructionStep
        number={5}
        title="Confirm Final Timing"
        description="After adjustment, draw slowly again and verify correct timing. The rest should reach full height just before the wall and fall completely before fletching contact. Repeat until confident."
        checkable
        onCheckedChange={(c) => handleCheck(4, c)}
      />

      {/* Troubleshooting */}
      <Card variant="outlined" style={styles.troubleCard}>
        <Text style={styles.troubleTitle}>Troubleshooting</Text>
        <Text style={styles.troubleText}>
          <Text style={styles.bold}>Cord too long:</Text> Rest rises too late — arrow
          not fully supported at full draw.{'\n\n'}
          <Text style={styles.bold}>Cord too short:</Text> Rest doesn't fall soon enough
          — fletching contacts the launcher on release.{'\n\n'}
          Make small adjustments. Re-verify with slow-motion video if possible.
        </Text>
      </Card>
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
  skipCard: {
    marginBottom: Spacing.lg,
  },
  skipTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginBottom: Spacing.sm,
  },
  skipText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
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
  troubleCard: {
    marginTop: Spacing.md,
  },
  troubleTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginBottom: Spacing.sm,
  },
  troubleText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bold: {
    fontFamily: 'Raleway_400Regular',
  },
});
