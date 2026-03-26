import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { TuningStepLayout } from '@/components/tuning/TuningStepLayout';
import { InstructionStep } from '@/components/setup/InstructionStep';
import { ToolCheck } from '@/components/setup/ToolCheck';
import { DiagnosisTable } from '@/components/setup/DiagnosisTable';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, Radius, FontSizes } from '@/constants/theme';

export default function WalkBackScreen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const markTuningModuleComplete = useAppStore((s) => s.markTuningModuleComplete);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const handleComplete = () => {
    if (activeBowId) {
      markTuningModuleComplete(activeBowId, 'walk-back');
      setLastSession({ module: 'Tune', step: 'Walk-Back Tuning', timestamp: Date.now() });
    }
    router.back();
  };

  return (
    <TuningStepLayout
      title="Walk-Back Tuning"
      subtitle="Walk-back tuning verifies your centershot alignment. If your rest is perfectly centered, arrows shot at increasing distances will all land on the same vertical line."
      prerequisite="Paper tune complete. Sight zeroed at 20 yards."
      onComplete={handleComplete}
      completeLabel="Mark Walk-Back Complete"
    >
      <ToolCheck required={['Allen wrench set', 'Measuring tape']} />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Setup</Text>
        <InstructionStep
          number={1}
          title="Hang a Vertical Reference Line"
          description="Attach a vertical line (plumb line, tape, or string) to the target face running from top to bottom. This is your reference. You can also use a vertical stripe on the target."
        />
        <InstructionStep
          number={2}
          title="Place a Dot at the Top"
          description="Place a single aiming dot at the top of the vertical line. You will aim at this SAME dot from every distance. Do not move your aiming point."
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Shooting Process</Text>
        <InstructionStep
          number={3}
          title="Shoot at 20 Yards — Aim at the Dot"
          description="Using your 20-yard pin, shoot one arrow at the dot. This arrow should hit at or very near the dot (since you're sighted in at 20). This is your baseline."
        />
        <InstructionStep
          number={4}
          title="Walk Back to 30 Yards — Same Pin, Same Dot"
          description="Move back to 30 yards. Using the SAME 20-yard pin, aim at the SAME dot. Shoot one arrow. The arrow will hit low (because you're farther away) — that's expected. What matters is LEFT/RIGHT alignment."
        />
        <InstructionStep
          number={5}
          title="Continue to 40, 50, 60 Yards"
          description="Repeat at 40, 50, and 60 yards (or as far as your range allows). Always aim at the same dot with the same 20-yard pin. Each arrow hits progressively lower — that's normal."
        />
        <InstructionStep
          number={6}
          title="Read the Pattern"
          description="Look at the vertical alignment of all your arrows. If they all landed on the vertical reference line (just at different heights), your centershot is perfect. If they drift left or right, your rest needs adjustment."
        />
      </View>

      <DiagnosisTable
        title="Walk-Back Results"
        rows={[
          { condition: 'Arrows form a vertical line', result: 'Centershot is correct', action: 'No adjustment needed' },
          { condition: 'Arrows drift LEFT at distance', result: 'Rest too far left', action: 'Move rest RIGHT (toward riser) in small increments' },
          { condition: 'Arrows drift RIGHT at distance', result: 'Rest too far right', action: 'Move rest LEFT (away from riser) in small increments' },
          { condition: 'Erratic left/right pattern', result: 'Form inconsistency', action: 'Work on form, re-test. Possibly spine issue' },
        ]}
      />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Fine-Tuning</Text>
        <InstructionStep
          number={7}
          title="Adjust Rest — Small Moves"
          description="If arrows drifted, move the rest 1/64 inch (one click) in the appropriate direction. Then repeat the entire walk-back sequence. Continue until arrows form a straight vertical line."
        />
        <InstructionStep
          number={8}
          title="Re-Sight at 20 Yards"
          description="After any rest adjustment, re-confirm your 20-yard zero. Moving the rest may shift your point of impact at 20 yards. Adjust the sight pin if needed."
        />
      </View>

      <View style={styles.tipCard}>
        <Text style={styles.tipLabel}>Why This Works</Text>
        <Text style={styles.tipText}>
          Walk-back tuning amplifies small centershot errors. At 20 yards, a slight rest misalignment
          may only produce a 1/2-inch error. At 60 yards, that same misalignment produces a 3-inch
          error — making it easy to see and correct.
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
