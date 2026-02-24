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

function createEmptyLanguagesEquipment(): CreatorDraft["languagesEquipment"] {
  return { equipmentChoice: "", selectedLanguages: [] };
}

export function createEmptyDraft(): CreatorDraft {
  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    characterBasics: { classId: "", name: "", description: "" },
    ancestryBackground: createEmptyAncestryBackground(),
    statsSkills: createEmptyStatsSkills(),
    languagesEquipment: createEmptyLanguagesEquipment(),
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

    // Migrate v3 positional field names → semantic field names
    if (parsed.stepTwo && !parsed.ancestryBackground) {
      parsed.ancestryBackground = parsed.stepTwo;
      delete parsed.stepTwo;
    }
    if (parsed.stepThree && !parsed.statsSkills) {
      parsed.statsSkills = parsed.stepThree;
      delete parsed.stepThree;
    }
    // Migrate v4 positional field names → semantic field names
    if (parsed.stepOne && !parsed.characterBasics) {
      parsed.characterBasics = parsed.stepOne;
      delete parsed.stepOne;
    }
    if (parsed.stepFour && !parsed.languagesEquipment) {
      parsed.languagesEquipment = parsed.stepFour;
      delete parsed.stepFour;
    }

    // Backfill ancestryBackground for legacy drafts
    if (!isValidAncestryBackgroundShape(parsed.ancestryBackground)) {
      parsed.ancestryBackground = createEmptyAncestryBackground();
    }
    // Backfill statsSkills for legacy drafts
    if (!isValidStatsSkillsShape(parsed.statsSkills)) {
      parsed.statsSkills = createEmptyStatsSkills();
    }
    // Backfill languagesEquipment for legacy drafts
    if (!isValidLanguagesEquipmentShape(parsed.languagesEquipment)) {
      parsed.languagesEquipment = createEmptyLanguagesEquipment();
    }
    // Backfill selectedLanguages for drafts saved before language selection existed
    if (!Array.isArray(parsed.languagesEquipment.selectedLanguages)) {
      parsed.languagesEquipment.selectedLanguages = [];
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

const ACCEPTED_VERSIONS = [1, 2, 3, 4, 5];

function isValidDraftShape(obj: unknown): boolean {
  if (typeof obj !== "object" || obj === null) return false;
  const d = obj as Record<string, unknown>;
  if (!ACCEPTED_VERSIONS.includes(d.version as number)) return false;
  // Accept either old (stepOne) or new (characterBasics) field name
  const basics = (d.characterBasics ?? d.stepOne) as Record<string, unknown> | undefined;
  if (typeof basics !== "object" || basics === null) return false;
  return (
    typeof basics.classId === "string" &&
    typeof basics.name === "string" &&
    typeof basics.description === "string"
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

function isValidLanguagesEquipmentShape(obj: unknown): obj is CreatorDraft["languagesEquipment"] {
  if (typeof obj !== "object" || obj === null) return false;
  const data = obj as Record<string, unknown>;
  return (
    typeof data.equipmentChoice === "string" &&
    ["gear", "gold", ""].includes(data.equipmentChoice)
  );
}
