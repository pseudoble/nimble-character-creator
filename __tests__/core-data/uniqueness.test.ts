import { describe, it, expect } from "vitest";
import {
  loadSkills,
  loadStatArrays,
  loadAncestries,
  loadBackgrounds,
  loadStartingGear,
  loadClasses,
} from "@/lib/core-data/loaders";

function findDuplicateIds(records: Array<{ id: string }>): string[] {
  const seen = new Set<string>();
  const dupes: string[] = [];
  for (const r of records) {
    if (seen.has(r.id)) dupes.push(r.id);
    seen.add(r.id);
  }
  return dupes;
}

describe("ID uniqueness", () => {
  it("skills have unique IDs", () => {
    expect(findDuplicateIds(loadSkills())).toEqual([]);
  });

  it("stat arrays have unique IDs", () => {
    expect(findDuplicateIds(loadStatArrays())).toEqual([]);
  });

  it("ancestries have unique IDs", () => {
    expect(findDuplicateIds(loadAncestries())).toEqual([]);
  });

  it("backgrounds have unique IDs", () => {
    expect(findDuplicateIds(loadBackgrounds())).toEqual([]);
  });

  it("starting gear items have unique IDs", () => {
    expect(findDuplicateIds(loadStartingGear())).toEqual([]);
  });

  it("classes have unique IDs", () => {
    expect(findDuplicateIds(loadClasses())).toEqual([]);
  });
});
