import { describe, expect, it } from "vitest";

import {
  passwordResetRequestSchema,
  updatePasswordSchema,
} from "@/features/auth/schemas/password-reset";

function messagesFor(input: unknown) {
  const result = updatePasswordSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("updatePasswordSchema", () => {
  it("accepts a password that meets the Supabase policy", () => {
    expect(
      updatePasswordSchema.safeParse({
        password: "Ward-Round-2026",
        confirmPassword: "Ward-Round-2026",
      }).success,
    ).toBe(true);
  });

  it("enforces length and character classes", () => {
    const messages = messagesFor({ password: "short", confirmPassword: "short" });
    expect(messages).toContain("Use at least 12 characters.");
    expect(messages).toContain("Include an uppercase letter.");
    expect(messages).toContain("Include a number.");
  });

  it("reports a mismatched confirmation on the confirmation field", () => {
    const result = updatePasswordSchema.safeParse({
      password: "Ward-Round-2026",
      confirmPassword: "Ward-Round-2025",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["confirmPassword"]);
  });
});

describe("passwordResetRequestSchema", () => {
  it("normalises the email address", () => {
    expect(passwordResetRequestSchema.parse({ email: "  Nurse@Example.org " })).toEqual({
      email: "nurse@example.org",
    });
  });
});
