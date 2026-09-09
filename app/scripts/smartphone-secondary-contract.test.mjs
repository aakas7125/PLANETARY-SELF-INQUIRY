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
  "SEC-09",
  "SEC-11",
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
  "A-SEC-09-01",
  "A-SEC-09-02",
  "A-SEC-09-03",
  "A-SEC-09-04",
  "A-SEC-11-01",
  "A-SEC-11-02",
  "A-SEC-11-03",
  "A-SEC-11-04",
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

/** Exact immutable package top-level inputs for SEC-05, SEC-06, SEC-09, and SEC-11. */
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

test("secondary slice covers the eight authorized cases and 28 listed assertions only", () => {
  assert.deepEqual(coveredCaseIds, [
    "SEC-01",
    "SEC-02",
    "SEC-03",
    "SEC-04",
    "SEC-05",
    "SEC-06",
    "SEC-09",
    "SEC-11",
  ]);
  assert.equal(coveredAssertionIds.length, 28);
  assert.ok(coveredAssertionIds.every((id) => /^A-SEC-(?:0[1-6]|09|11)-\d{2}$/.test(id)));
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

test("SEC-05, SEC-06, SEC-09, and SEC-11 results are invariant to case_id metadata", () => {
  for (const caseId of ["SEC-05", "SEC-06", "SEC-09", "SEC-11"]) {
    const input = COMPOSED_CASES[caseId];
    const { case_id: _omitted, ...withoutCaseId } = input;
    const renamedCaseId = {
      ...input,
      case_id: `RENAMED-${caseId}`,
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

test("guard: unimplemented secondary cases do not gain composed behavior", () => {
  const result = evaluateSecondaryPathwayCase({
    case_id: "SEC-07",
    replacement: {
      pathway: "refurbished",
      source_specific_reference: {
        source_id: "ADEME_REFURB_SMARTPHONE_REFERENCE",
        explicitly_selected: true,
      },
    },
  });

  assert.equal(result.secondary_pathway, UNKNOWN);
  assert.equal(Object.hasOwn(result, "refurb_direct_reference_CO2e"), false);
  assert.equal(Object.hasOwn(result, "ADEME_7_61_applied"), false);
});
