import { z } from "zod";
import { MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH } from "./constants";
import type { CreatorDraft, StepValidationResult } from "./types";

export function getValidClassIds(): string[] {
  // Dynamically import would add complexity; use static list validated against core-data in tests
  return [
    "berserker", "cheat", "commander", "hunter", "mage",
    "oathsworn", "shadowmancer", "shepherd", "songweaver",
    "stormshifter", "zephyr",
  ];
}

export const StepOneSchema = z.object({
  classId: z.string().min(1, "Class is required"),
  name: z.string().trim().min(1, "Name is required").max(MAX_NAME_LENGTH, `Name must be ${MAX_NAME_LENGTH} characters or less`),
  description: z.string().max(MAX_DESCRIPTION_LENGTH, `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`),
});

export function validateStepOne(draft: CreatorDraft, validClassIds?: string[]): StepValidationResult {
  const classIds = validClassIds ?? getValidClassIds();
  const result = StepOneSchema.safeParse(draft.stepOne);
  const errors: Record<string, string> = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      if (!errors[field]) {
        errors[field] = issue.message;
      }
    }
  } else {
    if (!classIds.includes(result.data.classId)) {
      errors.classId = "Selected class is not valid";
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
