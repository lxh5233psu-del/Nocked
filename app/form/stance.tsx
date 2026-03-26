import React from 'react';
import { FormComponentLayout } from '@/components/form/FormComponentLayout';
import { FormSection, FormStep } from '@/components/form/FormSection';
import { CommonErrors } from '@/components/form/CommonErrors';
import { FormIllustration, StanceCorrect, StanceIncorrect } from '@/components/form/svg/FormIllustration';

export default function StanceScreen() {
  return (
    <FormComponentLayout
      componentNumber={1}
      totalComponents={8}
      title="Stance"
      principle="A stable, repeatable base creates the foundation for every shot. Consistency over style — find what is natural and repeat it."
      nextRoute="/form/grip"
      nextLabel="Grip & Bow Hand"
    >
      <FormIllustration
        correct={<StanceCorrect />}
        incorrect={<StanceIncorrect />}
      />

      <FormSection label="Instruction">
        <FormStep
          number={1}
          title="Feet Shoulder Width Apart"
          description="Place your feet at roughly shoulder width. This provides a stable base without restricting upper body rotation. Too narrow and you'll sway; too wide and you'll be rigid."
        />
        <FormStep
          number={2}
          title="Body 60–90 Degrees to Target"
          description="Stand with your body angled 60-90 degrees relative to the target — not 45 degrees. A more open stance allows your bow shoulder to set properly and your draw arm to achieve correct alignment."
        />
        <FormStep
          number={3}
          title="Slight Bend in Knees"
          description="Keep a slight, soft bend in both knees. Locked knees create tension that transfers up through the entire body. Think 'athletic ready position.'"
        />
        <FormStep
          number={4}
          title="Stand Tall — No Lean"
          description="Stand fully upright with your weight distributed evenly between both feet. Do not lean forward, backward, or to either side. Imagine a string pulling you up from the top of your head."
        />
        <FormStep
          number={5}
          title="Relaxed, Level Shoulders"
          description="Let your shoulders sit naturally — not raised, not forced down. Both shoulders should be at the same height. Tension here will telegraph through your entire shot."
        />
        <FormStep
          number={6}
          title="Consistency Over Style"
          description="The exact angle and width matter less than doing it the same way every time. Find what feels natural and balanced, then repeat it without variation."
        />
      </FormSection>

      <CommonErrors
        errors={[
          { error: 'Narrow base', consequence: 'Reduced stability, lateral sway under draw tension' },
          { error: 'Locked knees', consequence: 'Tension chain from legs through torso, fatigue, balance issues' },
          { error: 'Forward lean', consequence: 'Shifts center of gravity, inconsistent anchor, back pain' },
          { error: 'Raised shoulders', consequence: 'Creates tension in the draw cycle, prevents proper bow shoulder set' },
        ]}
      />
    </FormComponentLayout>
  );
}
