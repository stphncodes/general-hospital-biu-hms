# `lib/supabase`

| File        | Runs in                                           | Key         | RLS          |
| ----------- | ------------------------------------------------- | ----------- | ------------ |
| `client.ts` | Client Components                                 | publishable | enforced     |
| `server.ts` | Server Components, Server Actions, Route Handlers | publishable | enforced     |
| `proxy.ts`  | `src/proxy.ts` only (session refresh)             | publishable | enforced     |
| `admin.ts`  | Server only, privileged operations                | **secret**  | **bypassed** |

Default to `server.ts`. See [docs/security/README.md](../../../docs/security/README.md).
