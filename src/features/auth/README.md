# Auth

Authentication for staff users, built on Supabase Auth.

## Implemented

| Piece                                | Where                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------- |
| Email/password sign-in               | `actions/sign-in.ts`, `components/sign-in-form.tsx`                          |
| Sign-out (current device)            | `actions/sign-out.ts`                                                        |
| Password reset: request link         | `actions/request-password-reset.ts`, `components/forgot-password-form.tsx`   |
| Password reset: set new password     | `actions/update-password.ts`, `components/reset-password-form.tsx`           |
| Access explainer (`/register`)       | `src/app/(auth)/register/page.tsx` — explains admin provisioning; no sign-up |
| Email-link verification (token hash) | `src/app/auth/confirm/route.ts`                                              |
| Email templates (invite, recovery)   | `supabase/templates/*.html`, wired in `supabase/config.toml`                 |
| Session refresh + route protection   | `src/proxy.ts`, `src/lib/supabase/proxy.ts`                                  |
| Verified current user / principal    | `src/lib/auth/session.ts`                                                    |

## Password reset flow

1. `/forgot-password` calls `resetPasswordForEmail`. The response is the same
   whether or not the account exists.
2. The recovery email links to
   `/auth/confirm?token_hash=…&type=recovery&next=/reset-password`, which
   verifies the token and creates a session.
3. `/reset-password` requires that session and calls `updateUser({ password })`.

Invitation emails use the same landing page (`type=invite&next=/reset-password`)
so new staff choose their first password there. **Hosted projects:** copy both
templates into the Supabase dashboard (Authentication → Email Templates).

The client-side password rules in `schemas/password-reset.ts` mirror
`minimum_password_length` / `password_requirements` in `supabase/config.toml`;
keep them in sync. Supabase remains the enforcing authority.

## Deliberately not implemented yet

- **Public sign-up.** Staff accounts are provisioned by an administrator
  (invite flow via the Auth admin API using `lib/supabase/admin.ts`).
  `/register` explains this instead of offering self-registration.
- **Admin invite UI.** Invitations are currently sent from the Supabase
  dashboard or the Auth admin API.
- **MFA.** Supabase supports TOTP MFA; enrolment and an `aal2` requirement
  for sensitive areas are planned.
- **Session management UI** (list and revoke other sessions).

## Security notes

- Sign-in returns the same message for unknown email and wrong password to
  prevent account enumeration; the reset request never reveals whether an
  account exists.
- Post-login `next` targets pass through `safeRedirectPath` (open-redirect
  protection).
- Server code identifies users with `getClaims()` (JWT signature verified),
  never `getSession()`.
- `/reset-password` accepts any signed-in session. `secure_password_change`
  in `supabase/config.toml` makes Supabase reject the change unless the user
  signed in recently (a recovery link counts).
