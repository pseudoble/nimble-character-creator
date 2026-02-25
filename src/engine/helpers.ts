import type { DerivedValueKey } from "./types";
import { ancestries } from "./content/ancestries";
import { backgrounds } from "./content/backgrounds";

/**
 * Get the flat skill modifier for a given skill from ancestry and background bonuses.
 * Replacement for the old getFlatSkillModifier from trait-modifiers.ts.
 */
export function getSkillModifier(
  skillId: string,
  ancestryId: string,
  backgroundId: string
): number {
  let total = 0;
  const target = skillId as DerivedValueKey;

  const ancestry = ancestries[ancestryId];
  if (ancestry) {
    for (const bonus of ancestry.bonuses) {
      if (bonus.target === target && typeof bonus.value === "number") {
        total += bonus.value;
      }
    }
  }

  const background = backgrounds[backgroundId];
  if (background) {
    for (const bonus of background.bonuses) {
      if (bonus.target === target && typeof bonus.value === "number") {
        total += bonus.value;
      }
    }
  }

  return total;
}
