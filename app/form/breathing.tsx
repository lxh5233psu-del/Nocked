import React from 'react';
import { FormComponentLayout } from '@/components/form/FormComponentLayout';
import { FormSection, FormStep } from '@/components/form/FormSection';
import { CommonErrors } from '@/components/form/CommonErrors';

export default function BreathingScreen() {
  return (
    <FormComponentLayout
      componentNumber={8}
      totalComponents={8}
      title="Breathing"
      principle="Breathing provides a timing mechanism for your shot. A consistent breathing pattern creates a natural shot window, reduces muscle tension, and gives your subconscious mind a rhythm to follow."
    >
      <FormSection label="Breathing Sequence">
        <FormStep
          number={1}
          title="Full Breath Before Drawing"
          description="Take one full, deep breath before raising the bow. Inhale through your nose, filling your lungs completely. This oxygenates your muscles and establishes a calm starting point."
        />
        <FormStep
          number={2}
          title="Exhale as You Draw"
          description="Begin your exhale as you initiate the draw. A slow, controlled exhale during the draw helps maintain steady tension and prevents breath-holding, which causes muscle tremor."
        />
        <FormStep
          number={3}
          title="Half Breath at Anchor"
          description="At anchor, take a half breath — a shallow inhale, then a slow partial exhale. Settle at the natural respiratory pause (the bottom of a normal exhale). This is your shot window."
          note="The natural respiratory pause is the stillest your body gets. This is where you execute the shot."
        />
        <FormStep
          number={4}
          title="Execute During the Pause"
          description="Begin your aiming and back tension increase during the respiratory pause. The shot should break within this window — typically 3-5 seconds. Do not hold your breath beyond this."
        />
        <FormStep
          number={5}
          title="Let Down if Window Closes"
          description="If the shot does not break within your breathing window (roughly 5-7 seconds at anchor), let down. Do not force the shot. Holding too long leads to oxygen deprivation, muscle tremor, and deteriorating form."
          note="Letting down is not failure — it is discipline. A controlled let-down prevents bad habits."
        />
      </FormSection>

      <FormSection label="Shot Mantra">
        <FormStep
          number={6}
          title="Develop a Mental Cue"
          description="Use a simple internal mantra during your shot sequence. Examples: 'Pull, pull, pull' during back tension, or 'Squeeze, squeeze' during release. The mantra occupies your conscious mind so the release stays subconscious."
        />
        <FormStep
          number={7}
          title="Same Words, Every Shot"
          description="Whatever mantra you choose, use the same one on every single shot. Consistency in your mental process is as important as consistency in your physical process. The mantra becomes part of your shot sequence."
        />
      </FormSection>

      <CommonErrors
        errors={[
          { error: 'Holding breath during aim', consequence: 'Muscle tremor, oxygen deprivation, increased pin float, rushed shot' },
          { error: 'No consistent breathing pattern', consequence: 'Variable timing, different muscle tension on each shot' },
          { error: 'Holding too long at anchor', consequence: 'Fatigue, increased tremor, deteriorating form — let down instead' },
          { error: 'Forcing shot outside window', consequence: 'Oxygen-deprived muscles produce poor execution — reset and try again' },
        ]}
      />
    </FormComponentLayout>
  );
}
