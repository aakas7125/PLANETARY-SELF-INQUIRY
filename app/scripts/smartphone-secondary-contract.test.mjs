import assert from "node:assert/strict";
import { test } from "node:test";
import {
  UNKNOWN,
  NOT_EVIDENCED,
  UNKNOWN_NO_FALLBACK,
  PROVISIONAL_GENERIC_RANGE,
  PRIOR_LIFE_EXCLUDED_DIRECT_CUTOFF,
  ACCOUNTING_MODE,
  evaluateSecondaryPathway,
  isUnknown,
  SECONDARY_PATHWAY_CONSTANTS,
} from "../src/lib/smartphone/secondary-pathway.mjs";

const coveredCaseIds = ["SEC-01", "SEC-02", "SEC-03", "SEC-04"];
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
];

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

/** Forbidden assertion-mirroring / unrequested output fields for this slice. */
const FORBIDDEN_OUTPUT_FIELDS = [
  "fabricated_preparation_processes",
  "marketplace_grade_selected_lca",
];

test("secondary slice covers SEC-01–SEC-04 and fourteen listed assertions only", () => {
  assert.deepEqual(coveredCaseIds, ["SEC-01", "SEC-02", "SEC-03", "SEC-04"]);
  assert.equal(coveredAssertionIds.length, 14);
  assert.ok(coveredAssertionIds.every((id) => /^A-SEC-0[1-4]-\d{2}$/.test(id)));
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
  assert.equal(
    Object.hasOwn(result.original_manufacturing, "avoided_production_credit"),
    false,
  );
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
  assert.deepEqual(
    result.battery_replacement_CO2e,
    [...SECONDARY_PATHWAY_CONSTANTS.BATTERY_REPLACEMENT_CO2E_KG],
  );
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
  assert.equal(
    Object.hasOwn(result.original_manufacturing, "avoided_production_credit"),
    false,
  );
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

test("used_secondhand and refurbished remain distinct across the executed slice", () => {
  const used = evaluateSecondaryPathway(CASES["SEC-01"]);
  const refurbished = evaluateSecondaryPathway(CASES["SEC-02"]);
  assert.notEqual(used.secondary_pathway, refurbished.secondary_pathway);
  assert.equal(used.secondary_pathway, "used_secondhand");
  assert.equal(refurbished.secondary_pathway, "refurbished");
});
