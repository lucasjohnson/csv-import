import type { RowState } from "../validate/types";
import { parseNetWorthToNumber } from "../formatters/parseNetWorthToNumber";
import type { SortDirection } from "./types";

export const sortByNetWorth = (
  rows: RowState[],
  direction: SortDirection,
): RowState[] => {
  if (!direction) return rows;

  return [...rows].sort((rowA, rowB) => {
    const valueA = parseNetWorthToNumber(rowA.current.netWorth);
    const valueB = parseNetWorthToNumber(rowB.current.netWorth);
    return direction === "desc" ? valueB - valueA : valueA - valueB;
  });
};
