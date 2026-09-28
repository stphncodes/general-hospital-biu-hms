import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import type { PublicError } from "@/lib/errors";

/**
 * Maps a Server Action error onto a React Hook Form instance:
 *  - field-level messages → the matching fields
 *  - the summary message  → `errors.root.server` (render with <FormRootError>)
 */
export function applyActionError<TFieldValues extends FieldValues, TTransformed>(
  form: UseFormReturn<TFieldValues, unknown, TTransformed>,
  error: PublicError,
): void {
  for (const [path, messages] of Object.entries(error.fieldErrors ?? {})) {
    if (path === "root" || messages.length === 0) continue;
    form.setError(path as Path<TFieldValues>, { type: "server", message: messages[0] });
  }
  form.setError("root.server", { type: error.code, message: error.message });
}
