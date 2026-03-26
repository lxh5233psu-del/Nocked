import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { TuningStepLayout } from '@/components/tuning/TuningStepLayout';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { ToolCheck } from '@/components/setup/ToolCheck';
import { DiagnosisTable } from '@/components/setup/DiagnosisTable';
import { SafetyWarning } from '@/components/setup/SafetyWarning';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

export default function BareShaftScreen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const markTuningModuleComplete = useAppStore((s) => s.markTuningModuleComplete);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const handleComplete = () => {
    if (activeBowId) {
      markTuningModuleComplete(activeBowId, 'bare-shaft');
      setLastSession({ module: 'Tune', step: 'Bare Shaft Tuning', timestamp: Date.now() });
    }
    router.back();
  };

  return (
    <TuningStepLayout
      title="Bare Shaft Tuning"
      subtitle="Compare the impact point of bare shafts (no fletching) to fletched arrows. The difference reveals spine alignment, rest position, and nocking point accuracy."
      prerequisite="Paper tune and walk-back tune complete. Bow shooting reasonably well."
      onComplete={handleComplete}
      completeLabel="Mark Bare Shaft Complete"
    >
      <ToolCheck required={['Allen wrench set']} optional={['Spine tester']} />

      <SafetyWarning message="Bare shafts have no fletching to correct flight. They can plane erratically if severely out of tune. Always use a large target backstop and stand clear of others." />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Preparation</Text>
        <InstructionStep
          number={1}
          title="Prepare Bare Shafts"
          description="Take 2-3 arrows identical to your fletched arrows and remove the fletching (or use shafts that were never fletched). They must be the same spine, length, point weight, and nock as your fletched arrows."
          note="The only difference between bare and fletched arrows should be the absence of vanes. Everything else must match exactly."
        />
        <InstructionStep
          number={2}
          title="Mark Your Shafts"
          description="Clearly mark bare shafts so you can distinguish them from fletched arrows on the target. Use tape, marker, or different-colored nocks."
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Shooting Process</Text>
        <InstructionStep
          number={3}
          title="Start at 20 Yards"
          description="Begin at 20 yards. Shoot 3 fletched arrows into the target, forming a group. Then shoot 2-3 bare shafts at the same aiming point."
        />
        <InstructionStep
          number={4}
          title="Compare Impact Points"
          description="Compare where the bare shafts hit relative to the fletched group. The bare shafts reveal the true arrow flight — fletching masks small errors by correcting the arrow in flight."
        />
        <InstructionStep
          number={5}
          title="Move to 30 Yards (Optional)"
          description="For finer tuning, repeat at 30 yards. Greater distance amplifies any remaining discrepancy between bare and fletched impact points."
        />
      </View>

      <DiagnosisTable
        title="Bare Shaft Impact Analysis"
        rows={[
          { condition: 'Bare shafts hit WITH fletched group', result: 'Perfect tune', action: 'No adjustment needed — arrows are spine-matched' },
          { condition: 'Bare shafts hit LEFT of fletched', result: 'Shaft too stiff', action: 'Increase point weight, increase draw weight, or move rest slightly left' },
          { condition: 'Bare shafts hit RIGHT of fletched', result: 'Shaft too weak', action: 'Decrease point weight, decrease draw weight, or move rest slightly right' },
          { condition: 'Bare shafts hit HIGH of fletched', result: 'Nock point too low', action: 'Raise nocking point/D-loop slightly' },
          { condition: 'Bare shafts hit LOW of fletched', result: 'Nock point too high', action: 'Lower nocking point/D-loop slightly' },
          { condition: 'Bare shafts plane wildly', result: 'Severely out of tune', action: 'Return to paper tune — major issue with spine, rest, or clearance' },
        ]}
      />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Adjustment Process</Text>
        <InstructionStep
          number={6}
          title="Address Horizontal First"
          description="If bare shafts are left or right of the fletched group, adjust rest position in small increments (1/64 inch). Alternatively, adjust arrow spine through point weight changes."
        />
        <InstructionStep
          number={7}
          title="Address Vertical Second"
          description="If bare shafts are high or low, adjust the nocking point in small increments (1/32 inch). Move the D-loop, not the arrow rest, for vertical corrections."
        />
        <InstructionStep
          number={8}
          title="Confirm — Bare Shafts in the Fletched Group"
          description="The goal is bare shafts landing within or very near the fletched group. When this happens, your arrows are spine-matched to your bow and the tune is dialed in."
        />
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipLabel}>Understanding Spine</Text>
        <Text style={styles.tipText}>
          Arrow spine (stiffness) must match your bow's draw weight and draw length. A perfectly
          tuned bow with mismatched spine will never group well. Bare shaft testing is the most
          reliable way to verify spine compatibility. If adjustments can't bring bare shafts into
          the fletched group, consider a different spine arrow.
        </Text>
      </View>
    </TuningStepLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.greyLight,
    marginBottom: Spacing.md,
  },
  tipCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tipLabel: {
    ...Typography.label,
    fontSize: FontSizes.xs,
    color: Colors.clayMid,
    marginBottom: Spacing.xs,
  },
  tipText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
