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

export default function PaperTuneScreen() {
  const activeBowId = useAppStore((s) => s.activeBowId);
  const markTuningModuleComplete = useAppStore((s) => s.markTuningModuleComplete);
  const setLastSession = useAppStore((s) => s.setLastSession);

  const handleComplete = () => {
    if (activeBowId) {
      markTuningModuleComplete(activeBowId, 'paper');
      setLastSession({ module: 'Tune', step: 'Paper Tuning', timestamp: Date.now() });
    }
    router.back();
  };

  return (
    <TuningStepLayout
      title="Paper Tuning"
      subtitle="Shoot through paper at close range to diagnose arrow flight. The tear pattern reveals nock travel direction and indicates rest, nocking point, or spine issues."
      prerequisite="Initial sight-in at 20 yards complete. Arrow flying reasonably straight."
      onComplete={handleComplete}
      completeLabel="Mark Paper Tune Complete"
    >
      <ToolCheck
        required={['Paper tuning frame', 'Allen wrench set']}
        optional={['Bow press']}
      />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Setup</Text>
        <InstructionStep
          number={1}
          title="Position Paper Frame"
          description="Set up the paper tuning frame approximately 6 feet from where you'll shoot. The paper should be taut and at arrow-height. Place a target behind the paper to catch the arrow."
        />
        <InstructionStep
          number={2}
          title="Stand 4–6 Feet from Paper"
          description="Stand 4-6 feet from the paper. This short distance captures the initial arrow flight before the fletching has time to correct any issues. Shooting from too far back will mask problems."
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Shooting Process</Text>
        <InstructionStep
          number={3}
          title="Shoot Through Paper — Level"
          description="Draw and shoot one arrow through the paper using your best form. Keep the bow level. Do not aim at a specific spot on the paper — just shoot through it cleanly."
          note="Form matters here. A bad release will produce a bad tear regardless of tune. Shoot multiple arrows and look for a consistent tear pattern."
        />
        <InstructionStep
          number={4}
          title="Read the Tear"
          description="Examine the tear from the back side of the paper (arrow exit side). The bullet hole is where the point passed through. The tear direction shows which way the nock end of the arrow was traveling."
        />
      </View>

      <DiagnosisTable
        title="Paper Tear Diagnosis"
        rows={[
          { condition: 'Bullet hole (clean)', result: 'Perfect flight', action: 'No adjustment needed — ideal result' },
          { condition: 'Nock LEFT tear', result: 'Nock kicking left', action: 'Move rest slightly RIGHT (toward riser)' },
          { condition: 'Nock RIGHT tear', result: 'Nock kicking right', action: 'Move rest slightly LEFT (away from riser)' },
          { condition: 'Nock HIGH tear', result: 'Nock kicking up', action: 'Move nocking point/D-loop UP, or lower rest slightly' },
          { condition: 'Nock LOW tear', result: 'Nock kicking down', action: 'Move nocking point/D-loop DOWN, or raise rest slightly' },
          { condition: 'Large diagonal tear', result: 'Multiple issues', action: 'Address vertical first, then horizontal' },
          { condition: 'Erratic/inconsistent tears', result: 'Form or spine issue', action: 'Check form, arrow spine, or contact points' },
        ]}
      />

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Adjustment Process</Text>
        <InstructionStep
          number={5}
          title="Make Small Adjustments"
          description="Move the rest in 1/64-inch increments (one click on most rests). For nocking point issues, move the D-loop in 1/32-inch increments. Always make one adjustment at a time."
        />
        <InstructionStep
          number={6}
          title="Re-Shoot Through Paper"
          description="After each adjustment, shoot through paper again. Compare the new tear to the previous one. Continue until you achieve a bullet hole or minimal tear (under 1/2 inch)."
        />
        <InstructionStep
          number={7}
          title="Confirm with 3 Consecutive Tears"
          description="Once you achieve a good tear, shoot 3 consecutive arrows through fresh paper. All 3 should show consistent bullet holes or minimal tears. This confirms the tune is repeatable."
        />
      </View>

      <SafetyWarning message="Never retrieve arrows from behind the paper frame while others are shooting. Treat the area behind the paper as a live range at all times." />

      <View style={styles.tipCard}>
        <Text style={styles.tipLabel}>Common Misconceptions</Text>
        <Text style={styles.tipText}>
          Paper tuning is a diagnostic tool, not the final word on your tune. A perfect paper tear
          at 6 feet does not guarantee perfect arrow flight at 60 yards. Use paper tuning to get
          close, then validate with walk-back and bare shaft methods.
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
