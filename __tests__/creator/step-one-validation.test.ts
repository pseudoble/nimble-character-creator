import { describe, it, expect } from "vitest";
import { validateStepOne } from "@/lib/creator/step-one-validation";
import { DRAFT_SCHEMA_VERSION, MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH } from "@/lib/creator/constants";
import type { CreatorDraft } from "@/lib/creator/types";

const validClassIds = ["berserker", "mage", "hunter"];

function makeDraft(overrides: Partial<CreatorDraft["stepOne"]> = {}): CreatorDraft {
  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    stepOne: {
      classId: "mage",
      name: "Gandalf",
      description: "A wise wizard",
      ...overrides,
    },
  };
}

describe("Step 1 validation", () => {
  it("passes for valid payload", () => {
    const result = validateStepOne(makeDraft(), validClassIds);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("fails when classId is empty", () => {
    const result = validateStepOne(makeDraft({ classId: "" }), validClassIds);
    expect(result.valid).toBe(false);
    expect(result.errors.classId).toBeDefined();
  });

  it("fails when classId is not in valid list", () => {
    const result = validateStepOne(makeDraft({ classId: "druid" }), validClassIds);
    expect(result.valid).toBe(false);
    expect(result.errors.classId).toBeDefined();
  });

  it("fails when name is blank", () => {
    const result = validateStepOne(makeDraft({ name: "" }), validClassIds);
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("fails when name is only whitespace", () => {
    const result = validateStepOne(makeDraft({ name: "   " }), validClassIds);
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("fails when name exceeds max length", () => {
    const result = validateStepOne(makeDraft({ name: "x".repeat(MAX_NAME_LENGTH + 1) }), validClassIds);
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("passes when description is empty (optional)", () => {
    const result = validateStepOne(makeDraft({ description: "" }), validClassIds);
    expect(result.valid).toBe(true);
  });

  it("fails when description exceeds max length", () => {
    const result = validateStepOne(
      makeDraft({ description: "x".repeat(MAX_DESCRIPTION_LENGTH + 1) }),
      validClassIds,
    );
    expect(result.valid).toBe(false);
    expect(result.errors.description).toBeDefined();
  });

  it("reports multiple errors simultaneously", () => {
    const result = validateStepOne(makeDraft({ classId: "", name: "" }), validClassIds);
    expect(result.valid).toBe(false);
    expect(result.errors.classId).toBeDefined();
    expect(result.errors.name).toBeDefined();
  });
});
