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
import { getBowById, calculateDrawLengthFromWingspan, getModuleForDrawLength } from '@/database/bow-data';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

export default function Step7Screen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const activeBow = useAppStore((s) => s.bowProfiles.find((b) => b.id === activeBowId));
  const markSetupStepComplete = useAppStore((s) => s.markSetupStepComplete);
  const updateSetupData = useAppStore((s) => s.updateSetupData);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const bowSpec = useMemo(() => {
    if (!activeBow) return null;
    return getBowById(activeBow.model);
  }, [activeBow]);

  const [wingspan, setWingspan] = useState('');
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());

  const wingspanNum = parseFloat(wingspan);
  const calculatedDL = !isNaN(wingspanNum) ? calculateDrawLengthFromWingspan(wingspanNum) : null;

  // Account for D-loop adding ~0.5"
  const effectiveDL = calculatedDL !== null ? calculatedDL - 0.5 : null;

  // Get module position from bow database
  const moduleInfo = useMemo(() => {
    if (!bowSpec || effectiveDL === null) return null;
    return getModuleForDrawLength(bowSpec, effectiveDL);
  }, [bowSpec, effectiveDL]);

  const pressRequired = bowSpec?.bowPressRequiredForModules ?? false;
  const hasBowPress = useAppStore((s) => s.toolInventory.includes('Bow press'));

  const handleCheck = (index: number, checked: boolean) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (checked) next.add(index); else next.delete(index);
      return next;
    });
  };

  const canComplete = calculatedDL !== null && checkedSteps.size >= 3;

  const handleComplete = () => {
    if (!activeBowId || calculatedDL === null) return;
    updateSetupData(activeBowId, {
      wingspan: wingspanNum,
      calculatedDrawLength: calculatedDL,
      modulePosition: moduleInfo?.position,
    });
    markSetupStepComplete(activeBowId, 7);
    setLastSession({ module: 'Setup', step: 'Step 7: Draw Length', timestamp: Date.now() });
    router.push('/setup/step-8');
  };

  return (
    <SetupStepLayout
      stepNumber={7}
      totalSteps={12}
      title="Coarse Draw Length"
      subtitle="Calculate your approximate draw length from wingspan and set the cam module. Fine-tuning happens in the tuning phase."
      onComplete={handleComplete}
      canComplete={canComplete}
    >
      <ToolCheck
        required={['Allen wrench set', 'Measuring tape']}
        optional={['Bow press']}
      />

      {/* Sub-Step A: Wingspan */}
      <Text style={styles.sectionLabel}>A — Wingspan Measurement</Text>

      <InstructionStep
        number={1}
        title="Measure Your Wingspan"
        description='Stand with arms extended straight out to your sides, palms facing forward. Have a partner measure from the tip of one middle finger to the tip of the other. Record in inches.'
        checkable={false}
      />

      <TextInput
        label="Wingspan (inches)"
        value={wingspan}
        onChangeText={setWingspan}
        placeholder="e.g. 72"
        keyboardType="decimal-pad"
        hint="Stand with arms fully extended, palms forward."
        style={styles.input}
      />

      {calculatedDL !== null && (
        <Card style={styles.resultCard}>
          <Text style={styles.resultLabel}>Calculated Draw Length</Text>
          <Text style={styles.resultValue}>{calculatedDL}"</Text>
          <Text style={styles.resultNote}>
            Wingspan ({wingspanNum}") ÷ 2.5 = {(wingspanNum / 2.5).toFixed(1)}", rounded to nearest 0.5"
          </Text>
          <Text style={styles.resultNote}>
            D-loop adds ~0.5" — effective module setting targets {effectiveDL}"
          </Text>
        </Card>
      )}

      {/* Sub-Step B: Module setting */}
      {calculatedDL !== null && (
        <>
          <Text style={styles.sectionLabel}>B — Module Setting</Text>

          {bowSpec && moduleInfo ? (
            <Card style={styles.moduleCard}>
              <Text style={styles.moduleLabel}>
                {bowSpec.manufacturer} {bowSpec.model}
              </Text>
              <View style={styles.moduleRow}>
                <View style={styles.moduleItem}>
                  <Text style={styles.moduleValue}>Position {moduleInfo.position}</Text>
                  <Text style={styles.moduleName}>Module Setting</Text>
                </View>
                <View style={styles.moduleItem}>
                  <Text style={styles.moduleValue}>{moduleInfo.drawLength}"</Text>
                  <Text style={styles.moduleName}>Draw Length</Text>
                </View>
              </View>
              {pressRequired && (
                <Text style={[styles.pressNote, !hasBowPress && styles.pressWarning]}>
                  {hasBowPress
                    ? 'Bow press required for module adjustment on this model.'
                    : 'This model requires a bow press for module adjustment. Take to a pro shop with this module setting information.'}
                </Text>
              )}
            </Card>
          ) : (
            <Card variant="outlined" style={styles.moduleCard}>
              <Text style={styles.noSpecText}>
                Bow not in database — consult your owner's manual for the module position
                that corresponds to a {effectiveDL}" draw length setting.
              </Text>
            </Card>
          )}
        </>
      )}

      {/* Sub-Step C: Verification */}
      {calculatedDL !== null && (
        <>
          <Text style={styles.sectionLabel}>C — Verify with Form Contact Points</Text>

          <SafetyWarning message="Never draw without an arrow nocked." />

          <InstructionStep
            number={1}
            title="Bow Arm: Slight Bend"
            description="At full draw, your bow arm should have a slight bend at the elbow — not locked straight, not overly bent."
            checkable
            onCheckedChange={(c) => handleCheck(0, c)}
          />
          <InstructionStep
            number={2}
            title="Drawing Elbow: At or Above Arrow Line"
            description="Your drawing elbow should be at the same height as the arrow or slightly above. If the elbow is low, draw length may be too long."
            checkable
            onCheckedChange={(c) => handleCheck(1, c)}
          />
          <InstructionStep
            number={3}
            title="String Contacts Tip of Nose"
            description="The bowstring should lightly touch the tip of your nose at full draw anchor. This is a repeatable reference point."
            checkable
            onCheckedChange={(c) => handleCheck(2, c)}
          />
          <InstructionStep
            number={4}
            title="String Contacts Corner of Mouth"
            description="The string should also contact the corner of your mouth. If both nose and mouth contact are achieved naturally, draw length is in the right range."
            checkable
            onCheckedChange={(c) => handleCheck(3, c)}
          />

          <Card variant="outlined" style={styles.adjustNote}>
            <Text style={styles.adjustTitle}>Adjustment</Text>
            <Text style={styles.adjustText}>
              If contact points aren't met, adjust one module increment at a time.
              Do NOT overtighten module screws — risk of stripping hardware or damaging the cam.
              {'\n\n'}
              This is a COARSE adjustment. Fine-tuning draw length happens in the Advanced Tuning
              phase after your baseline tune is established.
            </Text>
          </Card>
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
    marginTop: Spacing.lg,
  },
  input: {
    marginBottom: Spacing.lg,
  },
  resultCard: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginBottom: Spacing.md,
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
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  moduleCard: {
    marginBottom: Spacing.lg,
  },
  moduleLabel: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  moduleRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  moduleItem: {
    flex: 1,
  },
  moduleValue: {
    ...Typography.displayBold,
    fontSize: FontSizes.lg,
    color: Colors.textPrimary,
  },
  moduleName: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
  },
  pressNote: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginTop: Spacing.md,
  },
  pressWarning: {
    color: Colors.statusWarning,
  },
  noSpecText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.greyMid,
    lineHeight: 20,
  },
  adjustNote: {
    marginTop: Spacing.md,
  },
  adjustTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginBottom: Spacing.sm,
  },
  adjustText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
