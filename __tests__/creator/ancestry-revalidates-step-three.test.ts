import { describe, expect, it } from "vitest";
import { validateStatsSkills } from "@/lib/creator/stats-skills-validation";
import { DRAFT_SCHEMA_VERSION } from "@/lib/creator/constants";
import type { CreatorDraft } from "@/lib/creator/types";

/**
 * Tests that ancestry/background changes affect Step 3 validation
 * through the soft-cap rule, without requiring the user to re-enter Step 3.
 */

function makeDraft(overrides: {
  ancestryId?: string;
  backgroundId?: string;
  skillAllocations?: Record<string, number>;
  stats?: Partial<CreatorDraft["statsSkills"]["stats"]>;
} = {}): CreatorDraft {
  return {
    version: DRAFT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    characterBasics: { classId: "mage", name: "Test", description: "" },
    ancestryBackground: {
      ancestryId: overrides.ancestryId ?? "elf",
      backgroundId: overrides.backgroundId ?? "fearless",
      motivation: "",
    },
    statsSkills: {
      statArrayId: "standard",
      stats: { str: "2", dex: "2", int: "0", wil: "-1", ...overrides.stats },
      skillAllocations: overrides.skillAllocations ?? { arcana: 2, stealth: 2 },
    },
    languagesEquipment: { equipmentChoice: "gear", selectedLanguages: [] },
  };
}

describe("Ancestry/background changes affect Step 3 validity", () => {
  it("Step 3 is valid with elf (no skill modifiers) and moderate allocations", () => {
    const draft = makeDraft({ ancestryId: "elf" });
    const result = validateStatsSkills(draft);
    expect(result.valid).toBe(true);
  });

  it("changing ancestry to human (all +1) can invalidate Step 3 when allocations are near cap", () => {
    // arcana is INT-based; stat=0. With elf: total = 0+11 = 11 (ok). With human: total = 0+11+1 = 12 (ok at boundary)
    // At 12 allocated: elf total=12 (ok), human total=13 (exceeds cap)
    const draftElf = makeDraft({
      ancestryId: "elf",
      skillAllocations: { arcana: 12, stealth: 0 },
    });
    const elfResult = validateStatsSkills(draftElf);
    expect(elfResult.errors["skillAllocations.arcana"]).toBeUndefined();

    const draftHuman = makeDraft({
      ancestryId: "human",
      skillAllocations: { arcana: 12, stealth: 0 },
    });
    const humanResult = validateStatsSkills(draftHuman);
    expect(humanResult.errors["skillAllocations.arcana"]).toMatch(/exceeds maximum/);
  });

  it("changing ancestry back from human to elf restores Step 3 validity", () => {
    // Same allocations: with human it's invalid, with elf it becomes valid again
    const draftHuman = makeDraft({
      ancestryId: "human",
      skillAllocations: { arcana: 12, stealth: 0 },
    });
    expect(validateStatsSkills(draftHuman).errors["skillAllocations.arcana"]).toBeDefined();

    const draftElf = makeDraft({
      ancestryId: "elf",
      skillAllocations: { arcana: 12, stealth: 0 },
    });
    expect(validateStatsSkills(draftElf).errors["skillAllocations.arcana"]).toBeUndefined();
  });

  it("changing background to wild-one (naturecraft +1) can invalidate Step 3", () => {
    // naturecraft is WIL-based; stat=-1.
    // With fearless (no mod): 13 allocated → -1+13 = 12 (exactly at cap, ok)
    const draftFearless = makeDraft({
      backgroundId: "fearless",
      skillAllocations: { naturecraft: 13, stealth: 0 },
    });
    expect(validateStatsSkills(draftFearless).errors["skillAllocations.naturecraft"]).toBeUndefined();

    // Switching to wild-one (+1 naturecraft): 13 allocated → -1+13+1 = 13 (exceeds cap)
    const draftWild = makeDraft({
      backgroundId: "wild-one",
      skillAllocations: { naturecraft: 13, stealth: 0 },
    });
    expect(validateStatsSkills(draftWild).errors["skillAllocations.naturecraft"]).toBeDefined();

    // wild-one with 12 allocated → -1+12+1 = 12 (ok)
    const draftWildAt12 = makeDraft({
      backgroundId: "wild-one",
      skillAllocations: { naturecraft: 12, stealth: 0 },
    });
    expect(validateStatsSkills(draftWildAt12).errors["skillAllocations.naturecraft"]).toBeUndefined();
  });
});
