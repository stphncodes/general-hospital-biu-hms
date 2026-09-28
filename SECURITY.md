# Security Policy

## Project status

This is early-stage, **development-only** software. It is not approved for
clinical use and must not hold real patient data. Security reports are still
very welcome: the aim is to build the system correctly from the start.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report privately through GitHub:
**Security → Advisories → Report a vulnerability** on
<https://github.com/stphncodes/general-hospital-biu-hms/security/advisories/new>.

Include, where possible:

- a description of the issue and its potential impact;
- steps to reproduce or a proof of concept;
- affected files, routes or commits;
- any suggested remediation.

We aim to acknowledge reports within **7 days** and to agree on a disclosure
timeline with the reporter. This is a volunteer project, so response times
may vary; there is no bug bounty.

## Scope

In scope: this repository's code, configuration, migrations and
documentation — for example authentication or authorization flaws, RLS gaps,
injection, open redirects, secret exposure, or sensitive data in logs.

Out of scope: third-party services (report to Supabase, Vercel, etc.
directly), social engineering, and denial-of-service testing against any
deployment you do not own.

## Supported versions

Only the latest commit on `main` receives fixes while the project is
pre-release.

## For contributors

The security model is documented in
[docs/security/README.md](./docs/security/README.md). Never commit secrets;
if one is committed by mistake, treat it as compromised and **rotate it
immediately** — removing it from history is not sufficient.
