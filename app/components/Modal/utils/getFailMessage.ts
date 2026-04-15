import type { RowState } from "../../../lib/validate/types";
import { getStepIssues } from "./getStepIssues";

export const getFailMessage = (
  activeStep: number,
  rows: RowState[],
  visibleIds?: Set<number>,
  existingRows: RowState[] = [],
): string => {
  const { count } = getStepIssues(activeStep, rows, existingRows);

  if (activeStep === 0) return `${count} duplicate rows found`;
  if (activeStep === 1) {
    const visible = visibleIds ? rows.filter((r) => visibleIds.has(r.id)) : rows;
    const dupeCount = visible.filter((r) => r.errors.email === "duplicate").length;
    const invalidCount = visible.filter((r) => r.errors.email === "invalid").length;
    const parts: string[] = [];
    if (dupeCount > 0) parts.push(`${dupeCount} duplicate`);
    if (invalidCount > 0) parts.push(`${invalidCount} invalid`);
    return `${parts.join(" and ")} email${dupeCount + invalidCount === 1 ? "" : "s"} found`;
  }
  if (activeStep === 2) return `${count} rows with formatting errors`;

  return "";
};
