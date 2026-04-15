import { normalizeEmail } from "../../../lib/normalizeEmail";
import type { Field } from "../../../lib/validate/types";

export const buildRowKey = (record: Record<Field, string>): string =>
  `${record.name.trim().toLowerCase()}|${normalizeEmail(record.email)}|${record.phone.trim().toLowerCase()}|${record.netWorth.trim().toLowerCase()}`;
