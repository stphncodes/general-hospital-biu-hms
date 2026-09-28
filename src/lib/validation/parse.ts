import type { z } from "zod";

import { ValidationError, type FieldErrors } from "@/lib/errors";

/** Converts Zod issues into `{ "path.to.field": ["message"] }`. */
export function toFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.join(".") : "root";
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return fieldErrors;
}

/**
 * Validates untrusted input on the server. Throws `ValidationError` with
 * field-level messages on failure.
 *
 * Every Server Action and Route Handler must validate its input with this
 * (or `safeParse`) — client-side validation is a UX convenience only.
 */
export function parseInput<TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): z.output<TSchema> {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(toFieldErrors(result.error));
  }
  return result.data;
}
