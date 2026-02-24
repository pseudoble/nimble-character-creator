import { describe, expect, it } from "vitest";
import { validateStepOne } from "@/lib/creator/step-one-validation";
import { validateAncestryBackground } from "@/lib/creator/ancestry-background-validation";
import { validateStatsSkills } from "@/lib/creator/stats-skills-validation";
import { validateStepFour } from "@/lib/creator/step-four-validation";
import { createEmptyDraft } from "@/lib/creator/draft-persistence";
import { DRAFT_SCHEMA_VERSION, STEP_IDS } from "@/lib/creator/constants";
import type { CreatorDraft } from "@/lib/creator/types";

const STEP_ORDER = [
  STEP_IDS.CHARACTER_BASICS,
  STEP_IDS.STATS_SKILLS,
  STEP_IDS.ANCESTRY_BACKGROUND,
  STEP_IDS.LANGUAGES_EQUIPMENT,
] as const;

type DraftOverrides = {
  stepOne?: Partial<CreatorDraft["stepOne"]>;
  ancestryBackground?: Partial<CreatorDraft["ancestryBackground"]>;
  statsSkills?: Partial<Omit<CreatorDraft["statsSkills"], "stats" | "skillAllocations">> & {
    stats?: Partial<CreatorDraft["statsSkills"]["stats"]>;
    skillAllocations?: Partial<Record<string, number>>;
  };
  stepFour?: Partial<CreatorDraft["stepFour"]>;
};

function makeDraft(overrides: DraftOverrides = {}): CreatorDraft {
  const statsSkillsDefaults: CreatorDraft["statsSkills"] = {
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
    ancestryBackground: {
      ancestryId: "elf",
      backgroundId: "fearless",
      motivation: "",
      ...overrides.ancestryBackground,
    },
    statsSkills: {
      ...statsSkillsDefaults,
      ...overrides.statsSkills,
      stats: {
        ...statsSkillsDefaults.stats,
        ...overrides.statsSkills?.stats,
      },
      skillAllocations: {
        ...statsSkillsDefaults.skillAllocations,
        ...overrides.statsSkills?.skillAllocations,
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
    [STEP_IDS.ANCESTRY_BACKGROUND]: validateAncestryBackground(draft),
    [STEP_IDS.STATS_SKILLS]: validateStatsSkills(draft),
    [STEP_IDS.LANGUAGES_EQUIPMENT]: validateStepFour(draft),
  };
}

function getInitialExpandedStep(validation: ReturnType<typeof getValidation>): string {
  const firstInvalid = STEP_ORDER.find((id) => !validation[id]?.valid);
  return firstInvalid ?? STEP_ORDER[0];
}

function applyReset(draft: CreatorDraft, stepId: string): CreatorDraft {
  const empty = createEmptyDraft();
  switch (stepId) {
    case STEP_IDS.CHARACTER_BASICS:
      return { ...draft, stepOne: empty.stepOne };
    case STEP_IDS.ANCESTRY_BACKGROUND:
      return { ...draft, ancestryBackground: empty.ancestryBackground };
    case STEP_IDS.STATS_SKILLS:
      return { ...draft, statsSkills: empty.statsSkills };
    case STEP_IDS.LANGUAGES_EQUIPMENT:
      return { ...draft, stepFour: empty.stepFour };
    default:
      return draft;
  }
}

function applyResetAll(): CreatorDraft {
  return createEmptyDraft();
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

  it("all steps are accessible regardless of validation", () => {
    const draft = makeDraft({ stepOne: { classId: "" } });
    const v = getValidation(draft);
    // Step 1 is invalid but all steps should be clickable
    expect(v[STEP_IDS.CHARACTER_BASICS].valid).toBe(false);
    // No locking - simulate toggling any step
    let expanded: string | null = STEP_ORDER[0];
    const toggle = (stepId: string) => {
      expanded = expanded === stepId ? null : stepId;
    };
    toggle(STEP_ORDER[2]); // Jump to step 3 directly
    expect(expanded).toBe(STEP_ORDER[2]);
    toggle(STEP_ORDER[3]); // Jump to step 4
    expect(expanded).toBe(STEP_ORDER[3]);
  });
});

describe("next button navigation", () => {
  it("advances from step 1 to step 2", () => {
    let expanded: string | null = STEP_ORDER[0];
    const handleNext = (stepId: string) => {
      const idx = (STEP_ORDER as readonly string[]).indexOf(stepId);
      if (idx < STEP_ORDER.length - 1) {
        expanded = STEP_ORDER[idx + 1];
      }
    };
    handleNext(STEP_ORDER[0]);
    expect(expanded).toBe(STEP_ORDER[1]);
  });

  it("advances from step 3 to step 4", () => {
    let expanded: string | null = STEP_ORDER[2];
    const handleNext = (stepId: string) => {
      const idx = (STEP_ORDER as readonly string[]).indexOf(stepId);
      if (idx < STEP_ORDER.length - 1) {
        expanded = STEP_ORDER[idx + 1];
      }
    };
    handleNext(STEP_ORDER[2]);
    expect(expanded).toBe(STEP_ORDER[3]);
  });

  it("does not advance past the last step", () => {
    let expanded: string | null = STEP_ORDER[3];
    const handleNext = (stepId: string) => {
      const idx = (STEP_ORDER as readonly string[]).indexOf(stepId);
      if (idx < STEP_ORDER.length - 1) {
        expanded = STEP_ORDER[idx + 1];
      }
    };
    handleNext(STEP_ORDER[3]);
    expect(expanded).toBe(STEP_ORDER[3]);
  });

  it("advances even when current step is invalid", () => {
    const draft = makeDraft({ stepOne: { classId: "" } });
    const v = getValidation(draft);
    expect(v[STEP_IDS.CHARACTER_BASICS].valid).toBe(false);

    let expanded: string | null = STEP_ORDER[0];
    const handleNext = (stepId: string) => {
      const idx = (STEP_ORDER as readonly string[]).indexOf(stepId);
      if (idx < STEP_ORDER.length - 1) {
        expanded = STEP_ORDER[idx + 1];
      }
    };
    handleNext(STEP_ORDER[0]);
    expect(expanded).toBe(STEP_ORDER[1]);
  });
});

describe("touched state tracking", () => {
  it("marks step as touched when navigating away via Next", () => {
    const touched = new Set<string>();
    const markTouched = (stepId: string) => touched.add(stepId);

    expect(touched.has(STEP_ORDER[0])).toBe(false);
    markTouched(STEP_ORDER[0]); // happens on Next click
    expect(touched.has(STEP_ORDER[0])).toBe(true);
  });

  it("marks step as touched when toggling to a different step", () => {
    const touched = new Set<string>();
    let expanded: string | null = STEP_ORDER[0];
    const handleToggle = (stepId: string) => {
      if (expanded && expanded !== stepId) {
        touched.add(expanded);
      }
      expanded = expanded === stepId ? null : stepId;
    };

    handleToggle(STEP_ORDER[2]); // leave step 0, go to step 2
    expect(touched.has(STEP_ORDER[0])).toBe(true);
    expect(touched.has(STEP_ORDER[2])).toBe(false); // not yet left step 2
  });

  it("reset all clears touched state", () => {
    const touched = new Set<string>();
    touched.add(STEP_ORDER[0]);
    touched.add(STEP_ORDER[1]);
    expect(touched.size).toBe(2);

    // Simulate resetAll
    touched.clear();
    expect(touched.size).toBe(0);
  });
});

describe("three-state header indicator", () => {
  it("untouched invalid step shows neutral state", () => {
    const draft = makeDraft({ ancestryBackground: { ancestryId: "" } });
    const v = getValidation(draft);
    const touched = new Set<string>();

    const isComplete = v[STEP_IDS.ANCESTRY_BACKGROUND].valid;
    const isTouched = touched.has(STEP_IDS.ANCESTRY_BACKGROUND);
    const needsAttention = isTouched && !isComplete;

    expect(isComplete).toBe(false);
    expect(needsAttention).toBe(false); // not touched = neutral
  });

  it("complete step shows complete state", () => {
    const draft = makeDraft();
    const v = getValidation(draft);

    const isComplete = v[STEP_IDS.CHARACTER_BASICS].valid;
    expect(isComplete).toBe(true);
  });

  it("touched invalid step shows needs-attention state", () => {
    const draft = makeDraft({ stepOne: { classId: "" } });
    const v = getValidation(draft);
    const touched = new Set<string>([STEP_IDS.CHARACTER_BASICS]);

    const isComplete = v[STEP_IDS.CHARACTER_BASICS].valid;
    const isTouched = touched.has(STEP_IDS.CHARACTER_BASICS);
    const needsAttention = isTouched && !isComplete;

    expect(needsAttention).toBe(true);
  });

  it("needs-attention state includes validation errors", () => {
    const draft = makeDraft({ stepOne: { classId: "", name: "" } });
    const v = getValidation(draft);
    const errors = v[STEP_IDS.CHARACTER_BASICS].errors;

    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });
});

describe("per-step reset", () => {
  it("resets step 1 data while preserving others", () => {
    const draft = makeDraft();
    const result = applyReset(draft, STEP_IDS.CHARACTER_BASICS);
    expect(result.stepOne.classId).toBe("");
    expect(result.stepOne.name).toBe("");
    expect(result.ancestryBackground).toEqual(draft.ancestryBackground);
    expect(result.statsSkills).toEqual(draft.statsSkills);
  });

  it("resets ancestry & background data while preserving others", () => {
    const draft = makeDraft({ ancestryBackground: { motivation: "Find the lost sigil" } });
    const result = applyReset(draft, STEP_IDS.ANCESTRY_BACKGROUND);
    expect(result.ancestryBackground.ancestryId).toBe("");
    expect(result.ancestryBackground.backgroundId).toBe("");
    expect(result.ancestryBackground.motivation).toBe("");
    expect(result.stepOne).toEqual(draft.stepOne);
  });

  it("resets stats & skills data while preserving others", () => {
    const draft = makeDraft();
    const result = applyReset(draft, STEP_IDS.STATS_SKILLS);
    expect(result.statsSkills.statArrayId).toBe("");
    expect(result.statsSkills.stats).toEqual({ str: "", dex: "", int: "", wil: "" });
    expect(result.statsSkills.skillAllocations).toEqual({});
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
});

describe("reset all", () => {
  it("clears all step data", () => {
    const result = applyResetAll();
    expect(result.stepOne.classId).toBe("");
    expect(result.stepOne.name).toBe("");
    expect(result.ancestryBackground.ancestryId).toBe("");
    expect(result.ancestryBackground.backgroundId).toBe("");
    expect(result.statsSkills.statArrayId).toBe("");
    expect(result.statsSkills.stats).toEqual({ str: "", dex: "", int: "", wil: "" });
    expect(result.stepFour.equipmentChoice).toBe("");
    expect(result.stepFour.selectedLanguages).toEqual([]);
  });

  it("produces invalid validation for all steps", () => {
    const result = applyResetAll();
    const v = getValidation(result);
    expect(v[STEP_IDS.CHARACTER_BASICS].valid).toBe(false);
    expect(v[STEP_IDS.ANCESTRY_BACKGROUND].valid).toBe(false);
    expect(v[STEP_IDS.STATS_SKILLS].valid).toBe(false);
    expect(v[STEP_IDS.LANGUAGES_EQUIPMENT].valid).toBe(false);
  });
});

describe("initial expanded step", () => {
  it("opens first invalid step on mount", () => {
    const draft = makeDraft({ ancestryBackground: { ancestryId: "" } });
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

describe("draft persistence with accordion", () => {
  it("restored draft opens the correct initial step", () => {
    const draft = makeDraft({ ancestryBackground: { ancestryId: "" } });
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
      ancestryBackground: { ancestryId: "elf", backgroundId: "fearless", motivation: "Revenge" },
    });
    expect(draft.stepOne.name).toBe("Aldric");
    expect(draft.ancestryBackground.motivation).toBe("Revenge");
  });
});
