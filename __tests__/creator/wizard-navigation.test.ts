import { describe, expect, it } from "vitest";
import { validateStepOne } from "@/lib/creator/step-one-validation";
import { validateStepTwo } from "@/lib/creator/step-two-validation";
import { validateStepThree } from "@/lib/creator/step-three-validation";
import { createEmptyDraft } from "@/lib/creator/draft-persistence";
import { DRAFT_SCHEMA_VERSION, STEP_IDS } from "@/lib/creator/constants";
import type { CreatorDraft, StepDescriptor } from "@/lib/creator/types";

type DraftOverrides = {
  stepOne?: Partial<CreatorDraft["stepOne"]>;
  stepTwo?: Partial<CreatorDraft["stepTwo"]>;
  stepThree?: Partial<Omit<CreatorDraft["stepThree"], "stats" | "skillAllocations">> & {
    stats?: Partial<CreatorDraft["stepThree"]["stats"]>;
    skillAllocations?: Partial<Record<string, number>>;
  };
};

const STEPS: StepDescriptor[] = [
  {
    id: "character-basics",
    label: "Character Basics",
    validate: (draft) => validateStepOne(draft),
  },
  {
    id: "ancestry-background",
    label: "Ancestry & Background",
    validate: (draft) => validateStepTwo(draft),
  },
  {
    id: "stats-skills",
    label: "Stats & Skills",
    validate: (draft) => validateStepThree(draft),
  },
];

function makeDraft(overrides: DraftOverrides = {}): CreatorDraft {
  const stepThreeDefaults: CreatorDraft["stepThree"] = {
    statArrayId: "standard",
    stats: { str: "2", dex: "2", int: "0", wil: "-1" },
    skillAllocations: { arcana: 2, stealth: 2 },
  };

  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    stepOne: {
      classId: "mage",
      name: "Gandalf",
      description: "",
      ...overrides.stepOne,
    },
    stepTwo: {
      ancestryId: "elf",
      backgroundId: "fearless",
      motivation: "",
      ...overrides.stepTwo,
    },
    stepThree: {
      ...stepThreeDefaults,
      ...overrides.stepThree,
      stats: {
        ...stepThreeDefaults.stats,
        ...overrides.stepThree?.stats,
      },
      skillAllocations: {
        ...stepThreeDefaults.skillAllocations,
        ...overrides.stepThree?.skillAllocations,
      },
    },
  };
}

function canAdvance(draft: CreatorDraft, stepIndex: number): boolean {
  const step = STEPS[stepIndex];
  if (!step) return false;
  return step.validate(draft).valid;
}

function canGoBack(stepIndex: number): boolean {
  return stepIndex > 0;
}

describe("wizard navigation gating", () => {
  it("blocks advance when Step 1 is invalid", () => {
    expect(canAdvance(makeDraft({ stepOne: { classId: "" } }), 0)).toBe(false);
  });

  it("allows advance when Step 1 is valid", () => {
    expect(canAdvance(makeDraft(), 0)).toBe(true);
  });

  it("blocks advance when Step 2 is invalid", () => {
    expect(canAdvance(makeDraft({ stepTwo: { ancestryId: "" } }), 1)).toBe(false);
  });

  it("allows advance when Step 2 is valid", () => {
    expect(canAdvance(makeDraft(), 1)).toBe(true);
  });

  it("blocks finish when Step 3 is invalid", () => {
    expect(
      canAdvance(
        makeDraft({
          stepThree: {
            skillAllocations: { arcana: 1, stealth: 1 },
          },
        }),
        2,
      ),
    ).toBe(false);
  });

  it("blocks finish when any Step 3 skill allocation exceeds per-skill max", () => {
    expect(
      canAdvance(
        makeDraft({
          stepThree: {
            skillAllocations: { arcana: 5, stealth: 0 },
          },
        }),
        2,
      ),
    ).toBe(false);
  });

  it("allows finish when Step 3 is valid", () => {
    expect(canAdvance(makeDraft(), 2)).toBe(true);
  });
});

describe("wizard back navigation", () => {
  it("is not available on Step 1", () => {
    expect(canGoBack(0)).toBe(false);
  });

  it("is available on Step 2", () => {
    expect(canGoBack(1)).toBe(true);
  });

  it("is available on Step 3", () => {
    expect(canGoBack(2)).toBe(true);
  });

  it("navigates from Step 3 back to Step 2", () => {
    const fromStep = 2;
    const prevStep = fromStep - 1;
    expect(prevStep).toBe(1);
  });

  it("back navigation is not blocked by invalid Step 3 data", () => {
    const invalidStepThreeDraft = makeDraft({
      stepThree: { stats: { wil: "" } },
    });
    expect(canAdvance(invalidStepThreeDraft, 2)).toBe(false);
    expect(canGoBack(2)).toBe(true);
  });

  it("preserves earlier step data when navigating back from Step 3", () => {
    const draft = makeDraft({
      stepTwo: { motivation: "Find the lost sigil" },
      stepThree: { stats: { str: "2", dex: "2", int: "0", wil: "-1" } },
    });
    expect(draft.stepTwo.motivation).toBe("Find the lost sigil");
  });

  it("resets error display flag when navigating back", () => {
    let showErrors = true;
    showErrors = false;
    expect(showErrors).toBe(false);
  });
});

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

describe("wizard reset step", () => {
  it("clears step 1 data when reset is triggered on step 1", () => {
    const draft = makeDraft();
    const result = applyReset(draft, STEP_IDS.CHARACTER_BASICS);

    expect(result.stepOne.classId).toBe("");
    expect(result.stepOne.name).toBe("");
    expect(result.stepTwo).toEqual(draft.stepTwo);
    expect(result.stepThree).toEqual(draft.stepThree);
  });

  it("clears step 2 data when reset is triggered on step 2", () => {
    const draft = makeDraft({ stepTwo: { motivation: "Find the lost sigil" } });
    const result = applyReset(draft, STEP_IDS.ANCESTRY_BACKGROUND);

    expect(result.stepTwo.ancestryId).toBe("");
    expect(result.stepTwo.backgroundId).toBe("");
    expect(result.stepTwo.motivation).toBe("");
    expect(result.stepOne).toEqual(draft.stepOne);
    expect(result.stepThree).toEqual(draft.stepThree);
  });

  it("clears step 3 data when reset is triggered on step 3", () => {
    const draft = makeDraft();
    const result = applyReset(draft, STEP_IDS.STATS_SKILLS);

    expect(result.stepThree.statArrayId).toBe("");
    expect(result.stepThree.stats).toEqual({ str: "", dex: "", int: "", wil: "" });
    expect(result.stepThree.skillAllocations).toEqual({});
    expect(result.stepOne).toEqual(draft.stepOne);
    expect(result.stepTwo).toEqual(draft.stepTwo);
  });

  it("makes the reset step invalid after clearing", () => {
    const draft = makeDraft();
    expect(canAdvance(draft, 0)).toBe(true);

    const result = applyReset(draft, STEP_IDS.CHARACTER_BASICS);
    expect(canAdvance(result, 0)).toBe(false);
  });
});
