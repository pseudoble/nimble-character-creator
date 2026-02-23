import { DRAFT_STORAGE_KEY, DRAFT_SCHEMA_VERSION } from "./constants";
import type { CreatorDraft } from "./types";

function createEmptyStepTwo(): CreatorDraft["stepTwo"] {
  return { ancestryId: "", backgroundId: "", motivation: "" };
}

function createEmptyStepThree(): CreatorDraft["stepThree"] {
  return {
    statArrayId: "",
    stats: { str: "", dex: "", int: "", wil: "" },
    skillAllocations: {},
  };
}

function createEmptyStepFour(): CreatorDraft["stepFour"] {
  return { equipmentChoice: "" };
}

export function createEmptyDraft(): CreatorDraft {
  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    stepOne: { classId: "", name: "", description: "" },
    stepTwo: createEmptyStepTwo(),
    stepThree: createEmptyStepThree(),
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
    // Backfill stepTwo for drafts saved before Step 2 existed
    if (!isValidStepTwoShape(parsed.stepTwo)) {
      parsed.stepTwo = createEmptyStepTwo();
    }
    // Backfill stepThree for drafts saved before Step 3 existed
    if (!isValidStepThreeShape(parsed.stepThree)) {
      parsed.stepThree = createEmptyStepThree();
    }
    // Backfill stepFour for drafts saved before Step 4 existed
    if (!isValidStepFourShape(parsed.stepFour)) {
      parsed.stepFour = createEmptyStepFour();
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

const ACCEPTED_VERSIONS = [1, 2];

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

function isValidStepTwoShape(obj: unknown): obj is CreatorDraft["stepTwo"] {
  if (typeof obj !== "object" || obj === null) return false;
  const stepTwo = obj as Record<string, unknown>;
  return (
    typeof stepTwo.ancestryId === "string" &&
    typeof stepTwo.backgroundId === "string" &&
    typeof stepTwo.motivation === "string"
  );
}

function isValidStepThreeShape(obj: unknown): obj is CreatorDraft["stepThree"] {
  if (typeof obj !== "object" || obj === null) return false;
  const stepThree = obj as Record<string, unknown>;
  if (typeof stepThree.statArrayId !== "string") return false;
  if (typeof stepThree.skillAllocations !== "object" || stepThree.skillAllocations === null) return false;
  if (typeof stepThree.stats !== "object" || stepThree.stats === null) return false;

  const stats = stepThree.stats as Record<string, unknown>;
  const skillAllocations = stepThree.skillAllocations as Record<string, unknown>;
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
