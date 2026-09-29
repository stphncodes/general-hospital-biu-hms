"use client";

import {
  AnimatePresence,
  m,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useRef, useState, type ComponentType } from "react";

import { EASE_OUT, Reveal } from "@/components/motion";
import { cn } from "@/lib/utils";

import {
  AdmissionVisual,
  DischargeVisual,
  OrdersVisual,
  RegistrationVisual,
} from "./journey-visuals";

const STEPS: ReadonlyArray<{ title: string; body: string; Visual: ComponentType }> = [
  {
    title: "Registration and triage",
    body: "Records staff register the patient once. Vital signs and triage priority are recorded against that registration.",
    Visual: RegistrationVisual,
  },
  {
    title: "Admission to a ward",
    body: "Ward staff see which beds are free and admit the patient to one. The admission is part of the same record.",
    Visual: AdmissionVisual,
  },
  {
    title: "Tests and medicines",
    body: "Clinicians request laboratory tests, imaging and prescriptions. Each department works its own queue and results return to the record.",
    Visual: OrdersVisual,
  },
  {
    title: "Discharge and billing",
    body: "The discharge summary and the bill are both prepared from what was recorded during the stay.",
    Visual: DischargeVisual,
  },
];

function Heading() {
  return (
    <div className="space-y-4">
      <h2
        id="journey-heading"
        className="text-3xl font-bold tracking-tight text-balance sm:text-4xl"
      >
        How a patient moves through the system
      </h2>
      <p className="text-lg leading-relaxed text-muted-foreground">
        This is the workflow the modules are being built around. Screens shown use sample
        data.
      </p>
    </div>
  );
}

/**
 * Scroll-driven story. On large screens the section is pinned while the
 * visitor scrolls through four steps; a progress rail fills and the visual
 * changes per step. On small screens the steps simply stack.
 */
export function PatientJourney() {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(STEPS.length - 1, Math.max(0, Math.floor(p * STEPS.length))));
  });

  const ActiveVisual = STEPS[active]!.Visual;

  return (
    <section
      aria-labelledby="journey-heading"
      id="journey"
      className="relative border-b bg-background"
    >
      {/* Large screens: pinned scrollytelling */}
      <div
        ref={trackRef}
        className="relative hidden lg:block"
        style={{ height: `${STEPS.length * 90 + 10}svh` }}
      >
        <div className="sticky top-0 flex h-svh items-center">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] items-center gap-16 px-8">
            <div className="space-y-10">
              <Heading />
              <ol className="relative space-y-1 pl-6">
                <span
                  aria-hidden
                  className="absolute top-2 bottom-2 left-0 w-px bg-border"
                />
                <m.span
                  aria-hidden
                  className="absolute top-2 bottom-2 left-0 w-px origin-top bg-primary"
                  style={{ scaleY: scrollYProgress }}
                />
                {STEPS.map((step, i) => (
                  <li
                    key={step.title}
                    aria-current={i === active ? "step" : undefined}
                    className={cn(
                      "rounded-lg px-4 py-3 transition-colors duration-300",
                      i === active ? "bg-primary-soft/60" : "opacity-60",
                    )}
                  >
                    <p className="flex items-baseline gap-3 font-semibold text-heading">
                      <span className="font-mono text-xs text-primary">0{i + 1}</span>
                      {step.title}
                    </p>
                    <m.div
                      initial={false}
                      animate={{
                        height: i === active ? "auto" : 0,
                        opacity: i === active ? 1 : 0,
                      }}
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                      className="overflow-hidden"
                    >
                      <p className="pt-1.5 pl-8 text-sm leading-relaxed text-muted-foreground">
                        {step.body}
                      </p>
                    </m.div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                <m.div
                  key={active}
                  className="relative"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                >
                  <ActiveVisual />
                </m.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Small screens: stacked steps */}
      <div className="mx-auto max-w-2xl space-y-16 px-4 py-24 sm:px-6 lg:hidden">
        <Heading />
        <ol className="space-y-16">
          {STEPS.map(({ title, body, Visual }, i) => (
            <li key={title}>
              <Reveal className="space-y-5">
                <div className="space-y-2">
                  <p className="flex items-baseline gap-3 text-lg font-semibold text-heading">
                    <span className="font-mono text-xs text-primary">0{i + 1}</span>
                    {title}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
                <Visual />
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
