import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SetupStepLayout } from '@/components/setup/SetupStepLayout';
import { ToolCheck } from '@/components/setup/ToolCheck';
import { SafetyWarning } from '@/components/setup/SafetyWarning';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { TextInput } from '@/components/ui/TextInput';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { getBowById } from '@/database/bow-data';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

export default function Step6Screen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const activeBow = useAppStore((s) => s.bowProfiles.find((b) => b.id === activeBowId));
  const markSetupStepComplete = useAppStore((s) => s.markSetupStepComplete);
  const updateSetupData = useAppStore((s) => s.updateSetupData);
  const updateBowProfile = useAppStore((s) => s.updateBowProfile);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const bowSpec = useMemo(() => {
    if (!activeBow) return null;
    return getBowById(activeBow.model);
  }, [activeBow]);

  const [turnsOut, setTurnsOut] = useState('');
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const turnsOutNum = parseFloat(turnsOut);
  const maxTurns = bowSpec?.limbBoltMaxTurns ?? 6;
  const lbsPerTurn = bowSpec?.limbBoltLbsPerTurn ?? 3;
  const maxWeight = bowSpec?.drawWeightMax ?? activeBow?.drawWeight ?? 70;

  // Calculate estimated draw weight
  const estimatedWeight = !isNaN(turnsOutNum)
    ? Math.round(maxWeight - turnsOutNum * lbsPerTurn)
    : null;

  const turnsExceedMax = !isNaN(turnsOutNum) && turnsOutNum > maxTurns;

  const handleCheck = (index: number, checked: boolean) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (checked) next.add(index); else next.delete(index);
      return next;
    });
  };

  const canComplete = !isNaN(turnsOutNum) && !turnsExceedMax && checkedSteps.size >= 4;

  const handleComplete = () => {
    if (!activeBowId || estimatedWeight === null) return;

    updateSetupData(activeBowId, {
      limbBoltTurnsFromMax: turnsOutNum,
      estimatedDrawWeight: estimatedWeight,
    });
    // Update draw weight on the bow profile
    updateBowProfile(activeBowId, { drawWeight: estimatedWeight });
    markSetupStepComplete(activeBowId, 6);
    setLastSession({ module: 'Setup', step: 'Step 6: Draw Weight', timestamp: Date.now() });
    // Steps 7-12 are Sprint 3 — return to hub
    router.replace('/setup');
  };

  const STEPS = [
    {
      title: 'Seat Both Limb Bolts to Maximum',
      description:
        'Turn both limb bolts clockwise (in) until they stop. This is maximum draw weight. Do NOT overtighten — stop when firm resistance is met.',
      warning: 'Overtightening limb bolts can damage the limb pockets or riser.',
    },
    {
      title: 'Note Your Starting Point',
      description: bowSpec
        ? `Your ${bowSpec.manufacturer} ${bowSpec.model} has a maximum draw weight of ${bowSpec.drawWeightMax} lbs with limb bolts fully seated. Maximum turns out: ${bowSpec.limbBoltMaxTurns}. Each full turn reduces weight by approximately ${bowSpec.limbBoltLbsPerTurn} lbs.`
        : 'Refer to your owner\'s manual for maximum draw weight, maximum turns out, and lbs per turn for your specific bow.',
    },
    {
      title: 'Back Out Both Bolts Equally',
      description:
        'Turn both limb bolts counterclockwise (out) ONE full turn at a time. Always turn both bolts the same amount — uneven limb bolts will affect cam timing and tuning.',
      note: 'Count your turns carefully. Mark the bolt head with a pen if needed to track full rotations.',
    },
    {
      title: 'Test Comfort',
      description:
        'After each reduction, draw the bow (with an arrow nocked) and assess comfort. The draw should feel repeatable and controlled through the entire draw cycle. If you struggle at the wall or your form breaks down, reduce further.',
    },
    {
      title: 'Find Your Working Weight',
      description:
        'Continue reducing one turn at a time until you find a comfortable, repeatable draw weight. This is your starting weight — you can increase later as form improves.',
      note: 'A draw weight you can control with good form is always better than a weight that compromises your shot.',
    },
  ];

  return (
    <SetupStepLayout
      stepNumber={6}
      totalSteps={12}
      title="Draw Weight"
      subtitle="Set a comfortable, repeatable draw weight starting from the maximum."
      onComplete={handleComplete}
      canComplete={canComplete}
      completeLabel="Complete Step 6 — Return to Setup Hub"
    >
      <ToolCheck required={['Allen wrench set']} optional={['Draw weight scale']} />

      <SafetyWarning message="Never dry fire the bow (draw and release without an arrow). Always nock an arrow before drawing." />

      {/* Bow spec display */}
      {bowSpec && (
        <Card style={styles.specCard}>
          <Text style={styles.specTitle}>
            {bowSpec.manufacturer} {bowSpec.model} Specifications
          </Text>
          <View style={styles.specGrid}>
            <View style={styles.specItem}>
              <Text style={styles.specValue}>{bowSpec.drawWeightMax} lbs</Text>
              <Text style={styles.specName}>Max Draw Weight</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specValue}>{bowSpec.limbBoltMaxTurns}</Text>
              <Text style={styles.specName}>Max Turns Out</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specValue}>~{bowSpec.limbBoltLbsPerTurn} lbs</Text>
              <Text style={styles.specName}>Per Turn</Text>
            </View>
          </View>
        </Card>
      )}

      {/* Procedure steps */}
      <Text style={styles.sectionLabel}>Procedure</Text>
      {STEPS.map((step, i) => (
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

      {/* Turn count input */}
      <Text style={styles.sectionLabel}>Record Your Setting</Text>
      <TextInput
        label="Turns Out From Maximum"
        value={turnsOut}
        onChangeText={setTurnsOut}
        placeholder="e.g. 2"
        keyboardType="decimal-pad"
        hint={`Maximum: ${maxTurns} turns. Each turn ≈ ${lbsPerTurn} lbs.`}
        style={styles.input}
      />

      {/* Estimated weight display */}
      {estimatedWeight !== null && (
        <Card style={styles.resultCard}>
          <Text style={styles.resultLabel}>Estimated Draw Weight</Text>
          <Text style={styles.resultValue}>~{estimatedWeight} lbs</Text>
          <Text style={styles.resultNote}>
            {turnsOutNum} turns out from {maxWeight} lbs maximum
          </Text>
        </Card>
      )}

      {/* Warning if exceeding max turns */}
      {turnsExceedMax && (
        <Card variant="outlined" style={styles.warningCard}>
          <Text style={styles.warningTitle}>Exceeds Maximum Turns</Text>
          <Text style={styles.warningText}>
            Never back limb bolts out more than {maxTurns} turns from maximum.
            Exceeding the manufacturer limit can cause the limbs to disengage from the pockets.
          </Text>
        </Card>
      )}

      <Card variant="outlined" style={styles.tipCard}>
        <Text style={styles.tipTitle}>Pro Tip</Text>
        <Text style={styles.tipText}>
          If you have a draw weight scale, verify the estimated weight by pulling to full draw
          on the scale. The actual weight may vary slightly from the calculated estimate.
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
  specCard: {
    marginBottom: Spacing.lg,
  },
  specTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },
  specGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  specItem: {
    flex: 1,
  },
  specValue: {
    ...Typography.displayBold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  specName: {
    ...Typography.label,
    fontSize: 8,
    color: Colors.greyLight,
  },
  input: {
    marginBottom: Spacing.lg,
  },
  resultCard: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  resultLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.xs,
  },
  resultValue: {
    ...Typography.displayBold,
    fontSize: FontSizes.xxxl,
    color: Colors.textPrimary,
  },
  resultNote: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  warningCard: {
    borderColor: Colors.statusError,
    marginBottom: Spacing.lg,
  },
  warningTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.statusError,
    marginBottom: Spacing.sm,
  },
  warningText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  tipCard: {
    marginBottom: Spacing.lg,
  },
  tipTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginBottom: Spacing.sm,
  },
  tipText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
