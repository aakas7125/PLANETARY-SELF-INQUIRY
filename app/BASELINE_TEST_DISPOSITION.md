# Candidate Baseline Test Disposition

Task: `HQ-LC-2026-09-06-004` (Issue #19)
Candidate: `origin/substitute` `4ba18df8fc86f34d27ec65f1012959fb4c4425a2`

## Reproduction

After `npm ci --ignore-scripts`, the baseline command initially reported 181 passing and 14 failing tests of 195. `npm run typecheck` and `npm run build` passed.

## Individual failure disposition

| Initial failures | Classification | Disposition |
| --- | --- | --- |
| `grok-pwa-plugin.test.mjs`: platform chrome / OG title | Stale test context | Repaired: test now supplies an empty isolated workspace, rather than accidentally reading this app's committed `Protect Four` OG identity. |
| `grok-pwa-plugin.test.mjs`: published host title fallback | Stale test context | Repaired with the same isolated-workspace context. |
| `grok-pwa-plugin.test.mjs`: public-host placeholder card | Stale test context | Repaired with the same isolated-workspace context. |
| `grok-pwa-plugin.test.mjs`: placeholder card colour | Stale test context | Repaired with the same isolated-workspace context. |
| `grok-pwa-plugin.test.mjs`: HTML entity title | Stale test context | Repaired with the same isolated-workspace context. |
| `grok-pwa-plugin.test.mjs`: no-head insertion | Stale test context | Repaired with the same isolated-workspace context. |
| `grok-pwa-plugin.test.mjs`: uppercase `</HEAD>` streaming | Stale test context | Repaired with the same isolated-workspace context. |
| `grok-pwa-plugin.test.mjs`: injected app name | Stale test context | Repaired with the same isolated-workspace context. |
| Three `brand-check.test.mjs` documentation assertions | Missing external fixture | Remains failing. The committed candidate lacks `.grok/skills/og/SKILL.md`; its content must not be invented. |
| `write-atomic.test.mjs` OG skill recipe assertion | Missing external fixture | Remains failing. The committed candidate lacks `.grok/skills/og/references`; their recipes must not be invented. |
| `check-auth-invariant.test.mjs` symlink case | Host limitation | Remains failing on this Windows host: `symlinkSync` returns `EPERM`. The test and security behavior are retained. |
| `with-app-env.test.mjs` symlink case | Host limitation | Remains failing on this Windows host: `symlinkSync` returns `EPERM`. The test and security behavior are retained. |

The eight repaired cases were unit-test isolation defects, not PWA/product behavior changes: the default helper consulted the repository's real `src/lib/og/site.json` and public share card, while the cases asserted generic fallback behavior. The repair makes the test context explicit and continues to test the documented fallback paths.

## Current result and next decision

`npm test` after the repair: **189 passing, 6 failing, 195 total**. No tests were deleted, broadly skipped, or weakened. The remaining six failures require either the original external Grok fixture bytes or a supported Windows/Developer-Mode symlink-capable environment. They are not waived.

No canonical import, inquiry/UI behavior, AP semantics, empirical semantics, source package, contract, or security-boundary change is made by this branch.
