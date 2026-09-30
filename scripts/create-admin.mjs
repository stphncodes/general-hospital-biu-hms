/**
 * Creates an administrator: invites the person (or finds their existing
 * account), creates their staff profile and grants the Administrator role.
 *
 *   npm run admin:create -- --email admin@example.org --name "Full Name" \
 *     [--facility "Facility name"]
 *
 * `--facility` is required the first time, when no facility exists yet; it
 * is created with that name. Uses SUPABASE_SECRET_KEY, which bypasses RLS,
 * so this is an operator tool only. Reads .env.local, then .env.
 */
import { existsSync } from "node:fs";
import { parseArgs } from "node:util";

import { createClient } from "@supabase/supabase-js";

const out = (message) => process.stdout.write(`${message}\n`);
function fail(message) {
  process.stderr.write(`Error: ${message}\n`);
  process.exit(1);
}

for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

const { values } = parseArgs({
  options: {
    email: { type: "string" },
    name: { type: "string" },
    facility: { type: "string" },
  },
});

const email = values.email?.trim().toLowerCase();
const fullName = values.name?.trim();
const facilityName = values.facility?.trim();

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  fail("Provide a valid --email, e.g. --email admin@example.org");
}
if (!fullName) fail('Provide --name, e.g. --name "Full Name"');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
if (!url || !secretKey) {
  fail(
    "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set (see .env.example).",
  );
}

const supabase = createClient(url, secretKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---- Facility ----------------------------------------------------------------
const { data: tenants, error: tenantsError } = await supabase
  .from("tenants")
  .select("id, name")
  .order("created_at");
if (tenantsError) {
  fail(
    `Could not read facilities (${tenantsError.message}). Has the access-control migration been applied?`,
  );
}

let tenant;
if (tenants.length === 0) {
  if (!facilityName) fail('No facility exists yet. Provide --facility "Facility name".');
  const { data, error } = await supabase
    .from("tenants")
    .insert({ name: facilityName })
    .select("id, name")
    .single();
  if (error) fail(`Could not create the facility: ${error.message}`);
  tenant = data;
  out(`Created facility "${tenant.name}".`);
} else if (facilityName) {
  tenant = tenants.find((t) => t.name === facilityName);
  if (!tenant) {
    fail(
      `No facility named "${facilityName}". Existing: ${tenants.map((t) => `"${t.name}"`).join(", ")}`,
    );
  }
} else if (tenants.length === 1) {
  tenant = tenants[0];
} else {
  fail(
    `Several facilities exist; choose one with --facility. Existing: ${tenants.map((t) => `"${t.name}"`).join(", ")}`,
  );
}

// ---- Administrator role --------------------------------------------------------
const { data: role, error: roleError } = await supabase
  .from("roles")
  .select("id")
  .eq("key", "administrator")
  .single();
if (roleError) fail(`Administrator role not found: ${roleError.message}`);

// ---- User account --------------------------------------------------------------
async function findUserByEmail(address) {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) fail(`Could not list users: ${error.message}`);
    const match = data.users.find((u) => u.email?.toLowerCase() === address);
    if (match) return match;
    if (data.users.length < 200) return null;
  }
}

let userId;
let invited = false;
const { data: invite, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
  email,
  { data: { full_name: fullName } },
);
if (inviteError) {
  if (inviteError.code !== "email_exists" && inviteError.code !== "user_already_exists") {
    fail(`Could not invite ${email}: ${inviteError.message}`);
  }
  const existing = await findUserByEmail(email);
  if (!existing) fail(`${email} is reported as existing but could not be found.`);
  userId = existing.id;
} else {
  userId = invite.user.id;
  invited = true;
}

// ---- Profile and role ------------------------------------------------------------
const { data: profile, error: profileReadError } = await supabase
  .from("staff_profiles")
  .select("tenant_id")
  .eq("user_id", userId)
  .maybeSingle();
if (profileReadError)
  fail(`Could not read the staff profile: ${profileReadError.message}`);

if (profile && profile.tenant_id !== tenant.id) {
  fail(`${email} already belongs to a different facility.`);
}
if (!profile) {
  const { error } = await supabase
    .from("staff_profiles")
    .insert({ user_id: userId, tenant_id: tenant.id, full_name: fullName });
  if (error) fail(`Could not create the staff profile: ${error.message}`);
}

const { data: assignment, error: assignmentReadError } = await supabase
  .from("role_assignments")
  .select("id")
  .eq("user_id", userId)
  .eq("role_id", role.id)
  .eq("tenant_id", tenant.id)
  .is("department_id", null)
  .maybeSingle();
if (assignmentReadError)
  fail(`Could not read role assignments: ${assignmentReadError.message}`);

if (!assignment) {
  const { error } = await supabase
    .from("role_assignments")
    .insert({ user_id: userId, role_id: role.id, tenant_id: tenant.id });
  if (error) fail(`Could not grant the Administrator role: ${error.message}`);
}

out(
  invited
    ? `Invited ${email} as an administrator of "${tenant.name}". They will receive an email to set their password, then sign in at /admin/login.`
    : `${email} is now an administrator of "${tenant.name}". They can sign in at /admin/login.`,
);
