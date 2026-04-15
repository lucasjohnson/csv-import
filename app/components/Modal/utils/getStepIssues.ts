import type { DuplicateRow } from "../../../lib/validate/findDuplicateGroups";
import { findDuplicateGroups } from "../../../lib/validate/findDuplicateGroups";
import { hasInvalidField } from "../../../lib/validate/hasInvalidField";
import type { RowState } from "../../../lib/validate/types";

export interface StepIssues {
  count: number;
  affectedIds: Set<number>;
}

export const getStepIssues = (
  step: number,
  rows: RowState[],
  existingRows: RowState[] = [],
  precomputedGroups?: Map<string, DuplicateRow[]> | null,
): StepIssues => {
  if (step === 0) {
    const groups = precomputedGroups ?? findDuplicateGroups(rows, existingRows);
    let count = 0;
    const affectedIds = new Set<number>();
    for (const group of groups.values()) {
      for (const entry of group) {
        if (!entry.isExisting) {
          count++;
          affectedIds.add(entry.row.id);
        }
      }
    }
    return { count, affectedIds };
  }

  if (step === 1) {
    const dupes = rows.filter((row) => row.errors.email === "duplicate");
    return {
      count: dupes.length,
      affectedIds: new Set(dupes.map((r) => r.id)),
    };
  }

  if (step === 2) {
    const invalid = rows.filter((row) => hasInvalidField(row.errors));
    return { count: invalid.length, affectedIds: new Set(invalid.map((r) => r.id)) };
  }

  return { count: 0, affectedIds: new Set() };
};
