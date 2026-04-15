export type Field = "name" | "email" | "phone" | "netWorth";
export type ErrorType = "invalid" | "duplicate";

export interface RowState {
  id: number;
  original: Record<Field, string>;
  current: Record<Field, string>;
  errors: Partial<Record<Field, ErrorType>>;
}
