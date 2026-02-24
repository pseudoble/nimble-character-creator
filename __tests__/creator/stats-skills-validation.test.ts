import { describe, expect, it } from "vitest";
import {
  getRemainingStatValueCounts,
  getValidSkillIds,
  getValidStatArrayIds,
  validateStatsSkills,
} from "@/lib/creator/stats-skills-validation";
import { DRAFT_SCHEMA_VERSION } from "@/lib/creator/constants";
import type { CreatorDraft } from "@/lib/creator/types";

type StatsSkillsOverrides = Partial<Omit<CreatorDraft["statsSkills"], "stats" | "skillAllocations">> & {
  stats?: Partial<CreatorDraft["statsSkills"]["stats"]>;
  skillAllocations?: Partial<Record<string, number>>;
};

function makeDraft(overrides: StatsSkillsOverrides = {}): CreatorDraft {
  const defaultStatsSkills: CreatorDraft["statsSkills"] = {
    statArrayId: "standard",
    stats: { str: "2", dex: "2", int: "0", wil: "-1" },
    skillAllocations: {
      arcana: 2,
      stealth: 2,
    },
  };

  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    stepOne: { classId: "mage", name: "Gandalf", description: "" },
    ancestryBackground: { ancestryId: "elf", backgroundId: "fearless", motivation: "" },
    statsSkills: {
      ...defaultStatsSkills,
      ...overrides,
      stats: {
        ...defaultStatsSkills.stats,
        ...overrides.stats,
      },
      skillAllocations: {
        ...defaultStatsSkills.skillAllocations,
        ...overrides.skillAllocations,
      },
    },
    stepFour: {
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
    const result = validateStatsSkills(makeDraft({ statArrayId: "" }));
    expect(result.valid).toBe(false);
    expect(result.errors.statArrayId).toBeDefined();
  });

  it("fails when any stat assignment is missing", () => {
    const result = validateStatsSkills(makeDraft({ stats: { wil: "" } }));
    expect(result.valid).toBe(false);
    expect(result.errors["stats.wil"]).toBeDefined();
  });

  it("fails when assigned values do not match selected stat array multiset", () => {
    const result = validateStatsSkills(
      makeDraft({
        stats: {
          str: "2",
          dex: "2",
          int: "2",
          wil: "-1",
        },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.stats).toBeDefined();
  });

  it("fails when skill point total is invalid", () => {
    const result = validateStatsSkills(
      makeDraft({
        skillAllocations: {
          arcana: 1,
          stealth: 1,
        },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.skillPointTotal).toBeDefined();
  });

  it("fails when any skill allocation exceeds the per-skill max", () => {
    const result = validateStatsSkills(
      makeDraft({
        skillAllocations: {
          arcana: 5,
          stealth: 0,
        },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors["skillAllocations.arcana"]).toBeDefined();
  });

  it("allows duplicate values up to available count", () => {
    const result = validateStatsSkills(
      makeDraft({
        statArrayId: "balanced",
        stats: {
          str: "2",
          dex: "1",
          int: "1",
          wil: "0",
        },
      }),
    );
    expect(result.valid).toBe(true);
  });

  it("rejects duplicate values used more than available count", () => {
    const result = validateStatsSkills(
      makeDraft({
        statArrayId: "balanced",
        stats: {
          str: "1",
          dex: "1",
          int: "1",
          wil: "0",
        },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.errors.stats).toBeDefined();
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
