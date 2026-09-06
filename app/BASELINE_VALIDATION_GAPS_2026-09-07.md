# Candidate Baseline Validation Gaps — 2026-09-07

Task: `HQ-LC-2026-09-06-005` (Issue #21)  
Baseline: `origin/substitute` merge commit `c39de81cd6615713b00c7f60bac92e6343afd412`

## Authoritative fixture search

The complete reachable repository history was searched for the exact required paths:

- `app/.grok/skills/og/SKILL.md`
- `app/.grok/skills/og/references/`

No matching object or path exists in any reachable commit, and the current baseline contains only `app/.grok/app-env.json`. No authoritative project artifact was available in this task context. The missing fixture bytes and reference recipes are therefore unrecoverable here and are not reconstructed.

## Symlink environment check

An isolated local symlink probe failed with `Administrator privilege required for this operation.` The two symlink tests are host-limited, not application failures. A supported rerun requires a Windows environment where the executing account has symbolic-link creation permission, such as an elevated administrator session or a system with Developer Mode enabled and policy permitting unprivileged symlink creation. No security restriction was bypassed.

## Final six-failure disposition

| Failing assertions | Status | Required next input |
| --- | --- | --- |
| Three `brand-check.test.mjs` assertions reading `.grok/skills/og/SKILL.md` | External-fixture blocker | Original authoritative `SKILL.md` bytes and provenance |
| `write-atomic.test.mjs` assertion reading `.grok/skills/og/references` | External-fixture blocker | Original authoritative reference-fixture bytes and provenance |
| `check-auth-invariant.test.mjs` symlink case | Environment limitation | Rerun on symlink-capable Windows environment |
| `with-app-env.test.mjs` symlink case | Environment limitation | Rerun on symlink-capable Windows environment |

## Validation

After `npm ci --ignore-scripts`:

- `npm test`: 189 passed, 6 failed, 195 total; all six failures are listed above.
- `npm run typecheck`: passed.
- `npm run build`: passed; `DATABASE_URL` was unset, so the migration step reported the documented skip.

The baseline is **not mechanically safe to propose for import** while these failures remain unresolved. This record makes no application, canonical-contract, AP, empirical, V17, source-package, or UI change; it only qualifies the remaining validation gaps.
