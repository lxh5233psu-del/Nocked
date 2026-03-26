import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SetupStepLayout } from '@/components/setup/SetupStepLayout';
import { ToolCheck } from '@/components/setup/ToolCheck';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { SelectOption } from '@/components/ui/SelectOption';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { NockingPointOption } from '@/types';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

const NOCKING_OPTIONS: { label: string; value: NockingPointOption; description: string }[] = [
  {
    label: 'D-Loop + Nail Knots Above & Below',
    value: 'dloop-both',
    description: 'Most secure. Upper knot = 4 wraps, lower knot = 6-8 wraps. Prevents nock migration.',
  },
  {
    label: 'D-Loop + Nail Knot Below Only',
    value: 'dloop-below',
    description: 'Common setup. Lower knot = 6-8 wraps. D-loop tension holds nock from above.',
  },
  {
    label: 'D-Loop Only',
    value: 'dloop-only',
    description: 'Simplest. No nail knots — D-loop wraps define nock position. Quickest to adjust.',
  },
];

// ─── Tying instructions per option ──────────────────────────────────────────

const TYING_INSTRUCTIONS: Record<NockingPointOption, { title: string; description: string }[]> = {
  'dloop-both': [
    {
      title: 'Level the Bow',
      description: 'Place bow in vice. Verify string is perfectly plumb in both lateral and fore/aft planes using a string level.',
    },
    {
      title: 'Mark Nocking Point',
      description: 'With an arrow nocked and resting on the rest, mark the string at the top and bottom of the arrow nock. The arrow should be level or the nock end very slightly high (1/16").',
    },
    {
      title: 'Tie Lower Nail Knot (6-8 wraps)',
      description: 'Using serving thread, tie a nail knot just below the lower nock mark. Wrap 6-8 times around the string and the tag end. Pull tight. This is the primary nock stop.',
    },
    {
      title: 'Tie Upper Nail Knot (4 wraps)',
      description: 'Tie a second nail knot just above the upper nock mark. Wrap 4 times. This prevents upward nock migration under draw pressure.',
    },
    {
      title: 'Trim and Melt',
      description: 'Trim tag ends close with a razor blade. Carefully melt the ends with a lighter to prevent unraveling. Do not melt the bowstring itself.',
    },
    {
      title: 'Install D-Loop',
      description: 'Cut approximately 4.5" of D-loop material. Tie the lower leg around the string just below the lower nail knot. Tie the upper leg just above the upper nail knot. Burn both ends to form a ball that locks the loop.',
    },
    {
      title: 'Set D-Loop Length',
      description: 'The D-loop should form a consistent arc. Too short restricts release engagement; too long adds to draw length. Test with your release for proper engagement.',
    },
  ],
  'dloop-below': [
    {
      title: 'Level the Bow',
      description: 'Place bow in vice. Verify string is perfectly plumb using a string level.',
    },
    {
      title: 'Mark Nocking Point',
      description: 'With an arrow nocked and resting on the rest, mark the string at the bottom of the arrow nock. Arrow should be level or nock end very slightly high (1/16").',
    },
    {
      title: 'Tie Lower Nail Knot (6-8 wraps)',
      description: 'Tie a nail knot just below the lower nock mark. Wrap 6-8 times. Pull tight. This establishes the bottom nock stop.',
    },
    {
      title: 'Trim and Melt',
      description: 'Trim tag ends close with a razor blade. Carefully melt ends with a lighter.',
    },
    {
      title: 'Install D-Loop',
      description: 'Cut approximately 4.5" of D-loop material. Tie the lower leg around the string just below the nail knot. Tie the upper leg above the nock position — the D-loop tension holds the nock from above.',
    },
    {
      title: 'Set D-Loop Length',
      description: 'Form a consistent arc. Test release engagement. Adjust length if needed.',
    },
  ],
  'dloop-only': [
    {
      title: 'Level the Bow',
      description: 'Place bow in vice. Verify string is perfectly plumb using a string level.',
    },
    {
      title: 'Mark Nocking Point',
      description: 'With an arrow nocked and resting on the rest, mark the string where the D-loop legs will wrap. Arrow should be level or nock end very slightly high (1/16").',
    },
    {
      title: 'Install D-Loop',
      description: 'Cut approximately 4.5" of D-loop material. Tie the lower leg around the string at the lower mark. Tie the upper leg at the upper mark. The wraps of the D-loop legs act as the nock stops.',
    },
    {
      title: 'Burn Ends',
      description: 'Burn both tag ends to form a ball that prevents the loop from unraveling. The balls also help lock the loop position on the string.',
    },
    {
      title: 'Verify Nock Fit',
      description: 'Nock an arrow and verify it clicks securely between the D-loop legs. The arrow should hang on the string without falling but release cleanly when the nock is pressed.',
    },
    {
      title: 'Set D-Loop Length',
      description: 'Form a consistent arc. Test release engagement.',
    },
  ],
};

export default function Step4Screen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const markSetupStepComplete = useAppStore((s) => s.markSetupStepComplete);
  const updateSetupData = useAppStore((s) => s.updateSetupData);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const [selectedOption, setSelectedOption] = useState<NockingPointOption | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const instructions = selectedOption ? TYING_INSTRUCTIONS[selectedOption] : [];
  const allChecked = selectedOption !== null && checkedSteps.size === instructions.length;

  const handleCheck = (index: number, checked: boolean) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (checked) next.add(index); else next.delete(index);
      return next;
    });
  };

  const handleOptionChange = (option: NockingPointOption) => {
    setSelectedOption(option);
    setCheckedSteps(new Set()); // reset checks when switching option
  };

  const handleComplete = () => {
    if (!activeBowId || !selectedOption) return;

    updateSetupData(activeBowId, {
      nockingPointOption: selectedOption,
      dloopInstalled: true,
    });
    markSetupStepComplete(activeBowId, 4);
    setLastSession({ module: 'Setup', step: 'Step 4: Nocking Point / D-Loop', timestamp: Date.now() });
    router.push('/setup/step-5');
  };

  return (
    <SetupStepLayout
      stepNumber={4}
      totalSteps={12}
      title="Nocking Point / D-Loop"
      subtitle="Establish the arrow's vertical position on the string. Choose your nocking point method and follow the tying sequence."
      onComplete={handleComplete}
      canComplete={allChecked}
    >
      <ToolCheck
        required={['Nocking pliers', 'String level', 'Arrow level', 'Serving thread', 'Lighter', 'Razor blade']}
        optional={['Bow square', 'Bow vice']}
      />

      {/* Nocking point option selection */}
      <Text style={styles.sectionLabel}>Choose Your Method</Text>
      <View style={styles.options}>
        {NOCKING_OPTIONS.map((opt) => (
          <SelectOption
            key={opt.value}
            label={opt.label}
            selected={selectedOption === opt.value}
            onPress={() => handleOptionChange(opt.value)}
          />
        ))}
      </View>

      {/* Description of selected option */}
      {selectedOption && (
        <Card variant="outlined" style={styles.infoCard}>
          <Text style={styles.infoText}>
            {NOCKING_OPTIONS.find((o) => o.value === selectedOption)?.description}
          </Text>
        </Card>
      )}

      {/* Tying instructions */}
      {selectedOption && (
        <>
          <Text style={styles.sectionLabel}>Tying Sequence</Text>
          {instructions.map((step, i) => (
            <InstructionStep
              key={`${selectedOption}-${i}`}
              number={i + 1}
              title={step.title}
              description={step.description}
              checkable
              onCheckedChange={(checked) => handleCheck(i, checked)}
            />
          ))}
        </>
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
  options: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  infoCard: {
    marginBottom: Spacing.md,
  },
  infoText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
