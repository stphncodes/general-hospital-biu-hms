/**
 * Canonical application paths. Reference these instead of string literals so
 * route changes are a single edit.
 */
export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  dashboard: "/dashboard",
  authConfirm: "/auth/confirm",
} as const;

/** Path prefixes that require an authenticated session (enforced in `src/proxy.ts`). */
export const PROTECTED_PATH_PREFIXES = ["/dashboard"] as const;

/** Auth pages that signed-in users should be redirected away from. */
export const AUTH_ONLY_PATHS = [ROUTES.signIn] as const;
