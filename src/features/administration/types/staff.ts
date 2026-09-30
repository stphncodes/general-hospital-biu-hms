/** A staff account as shown in the admin console (serializable). */
export interface StaffMember {
  id: string;
  fullName: string;
  email: string | null;
  jobTitle: string | null;
  status: "active" | "deactivated";
  roles: string[];
  invitedAt: string | null;
  lastSignInAt: string | null;
}

export interface StaffSummary {
  total: number;
  active: number;
  pendingInvitations: number;
  administrators: number;
}
