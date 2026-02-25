export const DRAFT_STORAGE_KEY = "nimble.creator.draft.v1";
export const DRAFT_SCHEMA_VERSION = 5;

export const STEP_IDS = {
  CHARACTER_BASICS: "character-basics",
  ANCESTRY_BACKGROUND: "ancestry-background",
  STATS_SKILLS: "stats-skills",
  LANGUAGES_EQUIPMENT: "languages-equipment",
} as const;

export const MAX_NAME_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_MOTIVATION_LENGTH = 200;

// This is the minimum skill points that can be allocated to a skill
export const MIN_SKILL_POINTS_PER_SKILL = 0;
