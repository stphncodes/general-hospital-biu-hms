import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div
      className="mx-auto flex max-w-5xl flex-col gap-6"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading…</span>
      <div className="space-y-2">
        <Skeleton className="h-8 w-72" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-36 w-full" />
    </div>
  );
}
