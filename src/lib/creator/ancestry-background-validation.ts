import { z } from "zod";
import { MAX_MOTIVATION_LENGTH } from "./constants";
import type { CreatorDraft, StepValidationResult } from "./types";

export function getValidAncestryIds(): string[] {
  return [
    "human", "elf", "dwarf", "halfling", "gnome", "bunbun",
    "dragonborn", "fiendkin", "goblin", "kobold", "orc",
    "birdfolk", "celestial", "changeling", "crystalborn",
    "dryad-shroomling", "half-giant", "minotaur-beastfolk",
    "oozeling-construct", "planarbeing", "ratfolk", "stoatling",
    "turtlefolk", "wyrdling",
  ];
}

export function getValidBackgroundIds(): string[] {
  return [
    "academy-dropout", "acrobat", "accidental-acrobat",
    "at-home-underground", "back-out-of-retirement", "bumblewise",
    "devoted-protector", "fearless", "fey-touched",
    "former-con-artist", "haunted-past", "history-buff",
    "home-at-sea", "made-a-bad-choice", "raised-by-goblins",
    "secretly-undead", "so-dumb-im-smart-sometimes", "survivalist",
    "taste-for-the-finer-things", "tradesman-artisan",
    "what-ive-been-around", "wild-one", "wily-underdog",
  ];
}

export const AncestryBackgroundSchema = z.object({
  ancestryId: z.string().min(1, "Ancestry is required"),
  backgroundId: z.string().min(1, "Background is required"),
  motivation: z.string().max(MAX_MOTIVATION_LENGTH, `Motivation must be ${MAX_MOTIVATION_LENGTH} characters or less`),
});

export function validateAncestryBackground(draft: CreatorDraft, validAncestryIds?: string[], validBackgroundIds?: string[]): StepValidationResult {
  const ancestryIds = validAncestryIds ?? getValidAncestryIds();
  const backgroundIds = validBackgroundIds ?? getValidBackgroundIds();
  const result = AncestryBackgroundSchema.safeParse(draft.ancestryBackground);
  const errors: Record<string, string> = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as string;
      if (!errors[field]) {
        errors[field] = issue.message;
      }
    }
  } else {
    if (!ancestryIds.includes(result.data.ancestryId)) {
      errors.ancestryId = "Selected ancestry is not valid";
    }
    if (!backgroundIds.includes(result.data.backgroundId)) {
      errors.backgroundId = "Selected background is not valid";
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
