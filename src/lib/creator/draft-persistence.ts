import { DRAFT_STORAGE_KEY, DRAFT_SCHEMA_VERSION } from "./constants";
import type { CreatorDraft } from "./types";

export function createEmptyDraft(): CreatorDraft {
  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    stepOne: { classId: "", name: "", description: "" },
    stepTwo: { ancestryId: "", backgroundId: "", motivation: "" },
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
    if (!parsed.stepTwo) {
      parsed.stepTwo = { ancestryId: "", backgroundId: "", motivation: "" };
    }
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

function isValidDraftShape(obj: unknown): boolean {
  if (typeof obj !== "object" || obj === null) return false;
  const d = obj as Record<string, unknown>;
  if (d.version !== DRAFT_SCHEMA_VERSION) return false;
  if (typeof d.stepOne !== "object" || d.stepOne === null) return false;
  const s = d.stepOne as Record<string, unknown>;
  return (
    typeof s.classId === "string" &&
    typeof s.name === "string" &&
    typeof s.description === "string"
  );
}
