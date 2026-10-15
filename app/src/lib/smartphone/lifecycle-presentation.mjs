/**
 * Read-only generic smartphone lifecycle presentation.
 *
 * Wording, ranges, statuses, and optional explainers come from the accepted
 * Table A map and the accepted smartphone package. This module does not
 * evaluate a comparison, assign stage shares, or open an inquiry gate.
 */

const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;

export const LIFECYCLE_BANNER =
  "These stages show where smartphone impacts can arise. They are not additive shares of one phone’s footprint unless an accepted source explicitly provides compatible stage values.";

export const LIFECYCLE_PRODUCTION_KG = Object.freeze([25, 70]);
export const LIFECYCLE_DISTRIBUTION_KG = Object.freeze([2, 4]);
export const LIFECYCLE_CHARGING_CENTRAL_KWH_PER_YEAR = 4;
export const LIFECYCLE_CHARGING_SENSITIVITY_KWH_PER_YEAR = Object.freeze([2, 8]);
export const LIFECYCLE_BATTERY_REPAIR_KG = Object.freeze([0.3, 0.7]);
export const LIFECYCLE_DISPLAY_REPAIR_KG = Object.freeze([3, 8]);
export const LIFECYCLE_ADEME_REFERENCE_KG = 7.61;
export const LIFECYCLE_ADEME_REFERENCE_YEARS = 2;

const SECTION = Object.freeze({
  generally: "What we know generally",
  thisPhone: "What this tells us about your phone",
  sources: "Sources and limits",
  explore: "Explore further",
});

const HANDSET_LIMIT =
  "This generic guide does not establish manufacturing, facility, feedstock, route, or handling details about your actual handset.";

const EXPLORE_NOTE =
  "Optional links are further context. They are not automatically evidence in this project, and they are not numerical authority.";

const FAIRPHONE = Object.freeze({
  label: "Fairphone 5 LCA PDF",
  provenance:
    "Fraunhofer IZM, commissioned by Fairphone. This is a model-specific worked example, not generic authority.",
  href: "https://www.fairphone.com/wp-content/uploads/2024/09/Fairphone5_LCA_Report_2024.pdf",
});

const FAIRPHONE_SECOND_LIFE = Object.freeze({
  label: FAIRPHONE.label,
  provenance:
    "Fraunhofer IZM, commissioned by Fairphone. This may illustrate repair and lifetime mechanics. It is not generic refurbishment authority, and it is not generic authority.",
  href: FAIRPHONE.href,
});

const EUROPEAN_COMMISSION = Object.freeze({
  label: "European Commission smartphones and tablets page",
  provenance:
    "Institutional and regulatory explainer. It is useful for durability, battery-cycle, repair, spares, and update context. It is not an LCA dataset.",
  href: "https://energy-efficient-products.ec.europa.eu/product-list/smartphones-and-tablets_en",
});

const E_WASTE_MONITOR = Object.freeze({
  label: "ITU/UNITAR Global E-waste Monitor 2024",
  provenance: "Institutional global statistics. This is not one phone’s fate or probability.",
  href: "https://www.itu.int/pub/D-GEN-E_WASTE.01-2024",
});

const WHO_EWASTE = Object.freeze({
  label: "WHO e-waste health explainer",
  provenance:
    "International public-health institution. This is conditional unsafe-handling context, not this phone’s fate.",
  href: "https://www.who.int/news-room/questions-and-answers/item/children-and-digital-dumpsites-e-waste-and-health",
});

/**
 * @param {string} text
 * @returns {string}
 */
function publicLine(text) {
  if (typeof text !== "string" || text.length === 0 || SNAKE_CASE_TOKEN.test(text)) {
    throw new Error("Public lifecycle line contains an internal token");
  }
  return text;
}

/**
 * @param {readonly number[]} pair
 * @returns {string}
 */
function rangeText(pair) {
  return `${pair[0]}–${pair[1]}`;
}

/**
 * @param {readonly { label: string, provenance: string, href: string }[]} explainers
 */
function explore(explainers) {
  return Object.freeze({
    heading: publicLine(SECTION.explore),
    note: publicLine(EXPLORE_NOTE),
    links: Object.freeze(
      explainers.map((explainer) =>
        Object.freeze({
          label: publicLine(explainer.label),
          provenance: publicLine(explainer.provenance),
          href: explainer.href,
        }),
      ),
    ),
  });
}

/**
 * @param {{
 *   id: string,
 *   label: string,
 *   generally: string,
 *   thisPhone: readonly string[],
 *   sources: readonly string[],
 *   explainers?: readonly { label: string, provenance: string, href: string }[],
 * }} stageRecord
 */
function stage(stageRecord) {
  const explainers = stageRecord.explainers ?? [];
  return Object.freeze({
    id: stageRecord.id,
    label: publicLine(stageRecord.label),
    generallyHeading: publicLine(SECTION.generally),
    generally: publicLine(stageRecord.generally),
    thisPhoneHeading: publicLine(SECTION.thisPhone),
    thisPhoneLines: Object.freeze(stageRecord.thisPhone.map(publicLine)),
    sourcesHeading: publicLine(SECTION.sources),
    sourceLines: Object.freeze(stageRecord.sources.map(publicLine)),
    explore: explainers.length > 0 ? explore(explainers) : null,
  });
}

const S1 =
  "Source S1. Cordella, Alfieri & Sanfelix, 2021, Journal of Industrial Ecology / JRC-origin research. Smartphone material-efficiency LCA; manufacturing, charging, repair/lifetime and 1:1 reuse scenarios.";

const STAGES = Object.freeze([
  stage({
    id: "raw-materials",
    label: "Raw materials",
    generally:
      "A new phone creates demand for processed materials. That supply can include primary and recycled feedstock.",
    thisPhone: [
      HANDSET_LIMIT,
      "It does not state a mine, ore grade, primary-mined mass, habitat area, or exact recycled share. Model identity alone does not establish primary extraction.",
    ],
    sources: [
      "Approved generic process statement. The primary or recycled share is unknown for an arbitrary phone.",
      S1,
      "R&E-V0-SMARTPHONE-0.3.0, materials. Empirical smartphone contract, old-device fate, waste, materials and water.",
    ],
    explainers: [FAIRPHONE],
  }),
  stage({
    id: "refining-processing",
    label: "Refining and processing",
    generally:
      "Raw-material extraction and processing sit inside the manufacturing boundary used by the accepted smartphone LCA evidence.",
    thisPhone: [
      HANDSET_LIMIT,
      "It does not infer a facility, process chemistry, electricity mix, geography, or a refining-only carbon share for your phone.",
    ],
    sources: [
      "Approved boundary statement. No generic refining-only carbon share is accepted.",
      "The accepted manufacturing boundary includes extraction and processing, parts manufacture, and assembly.",
      S1,
      "R&E-V0-SMARTPHONE-0.3.0, manufacturing boundary and materials.",
    ],
    explainers: [FAIRPHONE],
  }),
  stage({
    id: "components",
    label: "Components",
    generally:
      "Component and parts manufacture is part of the production footprint. We do not have a supported generic component-by-component split.",
    thisPhone: [
      HANDSET_LIMIT,
      `It does not allocate the ${rangeText(LIFECYCLE_PRODUCTION_KG)} kg CO₂e production bracket to a chip, display, battery, or camera.`,
    ],
    sources: [
      "Approved production-boundary statement. A generic component-by-component allocation is unavailable.",
      "Battery and display repair burdens are separate intervention records, not a decomposition of original production.",
      S1,
      "R&E-V0-SMARTPHONE-0.3.0, manufacturing boundary. Empirical smartphone contract, values, statuses and constraints.",
    ],
    explainers: [FAIRPHONE],
  }),
  stage({
    id: "assembly",
    label: "Assembly",
    generally:
      "Assembly is included in the accepted manufacturing boundary. No separate generic assembly footprint is assigned here.",
    thisPhone: [
      HANDSET_LIMIT,
      "It does not assign a subtraction-derived or guessed assembly subtotal.",
    ],
    sources: [
      "Approved boundary statement. An assembly-only value is unavailable.",
      S1,
      "R&E-V0-SMARTPHONE-0.3.0, manufacturing boundary and materials.",
    ],
    explainers: [FAIRPHONE],
  }),
  stage({
    id: "distribution-transport",
    label: "Distribution and transport",
    generally: `For a generic new phone, finished-device distribution is represented by an approved ${rangeText(LIFECYCLE_DISTRIBUTION_KG)} kg CO₂e fallback range when no applicable exact model record is available.`,
    thisPhone: [
      HANDSET_LIMIT,
      "The exact route, mode, and distance for your phone remain unknown unless a source establishes them. Transport and distribution keep the source’s own phase label and boundary.",
    ],
    sources: [
      `Finished-device distribution is ${rangeText(LIFECYCLE_DISTRIBUTION_KG)} kg CO₂e/device when no applicable exact model record is available.`,
      "Status: Approved V0 fallback. Confidence: Moderate. A model-specific source phase is preferred when one applies.",
      "This is a general record. It is not this phone’s exact distribution total, a selected route, or a purchase recommendation.",
      S1,
      "R&E-V0-SMARTPHONE-0.3.0, generic finished-device distribution. Empirical smartphone contract, values.",
    ],
  }),
  stage({
    id: "use-repair",
    label: "Use and repair",
    generally: `Charging energy depends on use. V0 uses ${LIFECYCLE_CHARGING_CENTRAL_KWH_PER_YEAR} kWh/year as a central product-class fallback with a ${rangeText(LIFECYCLE_CHARGING_SENSITIVITY_KWH_PER_YEAR)} kWh/year sensitivity; charging carbon stays unknown without an approved relevant grid factor. Supported battery/display repair ranges apply only to their stated repair scenarios.`,
    thisPhone: [
      HANDSET_LIMIT,
      "Actual charging, grid factor, repair type, repair timing, success, and post-repair service remain facts about the case. This guide does not supply a service duration.",
    ],
    sources: [
      `Charging energy is ${LIFECYCLE_CHARGING_CENTRAL_KWH_PER_YEAR} kWh/year as the central product-class fallback, with a sensitivity of ${rangeText(LIFECYCLE_CHARGING_SENSITIVITY_KWH_PER_YEAR)} kWh/year.`,
      "Status: Approved V0 fallback. Confidence: Moderate. This record is energy, not carbon. Charging carbon stays unknown without an approved relevant grid factor.",
      "Communication networks and data centres are outside this handset charging record.",
      `Battery repair is ${rangeText(LIFECYCLE_BATTERY_REPAIR_KG)} kg CO₂e. Status: Provisional generic range. This is a scenario bracket, not a confidence interval, and it applies only to the stated battery-repair scenario.`,
      `Display repair is ${rangeText(LIFECYCLE_DISPLAY_REPAIR_KG)} kg CO₂e. Status: Provisional generic range. This is a scenario bracket, not a confidence interval, and it applies only to the stated display-repair scenario.`,
      "These repair records are not a split of original production. They are not this phone’s exact totals, selected interventions, or a complete future sequence.",
      S1,
      "R&E-V0-SMARTPHONE-0.3.0, charging and use, and generic repair ranges. Empirical smartphone contract, core pathway accounting and values.",
    ],
    explainers: [EUROPEAN_COMMISSION],
  }),
  stage({
    id: "resale-refurbishment-second-life",
    label: "Resale, refurbishment, and second life",
    generally:
      "Used and refurbished phones are different second-life pathways. Earlier manufacture stays a prior-life burden in the primary direct/cut-off view; it is not an avoided-new-phone credit. An arbitrary used or refurbished phone has no approved generic acquisition footprint.",
    thisPhone: [
      HANDSET_LIMIT,
      "Candidate service, the refurbishment process, shipping, preparation, and market displacement remain unknown unless supported. This guide does not give an arbitrary used or refurbished phone an acquisition burden.",
    ],
    sources: [
      "Used and refurbished stay distinct in this guide. An arbitrary acquisition burden stays unknown.",
      `The ADEME figure of ${LIFECYCLE_ADEME_REFERENCE_KG} kg CO₂e is an approved source-specific reference for its explicit ${LIFECYCLE_ADEME_REFERENCE_YEARS}-year opaque scenario. It is not a generic fallback. This guide does not apply it to an arbitrary used or refurbished candidate, and it does not change comparison results.`,
      "Source S5. ADEME, 2022, Assessment of environmental impact of refurbished products. New/refurbished reference comparison and variability.",
      "Source S6. ITU-T L.1410, 11/2024. ICT LCA methodology and ADEME refurbishment/depreciation example.",
      "R&E-V0-SMARTPHONE-0.3.0, refurbished direct cut-off view. Secondary pathways contract, pathway split, used, and refurbished.",
    ],
    explainers: [FAIRPHONE_SECOND_LIFE],
  }),
  stage({
    id: "end-of-life",
    label: "End of life",
    generally:
      "Global e-waste figures are context, not the fate of this phone. A phone’s actual route and handling stay unknown unless established. Unsafe or unsound handling pathways are conditional.",
    thisPhone: [
      HANDSET_LIMIT,
      "It does not infer informal handling, a dumpsite, a recycling probability, a victim, a site, or a pollution quantity. Discarded mass is not quantified here.",
    ],
    sources: [
      "Global context plus conditional pathways. An individual route or probability is not established by global collection rates.",
      "Source S7. ITU/UNITAR, Global E-waste Monitor 2024. Global e-waste mass and collection context.",
      "Source S11. WHO, Children and Digital Dumpsites, 2021 plus updated e-waste health material. Unsafe e-waste exposure and health pathway.",
      "Source S12. Systematic review of environmental heavy-metal contamination at e-waste sites. 59 studies / 8,286 measurements.",
      "R&E-V0-SMARTPHONE-0.3.0, old-device fate, waste, and conditional pathways. Empirical smartphone contract, old-device fate, waste, materials and water.",
    ],
    explainers: [E_WASTE_MONITOR, WHO_EWASTE],
  }),
]);

const PRODUCTION_LINES = Object.freeze([
  publicLine(
    `Generic new production is ${rangeText(LIFECYCLE_PRODUCTION_KG)} kg CO₂e/device (GWP100).`,
  ),
  publicLine(
    "Status: Approved V0 fallback. Confidence: Moderate. This is a heterogeneous LCA evidence bracket, not an average and not a distribution.",
  ),
  publicLine(
    "Production already includes raw-material extraction and processing, parts manufacture, and assembly. This guide does not assign stage shares of that range, and it does not add the stages to it again.",
  ),
]);

const PRODUCTION_DISCLOSURE = Object.freeze([
  publicLine(
    "Major assumption: the studies behind this bracket are not fully comparable, because their assumptions and datasets differ.",
  ),
  publicLine(
    "This is a general record for a generic new phone. It is not this phone’s exact production total, a selected intervention, or a purchase recommendation.",
  ),
  publicLine(S1),
  publicLine(
    "R&E-V0-SMARTPHONE-0.3.0, generic manufacturing fallback. Empirical smartphone contract, values, statuses and constraints.",
  ),
]);

/**
 * Static generic lifecycle guide. It does not read comparison, model, or inquiry state.
 *
 * @returns {Readonly<{
 *   sectionLabel: string,
 *   summary: string,
 *   roleNote: string,
 *   banner: string,
 *   inquiryBoundary: string,
 *   production: Readonly<{ heading: string, lines: readonly string[], disclosureSummary: string, disclosureLines: readonly string[] }>,
 *   stages: readonly Readonly<{
 *     id: string,
 *     label: string,
 *     generallyHeading: string,
 *     generally: string,
 *     thisPhoneHeading: string,
 *     thisPhoneLines: readonly string[],
 *     sourcesHeading: string,
 *     sourceLines: readonly string[],
 *     explore: null | Readonly<{ heading: string, note: string, links: readonly Readonly<{ label: string, provenance: string, href: string }>[] }>,
 *   }>[],
 * }>}
 */
export function describeLifecycleGuide() {
  return Object.freeze({
    sectionLabel: publicLine("Phone lifecycle evidence"),
    summary: publicLine("Phone lifecycle evidence"),
    roleNote: publicLine(
      "This optional guide shows accepted generic phone evidence. It is not a required step, a new calculator, or a complete comparison. It stays available when the phone model is unknown and when a comparison result is not ready. It does not replace facts you enter in the comparison.",
    ),
    banner: publicLine(LIFECYCLE_BANNER),
    inquiryBoundary: publicLine("This guide does not by itself open another inquiry."),
    production: Object.freeze({
      heading: publicLine("Generic new production"),
      lines: PRODUCTION_LINES,
      disclosureSummary: publicLine(SECTION.sources),
      disclosureLines: PRODUCTION_DISCLOSURE,
    }),
    stages: STAGES,
  });
}
