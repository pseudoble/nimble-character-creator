import type { SkillsDataset } from "../schemas/skills";
import type { StatArraysDataset } from "../schemas/stat-arrays";
import type { AncestriesDataset } from "../schemas/ancestries";
import type { BackgroundsDataset } from "../schemas/backgrounds";
import type { StartingGearDataset } from "../schemas/starting-gear";
import type { ClassesDataset } from "../schemas/classes";
import {
  loadSkills,
  loadStatArrays,
  loadAncestries,
  loadBackgrounds,
  loadStartingGear,
  loadClasses,
} from "./domain-loader";

export interface CoreCreatorData {
  skills: SkillsDataset;
  statArrays: StatArraysDataset;
  ancestries: AncestriesDataset;
  backgrounds: BackgroundsDataset;
  startingGear: StartingGearDataset;
  classes: ClassesDataset;
}

export function loadCoreCreatorData(): CoreCreatorData {
  const errors: string[] = [];
  let skills: SkillsDataset | undefined;
  let statArrays: StatArraysDataset | undefined;
  let ancestries: AncestriesDataset | undefined;
  let backgrounds: BackgroundsDataset | undefined;
  let startingGear: StartingGearDataset | undefined;
  let classes: ClassesDataset | undefined;

  const loaders: Array<[string, () => void]> = [
    ["skills", () => { skills = loadSkills(); }],
    ["stat-arrays", () => { statArrays = loadStatArrays(); }],
    ["ancestries", () => { ancestries = loadAncestries(); }],
    ["backgrounds", () => { backgrounds = loadBackgrounds(); }],
    ["starting-gear", () => { startingGear = loadStartingGear(); }],
    ["classes", () => { classes = loadClasses(); }],
  ];

  for (const [domain, loader] of loaders) {
    try {
      loader();
    } catch (err) {
      errors.push(`[${domain}] ${(err as Error).message}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `Failed to load core creator data:\n${errors.map((e) => `  - ${e}`).join("\n")}`,
    );
  }

  return {
    skills: skills!,
    statArrays: statArrays!,
    ancestries: ancestries!,
    backgrounds: backgrounds!,
    startingGear: startingGear!,
    classes: classes!,
  };
}
