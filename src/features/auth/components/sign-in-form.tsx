"use client";

import { Loader2Icon } from "lucide-react";

import {
  applyActionError,
  FormRootError,
  FormTextField,
  useZodForm,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";

import { signIn } from "../actions/sign-in";
import { signInSchema } from "../schemas/sign-in";

export function SignInForm({ next }: { next?: string }) {
  const form = useZodForm(signInSchema, {
    defaultValues: { email: "", password: "", next },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    // On success the action redirects and this promise does not resolve with a result.
    const result = await signIn(values);
    if (!result.ok) {
      applyActionError(form, result.error);
      form.resetField("password");
    }
  });

  const { isSubmitting, errors } = form.formState;

  return (
    <form onSubmit={onSubmit} noValidate>
      <FieldGroup>
        <FormRootError message={errors.root?.server?.message} />
        <FormTextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
        />
        <FormTextField
          control={form.control}
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2Icon className="animate-spin" aria-hidden />}
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </FieldGroup>
    </form>
  );
}
