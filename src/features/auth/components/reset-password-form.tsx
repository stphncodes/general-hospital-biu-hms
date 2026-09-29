"use client";

import { Loader2Icon } from "lucide-react";

import {
  applyActionError,
  FormPasswordField,
  FormRootError,
  useZodForm,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

import { updatePassword } from "../actions/update-password";
import { PASSWORD_MIN_LENGTH, updatePasswordSchema } from "../schemas/password-reset";

export function ResetPasswordForm() {
  const form = useZodForm(updatePasswordSchema, {
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    // On success the action redirects and this promise does not resolve with a result.
    const result = await updatePassword(values);
    if (!result.ok) {
      applyActionError(form, result.error);
      form.resetField("confirmPassword");
    }
  });

  const { isSubmitting, errors } = form.formState;

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={isSubmitting}>
      <FieldGroup>
        <FormRootError message={errors.root?.server?.message} />
        <FormPasswordField
          control={form.control}
          name="password"
          label="New password"
          autoComplete="new-password"
          description={`At least ${PASSWORD_MIN_LENGTH} characters, with upper- and lowercase letters and a number.`}
          size="lg"
          required
        />
        <FormPasswordField
          control={form.control}
          name="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
          size="lg"
          required
        />
        <Button type="submit" disabled={isSubmitting} className="h-10 w-full">
          {isSubmitting && <Loader2Icon className="animate-spin" aria-hidden />}
          {isSubmitting ? "Updating password…" : "Update password"}
        </Button>
      </FieldGroup>
    </form>
  );
}
