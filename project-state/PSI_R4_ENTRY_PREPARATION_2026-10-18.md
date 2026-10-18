# R4 preparation — homepage entry and an unprimed first action,2026-10-18

Status: completed read-only HQ preparation under D-018/D-022 and UX brief R4. No homepage/copy/navigation implementation selected. Source baseline: accepted PR217 merge `d4e9db6adf5b4d2da9c9135bd0eb1de72deac68e`; the four entry files below are unchanged by the Ledger accessibility PR. Inspection is source/route mapping, not a new rendered homepage test or participant session.

## Exact current entry inventory

| Surface / file | Existing copy or route | Implication and limit |
|---|---|---|
| hero-section.tsx | Eyebrow “A living ledger”; headline “If you want to protect just four people, you have to protect the whole planet.” | Existing Protect Four proposition; not permission to rewrite its philosophical meaning or present it as proved science. |
| Hero explanation | Science traces dependencies; AP Framework is a lens, not a verdict on motives or a theorem already proved. | Preserve attribution/uncertainty in any later candidate; a shorter promise must not erase these limits. |
| Hero first interactive block | “Name the four you would save”; four labelled inputs, existing in-memory household names | A source fact about the current first interaction, not proof users feel obliged to disclose real identities. Fictional labels remain valid. No new data collection. |
| Hero primary link | “Open the household ledger” → #ledger | Current primary action is Ledger, not phone inquiry. This does not establish that people fail to find the phone route. |
| site-nav.tsx | “Phone inquiry” → /smartphone, alongside Ledger/Dependencies/Framework/Papers/Journey/Principles | Existing native route link; wrapped nav styles exist. No above-the-fold or mobile-findability claim follows from source alone. |
| routes/index.tsx | Main order Hero → Calculator → Proof → Framework → PhoneInquiryBridge → Research → Close | Bridge is later in document; do not infer actual scroll distance or reading time without measurement. |
| phone-inquiry-bridge.tsx | “Follow one phone question through to your own choice”; “Begin the phone inquiry” → /smartphone | Accepted task-focused entry wording already exists; no need to invent a new scientific/product promise. |
| Bridge boundary | “It does not recommend a purchase. It does not prove the Protect Four proposition. It is not a complete life-cycle assessment.” | Entry prominence candidate must preserve these exact meaning boundaries. Current link already associates this boundary through aria-describedby. |

## Existing evidence and the precise remaining gap

The UX brief R4 is pilot-first: test what first-time visitors think PSI offers and how they would begin before rewriting homepage hierarchy. Existing #182/#184 participant kit starts by telling people to open the given phone page or the “Phone inquiry” menu link. Its Part1 asks purpose/next action on that page. That is useful phone-entry feedback, but **cannot establish unprompted homepage phone-link findability**, because the instructions already identify the destination. Do not retrofit a claim that a homepage-entry test has been performed.

Real Reviewer D's two Ledger controls are handled through #209/#212/#213; neither establishes a homepage-navigation failure. Synthetic slider/route source checks and merged PR counts do not establish entry comprehension.

## Smallest useful next action

Use the already approved Owner-arranged voluntary walkthrough route for an **unprimed homepage lead-in before phone-specific instructions**, if a future reviewer is willing. This is internal preparation, not an edited participant kit, new recruitment task or contact instruction. Suggested neutral observation sequence for that future session:
1. Before naming the phone route, ask what the homepage appears to offer and what the person expects to be able to do.
2. Invite one natural first action and observe what they choose, without pointing out a link or correcting their interpretation.
3. Record only anonymous paraphrase, URL/build when verifiable, device/language, starting page and actual coverage. Then, separately, the existing optional phone walkthrough may proceed with its original voluntary/privacy/fictional-answer limits.

Record coaching and direct-route starting separately; neither is a failure. No private raw answers/names/recordings, recruitment, tracking, counters or click-conversion objective. Human understanding/retention remains unverified until real observations arrive.

## Bounded later design candidate, only if evidence supports it

If entry is confusing, evaluate making the existing bridge entry more prominent with its accepted wording and adjacent boundary; compare with the current hero-to-Ledger route. Do not replace the headline, require phone inquiry, hide Ledger or rewrite AP/Principles/German content in a cosmetic task. A faithful prominence-only candidate could be prepared after the observation establishes the actual problem; product/interaction meaning changes require appropriate selection/review.

For any future selected visual patch, require same copy/targets/order semantics unless explicitly selected, keyboard/focus/link behavior,320/390/1280 rendering, no new data/state/calculator changes and independent exact-head review. Do not dispatch a complete R3–R5 redesign or another audit merely to keep an executor active.

Next dependency is human entry evidence via the existing voluntary Owner-arranged route. No new Owner approval is needed for this completed source mapping; no implementation is preselected. R3 prototype remains available but its increased page length does not resolve R4.
