# Administration

The administration console at `/admin`, for managing staff accounts and
access in a facility.

## Implemented

| Piece                               | Where                                                               |
| ----------------------------------- | ------------------------------------------------------------------- |
| Admin sign-in (`/admin/login`)      | `actions/admin-sign-in.ts` (reuses the auth feature's `SignInForm`) |
| Access check for every admin page   | `queries/staff.ts` → `getAdminContext()` (`admin.access` required)  |
| Overview with real staff counts     | `app/(admin)/admin/page.tsx`, `staff_summary()` in SQL              |
| Staff list (search, sort, paginate) | `components/staff-table.tsx`, `staff_directory()` in SQL            |
| Invite staff and assign a role      | `actions/invite-staff.ts`, `components/invite-staff-sheet.tsx`      |
| First administrator                 | `npm run admin:create` (`scripts/create-admin.mjs`)                 |

Schema, policies and the permission model are described in
[docs/security/README.md](../../../docs/security/README.md#implementation).

## Not implemented yet

- Changing a staff member's role, and deactivating or reactivating accounts.
- Resending or cancelling an invitation.
- Audit-log review (the audit table does not exist yet; actions log
  structured events in the meantime).
- Facility settings.

## Open questions for domain modelling

These must be answered with hospital stakeholders. Do not guess clinical or
operational rules in code.

- Final role catalogue and default permission sets (the non-administrator
  roles are provisional).
- Who may grant which roles (separation of duties).
