import { describe, expect, it } from "vitest";
import { DRAFT_SCHEMA_VERSION } from "@/lib/creator/constants";
import type { CreatorDraft, StatsSkillsData } from "@/lib/creator/types";

function makeDraft(): CreatorDraft {
  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    characterBasics: { classId: "mage", name: "Gandalf", description: "A wise wizard" },
    ancestryBackground: { ancestryId: "elf", backgroundId: "fearless", motivation: "Save the realm" },
    statsSkills: {
      statArrayId: "standard",
      stats: { str: "2", dex: "2", int: "0", wil: "-1" },
      skillAllocations: { arcana: 2, stealth: 2 },
    },
    languagesEquipment: {
      equipmentChoice: "gear",
      selectedLanguages: [],
    },
  };
}

/**
 * Mirrors the updateStatsSkills merge logic from context.tsx
 */
function applyStatsSkillsUpdate(
  prev: StatsSkillsData,
  updates: Partial<StatsSkillsData>
): StatsSkillsData {
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
    const result = applyStatsSkillsUpdate(draft.statsSkills, { statArrayId: "min-max" });

    expect(result.stats).toEqual({ str: "", dex: "", int: "", wil: "" });
    expect(result.statArrayId).toBe("min-max");
  });

  it("preserves skill allocations when stat array changes", () => {
    const draft = makeDraft();
    const result = applyStatsSkillsUpdate(draft.statsSkills, { statArrayId: "min-max" });

    expect(result.skillAllocations).toEqual({ arcana: 2, stealth: 2 });
  });

  it("does not reset stat assignments when selecting the same stat array", () => {
    const draft = makeDraft();
    const result = applyStatsSkillsUpdate(draft.statsSkills, { statArrayId: "standard" });

    expect(result.stats).toEqual({ str: "2", dex: "2", int: "0", wil: "-1" });
    expect(result.skillAllocations).toEqual({ arcana: 2, stealth: 2 });
  });
});
