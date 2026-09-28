import { QueryClient, isServer } from "@tanstack/react-query";

/**
 * TanStack Query client factory.
 *
 * On the server a fresh client is created per request so cached data can
 * never leak between users. In the browser a single client is reused.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Avoid an immediate client refetch of data that was just rendered.
        staleTime: 60_000,
        // Clinical data must not silently go stale in an idle tab.
        refetchOnWindowFocus: true,
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
