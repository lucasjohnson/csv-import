import { normalizeEmail } from "../normalizeEmail";
import { rowSchema } from "../schema";
import type { ErrorType, Field } from "./types";

export const validateSingle = (
  current: Record<Field, string>,
  emailCounts: Map<string, number>,
  existingEmails: Set<string>,
): Partial<Record<Field, ErrorType>> => {
  const result = rowSchema.safeParse(current);
  const errors: Partial<Record<Field, ErrorType>> = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      errors[issue.path[0] as Field] = "invalid";
    }
  }

  const normalizedEmail = normalizeEmail(current.email);
  if (!errors.email) {
    if (
      (emailCounts.get(normalizedEmail) ?? 0) > 1 ||
      existingEmails.has(normalizedEmail)
    ) {
      errors.email = "duplicate";
    }
  }

  return errors;
};
