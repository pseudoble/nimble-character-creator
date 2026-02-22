import { z } from "zod";
import { StableId, Stat, HitDie, NonEmptyString } from "./primitives";

export const ClassSavesSchema = z.object({
  advantaged: Stat,
  disadvantaged: Stat,
});

export const ClassSchema = z.object({
  id: StableId,
  name: NonEmptyString,
  description: NonEmptyString,
  keyStats: z.array(Stat).length(2),
  hitDie: HitDie,
  startingHp: z.number().int().positive(),
  saves: ClassSavesSchema,
  armorProficiencies: z.array(z.string()),
  weaponProficiencies: z.array(z.string()).min(1),
  startingGearIds: z.array(StableId).min(1),
});

export type Class = z.infer<typeof ClassSchema>;

export const ClassesDatasetSchema = z.array(ClassSchema).min(1);
export type ClassesDataset = z.infer<typeof ClassesDatasetSchema>;
