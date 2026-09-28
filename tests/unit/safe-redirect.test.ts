import { describe, expect, it } from "vitest";

import { safeRedirectPath } from "@/lib/utils/redirect";

describe("safeRedirectPath", () => {
  it.each(["/dashboard", "/dashboard/settings?tab=profile"])(
    "accepts relative path %s",
    (path) => {
      expect(safeRedirectPath(path, "/")).toBe(path);
    },
  );

  it.each([
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "javascript:alert(1)",
    "dashboard",
    "/\u0000//evil.example",
    "",
    undefined,
    ["/dashboard"],
  ])("rejects unsafe target %j", (candidate) => {
    expect(safeRedirectPath(candidate, "/dashboard")).toBe("/dashboard");
  });
});
