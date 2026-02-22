import { z } from "zod";
import { StableId, NonEmptyString } from "./primitives";

export const BackgroundSchema = z.object({
  id: StableId,
  name: NonEmptyString,
  description: NonEmptyString,
  requirement: z.string().nullable(),
});

export type Background = z.infer<typeof BackgroundSchema>;

export const BackgroundsDatasetSchema = z.array(BackgroundSchema).min(1);
export type BackgroundsDataset = z.infer<typeof BackgroundsDatasetSchema>;
