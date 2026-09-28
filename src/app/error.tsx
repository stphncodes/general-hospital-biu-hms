"use client";

import { ErrorState } from "@/components/shared/error-state";

interface RouteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function RootError({ error, retry }: RouteErrorProps) {
  return (
    <main id="main-content" className="px-4">
      <ErrorState digest={error.digest} onRetry={retry} />
    </main>
  );
}
