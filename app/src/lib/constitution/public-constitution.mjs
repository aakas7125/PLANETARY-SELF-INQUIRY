/**
 * Accepted English public Constitution copy.
 * Source: handoffs/ap/HQ-AP-2026-10-15-003-public-constitution.md §§1–4.
 * Adoption: project-state/DECISIONS.md D-007.
 * D-007 changes only the accountability href, from /issues/new to the public tracker landing page.
 */

export const PUBLIC_CONSTITUTION_SOURCE = {
  handoff: "handoffs/ap/HQ-AP-2026-10-15-003-public-constitution.md",
  sections: "1-4",
  decision: "D-007",
};

export const PUBLIC_CONSTITUTION_PAGE_TITLE = "What PSI promises you";

export const PUBLIC_CONSTITUTION_ACCOUNTABILITY_HREF =
  "https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues";

export const PUBLIC_CONSTITUTION_SECTION_HEADINGS = [
  "Your words stay yours",
  "Evidence should show its limits",
  "Consequences without blame",
  "Design should clarify, not steer",
  "Inquiry, not a verdict",
  "Privacy in this public beta",
  "Hold us to these promises",
];

export const PUBLIC_CONSTITUTION_REVIEW_LINKS = [
  {
    label: "Project Constitution",
    href: "https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/blob/main/PROJECT_CONSTITUTION.md",
  },
  {
    label: "English public-copy handoff",
    href: "https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/blob/main/handoffs/ap/HQ-AP-2026-10-15-003-public-constitution.md",
  },
  {
    label: "Public beta profile",
    href: "https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/blob/main/project-state/PUBLIC_BETA_PROFILE.md",
  },
];

/** Internal authority notes. Not rendered as the public story. */
export const PUBLIC_CONSTITUTION_AUTHORITY = {
  "PC-OPEN-01": "Constitution P1, P3, P6, P16; D-006; category separation and final user autonomy",
  "PC-RAW-01": "Constitution P5–P6; raw-answer and non-diagnosis boundaries",
  "PC-EVID-01": "Constitution P7, P10, P13; empirical uncertainty boundaries",
  "PC-EVID-02": "Constitution P10; inspectable empirical presentation",
  "PC-EVID-03": "Constitution P8; no unified score",
  "PC-SEPARATE-01": "Constitution P1–P2; D-006",
  "PC-PMF-01": "Constitution P11; Project Interpretation, not a direct AP claim",
  "PC-CAUSE-01": "Constitution P12; D-005 conditional pathway boundary",
  "PC-DESIGN-01": "Constitution P3, P13–P14; conflict rule; D-006",
  "PC-DESIGN-02": "D-006; Constitution P3, P5, P14, P16",
  "PC-DISTINCT-01": "Constitution P9, P13; conflict rule",
  "PC-INPUT-01": "Constitution P15",
  "PC-INQUIRY-01": "D-006; Constitution P3, P16; open-choice and non-diagnosis boundaries",
  "PC-CHOICE-01": "Constitution P3–P4, P8; final-choice legitimacy",
  "PC-CHOICE-02": "Constitution P16; final choice belongs to the user",
  "PC-PRIV-01": "PUBLIC_BETA_PROFILE.md public surface; release verification required",
  "PC-PRIV-02": "D-006 privacy restraint; not a deletion or device-only promise",
  "PC-ACCOUNT-01": "D-006; D-007 public tracker landing page",
  "PC-ACCOUNT-02": "Public-issue disclosure",
  "PC-ACCOUNT-03": "Feedback is not automatic scientific, philosophical, or product authority",
  "PC-CONFLICT-01": "Constitution conflict rule; P13–P14",
};

export const PUBLIC_CONSTITUTION_UNITS = {
  "PC-OPEN-01": {
    id: "PC-OPEN-01",
    text: "Planetary Self-Inquiry is built to help you look more clearly at an ordinary decision without deciding for you. It brings together your own answers, evidence and modelling, and a clearly labelled philosophical lens — then returns the choice to you.",
  },
  "PC-RAW-01": {
    id: "PC-RAW-01",
    text: "PSI asks questions rather than telling you what is happening “deep down.” Your raw answers remain the authority. If you are unsure or disagree, that uncertainty or disagreement can remain exactly that.",
  },
  "PC-EVID-01": {
    id: "PC-EVID-01",
    text: "PSI shows what the evidence supports, the assumptions being used, and what is still unknown. Unknown does not become zero, “no impact,” or certainty just because a number is missing.",
  },
  "PC-EVID-02": {
    id: "PC-EVID-02",
    text: "Important claims, sources, limits, confidence and modelling boundaries should remain inspectable.",
  },
  "PC-EVID-03": {
    id: "PC-EVID-03",
    text: "Different kinds of consequences — such as climate, materials, water, waste, people and ecosystems — stay distinct rather than being collapsed into one environmental or moral score.",
  },
  "PC-SEPARATE-01": {
    id: "PC-SEPARATE-01",
    text: "Evidence, modelling assumptions and philosophical interpretation stay distinguishable. A philosophical source, including Acharya Prashant, is not treated as scientific proof.",
  },
  "PC-PMF-01": {
    id: "PC-PMF-01",
    text: "“Protect My Four” is PSI’s Project Interpretation, not a direct Acharya Prashant claim.",
  },
  "PC-CAUSE-01": {
    id: "PC-CAUSE-01",
    text: "PSI can make wider material, human and ecological pathways understandable without telling you that one person’s phone decision caused a particular victim or event. Modelled or conditional pathways are presented as modelled or conditional, not as realized individual harm.",
  },
  "PC-DESIGN-01": {
    id: "PC-DESIGN-01",
    text: "Simple language, visuals and engagement can help understanding, but they must not erase uncertainty or push you toward a preferred purchase outcome.",
  },
  "PC-DESIGN-02": {
    id: "PC-DESIGN-02",
    text: "PSI does not use guilt or shame as a tactic to force a “right” answer.",
  },
  "PC-DISTINCT-01": {
    id: "PC-DISTINCT-01",
    text: "Where a distinction matters scientifically, simplification should not erase it.",
  },
  "PC-INPUT-01": {
    id: "PC-INPUT-01",
    text: "PSI also tries to ask you mainly for things you can reasonably know or estimate; technical assumptions belong in the evidence or model layer rather than in guesses demanded from you.",
  },
  "PC-INQUIRY-01": {
    id: "PC-INQUIRY-01",
    text: "PSI’s intended intervention is inquiry and clearer seeing. It does not promise enlightenment, psychological change, a smaller footprint, or any particular behaviour.",
  },
  "PC-CHOICE-01": {
    id: "PC-CHOICE-01",
    text: "There is no hidden correct purchase and no moral score. Keep, repair, used or second-hand, refurbished, new, investigate further and unclear can all remain legitimate where applicable.",
  },
  "PC-CHOICE-02": {
    id: "PC-CHOICE-02",
    text: "The final choice is yours. PSI does not select it for you.",
  },
  "PC-PRIV-01": {
    id: "PC-PRIV-01",
    text: "For this public beta, the accepted profile is anonymous: no account or login, no analytics or tracking, no non-essential cookies, and no persistent user-data store.",
  },
  "PC-PRIV-02": {
    id: "PC-PRIV-02",
    text: "That is deliberately narrower than promising that every answer always stays only on your device, that data is automatically deleted, or that every possible deployment has identical privacy properties. PSI should make broader privacy claims only when the released implementation has actually been verified to support them.",
  },
  "PC-ACCOUNT-01": {
    id: "PC-ACCOUNT-01",
    text: "If PSI’s wording, evidence or behaviour seems to break these commitments, you can raise it in the public project issue tracker.",
    linkPhrase: "public project issue tracker",
    href: PUBLIC_CONSTITUTION_ACCOUNTABILITY_HREF,
  },
  "PC-ACCOUNT-02": {
    id: "PC-ACCOUNT-02",
    text: "GitHub issues are public. Please do not post private answers, sensitive information or personal details there.",
  },
  "PC-ACCOUNT-03": {
    id: "PC-ACCOUNT-03",
    text: "Feedback can trigger investigation, but it does not automatically become scientific, philosophical or product authority.",
  },
  "PC-CONFLICT-01": {
    id: "PC-CONFLICT-01",
    text: "If visual polish, engagement or completion pressure conflicts with these commitments, these commitments come first.",
  },
};

export const PUBLIC_CONSTITUTION_SCENES = [
  {
    id: "life",
    title: "Your life is where the question starts",
    visual: "life",
    blocks: [
      { unitIds: ["PC-OPEN-01"] },
      { heading: "Your words stay yours", unitIds: ["PC-RAW-01"] },
    ],
  },
  {
    id: "choices",
    title: "Ordinary choices repeat",
    visual: "choices",
    blocks: [{ unitIds: ["PC-CHOICE-01", "PC-INPUT-01"] }],
  },
  {
    id: "systems",
    title: "Choices sit inside wider systems",
    visual: "systems",
    blocks: [
      { heading: "Consequences without blame", unitIds: ["PC-CAUSE-01", "PC-PMF-01"] },
    ],
  },
  {
    id: "evidence",
    title: "Evidence has edges",
    visual: "evidence",
    blocks: [
      {
        heading: "Evidence should show its limits",
        unitIds: ["PC-EVID-01", "PC-EVID-02", "PC-EVID-03", "PC-SEPARATE-01", "PC-DISTINCT-01"],
      },
    ],
  },
  {
    id: "questions",
    title: "Questions, not judgement",
    visual: "questions",
    blocks: [
      { unitIds: ["PC-RAW-01"] },
      { heading: "Design should clarify, not steer", unitIds: ["PC-DESIGN-01", "PC-DESIGN-02"] },
      { heading: "Inquiry, not a verdict", unitIds: ["PC-INQUIRY-01"] },
    ],
  },
  {
    id: "return",
    title: "The choice returns to you",
    visual: "return",
    blocks: [
      { unitIds: ["PC-CHOICE-02"] },
      { heading: "Privacy in this public beta", unitIds: ["PC-PRIV-01", "PC-PRIV-02"] },
      {
        heading: "Hold us to these promises",
        unitIds: ["PC-ACCOUNT-02", "PC-ACCOUNT-01", "PC-ACCOUNT-03", "PC-CONFLICT-01"],
      },
    ],
  },
];

export function listConstitutionUnitIdsInSectionOrder() {
  return Object.keys(PUBLIC_CONSTITUTION_UNITS);
}
