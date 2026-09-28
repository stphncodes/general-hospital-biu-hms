/**
 * Redaction for structured log context.
 *
 * This is a safety net, not a licence to log freely. The primary rule is:
 * log identifiers and outcomes (record IDs, error codes, durations), never
 * the content of records. See docs/security/README.md#logging.
 *
 * Any key whose normalised name *contains* one of these fragments is replaced
 * with `[REDACTED]`, at any depth.
 */
const SENSITIVE_KEY_FRAGMENTS = [
  // credentials & session material
  "password",
  "passwd",
  "secret",
  "token",
  "apikey",
  "authorization",
  "cookie",
  "session",
  "credential",
  "privatekey",
  // personal identifiers
  "email",
  "phone",
  "mobile",
  "address",
  "firstname",
  "lastname",
  "middlename",
  "fullname",
  "surname",
  "dateofbirth",
  "birthdate",
  "nationalid",
  "nextofkin",
  // clinical content
  "diagnos",
  "clinical",
  "medical",
  "symptom",
  "allerg",
  "medication",
  "prescription",
  "note",
  "result",
  "history",
] as const;

/**
 * Short tokens are matched against the whole normalised key only, because as
 * substrings they would hit unrelated keys ("nin" in "warning", "otp" in
 * "footprint").
 */
const SENSITIVE_EXACT_KEYS = new Set([
  "jwt",
  "otp",
  "mfa",
  "pin",
  "dob",
  "nin", // Nigerian National Identification Number
  "bvn", // Bank Verification Number
  "ssn",
]);

export const REDACTED = "[REDACTED]";
const MAX_DEPTH = 6;

function normaliseKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z]/g, "");
}

export function isSensitiveKey(key: string): boolean {
  const normalised = normaliseKey(key);
  if (SENSITIVE_EXACT_KEYS.has(normalised)) return true;
  return SENSITIVE_KEY_FRAGMENTS.some((fragment) => normalised.includes(fragment));
}

/** Serialises an Error without its (potentially data-bearing) `details`. */
function serialiseError(error: Error, includeStack: boolean): Record<string, unknown> {
  const withCode = error as Error & { code?: unknown };
  return {
    name: error.name,
    message: error.message,
    ...(typeof withCode.code === "string" ? { code: withCode.code } : {}),
    ...(includeStack && error.stack ? { stack: error.stack } : {}),
    ...(error.cause !== undefined
      ? {
          cause:
            error.cause instanceof Error
              ? serialiseError(error.cause, includeStack)
              : "[non-error cause]",
        }
      : {}),
  };
}

export function redact(
  value: unknown,
  options: { includeStack?: boolean } = {},
  depth = 0,
): unknown {
  const includeStack = options.includeStack ?? false;

  if (depth > MAX_DEPTH) return "[Truncated]";
  if (value === null || typeof value !== "object") return value;
  if (value instanceof Error) return serialiseError(value, includeStack);
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map((item) => redact(item, options, depth + 1));

  const output: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(value)) {
    output[key] = isSensitiveKey(key) ? REDACTED : redact(entry, options, depth + 1);
  }
  return output;
}
