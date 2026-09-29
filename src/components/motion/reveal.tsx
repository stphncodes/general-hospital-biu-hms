"use client";

import { m, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { fadeUp, STAGGER } from "./tokens";

type Element = "div" | "ul" | "ol" | "li" | "section";

// `m.div` stands in for the shared prop surface of these block elements.
const ELEMENTS = {
  div: m.div,
  ul: m.ul,
  ol: m.ol,
  li: m.li,
  section: m.section,
} as Record<Element, typeof m.div>;

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: Element;
  /** Seconds before the animation starts. */
  delay?: number;
  /**
   * Animate on mount instead of when scrolled into view. Use for content
   * that is visible on first paint (hero, page headers).
   */
  immediate?: boolean;
  id?: string;
}

const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

function triggerProps(immediate: boolean) {
  return immediate
    ? { initial: "hidden", animate: "visible" }
    : { initial: "hidden", whileInView: "visible", viewport: VIEWPORT };
}

/** Fades and lifts its content into place once. */
export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  immediate = false,
  id,
}: RevealProps) {
  const Component = ELEMENTS[as];
  return (
    <Component
      id={id}
      className={className}
      variants={fadeUp}
      custom={delay}
      {...triggerProps(immediate)}
    >
      {children}
    </Component>
  );
}

/** Container whose `RevealItem` children enter one after another. */
export function RevealGroup({
  children,
  className,
  as = "div",
  delay = 0,
  immediate = false,
  stagger = STAGGER,
}: RevealProps & { stagger?: number }) {
  const Component = ELEMENTS[as];
  const variants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  return (
    <Component className={className} variants={variants} {...triggerProps(immediate)}>
      {children}
    </Component>
  );
}

export function RevealItem({
  children,
  className,
  as = "div",
}: Pick<RevealProps, "children" | "className" | "as">) {
  const Component = ELEMENTS[as];
  return (
    <Component className={className} variants={fadeUp}>
      {children}
    </Component>
  );
}
