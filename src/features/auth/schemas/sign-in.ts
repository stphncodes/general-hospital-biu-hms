import { z } from "zod";

import { emailSchema } from "@/lib/validation";

/** Shared by the sign-in form (client) and the sign-in action (server). */
export const signInSchema = z.object({
  email: emailSchema,
  // Only presence is checked at sign-in; strength rules apply when a
  // password is set, which is enforced by Supabase Auth configuration.
  password: z.string().min(1, "Enter your password.").max(256),
  // Post-sign-in destination. Re-validated with `safeRedirectPath` on the
  // server — never trusted as-is.
  next: z.string().max(2048).optional(),
});

export type SignInInput = z.input<typeof signInSchema>;
