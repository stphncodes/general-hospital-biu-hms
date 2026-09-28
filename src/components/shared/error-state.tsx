"use client";

import { CircleAlertIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  /** Next.js error digest — lets support correlate with server logs without exposing detail. */
  digest?: string;
  onRetry?: () => void;
}

/**
 * Generic error UI for route error boundaries. Never renders `error.message`:
 * in production it is already replaced by Next.js, and in development it may
 * contain internal detail we do not want users to learn to rely on.
 */
export function ErrorState({
  title = "Something went wrong",
  digest,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-3 py-16 text-center"
    >
      <CircleAlertIcon className="size-8 text-destructive" aria-hidden />
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">
        The page could not be displayed. Please try again. If the problem continues,
        contact support{digest ? " and quote the reference below" : ""}.
      </p>
      {digest && (
        <p className="font-mono text-xs text-muted-foreground">Reference: {digest}</p>
      )}
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RotateCcwIcon aria-hidden /> Try again
        </Button>
      )}
    </div>
  );
}
