"use client";

import { CheckIcon, LoaderIcon } from "lucide-react";
import { m } from "motion/react";
import type { ReactNode } from "react";

import { EASE_OUT } from "@/components/motion";
import { cn } from "@/lib/utils";

/*
 * Small animated product vignettes for the patient-journey section.
 * All content is SAMPLE data and hidden from assistive technology.
 */

const rise = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, ease: EASE_OUT, delay: 0.1 + i * 0.08 },
});

function Frame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      aria-hidden
      className="w-full overflow-hidden rounded-lg border bg-card shadow-sm"
    >
      <div className="flex items-center justify-between border-b bg-muted/50 px-5 py-3">
        <span className="text-sm font-semibold text-heading">{title}</span>
        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[10px] font-semibold tracking-wide text-primary-soft-foreground uppercase">
          Sample data
        </span>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}

export function RegistrationVisual() {
  const vitals = [
    { label: "Blood pressure", value: "118/76", unit: "mmHg" },
    { label: "Heart rate", value: "82", unit: "bpm" },
    { label: "Temperature", value: "36.9", unit: "°C" },
    { label: "SpO₂", value: "98", unit: "%" },
  ];
  return (
    <Frame title="Patient registration">
      <m.div {...rise(0)} className="flex items-center gap-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          AM
        </span>
        <div className="flex-1">
          <p className="font-semibold text-heading">PT-0142</p>
          <p className="text-sm text-muted-foreground">34 years · Female · General OPD</p>
        </div>
        <span className="rounded-md border border-warning/40 bg-warning/10 px-2 py-1 text-xs font-medium text-foreground">
          Triage: Priority 3
        </span>
      </m.div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {vitals.map((v, i) => (
          <m.div
            key={v.label}
            {...rise(i + 1)}
            className="rounded-lg border bg-background p-3"
          >
            <p className="text-xs text-muted-foreground">{v.label}</p>
            <p className="mt-1 text-xl font-semibold text-heading tabular-nums">
              {v.value}{" "}
              <span className="text-xs font-normal text-muted-foreground">{v.unit}</span>
            </p>
          </m.div>
        ))}
      </div>
      <m.svg {...rise(5)} viewBox="0 0 300 40" className="mt-5 h-10 w-full">
        <path
          d="M0 20 H90 L102 6 L116 34 L126 14 L134 20 H300"
          pathLength={1}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-ecg stroke-primary"
        />
      </m.svg>
    </Frame>
  );
}

export function AdmissionVisual() {
  // 16 beds; index 9 is the one being assigned.
  const occupied = new Set([0, 1, 3, 4, 5, 7, 8, 10, 12, 13, 15]);
  return (
    <Frame title="Ward B · bed management">
      <div className="grid grid-cols-4 gap-3">
        {Array.from({ length: 16 }, (_, i) => {
          const assigning = i === 9;
          return (
            <m.div
              key={i}
              {...rise(i * 0.4)}
              className={cn(
                "relative flex h-14 items-end rounded-md border p-2 text-[10px] font-medium",
                occupied.has(i)
                  ? "border-primary/30 bg-primary/15 text-heading"
                  : "border-dashed text-muted-foreground",
                assigning && "border-primary",
              )}
            >
              {assigning && (
                <m.span
                  className="absolute inset-0 rounded-md bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.35, 0, 0.35, 1] }}
                  transition={{ duration: 2, delay: 0.9, ease: "easeInOut" }}
                />
              )}
              <span className={cn("relative", assigning && "text-primary-foreground")}>
                B{String(i + 1).padStart(2, "0")}
              </span>
            </m.div>
          );
        })}
      </div>
      <m.div
        {...rise(8)}
        className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground"
      >
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-primary/30" /> Occupied
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm border border-dashed" /> Available
        </span>
        <span className="flex items-center gap-1.5 font-medium text-heading">
          <span className="size-2.5 rounded-sm bg-primary" /> PT-0142 assigned to B10
        </span>
      </m.div>
    </Frame>
  );
}

export function OrdersVisual() {
  const orders = [
    { name: "Full blood count", dept: "Laboratory", state: "done", label: "Resulted" },
    { name: "Malaria RDT", dept: "Laboratory", state: "active", label: "Processing" },
    { name: "Amoxicillin 500 mg", dept: "Pharmacy", state: "done", label: "Dispensed" },
    { name: "Chest X-ray", dept: "Radiology", state: "queued", label: "Scheduled" },
  ] as const;
  return (
    <Frame title="Orders & results">
      <ul className="space-y-3">
        {orders.map((o, i) => (
          <m.li
            key={o.name}
            {...rise(i)}
            className="flex items-center gap-4 rounded-lg border bg-background p-3.5"
          >
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full",
                o.state === "done" && "bg-primary text-primary-foreground",
                o.state === "active" && "bg-primary-soft text-primary-soft-foreground",
                o.state === "queued" && "border text-muted-foreground",
              )}
            >
              {o.state === "done" && <CheckIcon className="size-4" />}
              {o.state === "active" && (
                <LoaderIcon className="size-4 motion-safe:animate-spin" />
              )}
              {o.state === "queued" && (
                <span className="size-1.5 rounded-full bg-current" />
              )}
            </span>
            <span className="flex-1">
              <span className="block text-sm font-medium text-heading">{o.name}</span>
              <span className="block text-xs text-muted-foreground">{o.dept}</span>
            </span>
            <span className="text-xs font-medium text-foreground">{o.label}</span>
          </m.li>
        ))}
      </ul>
    </Frame>
  );
}

export function DischargeVisual() {
  const lines = [
    ["Consultation", "₦5,000"],
    ["Laboratory tests", "₦12,500"],
    ["Pharmacy", "₦8,000"],
    ["Ward stay (2 nights)", "₦23,000"],
  ] as const;
  const checks = [
    "Discharge summary signed",
    "Medication reconciled",
    "Follow-up booked",
  ];
  return (
    <Frame title="Discharge & billing">
      <div className="grid gap-5 sm:grid-cols-2">
        <ul className="space-y-2.5">
          {checks.map((c, i) => (
            <m.li key={c} {...rise(i)} className="flex items-center gap-2.5 text-sm">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <CheckIcon className="size-3" />
              </span>
              {c}
            </m.li>
          ))}
        </ul>
        <m.div {...rise(3)} className="rounded-lg border bg-background p-4">
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Invoice INV-2291
          </p>
          <dl className="mt-3 space-y-1.5 text-sm">
            {lines.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="tabular-nums">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-3 border-t pt-2 font-semibold text-heading">
              <dt>Total</dt>
              <dd className="tabular-nums">₦48,500</dd>
            </div>
          </dl>
        </m.div>
      </div>
    </Frame>
  );
}
