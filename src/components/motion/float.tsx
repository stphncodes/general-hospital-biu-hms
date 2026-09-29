"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

/**
 * Slow, subtle vertical drift for decorative artwork only. Disabled
 * automatically under reduced motion (transform animation).
 */
export function Float({
  children,
  className,
  distance = 8,
  duration = 7,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
  delay?: number;
}) {
  return (
    <m.div
      className={className}
      animate={{ y: [0, -distance, 0] }}
      transition={{ duration, delay, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </m.div>
  );
}
