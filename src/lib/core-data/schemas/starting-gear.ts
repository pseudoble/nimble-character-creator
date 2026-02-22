import { z } from "zod";
import { StableId, GearCategory, NonEmptyString } from "./primitives";

export const StartingGearItemSchema = z.object({
  id: StableId,
  name: NonEmptyString,
  category: GearCategory,
});

export type StartingGearItem = z.infer<typeof StartingGearItemSchema>;

export const StartingGearDatasetSchema = z.array(StartingGearItemSchema).min(1);
export type StartingGearDataset = z.infer<typeof StartingGearDatasetSchema>;
