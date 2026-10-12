# Public-beta hosting readiness audit — 2026-10-12

## Scope and result

This is a host-neutral, repository-only audit of `main` at
`72c17259618620cc3167b64a46189426b9172d4d`. It does not select a provider,
deploy, create an account, credential, domain, or release, nor change product,
scientific, AP, V17, or canonical behavior.

**Release recommendation: do not release a public beta yet.** The application
can build and its local production preview serves the three public routes, but
the current deployment artifact is a Node server function coupled to a Vercel
output preset and includes Grok-specific runtime surfaces. Public launch also
needs owner decisions on hosting, domain, data/auth posture, privacy, and
licensing/copyright, plus bounded repository work to make the selected public
profile explicit and repeatably verifiable.

## Evidence inspected

| Item | Finding |
| --- | --- |
| Starting and audited `main` | `72c17259618620cc3167b64a46189426b9172d4d` |
| Runtime/build | `app/package.json`, `vite.config.ts`, TanStack Start, Vite 8.2.2, Nitro 3.0.260610-beta |
| Generated deployment output | `.vercel/output/config.json` routes every non-static request to `__server`; `__server.func/.vc-config.json` specifies `Nodejs`, `nodejs24.x`, streaming, `index.mjs` |
| Public routing | local production preview returned HTTP 200 and rendered titles for `/`, `/journey`, and `/smartphone`; it also returned 200 for `/__grok/manifest.webmanifest` and `/?install=1&platform=ios` |
| Accepted QA evidence | Issue #122 is `RESOLVED`; PR #123 is merged at the audited main SHA. HQ recorded rendered production-preview QA at 390×844 and 1280×800, three clean preview starts, no authorized staging target, and the existing lint baseline of one error plus three warnings. |
| Repository deployment controls | No tracked workflow, deployment configuration, container, hosting configuration, domain configuration, or public release runbook was found. |

The build itself creates ignored `.vercel/` output and updates generated
`src/routeTree.gen.ts`; neither is part of this audit deliverable.

## Runtime and hosting conclusion

The app is **not currently a static-hosting artifact**. `vite.config.ts` adds
Nitro only for build/preview with `preset: "vercel"` and `serverDir: "./server"`.
The resulting Vercel Build Output API configuration has static-asset handling
followed by a catch-all destination of `/__server`. The server entry is
`functions/__server.func/index.mjs` on Node 24 with response streaming.

Accordingly, the minimum currently evidenced execution profile is a deployment
adapter that can run the generated Node server function, forward arbitrary
paths and query strings to it, preserve request host/protocol headers, and
serve static assets before the function. A purely static host would require an
explicit adaptation/rebuild and direct-route proof; that work is not authorized
by this audit. A generic persistent Node server might be possible only after a
bounded adapter/start-command task: this repository has no production `start`
script and the generated output is specifically Vercel-shaped.

`npm run build` is the build command. It runs `vite build` through
`scripts/with-app-env.mjs`, then `npm run db:migrate`. The local preview command
is `npm run preview` (Vite preview, port 8081); it is verification tooling, not
the documented production launch command. The observed output requires Node
24 according to Nitro; the audit ran it with Node `v24.20.0`, npm `11.19.0`, and
TypeScript `5.9.3`.

## What the public routes exercise

`/`, `/journey`, and `/smartphone` are TanStack routes inside `__root.tsx`.
The root mounts a pass-through `AuthProvider`, `PreviewHostBridge`, CSS, external
Google Fonts, and PWA links. The direct-route production-preview check passed
for all three routes.

The home route imports `ResearchSection`, which calls server functions in
`src/lib/research.ts`: paper retrieval and, on user action, an xAI completion
using `XAI_API_KEY`. Other inherited source modules include connector calls,
multiplayer/RTC requests, Better Auth, and PGLite/Postgres support. The audit
does not establish that every optional path is reachable in the public journey;
it establishes that these server capabilities remain packaged and must be
profiled or disabled explicitly before a public deployment.

With the shipped `.grok/app-env.json`, `VITE_AUTH_ENABLED` is `false` and its
`deploy.database` flag is false. That local build profile does not prove an
acceptable public profile. When auth is enabled, the code expects a persistent
database and Better Auth configuration; auth code also contains preview fallbacks
and broker assumptions. When `DATABASE_URL` is set, the build migration runner
applies top-level SQL migrations transactionally. When it is unset, PGLite is a
process-local fallback, which is not durable across serverless instances or
restarts and is not adequate as public persistent storage.

## Environment and storage inventory (names only)

Repository references include `DATABASE_URL`, `VITE_AUTH_ENABLED`,
`VITE_PUBLIC_HOSTNAME`, `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`,
`GROK_AUTH_ISSUER`, `GROK_AUTH_CLIENT_ID`, `GROK_AUTH_CLIENT_SECRET`,
`GROK_GATE_ORIGIN`, `GROK_PROJECT_ID`, `GROK_CONNECTORS_URL`, `XAI_API_KEY`,
and `VITE_STUN_URLS`; test/preview-only variables are also present. No values
are recorded here.

Minimum requirements if the public profile enables database or authentication:

1. provide a managed, durable Postgres-compatible `DATABASE_URL` and execute
   migrations in a controlled release step, not merely as an unreviewed build
   side effect;
2. provide a stable HTTPS public origin plus auth secrets/origin configuration;
3. provide cookie-compatible HTTPS and verify sign-in, sign-out, session
   isolation, migration rollback, and data retention behavior;
4. do not rely on process-local PGLite for persistent public data.

## Platform-specific and external assets

The build includes a **Grok-specific PWA/preview integration**:

- `server/middleware/grok-pwa.ts` dynamically serves `/__grok/manifest.webmanifest`
  and an install page, and injects platform head content;
- public assets live under `public/__grok/`, including a Grok-branded install
  tutorial; and
- `grok-pwa-shared.mjs` references `https://grok.com/grok-app-builder/extensions.js`
  and Grok host/project environment values.

These are blockers for an independent public host until an explicitly approved
task either demonstrates they are portable/legal/supported in the selected
profile or removes/replaces them. This audit makes neither choice.

The root route loads Google Fonts from `fonts.googleapis.com` and
`fonts.gstatic.com`. Production requires an owner decision to accept those
third-party requests and their privacy implications, or a separately approved
self-hosting/removal task. The preview check confirmed manifest and install
endpoints, but did not prove public-CDN policy, icon rights, caching behavior,
or cross-provider compatibility.

## Readiness matrix

| Area | Status | Evidence and required next action |
| --- | --- | --- |
| Build/runtime compatibility | NEEDS_BOUNDED_REPOSITORY_WORK | Build output is Node 24/Vercel-shaped. Add a selected-profile adapter/runbook and repeatable verification. |
| Deployment entry point | NEEDS_BOUNDED_REPOSITORY_WORK | Generated `__server.func/index.mjs` exists, but no production start/deploy contract is tracked. |
| Deep-link routing | READY | Local production preview returned 200 for `/`, `/journey`, and `/smartphone`; selected-host verification still belongs in release checks. |
| Environment/secrets | NEEDS_OWNER_DECISION | Public auth, research/AI, connector, and hostname settings need an approved public profile and secret ownership. |
| Database/migrations/storage | NEEDS_OWNER_DECISION | Persistent data requires a durable database and release-time migration/rollback decision; PGLite is process-local fallback only. |
| Authentication | NEEDS_OWNER_DECISION | Shipped build has auth off; enabled auth entails Better Auth, cookies, broker credentials, database, and privacy/data commitments. |
| Privacy/data collection | NEEDS_OWNER_DECISION | No public privacy/cookie notice was found; external fonts, optional research/AI, connectors, auth cookies, and RTC capability need a stated public posture. |
| Security/dependencies | NEEDS_BOUNDED_REPOSITORY_WORK | Lockfile install passed, but no tracked dependency/security review policy or release check was found. |
| Errors/observability without analytics | NEEDS_BOUNDED_REPOSITORY_WORK | No public error/incident or minimal privacy-preserving observability contract is tracked. |
| Manifest/icons/PWA | NEEDS_BOUNDED_REPOSITORY_WORK | Endpoints/assets work locally but are Grok-specific; portability, rights, and install behavior require an explicit decision/task. |
| External fonts/assets | NEEDS_OWNER_DECISION | Google Fonts and Grok extension/install assets need a public-host/privacy/rights decision. |
| Accessibility/responsive | READY | Accepted Issue #122/PR #123 rendered QA passed at 390×844 and 1280×800 without reported overflow, focus, console, or same-origin asset failures. |
| Test/type/build | READY | `npm ci --ignore-scripts --dry-run`, 573 tests, and typecheck passed; production output was generated. |
| Lint baseline | NEEDS_BOUNDED_REPOSITORY_WORK | `npm run lint` has the accepted starting-main baseline: one `no-empty` error and three warnings. It was not altered here. |
| Source/provenance | READY | Canonical source/provenance structure is repository-backed; this audit changes none of it. |
| License/copyright/public reproduction | NEEDS_OWNER_DECISION | No tracked LICENSE, NOTICE, public privacy, or third-party attribution document was found; AP/source/public reproduction permissions must be established before release. |
| Domain/provider/payment | NEEDS_OWNER_DECISION | No provider, domain, account, or payment choice is authorized or present. |
| Staging | BLOCKED_BY_MISSING_EVIDENCE | Issue #122 established no real authorized staging environment. Do not create one under this task. |
| Rollback/release verification | NEEDS_BOUNDED_REPOSITORY_WORK | No tracked release, rollback, or post-deploy verification procedure exists. |

## Checks performed

- `npm ci --ignore-scripts`: passed; subsequent `npm ci --ignore-scripts --dry-run`
  also passed, supporting lockfile integrity.
- `npm test`: passed, **573** tests, 0 failures.
- `npm run typecheck`: passed.
- `npm run lint`: failed with the pre-existing 1 error/3-warning baseline
  recorded by accepted QA: empty block in `src/lib/app-data/client.server.ts`,
  plus warnings in `button.tsx`, `use-current-user.ts`, and
  `impact-pathways-ux.mjs`.
- `npm run build`: generated Nitro Vercel output and reported `nodejs24.x`; with
  no `DATABASE_URL`, the migration step is designed to skip. The build modified
  generated `routeTree.gen.ts` and wrote ignored `.vercel/` output only.
- Local `npm run preview`: verified HTTP 200 and expected document titles for
  `/`, `/journey`, `/smartphone`; also verified the manifest and install-page
  endpoints. This is not staging.

## Smallest ordered next tasks

1. **HQ/owner decision record (no deployment):** choose whether the beta has
   accounts/persistence, external research/AI, RTC/connectors, Google Fonts,
   PWA, and what data/privacy/cookie and licensing posture applies. Name the
   accountable owner for provider/domain/payment; do not provision anything.
2. **One bounded repository hosting-profile task after that decision:** document
   a provider-neutral Node/serverless interface or an approved selected-provider
   adapter; isolate/disable unsupported Grok preview/PWA surfaces for the public
   profile; add a production entry/deep-link/env validation. No semantic/UI
   change is required by this task.
3. **One bounded release-governance task:** add public license/attribution and
   privacy/cookie disclosures as approved, define migration/secret/rollback and
   post-deploy checks, and repair or consciously disposition the lint baseline.
4. **Only after 1–3 and owner authorization:** create a staging environment and
   execute deployment/release verification. Provider, domain, accounts, and
   costs remain owner-controlled.

## Limits

This report is evidence, not acceptance. It does not approve hosting, public
release, any third-party service, data collection, source reproduction, or a
change to scientific/AP/V17/product behavior. HQ acceptance remains required.
