import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SetupStepLayout } from '@/components/setup/SetupStepLayout';
import { ToolCheck } from '@/components/setup/ToolCheck';
import { DiagnosisTable } from '@/components/setup/DiagnosisTable';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { TextInput } from '@/components/ui/TextInput';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { getBowById } from '@/database/bow-data';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

export default function Step2Screen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const activeBow = useAppStore((s) => s.bowProfiles.find((b) => b.id === activeBowId));
  const markSetupStepComplete = useAppStore((s) => s.markSetupStepComplete);
  const updateSetupData = useAppStore((s) => s.updateSetupData);
  const setLastSession = useAppStore((s) => s.setLastSession);
  const toolInventory = useAppStore((s) => s.toolInventory);

  // Look up bow specs from database
  const bowSpec = useMemo(() => {
    if (!activeBow) return null;
    return getBowById(activeBow.model);
  }, [activeBow]);

  const [braceHeight, setBraceHeight] = useState('');
  const [axleToAxle, setAxleToAxle] = useState('');

  const measuredBH = parseFloat(braceHeight);
  const measuredA2A = parseFloat(axleToAxle);

  // Determine if measurements are in spec
  const bhInSpec = bowSpec
    ? !isNaN(measuredBH) && measuredBH >= bowSpec.braceHeightMin && measuredBH <= bowSpec.braceHeightMax
    : null;
  const a2aInSpec = bowSpec
    ? !isNaN(measuredA2A) && measuredA2A >= bowSpec.axleToAxle - 0.125 && measuredA2A <= bowSpec.axleToAxle + 0.125
    : null;

  const hasBowPress = toolInventory.includes('Bow press');
  const hasMeasurements = !isNaN(measuredBH) && !isNaN(measuredA2A);

  const diagnosisRows = [
    {
      condition: 'Both in spec',
      result: 'Bow is within factory specifications',
      action: 'Proceed to Step 3',
    },
    {
      condition: 'Brace height out, A2A in',
      result: 'String length likely off',
      action: 'Twist or untwist string to adjust brace height. Recheck both.',
    },
    {
      condition: 'A2A out, brace height in',
      result: 'Cable length likely off',
      action: 'Twist or untwist cables to correct. Recheck both.',
    },
    {
      condition: 'Both out of spec',
      result: 'String and cable system needs attention',
      action: 'Take to pro shop or replace string/cables if heavily worn.',
    },
  ];

  const handleComplete = () => {
    if (!activeBowId) return;

    updateSetupData(activeBowId, {
      measuredBraceHeight: measuredBH,
      measuredAxleToAxle: measuredA2A,
      braceHeightInSpec: bhInSpec ?? undefined,
      axleToAxleInSpec: a2aInSpec ?? undefined,
    });
    markSetupStepComplete(activeBowId, 2);
    setLastSession({ module: 'Setup', step: 'Step 2: Brace Height & A2A', timestamp: Date.now() });
    router.push('/setup/step-3');
  };

  return (
    <SetupStepLayout
      stepNumber={2}
      totalSteps={12}
      title="Brace Height & Axle-to-Axle"
      subtitle="Verify your bow matches manufacturer specifications. These measurements are the foundation for all tuning."
      onComplete={handleComplete}
      canComplete={hasMeasurements}
    >
      <ToolCheck
        required={['Measuring tape']}
        optional={['Bow press']}
      />

      {/* Manufacturer spec display */}
      {bowSpec ? (
        <Card style={styles.specCard}>
          <Text style={styles.specTitle}>Factory Specifications</Text>
          <Text style={styles.specLabel}>
            {bowSpec.manufacturer} {bowSpec.model} ({bowSpec.year})
          </Text>
          <View style={styles.specRow}>
            <View style={styles.specItem}>
              <Text style={styles.specValue}>
                {bowSpec.braceHeightMin}" – {bowSpec.braceHeightMax}"
              </Text>
              <Text style={styles.specName}>Brace Height</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specValue}>{bowSpec.axleToAxle}"</Text>
              <Text style={styles.specName}>Axle-to-Axle</Text>
            </View>
          </View>
        </Card>
      ) : (
        <Card variant="outlined" style={styles.specCard}>
          <Text style={styles.noSpecText}>
            Bow not in database — refer to your owner's manual for factory brace height and
            axle-to-axle specifications.
          </Text>
        </Card>
      )}

      {/* Measurement instructions */}
      <Text style={styles.sectionLabel}>How to Measure</Text>

      <InstructionStep
        number={1}
        title="Measure Brace Height"
        description="Measure from the deepest point of the grip (throat) to the bowstring. Use a measuring tape or bow square. Record to the nearest 1/16&quot;."
        checkable={false}
      />

      <InstructionStep
        number={2}
        title="Measure Axle-to-Axle"
        description="Measure from the center of the top cam axle to the center of the bottom cam axle. Keep the tape straight — do not follow the curve of the limbs."
        checkable={false}
      />

      {/* Input fields */}
      <Text style={styles.sectionLabel}>Your Measurements</Text>
      <View style={styles.inputRow}>
        <TextInput
          label="Brace Height (inches)"
          value={braceHeight}
          onChangeText={setBraceHeight}
          placeholder='e.g. 6.125'
          keyboardType="decimal-pad"
          style={styles.inputHalf}
        />
        <TextInput
          label="Axle-to-Axle (inches)"
          value={axleToAxle}
          onChangeText={setAxleToAxle}
          placeholder='e.g. 33.0'
          keyboardType="decimal-pad"
          style={styles.inputHalf}
        />
      </View>

      {/* Status indicators */}
      {hasMeasurements && bowSpec && (
        <View style={styles.statusRow}>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, bhInSpec ? styles.dotGood : styles.dotBad]} />
            <Text style={styles.statusText}>
              Brace Height: {bhInSpec ? 'In Spec' : 'Out of Spec'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusDot, a2aInSpec ? styles.dotGood : styles.dotBad]} />
            <Text style={styles.statusText}>
              A2A: {a2aInSpec ? 'In Spec' : 'Out of Spec'}
            </Text>
          </View>
        </View>
      )}

      {/* Diagnosis table */}
      <DiagnosisTable title="Diagnosis" rows={diagnosisRows} />

      {/* Adjustment instructions */}
      {hasMeasurements && (bhInSpec === false || a2aInSpec === false) && (
        <Card variant="outlined" style={styles.adjustCard}>
          <Text style={styles.adjustTitle}>Adjustment Required</Text>
          {!hasBowPress ? (
            <Text style={styles.adjustText}>
              String and cable twist adjustments require a bow press. Record your measurements
              and take them to a pro shop. Tell the technician your target specs from the card above.
            </Text>
          ) : (
            <Text style={styles.adjustText}>
              Use a bow press to add or remove twists from the string and/or cables.{'\n\n'}
              {bhInSpec === false && 'Brace height out: twist the string to increase brace height, untwist to decrease. '}{'\n'}
              {a2aInSpec === false && 'A2A out: twist cables to decrease A2A, untwist to increase. '}
              {'\n\n'}Recheck both measurements after every adjustment — changing one affects the other.
            </Text>
          )}
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
  specCard: {
    marginBottom: Spacing.lg,
  },
  specTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.xs,
  },
  specLabel: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  specRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
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
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  noSpecText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  inputHalf: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotGood: {
    backgroundColor: Colors.statusComplete,
  },
  dotBad: {
    backgroundColor: Colors.statusError,
  },
  statusText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  adjustCard: {
    borderColor: Colors.statusWarning,
    marginBottom: Spacing.lg,
  },
  adjustTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.statusWarning,
    marginBottom: Spacing.sm,
  },
  adjustText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
