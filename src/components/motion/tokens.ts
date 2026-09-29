import type { Variants } from "motion/react";

/**
 * Motion tokens: the single source of timing for HMS animation.
 *
 * Clinical, calm motion: short distances, ease-out curves, no bounce.
 * Entrances run slower than exits; nothing loops except purely decorative
 * artwork. `MotionProvider` disables transforms for users who prefer
 * reduced motion, leaving the final (readable) state.
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  fast: 0.2,
  base: 0.5,
  slow: 0.8,
} as const;

/** Vertical offset for entrance animations, in px. */
export const RISE = 16;

export const STAGGER = 0.08;

/**
 * Fade + rise. Pass a delay (seconds) through Motion's `custom` prop. The
 * delay is omitted when unset so a parent's `staggerChildren` still applies.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: RISE },
  visible: (delay?: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT, ...(delay ? { delay } : {}) },
  }),
};
