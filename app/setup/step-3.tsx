import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SetupStepLayout } from '@/components/setup/SetupStepLayout';
import { ToolCheck } from '@/components/setup/ToolCheck';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

export default function Step3Screen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const activeBow = useAppStore((s) => s.bowProfiles.find((b) => b.id === activeBowId));
  const markSetupStepComplete = useAppStore((s) => s.markSetupStepComplete);
  const updateSetupData = useAppStore((s) => s.updateSetupData);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const restType = activeBow?.restType;
  const isDropAwayCable = restType === 'Drop-away (cable)';
  const isDropAwayLimb = restType === 'Drop-away (limb)';
  const isFullCapture = restType === 'Full capture';
  const isShootThrough = restType === 'Shoot-through';
  const isDropAway = isDropAwayCable || isDropAwayLimb;

  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const handleCheck = (index: number, checked: boolean) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (checked) next.add(index); else next.delete(index);
      return next;
    });
  };

  // Universal steps (all rest types)
  const universalSteps = [
    {
      title: 'Clean the Riser',
      description:
        'Clean the Berger hole area and riser mounting surface. Remove any debris, old thread locker, or residue.',
    },
    {
      title: 'Mount Rest to Berger Hole',
      description:
        'Thread the rest mounting bolt into the Berger hole. Standard bolt size is 1/4" Allen. Ensure the rest bracket is perpendicular to the riser vertical axis.',
      note: 'The bracket establishes the rest\'s base position. It will only move again during torque tuning (advanced).',
    },
    {
      title: 'Tighten Bracket Fully',
      description:
        'Tighten the mounting bolt firmly — the bracket must not rotate or wobble. Consider thread locker on the bolt if the rest includes it.',
    },
  ];

  // Type-specific steps
  const typeSpecificSteps = isDropAwayCable
    ? [
        {
          title: 'Identify the Down Cable',
          description:
            'Locate the cable that runs from the top cam to the bottom cam on the side AWAY from the arrow shelf. This is the down cable — the rest cord attaches here.',
        },
        {
          title: 'Route Cord Loosely',
          description:
            'Attach the rest cord to the down cable loosely — do not set final timing yet. Leave slack. Rest should be in the DOWN position for now.',
          note: 'Final timing is set in Step 10 (Drop-Away Rest Timing).',
        },
      ]
    : isDropAwayLimb
    ? [
        {
          title: 'Identify the Lower Limb',
          description:
            'The rest cord attaches to the lower limb (bottom limb). Locate the limb bolt end or the manufacturer-specified cord attachment point on the limb.',
        },
        {
          title: 'Route Cord Loosely',
          description:
            'Attach the rest cord to the lower limb loosely. Leave slack — rest should be in the DOWN position for now.',
          note: 'Final timing is set in Step 10 (Drop-Away Rest Timing).',
        },
      ]
    : isFullCapture
    ? [
        {
          title: 'Verify Arrow Retention',
          description:
            'With the rest mounted, verify the capture arm holds the arrow securely. The arrow should not fall off the rest when the bow is tilted or moved.',
        },
        {
          title: 'Check Arm Movement',
          description:
            'Verify the capture arm moves freely — no binding or sticking. The arm should return to the capture position smoothly after being depressed.',
        },
      ]
    : [
        {
          title: 'Verify Prong Spacing',
          description:
            'Check that the prong spacing matches your arrow shaft diameter. The arrow should sit between the prongs with light contact — not too tight, not too loose.',
        },
        {
          title: 'Check Prong Alignment',
          description:
            'Verify both prongs are at equal height and the arrow sits level between them. Adjust prong height if needed.',
        },
      ];

  const allSteps = [...universalSteps, ...typeSpecificSteps];
  const totalChecks = allSteps.length;
  const allChecked = checkedSteps.size === totalChecks;

  const handleComplete = () => {
    if (!activeBowId) return;

    updateSetupData(activeBowId, { restInstalled: true });
    markSetupStepComplete(activeBowId, 3);
    setLastSession({ module: 'Setup', step: 'Step 3: Rest Installation', timestamp: Date.now() });
    router.push('/setup/step-4');
  };

  return (
    <SetupStepLayout
      stepNumber={3}
      totalSteps={12}
      title="Rest Installation"
      subtitle="Mount the rest to the riser and establish rough position. Type-specific instructions based on your rest."
      onComplete={handleComplete}
      canComplete={allChecked}
    >
      <ToolCheck required={['Allen wrench set']} />

      {/* Rest type context */}
      <Card style={styles.contextCard}>
        <Text style={styles.contextLabel}>Your Rest Type</Text>
        <Text style={styles.contextValue}>{restType ?? 'Not specified'}</Text>
        {activeBow?.restManufacturer && (
          <Text style={styles.contextDetail}>
            {activeBow.restManufacturer} {activeBow.restModel}
          </Text>
        )}
      </Card>

      {/* Universal steps */}
      <Text style={styles.sectionLabel}>Universal — All Rest Types</Text>
      {universalSteps.map((step, i) => (
        <InstructionStep
          key={`u-${i}`}
          number={i + 1}
          title={step.title}
          description={step.description}
          note={step.note}
          checkable
          onCheckedChange={(checked) => handleCheck(i, checked)}
        />
      ))}

      {/* Type-specific steps */}
      <Text style={styles.sectionLabel}>
        {isDropAwayCable
          ? 'Drop-Away (Cable Driven)'
          : isDropAwayLimb
          ? 'Drop-Away (Limb Driven)'
          : isFullCapture
          ? 'Full Capture'
          : 'Shoot-Through'}
      </Text>
      {typeSpecificSteps.map((step, i) => (
        <InstructionStep
          key={`t-${i}`}
          number={universalSteps.length + i + 1}
          title={step.title}
          description={step.description}
          note={step.note}
          checkable
          onCheckedChange={(checked) => handleCheck(universalSteps.length + i, checked)}
        />
      ))}

      {/* Drop-away timing reminder */}
      {isDropAway && (
        <Card variant="outlined" style={styles.reminderCard}>
          <Text style={styles.reminderText}>
            Rest cord timing (cord length and rest rise/fall position) will be dialed in during
            Step 10 after the nocking point, centershot, and draw weight are established.
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
    marginTop: Spacing.md,
  },
  contextCard: {
    marginBottom: Spacing.lg,
  },
  contextLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: 2,
  },
  contextValue: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  contextDetail: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  reminderCard: {
    marginTop: Spacing.md,
  },
  reminderText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
