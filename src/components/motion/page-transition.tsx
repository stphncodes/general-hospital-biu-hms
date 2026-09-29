"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

import { DURATION, EASE_OUT } from "./tokens";

/**
 * Entrance for route `template.tsx` files, which remount on navigation.
 * Short and small: it signals "new page" without delaying work.
 */
export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.fast * 1.75, ease: EASE_OUT }}
    >
      {children}
    </m.div>
  );
}
