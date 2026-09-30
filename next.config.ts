import type { NextConfig } from "next";

/**
 * Baseline security headers applied to every response.
 *
 * A Content-Security-Policy is intentionally not set here yet: a strict,
 * nonce-based CSP must be generated per request in `src/proxy.ts` and is
 * tracked as a follow-up in docs/security/README.md.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    key: "Strict-Transport-Security",
    // `preload` is deliberately omitted: submitting a domain to the HSTS
    // preload list is hard to reverse and is a deployment-owner decision.
    value: "max-age=63072000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  typedRoutes: true,
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async redirects() {
    // Staff sign-in moved to "/"; keep old links and bookmarks working.
    // Query strings (e.g. ?next=, ?error=) are carried over automatically.
    return [{ source: "/sign-in", destination: "/", permanent: false }];
  },
};

export default nextConfig;
