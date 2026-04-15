import type { Field, RowState } from "./types";
import { buildEmailCounts } from "./buildEmailCounts";
import { validateSingle } from "./validateSingle";

export const validateRows = (
  records: Record<Field, string>[],
  existingEmails: Set<string> = new Set(),
): RowState[] => {
  const emailCounts = buildEmailCounts(records.map((current) => ({ current })));
  return records.map((record, index) => ({
    id: index,
    original: { ...record },
    current: { ...record },
    errors: validateSingle(record, emailCounts, existingEmails),
  }));
};
