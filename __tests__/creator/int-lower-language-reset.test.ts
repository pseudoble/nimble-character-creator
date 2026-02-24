import { describe, expect, it } from "vitest";
import type { CreatorDraft, StatsSkillsData, LanguagesEquipmentData } from "@/lib/creator/types";
import { DRAFT_SCHEMA_VERSION } from "@/lib/creator/constants";

function makeDraft(intValue: string, selectedLanguages: string[]): CreatorDraft {
  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    characterBasics: { classId: "mage", name: "Gandalf", description: "A wise wizard" },
    ancestryBackground: { ancestryId: "elf", backgroundId: "fearless", motivation: "Save the realm" },
    statsSkills: {
      statArrayId: "standard",
      stats: { str: "0", dex: "0", int: intValue, wil: "0" },
      skillAllocations: {},
    },
    languagesEquipment: {
      equipmentChoice: "gear",
      selectedLanguages,
    },
  };
}

/**
 * Mirrors the updateStatsSkills merge + language trim logic from context.tsx
 */
function applyStatsSkillsUpdate(
  draft: CreatorDraft,
  updates: Partial<StatsSkillsData>
): { statsSkills: StatsSkillsData; languagesEquipment: LanguagesEquipmentData } {
  const prev = draft.statsSkills;
  const statArrayChanged =
    updates.statArrayId !== undefined &&
    updates.statArrayId !== prev.statArrayId;

  const merged = statArrayChanged
    ? { ...prev, ...updates, stats: { str: "", dex: "", int: "", wil: "" } }
    : { ...prev, ...updates };

  const prevInt = Number.parseInt(prev.stats.int, 10) || 0;
  const newInt = Number.parseInt(merged.stats.int, 10) || 0;
  let languagesEquipment = draft.languagesEquipment;
  if (newInt < prevInt && draft.languagesEquipment.selectedLanguages.length > 0) {
    const maxLanguages = Math.max(0, newInt);
    languagesEquipment = {
      ...draft.languagesEquipment,
      selectedLanguages: draft.languagesEquipment.selectedLanguages.slice(0, maxLanguages),
    };
  }

  return { statsSkills: merged, languagesEquipment };
}

describe("INT lowered resets language selections", () => {
  it("clears all selected languages when INT drops from 2 to 0", () => {
    const draft = makeDraft("2", ["draconic", "infernal"]);
    const result = applyStatsSkillsUpdate(draft, { stats: { ...draft.statsSkills.stats, int: "0" } });

    expect(result.languagesEquipment.selectedLanguages).toEqual([]);
  });

  it("trims to first language when INT drops from 3 to 1", () => {
    const draft = makeDraft("3", ["draconic", "infernal", "celestial"]);
    const result = applyStatsSkillsUpdate(draft, { stats: { ...draft.statsSkills.stats, int: "1" } });

    expect(result.languagesEquipment.selectedLanguages).toEqual(["draconic"]);
  });

  it("clears all selected languages when INT drops to negative", () => {
    const draft = makeDraft("1", ["draconic"]);
    const result = applyStatsSkillsUpdate(draft, { stats: { ...draft.statsSkills.stats, int: "-1" } });

    expect(result.languagesEquipment.selectedLanguages).toEqual([]);
  });

  it("does not remove existing selections when INT is raised", () => {
    const draft = makeDraft("1", ["draconic"]);
    const result = applyStatsSkillsUpdate(draft, { stats: { ...draft.statsSkills.stats, int: "2" } });

    expect(result.languagesEquipment.selectedLanguages).toEqual(["draconic"]);
  });

  it("does not affect language selections when a non-INT stat changes", () => {
    const draft = makeDraft("2", ["draconic", "infernal"]);
    const result = applyStatsSkillsUpdate(draft, { stats: { ...draft.statsSkills.stats, str: "3" } });

    expect(result.languagesEquipment.selectedLanguages).toEqual(["draconic", "infernal"]);
  });

  it("clears language selections when stat array changes", () => {
    const draft = makeDraft("2", ["draconic", "infernal"]);
    const result = applyStatsSkillsUpdate(draft, { statArrayId: "min-max" });

    expect(result.statsSkills.stats).toEqual({ str: "", dex: "", int: "", wil: "" });
    expect(result.languagesEquipment.selectedLanguages).toEqual([]);
  });
});
