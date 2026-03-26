import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SetupStepLayout } from '@/components/setup/SetupStepLayout';
import { SafetyWarning } from '@/components/setup/SafetyWarning';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { SelectOption } from '@/components/ui/SelectOption';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

const INSPECTION_ITEMS = [
  {
    title: 'Limb Inspection',
    description:
      'Inspect both limbs for cracks, chips, delamination, or splintering. Check top and bottom limb surfaces, edges, and tips. Any visible damage = do not proceed.',
    warning: 'Damaged limbs can fail catastrophically under draw. Do not shoot.',
  },
  {
    title: 'String & Cables',
    description:
      'Inspect the bowstring and all cables for fraying, strand separation, or damage at the cam tracks, servings, and string loops. Check that all strands are intact and servings are tight.',
  },
  {
    title: 'Cam Inspection',
    description:
      'Verify both cams are centered on their axles with no lateral wobble. Check that cam tracks are clean and cables are properly seated. Look for burrs, grooves, or wear marks on the cam surfaces.',
  },
  {
    title: 'Axle & Hardware',
    description:
      'Check all axle bolts, limb bolts, and riser hardware for tightness. Verify nothing is cross-threaded, stripped, or loose. Ensure limb pockets seat flush against the riser.',
  },
  {
    title: 'Cable Guard / Roller Guard',
    description:
      'Inspect the cable guard rod or roller guard system. Verify cables route cleanly with no contact against the riser or fletching path. Check for bends or wear.',
  },
  {
    title: 'Accessories & Grip',
    description:
      'Remove all accessories (rest, sight, stabilizer, quiver). You\'re starting from a bare bow. Inspect the grip for cracks. Verify the riser is clean and free of debris.',
  },
];

export default function Step1Screen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const markSetupStepComplete = useAppStore((s) => s.markSetupStepComplete);
  const updateSetupData = useAppStore((s) => s.updateSetupData);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [issueFound, setIssueFound] = useState<boolean | null>(null);

  const handleCheck = (index: number, checked: boolean) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (checked) next.add(index); else next.delete(index);
      return next;
    });
  };

  const allChecked = checkedItems.size === INSPECTION_ITEMS.length;
  const canComplete = allChecked && issueFound !== null;

  const handleComplete = () => {
    if (!activeBowId) return;

    updateSetupData(activeBowId, {
      safetyCheckPassed: issueFound === false,
      safetyIssuesFound: issueFound ? ['User reported issue during inspection'] : [],
    });
    markSetupStepComplete(activeBowId, 1);
    setLastSession({ module: 'Setup', step: 'Step 1: Safety Check', timestamp: Date.now() });

    if (issueFound) {
      // Hard stop — don't advance
      return;
    }
    router.push('/setup/step-2');
  };

  return (
    <SetupStepLayout
      stepNumber={1}
      totalSteps={12}
      title="Safety Check & Initial Inspection"
      subtitle="Inspect every component before proceeding. Start from a bare bow — all accessories removed."
      onComplete={handleComplete}
      canComplete={canComplete && !issueFound}
      completeLabel={issueFound ? 'Issue Found — Cannot Proceed' : 'All Clear — Continue to Step 2'}
    >
      <SafetyWarning message="Do not draw or shoot the bow until this inspection is complete. If any damage is found, take the bow to a qualified pro shop." />

      {/* Instruction checklist */}
      <Text style={styles.sectionLabel}>Inspection Checklist</Text>
      {INSPECTION_ITEMS.map((item, i) => (
        <InstructionStep
          key={i}
          number={i + 1}
          title={item.title}
          description={item.description}
          warning={item.warning}
          checkable
          onCheckedChange={(checked) => handleCheck(i, checked)}
        />
      ))}

      {/* Issue found question */}
      {allChecked && (
        <View style={styles.questionSection}>
          <Text style={styles.questionText}>
            Did you find any issues during inspection?
          </Text>
          <View style={styles.questionRow}>
            <SelectOption
              label="No Issues Found"
              selected={issueFound === false}
              onPress={() => setIssueFound(false)}
              style={styles.questionOption}
            />
            <SelectOption
              label="Issue Found"
              selected={issueFound === true}
              onPress={() => setIssueFound(true)}
              style={styles.questionOption}
            />
          </View>
        </View>
      )}

      {/* Hard stop card */}
      {issueFound === true && (
        <Card variant="outlined" style={styles.stopCard}>
          <Text style={styles.stopTitle}>HARD STOP</Text>
          <Text style={styles.stopText}>
            Do not proceed with setup. Take your bow to a qualified pro shop to address the issue
            before continuing. Note the specific issue found so you can communicate it to the
            technician.
          </Text>
          <Button
            label="Return to Setup Hub"
            variant="secondary"
            onPress={() => router.back()}
            style={{ marginTop: Spacing.md }}
          />
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
  },
  questionSection: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  questionText: {
    ...Typography.bodyMedium,
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  questionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  questionOption: {
    flex: 1,
  },
  stopCard: {
    marginTop: Spacing.lg,
    borderColor: Colors.statusError,
  },
  stopTitle: {
    ...Typography.labelMedium,
    fontSize: FontSizes.sm,
    color: Colors.statusError,
    marginBottom: Spacing.sm,
  },
  stopText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
