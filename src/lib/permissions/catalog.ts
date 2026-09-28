/**
 * Permission catalogue — the single source of truth for permission keys.
 *
 * PROVISIONAL: this list illustrates the naming convention and will be
 * finalised during domain modelling (see docs/security/README.md). Keys are
 * `<resource>.<action>`, lower-case, and describe a capability — never a job
 * title. Code checks permissions, not role names:
 *
 *   ✅ can(principal, "billing.refund", ctx)
 *   ❌ principal.role === "admin"
 *
 * There is intentionally no wildcard ("*") and no superuser flag. An
 * administrator is simply a role granted many explicit permissions, so every
 * privileged action remains visible, reviewable and auditable.
 */
export const PERMISSIONS = [
  "patients.read",
  "patients.create",
  "patients.update",
  "clinical.read",
  "clinical.write",
  "billing.read",
  "billing.create",
  "billing.refund",
  "pharmacy.read",
  "pharmacy.dispense",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

const PERMISSION_SET: ReadonlySet<string> = new Set(PERMISSIONS);

export function isPermission(value: unknown): value is Permission {
  return typeof value === "string" && PERMISSION_SET.has(value);
}
