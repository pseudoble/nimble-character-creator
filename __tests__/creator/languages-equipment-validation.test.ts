import { describe, it, expect } from "vitest";
import { validateLanguagesEquipment } from "@/lib/creator/languages-equipment-validation";
import { createEmptyDraft } from "@/lib/creator/draft-persistence";
import type { CreatorDraft } from "@/lib/creator/types";

function makeDraft(overrides: {
  intStat?: string;
  equipmentChoice?: "" | "gear" | "gold";
  selectedLanguages?: string[];
} = {}): CreatorDraft {
  const draft = createEmptyDraft();
  draft.languagesEquipment.equipmentChoice = overrides.equipmentChoice ?? "gear";
  draft.languagesEquipment.selectedLanguages = overrides.selectedLanguages ?? [];
  draft.statsSkills.stats.int = overrides.intStat ?? "0";
  return draft;
}

describe("validateLanguagesEquipment", () => {
  describe("equipment validation", () => {
    it("fails when no choice is made", () => {
      const result = validateLanguagesEquipment(makeDraft({ equipmentChoice: "" }));
      expect(result.valid).toBe(false);
      expect(result.errors.equipmentChoice).toBeDefined();
    });

    it("passes when gear is selected", () => {
      const result = validateLanguagesEquipment(makeDraft({ equipmentChoice: "gear" }));
      expect(result.valid).toBe(true);
    });

    it("passes when gold is selected", () => {
      const result = validateLanguagesEquipment(makeDraft({ equipmentChoice: "gold" }));
      expect(result.valid).toBe(true);
    });
  });

  describe("language validation", () => {
    it("passes with zero INT and no languages selected", () => {
      const result = validateLanguagesEquipment(makeDraft({ intStat: "0" }));
      expect(result.valid).toBe(true);
      expect(result.errors.languages).toBeUndefined();
    });

    it("passes with negative INT and no languages selected", () => {
      const result = validateLanguagesEquipment(makeDraft({ intStat: "-1" }));
      expect(result.valid).toBe(true);
      expect(result.errors.languages).toBeUndefined();
    });

    it("fails with INT 1 and no languages selected", () => {
      const result = validateLanguagesEquipment(makeDraft({ intStat: "1" }));
      expect(result.valid).toBe(false);
      expect(result.errors.languages).toBeDefined();
    });

    it("passes with INT 1 and exactly 1 valid language", () => {
      const result = validateLanguagesEquipment(
        makeDraft({ intStat: "1", selectedLanguages: ["draconic"] })
      );
      expect(result.valid).toBe(true);
    });

    it("passes with INT 2 and exactly 2 valid languages", () => {
      const result = validateLanguagesEquipment(
        makeDraft({ intStat: "2", selectedLanguages: ["draconic", "infernal"] })
      );
      expect(result.valid).toBe(true);
    });

    it("fails with INT 2 and only 1 language selected", () => {
      const result = validateLanguagesEquipment(
        makeDraft({ intStat: "2", selectedLanguages: ["draconic"] })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.languages).toBeDefined();
    });

    it("fails with duplicate language selections", () => {
      const result = validateLanguagesEquipment(
        makeDraft({ intStat: "2", selectedLanguages: ["draconic", "draconic"] })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.languages).toContain("Duplicate");
    });

    it("fails with invalid language IDs", () => {
      const result = validateLanguagesEquipment(
        makeDraft({ intStat: "1", selectedLanguages: ["klingon"] })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.languages).toContain("Invalid");
    });

    it("fails when languages are selected but INT is zero", () => {
      const result = validateLanguagesEquipment(
        makeDraft({ intStat: "0", selectedLanguages: ["draconic"] })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.languages).toBeDefined();
    });

    it("fails when languages are selected but INT is negative", () => {
      const result = validateLanguagesEquipment(
        makeDraft({ intStat: "-1", selectedLanguages: ["draconic"] })
      );
      expect(result.valid).toBe(false);
      expect(result.errors.languages).toBeDefined();
    });
  });
});
