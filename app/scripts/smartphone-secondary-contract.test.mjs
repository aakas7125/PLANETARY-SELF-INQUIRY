import assert from "node:assert/strict";
import { test } from "node:test";
import {
  UNKNOWN,
  NOT_EVIDENCED,
  UNKNOWN_NO_FALLBACK,
  PROVISIONAL_GENERIC_RANGE,
  APPROVED_SOURCE_SPECIFIC,
  PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF,
  ACCOUNTING_MODE,
  evaluateSecondaryPathway,
  evaluateSecondaryPathwayCase,
  isUnknown,
  SECONDARY_PATHWAY_CONSTANTS,
} from "../src/lib/smartphone/secondary-pathway.mjs";

const coveredCaseIds = [
  "SEC-01",
  "SEC-02",
  "SEC-03",
  "SEC-04",
  "SEC-05",
  "SEC-06",
  "SEC-07",
  "SEC-08",
  "SEC-09",
  "SEC-10",
  "SEC-11",
  "SEC-12",
];
const coveredAssertionIds = [
  "A-SEC-01-01",
  "A-SEC-01-02",
  "A-SEC-01-03",
  "A-SEC-01-04",
  "A-SEC-02-01",
  "A-SEC-02-02",
  "A-SEC-02-03",
  "A-SEC-02-04",
  "A-SEC-03-01",
  "A-SEC-03-02",
  "A-SEC-03-03",
  "A-SEC-04-01",
  "A-SEC-04-02",
  "A-SEC-04-03",
  "A-SEC-05-01",
  "A-SEC-05-02",
  "A-SEC-05-03",
  "A-SEC-06-01",
  "A-SEC-06-02",
  "A-SEC-06-03",
  "A-SEC-07-01",
  "A-SEC-07-02",
  "A-SEC-07-03",
  "A-SEC-07-04",
  "A-SEC-08-01",
  "A-SEC-08-02",
  "A-SEC-09-01",
  "A-SEC-09-02",
  "A-SEC-09-03",
  "A-SEC-09-04",
  "A-SEC-10-01",
  "A-SEC-10-02",
  "A-SEC-10-03",
  "A-SEC-11-01",
  "A-SEC-11-02",
  "A-SEC-11-03",
  "A-SEC-11-04",
  "A-SEC-12-01",
  "A-SEC-12-02",
  "A-SEC-12-03",
  "A-SEC-12-04",
];
const coveredGlobalAssertionIds = [
  "A-SEC-GLOBAL-01",
  "A-SEC-GLOBAL-02",
  "A-SEC-GLOBAL-03",
  "A-SEC-GLOBAL-04",
  "A-SEC-GLOBAL-05",
  "A-SEC-GLOBAL-06",
  "A-SEC-GLOBAL-07",
  "A-SEC-GLOBAL-08",
];

/** Single-pathway acquisition cases; SEC-11 is the dual-candidate comparison partition. */
const SINGLE_PATHWAY_CASE_IDS = coveredCaseIds.filter((id) => id !== "SEC-11");

/**
 * Evaluate the authorized domain input for each SEC case.
 * SEC-01–SEC-04 use the replacement evaluator; SEC-05–SEC-12 use the composed case evaluator.
 */
function evaluateAuthorizedCase(caseId) {
  if (Object.hasOwn(CASES, caseId)) {
    return evaluateSecondaryPathway(CASES[caseId]);
  }
  return evaluateSecondaryPathwayCase(COMPOSED_CASES[caseId]);
}

function assertNoAvoidedProductionCredit(result, label) {
  assert.equal(Object.hasOwn(result, "avoided_production_credit"), false, label);
  assert.equal(Object.hasOwn(result, "avoided_production_CO2e"), false, label);
  if (Object.hasOwn(result, "avoided_new_production_CO2e")) {
    assert.equal(result.avoided_new_production_CO2e, null, label);
  }
  assert.notEqual(result.original_manufacturing?.status, "AVOIDED_NEW_MANUFACTURING_CREDIT", label);
}

function assertDisplacementCreditAbsentOrNull(result, label) {
  if (Object.hasOwn(result, "market_displacement_credit")) {
    assert.equal(result.market_displacement_credit, null, label);
  } else {
    assert.equal(Object.hasOwn(result, "market_displacement_credit"), false, label);
  }
  assert.notEqual(result.market_displacement_credit, 0.4, label);
  assert.notEqual(result.market_displacement_credit, 1, label);
  assert.equal(Object.hasOwn(result, "displacement_coefficient"), false, label);
  assert.equal(Object.hasOwn(result, "survey_substitution_coefficient"), false, label);
  assert.notEqual(result.US_displacement_coefficient_applied, true, label);
  assert.equal(Object.hasOwn(result, "direct_score_after_credit"), false, label);
  assert.equal(Object.hasOwn(result, "primary_attributional_score_modified"), false, label);
}

/** Exact immutable package inputs for SEC-01–SEC-04. */
const CASES = {
  "SEC-01": {
    pathway_user_selection: "used_secondhand",
    seller_type: "private_person",
    process_evidence: {
      inspection_testing: false,
      cleaning: UNKNOWN,
      component_replacement: [],
      repair_processes: [],
      refurbishment_program: false,
    },
    transfer: {
      method: "direct_private_resale",
      quantified_CO2e: null,
    },
    expected_adequate_service: {
      low_years: null,
      expected_years: 2.0,
      high_years: null,
    },
  },
  "SEC-02": {
    pathway_user_selection: "refurbished",
    process_evidence: {
      inspection_testing: true,
      cleaning: true,
      refurbishment_program: true,
      component_replacement: [
        {
          type: "battery",
          model_specific_impact: null,
        },
      ],
    },
    expected_adequate_service: {
      expected_years: 3.0,
    },
  },
  "SEC-03": {
    listing_label: "used",
    seller_type: "commercial_reseller",
    documented_process: null,
    expected_adequate_service: {
      expected_years: 2.0,
    },
  },
  "SEC-04": {
    pathway_user_selection: "refurbished",
    marketplace_condition_label: "Excellent",
    process_evidence_id: null,
    model_specific_refurb_LCA: null,
    source_specific_reference_selected: null,
    expected_adequate_service: {
      expected_years: 3.0,
    },
  },
};

/** Exact immutable package top-level inputs for SEC-05–SEC-12. */
const COMPOSED_CASES = {
  "SEC-05": {
    case_id: "SEC-05",
    current_device: {
      adequacy_status: "inadequate",
    },
    replacement: {
      pathway: "used_secondhand",
      expected_adequate_service: {
        low_years: null,
        expected_years: null,
        high_years: null,
      },
    },
    comparison: {
      common_service_horizon_years: 2.0,
    },
  },
  "SEC-06": {
    case_id: "SEC-06",
    replacement: {
      pathway: "used_secondhand",
      transfer: {
        required_for_transaction: true,
        mode: "parcel_delivery",
        quantified_CO2e: null,
        evidence_id: null,
      },
      repairs: [],
      expected_adequate_service: {
        expected_years: 2.0,
      },
    },
  },
  "SEC-07": {
    case_id: "SEC-07",
    replacement: {
      pathway: "refurbished",
      source_specific_reference: {
        source_id: "ADEME_REFURB_SMARTPHONE_REFERENCE",
        explicitly_selected: true,
      },
      expected_adequate_service: {
        expected_years: 2.0,
      },
    },
  },
  "SEC-08": {
    case_id: "SEC-08",
    replacement: {
      pathway: "refurbished",
      exact_model: "arbitrary_model",
      source_specific_reference: null,
      model_specific_refurb_LCA: null,
      expected_adequate_service: {
        expected_years: 2.0,
      },
    },
  },
  "SEC-09": {
    case_id: "SEC-09",
    comparison: {
      common_service_horizon_years: 3.0,
    },
    replacement: {
      pathway: "used_secondhand",
      expected_adequate_service: {
        expected_years: 0.5,
      },
    },
    next_event_after_secondary_failure: null,
  },
  "SEC-10": {
    case_id: "SEC-10",
    comparison: {
      common_service_horizon_years: 3.0,
    },
    replacement: {
      pathway: "refurbished",
      expected_adequate_service: {
        expected_years: 3.0,
      },
      applicable_refurbishment_evidence: {
        process_boundary_complete_for_direct_V0: true,
        aggregate_direct_CO2e: 7.61,
        source_id: "ADEME_REFURB_SMARTPHONE_REFERENCE",
        source_specific: true,
        decomposable: false,
      },
    },
  },
  "SEC-11": {
    case_id: "SEC-11",
    used_candidate: {
      pathway: "used_secondhand",
      expected_adequate_service: {
        expected_years: 2.0,
      },
      transfer_CO2e: null,
      repair_CO2e: null,
    },
    refurbished_candidate: {
      pathway: "refurbished",
      expected_adequate_service: {
        expected_years: 2.0,
      },
      refurb_direct_CO2e: null,
    },
    comparison: {
      common_service_horizon_years: 2.0,
    },
  },
  "SEC-12": {
    case_id: "SEC-12",
    replacement: {
      pathway: "used_secondhand",
      personal_counterfactual_if_unavailable: "buy_new",
      market_context: {
        geography: "unspecified",
      },
    },
  },
};

/** Forbidden assertion-mirroring / unrequested output fields for this slice. */
const FORBIDDEN_OUTPUT_FIELDS = [
  "fabricated_preparation_processes",
  "marketplace_grade_selected_lca",
  "winner",
  "numeric_winner",
  "ranking",
  "recommendation",
  "default_next_event",
];

function assertNoDefinitiveDecisionOutput(result) {
  for (const field of Object.keys(result)) {
    assert.doesNotMatch(field, /winner|ranking|recommendation|default/i);
  }
}

test("secondary slice covers the twelve cases, 41 case assertions, and eight globals", () => {
  assert.deepEqual(coveredCaseIds, [
    "SEC-01",
    "SEC-02",
    "SEC-03",
    "SEC-04",
    "SEC-05",
    "SEC-06",
    "SEC-07",
    "SEC-08",
    "SEC-09",
    "SEC-10",
    "SEC-11",
    "SEC-12",
  ]);
  assert.equal(coveredAssertionIds.length, 41);
  assert.ok(coveredAssertionIds.every((id) => /^A-SEC-(?:0[1-9]|1[0-2])-\d{2}$/.test(id)));
  assert.deepEqual(coveredGlobalAssertionIds, [
    "A-SEC-GLOBAL-01",
    "A-SEC-GLOBAL-02",
    "A-SEC-GLOBAL-03",
    "A-SEC-GLOBAL-04",
    "A-SEC-GLOBAL-05",
    "A-SEC-GLOBAL-06",
    "A-SEC-GLOBAL-07",
    "A-SEC-GLOBAL-08",
  ]);
});

test("SEC-01 direct private resale stays used_secondhand without inferred refurbishment", () => {
  const result = evaluateSecondaryPathway(CASES["SEC-01"]);

  assert.equal(result.secondary_pathway, "used_secondhand");
  assert.equal(result.accounting_mode, ACCOUNTING_MODE);
  assert.equal(result.original_manufacturing.status, PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF);
  assert.equal(result.refurbishment_process.status, NOT_EVIDENCED);
  assert.equal(result.transfer_CO2e.value, null);
  assert.equal(result.transfer_CO2e.status, UNKNOWN_NO_FALLBACK);
  assert.equal(result.market_displacement_credit, null);
  assert.equal(result.result_capability, "qualitative_only");

  // A-SEC-01-01
  assert.equal(result.secondary_pathway, "used_secondhand");
  // A-SEC-01-02 — refurbishment must not be inferred
  assert.notEqual(result.secondary_pathway, "refurbished");
  assert.equal(result.refurbishment_process.status, NOT_EVIDENCED);
  assert.notEqual(result.refurbishment_process.status, "DOCUMENTED");
  // A-SEC-01-03 — prior manufacturing excluded from direct acquisition; no avoided-credit output
  assert.equal(result.original_manufacturing.enters_direct_acquisition_total, false);
  assert.equal(Object.hasOwn(result.original_manufacturing, "avoided_production_credit"), false);
  assert.equal(result.avoided_production_credit, undefined);
  // A-SEC-01-04
  assert.equal(result.market_displacement_credit, null);

  // Prohibited: unknown transfer != 0; used != zero burden
  assert.notEqual(result.transfer_CO2e.value, 0);
  assert.equal(isUnknown(result.transfer_CO2e.value), true);

  for (const field of FORBIDDEN_OUTPUT_FIELDS) {
    assert.equal(Object.hasOwn(result, field), false);
  }
});

test("SEC-02 documented refurbishment with battery uses provisional range and keeps total null", () => {
  const result = evaluateSecondaryPathway(CASES["SEC-02"]);

  assert.equal(result.secondary_pathway, "refurbished");
  assert.equal(result.original_manufacturing.status, PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF);
  assert.deepEqual(result.battery_replacement_CO2e, [0.3, 0.7]);
  assert.deepEqual(result.battery_replacement_CO2e, [
    ...SECONDARY_PATHWAY_CONSTANTS.BATTERY_REPLACEMENT_CO2E_KG,
  ]);
  assert.equal(result.battery_replacement_CO2e_status, PROVISIONAL_GENERIC_RANGE);
  assert.equal(result.inspection_testing_CO2e, null);
  assert.equal(result.cleaning_CO2e, null);
  assert.equal(result.refurb_total_direct_CO2e, null);
  assert.equal(result.result_capability, "partial_quantitative");

  // A-SEC-02-01
  assert.equal(result.secondary_pathway, "refurbished");
  // A-SEC-02-02
  assert.deepEqual(result.battery_replacement_CO2e, [0.3, 0.7]);
  // A-SEC-02-03 — unknown inspection/cleaning must not become zero
  assert.notEqual(result.inspection_testing_CO2e, 0);
  assert.notEqual(result.cleaning_CO2e, 0);
  assert.equal(isUnknown(result.inspection_testing_CO2e), true);
  assert.equal(isUnknown(result.cleaning_CO2e), true);
  // A-SEC-02-04
  assert.equal(result.refurb_total_direct_CO2e, null);
  assert.notEqual(result.refurb_total_direct_CO2e, 0);
  assert.notDeepEqual(result.refurb_total_direct_CO2e, [0.3, 0.7]);

  // No model-specific approval status invented for this slice
  assert.notEqual(result.battery_replacement_CO2e_status, "APPROVED_MODEL_SPECIFIC");
  assert.equal(Object.hasOwn(result.original_manufacturing, "avoided_production_credit"), false);
});

test("SEC-03 commercial used listing does not imply refurbishment", () => {
  const result = evaluateSecondaryPathway(CASES["SEC-03"]);

  assert.equal(result.secondary_pathway, "used_secondhand");
  assert.equal(result.process_uncertainty, true);
  assert.equal(result.refurbishment_process, UNKNOWN);
  assert.equal(result.direct_secondary_CO2e, null);
  assert.equal(result.result_capability, "qualitative_only");

  // A-SEC-03-01 — commercial_reseller must not imply refurbished
  assert.equal(CASES["SEC-03"].seller_type, "commercial_reseller");
  assert.notEqual(result.secondary_pathway, "refurbished");
  // A-SEC-03-02
  assert.equal(CASES["SEC-03"].listing_label, "used");
  assert.equal(result.secondary_pathway, "used_secondhand");
  assert.equal(result.process_uncertainty, true);
  // A-SEC-03-03 — unknown preparation processes must not be fabricated
  // Prove via absence of invented preparation/process outputs, not a self-certifying flag.
  assert.equal(Object.hasOwn(result, "fabricated_preparation_processes"), false);
  assert.equal(Object.hasOwn(result, "inspection_testing_CO2e"), false);
  assert.equal(Object.hasOwn(result, "cleaning_CO2e"), false);
  assert.equal(Object.hasOwn(result, "battery_replacement_CO2e"), false);
  assert.equal(Object.hasOwn(result, "repair_processes"), false);
  assert.equal(result.refurbishment_process, UNKNOWN);
  assert.notEqual(result.direct_secondary_CO2e, 0);
});

test("SEC-04 refurbished label without LCA stays null and does not apply ADEME 7.61", () => {
  const result = evaluateSecondaryPathway(CASES["SEC-04"]);

  assert.equal(result.secondary_pathway, "refurbished");
  assert.equal(result.refurb_direct_CO2e.value, null);
  assert.equal(result.refurb_direct_CO2e.status, UNKNOWN_NO_FALLBACK);
  assert.equal(result.ADEME_7_61_applied, false);
  assert.equal(result.result_capability, "qualitative_only");

  // A-SEC-04-01 — refurbished label alone must not produce numerical footprint
  assert.equal(result.refurb_direct_CO2e.value, null);
  assert.notEqual(result.refurb_direct_CO2e.value, 7.61);
  assert.notEqual(result.refurb_direct_CO2e.value, 0);
  // A-SEC-04-02 — marketplace grade must not select an LCA
  // Prove via canonical null burden and absence of invented grade→LCA flag/outputs.
  assert.equal(CASES["SEC-04"].marketplace_condition_label, "Excellent");
  assert.equal(CASES["SEC-04"].model_specific_refurb_LCA, null);
  assert.equal(Object.hasOwn(result, "marketplace_grade_selected_lca"), false);
  assert.equal(Object.hasOwn(result, "selected_lca"), false);
  assert.equal(Object.hasOwn(result, "model_specific_refurb_LCA"), false);
  assert.equal(result.refurb_direct_CO2e.value, null);
  // A-SEC-04-03 — null source-specific selection does not apply ADEME
  assert.equal(CASES["SEC-04"].source_specific_reference_selected, null);
  assert.equal(result.ADEME_7_61_applied, false);
  assert.notEqual(result.refurb_direct_CO2e.value, 7.61);
});

test("SEC-05 unknown used service life blocks equivalent-service ranking", () => {
  const result = evaluateSecondaryPathwayCase(COMPOSED_CASES["SEC-05"]);

  assert.equal(result.secondary_pathway, "used_secondhand");
  assert.equal(result.used_service_life, null);
  assert.equal(result.equivalent_service_established, false);
  assert.ok(result.missing_required_fields.includes("replacement.expected_adequate_service"));
  assert.equal(result.result_capability, "insufficient_information");

  // A-SEC-05-01
  assert.equal(isUnknown(result.used_service_life), true);
  assert.notEqual(result.used_service_life, 0);
  // A-SEC-05-02 — metadata cannot supply a service-life default.
  const metadataResult = evaluateSecondaryPathwayCase({
    ...COMPOSED_CASES["SEC-05"],
    replacement: {
      ...COMPOSED_CASES["SEC-05"].replacement,
      seller_type: "commercial_reseller",
      model: "Example Phone",
      device_age_years: 1,
      warranty_years: 2,
      price: 500,
      marketplace_condition_label: "Excellent",
    },
  });
  assert.equal(metadataResult.used_service_life, null);
  assert.deepEqual(metadataResult.missing_required_fields, [
    "replacement.expected_adequate_service",
  ]);
  // A-SEC-05-03 — definitive equivalent-service ranking is absent.
  assert.equal(result.equivalent_service_established, false);
  for (const field of FORBIDDEN_OUTPUT_FIELDS) {
    assert.equal(Object.hasOwn(result, field), false);
    assert.equal(Object.hasOwn(metadataResult, field), false);
  }
  assertNoDefinitiveDecisionOutput(result);
  assertNoDefinitiveDecisionOutput(metadataResult);
});

test("SEC-06 unresolved parcel transfer remains unknown with no generic fallback", () => {
  const result = evaluateSecondaryPathwayCase(COMPOSED_CASES["SEC-06"]);

  assert.equal(result.secondary_pathway, "used_secondhand");
  assert.equal(result.transfer_CO2e.value, null);
  assert.equal(result.transfer_CO2e.status, UNKNOWN_NO_FALLBACK);
  assert.equal(result.used_direct_CO2e.value, null);
  assert.equal(result.result_capability, "qualitative_only");

  // A-SEC-06-01
  assert.notEqual(result.transfer_CO2e.value, 0);
  assert.equal(isUnknown(result.transfer_CO2e.value), true);
  // A-SEC-06-02
  assert.notEqual(result.transfer_CO2e.value, 0.475);
  // A-SEC-06-03
  assert.equal(result.used_direct_CO2e.value, null);
  assert.notEqual(result.used_direct_CO2e.value, 0);

  for (const field of FORBIDDEN_OUTPUT_FIELDS) {
    assert.equal(Object.hasOwn(result, field), false);
  }
  assertNoDefinitiveDecisionOutput(result);
});

test("SEC-07 exact explicit ADEME reference remains labelled, opaque, and non-generic", () => {
  const result = evaluateSecondaryPathwayCase(COMPOSED_CASES["SEC-07"]);

  assert.equal(result.secondary_pathway, "refurbished");
  assert.equal(result.refurb_direct_reference_CO2e.value, 7.61);
  assert.equal(result.refurb_direct_reference_CO2e.unit, "kgCO2e");
  assert.equal(
    result.refurb_direct_reference_CO2e.status,
    APPROVED_SOURCE_SPECIFIC,
  );
  assert.equal(
    result.refurb_direct_reference_CO2e.source_id,
    "ADEME_REFURB_SMARTPHONE_REFERENCE",
  );
  assert.equal(result.reference_second_life_years, 2.0);
  assert.equal(result.decomposable, false);
  assert.equal(result.generic_default, false);
  assert.equal(result.result_capability, "quantitative");

  // A-SEC-07-01
  assert.equal(result.refurb_direct_reference_CO2e.value, 7.61);
  // A-SEC-07-02
  assert.equal(
    result.refurb_direct_reference_CO2e.source_id,
    "ADEME_REFURB_SMARTPHONE_REFERENCE",
  );
  assert.equal(
    result.refurb_direct_reference_CO2e.status,
    APPROVED_SOURCE_SPECIFIC,
  );
  // A-SEC-07-03
  assert.equal(result.decomposable, false);
  // A-SEC-07-04
  assert.equal(result.generic_default, false);

  assert.equal(Object.hasOwn(result, "refurb_direct_CO2e"), false);
  assert.equal(Object.hasOwn(result, "generic_transport_CO2e"), false);
  assert.equal(Object.hasOwn(result, "generic_charging_CO2e"), false);
  assert.equal(Object.hasOwn(result.refurb_direct_reference_CO2e, "stages"), false);
});

test("SEC-08 arbitrary refurbished phone remains unknown without an ADEME fallback", () => {
  const result = evaluateSecondaryPathwayCase(COMPOSED_CASES["SEC-08"]);

  assert.equal(result.secondary_pathway, "refurbished");
  assert.equal(result.refurb_direct_CO2e.value, null);
  assert.equal(result.refurb_direct_CO2e.status, UNKNOWN_NO_FALLBACK);
  assert.equal(result.ADEME_7_61_applied, false);
  assert.equal(result.result_capability, "qualitative_only");

  // A-SEC-08-01
  assert.equal(result.refurb_direct_CO2e.value, null);
  assert.notEqual(result.refurb_direct_CO2e.value, 0);
  // A-SEC-08-02
  assert.equal(result.ADEME_7_61_applied, false);
  assert.equal(Object.hasOwn(result, "refurb_direct_reference_CO2e"), false);
  assert.notEqual(result.refurb_direct_CO2e.value, 7.61);
});

test("SEC-09 short used service requires an incomplete service sequence", () => {
  const result = evaluateSecondaryPathwayCase(COMPOSED_CASES["SEC-09"]);

  assert.equal(result.secondary_pathway, "used_secondhand");
  assert.equal(result.service_sequence_required, true);
  assert.equal(result.covered_service_years, 0.5);
  assert.equal(result.uncovered_service_years, 2.5);
  assert.equal(result.next_event, UNKNOWN);
  assert.equal(result.result_capability, "insufficient_information");

  // A-SEC-09-01 — the remaining 2.5 years are represented, not truncated.
  assert.equal(
    result.covered_service_years + result.uncovered_service_years,
    COMPOSED_CASES["SEC-09"].comparison.common_service_horizon_years,
  );
  // A-SEC-09-02
  assert.equal(result.service_sequence_required, true);
  // A-SEC-09-03
  assert.notEqual(result.next_event, "buy_new");
  assert.equal(result.next_event, UNKNOWN);
  // A-SEC-09-04
  for (const field of FORBIDDEN_OUTPUT_FIELDS) {
    assert.equal(Object.hasOwn(result, field), false);
  }
  assertNoDefinitiveDecisionOutput(result);
});

test("SEC-10 complete source-specific refurbishment evidence permits a quantitative result", () => {
  const result = evaluateSecondaryPathwayCase(COMPOSED_CASES["SEC-10"]);

  assert.equal(result.secondary_pathway, "refurbished");
  assert.equal(result.accounting_mode, ACCOUNTING_MODE);
  assert.equal(result.service_sequence_required, false);
  assert.equal(result.adequate_service_coverage_years, 3.0);
  assert.equal(result.refurb_direct_CO2e.value, 7.61);
  assert.equal(result.refurb_direct_CO2e.unit, "kgCO2e");
  assert.equal(result.refurb_direct_CO2e.status, APPROVED_SOURCE_SPECIFIC);
  assert.equal(result.equivalent_service_established, true);
  assert.equal(result.result_capability, "quantitative");

  // A-SEC-10-01
  assert.equal(result.refurb_direct_CO2e.value, 7.61);
  assert.equal(result.adequate_service_coverage_years, 3.0);
  assert.equal(result.equivalent_service_established, true);
  assert.equal(result.result_capability, "quantitative");
  // A-SEC-10-02 — retain the complete source-specific boundary with the value.
  assert.equal(
    result.refurb_direct_CO2e.source_id,
    "ADEME_REFURB_SMARTPHONE_REFERENCE",
  );
  assert.equal(result.refurb_direct_CO2e.source_specific, true);
  assert.equal(
    result.refurb_direct_CO2e.process_boundary_complete_for_direct_V0,
    true,
  );
  assert.equal(result.refurb_direct_CO2e.decomposable, false);
  // A-SEC-10-03 — the aggregate remains opaque with no invented stages.
  assert.equal(Object.hasOwn(result.refurb_direct_CO2e, "stages"), false);
  assert.equal(Object.hasOwn(result, "inspection_testing_CO2e"), false);
  assert.equal(Object.hasOwn(result, "cleaning_CO2e"), false);
  assert.equal(Object.hasOwn(result, "parts_CO2e"), false);
  assert.equal(Object.hasOwn(result, "transport_CO2e"), false);
  assert.equal(Object.hasOwn(result, "charging_CO2e"), false);
  assert.equal(Object.hasOwn(result, "refurb_direct_reference_CO2e"), false);
  assert.equal(result.original_manufacturing.enters_direct_acquisition_total, false);
  assert.equal(result.market_displacement_credit, null);
});

test("SEC-11 leaves both complete direct burdens unquantified with no numerical winner", () => {
  const result = evaluateSecondaryPathwayCase(COMPOSED_CASES["SEC-11"]);

  assert.equal(result.accounting_mode, ACCOUNTING_MODE);
  assert.equal(result.used.direct_CO2e, null);
  assert.equal(result.refurbished.direct_CO2e, null);
  assert.equal(result.used.reuses_existing_device, true);
  assert.equal(result.refurbished.reuses_existing_device, true);
  assert.equal(result.result_capability, "qualitative_only");

  // A-SEC-11-01
  assert.equal(result.numeric_winner, null);
  // A-SEC-11-02 and A-SEC-11-03 — neither pathway receives an automatic ordering.
  for (const candidate of [result.used, result.refurbished]) {
    assert.equal(Object.hasOwn(candidate, "rank"), false);
    assert.equal(Object.hasOwn(candidate, "ranks_below"), false);
    assert.equal(Object.hasOwn(candidate, "better_than"), false);
  }
  assert.equal(Object.hasOwn(result, "ranking"), false);
  assert.equal(Object.hasOwn(result, "recommendation"), false);
  // A-SEC-11-04 — qualitative reuse remains qualitative, not a fabricated number.
  assert.equal(Number.isFinite(result.used.direct_CO2e), false);
  assert.equal(Number.isFinite(result.refurbished.direct_CO2e), false);
  assert.equal(Object.hasOwn(result.used, "reuse_CO2e"), false);
  assert.equal(Object.hasOwn(result.refurbished, "reuse_CO2e"), false);
  assert.equal(Object.hasOwn(result, "avoided_production_CO2e"), false);
});

test("SEC-12 stores personal buy-new separately from displacement and avoided-production credit", () => {
  const result = evaluateSecondaryPathwayCase(COMPOSED_CASES["SEC-12"]);

  assert.equal(result.accounting_mode, ACCOUNTING_MODE);
  assert.equal(result.secondary_pathway, "used_secondhand");
  assert.equal(result.original_manufacturing.status, PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF);
  assert.equal(result.original_manufacturing.enters_direct_acquisition_total, false);
  assert.equal(result.direct_secondary_CO2e, null);
  // Absence of consequential credit alone does not downgrade the direct pathway.
  assert.equal(result.result_capability, "qualitative_only");

  // A-SEC-12-01 — personal counterfactual must be stored
  assert.equal(result.personal_purchase_substitution, "buy_new");
  // A-SEC-12-02 — buy_new is not one new phone displaced
  assert.notEqual(result.personal_purchase_substitution, result.market_displacement_credit);
  assert.notEqual(result.market_displacement_credit, 1);
  assert.notEqual(result.market_displacement_credit, 0.98);
  assert.equal(Object.hasOwn(result, "survey_substitution_coefficient"), false);
  assert.equal(Object.hasOwn(result, "displacement_coefficient"), false);
  // A-SEC-12-03
  assert.equal(result.market_displacement_credit, null);
  assert.equal(result.avoided_new_production_CO2e, null);
  // A-SEC-12-04 — D≈0.40 requires an explicit US consequential scenario
  assert.equal(result.US_displacement_coefficient_applied, false);
  assert.notEqual(result.market_displacement_credit, 0.4);

  // Prohibited: no credit, direct-score subtraction, ranking, or recommendation.
  assert.equal(Object.hasOwn(result, "avoided_production_credit"), false);
  assert.equal(Object.hasOwn(result, "direct_score_after_credit"), false);
  assert.equal(Object.hasOwn(result, "primary_attributional_score_modified"), false);
  assert.equal(Object.hasOwn(result, "winner"), false);
  assert.equal(Object.hasOwn(result, "ranking"), false);
  assert.equal(Object.hasOwn(result, "recommendation"), false);
  assertNoDefinitiveDecisionOutput(result);
});

test("composed secondary results are invariant to case_id metadata", () => {
  for (const caseId of [
    "SEC-05",
    "SEC-06",
    "SEC-07",
    "SEC-08",
    "SEC-09",
    "SEC-10",
    "SEC-11",
    "SEC-12",
  ]) {
    const input = COMPOSED_CASES[caseId];
    const { case_id: _omitted, ...withoutCaseId } = input;
    const renamedCaseId = {
      ...input,
      case_id: `RENAMED-${caseId}`,
    };
    const withAdditionalRegressionMetadata = {
      ...input,
      case_id: `RENAMED-${caseId}`,
      assertion_id: `A-${caseId}-METADATA-ONLY`,
      test_fixture_name: `${caseId}-fixture`,
    };
    const expected = evaluateSecondaryPathwayCase(input);

    assert.deepEqual(
      evaluateSecondaryPathwayCase(withoutCaseId),
      expected,
      `${caseId} must not depend on an absent case_id`,
    );
    assert.deepEqual(
      evaluateSecondaryPathwayCase(renamedCaseId),
      expected,
      `${caseId} must not depend on a renamed case_id`,
    );
    assert.deepEqual(
      evaluateSecondaryPathwayCase(withAdditionalRegressionMetadata),
      expected,
      `${caseId} must not depend on test/provenance metadata`,
    );
  }
});

test("guard: incomplete or unsupported SEC-11 candidate inputs gain no comparison", () => {
  const unsupportedInputs = [
    {
      ...COMPOSED_CASES["SEC-11"],
      used_candidate: {
        ...COMPOSED_CASES["SEC-11"].used_candidate,
        transfer_CO2e: 0,
      },
    },
    {
      ...COMPOSED_CASES["SEC-11"],
      refurbished_candidate: {
        ...COMPOSED_CASES["SEC-11"].refurbished_candidate,
        refurb_direct_CO2e: 7.61,
      },
    },
    {
      ...COMPOSED_CASES["SEC-11"],
      used_candidate: {
        ...COMPOSED_CASES["SEC-11"].used_candidate,
        expected_adequate_service: {},
      },
    },
    {
      ...COMPOSED_CASES["SEC-11"],
      refurbished_candidate: {
        ...COMPOSED_CASES["SEC-11"].refurbished_candidate,
        unsupported_direct_CO2e: 0.5,
      },
    },
  ];

  for (const input of unsupportedInputs) {
    const result = evaluateSecondaryPathwayCase(input);
    assert.equal(result.result_capability, "insufficient_information");
    assert.equal(Object.hasOwn(result, "used"), false);
    assert.equal(Object.hasOwn(result, "refurbished"), false);
    assert.equal(Object.hasOwn(result, "numeric_winner"), false);
  }
});

test("used_secondhand and refurbished remain distinct across the executed slice", () => {
  const used = evaluateSecondaryPathway(CASES["SEC-01"]);
  const refurbished = evaluateSecondaryPathway(CASES["SEC-02"]);
  assert.notEqual(used.secondary_pathway, refurbished.secondary_pathway);
  assert.equal(used.secondary_pathway, "used_secondhand");
  assert.equal(refurbished.secondary_pathway, "refurbished");
});

test("guard: ADEME_7_61_applied false only for explicit-null selection", () => {
  // Absent selection must not emit categorical false.
  const absentSelection = evaluateSecondaryPathway(CASES["SEC-01"]);
  assert.equal(Object.hasOwn(absentSelection, "ADEME_7_61_applied"), false);

  // Non-null unimplemented selection must not be coerced to false.
  const unimplementedSelection = evaluateSecondaryPathway({
    ...CASES["SEC-04"],
    source_specific_reference_selected: "unimplemented_source_ref",
  });
  assert.equal(Object.hasOwn(unimplementedSelection, "ADEME_7_61_applied"), false);
  assert.equal(unimplementedSelection.refurb_direct_CO2e.value, null);
  assert.notEqual(unimplementedSelection.refurb_direct_CO2e.value, 7.61);

  // Explicit null (SEC-04) still proves ADEME is not applied.
  const explicitNull = evaluateSecondaryPathway(CASES["SEC-04"]);
  assert.equal(explicitNull.ADEME_7_61_applied, false);

  const explicitNullReference = evaluateSecondaryPathwayCase(COMPOSED_CASES["SEC-08"]);
  assert.equal(explicitNullReference.ADEME_7_61_applied, false);
});

test("guard: ADEME requires exact source identity, explicit selection, and its two-year reference", () => {
  const sourceReference = COMPOSED_CASES["SEC-07"].replacement.source_specific_reference;
  const unsupportedInputs = [
    {
      ...COMPOSED_CASES["SEC-07"],
      replacement: {
        pathway: "refurbished",
        expected_adequate_service: {
          expected_years: 2,
        },
      },
    },
    {
      ...COMPOSED_CASES["SEC-07"],
      replacement: {
        ...COMPOSED_CASES["SEC-07"].replacement,
        source_specific_reference: {
          source_id: sourceReference.source_id,
        },
      },
    },
    {
      ...COMPOSED_CASES["SEC-07"],
      replacement: {
        ...COMPOSED_CASES["SEC-07"].replacement,
        source_specific_reference: {
          ...sourceReference,
          explicitly_selected: false,
        },
      },
    },
    {
      ...COMPOSED_CASES["SEC-07"],
      replacement: {
        ...COMPOSED_CASES["SEC-07"].replacement,
        source_specific_reference: {
          ...sourceReference,
          source_id: "DIFFERENT_REFERENCE",
        },
      },
    },
    {
      ...COMPOSED_CASES["SEC-07"],
      replacement: {
        ...COMPOSED_CASES["SEC-07"].replacement,
        source_specific_reference: "ADEME_REFURB_SMARTPHONE_REFERENCE",
      },
    },
    {
      ...COMPOSED_CASES["SEC-07"],
      replacement: {
        ...COMPOSED_CASES["SEC-07"].replacement,
        expected_adequate_service: {
          expected_years: 3,
        },
      },
    },
    {
      ...COMPOSED_CASES["SEC-07"],
      replacement: {
        ...COMPOSED_CASES["SEC-07"].replacement,
        pathway: "used_secondhand",
      },
    },
  ];

  for (const input of unsupportedInputs) {
    const result = evaluateSecondaryPathwayCase(input);
    assert.equal(Object.hasOwn(result, "refurb_direct_reference_CO2e"), false);
    assert.notEqual(result.result_capability, "quantitative");
    assert.equal(Object.hasOwn(result, "decomposable"), false);
    assert.equal(Object.hasOwn(result, "generic_default"), false);
  }
});

test("guard: model, seller, grade, and service horizon never select ADEME", () => {
  const result = evaluateSecondaryPathwayCase({
    ...COMPOSED_CASES["SEC-08"],
    replacement: {
      ...COMPOSED_CASES["SEC-08"].replacement,
      seller_type: "commercial_reseller",
      marketplace_condition_label: "Excellent",
      device_age_years: 1,
      warranty_years: 2,
      price: 500,
    },
  });

  assert.equal(result.refurb_direct_CO2e.value, null);
  assert.equal(result.refurb_direct_CO2e.status, UNKNOWN_NO_FALLBACK);
  assert.equal(result.ADEME_7_61_applied, false);
  assert.equal(result.result_capability, "qualitative_only");
  assert.equal(Object.hasOwn(result, "refurb_direct_reference_CO2e"), false);
});

test("guard: battery fallback requires model_specific_impact === null", () => {
  const baseEvidence = {
    inspection_testing: true,
    cleaning: true,
    refurbishment_program: true,
  };

  // Absent/undefined model_specific_impact must not acquire [0.3, 0.7].
  const absentImpact = evaluateSecondaryPathway({
    pathway_user_selection: "refurbished",
    process_evidence: {
      ...baseEvidence,
      component_replacement: [{ type: "battery" }],
    },
  });
  assert.equal(Object.hasOwn(absentImpact, "battery_replacement_CO2e"), false);
  assert.notDeepEqual(absentImpact.battery_replacement_CO2e, [0.3, 0.7]);

  // Other unimplemented numeric value must not acquire the provisional fallback.
  const otherImpact = evaluateSecondaryPathway({
    pathway_user_selection: "refurbished",
    process_evidence: {
      ...baseEvidence,
      component_replacement: [
        {
          type: "battery",
          model_specific_impact: 1.25,
        },
      ],
    },
  });
  assert.equal(Object.hasOwn(otherImpact, "battery_replacement_CO2e"), false);
  assert.notEqual(otherImpact.battery_replacement_CO2e_status, "APPROVED_MODEL_SPECIFIC");

  // Exact SEC-02 null input still receives the authorized fallback.
  const nullImpact = evaluateSecondaryPathway(CASES["SEC-02"]);
  assert.deepEqual(nullImpact.battery_replacement_CO2e, [0.3, 0.7]);
  assert.equal(nullImpact.battery_replacement_CO2e_status, PROVISIONAL_GENERIC_RANGE);
});

test("guard: numeric transfer input does not gain APPROVED status in this slice", () => {
  const numericTransfer = evaluateSecondaryPathway({
    ...CASES["SEC-01"],
    transfer: {
      method: "direct_private_resale",
      quantified_CO2e: 0.42,
    },
  });
  assert.notEqual(numericTransfer.transfer_CO2e?.status, "APPROVED");
  if (Object.hasOwn(numericTransfer, "transfer_CO2e")) {
    assert.notEqual(numericTransfer.transfer_CO2e.status, "APPROVED");
  }

  // Explicit null/unknown transfer (SEC-01) remains UNKNOWN_NO_FALLBACK.
  const unknownTransfer = evaluateSecondaryPathway(CASES["SEC-01"]);
  assert.equal(unknownTransfer.transfer_CO2e.value, null);
  assert.equal(unknownTransfer.transfer_CO2e.status, UNKNOWN_NO_FALLBACK);

  const offSliceNumericTransfer = evaluateSecondaryPathwayCase({
    ...COMPOSED_CASES["SEC-06"],
    replacement: {
      ...COMPOSED_CASES["SEC-06"].replacement,
      transfer: {
        ...COMPOSED_CASES["SEC-06"].replacement.transfer,
        quantified_CO2e: 0.475,
      },
    },
  });
  assert.notEqual(offSliceNumericTransfer.transfer_CO2e?.status, "APPROVED");
  assert.equal(Object.hasOwn(offSliceNumericTransfer, "used_direct_CO2e"), false);
});

test("guard: absent next event does not default to buy_new", () => {
  const { next_event_after_secondary_failure: _omitted, ...withoutNextEvent } =
    COMPOSED_CASES["SEC-09"];
  const result = evaluateSecondaryPathwayCase(withoutNextEvent);

  assert.equal(result.service_sequence_required, true);
  assert.equal(Object.hasOwn(result, "next_event"), false);
  assert.notEqual(result.next_event, "buy_new");
  assert.equal(Object.hasOwn(result, "default_next_event"), false);
});

test("guard: SEC-10 approval requires its complete exact evidence and service boundary", () => {
  const base = COMPOSED_CASES["SEC-10"];
  const evidence = base.replacement.applicable_refurbishment_evidence;
  const { process_boundary_complete_for_direct_V0: _omittedBoundary, ...incompleteEvidence } =
    evidence;
  const unsupportedInputs = [
    {
      ...base,
      replacement: {
        ...base.replacement,
        applicable_refurbishment_evidence: incompleteEvidence,
      },
    },
    {
      ...base,
      replacement: {
        ...base.replacement,
        applicable_refurbishment_evidence: {
          ...evidence,
          process_boundary_complete_for_direct_V0: false,
        },
      },
    },
    {
      ...base,
      replacement: {
        ...base.replacement,
        applicable_refurbishment_evidence: {
          ...evidence,
          aggregate_direct_CO2e: 7.62,
        },
      },
    },
    {
      ...base,
      replacement: {
        ...base.replacement,
        applicable_refurbishment_evidence: {
          ...evidence,
          aggregate_direct_CO2e: "7.61",
        },
      },
    },
    {
      ...base,
      replacement: {
        ...base.replacement,
        applicable_refurbishment_evidence: {
          ...evidence,
          source_id: "DIFFERENT_REFERENCE",
        },
      },
    },
    {
      ...base,
      replacement: {
        ...base.replacement,
        applicable_refurbishment_evidence: {
          ...evidence,
          source_specific: false,
        },
      },
    },
    {
      ...base,
      replacement: {
        ...base.replacement,
        applicable_refurbishment_evidence: {
          ...evidence,
          decomposable: true,
        },
      },
    },
    {
      ...base,
      replacement: {
        ...base.replacement,
        expected_adequate_service: {
          expected_years: 2,
        },
      },
    },
    {
      ...base,
      comparison: {
        common_service_horizon_years: 2,
      },
    },
    {
      ...base,
      comparison: {
        common_service_horizon_years: 4,
      },
      replacement: {
        ...base.replacement,
        expected_adequate_service: {
          expected_years: 4,
        },
      },
    },
    {
      ...base,
      replacement: {
        ...base.replacement,
        applicable_refurbishment_evidence: {
          ...evidence,
          stages: [{ name: "undocumented_transport", CO2e: 1 }],
        },
      },
    },
    {
      ...base,
      replacement: {
        ...base.replacement,
        undocumented_refurbishment_stage: {
          name: "cleaning",
          CO2e: 0,
        },
      },
    },
    {
      ...base,
      replacement: {
        ...base.replacement,
        applicable_refurbishment_evidence: "ADEME_REFURB_SMARTPHONE_REFERENCE",
      },
    },
    {
      ...base,
      replacement: {
        ...base.replacement,
        pathway: "used_secondhand",
      },
    },
  ];

  for (const input of unsupportedInputs) {
    const result = evaluateSecondaryPathwayCase(input);
    assert.notEqual(result.result_capability, "quantitative");
    assert.notEqual(result.equivalent_service_established, true);
    assert.notEqual(result.refurb_direct_CO2e?.status, APPROVED_SOURCE_SPECIFIC);
    assert.notEqual(result.refurb_direct_CO2e?.value, 7.61);
    assert.equal(Object.hasOwn(result, "adequate_service_coverage_years"), false);
  }
});

test("guard: SEC-12 personal counterfactual grants no displacement or credit authority off-structure", () => {
  const base = COMPOSED_CASES["SEC-12"];
  const unsupportedInputs = [
    {
      ...base,
      replacement: {
        pathway: "refurbished",
        personal_counterfactual_if_unavailable: "buy_new",
        market_context: {
          geography: "unspecified",
        },
      },
    },
    {
      ...base,
      replacement: {
        pathway: "used_secondhand",
        market_context: {
          geography: "unspecified",
        },
      },
    },
    {
      ...base,
      replacement: {
        pathway: "used_secondhand",
        personal_counterfactual_if_unavailable: null,
        market_context: {
          geography: "unspecified",
        },
      },
    },
    {
      ...base,
      replacement: {
        pathway: "used_secondhand",
        personal_counterfactual_if_unavailable: "keep_using",
        market_context: {
          geography: "unspecified",
        },
      },
    },
    {
      ...base,
      replacement: {
        pathway: "used_secondhand",
        personal_counterfactual_if_unavailable: "buy_new",
        market_context: {
          geography: "US",
        },
      },
    },
    {
      ...base,
      replacement: {
        pathway: "used_secondhand",
        personal_counterfactual_if_unavailable: "buy_new",
        market_context: {
          geography: "unspecified",
          claimed_displacement_coefficient: 0.4,
        },
      },
    },
    {
      ...base,
      replacement: {
        pathway: "used_secondhand",
        personal_counterfactual_if_unavailable: "buy_new",
        market_context: {
          geography: "unspecified",
        },
        US_displacement_coefficient: 0.4,
      },
    },
    {
      ...base,
      replacement: {
        pathway: "used_secondhand",
        personal_counterfactual_if_unavailable: "buy_new",
        market_context: {
          geography: "unspecified",
        },
        avoided_new_production_CO2e: 55,
      },
    },
    {
      ...base,
      replacement: {
        pathway: "used_secondhand",
        personal_counterfactual_if_unavailable: "buy_new",
        market_context: {
          geography: "unspecified",
        },
        survey_substitution_rate: 0.98,
      },
    },
    {
      ...base,
      replacement: {
        pathway: "used_secondhand",
        personal_counterfactual_if_unavailable: "buy_new",
        market_context: "unspecified",
      },
    },
  ];

  for (const input of unsupportedInputs) {
    const result = evaluateSecondaryPathwayCase(input);
    assert.equal(Object.hasOwn(result, "personal_purchase_substitution"), false);
    assert.notEqual(result.US_displacement_coefficient_applied, true);
    assert.equal(result.market_displacement_credit, null);
    assert.notEqual(result.market_displacement_credit, 1);
    assert.notEqual(result.market_displacement_credit, 0.4);
    assert.notEqual(result.market_displacement_credit, 0.98);
    assert.notEqual(result.avoided_new_production_CO2e, 55);
    assert.equal(Object.hasOwn(result, "survey_substitution_coefficient"), false);
    assert.equal(Object.hasOwn(result, "displacement_coefficient"), false);
    assert.equal(Object.hasOwn(result, "winner"), false);
    assert.equal(Object.hasOwn(result, "recommendation"), false);
  }

  // Exact SEC-12 structure still stores the personal counterfactual without credit.
  const authorized = evaluateSecondaryPathwayCase(base);
  assert.equal(authorized.personal_purchase_substitution, "buy_new");
  assert.equal(authorized.market_displacement_credit, null);
  assert.equal(authorized.avoided_new_production_CO2e, null);
  assert.equal(authorized.US_displacement_coefficient_applied, false);
  assert.equal(authorized.result_capability, "qualitative_only");
});

test("A-SEC-GLOBAL-01 keeps used_secondhand distinct from refurbished across SEC-01–SEC-12", () => {
  assert.notEqual("used_secondhand", "refurbished");

  const usedCaseIds = ["SEC-01", "SEC-03", "SEC-05", "SEC-06", "SEC-09", "SEC-12"];
  const refurbishedCaseIds = ["SEC-02", "SEC-04", "SEC-07", "SEC-08", "SEC-10"];

  for (const caseId of usedCaseIds) {
    const result = evaluateAuthorizedCase(caseId);
    assert.equal(result.secondary_pathway, "used_secondhand", caseId);
    assert.notEqual(result.secondary_pathway, "refurbished", caseId);
  }
  for (const caseId of refurbishedCaseIds) {
    const result = evaluateAuthorizedCase(caseId);
    assert.equal(result.secondary_pathway, "refurbished", caseId);
    assert.notEqual(result.secondary_pathway, "used_secondhand", caseId);
  }

  // SEC-11 partition: dual-candidate comparison preserves both pathways without collapse.
  const comparison = evaluateAuthorizedCase("SEC-11");
  assert.equal(COMPOSED_CASES["SEC-11"].used_candidate.pathway, "used_secondhand");
  assert.equal(COMPOSED_CASES["SEC-11"].refurbished_candidate.pathway, "refurbished");
  assert.notEqual(
    COMPOSED_CASES["SEC-11"].used_candidate.pathway,
    COMPOSED_CASES["SEC-11"].refurbished_candidate.pathway,
  );
  assert.equal(comparison.used.reuses_existing_device, true);
  assert.equal(comparison.refurbished.reuses_existing_device, true);
  assert.equal(Object.hasOwn(comparison, "secondary_pathway"), false);
  assert.equal(comparison.numeric_winner, null);

  // Negative: commercial used listing does not become refurbished.
  const commercialUsed = evaluateAuthorizedCase("SEC-03");
  assert.equal(CASES["SEC-03"].seller_type, "commercial_reseller");
  assert.equal(CASES["SEC-03"].listing_label, "used");
  assert.equal(commercialUsed.secondary_pathway, "used_secondhand");
  assert.notEqual(commercialUsed.secondary_pathway, "refurbished");
});

test("A-SEC-GLOBAL-02 keeps direct/cutoff prior-life exclusion distinct from avoided-new credit", () => {
  for (const caseId of SINGLE_PATHWAY_CASE_IDS) {
    const result = evaluateAuthorizedCase(caseId);
    assert.equal(result.accounting_mode, ACCOUNTING_MODE, caseId);
    assert.equal(
      result.original_manufacturing.status,
      PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF,
      caseId,
    );
    assert.equal(result.original_manufacturing.enters_direct_acquisition_total, false, caseId);
    assertNoAvoidedProductionCredit(result, caseId);
  }

  // SEC-11 partition: comparison invents neither avoided-production credit nor a winner.
  const comparison = evaluateAuthorizedCase("SEC-11");
  assert.equal(comparison.accounting_mode, ACCOUNTING_MODE);
  assertNoAvoidedProductionCredit(comparison, "SEC-11");
  assert.equal(comparison.numeric_winner, null);
  assert.equal(Object.hasOwn(comparison, "winner"), false);

  // SEC-12 stores personal buy_new separately from avoided-new credit.
  const personal = evaluateAuthorizedCase("SEC-12");
  assert.equal(personal.personal_purchase_substitution, "buy_new");
  assert.equal(personal.avoided_new_production_CO2e, null);
  assert.notEqual(personal.personal_purchase_substitution, personal.avoided_new_production_CO2e);
});

test("A-SEC-GLOBAL-03 keeps market_displacement_credit null without a valid enabled scenario", () => {
  for (const caseId of coveredCaseIds) {
    const result = evaluateAuthorizedCase(caseId);
    assertDisplacementCreditAbsentOrNull(result, caseId);
  }

  // Single-pathway outputs explicitly carry null credit under direct/cutoff.
  for (const caseId of SINGLE_PATHWAY_CASE_IDS) {
    const result = evaluateAuthorizedCase(caseId);
    assert.equal(result.market_displacement_credit, null, caseId);
  }

  // Negative: off-structure US / coefficient claims do not enable displacement credit.
  const injected = evaluateSecondaryPathwayCase({
    ...COMPOSED_CASES["SEC-12"],
    replacement: {
      pathway: "used_secondhand",
      personal_counterfactual_if_unavailable: "buy_new",
      market_context: {
        geography: "US",
        claimed_displacement_coefficient: 0.4,
      },
    },
  });
  assertDisplacementCreditAbsentOrNull(injected, "injected-US-coefficient");
  assert.equal(Object.hasOwn(injected, "personal_purchase_substitution"), false);
});

test("A-SEC-GLOBAL-04 keeps unknown environmental burden distinct from numeric zero", () => {
  assert.notEqual(UNKNOWN, 0);
  assert.equal(isUnknown(UNKNOWN), true);
  assert.equal(isUnknown(0), false);

  const sec01 = evaluateAuthorizedCase("SEC-01");
  assert.equal(sec01.transfer_CO2e.value, null);
  assert.notEqual(sec01.transfer_CO2e.value, 0);
  assert.equal(sec01.direct_secondary_CO2e, null);
  assert.notEqual(sec01.direct_secondary_CO2e, 0);

  const sec02 = evaluateAuthorizedCase("SEC-02");
  assert.equal(sec02.inspection_testing_CO2e, null);
  assert.notEqual(sec02.inspection_testing_CO2e, 0);
  assert.equal(sec02.cleaning_CO2e, null);
  assert.notEqual(sec02.cleaning_CO2e, 0);
  assert.equal(sec02.refurb_total_direct_CO2e, null);
  assert.notEqual(sec02.refurb_total_direct_CO2e, 0);

  const sec04 = evaluateAuthorizedCase("SEC-04");
  assert.equal(sec04.refurb_direct_CO2e.value, null);
  assert.notEqual(sec04.refurb_direct_CO2e.value, 0);

  const sec05 = evaluateAuthorizedCase("SEC-05");
  assert.equal(isUnknown(sec05.used_service_life), true);
  assert.notEqual(sec05.used_service_life, 0);

  const sec06 = evaluateAuthorizedCase("SEC-06");
  assert.equal(sec06.transfer_CO2e.value, null);
  assert.notEqual(sec06.transfer_CO2e.value, 0);
  assert.equal(sec06.used_direct_CO2e.value, null);
  assert.notEqual(sec06.used_direct_CO2e.value, 0);

  const sec08 = evaluateAuthorizedCase("SEC-08");
  assert.equal(sec08.refurb_direct_CO2e.value, null);
  assert.notEqual(sec08.refurb_direct_CO2e.value, 0);

  const sec11 = evaluateAuthorizedCase("SEC-11");
  assert.equal(sec11.used.direct_CO2e, null);
  assert.notEqual(sec11.used.direct_CO2e, 0);
  assert.equal(sec11.refurbished.direct_CO2e, null);
  assert.notEqual(sec11.refurbished.direct_CO2e, 0);

  const sec12 = evaluateAuthorizedCase("SEC-12");
  assert.equal(sec12.direct_secondary_CO2e, null);
  assert.notEqual(sec12.direct_secondary_CO2e, 0);
});

test("A-SEC-GLOBAL-05 prevents seller condition grade from deriving service life", () => {
  const gradedRefurbished = evaluateAuthorizedCase("SEC-04");
  assert.equal(CASES["SEC-04"].marketplace_condition_label, "Excellent");
  assert.equal(CASES["SEC-04"].expected_adequate_service.expected_years, 3.0);
  assert.equal(Object.hasOwn(gradedRefurbished, "used_service_life"), false);
  assert.equal(Object.hasOwn(gradedRefurbished, "grade_derived_service_life"), false);
  assert.equal(Object.hasOwn(gradedRefurbished, "inferred_remaining_life_years"), false);
  assert.notEqual(gradedRefurbished.result_capability, "quantitative");

  // Unknown service stays unknown even when grade/metadata are injected.
  const unknownWithGrade = evaluateSecondaryPathwayCase({
    ...COMPOSED_CASES["SEC-05"],
    replacement: {
      ...COMPOSED_CASES["SEC-05"].replacement,
      marketplace_condition_label: "Excellent",
      seller_condition_grade: "A",
      device_age_years: 1,
      warranty_years: 2,
      price: 499,
    },
  });
  assert.equal(unknownWithGrade.used_service_life, null);
  assert.notEqual(unknownWithGrade.used_service_life, 3);
  assert.notEqual(unknownWithGrade.used_service_life, 2);
  assert.equal(unknownWithGrade.equivalent_service_established, false);
  assert.equal(unknownWithGrade.result_capability, "insufficient_information");
  assert.equal(Object.hasOwn(unknownWithGrade, "grade_derived_service_life"), false);

  // Across the suite, no case invents a grade→service output field.
  for (const caseId of coveredCaseIds) {
    const result = evaluateAuthorizedCase(caseId);
    assert.equal(Object.hasOwn(result, "grade_derived_service_life"), false, caseId);
    assert.equal(Object.hasOwn(result, "inferred_remaining_life_years"), false, caseId);
  }
});

test("A-SEC-GLOBAL-06 requires adequate service over the common horizon or a complete ServiceSequence", () => {
  const unknownService = evaluateAuthorizedCase("SEC-05");
  assert.equal(unknownService.equivalent_service_established, false);
  assert.equal(unknownService.result_capability, "insufficient_information");
  assert.equal(Object.hasOwn(unknownService, "winner"), false);

  const shortService = evaluateAuthorizedCase("SEC-09");
  assert.equal(shortService.service_sequence_required, true);
  assert.equal(shortService.covered_service_years, 0.5);
  assert.equal(
    shortService.uncovered_service_years,
    COMPOSED_CASES["SEC-09"].comparison.common_service_horizon_years - 0.5,
  );
  assert.equal(shortService.next_event, UNKNOWN);
  assert.equal(shortService.result_capability, "insufficient_information");
  assert.equal(Object.hasOwn(shortService, "winner"), false);
  assert.equal(Object.hasOwn(shortService, "default_next_event"), false);

  const completeHorizon = evaluateAuthorizedCase("SEC-10");
  assert.equal(completeHorizon.equivalent_service_established, true);
  assert.equal(completeHorizon.service_sequence_required, false);
  assert.equal(
    completeHorizon.adequate_service_coverage_years,
    COMPOSED_CASES["SEC-10"].comparison.common_service_horizon_years,
  );
  assert.equal(completeHorizon.result_capability, "quantitative");

  // Adequate dual candidates may be described qualitatively without fabricating a winner.
  const qualitativePair = evaluateAuthorizedCase("SEC-11");
  assert.equal(
    COMPOSED_CASES["SEC-11"].used_candidate.expected_adequate_service.expected_years,
    COMPOSED_CASES["SEC-11"].comparison.common_service_horizon_years,
  );
  assert.equal(
    COMPOSED_CASES["SEC-11"].refurbished_candidate.expected_adequate_service.expected_years,
    COMPOSED_CASES["SEC-11"].comparison.common_service_horizon_years,
  );
  assert.equal(qualitativePair.numeric_winner, null);
  assert.equal(qualitativePair.result_capability, "qualitative_only");
});

test("A-SEC-GLOBAL-07 never uses ADEME 7.61 as a generic refurbished fallback", () => {
  const ademeExplicit = evaluateAuthorizedCase("SEC-07");
  assert.equal(ademeExplicit.refurb_direct_reference_CO2e.value, 7.61);
  assert.equal(ademeExplicit.refurb_direct_reference_CO2e.status, APPROVED_SOURCE_SPECIFIC);
  assert.equal(
    ademeExplicit.refurb_direct_reference_CO2e.source_id,
    SECONDARY_PATHWAY_CONSTANTS.ADEME_REFURB_SMARTPHONE_REFERENCE,
  );
  assert.equal(ademeExplicit.generic_default, false);
  assert.equal(ademeExplicit.decomposable, false);

  const completeEvidence = evaluateAuthorizedCase("SEC-10");
  assert.equal(completeEvidence.refurb_direct_CO2e.value, 7.61);
  assert.equal(completeEvidence.refurb_direct_CO2e.source_specific, true);
  assert.equal(completeEvidence.refurb_direct_CO2e.decomposable, false);

  // Generic / absent refurbished selections must not inherit 7.61.
  for (const caseId of ["SEC-02", "SEC-04", "SEC-08"]) {
    const result = evaluateAuthorizedCase(caseId);
    assert.notEqual(result.refurb_direct_CO2e?.value, 7.61, caseId);
    assert.notEqual(result.refurb_total_direct_CO2e, 7.61, caseId);
    assert.notEqual(result.refurb_direct_reference_CO2e?.value, 7.61, caseId);
    if (Object.hasOwn(result, "ADEME_7_61_applied")) {
      assert.equal(result.ADEME_7_61_applied, false, caseId);
    }
  }

  // Used pathways never receive ADEME as a generic numerical burden.
  for (const caseId of ["SEC-01", "SEC-03", "SEC-05", "SEC-06", "SEC-09", "SEC-12"]) {
    const result = evaluateAuthorizedCase(caseId);
    assert.notEqual(result.direct_secondary_CO2e, 7.61, caseId);
    assert.equal(Object.hasOwn(result, "refurb_direct_reference_CO2e"), false, caseId);
    assert.notEqual(result.ADEME_7_61_applied, true, caseId);
  }

  const comparison = evaluateAuthorizedCase("SEC-11");
  assert.notEqual(comparison.refurbished.direct_CO2e, 7.61);
  assert.equal(comparison.refurbished.direct_CO2e, null);

  // Negative: arbitrary refurbished model / seller / grade cannot select ADEME.
  const arbitrary = evaluateSecondaryPathwayCase({
    ...COMPOSED_CASES["SEC-08"],
    replacement: {
      ...COMPOSED_CASES["SEC-08"].replacement,
      marketplace_condition_label: "Excellent",
      seller_type: "commercial_reseller",
      expected_adequate_service: { expected_years: 2.0 },
    },
  });
  assert.equal(arbitrary.ADEME_7_61_applied, false);
  assert.notEqual(arbitrary.refurb_direct_CO2e?.value, 7.61);
  assert.equal(Object.hasOwn(arbitrary, "refurb_direct_reference_CO2e"), false);
});

test("A-SEC-GLOBAL-08 never applies the U.S. 0.40 coefficient to primary direct scoring", () => {
  for (const caseId of coveredCaseIds) {
    const result = evaluateAuthorizedCase(caseId);
    assertDisplacementCreditAbsentOrNull(result, caseId);
    assert.notEqual(result.market_displacement_credit, 0.4, caseId);
    assert.notEqual(result.market_displacement_credit, 0.4, caseId);
    assert.equal(Object.hasOwn(result, "primary_direct_score_with_US_coefficient"), false, caseId);
  }

  const personal = evaluateAuthorizedCase("SEC-12");
  assert.equal(personal.US_displacement_coefficient_applied, false);
  assert.equal(personal.market_displacement_credit, null);
  assert.equal(personal.avoided_new_production_CO2e, null);
  assert.equal(personal.personal_purchase_substitution, "buy_new");
  assert.notEqual(personal.personal_purchase_substitution, 0.4);

  // Negative: geography or injected coefficient never enters primary scoring.
  const usClaim = evaluateSecondaryPathwayCase({
    ...COMPOSED_CASES["SEC-12"],
    replacement: {
      pathway: "used_secondhand",
      personal_counterfactual_if_unavailable: "buy_new",
      market_context: {
        geography: "US",
      },
      US_displacement_coefficient: 0.4,
    },
  });
  assert.notEqual(usClaim.US_displacement_coefficient_applied, true);
  assert.equal(usClaim.market_displacement_credit, null);
  assert.equal(Object.hasOwn(usClaim, "direct_score_after_credit"), false);
  assert.equal(Object.hasOwn(usClaim, "primary_attributional_score_modified"), false);
});

test("covered secondary global assertion IDs remain the eight executed A-SEC-GLOBAL identifiers", () => {
  assert.deepEqual(coveredGlobalAssertionIds, [
    "A-SEC-GLOBAL-01",
    "A-SEC-GLOBAL-02",
    "A-SEC-GLOBAL-03",
    "A-SEC-GLOBAL-04",
    "A-SEC-GLOBAL-05",
    "A-SEC-GLOBAL-06",
    "A-SEC-GLOBAL-07",
    "A-SEC-GLOBAL-08",
  ]);
  assert.equal(coveredGlobalAssertionIds.length, 8);
});
