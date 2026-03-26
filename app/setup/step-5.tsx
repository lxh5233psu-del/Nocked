import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SetupStepLayout } from '@/components/setup/SetupStepLayout';
import { ToolCheck } from '@/components/setup/ToolCheck';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

const CENTERSHOT_STEPS = [
  {
    title: 'Level the Bow in Vice',
    description:
      'Place the bow in the vice. Using a string level, verify the bowstring is perfectly plumb (vertical). Check both lateral and fore/aft planes — the string must hang true in both.',
  },
  {
    title: 'Nock an Arrow',
    description:
      'Nock an arrow on the string and rest it on the rest. The arrow should sit in the rest launcher securely.',
  },
  {
    title: 'View from Nock End',
    description:
      'Look from the nock end of the arrow toward the riser. Position yourself directly behind the bowstring, looking down the arrow shaft toward the bow.',
  },
  {
    title: 'Align Arrow Through Berger Hole',
    description:
      'The arrow shaft should pass directly through the center of the Berger hole (the rest mounting hole in the riser). At a 90-degree angle to the string, the arrow should bisect the Berger hole evenly.',
    note: 'This is the foundation of all horizontal tuning. Getting this right now preserves rest adjustability for later tuning.',
  },
  {
    title: 'Adjust Rest Left/Right',
    description:
      'If the arrow is not centered through the Berger hole, adjust the rest position left or right using the rest\'s horizontal adjustment screws (NOT the mounting bracket). Make small adjustments and recheck from the nock end after each.',
  },
  {
    title: 'Verify Arrow is Level Through Rest',
    description:
      'With the arrow still nocked, use an arrow level to verify the arrow shaft is not tilted left or right through the rest. The arrow should sit perfectly level in the launcher.',
  },
  {
    title: 'Lock Down Rest Adjustment Screws',
    description:
      'Once centered, tighten the rest\'s horizontal and vertical adjustment screws. Do NOT tighten the mounting bracket — only the rest adjustment screws.',
    warning: 'Do not move the bracket. The bracket position was set in Step 3 and stays locked unless you enter Advanced Tuning (Torque Tuning).',
  },
  {
    title: 'Recheck Levels After Tightening',
    description:
      'After tightening, recheck that the arrow still passes through the center of the Berger hole and sits level. Tightening screws can shift the rest position slightly.',
  },
];

export default function Step5Screen() {
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

  const allChecked = checkedSteps.size === CENTERSHOT_STEPS.length;

  const handleComplete = () => {
    if (!activeBowId) return;

    updateSetupData(activeBowId, { centershortVerified: true });
    markSetupStepComplete(activeBowId, 5);
    setLastSession({ module: 'Setup', step: 'Step 5: Centershot', timestamp: Date.now() });
    router.push('/setup/step-6');
  };

  return (
    <SetupStepLayout
      stepNumber={5}
      totalSteps={12}
      title="Centershot / Rest Position"
      subtitle="Set the arrow's horizontal alignment through the center of the Berger hole. This is the foundation of all horizontal tuning."
      onComplete={handleComplete}
      canComplete={allChecked}
    >
      <ToolCheck
        required={['String level', 'Arrow level', 'Bow vice']}
        optional={['Bow square']}
      />

      {/* Key concept card */}
      <Card style={styles.conceptCard}>
        <Text style={styles.conceptTitle}>Why This Matters</Text>
        <Text style={styles.conceptText}>
          Centershot establishes the arrow's horizontal starting position relative to the riser.
          Every horizontal tuning method (walk-back, bare shaft, broadhead) builds on this
          reference. Getting a true centershot now maximizes your rest's adjustability for
          fine-tuning later.
        </Text>
      </Card>

      {/* Instructions */}
      <Text style={styles.sectionLabel}>Procedure</Text>
      {CENTERSHOT_STEPS.map((step, i) => (
        <InstructionStep
          key={i}
          number={i + 1}
          title={step.title}
          description={step.description}
          warning={step.warning}
          note={step.note}
          checkable
          onCheckedChange={(checked) => handleCheck(i, checked)}
        />
      ))}
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
