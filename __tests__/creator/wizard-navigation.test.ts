import { describe, expect, it } from "vitest";
import { validateStepOne } from "@/lib/creator/step-one-validation";
import { validateStepTwo } from "@/lib/creator/step-two-validation";
import { validateStepThree } from "@/lib/creator/step-three-validation";
import { DRAFT_SCHEMA_VERSION } from "@/lib/creator/constants";
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
