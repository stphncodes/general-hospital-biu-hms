"use client";

import { m, useInView } from "motion/react";
import { useRef, type RefObject } from "react";

import { DURATION, EASE_OUT } from "./tokens";

/**
 * A bar or line that grows from zero to `value` (0–1) along one axis when
 * scrolled into view. Transform-only, so it never causes layout shift.
 *
 * Visibility is measured on the PARENT: an element scaled to 0 has a
 * zero-size box pinned to its origin edge, which can sit outside the
 * viewport margin and never trigger.
 */
export function Grow({
  value = 1,
  axis = "x",
  delay = 0,
  className,
}: {
  value?: number;
  axis?: "x" | "y";
  delay?: number;
  className?: string;
}) {
  const parentRef = useRef<Element | null>(null);
  const inView = useInView(parentRef as RefObject<Element>, {
    once: true,
    margin: "0px 0px -10% 0px",
  });
  const prop = axis === "x" ? "scaleX" : "scaleY";

  return (
    <m.div
      ref={(el) => {
        parentRef.current = el?.parentElement ?? null;
      }}
      aria-hidden
      className={className}
      style={{ transformOrigin: axis === "x" ? "left" : "bottom" }}
      initial={{ [prop]: 0 }}
      animate={inView ? { [prop]: value } : undefined}
      transition={{ duration: DURATION.slow, ease: EASE_OUT, delay }}
    />
  );
}
