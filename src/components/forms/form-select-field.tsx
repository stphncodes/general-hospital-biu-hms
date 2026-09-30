"use client";

import { useId } from "react";
import {
  Controller,
  type Control,
  type FieldPathByValue,
  type FieldValues,
} from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectFieldProps<TFieldValues extends FieldValues, TTransformed> {
  control: Control<TFieldValues, unknown, TTransformed>;
  /** Only paths whose value is a string are accepted. */
  name: FieldPathByValue<TFieldValues, string | undefined>;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
}

/**
 * Accessible select wired to React Hook Form, following the same label,
 * description, error and `aria-*` wiring as `FormTextField`.
 */
export function FormSelectField<TFieldValues extends FieldValues, TTransformed>({
  control,
  name,
  label,
  options,
  placeholder = "Select…",
  description,
  required,
  disabled,
}: FormSelectFieldProps<TFieldValues, TTransformed>) {
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
            <Select
              name={field.name}
              value={(field.value as string | undefined) || undefined}
              onValueChange={field.onChange}
              disabled={disabled ?? field.disabled}
              required={required}
            >
              <SelectTrigger
                id={id}
                ref={field.ref}
                onBlur={field.onBlur}
                aria-invalid={fieldState.invalid}
                aria-describedby={describedBy}
                className="h-10 w-full bg-card px-3"
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent position="popper">
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
