"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import type { FieldValues } from "react-hook-form";

import { Button } from "@/components/ui/button";

import { FormTextField, type FormTextFieldProps } from "./form-text-field";

type FormPasswordFieldProps<TFieldValues extends FieldValues, TTransformed> = Omit<
  FormTextFieldProps<TFieldValues, TTransformed>,
  "type" | "endAdornment" | "inputMode"
> & {
  autoComplete: "current-password" | "new-password";
};

/** Password input with an accessible show/hide toggle. */
export function FormPasswordField<TFieldValues extends FieldValues, TTransformed>(
  props: FormPasswordFieldProps<TFieldValues, TTransformed>,
) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOffIcon : EyeIcon;

  return (
    <FormTextField
      {...props}
      type={visible ? "text" : "password"}
      endAdornment={
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon aria-hidden />
        </Button>
      }
    />
  );
}
