import { describe, expect, it } from "vitest";
import { createEmptyDraft } from "@/lib/creator/draft-persistence";
import { STEP_IDS, DRAFT_SCHEMA_VERSION } from "@/lib/creator/constants";
import type { CreatorDraft } from "@/lib/creator/types";

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

function applyReset(draft: CreatorDraft, stepId: string): CreatorDraft {
  const empty = createEmptyDraft();
  switch (stepId) {
    case STEP_IDS.CHARACTER_BASICS:
      return { ...draft, stepOne: empty.stepOne };
    case STEP_IDS.ANCESTRY_BACKGROUND:
      return { ...draft, stepTwo: empty.stepTwo };
    case STEP_IDS.STATS_SKILLS:
      return { ...draft, stepThree: empty.stepThree };
    default:
      return draft;
  }
}

describe("resetStep logic", () => {
  it("resets step 1 without affecting step 2 or step 3", () => {
    const draft = makeDraft();
    const result = applyReset(draft, STEP_IDS.CHARACTER_BASICS);

    expect(result.stepOne).toEqual({ classId: "", name: "", description: "" });
    expect(result.stepTwo).toEqual(draft.stepTwo);
    expect(result.stepThree).toEqual(draft.stepThree);
  });

  it("resets step 2 without affecting step 1 or step 3", () => {
    const draft = makeDraft();
    const result = applyReset(draft, STEP_IDS.ANCESTRY_BACKGROUND);

    expect(result.stepOne).toEqual(draft.stepOne);
    expect(result.stepTwo).toEqual({ ancestryId: "", backgroundId: "", motivation: "" });
    expect(result.stepThree).toEqual(draft.stepThree);
  });

  it("resets step 3 without affecting step 1 or step 2", () => {
    const draft = makeDraft();
    const result = applyReset(draft, STEP_IDS.STATS_SKILLS);

    expect(result.stepOne).toEqual(draft.stepOne);
    expect(result.stepTwo).toEqual(draft.stepTwo);
    expect(result.stepThree).toEqual({
      statArrayId: "",
      stats: { str: "", dex: "", int: "", wil: "" },
      skillAllocations: {},
    });
  });

  it("returns draft unchanged for unknown step id", () => {
    const draft = makeDraft();
    const result = applyReset(draft, "unknown-step");

    expect(result).toEqual(draft);
  });

  it("preserves version and updatedAt fields", () => {
    const draft = makeDraft();
    const result = applyReset(draft, STEP_IDS.CHARACTER_BASICS);

    expect(result.version).toBe(draft.version);
    expect(result.updatedAt).toBe(draft.updatedAt);
  });
});
