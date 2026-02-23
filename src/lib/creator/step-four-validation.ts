import type { CreatorDraft, StepValidationResult } from "./types";

const VALID_CHOICES = ["gear", "gold"] as const;

export function validateStepFour(draft: CreatorDraft): StepValidationResult {
  const errors: Record<string, string> = {};
  const choice = draft.stepFour.equipmentChoice;

  if (!choice) {
    errors.equipmentChoice = "Please choose starting gear or gold";
  } else if (!VALID_CHOICES.includes(choice as (typeof VALID_CHOICES)[number])) {
    errors.equipmentChoice = "Invalid equipment choice";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
