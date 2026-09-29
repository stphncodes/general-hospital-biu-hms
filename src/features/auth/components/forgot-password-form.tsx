"use client";

import { CircleCheckIcon, Loader2Icon, MailIcon } from "lucide-react";
import { useState } from "react";

import {
  applyActionError,
  FormRootError,
  FormTextField,
  useZodForm,
} from "@/components/forms";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

import { requestPasswordReset } from "../actions/request-password-reset";
import { passwordResetRequestSchema } from "../schemas/password-reset";

export function ForgotPasswordForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const form = useZodForm(passwordResetRequestSchema, {
    defaultValues: { email: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const result = await requestPasswordReset(values);
    if (result.ok) {
      setSentTo(values.email);
    } else {
      applyActionError(form, result.error);
    }
  });

  const { isSubmitting, errors } = form.formState;

  if (sentTo) {
    return (
      <Alert role="status" className="border-primary/20 bg-primary-soft">
        <CircleCheckIcon aria-hidden className="text-primary" />
        <AlertTitle className="text-heading">Check your email</AlertTitle>
        <AlertDescription>
          If an account exists for <strong className="text-foreground">{sentTo}</strong>,
          we have sent a link to reset your password. The link expires in one hour.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={isSubmitting}>
      <FieldGroup>
        <FormRootError message={errors.root?.server?.message} />
        <FormTextField
          control={form.control}
          name="email"
          label="Work email"
          type="email"
          autoComplete="username"
          inputMode="email"
          placeholder="name@hospital.org"
          icon={MailIcon}
          size="lg"
          required
        />
        <Button type="submit" disabled={isSubmitting} className="h-10 w-full">
          {isSubmitting && <Loader2Icon className="animate-spin" aria-hidden />}
          {isSubmitting ? "Sending link…" : "Send reset link"}
        </Button>
      </FieldGroup>
    </form>
  );
}
