import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormComponentLayout } from '@/components/form/FormComponentLayout';
import { FormSection, FormStep } from '@/components/form/FormSection';
import { CommonErrors } from '@/components/form/CommonErrors';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

export default function AnchorScreen() {
  const releaseProfile = useAppStore((s) => s.releaseProfile);
  const releaseType = releaseProfile?.type;

  // Anchor jaw reference depends on release type
  const jawReference =
    releaseType === 'Wrist strap'
      ? 'under the jaw (index finger release style)'
      : releaseType === 'Thumb button' || releaseType === 'Hinge' || releaseType === 'Back tension'
      ? 'at the point of the jaw (thumb/hinge style)'
      : 'at the jaw (adjust based on your release type)';

  return (
    <FormComponentLayout
      componentNumber={4}
      totalComponents={8}
      title="Anchor Point"
      principle="Anchor is a set of consistent contact points between your release hand, face, and the bowstring. Every contact point must be the same on every shot — no exceptions."
      nextRoute="/form/peep-alignment"
      nextLabel="Peep & Sight Alignment"
    >
      {/* Release type context */}
      {releaseType && (
        <Card style={styles.contextCard}>
          <Text style={styles.contextLabel}>Your Release Type</Text>
          <Text style={styles.contextValue}>{releaseType}</Text>
          <Text style={styles.contextNote}>
            Jaw reference: {jawReference}
          </Text>
        </Card>
      )}

      <FormSection label="Anchor Sequence">
        <FormStep
          number={1}
          title="Pull into Draw Stops"
          description="Complete the draw into the wall. Maintain active back tension. Do not begin anchoring until you are firmly against the stops."
        />
        <FormStep
          number={2}
          title="Bring Release Hand to Face"
          description={`Bring the release hand to your face. Your knuckles should contact ${jawReference}. This is a tactile reference — you should feel consistent pressure at this point.`}
        />
        <FormStep
          number={3}
          title="Bring HEAD to String"
          description="Move your HEAD into position to contact the string — touch your nose to the string. Critical: the head moves to the string, not the string to the head. Do not crane your neck forward."
          note="This distinction is key. If you move the string to your face, you'll shift your anchor with every draw."
        />
        <FormStep
          number={4}
          title="Verify String at Corner of Mouth"
          description="Confirm the bowstring contacts the corner of your mouth. This is your second face contact point and provides lateral consistency."
        />
        <FormStep
          number={5}
          title="Verify Peep Alignment"
          description="The peep should align naturally with the sight housing without searching. If you have to hunt for the peep, your anchor or peep position needs adjustment."
        />
        <FormStep
          number={6}
          title="Sight Picture — Now Aim"
          description="Once all contact points are confirmed and the peep is aligned, your sight picture appears. Now begin aiming. Do not aim until all contacts are verified."
          note="Never force your anchor. If any contact point is missing, let down safely and reset."
        />
      </FormSection>

      <CommonErrors
        errors={[
          { error: 'Inconsistent jaw contact', consequence: 'Vertical point of impact shifts — most common anchor error' },
          { error: 'Moving string to face (not head to string)', consequence: 'Inconsistent nose contact, lateral shift in anchor point' },
          { error: 'Searching for peep', consequence: 'Indicates anchor inconsistency or incorrect peep height — address root cause' },
          { error: 'Aiming before anchor is set', consequence: 'Rushing leads to incomplete anchor, scattered impact points' },
          { error: 'Forcing anchor', consequence: 'Creates tension and inconsistency — let down and reset instead' },
        ]}
      />
    </FormComponentLayout>
  );
}

const styles = StyleSheet.create({
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
    fontSize: FontSizes.base,
    color: Colors.textPrimary,
  },
  contextNote: {
    ...Typography.body,
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
