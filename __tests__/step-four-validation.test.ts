import { describe, it, expect } from "vitest";
import { validateStepFour } from "@/lib/creator/step-four-validation";
import { createEmptyDraft } from "@/lib/creator/draft-persistence";

function makeDraft(equipmentChoice: "" | "gear" | "gold") {
  const draft = createEmptyDraft();
  draft.stepFour.equipmentChoice = equipmentChoice;
  return draft;
}

describe("validateStepFour", () => {
  it("fails when no choice is made", () => {
    const result = validateStepFour(makeDraft(""));
    expect(result.valid).toBe(false);
    expect(result.errors.equipmentChoice).toBeDefined();
  });

  it("passes when gear is selected", () => {
    const result = validateStepFour(makeDraft("gear"));
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("passes when gold is selected", () => {
    const result = validateStepFour(makeDraft("gold"));
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });
});
