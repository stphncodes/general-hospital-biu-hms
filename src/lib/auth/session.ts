import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { ROUTES } from "@/lib/constants";
import { logger } from "@/lib/logger";
import type { PermissionGrant, Principal } from "@/lib/permissions";
import { createClient } from "@/lib/supabase/server";

import { toGrants } from "./grants";

export interface AuthenticatedUser {
  readonly id: string;
  readonly email: string | null;
}

/**
 * Returns the verified current user, or `null`.
 *
 * Uses `getClaims()`, which validates the JWT signature. Never use
 * `getSession()` for server-side authorization: its contents come from a
 * cookie and are not verified.
 *
 * Wrapped in React `cache` so multiple calls within one request share a
 * single verification.
 */
export const getCurrentUser = cache(async (): Promise<AuthenticatedUser | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data) return null;

  const { sub, email } = data.claims;
  return { id: sub, email: typeof email === "string" ? email : null };
});

/**
 * For Server Components and layouts: redirects to sign-in when there is no
 * session. Returning normally guarantees an authenticated user.
 *
 * Layouts are not re-rendered on every navigation, so every page and every
 * data-access function must perform its own check as well — never rely on a
 * parent layout for protection.
 */
export async function requireUser(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user) redirect(ROUTES.signIn);
  return user;
}

/**
 * Loads the permission grants for a user.
 *
 * Reads `public.current_user_grants()`, which returns only the caller's own
 * grants (deactivated staff have none). Deny by default: any failure, for
 * example the access-control migration not being applied yet, yields no
 * grants. See docs/security/README.md#authorization.
 */
async function loadGrants(userId: string): Promise<readonly PermissionGrant[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("current_user_grants");
  if (error) {
    logger.warn("auth.grants.load_failed", { userId, code: error.code });
    return [];
  }
  return toGrants(data);
}

/** The current user as an authorization principal, or `null` if signed out. */
export const getPrincipal = cache(async (): Promise<Principal | null> => {
  const user = await getCurrentUser();
  if (!user) return null;
  return { userId: user.id, grants: await loadGrants(user.id) };
});
