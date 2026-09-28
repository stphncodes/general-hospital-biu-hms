import { describe, expect, it } from "vitest";

import {
  authorize,
  can,
  hasPermissionInAnyScope,
  type Principal,
} from "@/lib/permissions";

const TENANT = "tenant-a";

const principal: Principal = {
  userId: "user-1",
  grants: [
    { permission: "clinical.read", scope: { kind: "tenant", tenantId: TENANT } },
    {
      permission: "clinical.write",
      scope: { kind: "department", tenantId: TENANT, departmentId: "ward-3" },
    },
  ],
};

describe("permission checks", () => {
  it("denies by default when there is no principal or no matching grant", () => {
    expect(can(null, "patients.read", { tenantId: TENANT })).toBe(false);
    expect(can({ userId: "u", grants: [] }, "patients.read", { tenantId: TENANT })).toBe(
      false,
    );
    expect(can(principal, "billing.refund", { tenantId: TENANT })).toBe(false);
  });

  it("allows a tenant-scoped grant anywhere within that tenant", () => {
    expect(can(principal, "clinical.read", { tenantId: TENANT })).toBe(true);
    expect(
      can(principal, "clinical.read", { tenantId: TENANT, departmentId: "ward-9" }),
    ).toBe(true);
  });

  it("never lets a grant cross tenants", () => {
    expect(can(principal, "clinical.read", { tenantId: "tenant-b" })).toBe(false);
  });

  it("restricts a department-scoped grant to that department", () => {
    expect(
      can(principal, "clinical.write", { tenantId: TENANT, departmentId: "ward-3" }),
    ).toBe(true);
    expect(
      can(principal, "clinical.write", { tenantId: TENANT, departmentId: "ward-9" }),
    ).toBe(false);
    expect(can(principal, "clinical.write", { tenantId: TENANT })).toBe(false);
  });

  it("authorize() throws a FORBIDDEN AppError when denied", () => {
    expect(() =>
      authorize(principal, "pharmacy.dispense", { tenantId: TENANT }),
    ).toThrowError(expect.objectContaining({ code: "FORBIDDEN" }));
  });

  it("hasPermissionInAnyScope() is only true for held permissions", () => {
    expect(hasPermissionInAnyScope(principal, "clinical.write")).toBe(true);
    expect(hasPermissionInAnyScope(principal, "billing.read")).toBe(false);
  });
});
