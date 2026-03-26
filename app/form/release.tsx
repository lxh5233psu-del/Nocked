import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FormComponentLayout } from '@/components/form/FormComponentLayout';
import { FormSection, FormStep } from '@/components/form/FormSection';
import { CommonErrors } from '@/components/form/CommonErrors';
import { Card } from '@/components/ui/Card';
import { useAppStore } from '@/store/useAppStore';
import { Colors, Typography, Spacing, FontSizes } from '@/constants/theme';

export default function ReleaseScreen() {
  const releaseProfile = useAppStore((s) => s.releaseProfile);
  const releaseType = releaseProfile?.type;

  return (
    <FormComponentLayout
      componentNumber={6}
      totalComponents={8}
      title="Release Technique"
      principle="The release should be a surprise. You do not 'fire' the release — you continue pulling through the shot until the release breaks on its own. Conscious triggering leads to punching and target panic."
      nextRoute="/form/follow-through"
      nextLabel="Follow Through"
    >
      {/* Release type context */}
      {releaseType && (
        <Card style={styles.contextCard}>
          <Text style={styles.contextLabel}>Your Release Type</Text>
          <Text style={styles.contextValue}>{releaseType}</Text>
        </Card>
      )}

      {/* Universal principles */}
      <FormSection label="Universal Principles">
        <FormStep
          number={1}
          title="Back Tension is the Engine"
          description="Regardless of release type, the engine of the shot is back tension. Your rhomboids and rear deltoid continue to contract throughout the release — the release hand moves backward as a result of back engagement, not conscious hand action."
        />
        <FormStep
          number={2}
          title="Surprise Break"
          description="The release should break as a surprise. You know it's coming — you're building toward it — but the exact instant of release should not be consciously controlled. This prevents flinching and punching."
          note="If you can predict the exact moment of release, you are punching. Slow down the process."
        />
      </FormSection>

      {/* Release-type-specific instructions */}
      {(!releaseType || releaseType === 'Wrist strap') && (
        <FormSection label="Index Finger (Wrist Strap) Release">
          <FormStep
            number={3}
            title="Wrap Behind Trigger — Do Not Touch"
            description="At anchor, your index finger wraps behind the trigger but does not make contact with the trigger face. The trigger fires when back tension pulls your hand far enough that the finger contacts and activates the trigger."
          />
          <FormStep
            number={4}
            title="Pull Through — Not Punch"
            description="Continue driving your elbow back. The release fires as a result of increasing back tension, not a conscious squeeze. Think of pulling through the shot — your hand moves backward until the trigger breaks."
            note="The #1 cause of target panic is punching a wrist strap release. Train the pull-through method from the start."
          />
        </FormSection>
      )}

      {(!releaseType || releaseType === 'Thumb button') && (
        <FormSection label="Thumb Button Release">
          <FormStep
            number={3}
            title="Set Thumb on Button — Light Contact"
            description="Place your thumb on the button with light, consistent pressure. Do not squeeze yet. The thumb maintains constant light pressure throughout the aiming process."
          />
          <FormStep
            number={4}
            title="Increase Back Tension to Fire"
            description="Continue increasing back tension. As your hand moves backward through back engagement, the increasing angle between thumb and button activates the release. The thumb pressure stays constant — the back tension does the work."
          />
        </FormSection>
      )}

      {(!releaseType || releaseType === 'Hinge') && (
        <FormSection label="Hinge (Back Tension) Release">
          <FormStep
            number={3}
            title="Set the Hinge"
            description="At anchor, set the hinge in the half-moon position. The release handle should sit in your hand at the pre-set safety position. Do not rotate yet."
          />
          <FormStep
            number={4}
            title="Rotate Through Back Tension"
            description="Continue your back tension pull. As your hand rotates through increasing back engagement, the hinge rotates to its fire point. You do not consciously rotate the handle — the back tension causes the rotation."
            note="A hinge release is the best tool for training a true surprise release and eliminating target panic."
          />
        </FormSection>
      )}

      {(!releaseType || releaseType === 'Back tension') && (
        <FormSection label="Pure Back Tension Release">
          <FormStep
            number={3}
            title="Engage and Hold"
            description="At anchor with back tension engaged, the release is pre-loaded. Continue to increase back tension progressively — there is no trigger, button, or hinge to manipulate."
          />
          <FormStep
            number={4}
            title="Progressive Squeeze"
            description="The release fires purely from increasing back tension against the resistance of the release mechanism. This is the purest form of surprise release and requires the most back tension discipline."
          />
        </FormSection>
      )}

      <CommonErrors
        errors={[
          { error: 'Punching the trigger', consequence: 'Anticipation, flinching, target panic — the most destructive habit in archery' },
          { error: 'Command firing (conscious release)', consequence: 'Inconsistent timing, anticipation-based flinching, scattered groups' },
          { error: 'Dropping back tension at release', consequence: 'Arrow creeps forward, inconsistent energy transfer, low shots' },
          { error: 'Rushing the shot', consequence: 'Incomplete process, missed steps, poor execution under time pressure' },
          { error: 'Gripping the release too tightly', consequence: 'Creates hand tension that interferes with clean trigger activation' },
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
});
