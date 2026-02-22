import { describe, it, expect } from "vitest";
import {
  loadSkills,
  loadStatArrays,
  loadAncestries,
  loadBackgrounds,
  loadStartingGear,
  loadClasses,
  loadCoreCreatorData,
} from "@/lib/core-data/loaders";

describe("domain loaders", () => {
  it("loads skills and returns typed data", () => {
    const skills = loadSkills();
    expect(skills.length).toBeGreaterThan(0);
    expect(skills[0]).toHaveProperty("id");
    expect(skills[0]).toHaveProperty("stat");
  });

  it("loads stat arrays and returns typed data", () => {
    const arrays = loadStatArrays();
    expect(arrays.length).toBeGreaterThan(0);
    expect(arrays[0].values).toHaveLength(4);
  });

  it("loads ancestries and returns typed data", () => {
    const ancestries = loadAncestries();
    expect(ancestries.length).toBeGreaterThan(0);
    expect(ancestries[0]).toHaveProperty("size");
    expect(ancestries[0]).toHaveProperty("traitName");
  });

  it("loads backgrounds and returns typed data", () => {
    const backgrounds = loadBackgrounds();
    expect(backgrounds.length).toBeGreaterThan(0);
    expect(backgrounds[0]).toHaveProperty("description");
  });

  it("loads starting gear and returns typed data", () => {
    const gear = loadStartingGear();
    expect(gear.length).toBeGreaterThan(0);
    expect(gear[0]).toHaveProperty("category");
  });

  it("loads classes and returns typed data", () => {
    const classes = loadClasses();
    expect(classes.length).toBeGreaterThan(0);
    expect(classes[0]).toHaveProperty("hitDie");
    expect(classes[0]).toHaveProperty("keyStats");
  });
});

describe("aggregate loader", () => {
  it("returns all six domains", () => {
    const data = loadCoreCreatorData();
    expect(data.skills.length).toBeGreaterThan(0);
    expect(data.statArrays.length).toBeGreaterThan(0);
    expect(data.ancestries.length).toBeGreaterThan(0);
    expect(data.backgrounds.length).toBeGreaterThan(0);
    expect(data.startingGear.length).toBeGreaterThan(0);
    expect(data.classes.length).toBeGreaterThan(0);
  });

  it("returns typed data usable without additional parsing", () => {
    const data = loadCoreCreatorData();
    const mage = data.classes.find((c) => c.id === "mage");
    expect(mage).toBeDefined();
    expect(mage!.keyStats).toEqual(["int", "wil"]);
    expect(mage!.hitDie).toBe("d6");
  });
});
