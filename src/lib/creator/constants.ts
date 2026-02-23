export const DRAFT_STORAGE_KEY = "nimble.creator.draft.v1";
export const DRAFT_SCHEMA_VERSION = 1;

export const STEP_IDS = {
  CHARACTER_BASICS: "character-basics",
  ANCESTRY_BACKGROUND: "ancestry-background",
  STATS_SKILLS: "stats-skills",
} as const;

export const MAX_NAME_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 500;
export const MAX_MOTIVATION_LENGTH = 200;

export const STEP_THREE_REQUIRED_SKILL_POINTS = 4;
export const STEP_THREE_MIN_SKILL_POINTS_PER_SKILL = 0;
export const STEP_THREE_MAX_SKILL_POINTS_PER_SKILL = 4;
