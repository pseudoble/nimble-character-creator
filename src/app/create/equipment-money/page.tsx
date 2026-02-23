"use client";

import { useCreator } from "@/lib/creator/context";
import { StepFourForm } from "@/lib/creator/step-four-form";
import { StepGuard } from "@/lib/creator/step-guard";
import { STEP_IDS } from "@/lib/creator/constants";

export default function EquipmentMoneyPage() {
  const { draft, updateStepFour, validation, showErrors } = useCreator();

  if (!draft) return null;

  const stepValidation = validation[STEP_IDS.EQUIPMENT_MONEY] || { valid: false, errors: {} };

  return (
    <StepGuard stepId={STEP_IDS.EQUIPMENT_MONEY}>
      <StepFourForm
        data={draft.stepFour}
        classId={draft.stepOne.classId}
        validation={showErrors ? stepValidation : { valid: stepValidation.valid, errors: {} }}
        onChange={updateStepFour}
      />
    </StepGuard>
  );
}
