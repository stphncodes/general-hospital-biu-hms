"use client";

import { m, type Variants } from "motion/react";

import { DURATION, EASE_OUT } from "./tokens";

export interface WordRevealLine {
  text: string;
  className?: string;
}

const container = (delay: number): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: delay } },
});

const word: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: DURATION.slow, ease: EASE_OUT } },
};

/**
 * Headline whose words rise out of a mask one after another. Screen readers
 * get the plain sentence; the animated copy is hidden from them. Under
 * reduced motion the words are simply present.
 */
export function WordReveal({
  lines,
  delay = 0,
  immediate = false,
}: {
  lines: readonly WordRevealLine[];
  delay?: number;
  immediate?: boolean;
}) {
  const trigger = immediate
    ? { animate: "visible" }
    : { whileInView: "visible", viewport: { once: true, margin: "0px 0px -15% 0px" } };

  return (
    <>
      <span className="sr-only">{lines.map((line) => line.text).join(" ")}</span>
      <m.span
        aria-hidden
        className="block"
        initial="hidden"
        variants={container(delay)}
        {...trigger}
      >
        {lines.map((line) => (
          <span key={line.text} className={`block ${line.className ?? ""}`}>
            {line.text.split(" ").map((w, i) => (
              <span key={`${w}-${i}`}>
                <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                  <m.span className="inline-block" variants={word}>
                    {w}
                  </m.span>
                </span>{" "}
              </span>
            ))}
          </span>
        ))}
      </m.span>
    </>
  );
}
