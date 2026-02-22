import { z } from "zod";

export const StableId = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Must be a lowercase kebab-case identifier");

export const Stat = z.enum(["str", "dex", "int", "wil"]);
export type Stat = z.infer<typeof Stat>;

export const Size = z.enum(["small", "medium", "large", "small-or-medium"]);
export type Size = z.infer<typeof Size>;

export const HitDie = z.enum(["d6", "d8", "d10", "d12"]);
export type HitDie = z.infer<typeof HitDie>;

export const GearCategory = z.enum(["weapon", "armor", "shield", "supplies"]);
export type GearCategory = z.infer<typeof GearCategory>;

export const NonEmptyString = z.string().min(1);

export const NonEmptyArray = <T extends z.ZodTypeAny>(schema: T) =>
  z.array(schema).min(1);
