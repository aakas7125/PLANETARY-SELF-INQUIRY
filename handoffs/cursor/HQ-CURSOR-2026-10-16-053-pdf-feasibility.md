# HQ-CURSOR-2026-10-16-053 — privacy-first user-owned PDF feasibility

Task: `HQ-CURSOR-2026-10-16-053` / Issue #166 / cycle `INITIAL-1`.
Inspected tree: `origin/main` `a682f493379196eacdae61b13901eac20c551575`.
This report is a candidate technical handoff. It does not adopt an export, choose product copy, or authorize implementation.

Claim classes used below: **inspected** (source read in this run), **observed** (temporary local probe), **proposed** (not accepted), **unknown** (not established).

## 1. Current-state audit

The public phone journey is one client route, `app/src/routes/smartphone.tsx`, rendering `SmartphoneSituation`. Answers live in React `useReducer` / `useState` inside `app/src/components/smartphone-situation.tsx` (lines 73–86). No smartphone component calls `fetch`, `localStorage`, `sessionStorage`, or a server function (**inspected**). A reload returns the initial reducers. There is no answer history.

Only the active `step` is mounted (lines 268–392). At `choice`, earlier stages are not in the document. The parent still holds the reducers and still calls `describeSituation`, `describeComparison`, `describeImpact`, `projectGenericNewClimateConsequence`, `describeSystemParticipation`, `describeOtherness`, and `describeFinalChoice` before those returns (lines 87–113). An export can read that current memory. It cannot recover a stage after a clear, and it cannot know which `<details>` the person opened.

### Invalidation (**inspected**)

| Action | Effect in `smartphone-situation.tsx` |
| --- | --- |
| Situation `edit` or `reset` | Clears inquiry, comparison, impact, otherness, participation, and final choice; step returns to situation (lines 115–147). |
| Inquiry edits, including raw text, not-sure, provisional choice, shift, back, edit, reset | Clears comparison and everything after it (lines 150–195). |
| Comparison toggles, horizon, service facts, model identity, reset | Clears impact, participation, otherness, and final choice (lines 198–219). |
| Participation text, skip, or continue | Clears final choice (lines 222–233). |
| Otherness text | Clears final choice (lines 242–248). |
| Climate `consequenceBindingKey` changes while participation is bound | Clears participation, otherness, and final choice (lines 260–266). |

Cleared text is dropped. It is not reconstructed. Final-choice `reset` clears only the selection and leaves the stage open (`final-choice-ux.mjs` lines 231–232).

### Candidate items

Display authority is the text the relevant component renders. Producer objects that the screen does not render are not a second public record.

| Candidate item | Field / producer / display | At a completed choice | Loss / gap |
| --- | --- | --- | --- |
| Situation answers | `SituationState.answers`: `true` / `false` / `"unknown"` / `null`. Questions and “Not sure” label: `situation-ux.mjs` lines 41–93, 154–162. Result lines: `describeSituation`. | In memory if still submitted. Not on the choice screen. | `null` is unanswered. `"unknown"` is the explicit Not sure value. Edit/reset drops the submitted result. |
| Situation status | Produced by `evaluateAdequacyAndUnknownState` when the three answers are explicit (`situation-ux.mjs` lines 185–190). | Same memory. | Not stored as a separate history. Recomputed from current answers. |
| APQ1–APQ6 raw answers | `InquiryState.rawAnswers`, keyed by `getApInquirySequence()` (`ap-inquiry-ux.mjs` lines 154–166; wording in `ap-inquiry.mjs` lines 86–158). Review renders `exactAnswer` (`smartphone-inquiry.tsx` lines 179–185). | In memory. Not on the choice screen. | Stored without trimming. Blank and whitespace-only do not count as present (`ap-inquiry-ux.mjs` lines 149–151) but whitespace is still the stored string. Explicit uncertainty is the literal `I\u2019m not sure` (line 19), not no and not zero. `describeInquiry().domain` (lines 436–444) is not rendered. |
| Provisional Q6 choice and shift | `provisionalSelection`, `shiftSelection`. Public labels in `PROVISIONAL_CHOICE_LABELS` / `SHIFT_LABELS` (lines 45–63). | In memory. Choice screen shows the provisional label only (`final-choice-ux.mjs` lines 458–484). Shift is not repeated there. | `null` means not recorded. `uncertain` and `unclear` are explicit shift values. Provisional choice does not select the final option. |
| Comparison selection, horizon, service, repair, models | `ComparisonState` (`comparison-ux.mjs` lines 380–396). Screen shows labels, raw text, Not sure notes, and evaluated `publicLines`. | In memory. Not on the choice screen. Final choice lists inspected pathway labels only. | Raw horizon/service text is separate from a parsed number. Empty, zero, and unusable text stay null (lines 311–317, 327–328). Not sure is `UNKNOWN`, not zero. Used and refurbished stay distinct. |
| Comparison card evidence | `presentCard` returns `publicLines` and `sourcesAndLimits`, which `smartphone-comparison.tsx` renders (lines 426–437). | In memory when the comparison still evaluates. | The same object also carries `decision`, `evaluatorInputs` is on the view (line 1585), plus `rankingPermitted` and credit fields (lines 1303–1324). Those are not the rendered card. |
| Current-phone historical record | `currentOwnedHistory.lines` and `sourcesAndLimits` when an approved id matches (`comparison-ux.mjs` lines 1447–1464, 870–885). | In memory only if that id is still selected. | Optional. Unknown model is not a matched record. Historical production is not a prospective total. |
| Generic lifecycle guide | `describeLifecycleGuide()` (`lifecycle-presentation.mjs` lines 303–341). Rendered inside `<details>` on comparison and impact only (`smartphone-lifecycle.tsx` lines 11–52; mounted from `smartphone-comparison.tsx` line 98 and `smartphone-impact.tsx` line 66). | Not mounted at choice. The function can recompute the same static text. It does not read answers. | Open/closed disclosure state is not stored. Recomputing the guide does not mean the person opened it. Stage bodies and optional explainers can be in the DOM while closed. |
| Impact domains | `describeImpact` (`impact-pathways-ux.mjs` lines 822–876). The screen shows `heading`, `lines`, and disclosure lines (`smartphone-impact.tsx` lines 95–113). | In memory when impact is still open and comparison still evaluates. | A non-emitting domain shows a denial line, not a substitute quantity (`impact-pathways-ux.mjs` lines 570–582). Unknown is not zero. |
| Qualifying wider consequence | `projectGenericNewClimateConsequence` (`empirical-consequence.mjs` lines 300–326) only from the displayed generic-new climate basis. | In memory when that projection still returns a record. | Missing or non-generic bases return null. The record is not a second calculator. |
| QSP1–QSP3 | Raw strings plus `skipped` and `binding_key` (`system-participation-ux.mjs` lines 101–123, 329–347). Shown only when a complete climate record is bound. | In memory if still bound. Not mounted at choice unless that step is current. | Skipped, never opened, and empty text are different. A binding change clears the strings. Unbound describe output is empty even if a stale reducer existed before the clear. |
| Otherness | `response` and `followUp` (`ap-otherness-ux.mjs` lines 227–232, 536–546). The question is shown only when `buildOthernessInquiry` activates. | In memory. Final choice repeats the raw text only when `othernessActivated === true` (`final-choice-ux.mjs` lines 461–502). | Not activated is not absence and not confinement. The inactive describe path returns `response` and `followUpResponse` as empty strings (lines 477–487) and does not display reducer text. |
| Final choice | `opened` and `selection` (`final-choice-ux.mjs` lines 74, 197–198, 504–509). Seven unranked options. | This is the mounted screen when the step is `choice`. | `null` selection means no option chosen. It is not a recommendation. |

Source and version pins that are already display data, when present: model `sourcesAndLimits` (source id, year, provenance, manufacturer, boundary, configuration, use period, package provenance and commit); impact disclosure claim id, claim version, and source ids; climate consequence `claim_id`, `claim_version`, and `source_ids` `S1`, `S8`, `S9` (`empirical-consequence.mjs` lines 17–20, 266–286). Lifecycle explore links are static hrefs (`lifecycle-presentation.mjs` lines 40–67), not user answers.

## 2. Data-flow and privacy feasibility

**Inspected.** Accepted profile (`project-state/PUBLIC_BETA_PROFILE.md` lines 14–18): anonymous, no account, login, session, persistent user data, analytics, tracking, or non-essential cookies; no runtime xAI, OpenAlex, or Crossref. D-006 (decision log line 52) and D-007 keep device-only, deletion, and PDF claims out of the public promise. Feedback #157 is not implementation authority.

**Inspected path for a future export.** A control on the phone page could read the reducers and `describe*` results already in that component, build a document in the browser, and either open the print dialog or download a `Blob`. That read does not add a PSI store. The current route does not post answers.

**Not established.** This run did not execute the public-profile graph or the smartphone smoke. Those existing scripts assert empty cookie, `localStorage`, `sessionStorage`, and IndexedDB after a scripted journey. They were not re-run here. Browser cache, back-forward cache, downloaded-file lifetime, and OS print queues were not tested. No deletion claim follows.

**Inspected external links.** Lifecycle explainers are ordinary outbound hrefs. Following one is a user navigation. It is not evidence that PSI sends answers with that request.

**Observed limit of the probe environment.** Headless Chrome, while printing a local file, logged Google API registration errors. That process was not shown to be network-silent. That observation is about this headless browser, not about PSI and not about an ordinary print dialog.

**Proposed, not accepted.** Keep generation on the client and do not add an answer endpoint, account, database, or PSI-held file. Do not describe that proposal as verified device-only operation of the whole app.

## 3. Smallest technical options

`app/package.json` has no PDF library (**inspected**). None was added.

| | Browser print / Save as PDF | Hand-made client PDF with no new dependency | Existing headless `page.pdf` |
| --- | --- | --- | --- |
| What exists now | The user can print the mounted step. No export control exists. | No generator in the app. A standard-font PDF can encode WinAnsi, including U+2019 as byte `0x92`. It cannot encode the Devanagari and emoji used in the probe without an embedded font. | Playwright is a devDependency. It is not a browser download API. |
| User gesture | Print is a user gesture and a dialog. It is not an automatic download. | A `Blob` download is also a user gesture. Building a faithful PDF still needs a real encoder. | Not available to a visitor. |
| Literal text | Browsers can print Unicode. This run did not print the live PSI page. | Probe below: WinAnsi file kept the apostrophe bytes and omitted characters outside that encoding. | Probe below: headless Chrome embedded fonts and ToUnicode maps. |
| Pagination | Unknown for PSI. Current UI prints one step because the others are unmounted. Closed `<details>` are not a record of what was expanded. | A naive one-page content stream does not paginate long answers. | The probe file was one page and did not retain the full long Latin run. |
| Links | CSS may or may not print URLs. Unknown here. | Not probed as annotations. | The probe PDF contained a URI annotation and the visible label. |
| Network / storage | PSI code would not need a new request. The browser’s own print targets are outside PSI. | A local `Blob` needs no PSI request. It does not erase caches or the file the user saves. | Not evidence about ordinary browsers. |

**Proposed smallest later slice, not accepted.** One client-only print view, built from the current `describe*` display fields at a user gesture, then `window.print()`. No new dependency, no new store, no answer post. It must render from the public lines, labels, raw strings, and source disclosures, not from `decision`, `evaluatorInputs`, or `describeInquiry().domain`. It must keep unanswered, explicit Not sure, skipped, and inactive-otherness distinct. Static lifecycle text must be labelled as recomputed guide text. This proposal does not choose inclusion rules for closed disclosures or non-qualifying domains.

## 4. Synthetic feasibility check

Temporary files only, under `/tmp/psi-pdf-probe/`. Repository source was not used as the fixture. No real answers.

**Observed — WinAnsi file.** Python wrote `winansi.pdf` (528 bytes) with Helvetica and `/Encoding /WinAnsiEncoding`. The content stream contains byte `0x92` for U+2019 in `I’m not sure`, plus ASCII lines. The file does not contain UTF-8 for U+0905 or U+1F331. No font was embedded. Text extraction was the byte check only.

**Observed — headless Chrome.** Google Chrome `154.0.8037.92`, command `google-chrome --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer --print-to-pdf=...` on the local HTML file. Output `chrome.pdf` is 27355 bytes, `/Count 1`, and two `/Type /Page` entries of which one is `/Type /Pages`. Streams use embedded font subsets and ToUnicode CMaps. Decoding those maps recovered the curly apostrophe phrase, U+0905, U+1F331, the multiline lines, the skipped/unanswered marker sentences, 40 Devanagari `क` characters, the visible link label, and a Latin `x` run. The fixture asked for 1800 `x` characters; the content stream contains 126 `005B` glyph codes. `LONG-FAKE` was split across text-showing operators. `example.invalid/source-pin` is present as a URI annotation, not as extracted visible text.

**Limits.** No `pdftotext`. Extraction used the PDF’s own ToUnicode maps, not a visual screenshot. One headless print does not prove an ordinary browser offers an automatic download, that every PSI field fits, or that long answers paginate. The Chrome process logged external registration errors. The probe did not render `/smartphone`.

## 5. Prerequisites and questions

**Proposed next implementation slice, if HQ later authorizes one.** Add a print view to the existing phone page that reads current display views only, at a user gesture, with no library, no persistence, and no server post. Do not build it from this report.

**Technical questions.** Whether Save as PDF is enough or a downloaded file is required. How long raw answers, closed disclosures, and multi-page layout should behave. Those answers are not decided here.

**Research / AP questions.** Whether a later artifact should repeat denial lines for domains that are not established, and whether the static lifecycle guide belongs in it when the open/closed state was not recorded. This report does not write that wording or those gates.

**Owner questions.** Whether a browser print dialog meets the wish to possess the reflection, and whether any public privacy sentence may mention export. No such sentence is authorized now.

Preserved gaps: no live journey was replayed; storage assertions in existing smokes were not re-run; downloaded-file and cache lifetime are unknown; headless pagination lost part of the long Latin run.
