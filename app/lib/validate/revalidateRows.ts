import type { RowState } from "./types";
import { buildEmailCounts } from "./buildEmailCounts";
import { validateSingle } from "./validateSingle";

export const revalidateRows = (
  rows: RowState[],
  existingEmails: Set<string> = new Set(),
): RowState[] => {
  const emailCounts = buildEmailCounts(rows);
  return rows.map((row) => ({
    ...row,
    errors: validateSingle(row.current, emailCounts, existingEmails),
  }));
};
