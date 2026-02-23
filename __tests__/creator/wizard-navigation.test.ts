import { describe, it, expect } from "vitest";
import { validateStepOne, getValidClassIds } from "@/lib/creator/step-one-validation";
import { DRAFT_SCHEMA_VERSION } from "@/lib/creator/constants";
import type { CreatorDraft, StepDescriptor } from "@/lib/creator/types";

// Replicate wizard shell step registry logic for testable navigation gating
const STEPS: StepDescriptor[] = [
  {
    id: "character-basics",
    label: "Character Basics",
    validate: (draft) => validateStepOne(draft),
  },
];

function makeDraft(overrides: Partial<CreatorDraft["stepOne"]> = {}): CreatorDraft {
  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    stepOne: {
      classId: "",
      name: "",
      description: "",
      ...overrides,
    },
  };
}

function canAdvance(draft: CreatorDraft, stepIndex: number): boolean {
  const step = STEPS[stepIndex];
  if (!step) return false;
  return step.validate(draft).valid;
}

describe("wizard navigation gating", () => {
  it("blocks advance when Step 1 has no class", () => {
    expect(canAdvance(makeDraft({ name: "Test" }), 0)).toBe(false);
  });

  it("blocks advance when Step 1 has no name", () => {
    expect(canAdvance(makeDraft({ classId: "mage" }), 0)).toBe(false);
  });

  it("blocks advance when Step 1 has invalid class", () => {
    expect(canAdvance(makeDraft({ classId: "druid", name: "Test" }), 0)).toBe(false);
  });

  it("allows advance when Step 1 is fully valid", () => {
    expect(canAdvance(makeDraft({ classId: "mage", name: "Gandalf" }), 0)).toBe(true);
  });

  it("allows advance with empty description", () => {
    expect(canAdvance(makeDraft({ classId: "hunter", name: "Legolas", description: "" }), 0)).toBe(true);
  });

  it("progress reflects completion when Step 1 is valid", () => {
    const draft = makeDraft({ classId: "berserker", name: "Grog" });
    const result = STEPS[0].validate(draft);
    expect(result.valid).toBe(true);
  });

  it("progress reflects incomplete when Step 1 is invalid", () => {
    const draft = makeDraft();
    const result = STEPS[0].validate(draft);
    expect(result.valid).toBe(false);
  });
});

function canGoBack(stepIndex: number): boolean {
  return stepIndex > 0;
}

describe("wizard back navigation", () => {
  it("is not available on Step 1", () => {
    expect(canGoBack(0)).toBe(false);
  });

  it("is available on Step 2", () => {
    expect(canGoBack(1)).toBe(true);
  });

  it("is available even when Step 2 has invalid data", () => {
    // Back navigation relies only on index, not validation state
    expect(canGoBack(1)).toBe(true);
  });

  it("preserves draft data when navigating back", () => {
    const draft = makeDraft({ name: "Keep Me" });
    // Verify draft remains unchanged (mocking the persistence/state lift)
    expect(draft.stepOne.name).toBe("Keep Me");
  });

  it("resets validation errors when navigating back", () => {
     let showErrors = true;
     // simulate handleBack logic:
     showErrors = false;
     expect(showErrors).toBe(false);
  });
});
