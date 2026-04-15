import type { ErrorType, Field } from "./types";

export const hasInvalidField = (
  errors: Partial<Record<Field, ErrorType>>,
): boolean =>
  errors.name !== undefined ||
  errors.email !== undefined ||
  errors.phone !== undefined ||
  errors.netWorth !== undefined;
