import React from 'react';
import { FormComponentLayout } from '@/components/form/FormComponentLayout';
import { FormSection, FormStep } from '@/components/form/FormSection';
import { CommonErrors } from '@/components/form/CommonErrors';
import { FormIllustration, GripCorrect, GripIncorrect } from '@/components/form/svg/FormIllustration';

export default function GripScreen() {
  return (
    <FormComponentLayout
      componentNumber={2}
      totalComponents={8}
      title="Grip & Bow Hand"
      principle="The bow is a shelf, not a clamp. Minimal, consistent pressure through the thenar eminence — the muscle below your thumb. Fingers relaxed and open."
      nextRoute="/form/draw"
      nextLabel="Draw & Back Tension"
    >
      <FormIllustration
        correct={<GripCorrect />}
        incorrect={<GripIncorrect />}
        correctLabel="Relaxed — Open Fingers"
        incorrectLabel="Death Grip — Wrapped"
      />

      <FormSection label="The High Five Method">
        <FormStep
          number={1}
          title="Extend Your Bow Arm"
          description="Extend your bow arm forward as if reaching for a high five."
        />
        <FormStep
          number={2}
          title="Rotate 45 Degrees"
          description="Rotate your hand approximately 45 degrees so it angles inward. This is your grip position — the angle at which your hand naturally contacts the bow grip."
        />
        <FormStep
          number={3}
          title="Identify Contact Point"
          description="The primary contact point is the thenar eminence — the muscular pad below your thumb. The vertical centerline of the grip should bisect the middle of this muscle."
        />
      </FormSection>

      <FormSection label="Grip Technique">
        <FormStep
          number={4}
          title="Low Wrist Position"
          description="A low wrist is recommended. The wrist should be relaxed and low — not pushed forward (high wrist). A low wrist positions the contact point more consistently on the thenar eminence."
        />
        <FormStep
          number={5}
          title="Fingers Relaxed and Open"
          description="Your fingers should hang relaxed and open — not wrapped around the grip. Use a wrist sling if needed to prevent dropping the bow. The fingers are NOT part of the grip."
        />
        <FormStep
          number={6}
          title="Minimal Consistent Pressure"
          description="Apply the absolute minimum pressure needed. The bow pushes into your hand during the draw — you don't need to squeeze. Think of your hand as a shelf that the bow rests on."
        />
        <FormStep
          number={7}
          title="Natural Forward Fall Confirms Correct Grip"
          description="After the shot, the bow should tip naturally forward out of your hand (caught by the wrist sling). This confirms you were not gripping. If the bow stays upright, you were holding too tight."
        />
      </FormSection>

      <CommonErrors
        errors={[
          { error: 'Death grip', consequence: 'Induces torque on the riser, causes left/right impact inconsistency' },
          { error: 'High/forward wrist', consequence: 'Moves contact point off the thenar eminence, introduces inconsistent pressure' },
          { error: 'Grip crossing palm centerline', consequence: 'Shifts the pressure point, creates torque, affects arrow flight' },
          { error: 'Wrapped fingers', consequence: 'Adds lateral torque, prevents consistent bow hand pressure' },
        ]}
      />
    </FormComponentLayout>
  );
}
