/**
 * Canonical application paths. Reference these instead of string literals so
 * route changes are a single edit.
 */
export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  /** Explains how staff obtain an account (accounts are admin-provisioned). */
  register: "/register",
  forgotPassword: "/forgot-password",
  /** Set a new password after following a recovery link (needs a session). */
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  authConfirm: "/auth/confirm",
} as const;

/** Path prefixes that require an authenticated session (enforced in `src/proxy.ts`). */
export const PROTECTED_PATH_PREFIXES = ["/dashboard"] as const;

/** Auth pages that signed-in users should be redirected away from. */
export const AUTH_ONLY_PATHS = [
  ROUTES.signIn,
  ROUTES.register,
  ROUTES.forgotPassword,
] as const;
