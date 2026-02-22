import { z } from "zod";
import { StableId, NonEmptyString } from "./primitives";

export const StatArraySchema = z.object({
  id: StableId,
  name: NonEmptyString,
  values: z.array(z.number().int()).length(4),
});

export type StatArray = z.infer<typeof StatArraySchema>;

export const StatArraysDatasetSchema = z.array(StatArraySchema).min(1);
export type StatArraysDataset = z.infer<typeof StatArraysDatasetSchema>;
