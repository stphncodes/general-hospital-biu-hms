import { format, isValid } from "date-fns";

/**
 * Display formatting for dates and times.
 *
 * Storage rule: persist instants as `timestamptz` (UTC) in PostgreSQL and
 * calendar dates (e.g. date of birth) as `date`. Formatting happens only at
 * the presentation edge. See docs/architecture/README.md#dates-and-times.
 *
 * Unambiguous day-month-year formats are used because numeric `MM/DD` vs
 * `DD/MM` confusion is a documented source of clinical error.
 */
export const DATE_FORMAT = "d MMM yyyy";
export const DATE_TIME_FORMAT = "d MMM yyyy, HH:mm";

type DateInput = Date | string | number;

function toDate(value: DateInput): Date | null {
  const date = value instanceof Date ? value : new Date(value);
  return isValid(date) ? date : null;
}

/** e.g. "5 Mar 2026". Returns `fallback` for missing or invalid input. */
export function formatDate(value: DateInput | null | undefined, fallback = "—"): string {
  if (value == null) return fallback;
  const date = toDate(value);
  return date ? format(date, DATE_FORMAT) : fallback;
}

/** e.g. "5 Mar 2026, 14:30" (24-hour clock). */
export function formatDateTime(
  value: DateInput | null | undefined,
  fallback = "—",
): string {
  if (value == null) return fallback;
  const date = toDate(value);
  return date ? format(date, DATE_TIME_FORMAT) : fallback;
}
