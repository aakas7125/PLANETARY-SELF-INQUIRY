import { SMARTPHONE_JOURNEY_STAGES } from "./situation-ux.mjs";
import {
  CLIMATE_CLAIM_ID,
  CLIMATE_CLAIM_PACKAGE_COMMIT,
  PATHWAY_KIND_CONDITIONAL_PRESSURE_TO_OUTCOME,
  resolveClimatePathwayBoundary,
} from "./empirical-climate-boundary.mjs";
import {
  MINING_ECO_CLAIM_ID,
  MINING_ECO_CLAIM_PACKAGE_COMMIT,
  PATHWAY_KIND_QUALITATIVE_CONDITIONAL as MINING_ECO_OUTPUT,
  resolveMiningEcoPathwayBoundary,
} from "./empirical-mining-eco-boundary.mjs";
import {
  MINING_PEOPLE_CLAIM_ID,
  MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
  PATHWAY_KIND_QUALITATIVE_CONDITIONAL as MINING_PEOPLE_OUTPUT,
  resolveMiningPeoplePathwayBoundary,
} from "./empirical-mining-people-boundary.mjs";
import {
  EWASTE_PEOPLE_CLAIM_ID,
  EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
  PATHWAY_KIND_QUALITATIVE_CONDITIONAL as EWASTE_PEOPLE_OUTPUT,
  resolveEwastePeoplePathwayBoundary,
} from "./empirical-ewaste-people-boundary.mjs";
import {
  EWASTE_ECO_CLAIM_ID,
  EWASTE_ECO_CLAIM_PACKAGE_COMMIT,
  PATHWAY_KIND_QUALITATIVE_CONDITIONAL as EWASTE_ECO_OUTPUT,
  resolveEwasteEcoPathwayBoundary,
} from "./empirical-ewaste-eco-boundary.mjs";
import {
  PATHWAY_KIND_QUALITATIVE,
  WATER_CLAIM_ID,
  WATER_CLAIM_PACKAGE_COMMIT,
  resolveWaterPathwayBoundary,
} from "./empirical-water-boundary.mjs";

/**
 * Presentation for conditional impact and dependency pathways.
 *
 * Each domain is requested from its existing resolver with the pinned claim
 * identity and the authorized output kind. A selected comparison pathway is
 * not a condition. Cards render only from an authorized emission.
 */

const SNAKE_CASE_TOKEN = /[a-z0-9]+_[a-z0-9_]+/;

export const IMPACT_OPENING =
  "These are conditional pathways. They describe relationships from pressure to outcome. They are not proof that one phone harmed a particular person, place, species, or event.";

export const IMPACT_SELECTION_NOTE =
  "The pathways you chose to inspect are listed here. Choosing one does not prove or avoid a pathway below.";

export const IMPACT_RANGE_NOTE =
  "Quantified climate ranges stay on the comparison. They are not repeated here as a cause.";

export const IMPACT_UNKNOWN_NOTE =
  "Transfer, process, old-device fate, water quantity, and material demand were not supplied here. Each stays unknown and is not treated as zero.";

export const IMPACT_BOUNDARY =
  "Nothing here ranks those pathways or tells you what to buy.";

export const IMPACT_CLOSED_NOTE =
  "Impact and dependency pathways open only after the comparison results are entered.";

export const IMPACT_LIMIT_LINE =
  "This is conditional. It is not proof that one phone caused a particular harm, and the pathway you chose does not prove or avoid it.";

export const IMPACT_CHROME = Object.freeze({
  eyebrow: "Phone inquiry",
  title: "Impact and dependency pathways",
  continueFromComparison: "Continue to impact and dependency pathways",
  back: "Back to comparison",
  disclosureSummary: "Sources and limits",
});

const INQUIRY_CLEAR_ACTIONS = new Set([
  "set_raw",
  "mark_not_sure",
  "set_choice",
  "set_shift",
  "edit_question",
  "reset",
  "back",
]);

/**
 * @type {readonly {
 *   id: "climate" | "mining-eco" | "mining-people" | "ewaste-people" | "ewaste-eco" | "water",
 *   heading: string,
 *   claimId: string,
 *   claimVersion: string,
 *   requestedOutput: string,
 *   resolve: (input: Record<string, unknown>) => { emitted?: boolean, reason_code?: string | null, claim_id?: string | null, claim_version?: string | null, pathway?: Record<string, unknown> | null },
 * }[]}
 */
const IMPACT_DOMAINS = Object.freeze([
  Object.freeze({
    id: "climate",
    heading: "Climate",
    claimId: CLIMATE_CLAIM_ID,
    claimVersion: CLIMATE_CLAIM_PACKAGE_COMMIT,
    requestedOutput: PATHWAY_KIND_CONDITIONAL_PRESSURE_TO_OUTCOME,
    resolve: resolveClimatePathwayBoundary,
  }),
  Object.freeze({
    id: "mining-eco",
    heading: "Mining pressure and ecosystems",
    claimId: MINING_ECO_CLAIM_ID,
    claimVersion: MINING_ECO_CLAIM_PACKAGE_COMMIT,
    requestedOutput: MINING_ECO_OUTPUT,
    resolve: resolveMiningEcoPathwayBoundary,
  }),
  Object.freeze({
    id: "mining-people",
    heading: "Mining pressure and people",
    claimId: MINING_PEOPLE_CLAIM_ID,
    claimVersion: MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
    requestedOutput: MINING_PEOPLE_OUTPUT,
    resolve: resolveMiningPeoplePathwayBoundary,
  }),
  Object.freeze({
    id: "ewaste-people",
    heading: "E-waste and people",
    claimId: EWASTE_PEOPLE_CLAIM_ID,
    claimVersion: EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
    requestedOutput: EWASTE_PEOPLE_OUTPUT,
    resolve: resolveEwastePeoplePathwayBoundary,
  }),
  Object.freeze({
    id: "ewaste-eco",
    heading: "E-waste and ecosystems",
    claimId: EWASTE_ECO_CLAIM_ID,
    claimVersion: EWASTE_ECO_CLAIM_PACKAGE_COMMIT,
    requestedOutput: EWASTE_ECO_OUTPUT,
    resolve: resolveEwasteEcoPathwayBoundary,
  }),
  Object.freeze({
    id: "water",
    heading: "Water",
    claimId: WATER_CLAIM_ID,
    claimVersion: WATER_CLAIM_PACKAGE_COMMIT,
    requestedOutput: PATHWAY_KIND_QUALITATIVE,
    resolve: resolveWaterPathwayBoundary,
  }),
]);

const STATUS_PUBLIC = Object.freeze({
  APPROVED: "Approved",
  APPROVED_QUALITATIVE: "Approved qualitative",
  QUALITATIVE: "Qualitative",
});

const CONFIDENCE_PUBLIC = Object.freeze({
  high: "High",
  moderate: "Moderate",
  high_for_water_use_low_to_moderate_for_arbitrary_phone_consequence:
    "High for water use, and low to moderate for an arbitrary phone's consequence.",
});

const SCOPE_PUBLIC = Object.freeze({
  product_class: "Product class",
  global_assessment: "Global assessment",
  systematic_review: "Systematic review",
  site_specific: "Site-specific",
  authoritative_assessment: "Authoritative assessment",
  model_specific: "Specific to a stated model",
});

const LIMIT_PUBLIC = Object.freeze({
  pressure_to_outcome_only: "This is a pressure-to-outcome relationship.",
  conditional_pathway: "This is conditional.",
  conditional_pathway_is_not_causal_proof: "It is not proof of a cause.",
  qualitative_pathway_is_not_causal_proof: "It is not proof of a cause.",
  no_named_person_species_place_or_event_attribution:
    "It does not name a person, species, place, or event.",
  no_victims_or_deaths_caused_or_avoided:
    "It does not say one phone harmed or spared a particular person.",
  no_exact_individual_human_or_ecological_damage:
    "It does not state exact harm to one person or one place.",
  no_unified_environmental_safety_protect_four_or_moral_score:
    "It is not combined into one score.",
  not_attributable_to_specific_device: "It is not attributed to one specific phone.",
  no_device_to_mine_mine_to_phone_or_device_to_ecosystem_attribution:
    "It does not trace one phone to one mine or one ecosystem.",
  no_named_species_ecosystem_place_community_or_event_attribution_to_one_phone:
    "It does not name a species, ecosystem, place, community, or event as the result of one phone.",
  no_biodiversity_area_or_species_loss_quantities:
    "It does not quantify how much living diversity changed.",
  no_fixed_primary_ore_or_material_mass_for_arbitrary_phone:
    "It does not fix an ore or material mass for an arbitrary phone.",
  no_exact_individual_ecological_or_human_damage:
    "It does not state exact harm to one person or one place.",
  no_numerical_burden_damage_score_probability_or_location:
    "It does not add a burden number, a probability, or a location.",
  site_specific_scope_preserved: "The site-specific scope is kept.",
  no_worker_or_community_outcome_attributed_to_one_phone:
    "A worker or community outcome is not attributed to one phone.",
  no_named_worker_community_person_place_site_or_event_attribution_to_one_phone:
    "It does not name a worker, community, person, place, site, or event as the result of one phone.",
  no_illness_injury_or_death_counts: "It does not count how many people were hurt.",
  no_exact_exposure_dose_risk_or_probability:
    "It does not state exposure, dose, risk, or probability.",
  no_exact_individual_or_community_damage:
    "It does not state exact harm to one person or one community.",
  authoritative_assessment_scope_preserved: "The authoritative-assessment scope is kept.",
  no_exposure_or_health_outcome_attributed_to_one_phone:
    "An exposure or health outcome is not attributed to one phone.",
  no_named_person_child_worker_community_place_site_or_event_attribution:
    "It does not name a person, child, worker, community, place, site, or event.",
  no_illness_injury_death_or_victim_counts: "It does not count how many people were hurt.",
  no_global_collection_rate_as_individual_route_or_probability:
    "A global collection rate is not an individual route or a probability.",
  no_numerical_burden_score_probability_or_location:
    "It does not add a burden number, a probability, or a location.",
  fate_or_disposal_context_does_not_establish_unsafe_or_informal_handling:
    "A device fate or disposal note does not establish unsafe or informal handling.",
  systematic_review_scope_preserved: "The systematic-review scope is kept.",
  no_contaminated_site_medium_species_ecosystem_or_event_attributed_to_one_phone:
    "A contaminated site, medium, species, ecosystem, or event is not attributed to one phone.",
  no_named_site_place_water_body_ecosystem_species_or_event_attribution:
    "It does not name a site, place, water body, ecosystem, species, or event.",
  no_metal_identity_concentration_contamination_magnitude_or_measurement_quantity:
    "It does not state a metal, a concentration, a magnitude, or a measurement count.",
  source_scope_study_and_measurement_counts_remain_source_metadata:
    "Study and measurement counts stay with the source. They are not a result for one phone.",
  no_exact_individual_ecological_damage: "It does not state exact harm to one place.",
  no_probability_or_location: "It does not add a probability or a location.",
  fate_context_or_source_scope_counts_do_not_establish_unsound_site_handling:
    "A device fate or a source-scope count does not establish unsound site handling.",
  qualitative_status_preserved: "The qualitative status is kept.",
  product_class_and_model_specific_scope_preserved:
    "Product-class and model-specific scope are kept.",
  confidence_qualification_preserved: "The confidence qualification is kept.",
  local_consequences_depend_on_geography_and_indicator:
    "Local consequences depend on geography and the indicator.",
  no_inferred_local_consequence_harm_location_probability_or_affected_population:
    "It does not infer a local consequence, a location, a probability, or how many people were affected.",
  no_quantitative_output_without_accepted_model_specific_water_indicator_record:
    "A number is not shown without an accepted model-specific water record, and none is supplied here.",
  no_generic_litres_per_phone: "It does not state a generic water quantity per phone.",
  no_litres_of_drinking_water_denied: "It does not state that drinking water was withheld.",
  no_conflation_or_conversion_among_withdrawal_consumption_scarcity_deprivation_stress_use_or_drinking_water:
    "Withdrawal, consumption, scarcity, deprivation, stress, use, and drinking water stay distinct.",
  no_named_person_community_ecosystem_species_place_watershed_facility_model_consequence_or_event_attributed_to_one_phone:
    "It does not name a person, community, ecosystem, species, place, watershed, facility, model consequence, or event as the result of one phone.",
  no_water_scarcity_or_stress_outcome: "It does not state a scarcity or stress outcome.",
});

const CONDITION_DENIAL =
  "This pathway is not shown. Its condition is not established from the facts given, and that gap was not filled in.";

const AUTHORITY_DENIAL =
  "This pathway is not shown. The accepted claim was not returned.";

const PROHIBITED_DENIAL =
  "This pathway is not shown. The request asks for something this pathway does not say.";

const CASE_DENIAL = "This pathway is not shown. A test label does not establish it.";

const FATE_DENIAL =
  "This pathway is not shown. The device fate given does not establish it.";

const INFERENCE_DENIAL =
  "This pathway is not shown. An inference was not treated as established.";

const COERCION_DENIAL =
  "This pathway is not shown. An unknown fact was not replaced with zero or with no.";

const CALLER_DENIAL =
  "This pathway is not shown. A supplied number or record was not accepted as authority.";

const WATER_QUANTITY_DENIAL =
  "This pathway is not shown. A water quantity or a withholding claim was not produced.";

const AUTHORITY_REASONS = new Set([
  "unknown_claim",
  "missing_claim_identity",
  "missing_claim_version",
  "wrong_claim_version",
  "conflicting_claim_representation",
  "malformed_claim_identity",
  "pathway_not_in_authorized_slice",
  "missing_required_claim_metadata",
  "missing_required_source_metadata",
  "missing_required_scope",
  "missing_required_conditions",
  "missing_required_attribution",
  "unsupported_requested_output",
  "authority_record_conflict",
]);

const PROHIBITED_REASONS = new Set([
  "named_target_attribution_prohibited",
  "victims_or_deaths_prohibited",
  "exact_individual_damage_prohibited",
  "unified_score_prohibited",
  "unsupported_causal_proof_wording",
  "quantitative_output_prohibited",
  "device_mine_attribution_prohibited",
  "biodiversity_quantity_prohibited",
  "fixed_primary_ore_mass_prohibited",
  "device_worker_attribution_prohibited",
  "illness_injury_or_death_counts_prohibited",
  "exposure_dose_risk_or_probability_prohibited",
  "exact_individual_or_community_damage_prohibited",
  "generic_inferred_geography_process_prohibited",
  "device_person_or_community_attribution_prohibited",
  "illness_injury_death_or_victim_counts_prohibited",
  "global_collection_rate_as_individual_route_prohibited",
  "device_site_medium_or_ecosystem_attribution_prohibited",
  "metal_concentration_or_measurement_quantity_prohibited",
  "biodiversity_area_or_species_loss_prohibited",
  "exact_individual_ecological_damage_prohibited",
  "specific_device_attribution_prohibited",
  "exact_individual_human_or_ecological_damage_prohibited",
  "water_scarcity_or_stress_outcome_prohibited",
  "affected_population_prohibited",
  "local_consequence_inference_prohibited",
  "quantitative_or_location_output_prohibited",
  "indicator_conflation_or_conversion_prohibited",
]);

const FATE_REASONS = new Set([
  "contradictory_old_device_fate",
  "fate_or_context_does_not_establish_unsafe_or_informal_handling",
  "fate_context_or_source_scope_does_not_establish_unsound_site_handling",
]);

const INFERENCE_REASONS = new Set([
  "inferred_unsafe_or_informal_handling_prohibited",
  "inferred_unsound_site_handling_prohibited",
]);

const WATER_QUANTITY_REASONS = new Set([
  "generic_litres_per_phone_prohibited",
  "drinking_water_denial_prohibited",
]);

/**
 * @param {string} text
 * @returns {string}
 */
function publicLine(text) {
  if (SNAKE_CASE_TOKEN.test(text)) {
    throw new Error("Public impact line contains an internal token");
  }
  return text;
}

/**
 * @param {string | null | undefined} reasonCode
 * @returns {string}
 */
function denialLine(reasonCode) {
  if (reasonCode === "condition_not_satisfied") return publicLine(CONDITION_DENIAL);
  if (reasonCode === "case_metadata_not_production_authority") return publicLine(CASE_DENIAL);
  if (reasonCode === "unknown_coercion_prohibited") return publicLine(COERCION_DENIAL);
  if (reasonCode === "caller_supplied_authority_prohibited") return publicLine(CALLER_DENIAL);
  if (reasonCode && FATE_REASONS.has(reasonCode)) return publicLine(FATE_DENIAL);
  if (reasonCode && INFERENCE_REASONS.has(reasonCode)) return publicLine(INFERENCE_DENIAL);
  if (reasonCode && WATER_QUANTITY_REASONS.has(reasonCode)) return publicLine(WATER_QUANTITY_DENIAL);
  if (reasonCode && PROHIBITED_REASONS.has(reasonCode)) return publicLine(PROHIBITED_DENIAL);
  if (reasonCode && AUTHORITY_REASONS.has(reasonCode)) return publicLine(AUTHORITY_DENIAL);
  return publicLine(AUTHORITY_DENIAL);
}

/**
 * @typedef {{ opened: boolean }} ImpactState
 */

/** @returns {ImpactState} */
export function createImpactState() {
  return { opened: false };
}

/**
 * @param {ImpactState} state
 * @param {{ type: "open" } | { type: "clear" } | { type: string }} action
 * @returns {ImpactState}
 */
export function reduceImpact(state, action) {
  if (!state || state.opened !== true && state.opened !== false) return createImpactState();
  if (action?.type === "open") return { opened: true };
  if (action?.type === "clear") return createImpactState();
  return state;
}

/**
 * @param {string} actionType
 * @param {ImpactState} impact
 * @returns {ImpactState}
 */
export function impactStateAfterSituationAction(actionType, impact) {
  if (actionType === "edit" || actionType === "reset") return createImpactState();
  return impact;
}

/**
 * @param {string} actionType
 * @param {ImpactState} impact
 * @returns {ImpactState}
 */
export function impactStateAfterInquiryAction(actionType, impact) {
  if (INQUIRY_CLEAR_ACTIONS.has(actionType)) return createImpactState();
  return impact;
}

/**
 * @param {string} actionType
 * @param {ImpactState} impact
 * @returns {ImpactState}
 */
export function impactStateAfterComparisonAction(actionType, impact) {
  if (actionType === "reset") return createImpactState();
  return impact;
}

/**
 * @param {{
 *   comparisonAvailable?: boolean,
 *   comparisonEntered?: boolean,
 *   comparisonEvaluated?: boolean,
 * }} [context]
 * @returns {boolean}
 */
export function canEnterImpact(context = {}) {
  return (
    context.comparisonAvailable === true &&
    context.comparisonEntered === true &&
    context.comparisonEvaluated === true
  );
}

/**
 * @param {boolean} open
 */
function presentStages(open) {
  return SMARTPHONE_JOURNEY_STAGES.map((stage) => {
    if (!open) {
      return {
        id: stage.id,
        label: stage.id === "impact-dependency" ? IMPACT_CHROME.title : stage.label,
        availability: "pending",
        note: "Pending. Not part of this step.",
      };
    }
    if (stage.id === "situation") {
      return {
        id: stage.id,
        label: stage.label,
        availability: "recorded",
        note: "Situation recorded.",
      };
    }
    if (stage.id === "inquiry") {
      return {
        id: stage.id,
        label: stage.label,
        availability: "recorded",
        note: "Inquiry recorded.",
      };
    }
    if (stage.id === "empirical-comparison") {
      return {
        id: stage.id,
        label: stage.label,
        availability: "recorded",
        note: "Empirical comparison recorded.",
      };
    }
    if (stage.id === "impact-dependency") {
      return {
        id: stage.id,
        label: IMPACT_CHROME.title,
        availability: "current",
        note: "Current stage",
      };
    }
    return {
      id: stage.id,
      label: stage.label,
      availability: "pending",
      note: "Pending. Not part of this step.",
    };
  });
}

/**
 * @param {readonly { label?: string, capabilityLine?: string | null }[] | undefined} inspected
 */
function presentInspection(inspected) {
  /** @type {string[]} */
  const labels = [];
  /** @type {string[]} */
  const capabilities = [];
  if (!Array.isArray(inspected)) return { labels, capabilities };
  for (const pathway of inspected) {
    if (!pathway || typeof pathway.label !== "string" || pathway.label.trim() === "") continue;
    if (SNAKE_CASE_TOKEN.test(pathway.label)) continue;
    const label = publicLine(pathway.label);
    labels.push(label);
    if (
      typeof pathway.capabilityLine === "string" &&
      pathway.capabilityLine.trim() !== "" &&
      !SNAKE_CASE_TOKEN.test(pathway.capabilityLine)
    ) {
      capabilities.push(publicLine(`${label}: ${pathway.capabilityLine}`));
    }
  }
  return { labels, capabilities };
}

/**
 * Pinned identity is the production request. An explicit override can only
 * narrow or reject that request for a caller that already holds resolver
 * inputs. Comparison pathway labels are never copied into the request.
 *
 * @param {(typeof IMPACT_DOMAINS)[number]} domain
 * @param {Record<string, unknown> | undefined} override
 */
function resolverRequest(domain, override) {
  const request = {
    claim_id: domain.claimId,
    claim_version: domain.claimVersion,
    requested_output: domain.requestedOutput,
  };
  if (!override || typeof override !== "object") return request;
  return { ...request, ...override };
}

/**
 * @param {unknown} value
 * @returns {value is string}
 */
function isString(value) {
  return typeof value === "string";
}

/**
 * @param {(typeof IMPACT_DOMAINS)[number]} domain
 * @param {ReturnType<(typeof IMPACT_DOMAINS)[number]["resolve"]>} decision
 */
function presentDomain(domain, decision) {
  const pathway = decision?.pathway ?? null;
  const statement = pathway && isString(pathway.statement) ? pathway.statement : null;
  const sources = pathway && Array.isArray(pathway.sources) ? pathway.sources : null;
  const sourceIdList = pathway && Array.isArray(pathway.source_ids) ? pathway.source_ids : null;
  const emitted =
    decision?.emitted === true &&
    pathway != null &&
    pathway.claim_id === domain.claimId &&
    pathway.claim_version === domain.claimVersion &&
    decision.claim_id === domain.claimId &&
    decision.claim_version === domain.claimVersion &&
    statement !== null &&
    sourceIdList !== null &&
    sourceIdList.length > 0 &&
    sources !== null &&
    sources.length > 0;

  if (!emitted || pathway == null || statement === null || sources === null) {
    const reasonCode = typeof decision?.reason_code === "string" ? decision.reason_code : null;
    return {
      id: domain.id,
      heading: publicLine(domain.heading),
      emitted: false,
      attributedToSelection: false,
      reasonCode,
      claimId: typeof decision?.claim_id === "string" ? decision.claim_id : null,
      claimVersion: typeof decision?.claim_version === "string" ? decision.claim_version : null,
      attributionLimits: null,
      conditions: null,
      lines: [denialLine(reasonCode)],
      disclosure: null,
    };
  }

  const limits = Array.isArray(pathway.attribution_limits)
    ? pathway.attribution_limits.filter(isString)
    : [];
  const limitLines = limits.map((limit) => {
    const sentence = LIMIT_PUBLIC[/** @type {keyof typeof LIMIT_PUBLIC} */ (limit)];
    if (typeof sentence !== "string") {
      throw new Error("Emitted attribution limit has no public sentence");
    }
    return publicLine(sentence);
  });
  const conditions = Array.isArray(pathway.conditions)
    ? pathway.conditions.filter(isString)
    : [];
  const conditionLines = conditions.map((condition) => publicLine(`Condition: ${condition}`));
  const status =
    typeof pathway.status === "string"
      ? STATUS_PUBLIC[/** @type {keyof typeof STATUS_PUBLIC} */ (pathway.status)]
      : null;
  const confidence =
    typeof pathway.confidence === "string"
      ? CONFIDENCE_PUBLIC[/** @type {keyof typeof CONFIDENCE_PUBLIC} */ (pathway.confidence)]
      : null;
  const scopes = Array.isArray(pathway.evidence_scope)
    ? pathway.evidence_scope
        .filter(isString)
        .map((scope) => SCOPE_PUBLIC[/** @type {keyof typeof SCOPE_PUBLIC} */ (scope)])
        .filter(isString)
    : [];
  /** @type {string[]} */
  const sourceLines = [];
  /** @type {string[]} */
  const sourceIds = [];
  for (const source of sources) {
    if (!source || typeof source !== "object") continue;
    const record = /** @type {Record<string, unknown>} */ (source);
    if (typeof record.source_id !== "string" || typeof record.citation !== "string") continue;
    sourceIds.push(record.source_id);
    sourceLines.push(publicLine(`Source ${record.source_id}. ${record.citation}`));
    if (typeof record.scope === "string" && record.scope.length > 0) {
      sourceLines.push(publicLine(record.scope));
    }
  }

  /** @type {string[]} */
  const disclosureLines = [
    publicLine(`Claim: ${domain.claimId}`),
    ...(typeof status === "string" ? [publicLine(`Status: ${status}`)] : []),
    ...(typeof confidence === "string" ? [publicLine(`Confidence: ${confidence}`)] : []),
    ...(scopes.length > 0 ? [publicLine(`Scope: ${scopes.join(". ")}.`)] : []),
    ...conditionLines,
    ...limitLines,
    ...sourceLines,
  ];

  return {
    id: domain.id,
    heading: publicLine(domain.heading),
    emitted: true,
    attributedToSelection: false,
    reasonCode: null,
    claimId: domain.claimId,
    claimVersion: domain.claimVersion,
    attributionLimits: Object.freeze([...limits]),
    conditions: Object.freeze(conditions.map((condition) => publicLine(condition))),
    lines: [publicLine(statement), publicLine(IMPACT_LIMIT_LINE)],
    disclosure: {
      summary: publicLine(IMPACT_CHROME.disclosureSummary),
      lines: disclosureLines,
      claimId: domain.claimId,
      sourceIds: Object.freeze(sourceIds),
    },
  };
}

/**
 * @param {ImpactState} state
 * @param {{
 *   comparisonAvailable?: boolean,
 *   comparisonEntered?: boolean,
 *   comparisonEvaluated?: boolean,
 *   inspectedPathways?: readonly { label?: string, capabilityLine?: string | null }[],
 *   resolverOverrides?: Partial<Record<(typeof IMPACT_DOMAINS)[number]["id"], Record<string, unknown>>>,
 * }} [context]
 */
export function describeImpact(state, context = {}) {
  const open = state?.opened === true && canEnterImpact(context);
  const stages = presentStages(open);
  if (!open) {
    return {
      available: false,
      opening: publicLine(IMPACT_OPENING),
      closedNote: publicLine(IMPACT_CLOSED_NOTE),
      selectionNote: null,
      rangeNote: null,
      unknownNote: null,
      boundary: null,
      inspectedLabels: [],
      capabilityLines: [],
      stages,
      domains: [],
    };
  }

  const inspection = presentInspection(context.inspectedPathways);
  const overrides = context.resolverOverrides ?? {};
  const domains = IMPACT_DOMAINS.map((domain) =>
    presentDomain(domain, domain.resolve(resolverRequest(domain, overrides[domain.id]))),
  );

  return {
    available: true,
    opening: publicLine(IMPACT_OPENING),
    closedNote: null,
    selectionNote: publicLine(IMPACT_SELECTION_NOTE),
    rangeNote: publicLine(IMPACT_RANGE_NOTE),
    unknownNote: publicLine(IMPACT_UNKNOWN_NOTE),
    boundary: publicLine(IMPACT_BOUNDARY),
    inspectedLabels: inspection.labels,
    capabilityLines: inspection.capabilities,
    stages,
    domains,
  };
}
