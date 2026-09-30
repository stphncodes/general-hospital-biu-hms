"use client";

import { Loader2Icon, MailIcon } from "lucide-react";
import Link from "next/link";

import {
  applyActionError,
  FormPasswordField,
  FormRootError,
  FormTextField,
  useZodForm,
} from "@/components/forms";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import type { ActionResult } from "@/lib/api";
import { ROUTES } from "@/lib/constants";

import { signIn } from "../actions/sign-in";
import { signInSchema, type SignInInput } from "../schemas/sign-in";

interface SignInFormProps {
  next?: string;
  /**
   * Server Action to submit to. Defaults to staff sign-in; the admin console
   * passes its own action, which also checks for administrator access.
   */
  action?: (input: SignInInput) => Promise<ActionResult<never>>;
  showForgotPassword?: boolean;
}

export function SignInForm({
  next,
  action = signIn,
  showForgotPassword = true,
}: SignInFormProps) {
  const form = useZodForm(signInSchema, {
    defaultValues: { email: "", password: "", next },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    // On success the action redirects and this promise does not resolve with a result.
    const result = await action(values);
    if (!result.ok) {
      applyActionError(form, result.error);
      form.resetField("password");
    }
  });

  const { isSubmitting, errors } = form.formState;

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={isSubmitting}>
      <FieldGroup>
        <FormRootError message={errors.root?.server?.message} />
        <FormTextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="username"
          inputMode="email"
          placeholder="name@hospital.org"
          icon={MailIcon}
          size="lg"
          required
        />
        <div className="grid gap-2">
          <FormPasswordField
            control={form.control}
            name="password"
            label="Password"
            autoComplete="current-password"
            size="lg"
            required
          />
          {showForgotPassword && (
            <Link
              href={ROUTES.forgotPassword}
              className="justify-self-end text-sm font-medium text-primary hover:text-primary-hover hover:underline hover:underline-offset-4"
            >
              Forgot password?
            </Link>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="h-10 w-full">
          {isSubmitting && <Loader2Icon className="animate-spin" aria-hidden />}
          {isSubmitting ? "Signing in…" : "Sign in"}
        </Button>
      </FieldGroup>
    </form>
  );
}
