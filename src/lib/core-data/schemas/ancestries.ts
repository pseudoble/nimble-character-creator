import { z } from "zod";
import { StableId, Size, NonEmptyString } from "./primitives";

export const AncestrySchema = z.object({
  id: StableId,
  name: NonEmptyString,
  size: Size,
  traitName: NonEmptyString,
  traitDescription: NonEmptyString,
});

export type Ancestry = z.infer<typeof AncestrySchema>;

export const AncestriesDatasetSchema = z.array(AncestrySchema).min(1);
export type AncestriesDataset = z.infer<typeof AncestriesDatasetSchema>;
