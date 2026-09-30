import { NextResponse, type NextRequest } from "next/server";

import { AUTH_ONLY_PATHS, PROTECTED_AREAS, ROUTES } from "@/lib/constants";
import { updateSession } from "@/lib/supabase/proxy";

const matches = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

/** The protected area a path belongs to, if any (first match wins). */
function protectedAreaFor(pathname: string) {
  return PROTECTED_AREAS.find(
    (area) =>
      matches(pathname, area.prefix) &&
      !(area.except as readonly string[]).some((path) => matches(pathname, path)),
  );
}

/**
 * Next.js Proxy (formerly Middleware). Runs before every matched request to:
 *
 *  1. Refresh the Supabase session cookie.
 *  2. Redirect signed-out users away from protected areas (fast path / UX).
 *
 * This is NOT the security boundary. Pages, Server Actions, Route Handlers
 * and — ultimately — PostgreSQL Row Level Security each enforce access
 * themselves. See docs/security/README.md#defence-in-depth.
 */
export async function proxy(request: NextRequest) {
  const { response, userId } = await updateSession(request);
  const { pathname, search } = request.nextUrl;

  const area = protectedAreaFor(pathname);

  if (area && !userId) {
    const url = request.nextUrl.clone();
    url.pathname = area.signIn;
    url.search = "";
    url.searchParams.set("next", `${pathname}${search}`);
    return redirectPreservingCookies(url, response);
  }

  if (userId && (AUTH_ONLY_PATHS as readonly string[]).includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.dashboard;
    url.search = "";
    return redirectPreservingCookies(url, response);
  }

  return response;
}

/** Redirects while keeping any auth cookies refreshed by `updateSession`. */
function redirectPreservingCookies(url: URL, sessionResponse: NextResponse) {
  const redirect = NextResponse.redirect(url);
  for (const cookie of sessionResponse.cookies.getAll()) {
    redirect.cookies.set(cookie);
  }
  return redirect;
}

export const config = {
  matcher: [
    // Everything except static assets, image optimisation and the health
    // check (which must not depend on Supabase availability).
    "/((?!_next/static|_next/image|favicon.ico|api/health|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
