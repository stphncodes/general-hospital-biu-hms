import "server-only";

import { z } from "zod";

import { formatEnvError } from "./env";

/**
 * Server-only environment variables. Importing this module from a Client
 * Component is a build error (enforced by `server-only`).
 */
const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  SUPABASE_SECRET_KEY: z.string().min(1).optional(),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (cached) return cached;

  const result = serverEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    // Treat empty strings from an unfilled .env template as "not set".
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY || undefined,
    LOG_LEVEL: process.env.LOG_LEVEL || undefined,
  });

  if (!result.success) {
    throw new Error(formatEnvError("server", result.error));
  }

  cached = result.data;
  return cached;
}
