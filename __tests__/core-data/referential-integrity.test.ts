import { describe, it, expect } from "vitest";
import { loadCoreCreatorData } from "@/lib/core-data/loaders";

describe("referential integrity", () => {
  const data = loadCoreCreatorData();
  const startingGearIds = new Set(data.startingGear.map((g) => g.id));

  it("class keyStats reference valid stat values", () => {
    const validStats = new Set(["str", "dex", "int", "wil"]);
    for (const cls of data.classes) {
      for (const stat of cls.keyStats) {
        expect(validStats.has(stat), `${cls.id} has invalid keyStat "${stat}"`).toBe(true);
      }
    }
  });

  it("class save stats reference valid stat values", () => {
    const validStats = new Set(["str", "dex", "int", "wil"]);
    for (const cls of data.classes) {
      expect(
        validStats.has(cls.saves.advantaged),
        `${cls.id} has invalid advantaged save "${cls.saves.advantaged}"`,
      ).toBe(true);
      expect(
        validStats.has(cls.saves.disadvantaged),
        `${cls.id} has invalid disadvantaged save "${cls.saves.disadvantaged}"`,
      ).toBe(true);
    }
  });

  it("class startingGearIds reference existing starting gear", () => {
    for (const cls of data.classes) {
      for (const gearId of cls.startingGearIds) {
        expect(
          startingGearIds.has(gearId),
          `${cls.id} references non-existent starting gear "${gearId}"`,
        ).toBe(true);
      }
    }
  });

  it("skill stats reference valid stat values", () => {
    const validStats = new Set(["str", "dex", "int", "wil"]);
    for (const skill of data.skills) {
      expect(
        validStats.has(skill.stat),
        `${skill.id} has invalid stat "${skill.stat}"`,
      ).toBe(true);
    }
  });
});
