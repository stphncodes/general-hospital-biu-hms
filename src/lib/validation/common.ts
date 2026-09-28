import { z } from "zod";

/**
 * Reusable primitives. Feature schemas live in `features/<name>/schemas` and
 * compose these; do not put feature-specific schemas here.
 */

export const idSchema = z.uuid();

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email("Enter a valid email address."));

/** Trimmed string that must contain at least one non-whitespace character. */
export function requiredText(label: string, max = 255) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be at most ${max} characters.`);
}
