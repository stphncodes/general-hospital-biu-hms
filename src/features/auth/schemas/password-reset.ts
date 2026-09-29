import { z } from "zod";

import { emailSchema } from "@/lib/validation";

/** Step 1: ask for a recovery email. */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export type PasswordResetRequestInput = z.input<typeof passwordResetRequestSchema>;

/**
 * Mirrors the Supabase Auth policy in `supabase/config.toml`
 * (`minimum_password_length`, `password_requirements`) so users get precise
 * feedback before submitting. Supabase remains the enforcing authority.
 */
export const PASSWORD_MIN_LENGTH = 12;

const newPassword = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters.`)
  // bcrypt ignores bytes beyond 72.
  .max(72, "Use at most 72 characters.")
  .regex(/[a-z]/, "Include a lowercase letter.")
  .regex(/[A-Z]/, "Include an uppercase letter.")
  .regex(/[0-9]/, "Include a number.");

/** Step 2: choose a new password (after following the recovery link). */
export const updatePasswordSchema = z
  .object({
    password: newPassword,
    confirmPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type UpdatePasswordInput = z.input<typeof updatePasswordSchema>;
