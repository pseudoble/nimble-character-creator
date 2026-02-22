import { describe, it, expect } from "vitest";
import { loadCoreCreatorData } from "@/lib/core-data/loaders";

describe("creator data invariants", () => {
  const data = loadCoreCreatorData();

  it("all four stats are covered by skills", () => {
    const statsCovered = new Set(data.skills.map((s) => s.stat));
    expect(statsCovered).toContain("str");
    expect(statsCovered).toContain("dex");
    expect(statsCovered).toContain("int");
    expect(statsCovered).toContain("wil");
  });

  it("every stat array has exactly 4 values", () => {
    for (const arr of data.statArrays) {
      expect(arr.values, `${arr.id} should have 4 values`).toHaveLength(4);
    }
  });

  it("every class has exactly 2 key stats", () => {
    for (const cls of data.classes) {
      expect(cls.keyStats, `${cls.id} should have 2 keyStats`).toHaveLength(2);
    }
  });

  it("every class advantaged and disadvantaged saves are different", () => {
    for (const cls of data.classes) {
      expect(cls.saves.advantaged, `${cls.id} saves should differ`).not.toBe(
        cls.saves.disadvantaged,
      );
    }
  });

  it("every class has positive starting HP", () => {
    for (const cls of data.classes) {
      expect(cls.startingHp, `${cls.id} startingHp`).toBeGreaterThan(0);
    }
  });

  it("at least one ancestry of each common size exists", () => {
    const sizes = new Set(data.ancestries.map((a) => a.size));
    expect(sizes).toContain("small");
    expect(sizes).toContain("medium");
  });

  it("at least 3 stat arrays are available", () => {
    expect(data.statArrays.length).toBeGreaterThanOrEqual(3);
  });

  it("at least 10 classes are available", () => {
    expect(data.classes.length).toBeGreaterThanOrEqual(10);
  });
});
