import React from 'react';
import { FormComponentLayout } from '@/components/form/FormComponentLayout';
import { FormSection, FormStep } from '@/components/form/FormSection';
import { CommonErrors } from '@/components/form/CommonErrors';

export default function PeepAlignmentScreen() {
  return (
    <FormComponentLayout
      componentNumber={5}
      totalComponents={8}
      title="Peep & Sight Alignment"
      principle="The peep should align naturally with the sight housing at anchor — without searching. If you have to hunt for the peep, the problem is your anchor or peep position, not your eye."
      nextRoute="/form/release"
      nextLabel="Release Technique"
    >
      <FormSection label="Peep Alignment Sequence">
        <FormStep
          number={1}
          title="Close Eyes at Full Draw"
          description="Draw the bow with your eyes closed. Settle into your anchor — all contact points confirmed. This removes visual bias from the alignment check."
        />
        <FormStep
          number={2}
          title="Open Eyes — Observe Peep Position"
          description="Open your eyes. The peep should be centered on the sight housing immediately. Note where the peep actually is relative to the housing — high, low, left, right."
          note="Do this 3-5 times. If the peep lands in the same spot consistently but not centered on the housing, the peep needs to move — not your anchor."
        />
        <FormStep
          number={3}
          title="Adjust Peep — Not Anchor"
          description="If the peep is consistently high or low, move the peep on the string. Never adjust your anchor to find the peep. The peep serves the anchor, not the other way around."
        />
        <FormStep
          number={4}
          title="Confirm Natural Alignment"
          description="Once adjusted, repeat the eyes-closed test. The peep should now frame the sight housing perfectly every time without any head movement or searching."
        />
      </FormSection>

      <FormSection label="Sight Picture">
        <FormStep
          number={5}
          title="Pin Float — Accept It"
          description="Your pin will float around the target. This is normal at every level. Do not try to hold the pin perfectly still — it cannot be done. Accept the float and maintain your shot process."
          note="Attempting to stop pin float leads to target panic. Let the pin float and trust the process."
        />
        <FormStep
          number={6}
          title="Center the Housing"
          description="Focus on centering the sight housing within the peep aperture. The pin will settle near the target as a byproduct of consistent form — not forced aiming."
        />
        <FormStep
          number={7}
          title="Focus Sequence"
          description="Your eye should focus on the target (not the pin). The pin will appear slightly blurred in your peripheral vision. This is correct. Target-focused aiming produces better groups than pin-focused aiming."
        />
      </FormSection>

      <CommonErrors
        errors={[
          { error: 'Searching for the peep', consequence: 'Moves your head off anchor, introduces inconsistency in every shot' },
          { error: 'Adjusting anchor to find peep', consequence: 'Destroys anchor consistency — move the peep instead' },
          { error: 'Trying to stop pin float', consequence: 'Induces target panic, punch release, flinching' },
          { error: 'Pin-focused aiming', consequence: 'Reduces accuracy — target-focused aiming produces tighter groups' },
          { error: 'Inconsistent peep rotation', consequence: 'Peep not aligned on every draw — needs string twist adjustment' },
        ]}
      />
    </FormComponentLayout>
  );
}
