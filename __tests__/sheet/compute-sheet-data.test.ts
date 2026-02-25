import { describe, it, expect } from "vitest";
import {
  computeSheetData,
  parseStat,
  parseArmorString,
  incrementHitDie,
} from "@/lib/sheet/compute-sheet-data";
import type { CreatorDraft } from "@/lib/creator/types";

function makeDraft(overrides: {
  classId?: string;
  name?: string;
  ancestryId?: string;
  backgroundId?: string;
  motivation?: string;
  stats?: { str: string; dex: string; int: string; wil: string };
  skillAllocations?: Record<string, number>;
  equipmentChoice?: "gear" | "gold" | "";
  selectedLanguages?: string[];
}): CreatorDraft {
  return {
    version: 4,
    updatedAt: new Date().toISOString(),
    characterBasics: {
      classId: overrides.classId ?? "berserker",
      name: overrides.name ?? "Test",
      description: "",
    },
    ancestryBackground: {
      ancestryId: overrides.ancestryId ?? "human",
      backgroundId: overrides.backgroundId ?? "fearless",
      motivation: overrides.motivation ?? "",
    },
    statsSkills: {
      statArrayId: "standard",
      stats: overrides.stats ?? { str: "2", dex: "2", int: "0", wil: "-1" },
      skillAllocations: overrides.skillAllocations ?? {},
    },
    languagesEquipment: {
      equipmentChoice: overrides.equipmentChoice ?? "gear",
      selectedLanguages: overrides.selectedLanguages ?? [],
    },
  };
}

describe("parseStat", () => {
  it("parses positive integers", () => expect(parseStat("2")).toBe(2));
  it("parses negative integers", () => expect(parseStat("-1")).toBe(-1));
  it("returns 0 for empty string", () => expect(parseStat("")).toBe(0));
});

describe("parseArmorString", () => {
  it("parses simple DEX armor", () => {
    expect(parseArmorString("3+DEX", 2)).toBe(5);
  });
  it("parses armor with max DEX cap", () => {
    expect(parseArmorString("6+DEX (max 2)", 3)).toBe(8);
  });
  it("parses armor with max DEX cap when DEX is lower", () => {
    expect(parseArmorString("6+DEX (max 2)", 1)).toBe(7);
  });
  it("parses shield bonus", () => {
    expect(parseArmorString("+2", 3)).toBe(2);
  });
});

describe("incrementHitDie", () => {
  it("increments d6 to d8", () => expect(incrementHitDie("d6")).toBe("d8"));
  it("increments d8 to d10", () => expect(incrementHitDie("d8")).toBe("d10"));
  it("increments d12 to d20", () => expect(incrementHitDie("d12")).toBe("d20"));
  it("does not increment d20", () => expect(incrementHitDie("d20")).toBe("d20"));
});

describe("computeSheetData", () => {
  it("computes skill scores with Human +1 all bonus", () => {
    const draft = makeDraft({
      ancestryId: "human",
      stats: { str: "2", dex: "2", int: "0", wil: "-1" },
      skillAllocations: { might: 2 },
    });
    const sheet = computeSheetData(draft);
    const might = sheet.skills.find((s) => s.id === "might")!;
    // STR 2 + allocated 2 + Human +1 = 5
    expect(might.total).toBe(5);
  });

  it("computes speed for Dwarf (-1)", () => {
    const draft = makeDraft({ ancestryId: "dwarf" });
    const sheet = computeSheetData(draft);
    expect(sheet.speed).toBe(5); // base 6 - 1
  });

  it("computes max wounds for Dwarf (+1)", () => {
    const draft = makeDraft({ ancestryId: "dwarf" });
    const sheet = computeSheetData(draft);
    expect(sheet.maxWounds).toBe(7); // base 6 + 1
  });

  it("computes initiative for Human with DEX +2", () => {
    const draft = makeDraft({
      ancestryId: "human",
      backgroundId: "acrobat", // no initiative modifier
      stats: { str: "0", dex: "2", int: "0", wil: "0" },
    });
    const sheet = computeSheetData(draft);
    expect(sheet.initiative).toBe(3); // DEX 2 + Human +1
  });

  it("computes inventory slots from STR", () => {
    const draft = makeDraft({ stats: { str: "2", dex: "0", int: "0", wil: "0" } });
    const sheet = computeSheetData(draft);
    expect(sheet.inventorySlots).toBe(12); // 10 + STR 2
  });

  it("increments hit die for Oozeling", () => {
    const draft = makeDraft({
      classId: "cheat", // d6
      ancestryId: "oozeling-construct",
    });
    const sheet = computeSheetData(draft);
    expect(sheet.hitDieSize).toBe("d8"); // d6 → d8
  });

  it("computes armor from equipment with DEX", () => {
    const draft = makeDraft({
      classId: "cheat", // has cheap-hides (3+DEX)
      stats: { str: "0", dex: "2", int: "0", wil: "0" },
      equipmentChoice: "gear",
    });
    const sheet = computeSheetData(draft);
    // Cheap Hides 3+DEX with DEX 2 = 5, + fearless -1 = 4
    expect(sheet.armor).toBe(4);
  });

  it("computes armor with max DEX cap", () => {
    const draft = makeDraft({
      classId: "commander", // rusty-mail (6+DEX (max 2))
      ancestryId: "bunbun", // no armor mods
      backgroundId: "acrobat", // no armor mods
      stats: { str: "0", dex: "3", int: "0", wil: "0" },
      equipmentChoice: "gear",
    });
    const sheet = computeSheetData(draft);
    // Rusty Mail 6 + min(3,2) = 8
    expect(sheet.armor).toBe(8);
  });

  it("returns gold 50 when gold is chosen", () => {
    const draft = makeDraft({ equipmentChoice: "gold" });
    const sheet = computeSheetData(draft);
    expect(sheet.gold).toBe(50);
    expect(sheet.equipment).toBeNull();
  });

  it("computes languages with Common + ancestry + selections", () => {
    const draft = makeDraft({
      ancestryId: "elf", // elvish
      stats: { str: "0", dex: "0", int: "2", wil: "0" },
      selectedLanguages: ["goblin", "infernal"],
    });
    const sheet = computeSheetData(draft);
    expect(sheet.languages).toEqual(["Common", "Elvish", "Goblin", "Infernal"]);
  });

  it("excludes ancestry language when INT is negative", () => {
    const draft = makeDraft({
      ancestryId: "elf",
      stats: { str: "0", dex: "0", int: "-1", wil: "0" },
    });
    const sheet = computeSheetData(draft);
    expect(sheet.languages).toEqual(["Common"]);
  });

  it("includes Kobold influence conditional", () => {
    const draft = makeDraft({ ancestryId: "kobold" });
    const sheet = computeSheetData(draft);
    const influence = sheet.skills.find((s) => s.id === "influence")!;
    expect(influence.conditional?.description).toBe(
      "+3 to Influence vs friendly characters"
    );
  });

  it("includes Ratfolk armor conditional in vitals", () => {
    const draft = makeDraft({ ancestryId: "ratfolk" });
    const sheet = computeSheetData(draft);
    expect(sheet.conditionals).toContainEqual({
      field: "armor",
      description: "+2 Armor if you moved on your last turn",
    });
  });

  it("computes hit dice count with dwarf +2 and survivalist +1", () => {
    const draft = makeDraft({
      ancestryId: "dwarf",
      backgroundId: "survivalist",
    });
    const sheet = computeSheetData(draft);
    expect(sheet.hitDiceCount).toBe(4); // level 1 + dwarf 2 + survivalist 1
  });

  it("computes back-out-of-retirement max wounds -1", () => {
    const draft = makeDraft({ backgroundId: "back-out-of-retirement" });
    const sheet = computeSheetData(draft);
    expect(sheet.maxWounds).toBe(5); // base 6 - 1
  });

  it("uses displayName for ancestry language (Gnomish for gnome)", () => {
    const draft = makeDraft({
      ancestryId: "gnome",
      stats: { str: "0", dex: "0", int: "1", wil: "0" },
    });
    const sheet = computeSheetData(draft);
    expect(sheet.languages).toContain("Gnomish");
    expect(sheet.languages).not.toContain("Dwarvish");
  });

  it("exposes keyStats from the class (Berserker: str, dex)", () => {
    const draft = makeDraft({ classId: "berserker" });
    const sheet = computeSheetData(draft);
    expect(sheet.keyStats).toEqual(["str", "dex"]);
  });

  it("returns keyStats [] when no class is selected", () => {
    const draft = makeDraft({ classId: "" });
    const sheet = computeSheetData(draft);
    expect(sheet.keyStats).toEqual([]);
  });
});
