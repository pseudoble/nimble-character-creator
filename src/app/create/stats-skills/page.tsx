"use client";

import { useCreator } from "@/lib/creator/context";
import { StepThreeForm } from "@/lib/creator/step-three-form";
import { getValidStatArrayIds, getValidSkillIds } from "@/lib/creator/step-three-validation";
import { StepGuard } from "@/lib/creator/step-guard";
import { STEP_IDS } from "@/lib/creator/constants";

export default function StatsSkillsPage() {
  const { draft, updateStepThree, validation, showErrors } = useCreator();
  const statArrayIds = getValidStatArrayIds();
  const skillIds = getValidSkillIds();

  if (!draft) return null;

  const stepValidation = validation[STEP_IDS.STATS_SKILLS] || { valid: false, errors: {} };

  return (
    <StepGuard stepId={STEP_IDS.STATS_SKILLS}>
      <StepThreeForm
        data={draft.stepThree}
        statArrayIds={statArrayIds}
        skillIds={skillIds}
        validation={showErrors ? stepValidation : { valid: stepValidation.valid, errors: {} }}
        onChange={updateStepThree}
      />
    </StepGuard>
  );
}
