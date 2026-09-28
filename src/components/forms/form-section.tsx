import type { ReactNode } from "react";

import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  /** Number of field columns on wide screens. Always one column on mobile. */
  columns?: 1 | 2 | 3;
  children: ReactNode;
}

const COLUMN_CLASSES = {
  1: "",
  2: "md:grid-cols-2",
  3: "md:grid-cols-2 xl:grid-cols-3",
} as const;

/**
 * Groups related fields under a `<fieldset>`/`<legend>`. Long clinical forms
 * are built as a sequence of sections so they stay scannable and screen
 * readers announce each group.
 */
export function FormSection({
  title,
  description,
  columns = 1,
  children,
}: FormSectionProps) {
  return (
    <FieldSet>
      <FieldLegend>{title}</FieldLegend>
      {description && <FieldDescription>{description}</FieldDescription>}
      <FieldGroup className={cn("grid gap-4", COLUMN_CLASSES[columns])}>
        {children}
      </FieldGroup>
    </FieldSet>
  );
}
