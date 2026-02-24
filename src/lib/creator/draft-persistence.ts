import { DRAFT_STORAGE_KEY, DRAFT_SCHEMA_VERSION } from "./constants";
import type { CreatorDraft } from "./types";

function createEmptyAncestryBackground(): CreatorDraft["ancestryBackground"] {
  return { ancestryId: "", backgroundId: "", motivation: "" };
}

function createEmptyStatsSkills(): CreatorDraft["statsSkills"] {
  return {
    statArrayId: "",
    stats: { str: "", dex: "", int: "", wil: "" },
    skillAllocations: {},
  };
}

function createEmptyStepFour(): CreatorDraft["stepFour"] {
  return { equipmentChoice: "", selectedLanguages: [] };
}

export function createEmptyDraft(): CreatorDraft {
  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    stepOne: { classId: "", name: "", description: "" },
    ancestryBackground: createEmptyAncestryBackground(),
    statsSkills: createEmptyStatsSkills(),
    stepFour: createEmptyStepFour(),
  };
}

export function saveDraft(draft: CreatorDraft): void {
  try {
    const payload = { ...draft, updatedAt: new Date().toISOString() };
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage unavailable — silently skip
  }
}

export function loadDraft(): CreatorDraft {
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return createEmptyDraft();
    const parsed = JSON.parse(raw);
    if (!isValidDraftShape(parsed)) return createEmptyDraft();

    // Migrate v3 positional field names → v4 semantic field names
    if (parsed.stepTwo && !parsed.ancestryBackground) {
      parsed.ancestryBackground = parsed.stepTwo;
      delete parsed.stepTwo;
    }
    if (parsed.stepThree && !parsed.statsSkills) {
      parsed.statsSkills = parsed.stepThree;
      delete parsed.stepThree;
    }

    // Backfill ancestryBackground for legacy drafts
    if (!isValidAncestryBackgroundShape(parsed.ancestryBackground)) {
      parsed.ancestryBackground = createEmptyAncestryBackground();
    }
    // Backfill statsSkills for legacy drafts
    if (!isValidStatsSkillsShape(parsed.statsSkills)) {
      parsed.statsSkills = createEmptyStatsSkills();
    }
    // Backfill stepFour for legacy drafts
    if (!isValidStepFourShape(parsed.stepFour)) {
      parsed.stepFour = createEmptyStepFour();
    }
    // Backfill selectedLanguages for drafts saved before language selection existed
    if (!Array.isArray(parsed.stepFour.selectedLanguages)) {
      parsed.stepFour.selectedLanguages = [];
    }
    // Normalize version to current
    parsed.version = DRAFT_SCHEMA_VERSION;
    return parsed as CreatorDraft;
  } catch {
    return createEmptyDraft();
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}

const ACCEPTED_VERSIONS = [1, 2, 3, 4];

function isValidDraftShape(obj: unknown): boolean {
  if (typeof obj !== "object" || obj === null) return false;
  const d = obj as Record<string, unknown>;
  if (!ACCEPTED_VERSIONS.includes(d.version as number)) return false;
  if (typeof d.stepOne !== "object" || d.stepOne === null) return false;
  const s = d.stepOne as Record<string, unknown>;
  return (
    typeof s.classId === "string" &&
    typeof s.name === "string" &&
    typeof s.description === "string"
  );
}

function isValidAncestryBackgroundShape(obj: unknown): obj is CreatorDraft["ancestryBackground"] {
  if (typeof obj !== "object" || obj === null) return false;
  const data = obj as Record<string, unknown>;
  return (
    typeof data.ancestryId === "string" &&
    typeof data.backgroundId === "string" &&
    typeof data.motivation === "string"
  );
}

function isValidStatsSkillsShape(obj: unknown): obj is CreatorDraft["statsSkills"] {
  if (typeof obj !== "object" || obj === null) return false;
  const data = obj as Record<string, unknown>;
  if (typeof data.statArrayId !== "string") return false;
  if (typeof data.skillAllocations !== "object" || data.skillAllocations === null) return false;
  if (typeof data.stats !== "object" || data.stats === null) return false;

  const stats = data.stats as Record<string, unknown>;
  const skillAllocations = data.skillAllocations as Record<string, unknown>;
  const hasValidSkillAllocations = Object.values(skillAllocations).every(
    (value) => typeof value === "number" && Number.isFinite(value),
  );

  return (
    typeof stats.str === "string" &&
    typeof stats.dex === "string" &&
    typeof stats.int === "string" &&
    typeof stats.wil === "string" &&
    hasValidSkillAllocations
  );
}

function isValidStepFourShape(obj: unknown): obj is CreatorDraft["stepFour"] {
  if (typeof obj !== "object" || obj === null) return false;
  const stepFour = obj as Record<string, unknown>;
  return (
    typeof stepFour.equipmentChoice === "string" &&
    ["gear", "gold", ""].includes(stepFour.equipmentChoice)
  );
}
