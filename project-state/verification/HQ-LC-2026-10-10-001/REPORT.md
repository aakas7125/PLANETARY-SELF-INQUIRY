# Journey PR #77 exact-head verification evidence

- Task ID: `HQ-LC-2026-10-10-001`
- Evidence cycle: `HQ-LC-81-EVIDENCE-PUBLICATION-1`
- Verified PR: [#77](https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/pull/77)
- Governing implementation issue: [#76](https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues/76)
- Exact verified head: `598dcdfa976f39cd150b5a534a741a31289a8ea4`
- Evidence branch base: `ce848e16a374c542c6470e5303af7d1fc114be9a`

## Capture manifest

The images were captured during the completed exact-head local verification and
reused unchanged for this publication cycle. They were captured with the
repository's installed Playwright browser against the local app at the verified
head.

| File | Viewport and state | SHA-256 |
| --- | --- | --- |
| `home-mobile.png` | 390 × 900 home state; Journey navigation reachable | `7E6F02263D30C2FFCAD6E26488D4B32653E4E543D379898D41F10FCEC7B90BF0` |
| `journey-mobile.png` | 390 × 900 Journey state; record disclosures closed | `AADFD449ABAFA57034821E6453FD66DA83F57D2500AD5EA66E34333BFC831763` |
| `journey-desktop.png` | 1280 × 900 Journey state; record disclosures closed | `FB2416E2962D7E862CC2C83E99398FD6BADF694ED0238D7ED560F8CF5A50B1B4` |

## Locked validation record

| Item | Result |
| --- | --- |
| Install | `npm ci --ignore-scripts` — exit 0 |
| Test | `npm test` — exit 0; script stage 327 pass, 2 explicit TODO, 0 fail; TypeScript stage 50/50 pass |
| Typecheck | `npm run typecheck` — exit 0 before and after build |
| Build | `npm run build` — exit 0; database migration skipped because `DATABASE_URL` was unset and the PGLite fallback self-migrates |
| Runtime | Node `v24.20.0`; npm `11.19.0`; TypeScript `5.9.3` |
| Lockfile | `app/package-lock.json` SHA-256 `EA1EAE0509C78049BB8022CAE735744EF01179FA2603F091A9B587A0A24FFFB8` |

The build produced only normal disposable-worktree output: `.vercel/` and an
unstaged `app/src/routeTree.gen.ts` regeneration. Neither was staged,
committed, or included in this evidence branch.

## Browser observations

- At 390 px and 1280 px, document scroll width equaled client width.
- The 390 px home page exposed one `/journey` link; the mobile capture records
  the reachable Journey navigation state.
- Eleven native record disclosures rendered closed by default on both Journey
  captures.
- The Journey page rendered `header`, `nav`, and `main` landmarks; its
  empirical-separation notice was visible.
- Keyboard traversal reached navigation links and each disclosure summary with
  a visible automatic outline.
- No browser console errors or warnings were observed.
- The captured Journey diagrams retain the reviewed visual topology for HQ's
  independent inspection: branching, parallel lanes, and convergence are shown
  in the attached mobile and desktop evidence rather than inferred from tests.

## Scope confirmation

This evidence-only branch adds only this report and the three listed PNG files.
PR #77, its branch, and Journey/application source were not changed, pushed to,
or merged by this verification.
