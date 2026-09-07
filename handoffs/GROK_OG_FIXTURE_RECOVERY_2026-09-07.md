# Grok OG Fixture Recovery — 2026-09-07

Task: `HQ-LC-2026-09-07-002` (Issue #26)

## Verified source

- Repository: `aakas7125/drift-acre-cabin-marble`
- Commit: `590e2e937fe2dadafe196a114e023ebb05842f52`
- Candidate: PR #25 head `3f00a0c558cf41e9647706f053fd848d487150bf`
- Canonical target observed: `origin/main` `77622dca5b2f74ed9e23ee7f5d95ee16820b7c9d`

The following source bytes were copied verbatim into `app/` for the existing assertions. Git blobs and independently checked SHA-256 values are recorded here; no text was normalized or reconstructed.

| Destination path | Source blob | SHA-256 |
| --- | --- | --- |
| `app/.grok/skills/og/SKILL.md` | `ee7894c0a7e8301878896d18be8416faf609c8e8` | `59273bc027715cf0ba69493235a16980b26f719d59aea1a881526ef4d6a462ef` |
| `app/.grok/skills/og/references/brand-pass.md` | `14a096176c10efb2cc3c9e88e91fcd2cc7fc0df3` | `587bfe2b7373eb622966639e47bf99bef12c05b92c71d0276f3256e241b05ec4` |
| `app/.grok/skills/og/references/custom-card.md` | `6fdcf98c3465c1b3dca706c2451f201ec1223a92` | `1a01e1042e0d3e32ef0fe368f1fdccda800fb75027fa83bf9ea30c602a322826` |
| `app/.grok/skills/og/references/x-banner.md` | `a070fd474925641ede93a471c52a561e279a1bf0` | `10c33ef6179731ccbb3ae462fb1b7003ab63150b6ede37fc0858423ddc4acbc4` |
| `app/.grok/skills/og/references/favicon-and-icons.md` | `e6d324534f9cdc7d0fc24c75c405aa89306d745d` | `ef4d6dc934fc78b245eb5061017ee2afb7bd68874f260ea43409b27b93bbb5de` |
| `app/.grok/skills/og/references/og-type-contract.md` | `7fbb98d58981ff79277e8ddbccb2b938d15efba6` | `73bc364d342176c0957a4eec9ed4a48e74ba68e7676e4f401bd05111ed6d15a3` |
| `app/.grok/skills/og/references/placeholder-card.md` | `6aecb32e71fb0bab03141cd83832506018666e14` | `cc39bd34720be38424b023ee72a54e1e4043f6e8fd30bf4efb7fcd56c227145b` |
| `app/AGENTS.md` | `42f64627fa178f74fb0a3716b7e08a2db564fbb8` | verified against source during test setup |

`app/AGENTS.md` is included because the three existing `brand-check` assertions explicitly read it alongside the listed `SKILL.md`; it is copied from the same pinned source commit and is not treated as task instructions.

## Validation result

With the verified files present at their expected paths:

- the three `brand-check.test.mjs` fixture assertions passed;
- the `write-atomic.test.mjs` reference-fixture assertion passed;
- `npm test` changed from 189 pass / 6 fail to **193 pass / 2 fail / 195 total**;
- `npm run typecheck` passed;
- `npm run build` passed.

The remaining two failures are unchanged Windows `EPERM` symlink-creation limitations in `check-auth-invariant.test.mjs` and `with-app-env.test.mjs`. They require a symlink-capable Windows environment, remain separate from fixture recovery, and are neither skipped nor waived.

This follow-up changes only the recovered external fixtures, the corresponding required `AGENTS.md`, and this provenance record. It makes no AP, empirical, V17, source-package, UI-semantic, or smartphone-behavior change.
