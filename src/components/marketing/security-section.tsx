"use client";

import {
  DatabaseIcon,
  FileLock2Icon,
  GitBranchIcon,
  MonitorIcon,
  ServerIcon,
  UserCheckIcon,
  type LucideIcon,
} from "lucide-react";
import {
  m,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion";

const SAFEGUARDS: ReadonlyArray<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: UserCheckIcon,
    title: "No access unless it is granted",
    body: "A new account can see nothing until an administrator gives it a role.",
  },
  {
    icon: FileLock2Icon,
    title: "Patient details are kept out of logs",
    body: "Personal and clinical fields are removed from system logs, and error messages never show internal details.",
  },
  {
    icon: GitBranchIcon,
    title: "The code is public",
    body: "Anyone can read the source code and check how data is handled.",
  },
];

const LAYERS: ReadonlyArray<{ icon: LucideIcon; title: string; body: string }> = [
  {
    icon: MonitorIcon,
    title: "Screens",
    body: "Staff only see menus and pages their role allows.",
  },
  {
    icon: ServerIcon,
    title: "Server",
    body: "Every page and action checks who is signed in before doing anything.",
  },
  {
    icon: DatabaseIcon,
    title: "Database",
    body: "Row-level security rules decide which records each account can read or change.",
  },
];

function Layer({
  layer,
  index,
  progress,
  reduce,
}: {
  layer: (typeof LAYERS)[number];
  index: number;
  progress: MotionValue<number>;
  reduce: boolean | null;
}) {
  // Layers start close together and separate as the section scrolls by.
  const y = useTransform(progress, [0, 1], [index * -24, index * 24]);
  const Icon = layer.icon;
  return (
    <m.div
      style={reduce ? undefined : { y }}
      className="flex items-center gap-4 rounded-lg border bg-card p-5 shadow-sm"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Icon aria-hidden className="size-5" />
      </span>
      <span>
        <span className="block font-semibold text-heading">
          {index + 1}. {layer.title}
        </span>
        <span className="block text-sm text-muted-foreground">{layer.body}</span>
      </span>
    </m.div>
  );
}

export function SecuritySection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={ref}
      aria-labelledby="security-heading"
      id="security"
      className="flex min-h-svh items-center border-b bg-background py-20"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-10">
          <Reveal className="space-y-4">
            <h2
              id="security-heading"
              className="text-3xl font-bold tracking-tight text-balance sm:text-4xl"
            >
              How patient data is protected
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Access is checked in three separate places, so a mistake in one does not
              expose patient records.
            </p>
          </Reveal>
          <RevealGroup as="ul" className="space-y-6">
            {SAFEGUARDS.map(({ icon: Icon, title, body }) => (
              <RevealItem as="li" key={title} className="flex gap-4">
                <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>
                  <span className="block font-semibold text-heading">{title}</span>
                  <span className="block text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </span>
                </span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal delay={0.1}>
          <ol aria-label="Where access is checked" className="mx-auto max-w-md space-y-4">
            {LAYERS.map((layer, i) => (
              <li key={layer.title}>
                <Layer
                  layer={layer}
                  index={i}
                  progress={scrollYProgress}
                  reduce={reduce}
                />
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
