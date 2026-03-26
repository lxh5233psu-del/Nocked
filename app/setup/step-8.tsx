import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { SetupStepLayout } from '@/components/setup/SetupStepLayout';
import { ToolCheck } from '@/components/setup/ToolCheck';
import { SafetyWarning } from '@/components/setup/SafetyWarning';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { SelectOption } from '@/components/ui/SelectOption';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { SightMountingType } from '@/types';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

const MOUNTING_TYPES: { label: string; value: SightMountingType; description: string }[] = [
  { label: 'Universal', value: 'Universal', description: 'Standard bolt-on bracket with screws' },
  { label: 'Picatinny Rail', value: 'Picatinny', description: 'Rail-mounted with locking clamp' },
  { label: 'Dovetail', value: 'Dovetail', description: 'Sliding dovetail bracket' },
  { label: 'Through-Mount', value: 'Through-mount', description: 'e.g. Mathews Bridge Lock system' },
];

export default function Step8Screen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const activeBow = useAppStore((s) => s.bowProfiles.find((b) => b.id === activeBowId));
  const markSetupStepComplete = useAppStore((s) => s.markSetupStepComplete);
  const updateSetupData = useAppStore((s) => s.updateSetupData);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const [mountingType, setMountingType] = useState<SightMountingType | null>(null);
  const [checkedSteps, setCheckedSteps] = useState<Set<string>>(new Set());

  const handleCheck = (key: string, checked: boolean) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (checked) next.add(key); else next.delete(key);
      return next;
    });
  };

  const requiredChecks = ['mount-1', 'mount-2', 'mount-3', 'axis2-1', 'axis2-2', 'axis2-3', 'axis3-1', 'axis3-2', 'axis3-3', 'axis3-4', 'rough-1', 'rough-2'];
  const canComplete = mountingType !== null && requiredChecks.every((k) => checkedSteps.has(k));

  const handleComplete = () => {
    if (!activeBowId) return;
    updateSetupData(activeBowId, {
      sightMounted: true,
      secondAxisSet: true,
      thirdAxisRoughSet: true,
    });
    markSetupStepComplete(activeBowId, 8);
    setLastSession({ module: 'Setup', step: 'Step 8: Sight & Axis', timestamp: Date.now() });
    router.push('/setup/step-9');
  };

  return (
    <SetupStepLayout
      stepNumber={8}
      totalSteps={12}
      title="Sight Installation & Axis Setup"
      subtitle="Mount the sight, set second axis, and rough-set third axis."
      onComplete={handleComplete}
      canComplete={canComplete}
    >
      <ToolCheck
        required={['Allen wrench set', 'String level', 'Bow vice']}
        optional={['Arrow level']}
      />

      {/* Sight context */}
      {activeBow && (
        <Card style={styles.contextCard}>
          <Text style={styles.contextLabel}>Your Sight</Text>
          <Text style={styles.contextValue}>
            {activeBow.sightType} — {activeBow.sightManufacturer || 'Brand not specified'} {activeBow.sightModel || ''}
          </Text>
        </Card>
      )}

      {/* Sub-Step A: Mounting system */}
      <Text style={styles.sectionLabel}>A — Identify Mounting System</Text>
      <View style={styles.options}>
        {MOUNTING_TYPES.map((mt) => (
          <SelectOption
            key={mt.value}
            label={mt.label}
            selected={mountingType === mt.value}
            onPress={() => setMountingType(mt.value)}
          />
        ))}
      </View>

      {/* Sub-Step B: Mount bracket */}
      {mountingType && (
        <>
          <Text style={styles.sectionLabel}>B — Mount Bracket to Riser</Text>
          <InstructionStep
            number={1}
            title="Align Bracket"
            description={
              mountingType === 'Through-mount'
                ? 'Align the sight with the through-mount system on your riser. Follow the manufacturer-specific engagement procedure for your Bridge Lock or equivalent system.'
                : mountingType === 'Picatinny'
                ? 'Slide the sight clamp onto the Picatinny rail. Position it so the sight housing sits at roughly center height on the riser.'
                : 'Position the sight bracket against the riser mounting holes. Ensure it sits flush with no gap between bracket and riser.'
            }
            checkable
            onCheckedChange={(c) => handleCheck('mount-1', c)}
          />
          <InstructionStep
            number={2}
            title="Tighten in Cross Pattern"
            description="If using multiple screws, tighten in a cross pattern — alternating screws to maintain even pressure. Do not fully tighten one screw before starting others."
            checkable
            onCheckedChange={(c) => handleCheck('mount-2', c)}
          />
          <InstructionStep
            number={3}
            title="Verify No Wobble"
            description="Once tightened, check that the sight bracket has zero play. Grip the sight housing and attempt to wiggle it — any movement means bolts need tightening or the bracket is not seated properly."
            checkable
            onCheckedChange={(c) => handleCheck('mount-3', c)}
          />
        </>
      )}

      {/* Sub-Step C: Second axis */}
      {mountingType && (
        <>
          <Text style={styles.sectionLabel}>C — Second Axis</Text>

          <InstructionStep
            number={1}
            title="Level Bow in Vice"
            description="Place the bow in the vice. Verify the bowstring is perfectly plumb in both lateral and fore/aft planes using a string level."
            checkable
            onCheckedChange={(c) => handleCheck('axis2-1', c)}
          />
          <InstructionStep
            number={2}
            title="Attach Reference Level"
            description="Clamp a Hamskea level (or equivalent precision level) to the vertical slider bar or sight frame on the sight side of the first axis pivot. This is your reference for second axis alignment."
            checkable
            onCheckedChange={(c) => handleCheck('axis2-2', c)}
          />
          <InstructionStep
            number={3}
            title="Adjust Second Axis"
            description="Adjust the second axis adjustment on your sight until both the Hamskea reference level AND the sight's built-in housing level read plumb simultaneously. This marries the sight level to true vertical."
            note="Consult your sight's owner's manual for the specific second axis adjustment location and method."
            checkable
            onCheckedChange={(c) => handleCheck('axis2-3', c)}
          />
        </>
      )}

      {/* Sub-Step D: Third axis rough */}
      {mountingType && (
        <>
          <Text style={styles.sectionLabel}>D — Third Axis (Rough Setting)</Text>

          <SafetyWarning message="Never draw without an arrow nocked. This step requires drawing to full draw." />

          <InstructionStep
            number={1}
            title="Hang Plumb Bob"
            description="Hang a plumb bob from a fixed point so it hangs perfectly vertical. You will use this as a true vertical reference."
            checkable
            onCheckedChange={(c) => handleCheck('axis3-1', c)}
          />
          <InstructionStep
            number={2}
            title="Draw at 45° Downward Angle"
            description="Nock an arrow. Draw to full draw and tilt the bow downward at approximately 45 degrees, as if shooting steeply downhill."
            checkable
            onCheckedChange={(c) => handleCheck('axis3-2', c)}
          />
          <InstructionStep
            number={3}
            title="Align with Plumb Bob"
            description="Align the Hamskea vertical bar (or sight vertical reference) with the plumb bob line. Observe the sight's built-in level bubble."
            checkable
            onCheckedChange={(c) => handleCheck('axis3-3', c)}
          />
          <InstructionStep
            number={4}
            title="Adjust Third Axis"
            description="Adjust the third axis until the sight's built-in level reads level while the vertical reference aligns with the plumb bob. This is a ROUGH setting — fine-tuning happens post sight-in using steep angle shooting."
            checkable
            onCheckedChange={(c) => handleCheck('axis3-4', c)}
          />
        </>
      )}

      {/* Sub-Step E: Rough sight position */}
      {mountingType && (
        <>
          <Text style={styles.sectionLabel}>E — Rough Sight Position</Text>

          <InstructionStep
            number={1}
            title="Center Housing"
            description="Center the sight housing both vertically and horizontally within its available adjustment range. This gives maximum adjustability in both directions for sight-in."
            checkable
            onCheckedChange={(c) => handleCheck('rough-1', c)}
          />
          <InstructionStep
            number={2}
            title="Set Starting Distance"
            description="Set the sight to approximately 20 yards as a starting distance reference. This will be refined during sight-in in the tuning phase."
            checkable
            onCheckedChange={(c) => handleCheck('rough-2', c)}
          />
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
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
  },
  options: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
});
