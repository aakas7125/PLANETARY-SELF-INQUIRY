# HQ-CURSOR-2026-10-16-052 INITIAL-1

Task ID: HQ-CURSOR-2026-10-16-052
Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/164
PR: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/165
Cycle: INITIAL-1
Starting main SHA: 98bdedc99335c8eb92af3923872c62bb64435f56
VALIDATED_IMPLEMENTATION_HEAD: 511abb62f95af6d3b57cd1d4c0bdfc9131d55a6d
EVIDENCE_RETURN_HEAD: recorded by the evidence-return commit that adds this file
Branch: cursor/hq-cursor-2026-10-16-052-german-constitution

## Scope implemented

Optional German Constitution pilot on the existing `/constitution` page. English remains canonical and default. `?lang=de` selects the adopted D-008 copy. `?lang=en` selects English. Any other or missing `lang` stays in the URL and shows the complete English page. Page-local English / Deutsch (Pilot) links only. SiteNav stays English, including one Principles entry. No stored locale, browser or geo inference, cookies, or i18n framework.

## Changed implementation files

- app/src/lib/constitution/public-constitution.mjs
- app/src/lib/constitution/public-constitution-de.mjs
- app/src/lib/constitution/constitution-locale.mjs
- app/src/components/public-constitution.tsx
- app/src/routes/constitution.tsx
- app/scripts/public-constitution.test.mjs
- app/scripts/constitution-public-profile-smoke.mjs
- project-state/PUBLIC_BETA_PROFILE.md

## Validation toolchain

- Node v22.14.0
- npm 11.19.0 via corepack
- TypeScript 5.9.3
- Install: `corepack npm@11.19.0 ci --ignore-scripts` exit 0
- Lock SHA-256 `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188` unchanged
- `npm test` exit 0 (scripts 621 pass / 0 fail; TS 50/50)
- `npm run lint` exit 0
- `npm run typecheck` exit 0
- `npm run build` exit 0
- `node scripts/public-beta-profile-graph.mjs` exit 0, result clear
- Built server `HOST=127.0.0.1 PORT=8081`: constitution smoke exit 0 at 390×844 and 1280×800

## Rendered checks

SSR h1 and root `lang=en` agree for `/constitution`, `?lang=en`, `?lang=de`, and `?lang=zz`. German title only for `lang=de`. No set-cookie. Direct reload, client switch, Back, and Forward agree with the URL. Unsupported `lang=zz` remains in the URL and shows English. All 21 German units, repeated PC-RAW-01, privacy warning before the tracker link, and the canonical-English sources intro are present. Home, Phone inquiry, and Journey stay English. Principles remains the single SiteNav entry. Deutsch (Pilot) keyboard focus is visible. Horizontal overflow 0. No page, console, or HTTP errors. No external hosts, analytics, translation, font, or API requests. No cookies, localStorage, sessionStorage, indexedDB, cache, or service worker.

Screenshots beside this file use the INITIAL-1 prefix for 390 and 1280: English top, unsupported fallback, German language control, six scenes, scene text, privacy, accountability, and sources.

## Preserved gaps

Professional or native editorial review and German user-comprehension testing were not performed and are not claimed. PC-PRIV-02 still withholds device-only, deletion, and every-deployment promises. LBL-NAV-PRINCIPLES is not applied to SiteNav.

## Discrepancies

None identified.

Self-merge: NO
Executor result: VERIFIED_FOR_HQ_REVIEW
Durable Issue status: not written. No native Issue-write action.
