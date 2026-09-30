import { describe, expect, it } from "vitest";

import { inviteStaffSchema } from "@/features/administration/schemas/invite-staff";
import { toGrants } from "@/lib/auth/grants";
import { tenantWithPermission, type Principal } from "@/lib/permissions";

const TENANT = "10000000-0000-4000-8000-000000000001";
const DEPT = "20000000-0000-4000-8000-000000000001";

describe("toGrants", () => {
  it("maps facility-wide and department grants", () => {
    expect(
      toGrants([
        { permission: "admin.access", tenant_id: TENANT, department_id: null },
        { permission: "clinical.read", tenant_id: TENANT, department_id: DEPT },
      ]),
    ).toEqual([
      { permission: "admin.access", scope: { kind: "tenant", tenantId: TENANT } },
      {
        permission: "clinical.read",
        scope: { kind: "department", tenantId: TENANT, departmentId: DEPT },
      },
    ]);
  });

  it("denies by default: drops unknown permissions and malformed rows", () => {
    expect(
      toGrants([
        { permission: "everything.do", tenant_id: TENANT, department_id: null },
        { permission: "admin.access", tenant_id: "not-a-uuid", department_id: null },
        null,
        "admin.access",
      ]),
    ).toEqual([]);
    expect(toGrants(null)).toEqual([]);
    expect(toGrants({ permission: "admin.access" })).toEqual([]);
  });
});

describe("tenantWithPermission", () => {
  const principal: Principal = {
    userId: "u",
    grants: [
      {
        permission: "staff.read",
        scope: { kind: "department", tenantId: TENANT, departmentId: DEPT },
      },
      { permission: "admin.access", scope: { kind: "tenant", tenantId: TENANT } },
    ],
  };

  it("returns the facility of a facility-wide grant", () => {
    expect(tenantWithPermission(principal, "admin.access")).toBe(TENANT);
  });

  it("ignores department-scoped grants and missing principals", () => {
    expect(tenantWithPermission(principal, "staff.read")).toBeNull();
    expect(tenantWithPermission(principal, "staff.invite")).toBeNull();
    expect(tenantWithPermission(null, "admin.access")).toBeNull();
  });
});

describe("inviteStaffSchema", () => {
  const valid = {
    fullName: "  Test Person 001 ",
    email: " Test.Person@Example.org ",
    jobTitle: " Nursing officer ",
    roleId: "30000000-0000-4000-8000-000000000001",
  };

  it("trims and normalises valid input", () => {
    expect(inviteStaffSchema.parse(valid)).toEqual({
      fullName: "Test Person 001",
      email: "test.person@example.org",
      jobTitle: "Nursing officer",
      roleId: valid.roleId,
    });
  });

  it("requires a name, a valid email and a role", () => {
    const result = inviteStaffSchema.safeParse({
      fullName: " ",
      email: "nope",
      jobTitle: "",
      roleId: "",
    });
    expect(result.success).toBe(false);
    const messages = result.error!.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
    expect(messages).toEqual(
      expect.arrayContaining([
        "fullName: Full name is required.",
        "email: Enter a valid email address.",
        "roleId: Choose a role.",
      ]),
    );
  });
});
