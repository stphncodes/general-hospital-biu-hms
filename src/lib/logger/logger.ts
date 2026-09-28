import "server-only";

import { getServerEnv } from "@/config/env.server";

import { redact } from "./redact";

/**
 * Minimal structured server logger.
 *
 * - Emits one JSON object per line in production (machine-parsable by any
 *   log shipper) and a readable line in development.
 * - Every context object passes through `redact()`.
 * - `server-only` prevents it from being bundled into the browser.
 *
 * Usage:
 *   logger.info("auth.sign_in.succeeded", { userId });
 *   logger.error("patients.create.failed", { error });
 *
 * Event names are dot-separated `domain.action.outcome` so they can be
 * searched and aggregated. Do not interpolate data into the event name.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogContext = Record<string, unknown>;

const LEVEL_WEIGHT: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

function resolveMinLevel(): LogLevel {
  const env = getServerEnv();
  return env.LOG_LEVEL ?? (env.NODE_ENV === "development" ? "debug" : "info");
}

function write(level: LogLevel, event: string, context?: LogContext): void {
  const env = getServerEnv();
  if (LEVEL_WEIGHT[level] < LEVEL_WEIGHT[resolveMinLevel()]) return;

  const isDev = env.NODE_ENV === "development";
  const safeContext = context ? redact(context, { includeStack: isDev }) : undefined;
  const timestamp = new Date().toISOString();

  const line = isDev
    ? `${timestamp} ${level.toUpperCase().padEnd(5)} ${event}${
        safeContext ? ` ${JSON.stringify(safeContext)}` : ""
      }`
    : JSON.stringify({ timestamp, level, event, ...(safeContext as object | undefined) });

  /* eslint-disable no-console -- this module is the single sanctioned console sink */
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
  /* eslint-enable no-console */
}

export const logger = {
  debug: (event: string, context?: LogContext) => write("debug", event, context),
  info: (event: string, context?: LogContext) => write("info", event, context),
  warn: (event: string, context?: LogContext) => write("warn", event, context),
  error: (event: string, context?: LogContext) => write("error", event, context),
};
