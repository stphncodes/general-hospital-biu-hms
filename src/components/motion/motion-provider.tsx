"use client";

import { domAnimation, LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { DURATION, EASE_OUT } from "./tokens";

/**
 * App-wide Motion configuration.
 *
 * - `LazyMotion` + `domAnimation` ships only the animation features we use;
 *   `strict` forces the lightweight `m.*` components instead of `motion.*`.
 * - `reducedMotion="user"` turns transform/layout animation off when the OS
 *   asks for reduced motion (opacity still fades, so nothing pops).
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: DURATION.base, ease: EASE_OUT }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
