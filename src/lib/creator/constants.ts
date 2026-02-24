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

// This is the number of skill points available at level 1
// TODO: Rename this to be more accurate
export const REQUIRED_SKILL_POINTS = 4;

// This is the minimum skill points that can be allocated to a skill
export const MIN_SKILL_POINTS_PER_SKILL = 0;

// This is the maximum skill points that a skill can effectively have
// after all contributions to the skill have been made
// TODO: Rename this to be more accurate and ensure it's actually used that way
export const MAX_SKILL_TOTAL_BONUS = 12;
