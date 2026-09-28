"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { getQueryClient } from "@/lib/api/query-client";

/**
 * Provides TanStack Query to the authenticated application only.
 *
 * Mounted in the (dashboard) layout, not the root layout, so public pages do
 * not ship the Query runtime. See docs/architecture/README.md#data-fetching.
 */
export function QueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
