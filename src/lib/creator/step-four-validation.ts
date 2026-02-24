import type { CreatorDraft, StepValidationResult } from "./types";
import languages from "@/lib/core-data/data/languages.json";

const VALID_CHOICES = ["gear", "gold"] as const;
const VALID_LANGUAGE_IDS = new Set(languages.map((l) => l.id));

export function validateStepFour(draft: CreatorDraft): StepValidationResult {
  const errors: Record<string, string> = {};
  const choice = draft.stepFour.equipmentChoice;

  if (!choice) {
    errors.equipmentChoice = "Please choose starting gear or gold";
  } else if (!VALID_CHOICES.includes(choice as (typeof VALID_CHOICES)[number])) {
    errors.equipmentChoice = "Invalid equipment choice";
  }

  const intStat = Number.parseInt(draft.stepThree.stats.int, 10) || 0;
  const selected = draft.stepFour.selectedLanguages;

  if (intStat > 0) {
    if (selected.length !== intStat) {
      errors.languages = `Select exactly ${intStat} additional language${intStat > 1 ? "s" : ""}`;
    } else {
      const uniqueIds = new Set(selected);
      if (uniqueIds.size !== selected.length) {
        errors.languages = "Duplicate language selections are not allowed";
      } else if (!selected.every((id) => VALID_LANGUAGE_IDS.has(id))) {
        errors.languages = "Invalid language selection";
      }
    }
  } else if (selected.length > 0) {
    errors.languages = "No additional languages can be selected with current INT";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
