import React from 'react';
import { FormComponentLayout } from '@/components/form/FormComponentLayout';
import { FormSection, FormStep } from '@/components/form/FormSection';
import { CommonErrors } from '@/components/form/CommonErrors';
import { FormIllustration, DrawCorrect, DrawIncorrect } from '@/components/form/svg/FormIllustration';

export default function DrawScreen() {
  return (
    <FormComponentLayout
      componentNumber={3}
      totalComponents={8}
      title="Draw & Back Tension"
      principle="The draw is initiated and maintained with back muscles — rhomboids and rear deltoid. The bow shoulder sets DOWN before the draw begins. The elbow drives back and around."
      nextRoute="/form/anchor"
      nextLabel="Anchor Point"
    >
      <FormIllustration
        correct={<DrawCorrect />}
        incorrect={<DrawIncorrect />}
        correctLabel="Shoulder Down — Back Engaged"
        incorrectLabel="Shoulder Up — Arm Pulling"
      />

      <FormSection label="Draw Sequence">
        <FormStep
          number={1}
          title="Set Grip"
          description="Establish your grip on the bow using the technique from the Grip component. Thenar eminence contact, relaxed fingers, low wrist."
        />
        <FormStep
          number={2}
          title="Set Bow Shoulder"
          description="Raise the bow ABOVE the draw line. Before initiating the draw, press your bow shoulder DOWN and into the socket. The shoulder must be set low before any drawing force is applied."
          note="This is the most critical step. A raised bow shoulder is the #1 form error in compound archery."
        />
        <FormStep
          number={3}
          title="Initiate Draw with Back"
          description="Begin the draw using your back muscles — specifically the rhomboids (between your shoulder blades) and rear deltoid. Think of your drawing elbow driving BACK and AROUND, not your hand pulling the string."
        />
        <FormStep
          number={4}
          title="Pull Firmly into Draw Stops"
          description="Pull through the entire draw cycle into the draw stops (the wall). When you reach the wall, maintain active back tension — do not relax. You should feel the engagement in your back muscles throughout the hold."
          note="Relaxing at the wall is a common cause of inconsistency and target panic."
        />
      </FormSection>

      <CommonErrors
        errors={[
          { error: 'Raised bow shoulder', consequence: 'Creates shoulder impingement, inconsistent draw path, fatigue, injury risk' },
          { error: 'Arm pulling (bicep draw)', consequence: 'Inconsistent draw path, rapid fatigue, poor back tension engagement' },
          { error: 'Not reaching the wall', consequence: 'Incomplete draw cycle, inconsistent anchor, arrow speed variation' },
          { error: 'Relaxing at the wall', consequence: 'Loss of back tension, creeping forward, punch release, target panic' },
        ]}
      />
    </FormComponentLayout>
  );
}
