import { describe, it, expect } from "vitest";
import { ancestries } from "@/engine/content/ancestries";
import { backgrounds } from "@/engine/content/backgrounds";
import { ancestryModifiers, backgroundModifiers } from "@/lib/core-data/trait-modifiers";

describe("ancestry content contracts", () => {
  it("covers all ancestries from the old modifier map", () => {
    for (const id of Object.keys(ancestryModifiers)) {
      expect(ancestries[id], `Missing ancestry: ${id}`).toBeDefined();
    }
  });

  it("Human has initiative +1 and all skill bonuses", () => {
    const human = ancestries.human;
    const initBonus = human.bonuses.find((b) => b.target === "initiative");
    expect(initBonus?.value).toBe(1);
    const skillTargets = human.bonuses
      .filter((b) => !["initiative"].includes(b.target))
      .map((b) => b.target)
      .sort();
    expect(skillTargets).toEqual([
      "arcana",
      "examination",
      "finesse",
      "influence",
      "insight",
      "lore",
      "might",
      "naturecraft",
      "perception",
      "stealth",
    ]);
  });

  it("Dwarf has speed -1, maxWounds +1, maxHitDice +2", () => {
    const dwarf = ancestries.dwarf;
    expect(dwarf.bonuses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ target: "speed", value: -1 }),
        expect.objectContaining({ target: "maxWounds", value: 1 }),
        expect.objectContaining({ target: "maxHitDice", value: 2 }),
      ])
    );
  });

  it("Turtlefolk has speed -2, armor +4", () => {
    const tf = ancestries.turtlefolk;
    expect(tf.bonuses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ target: "speed", value: -2 }),
        expect.objectContaining({ target: "armor", value: 4 }),
      ])
    );
  });

  it("Bunbun has empty bonuses", () => {
    expect(ancestries.bunbun.bonuses).toHaveLength(0);
  });

  it("Orc has might +1", () => {
    const orc = ancestries.orc;
    expect(orc.bonuses).toEqual([
      expect.objectContaining({ target: "might", value: 1, label: "Orc Might" }),
    ]);
  });

  it("Oozeling-construct has hitDieSize +2", () => {
    const oc = ancestries["oozeling-construct"];
    expect(oc.bonuses).toEqual([
      expect.objectContaining({ target: "hitDieSize", value: 2 }),
    ]);
  });

  it("Elf has speed +1 and initiative advantage trait", () => {
    const elf = ancestries.elf;
    expect(elf.bonuses).toEqual([
      expect.objectContaining({ target: "speed", value: 1 }),
    ]);
    expect(elf.traits).toEqual([
      expect.objectContaining({ field: "initiative", type: "advantage" }),
    ]);
  });
});

describe("background content contracts", () => {
  it("covers all backgrounds from the old modifier map", () => {
    for (const id of Object.keys(backgroundModifiers)) {
      expect(backgrounds[id], `Missing background: ${id}`).toBeDefined();
    }
  });

  it("Fearless has armor -1, initiative +1", () => {
    const fearless = backgrounds.fearless;
    expect(fearless.bonuses).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ target: "armor", value: -1 }),
        expect.objectContaining({ target: "initiative", value: 1 }),
      ])
    );
  });

  it("Survivalist has maxHitDice +1", () => {
    expect(backgrounds.survivalist.bonuses).toEqual([
      expect.objectContaining({ target: "maxHitDice", value: 1 }),
    ]);
  });

  it("Raised by Goblins has goblin language", () => {
    expect(backgrounds["raised-by-goblins"].languages).toEqual(["goblin"]);
  });

  it("Acrobat has empty bonuses", () => {
    expect(backgrounds.acrobat.bonuses).toHaveLength(0);
  });

  it("Wild One has naturecraft +1", () => {
    expect(backgrounds["wild-one"].bonuses).toEqual([
      expect.objectContaining({ target: "naturecraft", value: 1 }),
    ]);
  });
});
