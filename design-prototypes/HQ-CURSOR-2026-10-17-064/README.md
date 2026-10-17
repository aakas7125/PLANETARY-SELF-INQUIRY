# HQ-CURSOR-2026-10-17-064 — isolated R3 lifecycle-guide prototype

Prototype only. The production app (`app/**`) is untouched and does not import anything here.

- **Control:** the actual accepted `SmartphoneLifecycleGuide` (`app/src/components/smartphone-lifecycle.tsx`), imported read-only and rendered as-is.
- **Candidate:** `src/CandidateGuide.tsx`. Same `describeLifecycleGuide()` output, same disclosure markup per stage. Layout only: one neutral vertical reading rail (stages 1–8, always one column), plus a visual bracket around stages 1–4. The bracket label reuses the existing `guide.production.heading` string and is `aria-hidden` (no new copy; the group is visual only, the `<ol>` still has 8 items).
- `src/stage-glyph.tsx` is a verbatim copy of the unexported `StageGlyph`; `verify-parity.mjs` asserts the rendered SVG parity.
- Harness page: guide section only inside a `max-w-2xl` main wrapper that approximates the comparison page container. It has no sticky header, no comparison form and no real route.

## Reproduce (offline once `app` dependencies are installed with `npm ci` in `app/`)

```bash
cd design-prototypes/HQ-CURSOR-2026-10-17-064
node build.mjs                 # vite build of control.html + candidate.html into ./dist (not committed)
node verify-parity.mjs         # content/DOM/link/order parity, preview counts 0/0/0/0/3/5/1/0
node render-probe.mjs          # 390/1280/320/640 metrics, keyboard, anchor; add --frames <dir> to write PNG frames
```

Chrome is expected at `/opt/google/chrome/chrome` (override with `CHROME_PATH`). Playwright is taken from `app/node_modules`.

## Limits

Control is the real component rendered with real Tailwind output; candidate is a separate component with copied panel markup. No screen-reader, native browser zoom, WCAG or comprehension testing was done. The 640 px viewport is a layout-width proxy for 200% zoom on 1280, not native zoom.
