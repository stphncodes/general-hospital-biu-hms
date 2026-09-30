/**
 * Public API of the administration feature. Other modules and `app/` routes
 * import from here, never from the feature's internal files.
 */
export { adminSignIn } from "./actions/admin-sign-in";
export { inviteStaff } from "./actions/invite-staff";
export { AccessDenied } from "./components/access-denied";
export { AdminSidebar } from "./components/admin-sidebar";
export { InviteStaffSheet } from "./components/invite-staff-sheet";
export { StaffTable } from "./components/staff-table";
export {
  getAdminContext,
  getAssignableRoles,
  getStaffDirectory,
  getStaffSummary,
  STAFF_SORTABLE_COLUMNS,
  type AdminContext,
  type AssignableRole,
} from "./queries/staff";
export { inviteStaffSchema, type InviteStaffInput } from "./schemas/invite-staff";
export type { StaffMember, StaffSummary } from "./types/staff";
