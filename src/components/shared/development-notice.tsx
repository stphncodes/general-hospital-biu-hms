import { TriangleAlertIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Persistent notice that this is development software. Keep it visible until
 * the project has undergone the clinical-safety, security and regulatory
 * review required for real-world use.
 */
export function DevelopmentNotice({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        "flex items-center gap-2 bg-warning px-4 py-1.5 text-xs font-medium text-warning-foreground",
        className,
      )}
    >
      <TriangleAlertIcon className="size-3.5 shrink-0" aria-hidden />
      <span>
        Development software — not approved for clinical use. Do not enter real patient
        data.
      </span>
    </div>
  );
}
