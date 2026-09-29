"use client";

import { ArrowRightIcon } from "lucide-react";
import { m, useReducedMotion, useScroll, useTransform } from "motion/react";
import Link from "next/link";
import { useRef } from "react";

import { Reveal, WordReveal } from "@/components/motion";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/lib/constants";

/** Flat line with two heartbeats, spanning the full viewBox width. */
const HEARTBEAT =
  "M0 60 H380 L400 60 L412 20 L428 100 L440 40 L452 60 H760 L780 60 L792 20 L808 100 L820 40 L832 60 H1200";

/**
 * Closing call to action. A heartbeat line draws
 * across the screen as the visitor scrolls into the section.
 */
export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const pathLength = useTransform(scrollYProgress, [0.1, 1], [0, 1]);

  return (
    <section
      ref={ref}
      aria-labelledby="cta-heading"
      className="relative isolate flex min-h-[70svh] flex-col items-center justify-center overflow-hidden bg-card px-4 py-24 text-center sm:px-6 lg:px-8"
    >
      <svg
        aria-hidden
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-[8%] -z-10 h-24 w-full opacity-40"
      >
        <m.path
          d={HEARTBEAT}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          className="stroke-primary"
          style={{ pathLength: reduce ? 1 : pathLength }}
        />
      </svg>

      <div className="max-w-2xl space-y-6">
        <h2 id="cta-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
          <WordReveal lines={[{ text: "Sign in to HMS" }]} />
        </h2>
        <Reveal delay={0.3}>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Use the email address your administrator registered for you. If you do not
            have an account yet, ask your head of department or the ICT unit at{" "}
            {siteConfig.name}.
          </p>
        </Reveal>
        <Reveal delay={0.45} className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild className="h-11 px-5 text-base font-semibold">
            <Link href={ROUTES.signIn}>
              Staff sign in
              <ArrowRightIcon aria-hidden data-icon="inline-end" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-11 px-5 text-base font-semibold">
            <Link href={ROUTES.register}>How to get an account</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
