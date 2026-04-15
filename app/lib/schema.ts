import { z } from "zod";

export const rowSchema = z.object({
  name: z
    .string()
    .regex(/^[\p{L}\s]+$/u, "Name must contain only letters and spaces."),
  email: z.email("Must be a valid email address (e.g., name@company.com)."),
  phone: z
    .string()
    .regex(/^\+\d{8,15}$/, "Must be a valid phone number (e.g., +12345678)."),
  netWorth: z
    .string()
    .regex(
      /^-?\d+(,\d{1,3})?$/,
      "Must be a valid European number with optional up to 3 decimal places (e.g., 1000 or 1000,500).",
    ),
});

export const getFieldErrorMessage = (
  field: string,
  errorType: string,
): string | undefined => {
  if (errorType === "duplicate" && field === "email") {
    return "Email must be unique.";
  }

  const fieldSchema = rowSchema.shape[field as keyof typeof rowSchema.shape];

  if (!fieldSchema) return undefined;

  const result = fieldSchema.safeParse("");

  if (!result.success) {
    return result.error.issues[0]?.message;
  }

  return undefined;
};
