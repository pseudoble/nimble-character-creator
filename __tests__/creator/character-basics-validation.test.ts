import { describe, it, expect } from "vitest";
import { validateCharacterBasics } from "@/lib/creator/character-basics-validation";
import { DRAFT_SCHEMA_VERSION, MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH } from "@/lib/creator/constants";
import type { CreatorDraft } from "@/lib/creator/types";

const validClassIds = ["berserker", "mage", "hunter"];

function makeDraft(overrides: Partial<CreatorDraft["characterBasics"]> = {}): CreatorDraft {
  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    characterBasics: {
      classId: "mage",
      name: "Gandalf",
      description: "A wise wizard",
      ...overrides,
    },
    ancestryBackground: { ancestryId: "elf", backgroundId: "fearless", motivation: "" },
    statsSkills: {
      statArrayId: "standard",
      stats: { str: "2", dex: "2", int: "0", wil: "-1" },
      skillAllocations: { arcana: 4 },
    },
    languagesEquipment: {
      equipmentChoice: "gear",
      selectedLanguages: [],
    },
  };
}

describe("Character basics validation", () => {
  it("passes for valid payload", () => {
    const result = validateCharacterBasics(makeDraft(), validClassIds);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("fails when classId is empty", () => {
    const result = validateCharacterBasics(makeDraft({ classId: "" }), validClassIds);
    expect(result.valid).toBe(false);
    expect(result.errors.classId).toBeDefined();
  });

  it("fails when classId is not in valid list", () => {
    const result = validateCharacterBasics(makeDraft({ classId: "druid" }), validClassIds);
    expect(result.valid).toBe(false);
    expect(result.errors.classId).toBeDefined();
  });

  it("fails when name is blank", () => {
    const result = validateCharacterBasics(makeDraft({ name: "" }), validClassIds);
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("fails when name is only whitespace", () => {
    const result = validateCharacterBasics(makeDraft({ name: "   " }), validClassIds);
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("fails when name exceeds max length", () => {
    const result = validateCharacterBasics(makeDraft({ name: "x".repeat(MAX_NAME_LENGTH + 1) }), validClassIds);
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("passes when description is empty (optional)", () => {
    const result = validateCharacterBasics(makeDraft({ description: "" }), validClassIds);
    expect(result.valid).toBe(true);
  });

  it("fails when description exceeds max length", () => {
    const result = validateCharacterBasics(
      makeDraft({ description: "x".repeat(MAX_DESCRIPTION_LENGTH + 1) }),
      validClassIds,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.description).toBeDefined();
  });

  it("reports multiple errors simultaneously", () => {
    const result = validateCharacterBasics(makeDraft({ classId: "", name: "" }), validClassIds);
    expect(result.valid).toBe(false);
    expect(result.errors.classId).toBeDefined();
    expect(result.errors.name).toBeDefined();
  });
});
