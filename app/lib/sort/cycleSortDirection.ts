import type { SortDirection } from "./types";

export const cycleSortDirection = (current: SortDirection): SortDirection => {
  if (current === null) return "desc";
  if (current === "desc") return "asc";

  return null;
};
