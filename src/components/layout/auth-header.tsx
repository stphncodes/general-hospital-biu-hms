import type { ReactNode } from "react";

/** Page heading for auth screens: the page's single `<h1>` plus supporting text. */
export function AuthHeader({
  title,
  description,
}: {
  title: string;
  description?: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
      {description && (
        <p className="text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
