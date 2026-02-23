import { describe, it, expect } from "vitest";
import classes from "@/lib/core-data/data/classes.json";
import startingGear from "@/lib/core-data/data/starting-gear.json";

const gearById = new Map(startingGear.map((g) => [g.id, g]));

describe("starting gear data integrity", () => {
  describe("all class startingGearIds resolve to valid entries", () => {
    for (const cls of classes) {
      it(`${cls.name} gear IDs all exist in starting-gear.json`, () => {
        for (const id of cls.startingGearIds) {
          expect(gearById.has(id), `Missing gear entry "${id}" for class ${cls.name}`).toBe(true);
        }
      });
    }
  });

  describe("weapons have damage field", () => {
    const weapons = startingGear.filter((g) => g.category === "weapon");

    for (const weapon of weapons) {
      it(`${weapon.name} has a non-empty damage field`, () => {
        expect("damage" in weapon).toBe(true);
        expect((weapon as { damage?: string }).damage).toBeTruthy();
      });
    }
  });

  describe("armor and shields have armor field", () => {
    const armorItems = startingGear.filter(
      (g) => g.category === "armor" || g.category === "shield"
    );

    for (const item of armorItems) {
      it(`${item.name} has a non-empty armor field`, () => {
        expect("armor" in item).toBe(true);
        expect((item as { armor?: string }).armor).toBeTruthy();
      });
    }
  });
});
