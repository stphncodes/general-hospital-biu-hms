import type { Permission } from "./catalog";

/**
 * Authorization model: User → Role(s) → Permission(s) → Scope.
 *
 * Roles are an administrative grouping that exists in the database; at
 * runtime they are flattened into `grants`, so application code never needs
 * to know which role a permission came from.
 *
 * PROVISIONAL: scope kinds will be finalised during domain modelling. The
 * shape below assumes a tenant (a hospital/facility, enabling future
 * multi-hospital deployments) optionally narrowed to a department.
 */
export type PermissionScope =
  | { readonly kind: "tenant"; readonly tenantId: string }
  | {
      readonly kind: "department";
      readonly tenantId: string;
      readonly departmentId: string;
    };

export interface PermissionGrant {
  readonly permission: Permission;
  readonly scope: PermissionScope;
}

/** The authenticated actor, as seen by authorization checks. */
export interface Principal {
  readonly userId: string;
  readonly grants: readonly PermissionGrant[];
}

/** Where the target resource lives. Every permission check needs one. */
export interface ResourceContext {
  readonly tenantId: string;
  readonly departmentId?: string;
}
