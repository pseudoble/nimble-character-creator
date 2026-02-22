import { z } from "zod";

export type ValidationSuccess<T> = { success: true; data: T };
export type ValidationFailure = { success: false; domain: string; errors: string[] };
export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export function validateDataset<T>(
  domain: string,
  schema: z.ZodType<T>,
  data: unknown,
): ValidationResult<T> {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const errors = result.error.issues.map((issue) => {
    const path = issue.path.length > 0 ? `[${issue.path.join(".")}]` : "";
    return `${domain}${path}: ${issue.message}`;
  });
  return { success: false, domain, errors };
}

export function formatValidationErrors(result: ValidationFailure): string {
  return [
    `Validation failed for domain "${result.domain}":`,
    ...result.errors.map((e) => `  - ${e}`),
  ].join("\n");
}
