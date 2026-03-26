import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { TuningStepLayout } from '@/components/tuning/TuningStepLayout';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { DiagnosisTable } from '@/components/setup/DiagnosisTable';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

export default function GroupTuneScreen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const markTuningModuleComplete = useAppStore((s) => s.markTuningModuleComplete);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const handleComplete = () => {
    if (activeBowId) {
      markTuningModuleComplete(activeBowId, 'group');
      setLastSession({ module: 'Tune', step: 'Group Tuning', timestamp: Date.now() });
    }
    router.back();
  };

  return (
    <TuningStepLayout
      title="Group Tuning"
      subtitle="The final tuning step. Shoot tight groups at your competition or hunting distance, then make micro-adjustments to tighten groups further. This is where precision meets practice."
      prerequisite="All previous tuning methods complete. Sight pins zeroed at all distances."
      onComplete={handleComplete}
      completeLabel="Mark Group Tune Complete"
    >
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Concept</Text>
        <View style={styles.conceptCard}>
          <Text style={styles.conceptText}>
            Group tuning is the art of making micro-adjustments — moving the rest or nocking point
            by 1/128 inch or less — based on where your groups land at distance. At this stage,
            your bow is already well-tuned. You're extracting the last few percent of accuracy.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Process</Text>
        <InstructionStep
          number={1}
          title="Choose Your Primary Distance"
          description="Select the distance most important to you. For target archery, this is typically 50 yards. For 3D, 30-40 yards. For bowhunting, 30 yards. This is where you'll optimize."
        />
        <InstructionStep
          number={2}
          title="Shoot 5-Arrow Groups"
          description="Shoot multiple 5-arrow groups at your chosen distance. Focus on perfect execution. You need at least 3 groups of 5 to establish a reliable pattern. Single groups can be misleading."
        />
        <InstructionStep
          number={3}
          title="Measure Group Size"
          description="Measure each group from the outside of the two farthest arrow holes (outside-to-outside). Subtract one arrow diameter for the actual group size. Record each measurement."
        />
        <InstructionStep
          number={4}
          title="Identify Group Center"
          description="Find the center of your aggregate group (all 15+ arrows). If the center is offset from where you're aiming, adjust your sight. The group center should be on the bullseye."
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Micro-Adjustments</Text>
        <InstructionStep
          number={5}
          title="Micro-Click Rest Adjustment"
          description="If your groups are elongated horizontally, try moving the rest 1/128 inch (half a click on most micro-adjust rests). Shoot another set of 5-arrow groups. Compare to baseline."
          note="Only change ONE variable at a time. If you move the rest AND change nocking point, you won't know which helped."
        />
        <InstructionStep
          number={6}
          title="Nocking Point Fine Adjustment"
          description="If groups are elongated vertically, try a nocking point adjustment of 1/64 inch. Vertical spread is often caused by nocking point position or inconsistent back tension."
        />
        <InstructionStep
          number={7}
          title="Compare Before and After"
          description="After each micro-adjustment, shoot the same number of groups and compare. If the adjustment improved group size, keep it. If it made no difference or made groups worse, reverse it."
        />
      </View>

      <DiagnosisTable
        title="Group Shape Analysis"
        rows={[
          { condition: 'Round, tight group', result: 'Well tuned', action: 'No adjustment needed — maintain and practice' },
          { condition: 'Horizontal oval', result: 'Left/right variation', action: 'Micro-adjust rest position, check grip consistency' },
          { condition: 'Vertical oval', result: 'Up/down variation', action: 'Check nocking point, back tension consistency, cam timing' },
          { condition: 'Diagonal pattern', result: 'Combined issue', action: 'Address the dominant axis first, then secondary' },
          { condition: 'Random scatter', result: 'Form issue', action: 'Not a tuning problem — focus on form consistency' },
          { condition: 'Flyers in tight group', result: 'Execution error', action: 'Not a tuning problem — one bad shot in the group' },
        ]}
      />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Finalizing Your Tune</Text>
        <InstructionStep
          number={8}
          title="Record Your Final Settings"
          description="Document everything: rest position (clicks from center), nocking point height, draw weight, draw length, sight marks at each distance. Take photos of your rest and nocking point positions."
        />
        <InstructionStep
          number={9}
          title="Shoot a Final Confirmation Round"
          description="Shoot a full round at your competition distances (e.g., 20-30-40-50). Verify groups are consistent and centered at every distance. This is your tuned baseline."
        />
        <InstructionStep
          number={10}
          title="Know When to Stop"
          description="There is a point of diminishing returns. If you're grouping consistently under 3 inches at 50 yards, your tune is excellent. Further micro-adjustments may not yield measurable improvement."
          note="The biggest accuracy gains come from form practice, not further tuning. A well-tuned bow with poor form will always lose to a decently-tuned bow with excellent form."
        />
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipLabel}>Congratulations</Text>
        <Text style={styles.tipText}>
          If you've completed all 6 tuning methods, your bow is thoroughly tuned. From here, gains
          come from practice, form refinement, and mental game. Return to tuning only when you
          change equipment (new arrows, new string, rest replacement) or notice a sudden change in
          arrow flight.
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
  conceptCard: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: Radius.lg,
    padding: Spacing.md,
  },
  conceptText: {
    ...Typography.body,
    fontSize: FontSizes.sm,
    color: Colors.textPrimary,
    lineHeight: 22,
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
