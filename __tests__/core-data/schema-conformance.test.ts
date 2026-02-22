import { describe, it, expect } from "vitest";
import {
  loadSkills,
  loadStatArrays,
  loadAncestries,
  loadBackgrounds,
  loadStartingGear,
  loadClasses,
} from "@/lib/core-data/loaders";
import {
  SkillSchema,
  StatArraySchema,
  AncestrySchema,
  BackgroundSchema,
  StartingGearItemSchema,
  ClassSchema,
} from "@/lib/core-data/schemas";

describe("schema conformance", () => {
  it("every skill record conforms to SkillSchema", () => {
    for (const skill of loadSkills()) {
      expect(SkillSchema.safeParse(skill).success).toBe(true);
    }
  });

  it("every stat array record conforms to StatArraySchema", () => {
    for (const arr of loadStatArrays()) {
      expect(StatArraySchema.safeParse(arr).success).toBe(true);
    }
  });

  it("every ancestry record conforms to AncestrySchema", () => {
    for (const a of loadAncestries()) {
      expect(AncestrySchema.safeParse(a).success).toBe(true);
    }
  });

  it("every background record conforms to BackgroundSchema", () => {
    for (const b of loadBackgrounds()) {
      expect(BackgroundSchema.safeParse(b).success).toBe(true);
    }
  });

  it("every starting gear record conforms to StartingGearItemSchema", () => {
    for (const g of loadStartingGear()) {
      expect(StartingGearItemSchema.safeParse(g).success).toBe(true);
    }
  });

  it("every class record conforms to ClassSchema", () => {
    for (const c of loadClasses()) {
      expect(ClassSchema.safeParse(c).success).toBe(true);
    }
  });
});
