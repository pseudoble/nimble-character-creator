"use client";

import { useCreator } from "@/lib/creator/context";
import { StepTwoForm } from "@/lib/creator/step-two-form";
import { getValidAncestryIds, getValidBackgroundIds } from "@/lib/creator/step-two-validation";
import { StepGuard } from "@/lib/creator/step-guard";
import { STEP_IDS } from "@/lib/creator/constants";

export default function AncestryBackgroundPage() {
  const { draft, updateStepTwo, validation, showErrors } = useCreator();
  const ancestryIds = getValidAncestryIds();
  const backgroundIds = getValidBackgroundIds();

  if (!draft) return null;

  const stepValidation = validation[STEP_IDS.ANCESTRY_BACKGROUND] || { valid: false, errors: {} };

  return (
    <StepGuard stepId={STEP_IDS.ANCESTRY_BACKGROUND}>
      <StepTwoForm
        data={draft.stepTwo}
        ancestryIds={ancestryIds}
        backgroundIds={backgroundIds}
        validation={showErrors ? stepValidation : { valid: stepValidation.valid, errors: {} }}
        onChange={updateStepTwo}
      />
    </StepGuard>
  );
}
