# Antigravity Integration Audit

Audit date: 2026-09-05  
Task: LOCAL-ANTIGRAVITY-INTAKE-001  
Method: static inspection of the complete repository excluding installed dependencies and generated build output; local test, lint, and production-build execution. No live browser, assistive-technology, external-source, or network verification was performed.

## Candidate repository

- Branch: `main`
- Commit: `4e85402b012b29f126e9cf1f534becc0d6ae4009`
- Origin: `https://github.com/Dvaghani/PLANETARY-SELF-INQUIRY.git`
- Upstream state at audit: `main` aligned with `origin/main`
- Existing branches: local `main`; remote `origin/main`
- Existing tags: none
- Working tree: application source clean; untracked LOCAL-BOOTSTRAP-001 governance scaffold present
- Candidate status: external/generated candidate implementation, not an accepted V17 baseline

## Repository and runtime inventory

- Stack: React 19, TypeScript 6, Vite 8, vanilla CSS, Lucide React.
- Package manager: npm, with `package-lock.json`.
- Build and quality tools: TypeScript project references, Vite, Vitest, oxlint.
- Application structure: one client-rendered page; four stages are conditionally rendered from `App.tsx`. There is no URL router or route-level persistence.
- Main components: header/demo selector, four-stage progress navigation, Situation, AP inquiry/reflection, five pathway cards, evidence and method drawers, planetary pathway, Protect My Four, final choice/dossier.
- Data/model files: device registry, electricity factors, empirical evidence records, AP corpus, location risks, demo cases, adequacy logic, reflection engine, and climate calculation engine.
- State and storage: React memory only. Restart clears state. The browser print dialog supports PDF output. No local storage, session storage, cookies, IndexedDB, backend, analytics, geolocation, API, or AI calls were found.
- Network/external services: no runtime data API was found. `index.html` contains preconnect hints to Google Fonts, but no font stylesheet import was found. Evidence links open external source pages only after user activation.
- Maps/globes: no geographic map, globe library, coordinates, geospatial calculations, or rendered map was found. The planetary experience is a styled causal-flow diagram plus country-level person cards.
- Animation: CSS fade-in and drawer slide transitions, hover/transform effects, smooth scrolling, and a defined pulse animation. A global `prefers-reduced-motion` override is present.
- Responsive implementation: flexible grids, wrapping controls, and breakpoints at 640 px, 768 px, and 1024 px. No browser/device test suite is present locally.
- Deployment: no deployment-provider configuration, CI workflow, container, service worker, or hosting manifest was found.
- Environment/secrets: no `.env` files, environment-variable reads, tokens, or secret references were found.
- Tests: 30 scientific invariants and three reflection tests across two Vitest files. All 33 passed locally. No component, browser, accessibility, visual-regression, privacy, or performance tests were found.
- Build: production build passed. Lint completed without errors and reported pre-existing unused-code warnings. The built JavaScript was approximately 319 kB before gzip and 98 kB gzip.

## Governance bootstrap status

LOCAL-BOOTSTRAP-001 appears structurally complete: the constitution, project state, changelog, contract placeholders, provenance scaffold, project-state records, evidence placeholders, canonical test directories, design records, and missing-artifact register are present. They are untracked at audit time. The authoritative empirical/AP packages and exact V17 snapshot remain absent, so the source-dependent contracts are correctly marked pending and the candidate cannot be called V17.

## Executive assessment

Antigravity produced a coherent, attractive, deterministic vertical slice with unusually strong intent around epistemic separation, explicit unknowns, inspectable evidence, pathway neutrality, and personal-to-planetary storytelling. Its most reusable contribution is the experience architecture: staged orientation, card-based choices, progressive technical disclosure, selectable physical pathways, a visible causal chain, and a user-owned conclusion.

It is not safe to adopt as project authority. The candidate assigns `approved` and `authoritative` status to locally embedded scientific and AP material without the governing source packages. It also begins with substantive user answers and location assumptions already selected, automatically uses a hard-coded grid factor, contains time-sensitive and unverified scientific records, and has accessibility and cognitive-load gaps. The best integration strategy is therefore to preserve the visual/interaction concepts while replacing authority-bearing data, defaults, AP semantics, and claims only through governed contract work.

Classification counts in this audit: **ADOPT 8; ADAPT 16; REJECT 0; REQUIRES_HQ_DECISION 3; REQUIRES_RESEARCH_DECISION 5; REQUIRES_AP_DECISION 2.** Each ID has one primary classification even where secondary reviews will also be needed.

## Features to ADOPT

### AG-001 — Four-stage experience architecture

**Why valuable:** Situation → Inquiry → Evidence → Choice gives the user a comprehensible top-level journey and a stable sense of progression.  
**Principle/contract check:** Compatible with separation of practical facts, AP inquiry, empirical consequences, and autonomous decision.  
**Integration notes:** Adopt the information architecture, not the candidate's current defaults, wording, or unrestricted navigation behavior.

### AG-002 — Visible epistemic categories and method disclosure

**Why valuable:** Science, AP Framework, and Project Interpretation are visually differentiated, while technical boundaries are moved into a method drawer.  
**Principle/contract check:** Directly supports constitutional epistemic separation and progressive disclosure.  
**Integration notes:** Keep the category system and drawer pattern. Authority labels and drawer claims must be supplied by verified contracts; see AG-017 and AG-028.

### AG-003 — Five distinct physical pathway cards

**Why valuable:** Keep, repair, used, refurbished, and new remain separate and simultaneously inspectable; climate, materials, water, and waste are not collapsed into one score.  
**Principle/contract check:** Strong match for neutrality, pathway distinction, and multi-domain separation.  
**Integration notes:** Adopt the comparison pattern and status vocabulary. Do not adopt numerical or qualitative content until research integration is complete.

### AG-004 — Explicit unknown and infeasible presentation

**Why valuable:** Cards visibly distinguish unknown, partial, quantified, and infeasible states and say that unknown is not zero.  
**Principle/contract check:** Strong match for uncertainty integrity.  
**Integration notes:** Retain the visual state treatment and plain refusal to invent a number. Verify every status assignment against canonical contracts.

### AG-005 — Evidence-dossier interaction pattern

**Why valuable:** A drawer can expose claim, scope, conditions, assumptions, uncertainty, limitations, and source links without overloading the main pathway cards.  
**Principle/contract check:** Strong match for inspectable provenance and progressive disclosure.  
**Integration notes:** Adopt the schema and interaction pattern. Populate only from the canonical registries; never silently fall back to an unrelated record.

### AG-006 — Raw-answer and personal-rationale capture

**Why valuable:** Textareas are controlled by user-owned state, and the final rationale is retained verbatim in memory for the session.  
**Principle/contract check:** Supports raw answers as authoritative and final choice as the user's.  
**Integration notes:** Preserve exact answers in the canonical record and fix dossier truncation under AG-020.

### AG-007 — Seven neutral final-choice options

**Why valuable:** Keep, repair, used, refurbished, new, investigate further, and still unclear are presented without ranking, and the user must select the final choice.  
**Principle/contract check:** Directly supports decision neutrality, legitimate uncertainty, and autonomy.  
**Integration notes:** Retain option parity and the closing statement that the conclusion remains the user's.

### AG-008 — Client-side deterministic and low-infrastructure architecture

**Why valuable:** Calculations and reflections run locally with no observed telemetry, backend, AI call, account, or persistent personal-data store.  
**Principle/contract check:** Supports privacy and preference for deterministic computation and low resource cost.  
**Integration notes:** Preserve as the default architecture. Any later persistence, analytics, external data, or AI proposal requires explicit review.

## Features to ADAPT

### AG-009 — Initial application state

**Value to preserve:** A populated state makes demos immediately explorable.  
**Problem:** The ordinary app starts with material assertions already selected: generic phone, no problem, safe, meets needs, security supported, repair available, 1–2 year horizon, Germany charging, and drawer storage. Case A is also selected. A user can proceed without supplying these facts. This risks treating candidate defaults as raw user answers and silently applying a location factor.  
**Required adaptation:** Separate a clearly marked demo mode from a blank production intake. Initialize ordinary answers as unanswered/unknown and require an affirmative user choice only where necessary.  
**Authority required:** Input-model contract plus HQ decision on demo presentation.

### AG-010 — Situation questionnaire presentation

**Value to preserve:** It asks practical, user-knowable questions and includes explicit “not sure” choices.  
**Problem:** The page exposes many large cards and technical descriptions at once. Terms such as mainboard/circuitry, security support, adequate service horizon, grid carbon intensity, and retirement fate remain demanding. Number labels are inconsistent in comments/UI structure, and no per-question progressive reveal reduces the perceived length.  
**Required adaptation:** Preserve required distinctions but use short plain-language prompts, contextual explanations, one-topic-at-a-time disclosure, and a review screen. Avoid asking users to validate technical evidence parameters.  
**Authority required:** Input-model contract and governed UX testing.

### AG-011 — Progress navigation and completion state

**Value to preserve:** The stepper provides strong orientation and lets users revisit earlier material.  
**Problem:** Any stage can be opened at any time, including Evidence and Choice before inputs or reflection are complete. “Completed” only records button clicks and is not invalidated when prior answers change.  
**Required adaptation:** Define governed prerequisites, permit safe back-navigation, invalidate dependent results after upstream edits, and communicate status accessibly without coercive completion gating.  
**Authority required:** Input-model and product-flow decisions.

### AG-012 — Service-horizon handling

**Value to preserve:** “I don't know” is present, ranges are retained, and age does not derive remaining life.  
**Problem:** Fixed choices silently map “under 6 months” to 0.25–0.5 years and “3+ years” to 3–5 years. Keep and repair charging calculations use the minimum horizon when `minYears` is present, while displayed comparison horizons remain ranges. The initial 1–2 year answer is preselected.  
**Required adaptation:** Reconcile UI meanings, calculation horizons, and range propagation through the authoritative input and empirical contracts; do not make candidate mappings canonical.  
**Authority required:** Research and input-model review.

### AG-013 — Repair pathway selection and feasibility

**Value to preserve:** Battery, display, and mainboard are distinguished, reliable repair access is asked, and unsupported generic mainboard burden remains unknown.  
**Problem:** The calculation defaults the repair type to battery when no supported repair type was selected. Repair availability and feasibility are not consistently used to mark the pathway conditional or infeasible. The app can display a quantified battery repair for a user who reported no repair need.  
**Required adaptation:** Require a traceable repair scenario or return conditional/insufficient; apply accessibility and adequacy conditions without implying that a repair exists.  
**Authority required:** Empirical and input-model contracts.

### AG-014 — Quantitative climate-card presentation

**Value to preserve:** Prospective boundaries, range display, breakdown chips, and unknown states are understandable.  
**Problem:** Generic new results include a central value based on 40 kg production + 3 kg distribution even while saying 40 kg is merely illustrative. Central/range/status logic can imply more authority or precision than the missing contracts support. Zero entries may mean “not prospectively incurred,” “excluded,” or “assumed absent,” which need distinct semantics.  
**Required adaptation:** Drive display solely from canonical claim capabilities and distinguish measured zero, boundary-excluded, not applicable, and unknown. Do not foreground illustrative central values as assessed results.  
**Authority required:** Research decision.

### AG-015 — Planetary pathway interaction

**Value to preserve:** The selectable path-to-system flow is the strongest visual storytelling concept and makes an abstract causal chain tangible.  
**Problem:** The flow is mostly static across pathways, the `activeStep` state produces no visible detail change, and claims such as repair avoiding “95%+ of device mass” are not linked to a verified record. “Triggering” language may overstate marginal causation.  
**Required adaptation:** Keep the visual sequence but make each node contract-driven, conditional by pathway, visibly sourced, and precise about contribution to shared systems. Make interaction keyboard-operable and meaningful or remove false affordances.  
**Authority required:** Research review plus accessibility work.

### AG-016 — Protect My Four experience

**Value to preserve:** Person/place cards create an emotionally legible contextual bridge and explicitly display supported versus prohibited causal claims. The feature is correctly presented as Project Inquiry in its main body.  
**Problem:** Two people and locations are prepopulated; the same country list used for electricity doubles as the risk-location list; only five countries have risk records; no actual map exists; country-level summaries may look personally predictive; card reflections are local component state and are omitted from the dossier.  
**Required adaptation:** Begin empty, make participation optional, separate location vocabularies/datasets, state spatial and evidentiary limits, retain “unknown/not listed,” and include user-entered reflection only with explicit consent.  
**Authority required:** HQ scope decision and research approval for location context.

### AG-017 — Evidence authority labels and record fallback

**Value to preserve:** Clear labels help users understand evidence type and confidence.  
**Problem:** Candidate records and model data are labeled `approved`, `authoritative`, `certified`, or “claims verified” even though canonical registries are empty and source packages are missing. If a requested record ID is absent, the drawer silently shows the first generic-production record. Some pathways link a record that does not substantiate all displayed domains.  
**Required adaptation:** Use candidate/unverified status until provenance review; fail visibly on missing IDs; map each displayed claim to its own source record; reserve “approved” for canonical registry status.  
**Authority required:** Governance and research integration.

### AG-018 — Accessibility implementation

**Value to preserve:** Native buttons/selects/textareas, a labeled stage navigation, `aria-current`, close-button labels, focus-visible CSS, and reduced-motion support provide a useful base.  
**Problem:** Dialog role/label is placed on the clickable backdrop; there is no focus trap, initial focus, Escape handling, or focus restoration. Several select labels lack programmatic association, icon-only/context controls need fuller naming, clickable pathway `div`s are not keyboard controls, dynamic results lack announcements, and selection state is mainly class/visual treatment without `aria-pressed` or radio semantics.  
**Required adaptation:** Implement accessible dialog and grouped-choice patterns, programmatic labels, keyboard interaction, focus management, status announcements, and automated/manual accessibility checks.  
**Authority required:** Standard implementation review; no scientific authority needed.

### AG-019 — Demo-case system

**Value to preserve:** Cases A–G efficiently expose unknown horizon, unsafe phone, repair, used, refurbished, and location scenarios for review.  
**Problem:** Demo answers include scientific values and conclusions inside user-voice text; the selector occupies the production header; Case A is implicitly active at startup; changing demos does not reset stage-completion state; demo records can be mistaken for user input or validated evidence.  
**Required adaptation:** Treat demos as fixtures or an explicitly labeled sandbox, isolate them from real sessions, reset all dependent state, and validate their claims through contracts.  
**Authority required:** HQ decision on public demo exposure.

### AG-020 — Final dossier and print flow

**Value to preserve:** A printable, local record gives closure without an account or upload.  
**Problem:** The dossier truncates three inquiry answers to 45 characters and omits the remaining answers, reflection semantics, evidence snapshot, uncertainty, source versions, Protect My Four reflection, and exact calculation inputs. “Client-Side Verification” overstates what the dossier verifies.  
**Required adaptation:** Preserve verbatim answers; distinguish user record from verified evidence; include contract/claim versions and unknown states; provide an accessible print layout; avoid retaining sensitive location/person information without an explicit choice.  
**Authority required:** HQ privacy/export scope and contract schema.

### AG-021 — Responsive/mobile composition

**Value to preserve:** Flexible grids and breakpoints make the interface technically responsive.  
**Problem:** Responsive wrapping does not by itself reduce the very long vertical flow, repeated cards, dense explanations, or five-pathway comparison burden on a 390 px screen. Wide inline content and compact text sizes require real device validation.  
**Required adaptation:** Test task completion and comprehension at 390 px, reduce simultaneous content through progressive disclosure, and preserve comparison access without forcing excessive scroll or hidden context.  
**Authority required:** Governed UX and browser testing.

### AG-022 — Animation and transitions

**Value to preserve:** Fade, drawer slide, hover, and smooth-scroll effects are restrained; reduced-motion behavior is globally provided.  
**Problem:** Animations are primarily decorative and do not yet explain state changes or causal relationships. Smooth scrolling is invoked from JavaScript even under reduced-motion preferences unless browser/CSS behavior happens to override it. A pulse animation exists without a demonstrated comprehension purpose.  
**Required adaptation:** Keep only transitions that clarify hierarchy, navigation, or causal sequence; respect reduced motion in JavaScript behavior; test focus and motion comfort.  
**Authority required:** Standard UX/accessibility review.

### AG-023 — Time-sensitive device/security-support content

**Value to preserve:** Model-specific configuration restrictions and support context are exposed near the user's device selection.  
**Problem:** Support years/statuses and launch data are hard-coded, may drift, and are presented as documented/certified without imported evidence. The initial state says support is known and active. Device weight is not modeled despite the requested audit dimension.  
**Required adaptation:** Make support status time-stamped, source-backed, configuration-specific, and optional/unknown when not verified. Do not infer device weight or service life.  
**Authority required:** Research decision and input-model review.

### AG-024 — Maintainability and performance shape

**Value to preserve:** The dependency set is small, calculation modules are separated from UI, and the static client build is inexpensive to host.  
**Problem:** Large components contain extensive inline styling and user-facing scientific prose; data and authority are compiled directly into the UI; all stages and icons share one main bundle; there is no runtime schema validation or route/state boundary; lint reports unused symbols and state.  
**Required adaptation:** Separate contract-backed content from presentation, introduce validated registry adapters, split large components where useful, remove dead code, and measure before optimizing. Do not migrate frameworks merely for aesthetics.  
**Authority required:** Engineering implementation review after contracts exist.

## REJECT

No feature is classified as an unconditional rejection at intake. The significant problems have worthwhile adaptation paths. This does not approve the current implementation or its data.

## REQUIRES HQ DECISION

### AG-025 — Protect My Four product scope and sensitive-data boundary

**Decision needed:** Whether the canonical product should ask users to name relationship categories and approximate locations, how optional the feature is, what appears in exports, and whether “four” is a fixed experience or a flexible metaphor.  
**Why implementation cannot decide:** This determines product purpose, emotional intensity, privacy expectations, and the boundary between reflection and persuasion.

### AG-026 — Demo/developer controls in the public experience

**Decision needed:** Whether cases A–G and the method controls are public education features, reviewer-only tools, or test fixtures.  
**Why implementation cannot decide:** Their visibility materially changes onboarding, perceived complexity, and the risk that fabricated example answers are confused with user state.

### AG-027 — Persistence, export, and sharing policy

**Decision needed:** Whether sessions remain ephemeral, whether local save/resume is allowed, what a dossier contains, and whether any share/export feature should exist.  
**Why implementation cannot decide:** The choice affects privacy, user expectations, sensitive free text, person/location data, and product scope. Current behavior is ephemeral plus browser print only.

## REQUIRES RESEARCH DECISION

### AG-028 — Candidate LCA, repair, refurbished, and displacement registry

**Decision needed:** Verify every candidate record and value against approved packages and primary sources before any canonical adoption. This includes generic new production 25–70 kg CO2e; distribution 2–4 kg; charging 4 kWh/year with 2–8 sensitivity; Fairphone 5 totals/components; Samsung S25 EUR values; iPhone 16 128 GB values; ADEME 7.61 kg; generic battery 0.3–0.7 kg; generic display 3–8 kg; and the alleged 2026 U.S. ~0.40 displacement study.  
**Risk:** The U.S. study has no URL or DOI and uses a generic working-group attribution. Candidate code marks all of these records approved despite absent source packages. Generic used-transfer remains unquantified, arbitrary refurbished remains unknown, and generic mainboard repair remains unknown in calculations; those safe boundaries should remain pending verification rather than being weakened.

### AG-029 — Electricity and charging dataset

**Decision needed:** Approve or reject the embedded DE 0.38 (2023), GB 0.15 (2024), US 0.37 (2024), FR 0.05 (2023), IN 0.71 (2023), and global 0.44 (2023) kg CO2e/kWh factors, their boundaries, source editions, and the 4 kWh/year assumption.  
**Risk:** No source URLs are stored for these factors; the known project state says no approved grid dataset exists; Germany is applied automatically in initial state. Country averages also conceal regional and accounting-method differences.

### AG-030 — Location-risk dataset

**Decision needed:** Validate each Germany, UK, US, India, and France risk statement, confidence label, spatial scale, timeframe, and source mapping.  
**Risk:** Records cite report/chapter names rather than inspectable claim-level links, mix IPCC and national sources, and may contain overly specific or generalized language. No risk data exists for most country options, and no individual exposure is actually calculated.

### AG-031 — Materials, water, waste, and circularity claims

**Decision needed:** Determine which qualitative statements are supported for each pathway and with what scope.  
**Risk:** Several claims are marked `supported` with empty record IDs, including operational water being negligible, reduced refurbishment water, thousands of litres per wafer cycle, and waste/circularity outcomes. Statements such as “zero additional primary mining” and “prevents premature shredding” may depend on boundaries and market behavior.

### AG-032 — Planetary causal-chain claims

**Decision needed:** Approve the precise contribution language, cumulative-warming figure, pathway-specific upstream statements, and any mass/pressure claims used in the visual bridge.  
**Risk:** The candidate correctly refuses individual-event attribution, but some statements—“triggers,” “systematically increases climate risks for every region,” and “avoids replacing 95%+ of device mass”—need evidence and careful marginal-causation wording.

## REQUIRES AP DECISION

### AG-033 — Six-question AP corpus and attribution

**Decision needed:** Confirm that the six prompts, lens names, paraphrases, and statements attributed to Acharya Prashant match the approved AP interaction package.  
**Risk:** The authoritative AP package is absent. Phrases about incompleteness, desires entering from outside, external eyes confirming significance, and appropriate action following naturally are currently presented as approved AP paraphrases without inspectable AP provenance.

### AG-034 — Regex reflection branching and semantics

**Decision needed:** Approve whether keyword detection may classify answers into `apparent_contradiction`, `visibility_identity`, `exposure_novelty`, and related internal branches, and whether each resulting reflection is non-diagnostic and faithful.  
**Risk:** Raw text is retained, but a small English keyword list can misclassify negation and context—for example, “I do not care what people think” still matches visibility terms. The forbidden-phrase list catches only exact phrases. “Apparent contradiction,” emotional expectation inference, and the chosen AP lens are derived interpretations not currently traceable to an approved AP contract.

## Scientific data found in candidate

All entries below are candidate data, not canonical approvals.

| Domain | Candidate values/claims | Provenance condition found in code | Intake disposition |
| --- | --- | --- | --- |
| Generic new phone | Production 25–70 kg CO2e; distribution 2–4; illustrative central 40 + 3 | JRC named and linked at registry level; approved source package absent | AG-028 research review |
| Charging energy | 4 kWh/year central; 2–8 sensitivity | JRC named; package absent | AG-028/AG-029 review |
| Grid carbon intensity | DE 0.38; GB 0.15; US 0.37; FR 0.05; IN 0.71; global 0.44 kg CO2e/kWh | Organization names and years only; source URL fields empty | AG-029; do not use as approved dataset |
| Fairphone 5 | Total 42.10; production 32.70; distribution 2.81; use 6.59; EOL 0.041 kg CO2e; component repair values 0.568–17.909 | Fraunhofer/Fairphone named and general link present | AG-028 model-specific verification |
| Samsung Galaxy S25 EUR | Total 45.7; production 40.22; distribution 2.38; use 2.97; EOL 0.14 kg CO2e | Samsung report described; only general sustainability URL | AG-028 model/configuration verification |
| iPhone 16 128 GB | Total 56; production 44.8; distribution 1.68; use 10.08; EOL 0.50 kg CO2e | Apple report described; reports landing page linked | AG-028 model/configuration verification |
| Generic repair | Battery 0.3–0.7; display 3–8 kg CO2e | Candidate generic registry; package absent | AG-028 review |
| Generic mainboard repair | No generic value in calculation | Explicitly unknown | Preserve boundary pending AG-028 |
| Used transfer | Logistics/packaging `null`; charging may be computed | Explicitly partial/unknown; no 1:1 credit | Preserve boundary pending AG-028/029 |
| Refurbished | Arbitrary candidate `null`; ADEME reference 7.61 kg CO2e for two years | ADEME page linked and scenario restriction stated | Preserve unknown; verify conditional record under AG-028 |
| Displacement | ~0.40 in an alleged 2026 U.S. study; not applied to primary score | No URL/DOI; generic authorship | High-priority verification under AG-028 |
| Service life | UI buckets map to 0.25–0.5, 0.5–1, 1–2, 2–3, and 3–5 years; devices store 3-year LCA use assumptions | User bucket mappings and manufacturer scenario assumptions are distinct in code, but behavior is inconsistent | AG-012 review |
| EOL/recycling | Generic device registry contains 0–0.2 kg CO2e; calculations generally leave generic EOL `null` | Generic value is embedded but not used in pathway result | AG-028; remove or quarantine if unapproved |
| Materials/mining | ~40+ metals; qualitative land, water, biodiversity pressures; 47 metals and ~70% trade-flow statements | Candidate Nature Reviews record uses a journal home page, not an article DOI/link | AG-031 verification |
| Water | Thousands of litres per wafer cycle; refurbishment water reduced; keep operational water negligible | Several claims have empty record IDs | AG-031 verification |
| Local harm | No phone-to-individual harm number found | Explicit prohibition in UI | Keep prohibition; review aggregate claims under AG-030/032 |

## Causal/location claims found

The candidate's intended structure is mostly constitution-compatible:

`pathway choice → upstream physical demands → emissions/material pressure → shared atmosphere and ecosystems → aggregate regional risks → contextual connection to selected people/places`

Positive boundaries found:

- It explicitly says one phone cannot be translated into a measurable fraction of warming.
- It explicitly refuses claims that one purchase causes or prevents a specific flood, storm, illness, or harm to a named person.
- Protect My Four is labeled a Project Interpretation/Project Inquiry in the main experience.
- Location display shows categories of country-level risk rather than an individual harm estimate.

Required corrections:

- Treat all regional records as unverified until AG-030 is resolved.
- Avoid wording that implies every region or selected person receives a determinable marginal risk from this handset.
- Replace “triggering” and other simple linear language with contribution/boundary language approved under AG-032.
- Do not use the electricity country list as an implicit location-risk coverage set.
- Do not present a country summary as personal exposure, prediction, or event attribution.

## UX advantages over V17

The exact V17 UI is unavailable, so this is a comparison against recorded V17 feedback, not a direct visual diff.

- Strong four-stage orientation and persistent progress labels.
- Card-based choices are more approachable than raw technical form controls.
- Progressive disclosure through method and evidence drawers reduces technical text in the primary path.
- Unknown/infeasible states are visually explicit instead of hidden in footnotes.
- Five pathways are visibly parallel and selectable for the planetary bridge.
- The phone → physical systems → shared risks sequence makes causal boundaries easier to visualize.
- Protect My Four gives the location/person connection a concrete, optional-looking card interaction.
- Neutral final-choice cards and printable closure reinforce user ownership.
- Restrained transitions reduce monotony without dominating the reasoning task.

Remaining burden:

- Situation remains dense and terminology-heavy.
- All six AP questions appear simultaneously.
- Stage 3 is long: five cards, planetary flow, and person/location cards.
- Technical labels, small text, and evidence language can still overwhelm ordinary users.
- Animation adds polish but does not itself reduce conceptual complexity.

## Accessibility and performance concerns

- Dialog focus management, Escape close, focus restoration, and correct dialog element semantics are missing.
- Several labels are visual only; choice state lacks complete programmatic semantics.
- Clickable causal-step containers are not keyboard controls.
- Dynamic reflections, changed calculations, and finalized results have no announced status region.
- No accessibility, browser, or mobile automation exists locally.
- Reduced-motion CSS is a strong base, but JavaScript smooth scroll should also honor the preference.
- Responsive CSS exists, but 390 px comprehension and control ergonomics are unverified in this checkout.
- The static application is operationally light and has no ongoing service cost, but scientific prose and data are tightly coupled to large components.
- The single built JavaScript bundle is about 319 kB uncompressed / 98 kB gzip; this is acceptable as an intake observation, not a performance approval.
- Google Fonts preconnect hints create unnecessary external connection intent when no font stylesheet is loaded.

## Candidate integration sequence

1. **Freeze and identify candidate:** Commit the governance/audit documents separately from candidate application source; record the candidate commit and checksums. Do not create a V17 tag.
2. **Import authority artifacts:** Bring the expected empirical, AP, input, secondary-pathway, test, V17 snapshot, and validation packages into provenance verbatim.
3. **Reconcile contracts:** Resolve source-package disagreements in `contracts/INTEGRATION_NOTES.md`; populate canonical contracts and registries only after authorized decisions.
4. **Build a candidate-to-contract matrix:** Map each data constant, prompt, derived branch, status, and causal statement to an approved contract/claim or an explicit blocked state.
5. **Neutralize unsafe defaults in an integration branch:** Separate demo mode, initialize unknown/unanswered state, remove automatic location assumptions, and prevent unsupported calculation fallback.
6. **Integrate ADOPT experience patterns:** Preserve stage architecture, epistemic display, pathway cards, evidence drawer, explicit unknown states, client-side computation, and neutral choice UI.
7. **Implement ADAPT items in dependency order:** input state/navigation → scientific adapters → AP reflection → planetary/location content → dossier/privacy → accessibility/responsive behavior → maintainability.
8. **Run governed regressions:** canonical deterministic, input-model, secondary-pathway, AP-integrity, privacy, accessibility, browser, mobile, and visual checks.
9. **Conduct fresh comprehension testing:** test terminology, perceived length, orientation, evidence understanding, neutrality, and whether visual storytelling clarifies rather than persuades.
10. **Request acceptance:** only an explicit owner/HQ decision after evidence and regressions may promote integrated candidate features into the canonical product.
