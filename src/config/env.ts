import { z } from "zod";

/**
 * Public environment variables — safe to read in both server and client code.
 *
 * Next.js only inlines `NEXT_PUBLIC_*` variables that are referenced
 * literally (`process.env.NEXT_PUBLIC_X`), so each one is listed explicitly
 * below rather than read from `process.env` dynamically.
 *
 * Validation is lazy (on first access) so that `next build` does not require
 * credentials, while any runtime use without them fails fast and loudly.
 */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().transform((url) => url.replace(/\/$/, "")),
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

let cached: PublicEnv | undefined;

export function getPublicEnv(): PublicEnv {
  if (cached) return cached;

  const result = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });

  if (!result.success) {
    throw new Error(formatEnvError("public", result.error));
  }

  cached = result.data;
  return cached;
}

/** Builds a readable error that names invalid variables but never echoes values. */
export function formatEnvError(kind: "public" | "server", error: z.ZodError): string {
  const issues = error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  return `Invalid ${kind} environment variables:\n${issues}\nSee .env.example for documentation.`;
}
