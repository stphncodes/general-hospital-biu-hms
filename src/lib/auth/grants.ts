import { z } from "zod";

import { isPermission, type PermissionGrant } from "@/lib/permissions";

/** One row of `public.current_user_grants()`. */
const grantRowSchema = z.object({
  permission: z.string(),
  tenant_id: z.uuid(),
  department_id: z.uuid().nullable(),
});

/**
 * Converts `current_user_grants()` rows into grants.
 *
 * Deny by default: malformed rows and permission keys the application does
 * not know (e.g. a key added to the database before the code) are dropped,
 * never widened into access.
 */
export function toGrants(rows: unknown): PermissionGrant[] {
  if (!Array.isArray(rows)) return [];

  const grants: PermissionGrant[] = [];
  for (const row of rows) {
    const parsed = grantRowSchema.safeParse(row);
    if (!parsed.success || !isPermission(parsed.data.permission)) continue;

    const { permission, tenant_id: tenantId, department_id: departmentId } = parsed.data;
    grants.push({
      permission,
      scope: departmentId
        ? { kind: "department", tenantId, departmentId }
        : { kind: "tenant", tenantId },
    });
  }
  return grants;
}
