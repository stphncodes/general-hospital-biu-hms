import { describe, expect, it } from "vitest";

import { REDACTED, redact } from "@/lib/logger/redact";

describe("log redaction", () => {
  it("redacts credentials, personal identifiers and clinical content at any depth", () => {
    const output = redact({
      userId: "user-1",
      password: "not-a-real-password",
      accessToken: "not-a-real-token",
      record: {
        firstName: "Test",
        phone_number: "00000000000",
        nin: "00000000000",
        diagnosis: "placeholder",
        clinicalNotes: "placeholder",
      },
    });

    expect(output).toEqual({
      userId: "user-1",
      password: REDACTED,
      accessToken: REDACTED,
      record: {
        firstName: REDACTED,
        phone_number: REDACTED,
        nin: REDACTED,
        diagnosis: REDACTED,
        clinicalNotes: REDACTED,
      },
    });
  });

  it("does not over-match short tokens inside unrelated keys", () => {
    expect(redact({ warning: "w", running: true, remaining: 3 })).toEqual({
      warning: "w",
      running: true,
      remaining: 3,
    });
  });

  it("serialises errors without data-bearing fields such as PostgreSQL details", () => {
    const error = Object.assign(new Error("duplicate key value"), {
      code: "23505",
      details: "Key (phone)=(00000000000) already exists.",
    });

    expect(redact({ error })).toEqual({
      error: { name: "Error", message: "duplicate key value", code: "23505" },
    });
  });
});
