# Usability review and human reviewer guide — HQ-CURSOR-2026-10-16-054

Executor walkthrough and a guide for a later voluntary person. This is not a completed human comprehension study. No participant was recruited, contacted, or recorded. No app, contract, or copy change is proposed as accepted.

## 1. Coverage and provenance

| Item | Record |
| --- | --- |
| Date | 2026-10-16 |
| Reviewed tree | `origin/main` `24c061081f031b378edc687cfbd77605689b3798`. The Issue also names ancestor `024811a95f2ee9c6478e0725e09b0b98ab3a0e28`. The only commit between them is the queue note that routed this task. |
| Built profile | Local public profile from that app tree. `corepack npm@11.19.0 ci --ignore-scripts` then `npm run build`, both exit 0. Node `v22.14.0`. Lock SHA-256 `104703239f43470938d2c8f57e6996f0b9be51ee38e8db897ea22c826cd83188`, unchanged. |
| URL | `http://127.0.0.1:8081` (`HOST=127.0.0.1`, `PORT=8081`, `npm run start`). |
| Public deployment | Not checked. `RENDER_FREE_DOCKER.md` and `PUBLIC_BETA_PROFILE.md` do not name a live domain. No deployment was equated to a Git SHA. |
| Visible version | The rendered pages do not show a Git SHA. Build identity is the local tree above. |
| Browser | Headless Google Chrome `154.0.8037.92` via Playwright. |
| Viewports | 390×844 and 1280×800. |
| Language | English smartphone journey. Constitution English, `?lang=de`, and `?lang=zz`. |
| Routes | `/smartphone`, `/constitution`, `/constitution?lang=de`, `/constitution?lang=zz`. |
| Completion | Adequate generic-new path reached user choice and stopped with no option selected. Keep-only path reached the otherness stage. Constitution showed all six scenes in English and German. |

Repository-wide `npm test`, lint, and typecheck were not rerun. The accepted app was not modified. Routine CI does not run for a handoff-only pull request.

## 2. Observed walkthrough

Synthetic fixture only. These are not a person’s answers.

**Unanswered, Not sure, and reset (390).** With no situation answer, “See situation status” stayed disabled. All three “Not sure” answers enabled it. Status was “Unclear / unknown”, each fact read “Not sure”, and keep-as-is feasibility stayed unknown. Reset left no radio selected.

**Adequate English path (390 and 1280).** Situation: Yes, Yes, Yes. Status “Adequate”; keep-as-is feasible; boundary says this is not a purchase recommendation.

Inquiry, one question at a time:

1. `Fixture:  hear a call. ` (two spaces after the colon, trailing space)
2. `Fixture: no further change is named.`
3. `Fixture: no time is named.`
4. “I’m not sure” (U+2019)
5. `Fixture: no difficulty is named.`
6. `Fixture: nothing looks settled.` Choice “Investigate further”. Shift “Uncertain”.

On question 6, “Your answers so far” showed questions 1–5 as literal text, including the double space, trailing space, and “I’m not sure”. Review showed the same answers. No generated summary, motive line, or score was on that view.

Comparison: used/second-hand, refurbished, and new checked; keep and repair unchecked. Horizon `4`. Current phone and new candidate both “I don't know / use generic smartphone evidence”. Remaining service `2.50`. Used service `2`. Refurbished service `3`. Horizon `nope` showed “This horizon cannot be used” before it was replaced with `4`.

Results kept used and refurbished distinct. Used service was 2 years and was not copied from the horizon. Refurbished footprint stayed unknown, with no generic stand-in. New production was `25–70 kg CO2e` and distribution `2–4`, both labelled generic fallback and not an average. The page said the comparison does not say what to buy and does not rank pathways. The optional lifecycle guide described generic stages and said it does not replace entered facts.

Impact listed the three inspected alternatives and said choosing one does not prove or avoid a pathway. Climate showed the conditional manufacturing statement, tied to generic new-phone evidence, and said it is not proof of harm from this phone or a final choice. Mining and e-waste pathways were “not shown” and were not filled in. Water stayed conditional. Unknown transfer, process, fate, water quantity, and material demand were stated as unknown, not zero. Open “Sources and limits” on climate named claim `SP-PATH-CLIMATE-001`, sources S1, S8, and S9, and said the relationship is not one score and not proof of a cause.

“Reflect on your relationship with the wider system” opened three optional project-interpretation questions, labelled as separate from the evidence and not a direct statement from Acharya Prashant. “Continue to Protect My Four” was visible before any reflection text was entered; that empty continuation was not pressed. Text `Fixture reflection.  ` survived “Back to evidence” and a return to the reflection. “Skip this reflection” then opened the otherness question. The question was shown. Its boundary said nothing ranks the words, diagnoses a motive, or tells the person what to buy.

User choice: provisional inquiry choice “Investigate further”, with the note that it does not select an option here. Inspected pathways were listed and described as not a selection or ranking. The otherness question was recorded as shown. All seven options were present and none was selected, including “Buy a new phone”, despite that comparison checkbox being checked. “Buying a new phone is an ordinary choice, not a failed inquiry. Unclear is a valid choice.” No option was selected in this walk.

The same adequate path at 1280 ended with the same unchecked user-choice radios. Skip was used from the impact stage rather than opening the reflection again.

**Keep-only branch (390).** Adequate situation, then only “Keep the current phone”, horizon `4`, remaining service `2.50`, generic current phone. Impact showed climate as not shown. “Reflect…” was absent. The onward control was “Continue to Protect Four and otherness inquiry”. Otherness said the inquiry is not open, and that this is not a finding that effects are absent or that they stay with the person and the people closest to them. “Continue to user choice” was present. This branch stopped there.

**Constitution.** English `/constitution`: six scenes, content language `en`, “Back to home”, English and “Deutsch (Pilot)” links. Privacy qualifications rendered before the accountability heading. The public-tracker warning (“GitHub issues are public…”) rendered before the tracker sentence. The link text was “public project issue tracker” and the href was `https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues`. Source links were the Project Constitution, the English public-copy handoff, and the public beta profile. The link was not followed and no issue was submitted.

`/constitution?lang=de`: six German scene titles, content container `lang=de`. The document element stayed `lang=en`. Site navigation stayed English. The German tracker link text was “öffentlichen Issue-Tracker des Projekts” with the same issues href. “GitHub-Issues sind öffentlich…” was visible in the accountability section. This walk does not certify the German wording.

`/constitution?lang=zz`: the URL kept `lang=zz` and the page stayed the English six-scene document.

**Checks.** Horizontal overflow was 0 on the recorded 390 and 1280 frames (`scrollWidth` equalled `clientWidth`). No page errors, console errors, or HTTP failures on these walks. Cookie, `localStorage`, and `sessionStorage` were empty after the 390 adequate path. The first eight Tab stops were the header links. Their focus ring was a 2px green ring. In-page buttons and radios were not separately tabbed. A programmatic focus on the disabled-capable submit button did not show that ring; the button style is `focus-visible`, so that check is not a keyboard result.

## 3. Prioritized findings

| ID | Screen / action | Expected accepted behavior | Observation | Evidence | Impact | Confidence | Routing |
| --- | --- | --- | --- | --- | --- | --- | --- |
| U-01 | Comparison legend; final “Your choice” radios | Selecting alternatives is not the final decision. Used/second-hand stays distinct from refurbished. | Helper text says the decision is recorded later. Used and refurbished stayed separate. Final radios stayed unselected after those boxes were checked. | `INITIAL-1-390-comparison.png`, `INITIAL-1-1280-comparison.png`, `INITIAL-1-390-final-choice.png`, `INITIAL-1-1280-final-choice.png` | None observed | High for this fixture | No action |
| U-02 | Generic model and climate card | Absence of an exact model can use labelled generic evidence. Model identity is not adequacy or motive. Climate stays conditional. | Both model controls used the generic label. New production stayed 25–70 and was not repeated as a cause. Climate sources named S1/S8/S9 and denied a single score. | `INITIAL-1-390-impact-climate.png`; extracted comparison and sources text | None observed | High for this fixture | No action |
| U-03 | Question 6 prior answers; situation Not sure / unanswered / reset | Literal prior text. Unknown, unanswered, and Not sure stay distinct. | Unanswered submit stayed disabled. Not sure produced “Unclear / unknown”. Prior answers kept the typed spacing and “I’m not sure”. | `INITIAL-1-390-q6-prior.png` | None observed | High for this fixture | No action |
| U-04 | Optional reflection, skip, otherness, final choice | Reflection is optional. Skip still reaches the later inquiry. Final choice is not preselected. New, investigate, and unclear remain legitimate labels. | Skip opened the otherness question on the generic-new path. Keep-only did not offer the reflection and did not open that question. Provisional “Investigate further” did not check a final radio. | `INITIAL-1-390-qsp.png`, `INITIAL-1-390-keep-only.png`, `INITIAL-1-390-final-choice.png` | None observed | High for the paths walked | No action |
| U-05 | Scrolled sticky header on Constitution | Header should remain readable. No accepted rule was found that forbids a translucent bar. | After scrolling to privacy, earlier paragraph text remained visible through the sticky header (`bg-background/70` until scroll, then `/92`, with blur). | `INITIAL-1-390-constitution-privacy.png`, `INITIAL-1-1280-constitution-de-privacy.png`; `app/src/components/site-nav.tsx` | Header labels can visually mix with the text underneath. Not measured as a contrast failure. | Medium. Seen on these scrolled frames; not a user report. | Heuristic clarity concern. Needs a person if HQ wants to know whether it interferes. Not treated here as a contract defect. |
| U-06 | Stage list | Progress, back, edit, and reset should not imply a hidden jump or a lost answer without a control. | The six stage rows are status text, not links. Situation Edit/Reset and later Back controls were present. Reset cleared the radios. Reflection text survived Back. Upstream loss after an edit past comparison was not replayed. | Stage rows in the 390 frames | Unknown whether people can tell the rows are not navigation. | Medium for the control type; low for comprehension | Heuristic question for a person. No contradiction observed. |
| U-07 | German Constitution | Adopted pilot, page-local, English canonical, no certification. | Six scenes, German content language, English fallback for `lang=zz`, English site nav, same tracker href, warning visible. | `INITIAL-1-1280-constitution-de-privacy.png` | None observed against those checks | High for rendering; none for translation quality | No action from this walk. Professional or native review was not done. |

No new reproducible contradiction with the accepted behavior above was observed. Empty “Continue to Protect My Four”, keyboard operation of in-page radios, and a full upstream-edit invalidation replay were not evaluated. #148 was not used as evidence of a current defect.

## 4. Human reviewer guide

The notes in brackets are for HQ triage. Do not show the bracketed notes to the reviewer.

**What this is.** A voluntary first look of about 10–15 minutes. You can stop at any time. You can say you are unsure or that you disagree. There is no right answer and no score.

**Phone facts you can use.** If you prefer not to use your own phone, use this fictional one: it still makes calls, the speaker crackles, you do not know the model, and you do not know how long it will stay adequate. You may ignore that fiction and speak generally instead.

**Please try the phone inquiry and then say, in your own words:**

1. What did you think you were being asked to do?
2. Where, if anywhere, did you choose phones to look at side by side? Where, if anywhere, did you make a final choice? Did those feel like the same step or different steps? [Triage: comparison selection versus user choice. Do not tell the reviewer which one is “correct”.]
3. What did the pages say about a used or second-hand phone compared with a refurbished phone, and about not knowing the exact model? [Triage: distinct pathways and labelled generic evidence. Do not ask which is better.]
4. What did you take the numbers, ranges, and “not shown” pathways to mean? What still seemed unknown? [Triage: model-specific versus generic, conditional versus individual harm. Record their words; do not correct them during the session.]
5. What, if anything, felt like evidence, and what felt like a reflective or project question? [Triage: empirical record versus AP/project inquiry, including the optional wider-system reflection.]
6. Who did you think makes the final choice? What choices seemed allowed? [Triage: user-owned choice, including new, investigate, and unclear. Do not ask them to pick one.]
7. Open Principles. What promises do you think the page is making, and what can you do if something seems wrong? You do not need to send anything. [Triage: privacy limits, public-tracker warning, no automatic authority of feedback.]
8. Was any text hard to read, covered, cut off, or easy to mistake for a button? About how wide was the screen? [Triage: only if they mention the header, stage rows, or wrapping.]

**Optional, only if you can read German.** Open the Deutsch (Pilot) link on Principles and say whether the German was understandable to you. The phone inquiry itself is not expected to be in German. [Triage: this is not a certification.]

**Please do not send** your name, contact details, religious identity, or a recording. If you used your own phone, you do not need to include those private answers; a paraphrase of what was confusing is enough.

## 5. Feedback template and next routing

Use one anonymous code per returned review, such as `R-01`. Store any original private message outside GitHub. Commit or publish only a paraphrase.

| Field | Entry |
| --- | --- |
| Reviewer code |  |
| Date |  |
| URL reviewed, or unknown |  |
| Visible version, or unknown |  |
| Device and language |  |
| Stages actually completed |  |
| Stopped early, first impression, or full flow |  |
| Paraphrase of what they said, with the screen |  |
| Their suggestion, separate from HQ’s reading |  |
| Privacy / attribution | No name, contact, religious identity, raw private answers, correspondence, or recording in the public artifact |
| Unresolved limits |  |

Feedback may trigger investigation. It does not grant scientific, AP, product, or execution authority.

**This cycle.** No human review has been done. Preparing this guide does not mean a participant exists.

**Smallest next step.** HQ reviews this report and the frames. If a person is invited later, that is a separate owner-controlled step; this task does not contact anyone. U-05 and U-06 are questions for that person or for an owner product look, not authorized fixes. No new Issue was opened.
