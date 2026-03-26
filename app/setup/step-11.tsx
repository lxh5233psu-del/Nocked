import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SetupStepLayout } from '@/components/setup/SetupStepLayout';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

export default function Step11Screen() {
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

  const allChecked = checkedSteps.size === 6;

  const handleComplete = () => {
    if (!activeBowId) return;
    updateSetupData(activeBowId, {
      stabilizerInstalled: true,
      roughBalanceAchieved: true,
    });
    markSetupStepComplete(activeBowId, 11);
    setLastSession({ module: 'Setup', step: 'Step 11: Stabilizer', timestamp: Date.now() });
    router.push('/setup/step-12');
  };

  return (
    <SetupStepLayout
      stepNumber={11}
      totalSteps={12}
      title="Stabilizer Installation"
      subtitle="Mount front and back bars, understand balance, and achieve a rough balanced starting point."
      onComplete={handleComplete}
      canComplete={allChecked}
    >
      {/* Why balance matters — displayed before installation per brief */}
      <Card style={styles.balanceCard}>
        <Text style={styles.balanceTitle}>Why Balance Matters</Text>

        <View style={styles.balanceItem}>
          <Text style={styles.balanceBold}>Pin Float</Text>
          <Text style={styles.balanceText}>
            A controlled, circular pin float indicates good balance. Erratic or jumping pin float
            indicates imbalance.
          </Text>
        </View>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceBold}>Natural Bow Hold</Text>
          <Text style={styles.balanceText}>
            A balanced bow sits naturally in your hand without gripping. You should be able to
            hold the bow with an open hand.
          </Text>
        </View>
        <View style={styles.balanceItem}>
          <Text style={styles.balanceBold}>Forward Fall</Text>
          <Text style={styles.balanceText}>
            After the shot, the bow should tip naturally forward — this is correct balance. If the
            bow kicks sideways, balance needs adjustment.
          </Text>
        </View>
      </Card>

      {/* Recommendation */}
      <Card variant="outlined" style={styles.recCard}>
        <Text style={styles.recTitle}>Recommendation</Text>
        <Text style={styles.recText}>
          Front and back bar recommended for ALL disciplines — not just target. Back bar
          significantly improves balance and pin float for bowhunters too.{'\n\n'}
          Quick detach systems are strongly recommended — especially for bowhunters who need to
          quickly stow bars in the field.
        </Text>
        <Text style={styles.recNote}>
          Note for competitors: Check your organization's rules (ASA, IBO, NFAA, USA Archery,
          World Archery) for stabilizer length and weight restrictions in your class.
        </Text>
      </Card>

      <Text style={styles.sectionLabel}>Installation</Text>

      <InstructionStep
        number={1}
        title="Mount Front Bar"
        description="Thread the front stabilizer into the riser's front stabilizer bushing. Hand tight — do not cross-thread. If the bar has a vibration dampener, follow the manufacturer's stacking order."
        checkable
        onCheckedChange={(c) => handleCheck(0, c)}
      />
      <InstructionStep
        number={2}
        title="Mount Side Bar Bracket"
        description="If using a back bar, mount the side bar bracket to the riser's rear stabilizer bushing (or to the front bar if it has an integrated back bar mount)."
        checkable
        onCheckedChange={(c) => handleCheck(1, c)}
      />
      <InstructionStep
        number={3}
        title="Mount Back Bar"
        description="Thread the back bar into the side bar bracket. Set a rough starting angle — typically 30-45 degrees from horizontal toward the archer."
        checkable
        onCheckedChange={(c) => handleCheck(2, c)}
      />
      <InstructionStep
        number={4}
        title="Add Weights"
        description="Install any weights on the front and back bars per your starting configuration. More weight on the front bar = more forward fall. More on the back bar = more level hold."
        checkable
        onCheckedChange={(c) => handleCheck(3, c)}
      />
      <InstructionStep
        number={5}
        title="Rough Balance Check"
        description="Hold the bow by the grip in a relaxed open hand. A slight forward tip is the correct starting position. The bow should NOT tip backward or aggressively sideways."
        checkable
        onCheckedChange={(c) => handleCheck(4, c)}
      />
      <InstructionStep
        number={6}
        title="Adjust Until Rough Balance"
        description="If balance is off, adjust the back bar angle or redistribute weights between front and back bars. Continue until the bow tips slightly forward when held in an open hand."
        note="This is a rough starting balance. You'll refine it further after shooting and evaluating pin float."
        checkable
        onCheckedChange={(c) => handleCheck(5, c)}
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
    marginTop: Spacing.lg,
  },
  balanceCard: {
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  balanceTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  balanceItem: {
    gap: 2,
  },
  balanceBold: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  balanceText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  recCard: {
    marginBottom: Spacing.lg,
  },
  recTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.xs,
    color: Colors.greyMid,
    marginBottom: Spacing.sm,
  },
  recText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  recNote: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    lineHeight: 16,
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
});
