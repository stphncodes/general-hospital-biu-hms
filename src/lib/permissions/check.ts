import { AuthorizationError } from "@/lib/errors";

import type { Permission } from "./catalog";
import type {
  PermissionGrant,
  PermissionScope,
  Principal,
  ResourceContext,
} from "./model";

function scopeCovers(scope: PermissionScope, context: ResourceContext): boolean {
  if (scope.tenantId !== context.tenantId) return false;
  switch (scope.kind) {
    case "tenant":
      return true;
    case "department":
      return (
        context.departmentId !== undefined && scope.departmentId === context.departmentId
      );
  }
}

function grantAllows(
  grant: PermissionGrant,
  permission: Permission,
  context: ResourceContext,
) {
  return grant.permission === permission && scopeCovers(grant.scope, context);
}

/**
 * Returns true only if the principal holds `permission` in a scope covering
 * `context`. Deny by default: no principal, no grants, or no match → false.
 */
export function can(
  principal: Principal | null | undefined,
  permission: Permission,
  context: ResourceContext,
): boolean {
  if (!principal) return false;
  return principal.grants.some((grant) => grantAllows(grant, permission, context));
}

/**
 * Whether the principal holds `permission` in *any* scope. Use ONLY for
 * presentation decisions such as showing a navigation item. It is not an
 * access check — the page and its data access must still call `authorize`.
 */
export function hasPermissionInAnyScope(
  principal: Principal | null | undefined,
  permission: Permission,
): boolean {
  if (!principal) return false;
  return principal.grants.some((grant) => grant.permission === permission);
}

/** Throws `AuthorizationError` unless `can(...)` is true. For server code. */
export function authorize(
  principal: Principal | null | undefined,
  permission: Permission,
  context: ResourceContext,
): void {
  if (!can(principal, permission, context)) {
    throw new AuthorizationError();
  }
}
