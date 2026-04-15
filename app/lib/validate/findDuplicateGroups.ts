import { buildRowKey } from "../../components/Modal/utils/buildRowKey";
import type { RowState } from "./types";

export interface DuplicateRow {
  row: RowState;
  isExisting: boolean;
}

export const findDuplicateGroups = (
  rows: RowState[],
  existingRows: RowState[] = [],
): Map<string, DuplicateRow[]> => {
  const groups = new Map<string, DuplicateRow[]>();
  const csvCounts = new Map<string, number>();
  const hasExisting = new Set<string>();

  for (const row of existingRows) {
    const key = buildRowKey(row.current);
    const group = groups.get(key);
    if (group) {
      group.push({ row, isExisting: true });
    } else {
      groups.set(key, [{ row, isExisting: true }]);
    }
    hasExisting.add(key);
  }

  for (const row of rows) {
    const key = buildRowKey(row.current);
    const group = groups.get(key);
    if (group) {
      group.push({ row, isExisting: false });
    } else {
      groups.set(key, [{ row, isExisting: false }]);
    }
    csvCounts.set(key, (csvCounts.get(key) ?? 0) + 1);
  }

  const duplicates = new Map<string, DuplicateRow[]>();
  for (const [key, group] of groups) {
    const count = csvCounts.get(key) ?? 0;
    if (count > 1 || (count >= 1 && hasExisting.has(key))) {
      duplicates.set(key, group);
    }
  }
  return duplicates;
};
