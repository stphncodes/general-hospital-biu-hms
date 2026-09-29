"use client";

import { useId, type ComponentProps, type ComponentType, type ReactNode } from "react";
import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type InputProps = Pick<
  ComponentProps<typeof Input>,
  "type" | "autoComplete" | "placeholder" | "disabled" | "inputMode" | "autoFocus"
>;

export interface FormTextFieldProps<
  TFieldValues extends FieldValues,
  TTransformed,
> extends InputProps {
  control: Control<TFieldValues, unknown, TTransformed>;
  /** Only paths whose value is a string are accepted. */
  name: FieldPathByValue<TFieldValues, string | undefined>;
  label: string;
  description?: string;
  required?: boolean;
  /** Decorative leading icon (e.g. a Lucide icon). */
  icon?: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  /** Interactive control rendered inside the input's trailing edge. */
  endAdornment?: ReactNode;
  /** `lg` is the roomier size used on public/auth pages. */
  size?: "default" | "lg";
}

/**
 * Accessible text input wired to React Hook Form.
 *
 * Handles label association, required marker, description, error message
 * and the `aria-invalid` / `aria-describedby` wiring so individual forms do
 * not repeat it. Build other field types (select, date, checkbox) on the same
 * pattern in this folder.
 */
export function FormTextField<TFieldValues extends FieldValues, TTransformed>({
  control,
  name,
  label,
  description,
  required,
  icon: Icon,
  endAdornment,
  size = "default",
  ...inputProps
}: FormTextFieldProps<TFieldValues, TTransformed>) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const describedBy =
          [description ? descriptionId : null, fieldState.invalid ? errorId : null]
            .filter(Boolean)
            .join(" ") || undefined;

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id}>
              {label}
              {required && (
                <span aria-hidden className="text-destructive">
                  *
                </span>
              )}
            </FieldLabel>
            <div className="relative">
              {Icon && (
                <Icon
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground",
                    fieldState.invalid && "text-destructive",
                  )}
                />
              )}
              <Input
                {...inputProps}
                id={id}
                name={field.name}
                ref={field.ref}
                value={(field.value as string | undefined) ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={inputProps.disabled ?? field.disabled}
                required={required}
                aria-invalid={fieldState.invalid}
                aria-describedby={describedBy}
                className={cn(
                  size === "lg" && "h-10 bg-card px-3 dark:bg-input/30",
                  Icon && "pl-9",
                  endAdornment && "pr-10",
                )}
              />
              {endAdornment && (
                <div className="absolute inset-y-0 right-1 flex items-center">
                  {endAdornment}
                </div>
              )}
            </div>
            {description && (
              <FieldDescription id={descriptionId}>{description}</FieldDescription>
            )}
            {fieldState.invalid && (
              <FieldError id={errorId} errors={[fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
}
