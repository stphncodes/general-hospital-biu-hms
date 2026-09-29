import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** The HMS symbol: a medical cross carrying a pulse line. Decorative. */
export function HMSMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      focusable="false"
      className={cn("size-8 shrink-0", className)}
    >
      <rect x="10" y="2" width="12" height="28" rx="3.5" className="fill-primary" />
      <rect x="2" y="10" width="28" height="12" rx="3.5" className="fill-primary" />
      <path
        d="M5 16h6l2.25-4.5 3.75 9 2.5-4.5H27"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-primary-foreground"
      />
    </svg>
  );
}

interface HMSLogoProps {
  className?: string;
  /** Hide the wordmark (e.g. collapsed sidebar). The mark alone is decorative. */
  markOnly?: boolean;
  size?: "sm" | "md";
  /** Hide the product descriptor below the `sm` breakpoint (tight headers). */
  compactOnMobile?: boolean;
}

/**
 * HMS logo lockup: symbol + "HMS" wordmark + product descriptor.
 * Not a link by itself; wrap it in `<Link>` where it should navigate.
 */
export function HMSLogo({
  className,
  markOnly = false,
  size = "md",
  compactOnMobile = false,
}: HMSLogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <HMSMark className={size === "sm" ? "size-7" : "size-9"} />
      {markOnly ? (
        <span className="sr-only">{`${siteConfig.mark} — ${siteConfig.product}`}</span>
      ) : (
        <span className="grid leading-none">
          <span
            className={cn(
              "font-bold tracking-tight text-heading",
              size === "sm" ? "text-base" : "text-xl",
            )}
          >
            {siteConfig.mark}
          </span>
          <span
            className={cn(
              "mt-1 text-[0.625rem] font-medium tracking-[0.12em] text-muted-foreground uppercase",
              compactOnMobile && "hidden sm:block",
            )}
          >
            {siteConfig.product}
          </span>
        </span>
      )}
    </span>
  );
}
