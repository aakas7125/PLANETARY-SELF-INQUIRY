# HQ-CURSOR-2026-10-15-051 INITIAL-1

Task ID: HQ-CURSOR-2026-10-15-051
Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/160
PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/161
Cycle: INITIAL-1
Starting main SHA: 827ccedca9931c7f74ceeeb495514843a0d9fdec
VALIDATED_IMPLEMENTATION_HEAD: 77e13814410f9bacd4144daab5ac8b7be12eb0da
EVIDENCE_RETURN_HEAD: this commit
Branch: cursor/hq-cursor-2026-10-15-051-public-constitution
Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW

Durable Issue status was not written. No native Issue-write action was used.

## Scope implemented

Static `/constitution` page titled “What PSI promises you”. The English copy is the adopted §1 text from `handoffs/ap/HQ-AP-2026-10-15-003-public-constitution.md`, kept as stable PC-* units in `app/src/lib/constitution/public-constitution.mjs`. Six static scenes use the adopted scene map. PC-RAW-01 is shown in scene 1 and scene 5. D-007 sets the accountability href to `https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues`. PC-ACCOUNT-02 is rendered before that link. One SiteNav entry, “Principles”, points at `/constitution` and carries `aria-current="page"` there. Existing labels, anchors, and targets remain. Homepage, Household Ledger, Journey, and the phone inquiry were not redesigned.

## Changed implementation files

- `app/src/lib/constitution/public-constitution.mjs`
- `app/src/components/public-constitution.tsx`
- `app/src/routes/constitution.tsx`
- `app/src/components/site-nav.tsx`
- `app/src/routeTree.gen.ts`
- `app/scripts/public-constitution.test.mjs`
- `app/scripts/constitution-public-profile-smoke.mjs`
- `project-state/PUBLIC_BETA_PROFILE.md`

The lease and this return are transport only.

## Validation toolchain

- Node `v22.14.0`
- npm `11.19.0` via `corepack npm@11.19.0`
- TypeScript `5.9.3`
- Chrome `/opt/google/chrome/chrome`
- Install: `corepack npm@11.19.0 ci --ignore-scripts` → 0
- Lock SHA-256 `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188` unchanged after build
- `npm test` → 0 (scripts 619 pass / 0 fail; TS 50/50)
- `npm run lint` → 0
- `npm run typecheck` → 0
- `npm run build` → 0
- `node scripts/public-beta-profile-graph.mjs` → 0, result `clear`, 56 files, 18 prohibited patterns
- `PREVIEW_URL=http://127.0.0.1:8081 node scripts/constitution-public-profile-smoke.mjs` → 0

Routine CI on the validated head was in progress at return: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/actions/runs/38803995973

## Rendered and privacy checks

Built public profile, `HOST=127.0.0.1` `PORT=8081`, reduced motion. Viewports 390×844 and 1280×800.

Checked direct `/constitution`, reload, Back to home, Home → Principles, Principles current state, keyboard focus on Principles, Phone inquiry, and Journey. Situation submit stayed disabled. Overflow 0. No page errors, same-origin HTTP failures, or prohibited requests. The accountability href was read from the DOM. The GitHub page was not opened and no issue was submitted.

Privacy on the new route after that navigation: document cookie empty, browser cookies 0, localStorage 0, sessionStorage 0, indexedDB databases 0, cache keys 0, service workers 0, password/email inputs 0. `GET /constitution` returned 200 with no `Set-Cookie`. The profile graph stayed clear. PC-PRIV-01 matches those checks. PC-PRIV-02 remains the limit: this is not proof of device-only processing, deletion, or identical privacy for every deployment.

## Screenshot map

Beside this file, `INITIAL-1-390-*` and `INITIAL-1-1280-*`: `top`, `scene-1` through `scene-6`, each `scene-N-diagram`, `privacy`, and `accountability`.

## Preserved gaps

German localization, animation, homepage redesign, and PDF export remain out of this cycle. No new product, scientific, or AP claim was added.

## Discrepancies

None. The accepted profile and PC-PRIV-01 were not contradicted by the checks above.

Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW
