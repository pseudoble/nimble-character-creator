import { z } from "zod";
import { MIN_SKILL_POINTS_PER_SKILL } from "./constants";
import {
  MAX_SKILL_TOTAL_BONUS,
  STARTING_SKILL_POINTS,
} from "@/lib/constants";
import type { CreatorDraft, StepValidationResult } from "./types";
import statArrays from "@/lib/core-data/data/stat-arrays.json";
import skills from "@/lib/core-data/data/skills.json";
import { getSkillModifier } from "@/engine/helpers";

export const VALID_STAT_ARRAY_IDS = ["standard", "balanced", "min-max"] as const;
export const VALID_SKILL_IDS = [
  "arcana",
  "examination",
  "finesse",
  "influence",
  "insight",
  "lore",
  "might",
  "naturecraft",
  "perception",
  "stealth",
] as const;

const STAT_FIELD_LABELS = {
  str: "STR",
  dex: "DEX",
  int: "INT",
  wil: "WIL",
} as const;

const STAT_FIELDS = ["str", "dex", "int", "wil"] as const;

type StatField = (typeof STAT_FIELDS)[number];

const StatsSkillsSchema = z.object({
  statArrayId: z.string().min(1, "Stat array is required"),
  stats: z.object({
    str: z.string().min(1, "STR assignment is required").regex(/^-?\d+$/, "STR assignment must be numeric"),
    dex: z.string().min(1, "DEX assignment is required").regex(/^-?\d+$/, "DEX assignment must be numeric"),
    int: z.string().min(1, "INT assignment is required").regex(/^-?\d+$/, "INT assignment must be numeric"),
    wil: z.string().min(1, "WIL assignment is required").regex(/^-?\d+$/, "WIL assignment must be numeric"),
  }),
  skillAllocations: z.record(
    z.string(),
    z
      .number()
      .int("Skill points must be whole numbers")
      .min(
        MIN_SKILL_POINTS_PER_SKILL,
        `Skill points cannot be below ${MIN_SKILL_POINTS_PER_SKILL}`,
      ),
  ),
});

function toCountMap(values: number[]): Map<number, number> {
  const counts = new Map<number, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

function parseStatValue(value: string): number | null {
  if (!/^-?\d+$/.test(value)) return null;
  return Number(value);
}

function mapIssuePath(path: Array<string | number | symbol>): string {
  if (path[0] === "stats" && typeof path[1] === "string") {
    return `stats.${path[1]}`;
  }
  if (path[0] === "skillAllocations" && typeof path[1] === "string") {
    return `skillAllocations.${path[1]}`;
  }
  return String(path[0] ?? "statsSkills");
}

function getStatArrayValues(statArrayId: string): number[] | undefined {
  return statArrays.find((array) => array.id === statArrayId)?.values;
}

export function getValidStatArrayIds(): string[] {
  return [...VALID_STAT_ARRAY_IDS];
}

export function getValidSkillIds(): string[] {
  return [...VALID_SKILL_IDS];
}

export function getRemainingStatValueCounts(
  arrayValues: number[],
  stats: CreatorDraft["statsSkills"]["stats"],
  currentField: StatField,
): Record<number, number> {
  const remaining = toCountMap(arrayValues);

  for (const field of STAT_FIELDS) {
    if (field === currentField) continue;
    const parsed = parseStatValue(stats[field]);
    if (parsed === null) continue;
    const currentRemaining = remaining.get(parsed) ?? 0;
    if (currentRemaining > 0) {
      remaining.set(parsed, currentRemaining - 1);
    }
  }

  return Object.fromEntries(remaining.entries());
}

export function validateStatsSkills(
  draft: CreatorDraft,
  validStatArrayIds?: string[],
  validSkillIds?: string[],
): StepValidationResult {
  const statArrayMissing = draft.statsSkills.statArrayId.trim().length === 0;
  const statArrayIds = validStatArrayIds ?? getValidStatArrayIds();
  const skillIds = validSkillIds ?? getValidSkillIds();
  const result = StatsSkillsSchema.safeParse(draft.statsSkills);
  const errors: Record<string, string> = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = mapIssuePath(issue.path);
      if (!errors[field]) {
        errors[field] = issue.message;
      }
    }
    if (statArrayMissing) {
      for (const key of Object.keys(errors)) {
        if (key === "stats" || key.startsWith("stats.")) {
          delete errors[key];
        }
      }
    }
  } else {
    const { statArrayId, stats, skillAllocations } = result.data;

    if (!statArrayIds.includes(statArrayId)) {
      errors.statArrayId = "Selected stat array is not valid";
    }

    const selectedArray = getStatArrayValues(statArrayId);
    if (selectedArray) {
      const assignedValues: number[] = [];
      for (const field of STAT_FIELDS) {
        const parsed = parseStatValue(stats[field]);
        if (parsed === null) {
          errors[`stats.${field}`] = `${STAT_FIELD_LABELS[field]} assignment must be numeric`;
        } else {
          assignedValues.push(parsed);
        }
      }

      if (assignedValues.length === STAT_FIELDS.length) {
        const expected = toCountMap(selectedArray);
        const actual = toCountMap(assignedValues);
        const allValues = new Set([...expected.keys(), ...actual.keys()]);
        const isExactMatch = [...allValues].every((value) => (expected.get(value) ?? 0) === (actual.get(value) ?? 0));
        if (!isExactMatch) {
          errors.stats = "Assigned stat values must exactly match the selected array";
        }
      }
    }

    const unknownSkills = Object.keys(skillAllocations).filter((skillId) => !skillIds.includes(skillId));
    if (unknownSkills.length > 0) {
      errors.skillAllocations = "Skill allocation includes unknown skills";
    }

    const totalAllocated = skillIds.reduce((sum, skillId) => sum + (skillAllocations[skillId] ?? 0), 0);
    if (totalAllocated !== STARTING_SKILL_POINTS) {
      errors.skillPointTotal = `Allocate exactly ${STARTING_SKILL_POINTS} total skill points`;
    }

    const ancestryId = draft.ancestryBackground.ancestryId;
    const backgroundId = draft.ancestryBackground.backgroundId;

    for (const skillId of skillIds) {
      const allocated = skillAllocations[skillId] ?? 0;
      if (allocated === 0) continue;
      const skillEntry = skills.find((s) => s.id === skillId);
      if (!skillEntry) continue;
      const statVal = parseStatValue(stats[skillEntry.stat as StatField]);
      if (statVal === null) continue;
      const flatMod = getSkillModifier(skillId, ancestryId, backgroundId);
      const finalBonus = statVal + allocated + flatMod;
      if (finalBonus > MAX_SKILL_TOTAL_BONUS) {
        errors[`skillAllocations.${skillId}`] = `Final skill bonus (+${finalBonus}) exceeds maximum of +${MAX_SKILL_TOTAL_BONUS}`;
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
