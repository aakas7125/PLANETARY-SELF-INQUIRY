# HQ-AP-2026-10-15-004 — German Constitution semantic-localization pilot

**Issue:** #162  
**Task ID:** HQ-AP-2026-10-15-004  
**Workstream:** AP Framework & Corpus  
**Execution class:** Tier 3 — semantic localization / public-product wording  
**Cycle:** CORRECTION-1 (INITIAL-1 returned; amended after HQ review 5541108946)  
**Deterministic branch:** ap/hq-ap-2026-10-15-004-german-constitution-pilot  
**Named accepted English baseline:** 5b4942383f6c109768bd3782ffaa9635faf997be  
**Actual execution-start main (INITIAL-1):** e27aea1da5b18f0dd74467964fff8ea382990bd0  
**Actual correction-start main (CORRECTION-1):** 34081aa668e99b864ae09edf35965bb7566e16ce  
**Prior reviewed proposal head:** a48b067d242961e7541151d19c01abe5a3b32c67  
**Canonical language:** English  
**Proposal language:** German  
**Status:** localization proposal for independent HQ review; not adopted/launched  
**Self-merge:** NO

This handoff localizes only the accepted public Constitution / Principles page. It does not translate the smartphone inquiry, APQ1–APQ6, QSP, Otherness, user answers, evidence records, homepage, Household Ledger or the wider application.

## 1. Source pins and complete surface inventory

Canonical semantic source:
- handoffs/ap/HQ-AP-2026-10-15-003-public-constitution.md §§1–4, accepted AP head 08d00c9e5ba0b004a3e6e64585c150a3183d4dae;
- project-state/DECISIONS.md D-007;
- merged English page baseline 5b4942383f6c109768bd3782ffaa9635faf997be;
- app/src/lib/constitution/public-constitution.mjs;
- app/src/components/public-constitution.tsx;
- app/src/routes/constitution.tsx;
- app/src/components/site-nav.tsx.

Authority cross-checks used only where meaning was sensitive:
- PROJECT_CONSTITUTION.md;
- contracts/AP_INTERACTION_V0.md;
- tests/ap-integrity/AP_V0_INVARIANTS.md;
- contracts/EMPIRICAL_SMARTPHONE_V0.md;
- project-state/PUBLIC_BETA_PROFILE.md;
- project-state/DECISIONS.md D-005/D-006/D-007.

The English data file contains **21 unique PC-* paragraph units**. PC-RAW-01 is rendered in two scenes but receives one German translation.

### Page and heading inventory

| Local ID | Accepted English | Proposed German |
|---|---|---|
| LBL-PAGE-TITLE | What PSI promises you | Was PSI dir verspricht |
| LBL-EYEBROW | Principles | Prinzipien |
| LBL-SEC-RAW | Your words stay yours | Deine Worte bleiben deine Worte |
| LBL-SEC-EVID | Evidence should show its limits | Belege sollen ihre Grenzen zeigen |
| LBL-SEC-CAUSE | Consequences without blame | Folgen ohne Schuldzuweisung |
| LBL-SEC-DESIGN | Design should clarify, not steer | Gestaltung soll klären, nicht lenken |
| LBL-SEC-INQUIRY | Inquiry, not a verdict | Selbstbefragung statt Urteil |
| LBL-SEC-PRIV | Privacy in this public beta | Privatsphäre in dieser öffentlichen Beta |
| LBL-SEC-ACCOUNT | Hold us to these promises | Nimm uns bei diesen Zusagen beim Wort |
| LBL-SCENE-1 | Your life is where the question starts | Dein Leben ist der Ausgangspunkt der Frage |
| LBL-SCENE-2 | Ordinary choices repeat | Alltägliche Entscheidungen wiederholen sich |
| LBL-SCENE-3 | Choices sit inside wider systems | Entscheidungen sind Teil größerer Systeme |
| LBL-SCENE-4 | Evidence has edges | Belege haben Grenzen |
| LBL-SCENE-5 | Questions, not judgement | Fragen statt Urteil |
| LBL-SCENE-6 | The choice returns to you | Die Entscheidung liegt wieder bei dir |

### Visible illustration / caption / source / route / navigation inventory

| Local ID | Accepted English | Proposed German |
|---|---|---|
| LBL-BACK-HOME | Back to home | Zurück zur Startseite |
| LBL-NAV-PRINCIPLES | Principles | Prinzipien |
| LBL-SOURCES-SUMMARY | Sources for these promises | Quellen zu diesen Zusagen |
| LBL-SOURCES-INTRO | The sentences above are the accepted English public copy. These links open the project Constitution, the adopted public-copy handoff, and the public beta profile. | Die zugrunde liegenden englischen Sätze sind die akzeptierte kanonische öffentliche Fassung. Diese Links führen zur Projektverfassung, zum übernommenen Übergabedokument der öffentlichen Fassung und zum Profil der öffentlichen Beta. |
| LBL-SOURCE-CONSTITUTION | Project Constitution | Projektverfassung |
| LBL-SOURCE-HANDOFF | English public-copy handoff | Englisches Übergabedokument zur öffentlichen Fassung |
| LBL-SOURCE-BETA | Public beta profile | Profil der öffentlichen Beta |
| LBL-CHOICE-KEEP | Keep | Behalten |
| LBL-CHOICE-REPAIR | Repair | Reparieren |
| LBL-CHOICE-USED | Used or second-hand | Gebraucht / Secondhand |
| LBL-CHOICE-REFURB | Refurbished | Refurbished / aufbereitet |
| LBL-CHOICE-NEW | New | Neu |
| LBL-CHOICE-INVESTIGATE | Investigate further | Weiter prüfen |
| LBL-CHOICE-UNCLEAR | Unclear | Unklar |
| LBL-SYSTEM-MATERIALS | Materials | Materialien |
| LBL-SYSTEM-PROCESSING | Processing | Verarbeitung |
| LBL-SYSTEM-COMPONENTS | Components | Komponenten |
| LBL-SYSTEM-TRANSPORT | Transport | Transport |
| LBL-SYSTEM-USE-REPAIR | Use / repair | Nutzung / Reparatur |
| LBL-SYSTEM-SECOND-LIFE | Second life | Zweitnutzung |
| LBL-SYSTEM-EOL | End of life | Lebensende |
| LBL-SYSTEM-PEOPLE | People | Menschen |
| LBL-SYSTEM-ECOSYSTEMS | Ecosystems | Ökosysteme |
| LBL-EVID-CLIMATE | Climate | Klima |
| LBL-EVID-MATERIALS | Materials | Materialien |
| LBL-EVID-WATER | Water | Wasser |
| LBL-EVID-WASTE | Waste | Abfall |
| LBL-EVID-PEOPLE | People | Menschen |
| LBL-EVID-ECOSYSTEMS | Ecosystems | Ökosysteme |
| LBL-EVID-UNKNOWN | Unknown | Unbekannt |
| LBL-EVID-MODELLED | Modelled or conditional | Modelliert oder bedingt |
| LBL-LIFE-CAPTION | A phone among ordinary things, and people nearby. | Ein Smartphone zwischen alltäglichen Dingen und Menschen in der Nähe. |
| LBL-CHOICE-CAPTION | Side by side. None is marked as the better purchase. | Nebeneinander. Keine Option ist als der bessere Kauf markiert. |
| LBL-SYSTEM-CAPTION | Illustrative. Not a measurement or a causal model. | Nur zur Veranschaulichung. Keine Messung und kein Kausalmodell. |
| LBL-EVID-CAPTION | Separate domains. No single score. | Getrennte Bereiche. Keine einzelne Gesamtbewertung. |
| LBL-NOT-SURE | “I’m not sure” | „Ich bin mir nicht sicher“ |
| LBL-QUESTION-CAPTION | A literal answer, left as written. | Eine Antwort im Wortlaut, unverändert belassen. |
| LBL-RETURN-CAPTION | Nothing in this panel is selected. | In diesem Feld ist nichts ausgewählt. |

Navigation note: LBL-NAV-PRINCIPLES is an inventory/proposed local translation only. This task does not authorize translation of the rest of SiteNav or a global navigation architecture change.

## 2. Proposed German public page copy

# Was PSI dir verspricht

Planetary Self-Inquiry soll dir helfen, eine alltägliche Entscheidung klarer zu betrachten, ohne sie für dich zu treffen. PSI bringt deine eigenen Antworten, Belege und Modellierung sowie eine klar gekennzeichnete philosophische Perspektive zusammen – und gibt die Entscheidung dann an dich zurück.

## Deine Worte bleiben deine Worte

PSI stellt Fragen, statt dir zu sagen, was „tief in dir drin“ vor sich geht. Deine Antworten im Originalwortlaut bleiben maßgeblich. Wenn du unsicher bist oder widersprichst, darf diese Unsicherheit oder dieser Widerspruch genau so bestehen bleiben.

## Belege sollen ihre Grenzen zeigen

PSI zeigt, was durch die Belege gestützt ist, welche Annahmen verwendet werden und was weiterhin unbekannt ist. Unbekannt wird nicht zu null, „keine Auswirkung“ oder Gewissheit, nur weil eine Zahl fehlt.

Wichtige Aussagen, Quellen, Grenzen, die Einschätzung, wie gut die Aussagen durch Belege gestützt sind, und Modellierungsgrenzen sollen einsehbar bleiben.

Verschiedene Arten von Folgen – etwa Klima, Materialien, Wasser, Abfall, Menschen und Ökosysteme – bleiben getrennt, statt zu einer einzigen Umwelt- oder Moralbewertung zusammengefasst zu werden.

Belege, Modellannahmen und philosophische Interpretation bleiben voneinander unterscheidbar. Eine philosophische Quelle, auch Acharya Prashant, wird nicht als wissenschaftlicher Beweis behandelt.

„Protect My Four“ ist eine Projektinterpretation von PSI, keine direkte Aussage von Acharya Prashant.

## Folgen ohne Schuldzuweisung

PSI kann größere materielle, menschliche und ökologische Wirkungspfade verständlich machen, ohne dir zu sagen, dass die Handyentscheidung einer einzelnen Person ein bestimmtes Opfer oder Ereignis verursacht hat. Modellierte oder bedingte Pfade werden als modelliert oder bedingt dargestellt – nicht als tatsächlich eingetretener individueller Schaden.

## Gestaltung soll klären, nicht lenken

Einfache Sprache, Visualisierungen und interaktive Gestaltung können das Verständnis erleichtern, dürfen aber weder Unsicherheit verwischen noch dich zu einem bevorzugten Kaufergebnis drängen.

PSI setzt Schuld- oder Schamgefühle nicht als Mittel ein, um eine „richtige“ Antwort zu erzwingen.

Wo eine Unterscheidung wissenschaftlich wichtig ist, darf Vereinfachung sie nicht verwischen.

PSI versucht außerdem, dich vor allem nach Dingen zu fragen, die du vernünftigerweise wissen oder einschätzen kannst; technische Annahmen gehören möglichst in die Ebene der Belege oder des Modells und nicht in Vermutungen, die dir abverlangt werden.

## Selbstbefragung statt Urteil

PSI setzt auf Selbstbefragung und klareres Hinschauen. Es verspricht weder Erleuchtung noch psychologische Veränderung, einen kleineren ökologischen Fußabdruck oder ein bestimmtes Verhalten.

Es gibt keinen versteckten „richtigen“ Kauf und keine moralische Bewertung. Behalten, reparieren, gebraucht bzw. Secondhand kaufen, refurbished bzw. aufbereitet kaufen, neu kaufen, weiter prüfen und unklar können – wo anwendbar – alles legitime Ergebnisse bleiben.

Die endgültige Entscheidung liegt bei dir. PSI trifft sie nicht für dich.

## Privatsphäre in dieser öffentlichen Beta

Für diese öffentliche Beta ist das freigegebene Profil anonym: kein Konto und kein Login, keine Analyse des Nutzungsverhaltens und kein Tracking, keine nicht notwendigen Cookies und kein persistenter Speicher für Nutzerdaten.

Das ist bewusst enger gefasst als das Versprechen, dass jede Antwort immer nur auf deinem Gerät bleibt, dass Daten automatisch gelöscht werden oder dass jede mögliche Bereitstellung dieselben Datenschutzeigenschaften hat. Weitergehende Datenschutzversprechen sollte PSI nur machen, wenn die tatsächlich veröffentlichte Implementierung nachweislich dafür verifiziert wurde.

## Nimm uns bei diesen Zusagen beim Wort

GitHub-Issues sind öffentlich. Bitte poste dort keine privaten Antworten, sensiblen Informationen oder persönlichen Daten.

Wenn dir auffällt, dass Formulierungen, Belege oder Verhalten von PSI gegen diese Zusagen zu verstoßen scheinen, kannst du das im öffentlichen Issue-Tracker des Projekts ansprechen.

Feedback kann eine Untersuchung anstoßen, wird dadurch aber nicht automatisch wissenschaftlich, philosophisch oder für Produktentscheidungen maßgeblich.

Wenn visuelle Ausarbeitung, Interaktion oder Druck, etwas abzuschließen, mit diesen Zusagen in Konflikt geraten, haben diese Zusagen Vorrang.

## 3. PC-* semantic review table

English remains canonical. The German text below is proposed localization, not a new source of authority.

| ID | Exact accepted English | Proposed German | Back-translation / semantic note | Authority / status |
|---|---|---|---|---|
| PC-OPEN-01 | Planetary Self-Inquiry is built to help you look more clearly at an ordinary decision without deciding for you. It brings together your own answers, evidence and modelling, and a clearly labelled philosophical lens — then returns the choice to you. | Planetary Self-Inquiry soll dir helfen, eine alltägliche Entscheidung klarer zu betrachten, ohne sie für dich zu treffen. PSI bringt deine eigenen Antworten, Belege und Modellierung sowie eine klar gekennzeichnete philosophische Perspektive zusammen – und gibt die Entscheidung dann an dich zurück. | “look more clearly” → “klarer betrachten”; no enlightenment claim. “philosophical lens” → “philosophische Perspektive”, not doctrine. | PC-OPEN-01 authority unchanged; faithful proposal. |
| PC-RAW-01 | PSI asks questions rather than telling you what is happening “deep down.” Your raw answers remain the authority. If you are unsure or disagree, that uncertainty or disagreement can remain exactly that. | PSI stellt Fragen, statt dir zu sagen, was „tief in dir drin“ vor sich geht. Deine Antworten im Originalwortlaut bleiben maßgeblich. Wenn du unsicher bist oder widersprichst, darf diese Unsicherheit oder dieser Widerspruch genau so bestehen bleiben. | Back: raw answers “in original wording” remain authoritative; uncertainty/disagreement may remain as such. “maßgeblich” avoids implying legal authority. | AP raw-answer/non-diagnosis boundary; faithful. |
| PC-EVID-01 | PSI shows what the evidence supports, the assumptions being used, and what is still unknown. Unknown does not become zero, “no impact,” or certainty just because a number is missing. | PSI zeigt, was durch die Belege gestützt ist, welche Annahmen verwendet werden und was weiterhin unbekannt ist. Unbekannt wird nicht zu null, „keine Auswirkung“ oder Gewissheit, nur weil eine Zahl fehlt. | “Belege” is public-language rendering of evidence; unknown/zero/absence/certainty distinction preserved. | Empirical uncertainty boundary; faithful. |
| PC-EVID-02 | Important claims, sources, limits, confidence and modelling boundaries should remain inspectable. | Wichtige Aussagen, Quellen, Grenzen, die Einschätzung, wie gut die Aussagen durch Belege gestützt sind, und Modellierungsgrenzen sollen einsehbar bleiben. | Back: important claims, sources, limits, the assessment of how well the claims are supported by evidence, and modelling boundaries should remain available for inspection. “einsehbar” explicitly retains access for inspection; confidence concerns evidential support, not a statistical level/interval or certainty. | Constitution P10 / canonical PC-EVID-02; corrected in CORRECTION-1, pending independent HQ review. |
| PC-EVID-03 | Different kinds of consequences — such as climate, materials, water, waste, people and ecosystems — stay distinct rather than being collapsed into one environmental or moral score. | Verschiedene Arten von Folgen – etwa Klima, Materialien, Wasser, Abfall, Menschen und Ökosysteme – bleiben getrennt, statt zu einer einzigen Umwelt- oder Moralbewertung zusammengefasst zu werden. | “score” generalized to “Bewertung”; prohibition on one collapsed moral/environmental metric remains. | Constitution P8; faithful. |
| PC-SEPARATE-01 | Evidence, modelling assumptions and philosophical interpretation stay distinguishable. A philosophical source, including Acharya Prashant, is not treated as scientific proof. | Belege, Modellannahmen und philosophische Interpretation bleiben voneinander unterscheidbar. Eine philosophische Quelle, auch Acharya Prashant, wird nicht als wissenschaftlicher Beweis behandelt. | Direct separation preserved; AP not scientific proof. | Constitution P1–P2 / AP category separation; faithful. |
| PC-PMF-01 | “Protect My Four” is PSI’s Project Interpretation, not a direct Acharya Prashant claim. | „Protect My Four“ ist eine Projektinterpretation von PSI, keine direkte Aussage von Acharya Prashant. | Protect My Four remains identifiable and untranslated; “Projektinterpretation” retains category. | Constitution P11 / INV-AP-18; faithful. |
| PC-CAUSE-01 | PSI can make wider material, human and ecological pathways understandable without telling you that one person’s phone decision caused a particular victim or event. Modelled or conditional pathways are presented as modelled or conditional, not as realized individual harm. | PSI kann größere materielle, menschliche und ökologische Wirkungspfade verständlich machen, ohne dir zu sagen, dass die Handyentscheidung einer einzelnen Person ein bestimmtes Opfer oder Ereignis verursacht hat. Modellierte oder bedingte Pfade werden als modelliert oder bedingt dargestellt – nicht als tatsächlich eingetretener individueller Schaden. | Back: pathways can be explained without attributing a victim/event to one person’s phone decision; modelled/conditional is not realized individual harm. | D-005/empirical causal limits; faithful; sensitive wording reviewed. |
| PC-DESIGN-01 | Simple language, visuals and engagement can help understanding, but they must not erase uncertainty or push you toward a preferred purchase outcome. | Einfache Sprache, Visualisierungen und interaktive Gestaltung können das Verständnis erleichtern, dürfen aber weder Unsicherheit verwischen noch dich zu einem bevorzugten Kaufergebnis drängen. | “engagement” rendered as interactive design, not user moral commitment; no steering. | Constitution P3/P13/P14; faithful. |
| PC-DESIGN-02 | PSI does not use guilt or shame as a tactic to force a “right” answer. | PSI setzt Schuld- oder Schamgefühle nicht als Mittel ein, um eine „richtige“ Antwort zu erzwingen. | This prohibits a tactic; it does **not** promise the user will never feel discomfort, guilt or shame. | D-006; faithful and qualification preserved. |
| PC-DISTINCT-01 | Where a distinction matters scientifically, simplification should not erase it. | Wo eine Unterscheidung wissenschaftlich wichtig ist, darf Vereinfachung sie nicht verwischen. | Scientific distinction survives simplification. | Constitution P9/P13; faithful. |
| PC-INPUT-01 | PSI also tries to ask you mainly for things you can reasonably know or estimate; technical assumptions belong in the evidence or model layer rather than in guesses demanded from you. | PSI versucht außerdem, dich vor allem nach Dingen zu fragen, die du vernünftigerweise wissen oder einschätzen kannst; technische Annahmen gehören möglichst in die Ebene der Belege oder des Modells und nicht in Vermutungen, die dir abverlangt werden. | Keeps “mainly”/“reasonably” as non-absolute design commitment. | Constitution P15; faithful. |
| PC-INQUIRY-01 | PSI’s intended intervention is inquiry and clearer seeing. It does not promise enlightenment, psychological change, a smaller footprint, or any particular behaviour. | PSI setzt auf Selbstbefragung und klareres Hinschauen. Es verspricht weder Erleuchtung noch psychologische Veränderung, einen kleineren ökologischen Fußabdruck oder ein bestimmtes Verhalten. | “Selbstbefragung” is inquiry, not interrogation or diagnosis; “klareres Hinschauen” avoids a claim of enlightenment. | D-006 / autonomy; faithful; key term review recommended. |
| PC-CHOICE-01 | There is no hidden correct purchase and no moral score. Keep, repair, used or second-hand, refurbished, new, investigate further and unclear can all remain legitimate where applicable. | Es gibt keinen versteckten „richtigen“ Kauf und keine moralische Bewertung. Behalten, reparieren, gebraucht bzw. Secondhand kaufen, refurbished bzw. aufbereitet kaufen, neu kaufen, weiter prüfen und unklar können – wo anwendbar – alles legitime Ergebnisse bleiben. | Used/Secondhand and refurbished/aufbereitet remain visibly distinct; “wo anwendbar” preserves where applicable. | Constitution P3–P4/P8; faithful. |
| PC-CHOICE-02 | The final choice is yours. PSI does not select it for you. | Die endgültige Entscheidung liegt bei dir. PSI trifft sie nicht für dich. | Direct autonomy preserved. | Constitution P16; faithful. |
| PC-PRIV-01 | For this public beta, the accepted profile is anonymous: no account or login, no analytics or tracking, no non-essential cookies, and no persistent user-data store. | Für diese öffentliche Beta ist das freigegebene Profil anonym: kein Konto und kein Login, keine Analyse des Nutzungsverhaltens und kein Tracking, keine nicht notwendigen Cookies und kein persistenter Speicher für Nutzerdaten. | Back: for this public beta the accepted profile is anonymous: no account/login, no analysis of usage behaviour and no tracking, no non-essential cookies, no persistent user-data store. The analytics restriction concerns usage behaviour; it does not prohibit PSI evidence/model analysis. “anonym” remains scoped to the accepted beta profile. | PUBLIC_BETA_PROFILE / canonical PC-PRIV-01; corrected in CORRECTION-1, release verification still required. |
| PC-PRIV-02 | That is deliberately narrower than promising that every answer always stays only on your device, that data is automatically deleted, or that every possible deployment has identical privacy properties. PSI should make broader privacy claims only when the released implementation has actually been verified to support them. | Das ist bewusst enger gefasst als das Versprechen, dass jede Antwort immer nur auf deinem Gerät bleibt, dass Daten automatisch gelöscht werden oder dass jede mögliche Bereitstellung dieselben Datenschutzeigenschaften hat. Weitergehende Datenschutzversprechen sollte PSI nur machen, wenn die tatsächlich veröffentlichte Implementierung nachweislich dafür verifiziert wurde. | Explicitly refuses device-only, deletion and universal-deployment guarantees. | D-006/D-007 privacy restraint; faithful. |
| PC-ACCOUNT-01 | If PSI’s wording, evidence or behaviour seems to break these commitments, you can raise it in the public project issue tracker. | Wenn dir auffällt, dass Formulierungen, Belege oder Verhalten von PSI gegen diese Zusagen zu verstoßen scheinen, kannst du das im öffentlichen Issue-Tracker des Projekts ansprechen. | Public tracker only; no private support promise. Link stays https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues. | D-007; faithful. |
| PC-ACCOUNT-02 | GitHub issues are public. Please do not post private answers, sensitive information or personal details there. | GitHub-Issues sind öffentlich. Bitte poste dort keine privaten Antworten, sensiblen Informationen oder persönlichen Daten. | Warning must remain before/beside external tracker link. | D-007 / feedback privacy boundary; faithful. |
| PC-ACCOUNT-03 | Feedback can trigger investigation, but it does not automatically become scientific, philosophical or product authority. | Feedback kann eine Untersuchung anstoßen, wird dadurch aber nicht automatisch wissenschaftlich, philosophisch oder für Produktentscheidungen maßgeblich. | Back: feedback can trigger investigation but does not automatically become scientifically/philosophically/product-decision authoritative. | Universal Issue Control Plane; faithful ordinary-language rendering. |
| PC-CONFLICT-01 | If visual polish, engagement or completion pressure conflicts with these commitments, these commitments come first. | Wenn visuelle Ausarbeitung, Interaktion oder Druck, etwas abzuschließen, mit diesen Zusagen in Konflikt geraten, haben diese Zusagen Vorrang. | “completion pressure” preserved as pressure to finish, not ordinary completion. | Constitution conflict rule; faithful. |

## 4. Consequential vocabulary choices

### 4.1 Form of address: “du”

Proposal: use consistent informal singular **du/dein/dir** on this German page.

Reason:
- current English addresses one user directly;
- “du” is ordinary, readable public-product German and avoids the bureaucratic distance of “Sie”;
- it does not encode a philosophical relationship, intimacy claim or authority hierarchy.

This is a reversible localization choice. HQ may prefer formal “Sie” later without changing PSI semantics, provided the whole page is changed consistently.

### 4.2 Inquiry / clearer seeing

Proposed:
- inquiry → **Selbstbefragung** in the main conceptual sentence;
- clearer seeing → **klareres Hinschauen**.

Avoid:
- “Erleuchtung”, “Selbsterkenntnis” or “Wahrheit über dich” because they imply stronger philosophical or psychological achievement;
- “Diagnose”, “Analyse deiner Psyche” or “wahres Motiv” because the accepted system prohibits diagnosis.

“Selbstbefragung” is not intended as interrogation. A qualified native/editorial reviewer may prefer “Selbsterkundung” or “Nachfragen” for tone, but any replacement must preserve the non-diagnostic and non-guaranteed meaning.

### 4.3 Evidence / model assumptions / philosophical interpretation

Public German proposal:
- evidence → **Belege**;
- modelling assumptions → **Modellannahmen**;
- philosophical interpretation → **philosophische Interpretation**;
- scientific proof → **wissenschaftlicher Beweis**.

“Evidenz” is technically possible in German but can sound specialist or be misunderstood. “Belege” is chosen for ordinary public language. It must still refer to the accepted empirical layer, not mere anecdotes or persuasion.

For PC-EVID-02, **einsehbar bleiben** preserves that claims, sources, limits, confidence and modelling boundaries remain available for inspection; comprehensibility alone would be weaker. Empirical confidence is rendered as **die Einschätzung, wie gut die Aussagen durch Belege gestützt sind**: an assessment of evidential support, without a statistical confidence level/interval, numerical precision or certainty. The prior rendering “Vertrauensniveau” is withdrawn as a semantic correction required by HQ, not deferred editorial polish.

### 4.4 Conditional/modelled pathway vs realized harm

Use:
- modelled → **modelliert**;
- conditional → **bedingt**;
- pathway → **Pfad** or **Wirkungspfad**;
- realized individual harm → **tatsächlich eingetretener individueller Schaden**.

The translation must not shift:
“a supported/modelled pathway exists”
into:
“this purchase harmed someone.”

No named victim, event, location, responsibility or blame may be inferred.

### 4.5 Unknown vs zero

Use **unbekannt** and **null** explicitly in PC-EVID-01. Do not translate unknown as:
- “vernachlässigbar”;
- “kein Effekt”;
- “nicht relevant”;
- “wahrscheinlich null”.

### 4.6 Guilt/shame as tactic vs subjective discomfort

PC-DESIGN-02 means:
PSI does not **use** Schuld/Scham as a tactic to force an answer.

It does not mean:
- the experience is guaranteed comfortable;
- no user can feel guilt, discomfort or confusion;
- PSI can certify a user’s emotional state.

German wording “setzt ... nicht als Mittel ein” preserves the tactic boundary.

### 4.7 No hidden preferred purchase

Use:
- “kein versteckter ‘richtiger’ Kauf”;
- “keine moralische Bewertung”;
- choice terms remain parallel.

No German wording may imply “Neu” is failure or that “Behalten” is morally superior.

### 4.8 Used / second-hand vs refurbished

Keep two distinct terms:
- used / second-hand → **gebraucht / Secondhand**;
- refurbished → **refurbished / aufbereitet**.

Do not translate both simply as “gebraucht”, because the empirical contract keeps them as distinct pathways.

### 4.9 Raw answer authority and disagreement

“raw answers remain the authority” → **Antworten im Originalwortlaut bleiben maßgeblich**.

This means:
- PSI does not overwrite the user’s words with a derived interpretation;
- “Ich bin mir nicht sicher” is valid;
- disagreement remains disagreement.

It does not mean user statements become scientific evidence about external facts.

### 4.10 Project Interpretation vs Direct AP

Keep **Protect My Four** as the identifiable English project phrase.

Use:
- Project Interpretation → **Projektinterpretation**;
- direct AP claim → **direkte Aussage von Acharya Prashant**.

Do not translate the name into a new German slogan as though that slogan were an AP phrase. If a later German UI needs a gloss, a safe form is:

**Protect My Four — PSI-Projektinterpretation**

not:
“Acharya Prashants Vier schützen” or any wording implying Direct AP authorship.

### 4.11 Privacy facts vs device-only/deletion claims

PC-PRIV-01 may state only the accepted public-beta profile facts. **Keine Analyse des Nutzungsverhaltens und kein Tracking** restricts usage analytics and tracking; it leaves PSI’s ordinary evidence/model analysis intact. The prior general prohibition on analysis functions is withdrawn as a semantic correction, not an optional style choice.

PC-PRIV-02 must continue to refuse unsupported promises such as:
- “Alle Antworten bleiben auf deinem Gerät”;
- “Wir löschen deine Daten automatisch”;
- “Alles ist vollständig vertraulich/sicher”;
- “Jede Bereitstellung funktioniert datenschutzmäßig identisch”.

German privacy wording must be verified against the actual release exactly as English is.

### 4.12 Public tracker and feedback authority

Preserve tracker href exactly:

https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues

The public-warning sentence must appear before or beside the tracker link.

“Feedback ... wird nicht automatisch ... maßgeblich” means feedback may trigger investigation but does not create scientific, AP/philosophical, product or execution authority.

No private channel, anonymity promise, response deadline or remedy promise is added.

## 5. Proposed German six-scene static narrative

The semantic scene order is unchanged.

1. **Dein Leben ist der Ausgangspunkt der Frage**  
   Ordinary life, the phone and people the user cares about. No predetermined moral conclusion.

2. **Alltägliche Entscheidungen wiederholen sich**  
   Behalten / Reparieren / Gebraucht-Secondhand / Refurbished-Aufbereitet / Neu / Weiter prüfen shown in parallel. No “better” badge.

3. **Entscheidungen sind Teil größerer Systeme**  
   Materialien → Verarbeitung → Komponenten → Transport → Nutzung/Reparatur → Zweitnutzung → Lebensende, alongside people/ecosystems. Illustration remains explicitly non-measurement/non-causal-model.

4. **Belege haben Grenzen**  
   Separate Klima/Materialien/Wasser/Abfall/Menschen/Ökosysteme with “Unbekannt” and “Modelliert oder bedingt”. No single score.

5. **Fragen statt Urteil**  
   “Ich bin mir nicht sicher” remains literal text. No diagnosis, virtue label or forced conclusion.

6. **Die Entscheidung liegt wieder bei dir**  
   All choices remain unselected. Privacy scope and public accountability disclosure remain visible.

No scene may add a virtuous ending, victim attribution, guilt cue or causal illustration from one purchase to one person/event.

## 6. Semantic-equivalence checklist

Before German wording can be accepted, review must confirm:

- [x] all 21 unique PC-* units are translated exactly once; repeated PC-RAW-01 reuses one translation;
- [x] page title, seven subsection headings and six scene headings are covered;
- [x] all constitution-page-local visible illustration/caption/source/back-link labels are inventoried;
- [x] “Planetary Self-Inquiry”, “PSI”, “Acharya Prashant” and “Protect My Four” remain identifiable;
- [x] evidence/model/philosophical interpretation remain distinct;
- [x] PC-EVID-02 explicitly retains inspectability for all five listed items, including confidence as an assessment of evidential support without statistical precision/certainty;
- [x] PC-PRIV-01 restricts usage analytics/tracking without prohibiting evidence/model analysis; §2 and §3 use identical corrected wording;
- [x] AP attribution is not scientific proof;
- [x] unknown does not become zero/no-effect/certainty;
- [x] modelled/conditional pathway does not become realized individual harm;
- [x] no victim/event/individual causation or blame is introduced;
- [x] no hidden motive, ego, greed, selfishness or virtue diagnosis appears;
- [x] guilt/shame wording remains a prohibition on tactic, not a comfort guarantee;
- [x] used/Secondhand remains distinct from refurbished/aufbereitet;
- [x] no hidden preferred purchase or moral score appears;
- [x] raw-answer authority and valid uncertainty/disagreement remain intact;
- [x] Protect My Four remains Project Interpretation;
- [x] privacy facts do not enlarge into device-only/deletion/security guarantees;
- [x] public GitHub disclosure precedes/accompanies the tracker route;
- [x] feedback does not gain automatic authority;
- [x] English remains canonical and German remains proposal/fallback-localization candidate only.

## 7. Review performed and limits

Performed:
- direct source-to-translation comparison against the merged English data file;
- semantic cross-check against D-005/D-006/D-007, Project Constitution, AP invariants, empirical boundaries and public-beta privacy profile;
- self-generated back-translation for the most consequence-sensitive units;
- vocabulary consistency review across all repeated page labels;
- CORRECTION-1: re-read the canonical PC-EVID-02 and PC-PRIV-01 at the named English baseline, Constitution P10 and the public-beta profile; compared corrected §2/§3 German text and self-back-translations against each source clause;
- CORRECTION-1: checked all 21 English mapping cells and unrelated German copy/IDs/labels remain unchanged, PC-PRIV-02 remains verbatim, and tracker href/public warning remain intact.

Not performed / not claimed:
- independent professional translation;
- native-speaker certification;
- German usability/comprehension testing;
- legal/privacy review;
- independent AP-source review;
- external translation service validation;
- application render/build testing.

The self-generated back-translation is only a review aid.

### Semantic corrections versus remaining editorial review

INITIAL-1 incorrectly described the confidence wording as faithful and only an editorial concern. HQ review 5541108946 found that wording and two other semantic problems. CORRECTION-1 supersedes that assessment: PC-EVID-02 now explicitly retains inspectability and describes confidence as assessed evidential support; PC-PRIV-01 now restricts usage analytics/tracking specifically. These changes address meaning, not optional polish. Independent HQ review of the amended exact content/head is still required; AP does not claim HQ acceptance.

**Selbstbefragung** for “inquiry” remains a tone question for a qualified German editorial pass before launch. It can sound more interrogative than the English. “Selbsterkundung” or “Nachfragen” may read more naturally, but any change must preserve the non-diagnostic, non-enlightenment meaning. This correction does not alter that unrelated copy.

Qualified editorial review may also improve the fluency of the corrected evidential-support phrase while retaining its meaning. No new product/AP/scientific or Owner-level decision is identified. Native/professional certification and user comprehension testing remain unperformed; a self-generated back-translation is not independent validation.

## 8. Smallest later Tier-2 implementation boundary

Only after HQ accepts the exact German wording:

- add one **optional German Constitution surface** for the existing /constitution content;
- keep English canonical and available as fallback;
- preserve stable PC-* semantic identifiers;
- preserve the same sources/accountability href and privacy qualifications;
- localize only page-specific labels needed for the German Constitution surface;
- do not translate the smartphone inquiry, APQ/QSP/Otherness, homepage, Household Ledger, evidence records or user answers;
- do not infer browser locale or design a multi-language rollout in this first slice;
- do not introduce a large i18n framework unless the implementation task independently establishes it is necessary;
- do not redesign global navigation. If a small locale entry/selector is required, HQ should authorize the minimum implementation separately;
- keep the existing English route and behavior intact.

Already determined:
- German is the first pilot;
- English is canonical;
- “du” is the proposed reversible address form;
- Protect My Four remains identifiable and Project Interpretation;
- tracker link/privacy warning remain unchanged in authority.

No genuine Owner-level meaning/policy question is currently required to complete this proposal. A future decision to launch German publicly, expand localization across the product, create private contact/support, or change privacy policy remains separately governed.

## 9. Scope verification

Only this handoff is authorized to change; CORRECTION-1 amends the existing task handoff.

No changes are made to:
- English public Constitution source;
- application code/routes/components;
- SiteNav;
- internal Project Constitution;
- OWNER_CONTROL;
- AP interaction/corpus/invariants;
- empirical contracts/registries;
- PUBLIC_BETA_PROFILE;
- privacy infrastructure;
- deployment;
- APQ1–APQ6, QSP, Otherness or user answers.

No new scientific number/claim, Direct AP claim, external philosophy or purchase recommendation is introduced.

## 10. Return

**AP specialist result:** VERIFIED_FOR_HQ_REVIEW — CORRECTION-1

Correction scope: PC-EVID-02 and PC-PRIV-01 in §2/§3, their back-translations/authority notes, related vocabulary/checklist/review notes and cycle metadata only. Unrelated public copy, English source cells, all stable IDs and label inventories are preserved. No new semantic authority is introduced. No discrepancy remains identified by AP within the three requested corrections; HQ review remains pending.

Correction starting main: `34081aa668e99b864ae09edf35965bb7566e16ce`. Prior reviewed head: `a48b067d242961e7541151d19c01abe5a3b32c67`. The exact amended head and measured one-file diff are returned on the existing Issue #162 / PR #163 after publication. No application build/render or repository-wide regression was required or performed for this Markdown-only cycle. Self-merge: NO.

The German copy is a bounded semantic-localization proposal. Receiving or merging this handoff does not adopt or launch German UI. HQ must independently review the exact content/head before any separately authorized Tier-2 implementation.
