"use client";

import { useCreator } from "@/lib/creator/context";
import { StepFourForm } from "@/lib/creator/step-four-form";
import { StepGuard } from "@/lib/creator/step-guard";
import { STEP_IDS } from "@/lib/creator/constants";

export default function LanguagesEquipmentPage() {
  const { draft, updateStepFour, validation, showErrors } = useCreator();

  if (!draft) return null;

  const stepValidation = validation[STEP_IDS.LANGUAGES_EQUIPMENT] || { valid: false, errors: {} };
  const intStat = Number.parseInt(draft.stepThree.stats.int, 10) || 0;

  return (
    <StepGuard stepId={STEP_IDS.LANGUAGES_EQUIPMENT}>
      <StepFourForm
        data={draft.stepFour}
        classId={draft.stepOne.classId}
        ancestryId={draft.stepTwo.ancestryId}
        intStat={intStat}
        validation={showErrors ? stepValidation : { valid: stepValidation.valid, errors: {} }}
        onChange={updateStepFour}
      />
    </StepGuard>
  );
}
