import { describe, it, expect, beforeEach } from "vitest";
import { saveDraft, loadDraft, clearDraft, createEmptyDraft } from "@/lib/creator/draft-persistence";
import { DRAFT_STORAGE_KEY, DRAFT_SCHEMA_VERSION } from "@/lib/creator/constants";
import type { CreatorDraft } from "@/lib/creator/types";

// Simple localStorage mock for Node test environment
const store = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => store.get(key) ?? null,
  setItem: (key: string, value: string) => store.set(key, value),
  removeItem: (key: string) => store.delete(key),
  clear: () => store.clear(),
} as unknown as Storage;

Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true });

beforeEach(() => {
  store.clear();
});

function makeDraft(overrides: Partial<CreatorDraft["stepOne"]> = {}): CreatorDraft {
  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    stepOne: {
      classId: "hunter",
      name: "Legolas",
      description: "An elf ranger",
      ...overrides,
    },
    ancestryBackground: { ancestryId: "elf", backgroundId: "fearless", motivation: "" },
    statsSkills: {
      statArrayId: "standard",
      stats: { str: "2", dex: "2", int: "0", wil: "-1" },
      skillAllocations: { arcana: 2, stealth: 2 },
    },
    stepFour: {
      equipmentChoice: "gear",
      selectedLanguages: [],
    },
  };
}

describe("draft persistence", () => {
  it("saves and loads a draft round-trip", () => {
    const draft = makeDraft();
    saveDraft(draft);
    const loaded = loadDraft();
    expect(loaded.stepOne.classId).toBe("hunter");
    expect(loaded.stepOne.name).toBe("Legolas");
    expect(loaded.statsSkills.statArrayId).toBe("standard");
    expect(loaded.statsSkills.skillAllocations.arcana).toBe(2);
  });

  it("returns empty draft when nothing stored", () => {
    const draft = loadDraft();
    expect(draft.stepOne.classId).toBe("");
    expect(draft.stepOne.name).toBe("");
    expect(draft.ancestryBackground.ancestryId).toBe("");
    expect(draft.statsSkills.statArrayId).toBe("");
    expect(draft.version).toBe(DRAFT_SCHEMA_VERSION);
  });

  it("returns empty draft for malformed JSON", () => {
    store.set(DRAFT_STORAGE_KEY, "not valid json{{{");
    const draft = loadDraft();
    expect(draft.stepOne.classId).toBe("");
  });

  it("returns empty draft when version mismatches", () => {
    const old = { version: 999, stepOne: { classId: "mage", name: "Old", description: "" } };
    store.set(DRAFT_STORAGE_KEY, JSON.stringify(old));
    const draft = loadDraft();
    expect(draft.stepOne.classId).toBe("");
  });

  it("returns empty draft when stepOne is missing", () => {
    store.set(DRAFT_STORAGE_KEY, JSON.stringify({ version: DRAFT_SCHEMA_VERSION }));
    const draft = loadDraft();
    expect(draft.stepOne.classId).toBe("");
  });

  it("returns empty draft when stepOne has wrong types", () => {
    store.set(
      DRAFT_STORAGE_KEY,
      JSON.stringify({ version: DRAFT_SCHEMA_VERSION, stepOne: { classId: 42, name: null, description: true } }),
    );
    const draft = loadDraft();
    expect(draft.stepOne.classId).toBe("");
  });

  it("backfills missing statsSkills in legacy drafts", () => {
    const legacy = {
      version: 3,
      updatedAt: new Date().toISOString(),
      stepOne: { classId: "mage", name: "Old", description: "" },
      stepTwo: { ancestryId: "elf", backgroundId: "fearless", motivation: "" },
    };
    store.set(DRAFT_STORAGE_KEY, JSON.stringify(legacy));
    const draft = loadDraft();
    expect(draft.statsSkills.statArrayId).toBe("");
    expect(draft.statsSkills.skillAllocations).toEqual({});
  });

  it("migrates v3 positional field names to semantic names", () => {
    const v3Draft = {
      version: 3,
      updatedAt: new Date().toISOString(),
      stepOne: { classId: "mage", name: "Gandalf", description: "" },
      stepTwo: { ancestryId: "elf", backgroundId: "fearless", motivation: "Save the realm" },
      stepThree: {
        statArrayId: "standard",
        stats: { str: "2", dex: "2", int: "0", wil: "-1" },
        skillAllocations: { arcana: 2, stealth: 2 },
      },
      stepFour: {
        equipmentChoice: "gear",
        selectedLanguages: [],
      },
    };
    store.set(DRAFT_STORAGE_KEY, JSON.stringify(v3Draft));
    const draft = loadDraft();
    expect(draft.ancestryBackground.ancestryId).toBe("elf");
    expect(draft.ancestryBackground.motivation).toBe("Save the realm");
    expect(draft.statsSkills.statArrayId).toBe("standard");
    expect(draft.statsSkills.stats.str).toBe("2");
  });

  it("clearDraft removes stored data", () => {
    saveDraft(makeDraft());
    clearDraft();
    expect(store.has(DRAFT_STORAGE_KEY)).toBe(false);
  });

  it("createEmptyDraft returns valid structure", () => {
    const d = createEmptyDraft();
    expect(d.version).toBe(DRAFT_SCHEMA_VERSION);
    expect(d.stepOne.classId).toBe("");
    expect(d.stepOne.name).toBe("");
    expect(d.stepOne.description).toBe("");
    expect(d.ancestryBackground.ancestryId).toBe("");
    expect(d.statsSkills.statArrayId).toBe("");
    expect(d.statsSkills.stats.str).toBe("");
  });
});
