import { describe, expect, it } from "vitest";
import {
  getRemainingStatValueCounts,
  getValidSkillIds,
  getValidStatArrayIds,
  validateStatsSkills,
} from "@/lib/creator/stats-skills-validation";
import { DRAFT_SCHEMA_VERSION } from "@/lib/creator/constants";
import type { CreatorDraft } from "@/lib/creator/types";

interface DraftOverrides {
  statsSkills?: Partial<Omit<CreatorDraft["statsSkills"], "stats" | "skillAllocations">> & {
    stats?: Partial<CreatorDraft["statsSkills"]["stats"]>;
    skillAllocations?: Partial<Record<string, number>>;
  };
  ancestryBackground?: Partial<CreatorDraft["ancestryBackground"]>;
}

function makeDraft(overrides: DraftOverrides = {}): CreatorDraft {
  const defaultStatsSkills: CreatorDraft["statsSkills"] = {
    statArrayId: "standard",
    stats: { str: "2", dex: "2", int: "0", wil: "-1" },
    skillAllocations: {
      arcana: 2,
      stealth: 2,
    },
  };
  const defaultAncestryBackground: CreatorDraft["ancestryBackground"] = {
    ancestryId: "elf",
    backgroundId: "fearless",
    motivation: "",
  };

  const ss = overrides.statsSkills ?? {};

  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    characterBasics: { classId: "mage", name: "Gandalf", description: "" },
    ancestryBackground: { ...defaultAncestryBackground, ...overrides.ancestryBackground },
    statsSkills: {
      ...defaultStatsSkills,
      ...ss,
      stats: {
        ...defaultStatsSkills.stats,
        ...ss.stats,
      },
      skillAllocations: {
        ...defaultStatsSkills.skillAllocations,
        ...ss.skillAllocations,
      },
    },
    languagesEquipment: {
      equipmentChoice: "gear",
      selectedLanguages: [],
    },
  };
}

describe("Stats & Skills validation", () => {
  it("passes for valid payload", () => {
    const result = validateStatsSkills(makeDraft());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("fails when stat array is missing", () => {
    const result = validateStatsSkills(makeDraft({ statsSkills: { statArrayId: "" } }));
    expect(result.valid).toBe(false);
    expect(result.errors.statArrayId).toBeDefined();
  });

  it("suppresses individual and aggregate stat errors when stat array is missing", () => {
    const result = validateStatsSkills(
      makeDraft({
        statsSkills: {
          statArrayId: "",
          stats: { str: "", dex: "", int: "", wil: "" },
        },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.statArrayId).toBeDefined();
    expect(result.errors["stats.str"]).toBeUndefined();
    expect(result.errors["stats.dex"]).toBeUndefined();
    expect(result.errors["stats.int"]).toBeUndefined();
    expect(result.errors["stats.wil"]).toBeUndefined();
    expect(result.errors.stats).toBeUndefined();
  });

  it("fails when any stat assignment is missing", () => {
    const result = validateStatsSkills(makeDraft({ statsSkills: { stats: { wil: "" } } }));
    expect(result.valid).toBe(false);
    expect(result.errors["stats.wil"]).toBeDefined();
  });

  it("fails when assigned values do not match selected stat array multiset", () => {
    const result = validateStatsSkills(
      makeDraft({
        statsSkills: {
          stats: { str: "2", dex: "2", int: "2", wil: "-1" },
        },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.stats).toBeDefined();
  });

  it("fails when skill point total is invalid", () => {
    const result = validateStatsSkills(
      makeDraft({
        statsSkills: {
          skillAllocations: { arcana: 1, stealth: 1 },
        },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.skillPointTotal).toBeDefined();
  });

  it("allows duplicate values up to available count", () => {
    const result = validateStatsSkills(
      makeDraft({
        statsSkills: {
          statArrayId: "balanced",
          stats: { str: "2", dex: "1", int: "1", wil: "0" },
        },
      }),
    );
    expect(result.valid).toBe(true);
  });

  it("rejects duplicate values used more than available count", () => {
    const result = validateStatsSkills(
      makeDraft({
        statsSkills: {
          statArrayId: "balanced",
          stats: { str: "1", dex: "1", int: "1", wil: "0" },
        },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.stats).toBeDefined();
  });
});

describe("Stats & Skills soft-cap validation", () => {
  // Default draft: elf/fearless (no skill modifiers), stats standard [2,2,0,-1]
  // arcana (INT-based, stat=0) + 4 allocated = total 4, well under 12
  it("passes when all final skill bonuses are at or below +12", () => {
    const result = validateStatsSkills(makeDraft());
    expect(result.valid).toBe(true);
  });

  it("rejects a skill whose final bonus exceeds +12 via high allocation", () => {
    // arcana is INT-based; stat=0, allocate 13 (synthetic), no trait mod → total 13 > 12
    // Also set total pool high enough to not trigger pool error
    const result = validateStatsSkills(
      makeDraft({
        statsSkills: {
          skillAllocations: { arcana: 13, stealth: 0 },
        },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors["skillAllocations.arcana"]).toMatch(/exceeds maximum/);
  });

  it("includes all-skills ancestry modifier in soft-cap computation", () => {
    // human: skills.all = +1. arcana (INT=0) + 12 allocated + 1 trait = 13 > 12
    const result = validateStatsSkills(
      makeDraft({
        ancestryBackground: { ancestryId: "human" },
        statsSkills: {
          skillAllocations: { arcana: 12, stealth: 0 },
        },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors["skillAllocations.arcana"]).toMatch(/exceeds maximum/);
  });

  it("includes per-skill ancestry modifier in soft-cap computation", () => {
    // orc: skills.might = +1. might is STR-based; stat=2, allocate 10 + 1 trait = 13 > 12
    const result = validateStatsSkills(
      makeDraft({
        ancestryBackground: { ancestryId: "orc" },
        statsSkills: {
          skillAllocations: { might: 10, stealth: 0 },
        },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors["skillAllocations.might"]).toMatch(/exceeds maximum/);
  });

  it("passes when trait modifiers keep final bonus exactly at +12", () => {
    // human: skills.all = +1. arcana (INT=0) + 11 allocated + 1 trait = 12
    const result = validateStatsSkills(
      makeDraft({
        ancestryBackground: { ancestryId: "human" },
        statsSkills: {
          skillAllocations: { arcana: 11, stealth: 0 },
        },
      }),
    );
    // Pool check will fail (11 != 4), but no soft-cap error
    expect(result.errors["skillAllocations.arcana"]).toBeUndefined();
  });

  it("includes per-skill background modifier in soft-cap computation", () => {
    // wild-one: skills.naturecraft = +1. naturecraft is WIL-based; stat=-1, allocate 13 + (-1) + 1 = 13 > 12
    const result = validateStatsSkills(
      makeDraft({
        ancestryBackground: { backgroundId: "wild-one" },
        statsSkills: {
          skillAllocations: { naturecraft: 13, stealth: 0 },
        },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors["skillAllocations.naturecraft"]).toMatch(/exceeds maximum/);
  });
});

describe("Stats & Skills remaining-value helper", () => {
  it("tracks remaining duplicate counts for each field", () => {
    const remaining = getRemainingStatValueCounts(
      [2, 2, 0, -1],
      { str: "2", dex: "2", int: "", wil: "" },
      "int",
    );
    expect(remaining[2]).toBe(0);
    expect(remaining[0]).toBe(1);
    expect(remaining[-1]).toBe(1);
  });

  it("restores availability when a value is no longer used by other fields", () => {
    const remaining = getRemainingStatValueCounts(
      [2, 2, 0, -1],
      { str: "2", dex: "0", int: "", wil: "" },
      "int",
    );
    expect(remaining[2]).toBe(1);
    expect(remaining[0]).toBe(0);
    expect(remaining[-1]).toBe(1);
  });
});

describe("Stats & Skills ID lists match core data", () => {
  it("getValidStatArrayIds() matches stat-arrays.json", async () => {
    const data = (await import("@/lib/core-data/data/stat-arrays.json")).default;
    const coreIds = data.map((array: { id: string }) => array.id).sort();
    const validIds = getValidStatArrayIds().sort();
    expect(validIds).toEqual(coreIds);
  });

  it("getValidSkillIds() matches skills.json", async () => {
    const data = (await import("@/lib/core-data/data/skills.json")).default;
    const coreIds = data.map((skill: { id: string }) => skill.id).sort();
    const validIds = getValidSkillIds().sort();
    expect(validIds).toEqual(coreIds);
  });
});
