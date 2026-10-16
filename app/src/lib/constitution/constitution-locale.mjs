/**
 * Page-local Constitution language selection.
 * English remains canonical. German is the adopted D-008 pilot.
 * No stored locale, browser inference, or shared inquiry state.
 */

import {
  PUBLIC_CONSTITUTION_LABELS,
  PUBLIC_CONSTITUTION_REVIEW_LINK_IDS,
  PUBLIC_CONSTITUTION_SCENE_STRUCTURE,
  PUBLIC_CONSTITUTION_UNITS,
} from "./public-constitution.mjs";
import {
  PUBLIC_CONSTITUTION_DE_LABELS,
  PUBLIC_CONSTITUTION_DE_SOURCE,
  PUBLIC_CONSTITUTION_DE_UNITS,
} from "./public-constitution-de.mjs";

export const CONSTITUTION_LANGUAGE_LINKS = [
  { language: "en", label: "English" },
  { language: "de", label: "Deutsch (Pilot)" },
];

export const CONSTITUTION_CHOICE_LABEL_IDS = [
  "LBL-CHOICE-KEEP",
  "LBL-CHOICE-REPAIR",
  "LBL-CHOICE-USED",
  "LBL-CHOICE-REFURB",
  "LBL-CHOICE-NEW",
  "LBL-CHOICE-INVESTIGATE",
];

export const CONSTITUTION_OPEN_CHOICE_LABEL_IDS = [
  ...CONSTITUTION_CHOICE_LABEL_IDS,
  "LBL-CHOICE-UNCLEAR",
];

export const CONSTITUTION_SYSTEM_LABEL_IDS = [
  "LBL-SYSTEM-MATERIALS",
  "LBL-SYSTEM-PROCESSING",
  "LBL-SYSTEM-COMPONENTS",
  "LBL-SYSTEM-TRANSPORT",
  "LBL-SYSTEM-USE-REPAIR",
  "LBL-SYSTEM-SECOND-LIFE",
  "LBL-SYSTEM-EOL",
  "LBL-SYSTEM-PEOPLE",
  "LBL-SYSTEM-ECOSYSTEMS",
];

export const CONSTITUTION_EVIDENCE_LABEL_IDS = [
  "LBL-EVID-CLIMATE",
  "LBL-EVID-MATERIALS",
  "LBL-EVID-WATER",
  "LBL-EVID-WASTE",
  "LBL-EVID-PEOPLE",
  "LBL-EVID-ECOSYSTEMS",
];

/**
 * @param {unknown} lang
 * @returns {"en" | "de"}
 */
export function resolveConstitutionLanguage(lang) {
  return lang === "de" ? "de" : "en";
}

/**
 * @param {Record<string, unknown>} search
 * @returns {{ lang?: string }}
 */
export function constitutionSearch(search) {
  if (typeof search.lang !== "string") return {};
  return { lang: search.lang };
}

/**
 * @param {string} id
 * @param {Record<string, string>} labels
 */
function adoptedLabel(id, labels) {
  const text = labels[id];
  if (typeof text !== "string" || text.length === 0) return null;
  return text;
}

/**
 * @param {"en" | "de"} language
 * @param {{ labels?: Record<string, string>, units?: Record<string, { id: string, text: string, linkPhrase?: string, href?: string }> }} [sources]
 */
export function constitutionDocument(language, sources) {
  const resolved = language === "de" ? "de" : "en";
  const germanLabels = sources?.labels ?? PUBLIC_CONSTITUTION_DE_LABELS;
  const germanUnits = sources?.units ?? PUBLIC_CONSTITUTION_DE_UNITS;
  /** @type {string[]} */
  const fallbacks = [];

  /**
   * @param {string} id
   */
  function label(id) {
    const english = adoptedLabel(id, PUBLIC_CONSTITUTION_LABELS);
    if (english === null) {
      throw new Error(`Missing constitution label ${id}`);
    }
    if (resolved === "de") {
      const german = adoptedLabel(id, germanLabels);
      if (german === null) {
        fallbacks.push(id);
        return { id, text: english, lang: "en" };
      }
      return { id, text: german, lang: "de" };
    }
    return { id, text: english, lang: "en" };
  }

  /**
   * @param {string} id
   */
  const englishUnits = /** @type {Record<string, { id: string, text: string, linkPhrase?: string, href?: string }>} */ (
    PUBLIC_CONSTITUTION_UNITS
  );
  const germanUnitMap = /** @type {Record<string, { id: string, text: string, linkPhrase?: string, href?: string } | undefined>} */ (
    germanUnits
  );

  /**
   * @param {string} id
   */
  function unit(id) {
    const english = englishUnits[id];
    if (!english || typeof english.text !== "string" || english.text.length === 0) {
      throw new Error(`Missing constitution unit ${id}`);
    }
    if (resolved !== "de") {
      return {
        id,
        text: english.text,
        lang: "en",
        linkPhrase: english.linkPhrase,
        href: english.href,
      };
    }
    const german = germanUnitMap[id];
    if (!german || typeof german.text !== "string" || german.text.length === 0) {
      fallbacks.push(id);
      return {
        id,
        text: english.text,
        lang: "en",
        linkPhrase: english.linkPhrase,
        href: english.href,
      };
    }
    return {
      id,
      text: german.text,
      lang: "de",
      linkPhrase: german.linkPhrase,
      href: german.href,
    };
  }

  const scenes = PUBLIC_CONSTITUTION_SCENE_STRUCTURE.map((scene) => ({
    id: scene.id,
    title: label(scene.titleId),
    visual: scene.visual,
    blocks: scene.blocks.map((block) => ({
      heading: block.headingId ? label(block.headingId) : null,
      units: block.unitIds.map((id) => unit(id)),
    })),
  }));

  return {
    language: resolved,
    contentLang: resolved,
    source: resolved === "de" ? PUBLIC_CONSTITUTION_DE_SOURCE : null,
    pageTitle: label("LBL-PAGE-TITLE"),
    description: unit("PC-OPEN-01"),
    eyebrow: label("LBL-EYEBROW"),
    backHome: label("LBL-BACK-HOME"),
    scenes,
    sourcesSummary: label("LBL-SOURCES-SUMMARY"),
    sourcesIntro: label("LBL-SOURCES-INTRO"),
    reviewLinks: PUBLIC_CONSTITUTION_REVIEW_LINK_IDS.map((link) => ({
      ...label(link.labelId),
      href: link.href,
    })),
    choices: CONSTITUTION_CHOICE_LABEL_IDS.map((id) => label(id)),
    openChoices: CONSTITUTION_OPEN_CHOICE_LABEL_IDS.map((id) => label(id)),
    systems: CONSTITUTION_SYSTEM_LABEL_IDS.map((id) => label(id)),
    evidenceDomains: CONSTITUTION_EVIDENCE_LABEL_IDS.map((id) => label(id)),
    unknown: label("LBL-EVID-UNKNOWN"),
    modelled: label("LBL-EVID-MODELLED"),
    lifeCaption: label("LBL-LIFE-CAPTION"),
    choiceCaption: label("LBL-CHOICE-CAPTION"),
    systemCaption: label("LBL-SYSTEM-CAPTION"),
    evidenceCaption: label("LBL-EVID-CAPTION"),
    notSure: label("LBL-NOT-SURE"),
    questionCaption: label("LBL-QUESTION-CAPTION"),
    returnCaption: label("LBL-RETURN-CAPTION"),
    fallbacks,
  };
}
