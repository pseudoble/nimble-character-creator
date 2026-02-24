import { describe, it, expect } from "vitest";
import { validateAncestryBackground, getValidAncestryIds, getValidBackgroundIds } from "@/lib/creator/ancestry-background-validation";
import { DRAFT_SCHEMA_VERSION, MAX_MOTIVATION_LENGTH } from "@/lib/creator/constants";
import type { CreatorDraft } from "@/lib/creator/types";

const validAncestryIds = ["human", "elf", "dwarf"];
const validBackgroundIds = ["fearless", "survivalist", "acrobat"];

function makeDraft(overrides: Partial<CreatorDraft["ancestryBackground"]> = {}): CreatorDraft {
  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    stepOne: { classId: "mage", name: "Gandalf", description: "" },
    ancestryBackground: {
      ancestryId: "elf",
      backgroundId: "fearless",
      motivation: "",
      ...overrides,
    },
    statsSkills: {
      statArrayId: "standard",
      stats: { str: "2", dex: "2", int: "0", wil: "-1" },
      skillAllocations: { arcana: 4 },
    },
    stepFour: {
      equipmentChoice: "gear",
      selectedLanguages: [],
    },
  };
}

describe("Ancestry & Background validation", () => {
  it("passes for valid payload", () => {
    const result = validateAncestryBackground(makeDraft(), validAncestryIds, validBackgroundIds);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("fails when ancestryId is empty", () => {
    const result = validateAncestryBackground(makeDraft({ ancestryId: "" }), validAncestryIds, validBackgroundIds);
    expect(result.valid).toBe(false);
    expect(result.errors.ancestryId).toBeDefined();
  });

  it("fails when backgroundId is empty", () => {
    const result = validateAncestryBackground(makeDraft({ backgroundId: "" }), validAncestryIds, validBackgroundIds);
    expect(result.valid).toBe(false);
    expect(result.errors.backgroundId).toBeDefined();
  });

  it("fails when ancestryId is not in valid list", () => {
    const result = validateAncestryBackground(makeDraft({ ancestryId: "centaur" }), validAncestryIds, validBackgroundIds);
    expect(result.valid).toBe(false);
    expect(result.errors.ancestryId).toBeDefined();
  });

  it("fails when backgroundId is not in valid list", () => {
    const result = validateAncestryBackground(makeDraft({ backgroundId: "pirate" }), validAncestryIds, validBackgroundIds);
    expect(result.valid).toBe(false);
    expect(result.errors.backgroundId).toBeDefined();
  });

  it("fails when motivation exceeds max length", () => {
    const result = validateAncestryBackground(
      makeDraft({ motivation: "x".repeat(MAX_MOTIVATION_LENGTH + 1) }),
      validAncestryIds,
      validBackgroundIds,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.motivation).toBeDefined();
  });

  it("passes when motivation is empty", () => {
    const result = validateAncestryBackground(makeDraft({ motivation: "" }), validAncestryIds, validBackgroundIds);
    expect(result.valid).toBe(true);
  });

  it("reports multiple errors simultaneously", () => {
    const result = validateAncestryBackground(
      makeDraft({ ancestryId: "", backgroundId: "" }),
      validAncestryIds,
      validBackgroundIds,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.ancestryId).toBeDefined();
    expect(result.errors.backgroundId).toBeDefined();
  });
});

describe("Ancestry & Background ID lists match core data", () => {
  it("getValidAncestryIds() matches ancestries.json", async () => {
    const data = (await import("@/lib/core-data/data/ancestries.json")).default;
    const coreIds = data.map((a: { id: string }) => a.id).sort();
    const validIds = getValidAncestryIds().sort();
    expect(validIds).toEqual(coreIds);
  });

  it("getValidBackgroundIds() matches backgrounds.json", async () => {
    const data = (await import("@/lib/core-data/data/backgrounds.json")).default;
    const coreIds = data.map((b: { id: string }) => b.id).sort();
    const validIds = getValidBackgroundIds().sort();
    expect(validIds).toEqual(coreIds);
  });
});
