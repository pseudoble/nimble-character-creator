import { describe, expect, it } from "vitest";
import { DRAFT_SCHEMA_VERSION } from "@/lib/creator/constants";
import type { CreatorDraft, StepThreeData } from "@/lib/creator/types";

function makeDraft(): CreatorDraft {
  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    stepOne: { classId: "mage", name: "Gandalf", description: "A wise wizard" },
    stepTwo: { ancestryId: "elf", backgroundId: "fearless", motivation: "Save the realm" },
    stepThree: {
      statArrayId: "standard",
      stats: { str: "2", dex: "2", int: "0", wil: "-1" },
      skillAllocations: { arcana: 2, stealth: 2 },
    },
  };
}

/**
 * Mirrors the updateStepThree merge logic from context.tsx
 */
function applyStepThreeUpdate(
  prev: StepThreeData,
  updates: Partial<StepThreeData>
): StepThreeData {
  const statArrayChanged =
    updates.statArrayId !== undefined &&
    updates.statArrayId !== prev.statArrayId;

  if (statArrayChanged) {
    return { ...prev, ...updates, stats: { str: "", dex: "", int: "", wil: "" } };
  }
  return { ...prev, ...updates };
}

describe("stat array change resets stats", () => {
  it("resets all four stat assignments to empty when stat array changes", () => {
    const draft = makeDraft();
    const result = applyStepThreeUpdate(draft.stepThree, { statArrayId: "min-max" });

    expect(result.stats).toEqual({ str: "", dex: "", int: "", wil: "" });
    expect(result.statArrayId).toBe("min-max");
  });

  it("preserves skill allocations when stat array changes", () => {
    const draft = makeDraft();
    const result = applyStepThreeUpdate(draft.stepThree, { statArrayId: "min-max" });

    expect(result.skillAllocations).toEqual({ arcana: 2, stealth: 2 });
  });

  it("does not reset stat assignments when selecting the same stat array", () => {
    const draft = makeDraft();
    const result = applyStepThreeUpdate(draft.stepThree, { statArrayId: "standard" });

    expect(result.stats).toEqual({ str: "2", dex: "2", int: "0", wil: "-1" });
    expect(result.skillAllocations).toEqual({ arcana: 2, stealth: 2 });
  });
});
