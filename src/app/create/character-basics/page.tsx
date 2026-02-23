"use client";

import { useCreator } from "@/lib/creator/context";
import { StepOneForm } from "@/lib/creator/step-one-form";
import { getValidClassIds } from "@/lib/creator/step-one-validation";
import { StepGuard } from "@/lib/creator/step-guard";
import { STEP_IDS } from "@/lib/creator/constants";

export default function CharacterBasicsPage() {
  const { draft, updateStepOne, validation, showErrors } = useCreator();
  const classIds = getValidClassIds();

  if (!draft) return null;

  const stepValidation = validation[STEP_IDS.CHARACTER_BASICS] || { valid: false, errors: {} };

  return (
    <StepGuard stepId={STEP_IDS.CHARACTER_BASICS}>
      <StepOneForm
        data={draft.stepOne}
        classIds={classIds}
        validation={showErrors ? stepValidation : { valid: stepValidation.valid, errors: {} }}
        onChange={updateStepOne}
      />
    </StepGuard>
  );
}
