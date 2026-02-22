import { z } from "zod";
import { StableId, Stat, NonEmptyString } from "./primitives";

export const SkillSchema = z.object({
  id: StableId,
  name: NonEmptyString,
  stat: Stat,
  description: NonEmptyString,
});

export type Skill = z.infer<typeof SkillSchema>;

export const SkillsDatasetSchema = z.array(SkillSchema).min(1);
export type SkillsDataset = z.infer<typeof SkillsDatasetSchema>;
