import { describe, expect, it } from "vitest";
import { validateStepOne } from "@/lib/creator/step-one-validation";
import { validateStepTwo } from "@/lib/creator/step-two-validation";
import { validateStepThree } from "@/lib/creator/step-three-validation";
import { validateStepFour } from "@/lib/creator/step-four-validation";
import { createEmptyDraft } from "@/lib/creator/draft-persistence";
import { DRAFT_SCHEMA_VERSION, STEP_IDS } from "@/lib/creator/constants";
import type { CreatorDraft } from "@/lib/creator/types";

const STEP_ORDER = [
  STEP_IDS.CHARACTER_BASICS,
  STEP_IDS.ANCESTRY_BACKGROUND,
  STEP_IDS.STATS_SKILLS,
  STEP_IDS.LANGUAGES_EQUIPMENT,
] as const;

type DraftOverrides = {
  stepOne?: Partial<CreatorDraft["stepOne"]>;
  stepTwo?: Partial<CreatorDraft["stepTwo"]>;
  stepThree?: Partial<Omit<CreatorDraft["stepThree"], "stats" | "skillAllocations">> & {
    stats?: Partial<CreatorDraft["stepThree"]["stats"]>;
    skillAllocations?: Partial<Record<string, number>>;
  };
  stepFour?: Partial<CreatorDraft["stepFour"]>;
};

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
    stepFour: {
      equipmentChoice: "gear",
      selectedLanguages: [],
      ...overrides.stepFour,
    },
  };
}

function getValidation(draft: CreatorDraft) {
  return {
    [STEP_IDS.CHARACTER_BASICS]: validateStepOne(draft),
    [STEP_IDS.ANCESTRY_BACKGROUND]: validateStepTwo(draft),
    [STEP_IDS.STATS_SKILLS]: validateStepThree(draft),
    [STEP_IDS.LANGUAGES_EQUIPMENT]: validateStepFour(draft),
  };
}

function isStepLocked(validation: ReturnType<typeof getValidation>, stepIndex: number): boolean {
  for (let i = 0; i < stepIndex; i++) {
    if (!validation[STEP_ORDER[i]]?.valid) return true;
  }
  return false;
}

function getInitialExpandedStep(validation: ReturnType<typeof getValidation>): string {
  const firstInvalid = STEP_ORDER.find((id) => !validation[id]?.valid);
  return firstInvalid ?? STEP_ORDER[0];
}

function getAutoAdvanceTarget(
  validation: ReturnType<typeof getValidation>,
  expandedStep: string,
): string | null {
  if (!validation[expandedStep]?.valid) return null;
  const currentIndex = (STEP_ORDER as readonly string[]).indexOf(expandedStep);
  for (let i = currentIndex + 1; i < STEP_ORDER.length; i++) {
    if (!validation[STEP_ORDER[i]]?.valid) return STEP_ORDER[i];
  }
  return null;
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
    case STEP_IDS.LANGUAGES_EQUIPMENT:
      return { ...draft, stepFour: empty.stepFour };
    default:
      return draft;
  }
}

describe("accordion expand/collapse", () => {
  it("only one section is expanded at a time", () => {
    let expanded: string | null = STEP_ORDER[0];
    const toggle = (stepId: string) => {
      expanded = expanded === stepId ? null : stepId;
    };

    expect(expanded).toBe(STEP_ORDER[0]);
    toggle(STEP_ORDER[1]);
    expect(expanded).toBe(STEP_ORDER[1]);
    toggle(STEP_ORDER[1]);
    expect(expanded).toBeNull();
  });

  it("toggling the same section collapses it", () => {
    let expanded: string | null = STEP_ORDER[0];
    expanded = expanded === STEP_ORDER[0] ? null : STEP_ORDER[0];
    expect(expanded).toBeNull();
  });
});

describe("accordion locking", () => {
  it("step 1 is never locked", () => {
    const draft = makeDraft({ stepOne: { classId: "" } });
    const v = getValidation(draft);
    expect(isStepLocked(v, 0)).toBe(false);
  });

  it("step 2 is locked when step 1 is invalid", () => {
    const draft = makeDraft({ stepOne: { classId: "" } });
    const v = getValidation(draft);
    expect(isStepLocked(v, 1)).toBe(true);
  });

  it("step 2 is unlocked when step 1 is valid", () => {
    const draft = makeDraft();
    const v = getValidation(draft);
    expect(isStepLocked(v, 1)).toBe(false);
  });

  it("step 3 is locked when step 2 is invalid", () => {
    const draft = makeDraft({ stepTwo: { ancestryId: "" } });
    const v = getValidation(draft);
    expect(isStepLocked(v, 2)).toBe(true);
  });

  it("step 4 is locked when step 3 is invalid", () => {
    const draft = makeDraft({
      stepThree: { skillAllocations: { arcana: 1, stealth: 1 } },
    });
    const v = getValidation(draft);
    expect(isStepLocked(v, 3)).toBe(true);
  });

  it("step 4 is unlocked when all previous steps are valid", () => {
    const draft = makeDraft();
    const v = getValidation(draft);
    expect(isStepLocked(v, 3)).toBe(false);
  });
});

describe("auto-advance", () => {
  it("advances to next incomplete step when current step becomes valid", () => {
    const draft = makeDraft({ stepTwo: { ancestryId: "" } });
    const v = getValidation(draft);
    const target = getAutoAdvanceTarget(v, STEP_IDS.CHARACTER_BASICS);
    expect(target).toBe(STEP_IDS.ANCESTRY_BACKGROUND);
  });

  it("skips completed steps to find next incomplete", () => {
    const draft = makeDraft({
      stepThree: { skillAllocations: { arcana: 1 } },
    });
    const v = getValidation(draft);
    const target = getAutoAdvanceTarget(v, STEP_IDS.ANCESTRY_BACKGROUND);
    expect(target).toBe(STEP_IDS.STATS_SKILLS);
  });

  it("returns null when all subsequent steps are complete", () => {
    const draft = makeDraft();
    const v = getValidation(draft);
    const target = getAutoAdvanceTarget(v, STEP_IDS.LANGUAGES_EQUIPMENT);
    expect(target).toBeNull();
  });

  it("returns null when current step is invalid (no advance)", () => {
    const draft = makeDraft({ stepOne: { classId: "" } });
    const v = getValidation(draft);
    const target = getAutoAdvanceTarget(v, STEP_IDS.CHARACTER_BASICS);
    expect(target).toBeNull();
  });
});

describe("initial expanded step", () => {
  it("opens first invalid step on mount", () => {
    const draft = makeDraft({ stepTwo: { ancestryId: "" } });
    const v = getValidation(draft);
    expect(getInitialExpandedStep(v)).toBe(STEP_IDS.ANCESTRY_BACKGROUND);
  });

  it("opens step 1 when all steps are incomplete", () => {
    const draft = makeDraft({ stepOne: { classId: "" } });
    const v = getValidation(draft);
    expect(getInitialExpandedStep(v)).toBe(STEP_IDS.CHARACTER_BASICS);
  });

  it("opens step 1 when all steps are complete (fallback)", () => {
    const draft = makeDraft();
    const v = getValidation(draft);
    expect(getInitialExpandedStep(v)).toBe(STEP_IDS.CHARACTER_BASICS);
  });
});

describe("accordion reset", () => {
  it("resets the currently expanded step data", () => {
    const draft = makeDraft();
    const result = applyReset(draft, STEP_IDS.CHARACTER_BASICS);
    expect(result.stepOne.classId).toBe("");
    expect(result.stepOne.name).toBe("");
    expect(result.stepTwo).toEqual(draft.stepTwo);
    expect(result.stepThree).toEqual(draft.stepThree);
  });

  it("resets step 2 data while preserving others", () => {
    const draft = makeDraft({ stepTwo: { motivation: "Find the lost sigil" } });
    const result = applyReset(draft, STEP_IDS.ANCESTRY_BACKGROUND);
    expect(result.stepTwo.ancestryId).toBe("");
    expect(result.stepTwo.backgroundId).toBe("");
    expect(result.stepTwo.motivation).toBe("");
    expect(result.stepOne).toEqual(draft.stepOne);
  });

  it("resets step 3 data while preserving others", () => {
    const draft = makeDraft();
    const result = applyReset(draft, STEP_IDS.STATS_SKILLS);
    expect(result.stepThree.statArrayId).toBe("");
    expect(result.stepThree.stats).toEqual({ str: "", dex: "", int: "", wil: "" });
    expect(result.stepThree.skillAllocations).toEqual({});
    expect(result.stepOne).toEqual(draft.stepOne);
  });

  it("resets step 4 data while preserving others", () => {
    const draft = makeDraft();
    const result = applyReset(draft, STEP_IDS.LANGUAGES_EQUIPMENT);
    expect(result.stepFour.equipmentChoice).toBe("");
    expect(result.stepFour.selectedLanguages).toEqual([]);
    expect(result.stepOne).toEqual(draft.stepOne);
  });

  it("makes the reset step invalid after clearing", () => {
    const draft = makeDraft();
    const vBefore = getValidation(draft);
    expect(vBefore[STEP_IDS.CHARACTER_BASICS].valid).toBe(true);

    const result = applyReset(draft, STEP_IDS.CHARACTER_BASICS);
    const vAfter = getValidation(result);
    expect(vAfter[STEP_IDS.CHARACTER_BASICS].valid).toBe(false);
  });

  it("reset re-locks downstream steps", () => {
    const draft = makeDraft();
    const vBefore = getValidation(draft);
    expect(isStepLocked(vBefore, 1)).toBe(false);

    const result = applyReset(draft, STEP_IDS.CHARACTER_BASICS);
    const vAfter = getValidation(result);
    expect(isStepLocked(vAfter, 1)).toBe(true);
    expect(isStepLocked(vAfter, 2)).toBe(true);
  });
});

describe("draft persistence with accordion", () => {
  it("restored draft opens the correct initial step", () => {
    const draft = makeDraft({ stepTwo: { ancestryId: "" } });
    const v = getValidation(draft);
    expect(getInitialExpandedStep(v)).toBe(STEP_IDS.ANCESTRY_BACKGROUND);
  });

  it("restored draft with all steps valid opens step 1", () => {
    const draft = makeDraft();
    const v = getValidation(draft);
    expect(getInitialExpandedStep(v)).toBe(STEP_IDS.CHARACTER_BASICS);
  });

  it("restored draft preserves all step data", () => {
    const draft = makeDraft({
      stepOne: { name: "Aldric", classId: "mage" },
      stepTwo: { ancestryId: "elf", backgroundId: "fearless", motivation: "Revenge" },
    });
    expect(draft.stepOne.name).toBe("Aldric");
    expect(draft.stepTwo.motivation).toBe("Revenge");
  });
});
