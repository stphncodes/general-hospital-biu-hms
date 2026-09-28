# Auth

Authentication for staff users, built on Supabase Auth.

## Implemented

| Piece                                | Where                                               |
| ------------------------------------ | --------------------------------------------------- |
| Email/password sign-in               | `actions/sign-in.ts`, `components/sign-in-form.tsx` |
| Sign-out (current device)            | `actions/sign-out.ts`                               |
| Email-link verification (token hash) | `src/app/auth/confirm/route.ts`                     |
| Session refresh + route protection   | `src/proxy.ts`, `src/lib/supabase/proxy.ts`         |
| Verified current user / principal    | `src/lib/auth/session.ts`                           |

## Deliberately not implemented yet

- **Public sign-up.** Staff accounts are provisioned by an administrator
  (invite flow via the Auth admin API using `lib/supabase/admin.ts`).
- **Password reset UI.** `/auth/confirm` already verifies `recovery` links;
  a "set new password" page is still needed.
- **MFA.** Supabase supports TOTP MFA; enrolment and an `aal2` requirement
  for sensitive areas are planned.
- **Session management UI** (list and revoke other sessions).

## Security notes

- Sign-in returns the same message for unknown email and wrong password to
  prevent account enumeration.
- Post-login `next` targets pass through `safeRedirectPath` (open-redirect
  protection).
- Server code identifies users with `getClaims()` (JWT signature verified),
  never `getSession()`.
