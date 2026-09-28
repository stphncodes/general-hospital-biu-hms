"use client";

import { ErrorState } from "@/components/shared/error-state";

interface RouteErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function DashboardError({ error, retry }: RouteErrorProps) {
  return <ErrorState digest={error.digest} onRetry={retry} />;
}
