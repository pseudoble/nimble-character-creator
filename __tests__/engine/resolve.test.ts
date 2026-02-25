import { describe, it, expect } from "vitest";
import {
  resolve,
  resolveBonus,
  collectBonuses,
  type ContentSources,
} from "@/engine/resolve";
import type {
  Ancestry,
  Background,
  CharacterConstants,
  ClassDef,
  Bonus,
} from "@/engine/types";

function makeCtx(overrides?: Partial<CharacterConstants>): CharacterConstants {
  return {
    str: 0,
    dex: 0,
    int: 0,
    wil: 0,
    level: 1,
    classId: "berserker",
    keyStats: ["str", "dex"],
    ...overrides,
  };
}

const emptyAncestry: Ancestry = {
  id: "human",
  name: "Human",
  bonuses: [],
  traits: [],
};

const emptyBackground: Background = {
  id: "acrobat",
  name: "Acrobat",
  bonuses: [],
};

const emptyClass: ClassDef = {
  id: "berserker",
  name: "Berserker",
  keyStats: ["str", "dex"],
  hitDie: "d12",
  startingHp: 20,
  saveProfile: { advantaged: "str", disadvantaged: "int" },
  proficiencies: { weapons: ["all-str"], armor: [] },
  derivations: [],
};

function makeSources(overrides?: Partial<ContentSources>): ContentSources {
  return {
    ancestry: emptyAncestry,
    classDef: emptyClass,
    background: emptyBackground,
    ...overrides,
  };
}

describe("resolveBonus", () => {
  it("evaluates a static number bonus", () => {
    const bonus: Bonus = { target: "speed", label: "Dwarf", value: -1 };
    const result = resolveBonus(bonus, makeCtx());
    expect(result).toEqual({ label: "Dwarf", value: -1 });
  });

  it("evaluates a function bonus against character constants", () => {
    const bonus: Bonus = {
      target: "manaMax",
      label: "Mage Mana",
      value: (ctx) => ctx.int * 3 + ctx.level,
    };
    const result = resolveBonus(bonus, makeCtx({ int: 3, level: 3 }));
    expect(result).toEqual({ label: "Mage Mana", value: 12 });
  });
});

describe("collectBonuses", () => {
  it("gathers bonuses targeting a specific key from multiple sources", () => {
    const sources = [
      { bonuses: [{ target: "speed" as const, label: "A", value: 1 }] },
      {
        bonuses: [
          { target: "armor" as const, label: "B", value: 2 },
          { target: "speed" as const, label: "C", value: -1 },
        ],
      },
    ];
    const result = collectBonuses("speed", sources);
    expect(result).toHaveLength(2);
    expect(result[0].label).toBe("A");
    expect(result[1].label).toBe("C");
  });

  it("returns empty array when no bonuses match", () => {
    const sources = [
      { bonuses: [{ target: "armor" as const, label: "X", value: 1 }] },
    ];
    expect(collectBonuses("speed", sources)).toHaveLength(0);
  });
});

describe("resolve", () => {
  it("computes speed with base 6 for no bonuses", () => {
    const result = resolve(makeCtx(), makeSources());
    expect(result.speed).toEqual({
      total: 6,
      entries: [{ label: "Base", value: 6 }],
    });
  });

  it("computes speed with Dwarf -1 bonus", () => {
    const dwarf: Ancestry = {
      ...emptyAncestry,
      id: "dwarf",
      name: "Dwarf",
      bonuses: [{ target: "speed", label: "Dwarf", value: -1 }],
    };
    const result = resolve(makeCtx(), makeSources({ ancestry: dwarf }));
    expect(result.speed.total).toBe(5);
    expect(result.speed.entries).toEqual([
      { label: "Base", value: 6 },
      { label: "Dwarf", value: -1 },
    ]);
  });

  it("computes speed with ancestry and boon sources", () => {
    const dwarf: Ancestry = {
      ...emptyAncestry,
      id: "dwarf",
      name: "Dwarf",
      bonuses: [{ target: "speed", label: "Dwarf", value: -1 }],
    };
    const result = resolve(
      makeCtx(),
      makeSources({
        ancestry: dwarf,
        boons: [
          {
            bonuses: [
              { target: "speed", label: "Boots of Speed", value: 1 },
            ],
          },
        ],
      })
    );
    expect(result.speed.total).toBe(6);
    expect(result.speed.entries).toEqual([
      { label: "Base", value: 6 },
      { label: "Dwarf", value: -1 },
      { label: "Boots of Speed", value: 1 },
    ]);
  });

  it("computes maxWounds with base 6 + Dwarf +1", () => {
    const dwarf: Ancestry = {
      ...emptyAncestry,
      id: "dwarf",
      name: "Dwarf",
      bonuses: [{ target: "maxWounds", label: "Dwarf", value: 1 }],
    };
    const result = resolve(makeCtx(), makeSources({ ancestry: dwarf }));
    expect(result.maxWounds.total).toBe(7);
  });

  it("computes initiative as DEX + bonuses", () => {
    const human: Ancestry = {
      ...emptyAncestry,
      bonuses: [{ target: "initiative", label: "Human", value: 1 }],
    };
    const result = resolve(
      makeCtx({ dex: 2 }),
      makeSources({ ancestry: human })
    );
    expect(result.initiative.total).toBe(3);
    expect(result.initiative.entries).toEqual([
      { label: "DEX", value: 2 },
      { label: "Human", value: 1 },
    ]);
  });

  it("computes inventory slots as 10 + STR", () => {
    const result = resolve(makeCtx({ str: 2 }), makeSources());
    expect(result.inventorySlots.total).toBe(12);
    expect(result.inventorySlots.entries).toEqual([
      { label: "Base", value: 10 },
      { label: "STR", value: 2 },
    ]);
  });

  it("computes maxHitDice as level + bonuses", () => {
    const dwarf: Ancestry = {
      ...emptyAncestry,
      id: "dwarf",
      bonuses: [{ target: "maxHitDice", label: "Dwarf", value: 2 }],
    };
    const survivalist: Background = {
      ...emptyBackground,
      id: "survivalist",
      bonuses: [{ target: "maxHitDice", label: "Survivalist", value: 1 }],
    };
    const result = resolve(
      makeCtx({ level: 1 }),
      makeSources({ ancestry: dwarf, background: survivalist })
    );
    expect(result.maxHitDice.total).toBe(4);
  });

  it("computes manaMax from class derivation function", () => {
    const mage: ClassDef = {
      ...emptyClass,
      id: "mage",
      derivations: [
        {
          target: "manaMax",
          label: "Mage Mana",
          value: (ctx) => ctx.int * 3 + ctx.level,
        },
      ],
    };
    const result = resolve(
      makeCtx({ int: 3, level: 3 }),
      makeSources({ classDef: mage })
    );
    expect(result.manaMax.total).toBe(12);
  });

  it("computes maxHp from class startingHp", () => {
    const result = resolve(makeCtx(), makeSources());
    expect(result.maxHp.total).toBe(20); // Berserker startingHp
  });

  it("computes second-order defendDamageReduction from armor total", () => {
    const turtlefolk: Ancestry = {
      ...emptyAncestry,
      id: "turtlefolk",
      bonuses: [{ target: "armor", label: "Turtlefolk", value: 4 }],
    };
    const result = resolve(makeCtx(), makeSources({ ancestry: turtlefolk }));
    expect(result.armor.total).toBe(4);
    expect(result.defendDamageReduction.total).toBe(4);
    expect(result.defendDamageReduction.entries[0]).toEqual({
      label: "Armor",
      value: 4,
    });
  });

  it("computes armor from equipment and ancestry bonuses", () => {
    const turtlefolk: Ancestry = {
      ...emptyAncestry,
      id: "turtlefolk",
      bonuses: [{ target: "armor", label: "Turtlefolk", value: 4 }],
    };
    const result = resolve(
      makeCtx({ dex: 2 }),
      makeSources({
        ancestry: turtlefolk,
        equipment: [
          {
            bonuses: [{ target: "armor", label: "Cheap Hides", value: 5 }],
          },
        ],
      })
    );

    expect(result.armor.total).toBe(9);
    expect(result.armor.entries).toEqual([
      { label: "Turtlefolk", value: 4 },
      { label: "Cheap Hides", value: 5 },
    ]);
    expect(result.defendDamageReduction.total).toBe(9);
  });

  it("computes second-order deathThreshold from maxWounds total", () => {
    const result = resolve(makeCtx(), makeSources());
    expect(result.deathThreshold.total).toBe(6); // base maxWounds
  });

  it("is deterministic — identical inputs produce identical outputs", () => {
    const ctx = makeCtx({ str: 1, dex: 2, int: 3, wil: 0 });
    const sources = makeSources();
    const result1 = resolve(ctx, sources);
    const result2 = resolve(ctx, sources);
    expect(result1).toEqual(result2);
  });

  it("computes skill bonuses from ancestry", () => {
    const orc: Ancestry = {
      ...emptyAncestry,
      id: "orc",
      bonuses: [{ target: "might", label: "Orc Might", value: 1 }],
    };
    const result = resolve(makeCtx(), makeSources({ ancestry: orc }));
    expect(result.might.total).toBe(1);
    expect(result.might.entries).toEqual([
      { label: "Orc Might", value: 1 },
    ]);
  });
});
