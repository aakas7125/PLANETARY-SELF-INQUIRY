# Cursor return — HQ-CURSOR-2026-10-12-040 / INITIAL-1

Transport/evidence metadata only. No scientific, AP, model, product, or
implementation-semantic change.

## Identity

- Task ID: `HQ-CURSOR-2026-10-12-040`
- Issue: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/122
- PR: recorded in the Cursor executor return after the pull request is opened
- Branch: `cursor/hq-cursor-2026-10-12-040-e2e-local-staging-qa`
- Dispatch / cycle: `HQ-CURSOR-2026-10-12-040 / INITIAL-1`
- Wake comment: https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/122#issuecomment-6119425432

## SHAs

- Starting `origin/main` SHA: `4e50a1a8ae3f7fab6312b0fb039d990530a08651`
- Prior reviewed head: not applicable (initial verification)
- VALIDATED_IMPLEMENTATION_HEAD: `47bf529c9b066f20381e397015d43424149716e7`
- EVIDENCE_RETURN_HEAD: the git commit that contains only this transport artifact (reported exactly in the Cursor executor return; not embedded here to avoid self-hash churn)

## Environment

No authorized staging target exists in repository configuration. Searched
governance, project state, routes, and environment files. The only “staging”
strings are the roadmap name for this QA step, atomic file-write staging, and
unrelated platform connector hosts. No hosting, account, credential,
subscription, deployment, tunnel, or cloud resource was created.

QA used the local production preview (`npm run build`, then `npm run preview`
on `http://127.0.0.1:8081`). That preview is not staging.

## Authorized scope

Verification and a test-only smoke harness. No product, semantic, dependency,
or lockfile change.

The harness `app/scripts/e2e-local-preview-smoke.mjs` drives the rendered
preview at 390×844 and 1280×800. It is not part of `npm test`, because that
suite does not start a server. It does not read case identifiers as domain
inputs.

## Changed files

- `app/scripts/e2e-local-preview-smoke.mjs`
- `handoffs/cursor-returns/HQ-CURSOR-2026-10-12-040/INITIAL-1.md` (this transport artifact only)

No smartphone semantic module, route, homepage, Journey page, contract, source
package, dependency, or lockfile was modified.

## Validation toolchain

- Node: `v22.14.0`
- npm: `11.19.0` (`/tmp/npm11/node_modules/.bin/npm`)
- TypeScript: `5.9.3` (`npm ls typescript --depth=0`)
- Browser: `/opt/google/chrome/chrome` (Playwright’s downloaded browser cache was not present; the harness uses that Chrome when the bundled executable is absent)
- Install: `npm ci --ignore-scripts` → exit 0
- Lockfile SHA-256: `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188` (unchanged; no tracked lockfile diff)
- `npm test` → exit 0
  - scripts: 573 pass / 0 fail / 0 todo
  - TypeScript tests: 50 pass / 0 fail / 0 todo
- `npm run typecheck` → exit 0
- `npm run build` → exit 0
- `npm run lint` → exit 1, same four diagnostics as starting `main` (see discrepancies). The new harness added none.
- Production-preview smoke, after the final build, on the third preview start: `node scripts/e2e-local-preview-smoke.mjs` → exit 0 at 390 and 1280

These commands were run on the implementation tree that was committed as
`47bf529c9b066f20381e397015d43424149716e7`. This evidence commit does not change
that tree.

## Staging

Real staging: no.

## Paths and viewports

Rendered with `prefers-reduced-motion: reduce`.

- `/` at 390×844 and 1280×800, including reload
- `/smartphone` direct, through “Begin the phone inquiry”, through “Phone inquiry”, and after reload
- `/journey` direct, through the Journey link, and after reload
- Homepage section link “Framework” reaches `/#framework`
- Journey “Back to main experience” returns to `/`

## Representative input path

Same path at both widths:

- Situation: Yes; No; Not sure. Submit stayed disabled until all three were explicit. ArrowRight moved the first radio group.
- Inquiry: Q1 “A sharper camera for work I already do.”; Q2 exact “I’m not sure” (U+2019); Q3 preserved as `"  spaced answer  "`; Q4 “The want would stay.”; Q5 “Keeping it feels ordinary.”; Q6 “It still looks like a practical limit.” with provisional “Consider a used or refurbished phone” and shift “Unchanged”.
- Editing the situation after a temporary inquiry answer cleared that answer. Back preserved Q6.
- Comparison: Keep, used/second-hand, and refurbished were unselected at entry and then inspected separately. Repair facts stayed hidden. Horizon `4`. Remaining service was marked not sure and the keep card said it was not replaced with zero or a default; it was then entered as `2.50`. Used service `1.50`. Refurbished service `3`. Those raw strings stayed distinct from the horizon.
- Impact: Water rendered a conditional statement and did not say the pathway was withheld. Climate, mining eco, mining people, e-waste people, and e-waste eco each said the condition was not established and the gap was not filled in. The page said unknown transfer, process, fate, water quantity, and material demand are not treated as zero. No internal reason code was shown.
- Otherness: the approved question was not shown. The page said the missing establishment is not absence and not confinement. Final choice still opened.
- User choice: seven options, none selected on entry. Each selected exactly one value: `keep`, `repair`, `used_secondhand`, `refurbished`, `new`, `investigate_further`, `unclear`. Clear removed the selection. Unclear survived Back to otherness and return. Changing the horizon from `4` to `5` cleared that final selection and left the provisional inquiry choice in place.

No winner, purchase instruction, motive score, or internal snake_case token was shown on the inspected screens.

## Console, network, overflow, accessibility

On the production preview, both viewports:

- Horizontal overflow 0 on home, comparison, impact, otherness, choice, journey, and reloaded home
- No page errors, console errors, failed requests, or same-origin HTTP failures
- “Begin the phone inquiry” showed a visible focus ring under keyboard focus
- Reduced motion stayed in force: animation duration and transition duration computed as `1e-05s`
- Situation controls had accessible names. The first radio group responded to ArrowRight
- Refresh and direct load of `/smartphone` returned to an unanswered situation. No journey state was persisted

## Cold start

Three fresh production-preview starts. None logged or returned Vite `504 Outdated Optimize Dep`.

1. First start: `/`, `/smartphone`, and `/journey` returned 200. A Chrome load of those routes had no console errors and no HTTP failures.
2. Second start: the same three routes returned 200. The first full smoke pass exited 0.
3. Third start, after the final `npm run build`: the full smoke exited 0. The preview log had no 504.

Dev disposition, separately from the preview: after removing `node_modules/.vite`, the first 390 load of `npm run dev` logged `504 Outdated Optimize Dep` for `lucide-react` and `TypeError: Failed to fetch dynamically imported module` for the TanStack Start client entry. The server-rendered heading was still present. A later load in a new browser context had no console errors, no failed responses, and the situation submit control was present and disabled. The 504 was not reproduced in the production preview.

## Preserved gaps

- No staging environment, and none was invented.
- The rendered preview does not establish an activated otherness question, because displayed impact records do not carry explicit extent and support. Final choice still opens after that non-activated step. The activated fixture path remains in the existing otherness and final-choice tests, which passed inside `npm test`. This task did not add a rendered activation control.
- Refresh does not keep an in-progress journey. Persistence is outside this task.
- No hosting, public beta, analytics, accounts, or credentials.

## Discrepancies

- `npm run lint` exits 1 on starting `main` and on this head. Product files were not changed. Diagnostics: `app/src/lib/app-data/client.server.ts:214` empty block (error); `app/src/components/ui/button.tsx:48` react-refresh export warning; `app/src/lib/auth/use-current-user.ts:59` unused eslint-disable warning; `app/src/lib/smartphone/impact-pathways-ux.mjs:277` unused `AUTHORITY_REASONS` warning.
- The Vite optimizer 504 recurred on a cleared dev-server cache and did not recur on the next dev load or on any production-preview start.

## Result

- Durable Issue status was not written. This runtime has no native Issue-write action.
- Self-merge: NO
- Executor result: `VERIFIED_FOR_HQ_REVIEW`
