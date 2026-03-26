import React from 'react';
import { FormComponentLayout } from '@/components/form/FormComponentLayout';
import { FormSection, FormStep } from '@/components/form/FormSection';
import { CommonErrors } from '@/components/form/CommonErrors';
import { FormIllustration, FollowThroughCorrect, FollowThroughIncorrect } from '@/components/form/svg/FormIllustration';

export default function FollowThroughScreen() {
  return (
    <FormComponentLayout
      componentNumber={7}
      totalComponents={8}
      title="Follow Through"
      principle="Follow through is the diagnostic of your shot. It is not something you 'do' — it is the natural result of correct execution. A good follow through confirms everything before it was right."
      nextRoute="/form/breathing"
      nextLabel="Breathing"
    >
      <FormIllustration
        correct={<FollowThroughCorrect />}
        incorrect={<FollowThroughIncorrect />}
        correctLabel="Hand Back — Bow Tips Forward"
        incorrectLabel="Dead Hand — Bow Drops"
      />

      <FormSection label="Correct Follow Through">
        <FormStep
          number={1}
          title="Release Hand Fires Backward"
          description="After the release breaks, your release hand should fire backward along your jawline toward your rear shoulder. This is the natural result of continued back tension — not a conscious movement."
          note="If your hand stays in place ('dead hand'), you were not pulling through the shot."
        />
        <FormStep
          number={2}
          title="Bow Arm Stays Up"
          description="Your bow arm remains at target height after the shot. It does not drop. Dropping the bow arm indicates you were anticipating the shot and collapsing forward."
        />
        <FormStep
          number={3}
          title="Bow Tips Forward"
          description="If your grip is correct (relaxed, no wrap), the bow will tip forward naturally after the shot, caught by your wrist sling. This confirms minimal hand contact and correct grip pressure."
        />
        <FormStep
          number={4}
          title="Hold Position — Watch the Arrow"
          description="Maintain your follow through position until the arrow hits the target. Do not move. This 'hold' confirms you did not flinch or collapse at the shot."
        />
      </FormSection>

      <FormSection label="Reading Your Follow Through">
        <FormStep
          number={5}
          title="Hand Back = Good Back Tension"
          description="Release hand firing back along jaw confirms you were pulling through the shot with back tension. This is the most reliable indicator of a properly executed release."
        />
        <FormStep
          number={6}
          title="Dead Hand = No Pull Through"
          description="If your release hand stays at anchor or moves forward, you punched the trigger or dropped back tension at the shot. This is the follow through telling you what went wrong."
        />
        <FormStep
          number={7}
          title="Bow Drop = Anticipation"
          description="If your bow arm drops at the shot, you anticipated the release. Your body flinched in preparation for the shot instead of continuing the process. Address with surprise release training."
        />
      </FormSection>

      <CommonErrors
        errors={[
          { error: 'Dead release hand', consequence: 'Indicates punching or lack of back tension — the release was command-fired' },
          { error: 'Dropping the bow arm', consequence: 'Anticipation flinch — arrows will impact low consistently' },
          { error: 'Peeking (looking over the bow)', consequence: 'Head lifts off string, destroys anchor, arrows go low and erratic' },
          { error: 'Collapsing forward', consequence: 'Loss of back tension at shot, arrow creep, inconsistent impact' },
        ]}
      />
    </FormComponentLayout>
  );
}
