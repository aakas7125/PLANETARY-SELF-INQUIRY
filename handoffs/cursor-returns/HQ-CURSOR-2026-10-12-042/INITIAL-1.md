# Cursor return — HQ-CURSOR-2026-10-12-042 / INITIAL-1

Task ID: HQ-CURSOR-2026-10-12-042
Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/127
Dispatch cycle: HQ-CURSOR-2026-10-12-042 / INITIAL-1
Branch: cursor/hq-cursor-2026-10-12-042-minimal-public-beta-profile
Starting main SHA: 320204ec8a7c52695ac61837a94d9fa8fb1ebfeb
Prior reviewed head: none
VALIDATED_IMPLEMENTATION_HEAD: 94bc1f0d958534380b905b348246be2c5de67ddf
EVIDENCE_RETURN_HEAD: the git commit that contains only this transport artifact (reported exactly in the Cursor executor return; not embedded here to avoid self-hash churn)

Durable Issue status was not written. No native Issue-write action is available. HQ reconciles the Issue.

Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW

## Scope implemented

Owner-approved Option A, minimal privacy-first public profile:

- Public routes remain the Protect Four homepage, Journey, and complete smartphone inquiry.
- Homepage research renders the stored `canonPapers` only. It does not fetch OpenAlex or Crossref, and it has no runtime xAI control.
- The public root does not mount `AuthProvider` or `PreviewHostBridge`, and it does not link a Grok manifest, Grok icon, or Google Fonts.
- Nitro production output is preset `node-server`. `server/middleware` is not scanned.
- `npm run build` does not run database migrations.
- `npm run start` launches `app/.output/server/index.mjs` with no required secret.
- System font stacks replace the external Fraunces and Source Sans requests. Paper, pine, and clay tokens stay.
- `public/__grok/` is excluded from the production public directory.
- The dev authoring server may still register the inherited Grok plugin. That server is not the public profile.

## Build and start contract

- Build: `npm run build` → `node scripts/with-app-env.mjs vite build`
- Output preset: `node-server`
- Server entry: `app/.output/server/index.mjs`
- Static output: `app/.output/public/`
- Start: `npm run start` → `node scripts/start-public-profile.mjs`
- Expected Node: 22. Validated Node `v22.14.0`.
- `NITRO_HOST`, otherwise `HOST`. Unset leaves the Node default. Local verification used `HOST=127.0.0.1`.
- `NITRO_PORT`, otherwise `PORT`. Unset uses Nitro's default `3000`. Local verification used `PORT=8081`.
- Required secrets: none.

Runbook: `project-state/PUBLIC_BETA_PROFILE.md`.

## Changed implementation files

- `app/package.json`
- `app/vite.config.ts`
- `app/scripts/start-public-profile.mjs`
- `app/scripts/public-beta-profile.test.mjs`
- `app/scripts/public-beta-profile-graph.mjs`
- `app/scripts/e2e-local-preview-smoke.mjs`
- `app/scripts/grok-pwa-plugin.test.mjs`
- `app/server/middleware/grok-pwa.ts`
- `app/src/routes/__root.tsx`
- `app/src/components/research-section.tsx`
- `app/src/styles.css`
- `app/src/components/ui/button.tsx`
- `app/src/lib/app-data/client.server.ts`
- `app/src/lib/auth/use-current-user.ts`
- `app/src/lib/smartphone/impact-pathways-ux.mjs`
- `project-state/PUBLIC_BETA_PROFILE.md`

## Validation toolchain

- Node `v22.14.0`
- npm `11.19.0` (the PATH npm `10.9.7` rejects this lockfile; validation used the npm 11.19.0 CLI)
- TypeScript `5.9.3`

Install:

- `npm ci --ignore-scripts` → exit 0
- Lockfile SHA-256 `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188`
- `git diff -- package-lock.json` empty

Commands on the validated implementation tree:

- `npm test` → exit 0. Script tests 580 pass / 0 fail / 0 todo. TypeScript tests 50 pass / 0 fail / 0 todo.
- `npm run typecheck` → exit 0
- `npm run lint` → exit 0, zero errors and zero warnings
- `npm run build` → exit 0. Nitro reported preset `node-server`. No `.vercel` output.
- `node scripts/public-beta-profile-graph.mjs` → exit 0. 52 output files scanned, 18 prohibited patterns, result `clear`. Referenced `/assets/styles-*.css` exists in the public output.
- `HOST=127.0.0.1 PORT=8081 npm run start` → listening on `http://127.0.0.1:8081/`
- `PREVIEW_URL=http://127.0.0.1:8081 node scripts/e2e-local-preview-smoke.mjs` → exit 0

## Runtime findings

Direct production responses:

- `GET /` → 200, no `set-cookie`, document title Protect Four, no Google Fonts, no `/__grok/`
- `GET /journey` → 200
- `GET /smartphone` → 200
- `GET /assets/styles-B4LFeSDl.css` → 200, `text/css`
- `GET /__grok/manifest.webmanifest` → 404
- `GET /__grok/icon-180.png` → 404
- `GET /auth/popup` → 404
- `GET /__app-env` → 404
- `GET /?install=1&platform=ios` → 200 and remains the public homepage

Rendered smoke at 390×844 and 1280×800, reduced motion forced:

- Both viewports `ok: true`
- `externalHosts: []`
- `prohibitedRequests: []`
- No page errors, no console errors, no failed requests
- No document cookie, no `localStorage`, no `sessionStorage`, no browser cookies
- Homepage research shows the stored canon title and DOI, states that the set is not a live index and is not presented as current or exhaustive, and does not offer OpenAlex, Crossref, refresh, or AP-framework reading controls
- Direct refresh of `/`, `/journey`, and `/smartphone` remains in the existing route walk
- Focus ring and reduced-motion timing were asserted on the phone-inquiry call to action
- No unnamed controls and no horizontal overflow were reported
- Otherness stayed non-activated. The final choice stayed an unranked user choice.

## Preserved gaps

- No provider, account, credential, domain, DNS, payment, staging deployment, or public release.
- No public license, notice, or privacy/cookie disclosure. Those remain owner decisions from the readiness audit.
- No observability or incident contract.
- Legacy auth, database, connector, RTC, and `src/lib/research.ts` remain in the repository and are outside the production graph.
- `db:migrate` remains a script and is not part of build or start.
- The dev authoring server still has its serve-only Grok, auth-popup, and app-env plugins.
- SSR emits a second Tailwind stylesheet that Nitro does not publish. The production hook rewrites the server document URL to the one published stylesheet.

## Discrepancies

- PATH npm is 10.9.7 and cannot `npm ci` this lockfile. The validated install used npm 11.19.0.
- None in the rendered production profile against the Issue acceptance checks.
