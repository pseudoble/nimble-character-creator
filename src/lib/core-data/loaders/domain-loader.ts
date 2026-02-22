import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { validateDataset, formatValidationErrors } from "../schemas/validate";
import { SkillsDatasetSchema, type SkillsDataset } from "../schemas/skills";
import { StatArraysDatasetSchema, type StatArraysDataset } from "../schemas/stat-arrays";
import { AncestriesDatasetSchema, type AncestriesDataset } from "../schemas/ancestries";
import { BackgroundsDatasetSchema, type BackgroundsDataset } from "../schemas/backgrounds";
import { StartingGearDatasetSchema, type StartingGearDataset } from "../schemas/starting-gear";
import { ClassesDatasetSchema, type ClassesDataset } from "../schemas/classes";

const __filename_ = fileURLToPath(import.meta.url);
const __dirname_ = dirname(__filename_);
const DATA_DIR = resolve(__dirname_, "../data");

function loadAndValidate<T>(domain: string, filename: string, schema: z.ZodType<T>): T {
  const filePath = resolve(DATA_DIR, filename);
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (err) {
    throw new Error(`Failed to read ${domain} data from ${filePath}: ${(err as Error).message}`);
  }
  const result = validateDataset(domain, schema, raw);
  if (!result.success) {
    throw new Error(formatValidationErrors(result));
  }
  return result.data;
}

export function loadSkills(): SkillsDataset {
  return loadAndValidate("skills", "skills.json", SkillsDatasetSchema);
}

export function loadStatArrays(): StatArraysDataset {
  return loadAndValidate("stat-arrays", "stat-arrays.json", StatArraysDatasetSchema);
}

export function loadAncestries(): AncestriesDataset {
  return loadAndValidate("ancestries", "ancestries.json", AncestriesDatasetSchema);
}

export function loadBackgrounds(): BackgroundsDataset {
  return loadAndValidate("backgrounds", "backgrounds.json", BackgroundsDatasetSchema);
}

export function loadStartingGear(): StartingGearDataset {
  return loadAndValidate("starting-gear", "starting-gear.json", StartingGearDatasetSchema);
}

export function loadClasses(): ClassesDataset {
  return loadAndValidate("classes", "classes.json", ClassesDatasetSchema);
}
