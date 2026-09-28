import type { Route } from "next";

/**
 * Returns `candidate` only if it is a safe same-origin relative path;
 * otherwise returns `fallback`.
 *
 * Use for every user-controlled redirect target (e.g. `?next=` after sign-in)
 * to prevent open-redirect attacks such as `//evil.example` or
 * `/\evil.example`, which browsers treat as protocol-relative URLs.
 *
 * The result is typed as `Route` because it is guaranteed to be an
 * application-relative path (an unknown path simply renders the 404 page).
 */
export function safeRedirectPath(candidate: unknown, fallback: Route): Route {
  if (typeof candidate !== "string" || candidate.length === 0) return fallback;
  if (!candidate.startsWith("/")) return fallback;
  if (candidate.startsWith("//") || candidate.startsWith("/\\")) return fallback;
  // Reject control characters, which some browsers strip before navigation.
  if (/[\u0000-\u001f\u007f]/.test(candidate)) return fallback;
  return candidate as Route;
}
