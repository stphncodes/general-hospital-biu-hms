import { z } from "zod";

import { emailSchema, requiredText } from "@/lib/validation";

/** Shared by the invite form (client) and the invite action (server). */
export const inviteStaffSchema = z.object({
  fullName: requiredText("Full name", 200),
  email: emailSchema,
  jobTitle: z.string().trim().max(120, "Job title must be at most 120 characters."),
  // An empty selection is not a UUID, so this also covers "nothing chosen".
  roleId: z.uuid("Choose a role."),
});

export type InviteStaffInput = z.input<typeof inviteStaffSchema>;
