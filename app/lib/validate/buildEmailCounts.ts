import { normalizeEmail } from "../normalizeEmail";
import type { Field } from "./types";

export const buildEmailCounts = (
  rows: { current: Record<Field, string> }[],
): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const row of rows) {
    const email = normalizeEmail(row.current.email);
    counts.set(email, (counts.get(email) ?? 0) + 1);
  }
  return counts;
};
