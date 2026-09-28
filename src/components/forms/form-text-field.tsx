"use client";

import { useId, type ComponentProps } from "react";
import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type InputProps = Pick<
  ComponentProps<typeof Input>,
  "type" | "autoComplete" | "placeholder" | "disabled" | "inputMode" | "autoFocus"
>;

interface FormTextFieldProps<
  TFieldValues extends FieldValues,
  TTransformed,
> extends InputProps {
  control: Control<TFieldValues, unknown, TTransformed>;
  /** Only paths whose value is a string are accepted. */
  name: FieldPathByValue<TFieldValues, string | undefined>;
  label: string;
  description?: string;
  required?: boolean;
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
            />
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
