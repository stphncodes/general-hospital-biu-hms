/**
 * Canonical application paths. Reference these instead of string literals so
 * route changes are a single edit.
 */
export const ROUTES = {
  home: "/",
  /** Staff sign-in is the site's front page. /sign-in redirects here. */
  signIn: "/",
  /** Explains how staff obtain an account (accounts are admin-provisioned). */
  register: "/register",
  forgotPassword: "/forgot-password",
  /** Set a new password after following a recovery link (needs a session). */
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  authConfirm: "/auth/confirm",
  admin: "/admin",
  adminLogin: "/admin/login",
  adminStaff: "/admin/staff",
} as const;

/**
 * Path prefixes that require an authenticated session (enforced in
 * `src/proxy.ts`), and the sign-in page signed-out visitors are sent to.
 * The first matching entry wins, so list more specific prefixes first.
 */
export const PROTECTED_AREAS = [
  { prefix: ROUTES.admin, signIn: ROUTES.adminLogin, except: [ROUTES.adminLogin] },
  { prefix: ROUTES.dashboard, signIn: ROUTES.signIn, except: [] },
] as const;

/** Auth pages that signed-in users should be redirected away from. */
export const AUTH_ONLY_PATHS = [
  ROUTES.signIn,
  ROUTES.register,
  ROUTES.forgotPassword,
] as const;
