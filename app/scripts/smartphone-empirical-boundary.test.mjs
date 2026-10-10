import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  ACCEPTED_CLIMATE_CLAIM,
  ACCEPTED_CLIMATE_SOURCES,
  ATTRIBUTION_PRESSURE_TO_OUTCOME,
  CLIMATE_CLAIM_ID,
  CLIMATE_CLAIM_PACKAGE_COMMIT,
  CLIMATE_METRIC,
  CLIMATE_PATHWAY_REASON,
  CLIMATE_UNIT,
  PACKAGE_PROVENANCE,
  PATHWAY_KIND_CONDITIONAL_PRESSURE_TO_OUTCOME,
  PENDING_EMPIRICAL_PATHWAY_IDS,
  parseEmpiricalClaimRef,
  resolveClimatePathwayBoundary,
  validateClimateClaimAuthorityRecord,
} from "../src/lib/smartphone/empirical-climate-boundary.mjs";
import {
  ACCEPTED_MINING_ECO_CLAIM,
  ACCEPTED_MINING_ECO_SOURCES,
  ATTRIBUTION_NOT_ATTRIBUTABLE_TO_SPECIFIC_DEVICE,
  MINING_ECO_CLAIM_ID,
  MINING_ECO_CLAIM_PACKAGE_COMMIT,
  MINING_ECO_PATHWAY_REASON,
  PACKAGE_PROVENANCE as MINING_ECO_PACKAGE_PROVENANCE,
  PATHWAY_KIND_QUALITATIVE_CONDITIONAL,
  PENDING_EMPIRICAL_PATHWAY_IDS as MINING_ECO_PENDING_IDS,
  resolveMiningEcoPathwayBoundary,
  validateMiningEcoClaimAuthorityRecord,
} from "../src/lib/smartphone/empirical-mining-eco-boundary.mjs";
import {
  ACCEPTED_MINING_PEOPLE_CLAIM,
  ACCEPTED_MINING_PEOPLE_SOURCES,
  ATTRIBUTION_CONDITIONAL_PATHWAY,
  MINING_PEOPLE_CLAIM_ID,
  MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
  MINING_PEOPLE_PATHWAY_REASON,
  PACKAGE_PROVENANCE as MINING_PEOPLE_PACKAGE_PROVENANCE,
  PATHWAY_KIND_QUALITATIVE_CONDITIONAL as MINING_PEOPLE_PATHWAY_KIND,
  PENDING_EMPIRICAL_PATHWAY_IDS as MINING_PEOPLE_PENDING_IDS,
  resolveMiningPeoplePathwayBoundary,
  validateMiningPeopleClaimAuthorityRecord,
  validateMiningPeopleSourceRecords,
} from "../src/lib/smartphone/empirical-mining-people-boundary.mjs";
import {
  ACCEPTED_EWASTE_PEOPLE_CLAIM,
  ACCEPTED_EWASTE_PEOPLE_SOURCES,
  ATTRIBUTION_CONDITIONAL_PATHWAY as EWASTE_PEOPLE_ATTRIBUTION,
  EWASTE_PEOPLE_CLAIM_ID,
  EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
  EWASTE_PEOPLE_PATHWAY_REASON,
  NON_ESTABLISHING_OLD_DEVICE_FATES,
  PACKAGE_PROVENANCE as EWASTE_PEOPLE_PACKAGE_PROVENANCE,
  PATHWAY_KIND_QUALITATIVE_CONDITIONAL as EWASTE_PEOPLE_PATHWAY_KIND,
  PENDING_EMPIRICAL_PATHWAY_IDS as EWASTE_PEOPLE_PENDING_IDS,
  resolveEwastePeoplePathwayBoundary,
  validateEwastePeopleClaimAuthorityRecord,
  validateEwastePeopleSourceRecords,
} from "../src/lib/smartphone/empirical-ewaste-people-boundary.mjs";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryDirectory = resolve(scriptsDirectory, "../..");

function readJson(relativePath) {
  return JSON.parse(readFileSync(join(repositoryDirectory, relativePath), "utf8"));
}

function validClimateRequest(overrides = {}) {
  return {
    claim_id: CLIMATE_CLAIM_ID,
    claim_version: CLIMATE_CLAIM_PACKAGE_COMMIT,
    requested_output: PATHWAY_KIND_CONDITIONAL_PRESSURE_TO_OUTCOME,
    scenario_produces_ghg_emissions: true,
    ...overrides,
  };
}

test("frozen climate claim matches evidence/CLAIM_REGISTRY.json exactly", () => {
  const registry = readJson("evidence/CLAIM_REGISTRY.json");
  const fromRegistry = registry.find(
    (row) => row.claim_id === CLIMATE_CLAIM_ID,
  );
  assert.ok(fromRegistry, "SP-PATH-CLIMATE-001 must exist in claim registry");
  assert.deepEqual(
    {
      claim_id: fromRegistry.claim_id,
      package_commit: fromRegistry.package_commit,
      package_provenance: fromRegistry.package_provenance,
      statement: fromRegistry.statement,
      evidence_domain: fromRegistry.evidence_domain,
      confidence: fromRegistry.confidence,
      attribution_status: fromRegistry.attribution_status,
      evidence_scope: fromRegistry.evidence_scope,
      status: fromRegistry.status,
      conditions: fromRegistry.conditions,
      source_ids: fromRegistry.source_ids,
    },
    { ...ACCEPTED_CLIMATE_CLAIM },
  );
});

test("frozen climate sources match evidence/SOURCE_REGISTRY.json for S1/S8/S9", () => {
  const registry = readJson("evidence/SOURCE_REGISTRY.json");
  for (const sourceId of ["S1", "S8", "S9"]) {
    const fromRegistry = registry.find((row) => row.source_id === sourceId);
    assert.ok(fromRegistry, `${sourceId} must exist in source registry`);
    assert.deepEqual(
      {
        source_id: fromRegistry.source_id,
        package_commit: fromRegistry.package_commit,
        package_provenance: fromRegistry.package_provenance,
        citation: fromRegistry.citation,
        scope: fromRegistry.scope,
        metadata_limit: fromRegistry.metadata_limit,
      },
      { ...ACCEPTED_CLIMATE_SOURCES[sourceId] },
    );
  }
});

test("SP-PATH-CLIMATE-001 emits conditional pressure-to-outcome pathway with preserved authority", () => {
  const byParts = resolveClimatePathwayBoundary(validClimateRequest());
  const byRef = resolveClimatePathwayBoundary(
    validClimateRequest({
      claim_id: undefined,
      claim_version: undefined,
      claim_ref: `${CLIMATE_CLAIM_ID}@${CLIMATE_CLAIM_PACKAGE_COMMIT}`,
    }),
  );

  for (const decision of [byParts, byRef]) {
    assert.equal(decision.emitted, true);
    assert.equal(decision.reason_code, null);
    assert.equal(decision.claim_id, CLIMATE_CLAIM_ID);
    assert.equal(decision.claim_version, CLIMATE_CLAIM_PACKAGE_COMMIT);
    assert.equal(
      decision.claim_ref,
      `${CLIMATE_CLAIM_ID}@${CLIMATE_CLAIM_PACKAGE_COMMIT}`,
    );
    assert.ok(decision.pathway);
    assert.equal(
      decision.pathway.pathway_kind,
      PATHWAY_KIND_CONDITIONAL_PRESSURE_TO_OUTCOME,
    );
    assert.equal(decision.pathway.statement, ACCEPTED_CLIMATE_CLAIM.statement);
    assert.deepEqual(
      decision.pathway.evidence_domain,
      ACCEPTED_CLIMATE_CLAIM.evidence_domain,
    );
    assert.deepEqual(
      decision.pathway.evidence_scope,
      ACCEPTED_CLIMATE_CLAIM.evidence_scope,
    );
    assert.equal(decision.pathway.confidence, "high");
    assert.equal(
      decision.pathway.attribution_status,
      ATTRIBUTION_PRESSURE_TO_OUTCOME,
    );
    assert.deepEqual(
      decision.pathway.conditions,
      ACCEPTED_CLIMATE_CLAIM.conditions,
    );
    assert.deepEqual(
      decision.pathway.major_assumptions,
      ACCEPTED_CLIMATE_CLAIM.conditions,
    );
    assert.equal(decision.pathway.status, "APPROVED");
    assert.equal(decision.pathway.package_provenance, PACKAGE_PROVENANCE);
    assert.equal(CLIMATE_UNIT, "kg CO2e");
    assert.equal(decision.pathway.unit, "kg CO2e");
    assert.equal(decision.pathway.unit, CLIMATE_UNIT);
    assert.equal(decision.pathway.metric, CLIMATE_METRIC);
    assert.equal(decision.pathway.quantitative_value, null);
    assert.equal(decision.pathway.value_range, null);
    assert.equal(decision.pathway.model_specific_or_fallback_status, null);
    assert.deepEqual(decision.pathway.source_ids, ["S1", "S8", "S9"]);
    assert.equal(decision.pathway.sources.length, 3);
    assert.equal(decision.unified_score, null);
    assert.equal(decision.victims_caused, null);
    assert.equal(decision.deaths_caused_or_avoided, null);
    assert.equal(decision.exact_individual_damage, null);
    assert.equal(decision.named_target_attribution, null);
    assert.ok(
      decision.pathway.attribution_limits.includes(
        "no_named_person_species_place_or_event_attribution",
      ),
    );
  }
});

test("missing, malformed, unknown and conflicting claim identity/version are denied", () => {
  assert.equal(
    resolveClimatePathwayBoundary({
      scenario_produces_ghg_emissions: true,
    }).reason_code,
    CLIMATE_PATHWAY_REASON.MISSING_CLAIM_IDENTITY,
  );

  assert.equal(
    resolveClimatePathwayBoundary({
      claim_id: CLIMATE_CLAIM_ID,
      scenario_produces_ghg_emissions: true,
    }).reason_code,
    CLIMATE_PATHWAY_REASON.MISSING_CLAIM_VERSION,
  );

  assert.equal(
    resolveClimatePathwayBoundary(
      validClimateRequest({ claim_id: "SP-PATH-UNKNOWN-999" }),
    ).reason_code,
    CLIMATE_PATHWAY_REASON.UNKNOWN_CLAIM,
  );

  assert.equal(
    resolveClimatePathwayBoundary(
      validClimateRequest({ claim_id: "not a claim" }),
    ).reason_code,
    CLIMATE_PATHWAY_REASON.MALFORMED_CLAIM_IDENTITY,
  );

  assert.equal(
    resolveClimatePathwayBoundary(
      validClimateRequest({ claim_version: "wrong-commit" }),
    ).reason_code,
    CLIMATE_PATHWAY_REASON.WRONG_CLAIM_VERSION,
  );

  assert.equal(
    resolveClimatePathwayBoundary(
      validClimateRequest({
        claim_ref: `${CLIMATE_CLAIM_ID}@${CLIMATE_CLAIM_PACKAGE_COMMIT}`,
        claim_id: "SP-PATH-WATER-001",
      }),
    ).reason_code,
    CLIMATE_PATHWAY_REASON.CONFLICTING_CLAIM_REPRESENTATION,
  );

  const unversioned = parseEmpiricalClaimRef(CLIMATE_CLAIM_ID);
  assert.equal(unversioned.claim_id, CLIMATE_CLAIM_ID);
  assert.equal(unversioned.claim_version, null);
});

test("pending empirical pathway IDs remain non-emitting in the climate slice", () => {
  assert.deepEqual(PENDING_EMPIRICAL_PATHWAY_IDS, [
    "SP-PATH-EWASTE-PEOPLE-001",
    "SP-PATH-EWASTE-ECO-001",
    "SP-PATH-WATER-001",
  ]);
  for (const claimId of PENDING_EMPIRICAL_PATHWAY_IDS) {
    const decision = resolveClimatePathwayBoundary({
      claim_id: claimId,
      claim_version: CLIMATE_CLAIM_PACKAGE_COMMIT,
      scenario_produces_ghg_emissions: true,
    });
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      CLIMATE_PATHWAY_REASON.PATHWAY_NOT_IN_AUTHORIZED_SLICE,
    );
    assert.equal(decision.pathway, null);
  }

  // Mining-eco / mining-people are covered by their own modules; climate does not emit them.
  for (const claimId of [
    "SP-PATH-MINING-ECO-001",
    "SP-PATH-MINING-PEOPLE-001",
  ]) {
    const decision = resolveClimatePathwayBoundary({
      claim_id: claimId,
      claim_version: CLIMATE_CLAIM_PACKAGE_COMMIT,
      scenario_produces_ghg_emissions: true,
    });
    assert.equal(decision.emitted, false);
    assert.equal(decision.reason_code, CLIMATE_PATHWAY_REASON.UNKNOWN_CLAIM);
  }
});

test("missing required claim/source/scope/condition/attribution metadata fails closed", () => {
  const missingStatement = resolveClimatePathwayBoundary(
    validClimateRequest({
      authority_claim_record: {
        ...ACCEPTED_CLIMATE_CLAIM,
        statement: "",
      },
    }),
  );
  assert.equal(missingStatement.emitted, false);
  assert.equal(
    missingStatement.reason_code,
    CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
  );

  const missingScope = resolveClimatePathwayBoundary(
    validClimateRequest({
      authority_claim_record: {
        ...ACCEPTED_CLIMATE_CLAIM,
        evidence_scope: [],
      },
    }),
  );
  assert.equal(
    missingScope.reason_code,
    CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_SCOPE,
  );

  const missingConditions = resolveClimatePathwayBoundary(
    validClimateRequest({
      authority_claim_record: {
        ...ACCEPTED_CLIMATE_CLAIM,
        conditions: [],
      },
    }),
  );
  assert.equal(
    missingConditions.reason_code,
    CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_CONDITIONS,
  );

  const missingAttribution = resolveClimatePathwayBoundary(
    validClimateRequest({
      authority_claim_record: {
        ...ACCEPTED_CLIMATE_CLAIM,
        attribution_status: "",
      },
    }),
  );
  assert.equal(
    missingAttribution.reason_code,
    CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_ATTRIBUTION,
  );

  const missingSource = resolveClimatePathwayBoundary(
    validClimateRequest({
      authority_source_map: {
        S1: ACCEPTED_CLIMATE_SOURCES.S1,
        S8: ACCEPTED_CLIMATE_SOURCES.S8,
        // S9 absent
      },
    }),
  );
  assert.equal(
    missingSource.reason_code,
    CLIMATE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
  );

  assert.equal(validateClimateClaimAuthorityRecord(null).ok, false);
});

test("named-target attribution is denied", () => {
  for (const marker of [
    { named_person: "Alex" },
    { named_species: "snow leopard" },
    { named_place: "Lake Baikal" },
    { named_event: "2023 wildfire" },
  ]) {
    const decision = resolveClimatePathwayBoundary(validClimateRequest(marker));
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      CLIMATE_PATHWAY_REASON.NAMED_TARGET_ATTRIBUTION_PROHIBITED,
    );
    assert.equal(decision.named_target_attribution, null);
  }
});

test("victims/deaths, exact individual damage and unified scores are denied", () => {
  assert.equal(
    resolveClimatePathwayBoundary(
      validClimateRequest({ request_victims_or_deaths: true }),
    ).reason_code,
    CLIMATE_PATHWAY_REASON.VICTIMS_OR_DEATHS_PROHIBITED,
  );
  assert.equal(
    resolveClimatePathwayBoundary(
      validClimateRequest({ request_exact_individual_damage: true }),
    ).reason_code,
    CLIMATE_PATHWAY_REASON.EXACT_INDIVIDUAL_DAMAGE_PROHIBITED,
  );
  assert.equal(
    resolveClimatePathwayBoundary(
      validClimateRequest({ request_unified_score: true }),
    ).reason_code,
    CLIMATE_PATHWAY_REASON.UNIFIED_SCORE_PROHIBITED,
  );
});

test("unsupported causal-proof wording is denied", () => {
  const decision = resolveClimatePathwayBoundary(
    validClimateRequest({ request_causal_proof: true }),
  );
  assert.equal(decision.emitted, false);
  assert.equal(
    decision.reason_code,
    CLIMATE_PATHWAY_REASON.UNSUPPORTED_CAUSAL_PROOF_WORDING,
  );
});

test("unknown coercion to zero/false is denied; unmet GHG condition stays non-emitting", () => {
  assert.equal(
    resolveClimatePathwayBoundary(
      validClimateRequest({ coerce_unknown_to_zero: true }),
    ).reason_code,
    CLIMATE_PATHWAY_REASON.UNKNOWN_COERCION_PROHIBITED,
  );
  assert.equal(
    resolveClimatePathwayBoundary(
      validClimateRequest({ coerce_unknown_to_false: true }),
    ).reason_code,
    CLIMATE_PATHWAY_REASON.UNKNOWN_COERCION_PROHIBITED,
  );

  const unknownCondition = resolveClimatePathwayBoundary(
    validClimateRequest({ scenario_produces_ghg_emissions: null }),
  );
  assert.equal(unknownCondition.emitted, false);
  assert.equal(
    unknownCondition.reason_code,
    CLIMATE_PATHWAY_REASON.CONDITION_NOT_SATISFIED,
  );
  assert.equal(unknownCondition.quantitative_value, null);

  const falseCondition = resolveClimatePathwayBoundary(
    validClimateRequest({ scenario_produces_ghg_emissions: false }),
  );
  assert.equal(falseCondition.emitted, false);
  assert.equal(
    falseCondition.reason_code,
    CLIMATE_PATHWAY_REASON.CONDITION_NOT_SATISFIED,
  );
});

test("case/test metadata is not production authority", () => {
  const byCaseOnly = resolveClimatePathwayBoundary({
    case_id: "SP-PATH-CLIMATE-001",
    scenario_produces_ghg_emissions: true,
  });
  assert.equal(byCaseOnly.emitted, false);
  assert.equal(
    byCaseOnly.reason_code,
    CLIMATE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY,
  );

  const byAssertionOnly = resolveClimatePathwayBoundary({
    assertion_id: "A-CLIMATE-001",
    scenario_produces_ghg_emissions: true,
  });
  assert.equal(
    byAssertionOnly.reason_code,
    CLIMATE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY,
  );

  const forced = resolveClimatePathwayBoundary(
    validClimateRequest({ use_case_id_as_claim_authority: true }),
  );
  assert.equal(
    forced.reason_code,
    CLIMATE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY,
  );

  // Incidental case_id beside a valid claim identity is ignored, not authoritative.
  const incidental = resolveClimatePathwayBoundary(
    validClimateRequest({ case_id: "fixture-name-only" }),
  );
  assert.equal(incidental.emitted, true);
  assert.equal(incidental.reason_code, null);
});

test("unsupported requested outputs do not emit", () => {
  const decision = resolveClimatePathwayBoundary(
    validClimateRequest({
      requested_output: "unified_environmental_harm_score",
    }),
  );
  assert.equal(decision.emitted, false);
  assert.equal(
    decision.reason_code,
    CLIMATE_PATHWAY_REASON.UNSUPPORTED_REQUESTED_OUTPUT,
  );
});

test("conflicting injected authority under climate claim identity fails closed", () => {
  const decision = resolveClimatePathwayBoundary(
    validClimateRequest({
      authority_claim_record: {
        ...ACCEPTED_CLIMATE_CLAIM,
        attribution_status: "device_specific",
      },
    }),
  );
  assert.equal(decision.emitted, false);
  assert.equal(
    decision.reason_code,
    CLIMATE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
  );
});

test("altered claim statement/domains/scopes/confidence/status/conditions/sources fail exact-authority check", () => {
  const alteredClaims = [
    { statement: "Altered climate statement under accepted identity." },
    { evidence_domain: ["climate"] },
    { evidence_scope: ["product_class"] },
    { confidence: "moderate" },
    { status: "PROVISIONAL" },
    {
      conditions: [
        "scenario produces GHG emissions",
        "no individual victim or ecosystem attribution",
        "extra invented condition",
      ],
    },
    { conditions: ["no individual victim or ecosystem attribution", "scenario produces GHG emissions"] },
    { source_ids: ["S1", "S8"] },
    { source_ids: ["S1", "S9", "S8"] },
    { source_ids: ["S1", "S8", "S10"] },
    { package_commit: "ffffffffffffffffffffffffffffffffffffffff" },
    { package_provenance: "R&E-V0-SMARTPHONE-ALTERED" },
  ];

  for (const alteration of alteredClaims) {
    const decision = resolveClimatePathwayBoundary(
      validClimateRequest({
        authority_claim_record: {
          ...ACCEPTED_CLIMATE_CLAIM,
          ...alteration,
        },
      }),
    );
    assert.equal(decision.emitted, false, `expected deny for ${JSON.stringify(alteration)}`);
    assert.equal(
      decision.reason_code,
      CLIMATE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
    );
    assert.equal(decision.pathway, null);
  }
});

test("altered source package pin/citation/scope/metadata limit and extra/substituted sources fail closed", () => {
  const alteredSourceCases = [
    {
      S1: {
        ...ACCEPTED_CLIMATE_SOURCES.S1,
        package_commit: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
      S8: ACCEPTED_CLIMATE_SOURCES.S8,
      S9: ACCEPTED_CLIMATE_SOURCES.S9,
    },
    {
      S1: {
        ...ACCEPTED_CLIMATE_SOURCES.S1,
        citation: "Altered citation text.",
      },
      S8: ACCEPTED_CLIMATE_SOURCES.S8,
      S9: ACCEPTED_CLIMATE_SOURCES.S9,
    },
    {
      S1: ACCEPTED_CLIMATE_SOURCES.S1,
      S8: {
        ...ACCEPTED_CLIMATE_SOURCES.S8,
        scope: "Altered source scope.",
      },
      S9: ACCEPTED_CLIMATE_SOURCES.S9,
    },
    {
      S1: ACCEPTED_CLIMATE_SOURCES.S1,
      S8: ACCEPTED_CLIMATE_SOURCES.S8,
      S9: {
        ...ACCEPTED_CLIMATE_SOURCES.S9,
        metadata_limit: "Altered metadata limit.",
      },
    },
    {
      S1: ACCEPTED_CLIMATE_SOURCES.S1,
      S8: ACCEPTED_CLIMATE_SOURCES.S8,
      S9: ACCEPTED_CLIMATE_SOURCES.S9,
      S10: {
        source_id: "S10",
        package_commit: CLIMATE_CLAIM_PACKAGE_COMMIT,
        package_provenance: PACKAGE_PROVENANCE,
        citation: "Extra substituted source.",
        scope: "extra",
        metadata_limit: "extra",
      },
    },
    {
      S1: ACCEPTED_CLIMATE_SOURCES.S1,
      S8: ACCEPTED_CLIMATE_SOURCES.S8,
      S2: {
        source_id: "S2",
        package_commit: CLIMATE_CLAIM_PACKAGE_COMMIT,
        package_provenance: PACKAGE_PROVENANCE,
        citation: "Substituted source identity.",
        scope: "substituted",
        metadata_limit: "substituted",
      },
    },
  ];

  for (const [index, authority_source_map] of alteredSourceCases.entries()) {
    const decision = resolveClimatePathwayBoundary(
      validClimateRequest({ authority_source_map }),
    );
    assert.equal(decision.emitted, false, `expected deny for altered source case ${index}`);
    assert.equal(
      decision.reason_code,
      CLIMATE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
    );
    assert.equal(decision.pathway, null);
  }
});

function validMiningEcoRequest(overrides = {}) {
  return {
    claim_id: MINING_ECO_CLAIM_ID,
    claim_version: MINING_ECO_CLAIM_PACKAGE_COMMIT,
    requested_output: PATHWAY_KIND_QUALITATIVE_CONDITIONAL,
    relevant_primary_metal_extraction_occurs: true,
    ...overrides,
  };
}

test("frozen mining-eco claim matches evidence/CLAIM_REGISTRY.json exactly", () => {
  const registry = readJson("evidence/CLAIM_REGISTRY.json");
  const fromRegistry = registry.find(
    (row) => row.claim_id === MINING_ECO_CLAIM_ID,
  );
  assert.ok(fromRegistry, "SP-PATH-MINING-ECO-001 must exist in claim registry");
  assert.deepEqual(
    {
      claim_id: fromRegistry.claim_id,
      package_commit: fromRegistry.package_commit,
      package_provenance: fromRegistry.package_provenance,
      statement: fromRegistry.statement,
      evidence_domain: fromRegistry.evidence_domain,
      confidence: fromRegistry.confidence,
      attribution_status: fromRegistry.attribution_status,
      evidence_scope: fromRegistry.evidence_scope,
      status: fromRegistry.status,
      conditions: fromRegistry.conditions,
      source_ids: fromRegistry.source_ids,
    },
    { ...ACCEPTED_MINING_ECO_CLAIM },
  );
});

test("frozen mining-eco source matches evidence/SOURCE_REGISTRY.json for S10", () => {
  const registry = readJson("evidence/SOURCE_REGISTRY.json");
  const fromRegistry = registry.find((row) => row.source_id === "S10");
  assert.ok(fromRegistry, "S10 must exist in source registry");
  assert.deepEqual(
    {
      source_id: fromRegistry.source_id,
      package_commit: fromRegistry.package_commit,
      package_provenance: fromRegistry.package_provenance,
      citation: fromRegistry.citation,
      scope: fromRegistry.scope,
      metadata_limit: fromRegistry.metadata_limit,
    },
    { ...ACCEPTED_MINING_ECO_SOURCES.S10 },
  );
});

test("SP-PATH-MINING-ECO-001 emits qualitative pathway with preserved authority", () => {
  const byParts = resolveMiningEcoPathwayBoundary(validMiningEcoRequest());
  const byRef = resolveMiningEcoPathwayBoundary(
    validMiningEcoRequest({
      claim_id: undefined,
      claim_version: undefined,
      claim_ref: `${MINING_ECO_CLAIM_ID}@${MINING_ECO_CLAIM_PACKAGE_COMMIT}`,
    }),
  );

  for (const decision of [byParts, byRef]) {
    assert.equal(decision.emitted, true);
    assert.equal(decision.reason_code, null);
    assert.equal(decision.claim_id, MINING_ECO_CLAIM_ID);
    assert.equal(decision.claim_version, MINING_ECO_CLAIM_PACKAGE_COMMIT);
    assert.equal(
      decision.claim_ref,
      `${MINING_ECO_CLAIM_ID}@${MINING_ECO_CLAIM_PACKAGE_COMMIT}`,
    );
    assert.ok(decision.pathway);
    assert.equal(
      decision.pathway.pathway_kind,
      PATHWAY_KIND_QUALITATIVE_CONDITIONAL,
    );
    assert.equal(decision.pathway.statement, ACCEPTED_MINING_ECO_CLAIM.statement);
    assert.deepEqual(
      decision.pathway.evidence_domain,
      ACCEPTED_MINING_ECO_CLAIM.evidence_domain,
    );
    assert.deepEqual(
      decision.pathway.evidence_scope,
      ACCEPTED_MINING_ECO_CLAIM.evidence_scope,
    );
    assert.equal(decision.pathway.confidence, "high");
    assert.equal(
      decision.pathway.attribution_status,
      ATTRIBUTION_NOT_ATTRIBUTABLE_TO_SPECIFIC_DEVICE,
    );
    assert.deepEqual(
      decision.pathway.conditions,
      ACCEPTED_MINING_ECO_CLAIM.conditions,
    );
    assert.deepEqual(
      decision.pathway.major_assumptions,
      ACCEPTED_MINING_ECO_CLAIM.conditions,
    );
    assert.equal(decision.pathway.status, "APPROVED_QUALITATIVE");
    assert.equal(
      decision.pathway.package_provenance,
      MINING_ECO_PACKAGE_PROVENANCE,
    );
    assert.equal(decision.pathway.quantitative_value, null);
    assert.equal(decision.pathway.value_range, null);
    assert.equal(decision.pathway.unit, null);
    assert.equal(decision.pathway.metric, null);
    assert.equal(decision.pathway.biodiversity_area, null);
    assert.equal(decision.pathway.species_loss_quantity, null);
    assert.equal(decision.pathway.primary_ore_mass, null);
    assert.equal(decision.pathway.material_mass, null);
    assert.equal(decision.pathway.location, null);
    assert.equal(decision.pathway.probability, null);
    assert.equal(decision.pathway.model_specific_or_fallback_status, null);
    assert.deepEqual(decision.pathway.source_ids, ["S10"]);
    assert.equal(decision.pathway.sources.length, 1);
    assert.equal(decision.unified_score, null);
    assert.equal(decision.exact_individual_damage, null);
    assert.equal(decision.named_target_attribution, null);
    assert.equal(decision.device_mine_attribution, null);
    assert.ok(
      decision.pathway.attribution_limits.includes(
        "not_attributable_to_specific_device",
      ),
    );
  }
});

test("mining-eco missing, malformed, unknown and conflicting claim identity/version are denied", () => {
  assert.equal(
    resolveMiningEcoPathwayBoundary({
      relevant_primary_metal_extraction_occurs: true,
    }).reason_code,
    MINING_ECO_PATHWAY_REASON.MISSING_CLAIM_IDENTITY,
  );

  assert.equal(
    resolveMiningEcoPathwayBoundary({
      claim_id: MINING_ECO_CLAIM_ID,
      relevant_primary_metal_extraction_occurs: true,
    }).reason_code,
    MINING_ECO_PATHWAY_REASON.MISSING_CLAIM_VERSION,
  );

  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ claim_id: "SP-PATH-UNKNOWN-999" }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.UNKNOWN_CLAIM,
  );

  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ claim_id: "not a claim" }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.MALFORMED_CLAIM_IDENTITY,
  );

  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ claim_version: "wrong-commit" }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.WRONG_CLAIM_VERSION,
  );

  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({
        claim_ref: `${MINING_ECO_CLAIM_ID}@${MINING_ECO_CLAIM_PACKAGE_COMMIT}`,
        claim_id: "SP-PATH-CLIMATE-001",
      }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.CONFLICTING_CLAIM_REPRESENTATION,
  );
});

test("pending empirical pathway IDs remain non-emitting in the mining-eco slice", () => {
  assert.deepEqual(MINING_ECO_PENDING_IDS, [
    "SP-PATH-EWASTE-PEOPLE-001",
    "SP-PATH-EWASTE-ECO-001",
    "SP-PATH-WATER-001",
  ]);
  for (const claimId of MINING_ECO_PENDING_IDS) {
    const decision = resolveMiningEcoPathwayBoundary({
      claim_id: claimId,
      claim_version: MINING_ECO_CLAIM_PACKAGE_COMMIT,
      relevant_primary_metal_extraction_occurs: true,
    });
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      MINING_ECO_PATHWAY_REASON.PATHWAY_NOT_IN_AUTHORIZED_SLICE,
    );
    assert.equal(decision.pathway, null);
  }

  // Climate / mining-people remain covered elsewhere; mining-eco does not emit them.
  for (const claimId of [CLIMATE_CLAIM_ID, "SP-PATH-MINING-PEOPLE-001"]) {
    const decision = resolveMiningEcoPathwayBoundary({
      claim_id: claimId,
      claim_version: MINING_ECO_CLAIM_PACKAGE_COMMIT,
      relevant_primary_metal_extraction_occurs: true,
    });
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      MINING_ECO_PATHWAY_REASON.UNKNOWN_CLAIM,
    );
  }
});

test("mining-eco missing required claim/source/scope/condition/attribution metadata fails closed", () => {
  const missingStatement = resolveMiningEcoPathwayBoundary(
    validMiningEcoRequest({
      authority_claim_record: {
        ...ACCEPTED_MINING_ECO_CLAIM,
        statement: "",
      },
    }),
  );
  assert.equal(missingStatement.emitted, false);
  assert.equal(
    missingStatement.reason_code,
    MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
  );

  const missingScope = resolveMiningEcoPathwayBoundary(
    validMiningEcoRequest({
      authority_claim_record: {
        ...ACCEPTED_MINING_ECO_CLAIM,
        evidence_scope: [],
      },
    }),
  );
  assert.equal(
    missingScope.reason_code,
    MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_SCOPE,
  );

  const missingConditions = resolveMiningEcoPathwayBoundary(
    validMiningEcoRequest({
      authority_claim_record: {
        ...ACCEPTED_MINING_ECO_CLAIM,
        conditions: [],
      },
    }),
  );
  assert.equal(
    missingConditions.reason_code,
    MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_CONDITIONS,
  );

  const missingAttribution = resolveMiningEcoPathwayBoundary(
    validMiningEcoRequest({
      authority_claim_record: {
        ...ACCEPTED_MINING_ECO_CLAIM,
        attribution_status: "",
      },
    }),
  );
  assert.equal(
    missingAttribution.reason_code,
    MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_ATTRIBUTION,
  );

  const missingSource = resolveMiningEcoPathwayBoundary(
    validMiningEcoRequest({
      authority_source_map: {},
    }),
  );
  assert.equal(
    missingSource.reason_code,
    MINING_ECO_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
  );

  assert.equal(validateMiningEcoClaimAuthorityRecord(null).ok, false);
});

test("device-to-mine, mine-to-phone and device-to-ecosystem attribution are denied", () => {
  for (const marker of [
    { request_device_to_mine_attribution: true },
    { request_mine_to_phone_attribution: true },
    { request_device_to_ecosystem_attribution: true },
  ]) {
    const decision = resolveMiningEcoPathwayBoundary(validMiningEcoRequest(marker));
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      MINING_ECO_PATHWAY_REASON.DEVICE_MINE_ATTRIBUTION_PROHIBITED,
    );
    assert.equal(decision.device_mine_attribution, null);
  }
});

test("named species/ecosystem/place/community/event attribution to one phone is denied", () => {
  for (const marker of [
    { named_species: "snow leopard" },
    { named_ecosystem: "Congo rainforest" },
    { named_place: "Atacama" },
    { named_community: "Village X" },
    { named_event: "2024 spill" },
  ]) {
    const decision = resolveMiningEcoPathwayBoundary(validMiningEcoRequest(marker));
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      MINING_ECO_PATHWAY_REASON.NAMED_TARGET_ATTRIBUTION_PROHIBITED,
    );
    assert.equal(decision.named_target_attribution, null);
  }
});

test("biodiversity quantities, fixed ore/material mass and exact damage are denied", () => {
  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ request_biodiversity_quantity: true }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.BIODIVERSITY_QUANTITY_PROHIBITED,
  );
  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ request_species_loss_quantity: true }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.BIODIVERSITY_QUANTITY_PROHIBITED,
  );
  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ request_fixed_primary_ore_mass: true }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.FIXED_PRIMARY_ORE_MASS_PROHIBITED,
  );
  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ request_fixed_material_mass: true }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.FIXED_PRIMARY_ORE_MASS_PROHIBITED,
  );
  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ request_exact_individual_damage: true }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.EXACT_INDIVIDUAL_DAMAGE_PROHIBITED,
  );
});

test("mining-eco unified scores, causal-proof and quantitative outputs are denied", () => {
  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ request_unified_score: true }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.UNIFIED_SCORE_PROHIBITED,
  );
  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ request_causal_proof: true }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.UNSUPPORTED_CAUSAL_PROOF_WORDING,
  );
  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ request_numerical_burden: true }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.QUANTITATIVE_OUTPUT_PROHIBITED,
  );
  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ request_location: true }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.QUANTITATIVE_OUTPUT_PROHIBITED,
  );
  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ request_probability: true }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.QUANTITATIVE_OUTPUT_PROHIBITED,
  );
});

test("mining-eco unknown coercion denied; unmet extraction condition stays non-emitting", () => {
  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ coerce_unknown_to_zero: true }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.UNKNOWN_COERCION_PROHIBITED,
  );
  assert.equal(
    resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ coerce_unknown_to_false: true }),
    ).reason_code,
    MINING_ECO_PATHWAY_REASON.UNKNOWN_COERCION_PROHIBITED,
  );

  const unknownCondition = resolveMiningEcoPathwayBoundary(
    validMiningEcoRequest({ relevant_primary_metal_extraction_occurs: null }),
  );
  assert.equal(unknownCondition.emitted, false);
  assert.equal(
    unknownCondition.reason_code,
    MINING_ECO_PATHWAY_REASON.CONDITION_NOT_SATISFIED,
  );
  assert.equal(unknownCondition.quantitative_value, null);

  const falseCondition = resolveMiningEcoPathwayBoundary(
    validMiningEcoRequest({ relevant_primary_metal_extraction_occurs: false }),
  );
  assert.equal(falseCondition.emitted, false);
  assert.equal(
    falseCondition.reason_code,
    MINING_ECO_PATHWAY_REASON.CONDITION_NOT_SATISFIED,
  );
});

test("mining-eco case/test metadata is not production authority", () => {
  const byCaseOnly = resolveMiningEcoPathwayBoundary({
    case_id: "SP-PATH-MINING-ECO-001",
    relevant_primary_metal_extraction_occurs: true,
  });
  assert.equal(byCaseOnly.emitted, false);
  assert.equal(
    byCaseOnly.reason_code,
    MINING_ECO_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY,
  );

  const byAssertionOnly = resolveMiningEcoPathwayBoundary({
    assertion_id: "A-MINING-ECO-001",
    relevant_primary_metal_extraction_occurs: true,
  });
  assert.equal(
    byAssertionOnly.reason_code,
    MINING_ECO_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY,
  );

  const forced = resolveMiningEcoPathwayBoundary(
    validMiningEcoRequest({ use_case_id_as_claim_authority: true }),
  );
  assert.equal(
    forced.reason_code,
    MINING_ECO_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY,
  );

  const incidental = resolveMiningEcoPathwayBoundary(
    validMiningEcoRequest({ case_id: "fixture-name-only" }),
  );
  assert.equal(incidental.emitted, true);
  assert.equal(incidental.reason_code, null);
});

test("mining-eco unsupported requested outputs do not emit", () => {
  const decision = resolveMiningEcoPathwayBoundary(
    validMiningEcoRequest({
      requested_output: "unified_environmental_harm_score",
    }),
  );
  assert.equal(decision.emitted, false);
  assert.equal(
    decision.reason_code,
    MINING_ECO_PATHWAY_REASON.UNSUPPORTED_REQUESTED_OUTPUT,
  );
});

test("altered mining-eco claim authority fields fail exact-authority check", () => {
  const alteredClaims = [
    { statement: "Altered mining-eco statement under accepted identity." },
    { evidence_domain: ["materials"] },
    { evidence_scope: ["global_assessment"] },
    { confidence: "moderate" },
    { status: "APPROVED" },
    { attribution_status: "pressure_to_outcome" },
    {
      conditions: [
        "relevant primary metal extraction occurs",
        "magnitude/location depend on mine, ore, processing and ecosystem",
        "extra invented condition",
      ],
    },
    {
      conditions: [
        "magnitude/location depend on mine, ore, processing and ecosystem",
        "relevant primary metal extraction occurs",
      ],
    },
    { source_ids: ["S1"] },
    { source_ids: ["S10", "S1"] },
    { package_commit: "ffffffffffffffffffffffffffffffffffffffff" },
    { package_provenance: "R&E-V0-SMARTPHONE-ALTERED" },
  ];

  for (const alteration of alteredClaims) {
    const decision = resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({
        authority_claim_record: {
          ...ACCEPTED_MINING_ECO_CLAIM,
          ...alteration,
        },
      }),
    );
    assert.equal(
      decision.emitted,
      false,
      `expected deny for ${JSON.stringify(alteration)}`,
    );
    assert.equal(
      decision.reason_code,
      MINING_ECO_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
    );
    assert.equal(decision.pathway, null);
  }
});

test("altered mining-eco source fields and extra/substituted sources fail closed", () => {
  const alteredSourceCases = [
    {
      S10: {
        ...ACCEPTED_MINING_ECO_SOURCES.S10,
        package_commit: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
    },
    {
      S10: {
        ...ACCEPTED_MINING_ECO_SOURCES.S10,
        citation: "Altered citation text.",
      },
    },
    {
      S10: {
        ...ACCEPTED_MINING_ECO_SOURCES.S10,
        scope: "Altered source scope.",
      },
    },
    {
      S10: {
        ...ACCEPTED_MINING_ECO_SOURCES.S10,
        metadata_limit: "Altered metadata limit.",
      },
    },
    {
      S10: ACCEPTED_MINING_ECO_SOURCES.S10,
      S1: {
        source_id: "S1",
        package_commit: MINING_ECO_CLAIM_PACKAGE_COMMIT,
        package_provenance: MINING_ECO_PACKAGE_PROVENANCE,
        citation: "Extra substituted source.",
        scope: "extra",
        metadata_limit: "extra",
      },
    },
    {
      S1: {
        source_id: "S1",
        package_commit: MINING_ECO_CLAIM_PACKAGE_COMMIT,
        package_provenance: MINING_ECO_PACKAGE_PROVENANCE,
        citation: "Substituted source identity.",
        scope: "substituted",
        metadata_limit: "substituted",
      },
    },
  ];

  for (const [index, authority_source_map] of alteredSourceCases.entries()) {
    const decision = resolveMiningEcoPathwayBoundary(
      validMiningEcoRequest({ authority_source_map }),
    );
    assert.equal(
      decision.emitted,
      false,
      `expected deny for altered source case ${index}`,
    );
    assert.equal(
      decision.reason_code,
      MINING_ECO_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
    );
    assert.equal(decision.pathway, null);
  }
});

test("existing climate emission remains unchanged beside mining-eco coverage", () => {
  const climate = resolveClimatePathwayBoundary({
    claim_id: CLIMATE_CLAIM_ID,
    claim_version: CLIMATE_CLAIM_PACKAGE_COMMIT,
    scenario_produces_ghg_emissions: true,
  });
  assert.equal(climate.emitted, true);
  assert.equal(climate.pathway.unit, CLIMATE_UNIT);
  assert.equal(climate.pathway.status, "APPROVED");

  const mining = resolveMiningEcoPathwayBoundary(validMiningEcoRequest());
  assert.equal(mining.emitted, true);
  assert.equal(mining.pathway.status, "APPROVED_QUALITATIVE");
  assert.equal(mining.pathway.unit, null);
});

function validMiningPeopleRequest(overrides = {}) {
  return {
    claim_id: MINING_PEOPLE_CLAIM_ID,
    claim_version: MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
    requested_output: MINING_PEOPLE_PATHWAY_KIND,
    relevant_supply_chain_geography_process_established: true,
    ...overrides,
  };
}

test("frozen mining-people claim matches evidence/CLAIM_REGISTRY.json exactly", () => {
  const registry = readJson("evidence/CLAIM_REGISTRY.json");
  const fromRegistry = registry.find(
    (row) => row.claim_id === MINING_PEOPLE_CLAIM_ID,
  );
  assert.ok(fromRegistry, "SP-PATH-MINING-PEOPLE-001 must exist in claim registry");
  assert.deepEqual(
    {
      claim_id: fromRegistry.claim_id,
      package_commit: fromRegistry.package_commit,
      package_provenance: fromRegistry.package_provenance,
      statement: fromRegistry.statement,
      evidence_domain: fromRegistry.evidence_domain,
      confidence: fromRegistry.confidence,
      attribution_status: fromRegistry.attribution_status,
      evidence_scope: fromRegistry.evidence_scope,
      status: fromRegistry.status,
      conditions: fromRegistry.conditions,
      source_ids: fromRegistry.source_ids,
    },
    { ...ACCEPTED_MINING_PEOPLE_CLAIM },
  );
});

test("frozen mining-people source matches evidence/SOURCE_REGISTRY.json for S10", () => {
  const registry = readJson("evidence/SOURCE_REGISTRY.json");
  const fromRegistry = registry.find((row) => row.source_id === "S10");
  assert.ok(fromRegistry, "S10 must exist in source registry");
  assert.deepEqual(
    {
      source_id: fromRegistry.source_id,
      package_commit: fromRegistry.package_commit,
      package_provenance: fromRegistry.package_provenance,
      citation: fromRegistry.citation,
      scope: fromRegistry.scope,
      metadata_limit: fromRegistry.metadata_limit,
    },
    { ...ACCEPTED_MINING_PEOPLE_SOURCES.S10 },
  );
});

test("SP-PATH-MINING-PEOPLE-001 emits qualitative pathway with preserved authority", () => {
  const byParts = resolveMiningPeoplePathwayBoundary(validMiningPeopleRequest());
  const byRef = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest({
      claim_id: undefined,
      claim_version: undefined,
      claim_ref: `${MINING_PEOPLE_CLAIM_ID}@${MINING_PEOPLE_CLAIM_PACKAGE_COMMIT}`,
    }),
  );

  for (const decision of [byParts, byRef]) {
    assert.equal(decision.emitted, true);
    assert.equal(decision.reason_code, null);
    assert.equal(decision.claim_id, MINING_PEOPLE_CLAIM_ID);
    assert.equal(decision.claim_version, MINING_PEOPLE_CLAIM_PACKAGE_COMMIT);
    assert.equal(
      decision.claim_ref,
      `${MINING_PEOPLE_CLAIM_ID}@${MINING_PEOPLE_CLAIM_PACKAGE_COMMIT}`,
    );
    assert.ok(decision.pathway);
    assert.equal(
      decision.pathway.pathway_kind,
      MINING_PEOPLE_PATHWAY_KIND,
    );
    assert.equal(
      decision.pathway.statement,
      ACCEPTED_MINING_PEOPLE_CLAIM.statement,
    );
    assert.deepEqual(
      decision.pathway.evidence_domain,
      ACCEPTED_MINING_PEOPLE_CLAIM.evidence_domain,
    );
    assert.deepEqual(
      decision.pathway.evidence_scope,
      ACCEPTED_MINING_PEOPLE_CLAIM.evidence_scope,
    );
    assert.equal(decision.pathway.confidence, "moderate");
    assert.equal(
      decision.pathway.attribution_status,
      ATTRIBUTION_CONDITIONAL_PATHWAY,
    );
    assert.deepEqual(
      decision.pathway.conditions,
      ACCEPTED_MINING_PEOPLE_CLAIM.conditions,
    );
    assert.deepEqual(
      decision.pathway.major_assumptions,
      ACCEPTED_MINING_PEOPLE_CLAIM.conditions,
    );
    assert.equal(decision.pathway.status, "QUALITATIVE");
    assert.equal(
      decision.pathway.package_provenance,
      MINING_PEOPLE_PACKAGE_PROVENANCE,
    );
    assert.equal(decision.pathway.quantitative_value, null);
    assert.equal(decision.pathway.value_range, null);
    assert.equal(decision.pathway.unit, null);
    assert.equal(decision.pathway.metric, null);
    assert.equal(decision.pathway.exposure, null);
    assert.equal(decision.pathway.dose, null);
    assert.equal(decision.pathway.risk, null);
    assert.equal(decision.pathway.illness_count, null);
    assert.equal(decision.pathway.injury_count, null);
    assert.equal(decision.pathway.death_count, null);
    assert.equal(decision.pathway.location, null);
    assert.equal(decision.pathway.probability, null);
    assert.equal(decision.pathway.model_specific_or_fallback_status, null);
    assert.deepEqual(decision.pathway.source_ids, ["S10"]);
    assert.equal(decision.pathway.sources.length, 1);
    assert.equal(decision.unified_score, null);
    assert.equal(decision.exact_individual_damage, null);
    assert.equal(decision.exact_community_damage, null);
    assert.equal(decision.named_target_attribution, null);
    assert.equal(decision.device_worker_attribution, null);
    assert.ok(
      decision.pathway.attribution_limits.includes("conditional_pathway"),
    );
    assert.ok(
      decision.pathway.attribution_limits.includes("site_specific_scope_preserved"),
    );
  }
});

test("mining-people missing, malformed, unknown and conflicting claim identity/version are denied", () => {
  assert.equal(
    resolveMiningPeoplePathwayBoundary({
      relevant_supply_chain_geography_process_established: true,
    }).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.MISSING_CLAIM_IDENTITY,
  );

  assert.equal(
    resolveMiningPeoplePathwayBoundary({
      claim_id: MINING_PEOPLE_CLAIM_ID,
      relevant_supply_chain_geography_process_established: true,
    }).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.MISSING_CLAIM_VERSION,
  );

  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ claim_id: "SP-PATH-UNKNOWN-999" }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.UNKNOWN_CLAIM,
  );

  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ claim_id: "not a claim" }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.MALFORMED_CLAIM_IDENTITY,
  );

  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ claim_version: "wrong-commit" }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.WRONG_CLAIM_VERSION,
  );

  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({
        claim_ref: `${MINING_PEOPLE_CLAIM_ID}@${MINING_PEOPLE_CLAIM_PACKAGE_COMMIT}`,
        claim_id: "SP-PATH-CLIMATE-001",
      }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.CONFLICTING_CLAIM_REPRESENTATION,
  );
});

test("pending empirical pathway IDs remain non-emitting in the mining-people slice", () => {
  assert.deepEqual(MINING_PEOPLE_PENDING_IDS, [
    "SP-PATH-EWASTE-PEOPLE-001",
    "SP-PATH-EWASTE-ECO-001",
    "SP-PATH-WATER-001",
  ]);
  for (const claimId of MINING_PEOPLE_PENDING_IDS) {
    const decision = resolveMiningPeoplePathwayBoundary({
      claim_id: claimId,
      claim_version: MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
      relevant_supply_chain_geography_process_established: true,
    });
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      MINING_PEOPLE_PATHWAY_REASON.PATHWAY_NOT_IN_AUTHORIZED_SLICE,
    );
    assert.equal(decision.pathway, null);
  }

  // Climate / mining-eco remain covered elsewhere; mining-people does not emit them.
  for (const claimId of [CLIMATE_CLAIM_ID, MINING_ECO_CLAIM_ID]) {
    const decision = resolveMiningPeoplePathwayBoundary({
      claim_id: claimId,
      claim_version: MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
      relevant_supply_chain_geography_process_established: true,
    });
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      MINING_PEOPLE_PATHWAY_REASON.UNKNOWN_CLAIM,
    );
  }
});

test("mining-people missing required claim/source/scope/condition/attribution metadata fails closed", () => {
  const missingStatement = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest({
      authority_claim_record: {
        ...ACCEPTED_MINING_PEOPLE_CLAIM,
        statement: "",
      },
    }),
  );
  assert.equal(missingStatement.emitted, false);
  assert.equal(
    missingStatement.reason_code,
    MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
  );

  const missingScope = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest({
      authority_claim_record: {
        ...ACCEPTED_MINING_PEOPLE_CLAIM,
        evidence_scope: [],
      },
    }),
  );
  assert.equal(
    missingScope.reason_code,
    MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SCOPE,
  );

  const missingConditions = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest({
      authority_claim_record: {
        ...ACCEPTED_MINING_PEOPLE_CLAIM,
        conditions: [],
      },
    }),
  );
  assert.equal(
    missingConditions.reason_code,
    MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CONDITIONS,
  );

  const missingAttribution = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest({
      authority_claim_record: {
        ...ACCEPTED_MINING_PEOPLE_CLAIM,
        attribution_status: "",
      },
    }),
  );
  assert.equal(
    missingAttribution.reason_code,
    MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_ATTRIBUTION,
  );

  const missingSource = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest({
      authority_source_map: {},
    }),
  );
  assert.equal(
    missingSource.reason_code,
    MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
  );

  assert.equal(validateMiningPeopleClaimAuthorityRecord(null).ok, false);
});

test("mining-people malformed non-object source maps fail closed without throwing", () => {
  // Explicitly supplied malformed maps (null/array/non-object). Omitted/undefined
  // authority_source_map remains the accepted default at the resolve boundary.
  const malformedMaps = [null, [], ["S10"], "S10", 0, false];

  for (const [index, authority_source_map] of malformedMaps.entries()) {
    let decision;
    assert.doesNotThrow(() => {
      decision = resolveMiningPeoplePathwayBoundary(
        validMiningPeopleRequest({ authority_source_map }),
      );
    }, `resolve must not throw for malformed source map case ${index}`);
    assert.equal(decision.emitted, false, `case ${index}`);
    assert.equal(
      decision.reason_code,
      MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      `case ${index}`,
    );
    assert.equal(decision.pathway, null, `case ${index}`);

    let validation;
    assert.doesNotThrow(() => {
      validation = validateMiningPeopleSourceRecords(
        ACCEPTED_MINING_PEOPLE_CLAIM.source_ids,
        authority_source_map,
      );
    }, `validate must not throw for malformed source map case ${index}`);
    assert.equal(validation.ok, false, `case ${index}`);
    assert.equal(
      validation.reason_code,
      MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      `case ${index}`,
    );
  }

  let undefinedValidation;
  assert.doesNotThrow(() => {
    undefinedValidation = validateMiningPeopleSourceRecords(
      ACCEPTED_MINING_PEOPLE_CLAIM.source_ids,
      undefined,
    );
  }, "validate must not throw for undefined source map");
  assert.equal(undefinedValidation.ok, false);
  assert.equal(
    undefinedValidation.reason_code,
    MINING_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
  );
});

test("device/worker/community outcome attribution to one phone is denied", () => {
  for (const marker of [
    { request_device_to_worker_attribution: true },
    { request_device_to_community_attribution: true },
    { request_worker_community_outcome_to_one_phone: true },
  ]) {
    const decision = resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest(marker),
    );
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      MINING_PEOPLE_PATHWAY_REASON.DEVICE_WORKER_ATTRIBUTION_PROHIBITED,
    );
    assert.equal(decision.device_worker_attribution, null);
  }
});

test("named worker/community/person/place/site/event attribution to one phone is denied", () => {
  for (const marker of [
    { named_worker: "Worker A" },
    { named_community: "Community B" },
    { named_person: "Person C" },
    { named_place: "Place D" },
    { named_site: "Mine Site E" },
    { named_event: "2024 incident" },
  ]) {
    const decision = resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest(marker),
    );
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      MINING_PEOPLE_PATHWAY_REASON.NAMED_TARGET_ATTRIBUTION_PROHIBITED,
    );
    assert.equal(decision.named_target_attribution, null);
  }
});

test("illness/injury/death counts, exposure/dose/risk/probability and exact damage are denied", () => {
  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ request_illness_injury_or_death_counts: true }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.ILLNESS_INJURY_OR_DEATH_COUNTS_PROHIBITED,
  );
  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ request_exposure: true }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.EXPOSURE_DOSE_RISK_OR_PROBABILITY_PROHIBITED,
  );
  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ request_dose: true }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.EXPOSURE_DOSE_RISK_OR_PROBABILITY_PROHIBITED,
  );
  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ request_risk: true }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.EXPOSURE_DOSE_RISK_OR_PROBABILITY_PROHIBITED,
  );
  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ request_probability: true }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.EXPOSURE_DOSE_RISK_OR_PROBABILITY_PROHIBITED,
  );
  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ request_exact_individual_damage: true }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.EXACT_INDIVIDUAL_OR_COMMUNITY_DAMAGE_PROHIBITED,
  );
  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ request_exact_community_damage: true }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.EXACT_INDIVIDUAL_OR_COMMUNITY_DAMAGE_PROHIBITED,
  );
});

test("mining-people unified scores, causal-proof and quantitative/location outputs are denied", () => {
  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ request_unified_score: true }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.UNIFIED_SCORE_PROHIBITED,
  );
  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ request_causal_proof: true }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.UNSUPPORTED_CAUSAL_PROOF_WORDING,
  );
  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ request_numerical_burden: true }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.QUANTITATIVE_OUTPUT_PROHIBITED,
  );
  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ request_location: true }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.QUANTITATIVE_OUTPUT_PROHIBITED,
  );
});

test("mining-people unknown coercion denied; unmet or generic-inferred geography/process stays non-emitting", () => {
  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ coerce_unknown_to_zero: true }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.UNKNOWN_COERCION_PROHIBITED,
  );
  assert.equal(
    resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ coerce_unknown_to_false: true }),
    ).reason_code,
    MINING_PEOPLE_PATHWAY_REASON.UNKNOWN_COERCION_PROHIBITED,
  );

  const unknownCondition = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest({
      relevant_supply_chain_geography_process_established: null,
    }),
  );
  assert.equal(unknownCondition.emitted, false);
  assert.equal(
    unknownCondition.reason_code,
    MINING_PEOPLE_PATHWAY_REASON.CONDITION_NOT_SATISFIED,
  );
  assert.equal(unknownCondition.quantitative_value, null);

  const falseCondition = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest({
      relevant_supply_chain_geography_process_established: false,
    }),
  );
  assert.equal(falseCondition.emitted, false);
  assert.equal(
    falseCondition.reason_code,
    MINING_PEOPLE_PATHWAY_REASON.CONDITION_NOT_SATISFIED,
  );

  const genericInferred = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest({
      supply_chain_geography_process_generic_inferred: true,
    }),
  );
  assert.equal(genericInferred.emitted, false);
  assert.equal(
    genericInferred.reason_code,
    MINING_PEOPLE_PATHWAY_REASON.GENERIC_INFERRED_GEOGRAPHY_PROCESS_PROHIBITED,
  );
});

test("mining-people case/test metadata is not production authority", () => {
  const byCaseOnly = resolveMiningPeoplePathwayBoundary({
    case_id: "SP-PATH-MINING-PEOPLE-001",
    relevant_supply_chain_geography_process_established: true,
  });
  assert.equal(byCaseOnly.emitted, false);
  assert.equal(
    byCaseOnly.reason_code,
    MINING_PEOPLE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY,
  );

  const byAssertionOnly = resolveMiningPeoplePathwayBoundary({
    assertion_id: "A-MINING-PEOPLE-001",
    relevant_supply_chain_geography_process_established: true,
  });
  assert.equal(
    byAssertionOnly.reason_code,
    MINING_PEOPLE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY,
  );

  const forced = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest({ use_case_id_as_claim_authority: true }),
  );
  assert.equal(
    forced.reason_code,
    MINING_PEOPLE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY,
  );

  const incidental = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest({ case_id: "fixture-name-only" }),
  );
  assert.equal(incidental.emitted, true);
  assert.equal(incidental.reason_code, null);
});

test("mining-people unsupported requested outputs do not emit", () => {
  const decision = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest({
      requested_output: "unified_environmental_harm_score",
    }),
  );
  assert.equal(decision.emitted, false);
  assert.equal(
    decision.reason_code,
    MINING_PEOPLE_PATHWAY_REASON.UNSUPPORTED_REQUESTED_OUTPUT,
  );
});

test("altered mining-people claim authority fields fail exact-authority check", () => {
  const alteredClaims = [
    { statement: "Altered mining-people statement under accepted identity." },
    { evidence_domain: ["materials"] },
    { evidence_scope: ["systematic_review"] },
    { confidence: "high" },
    { status: "APPROVED" },
    { attribution_status: "not_attributable_to_specific_device" },
    {
      conditions: [
        "relevant supply-chain geography/process",
        "extra invented condition",
      ],
    },
    { conditions: ["unrelated condition"] },
    { source_ids: ["S1"] },
    { source_ids: ["S10", "S1"] },
    { package_commit: "ffffffffffffffffffffffffffffffffffffffff" },
    { package_provenance: "R&E-V0-SMARTPHONE-ALTERED" },
  ];

  for (const alteration of alteredClaims) {
    const decision = resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({
        authority_claim_record: {
          ...ACCEPTED_MINING_PEOPLE_CLAIM,
          ...alteration,
        },
      }),
    );
    assert.equal(
      decision.emitted,
      false,
      `expected deny for ${JSON.stringify(alteration)}`,
    );
    assert.equal(
      decision.reason_code,
      MINING_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
    );
    assert.equal(decision.pathway, null);
  }
});

test("altered mining-people source fields and extra/substituted sources fail closed", () => {
  const alteredSourceCases = [
    {
      S10: {
        ...ACCEPTED_MINING_PEOPLE_SOURCES.S10,
        package_commit: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
    },
    {
      S10: {
        ...ACCEPTED_MINING_PEOPLE_SOURCES.S10,
        citation: "Altered citation text.",
      },
    },
    {
      S10: {
        ...ACCEPTED_MINING_PEOPLE_SOURCES.S10,
        scope: "Altered source scope.",
      },
    },
    {
      S10: {
        ...ACCEPTED_MINING_PEOPLE_SOURCES.S10,
        metadata_limit: "Altered metadata limit.",
      },
    },
    {
      S10: ACCEPTED_MINING_PEOPLE_SOURCES.S10,
      S1: {
        source_id: "S1",
        package_commit: MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
        package_provenance: MINING_PEOPLE_PACKAGE_PROVENANCE,
        citation: "Extra substituted source.",
        scope: "extra",
        metadata_limit: "extra",
      },
    },
    {
      S1: {
        source_id: "S1",
        package_commit: MINING_PEOPLE_CLAIM_PACKAGE_COMMIT,
        package_provenance: MINING_PEOPLE_PACKAGE_PROVENANCE,
        citation: "Substituted source identity.",
        scope: "substituted",
        metadata_limit: "substituted",
      },
    },
  ];

  for (const [index, authority_source_map] of alteredSourceCases.entries()) {
    const decision = resolveMiningPeoplePathwayBoundary(
      validMiningPeopleRequest({ authority_source_map }),
    );
    assert.equal(
      decision.emitted,
      false,
      `expected deny for altered source case ${index}`,
    );
    assert.equal(
      decision.reason_code,
      MINING_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
    );
    assert.equal(decision.pathway, null);
  }
});

test("existing climate and mining-eco emission remain unchanged beside mining-people coverage", () => {
  const climate = resolveClimatePathwayBoundary({
    claim_id: CLIMATE_CLAIM_ID,
    claim_version: CLIMATE_CLAIM_PACKAGE_COMMIT,
    scenario_produces_ghg_emissions: true,
  });
  assert.equal(climate.emitted, true);
  assert.equal(climate.pathway.unit, CLIMATE_UNIT);
  assert.equal(climate.pathway.status, "APPROVED");

  const miningEco = resolveMiningEcoPathwayBoundary(validMiningEcoRequest());
  assert.equal(miningEco.emitted, true);
  assert.equal(miningEco.pathway.status, "APPROVED_QUALITATIVE");
  assert.equal(miningEco.pathway.unit, null);

  const miningPeople = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest(),
  );
  assert.equal(miningPeople.emitted, true);
  assert.equal(miningPeople.pathway.status, "QUALITATIVE");
  assert.equal(miningPeople.pathway.unit, null);
  assert.equal(miningPeople.pathway.confidence, "moderate");
});

function validEwastePeopleRequest(overrides = {}) {
  return {
    claim_id: EWASTE_PEOPLE_CLAIM_ID,
    claim_version: EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
    requested_output: EWASTE_PEOPLE_PATHWAY_KIND,
    unsafe_or_informal_handling_established: true,
    ...overrides,
  };
}

test("frozen e-waste-people claim matches evidence/CLAIM_REGISTRY.json exactly", () => {
  const registry = readJson("evidence/CLAIM_REGISTRY.json");
  const fromRegistry = registry.find(
    (row) => row.claim_id === EWASTE_PEOPLE_CLAIM_ID,
  );
  assert.ok(fromRegistry, "SP-PATH-EWASTE-PEOPLE-001 must exist in claim registry");
  assert.deepEqual(
    {
      claim_id: fromRegistry.claim_id,
      package_commit: fromRegistry.package_commit,
      package_provenance: fromRegistry.package_provenance,
      statement: fromRegistry.statement,
      evidence_domain: fromRegistry.evidence_domain,
      confidence: fromRegistry.confidence,
      attribution_status: fromRegistry.attribution_status,
      evidence_scope: fromRegistry.evidence_scope,
      status: fromRegistry.status,
      conditions: fromRegistry.conditions,
      source_ids: fromRegistry.source_ids,
    },
    { ...ACCEPTED_EWASTE_PEOPLE_CLAIM },
  );
});

test("frozen e-waste-people source matches evidence/SOURCE_REGISTRY.json for S11", () => {
  const registry = readJson("evidence/SOURCE_REGISTRY.json");
  const fromRegistry = registry.find((row) => row.source_id === "S11");
  assert.ok(fromRegistry, "S11 must exist in source registry");
  assert.deepEqual(
    {
      source_id: fromRegistry.source_id,
      package_commit: fromRegistry.package_commit,
      package_provenance: fromRegistry.package_provenance,
      citation: fromRegistry.citation,
      scope: fromRegistry.scope,
      metadata_limit: fromRegistry.metadata_limit,
    },
    { ...ACCEPTED_EWASTE_PEOPLE_SOURCES.S11 },
  );
});

test("SP-PATH-EWASTE-PEOPLE-001 emits conditional pathway with preserved authority", () => {
  const byParts = resolveEwastePeoplePathwayBoundary(validEwastePeopleRequest());
  const byRef = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({
      claim_id: undefined,
      claim_version: undefined,
      claim_ref: `${EWASTE_PEOPLE_CLAIM_ID}@${EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT}`,
    }),
  );

  for (const decision of [byParts, byRef]) {
    assert.equal(decision.emitted, true);
    assert.equal(decision.reason_code, null);
    assert.equal(decision.claim_id, EWASTE_PEOPLE_CLAIM_ID);
    assert.equal(decision.claim_version, EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT);
    assert.equal(
      decision.claim_ref,
      `${EWASTE_PEOPLE_CLAIM_ID}@${EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT}`,
    );
    assert.ok(decision.pathway);
    assert.equal(decision.pathway.pathway_kind, EWASTE_PEOPLE_PATHWAY_KIND);
    assert.equal(
      decision.pathway.statement,
      ACCEPTED_EWASTE_PEOPLE_CLAIM.statement,
    );
    assert.deepEqual(
      decision.pathway.evidence_domain,
      ACCEPTED_EWASTE_PEOPLE_CLAIM.evidence_domain,
    );
    assert.deepEqual(
      decision.pathway.evidence_scope,
      ACCEPTED_EWASTE_PEOPLE_CLAIM.evidence_scope,
    );
    assert.equal(decision.pathway.confidence, "high");
    assert.equal(decision.pathway.attribution_status, EWASTE_PEOPLE_ATTRIBUTION);
    assert.deepEqual(
      decision.pathway.conditions,
      ACCEPTED_EWASTE_PEOPLE_CLAIM.conditions,
    );
    assert.deepEqual(
      decision.pathway.major_assumptions,
      ACCEPTED_EWASTE_PEOPLE_CLAIM.conditions,
    );
    assert.equal(decision.pathway.status, "APPROVED");
    assert.equal(
      decision.pathway.package_provenance,
      EWASTE_PEOPLE_PACKAGE_PROVENANCE,
    );
    assert.equal(decision.pathway.quantitative_value, null);
    assert.equal(decision.pathway.value_range, null);
    assert.equal(decision.pathway.unit, null);
    assert.equal(decision.pathway.metric, null);
    assert.equal(decision.pathway.exposure, null);
    assert.equal(decision.pathway.dose, null);
    assert.equal(decision.pathway.burden, null);
    assert.equal(decision.pathway.risk, null);
    assert.equal(decision.pathway.illness_count, null);
    assert.equal(decision.pathway.injury_count, null);
    assert.equal(decision.pathway.death_count, null);
    assert.equal(decision.pathway.victim_count, null);
    assert.equal(decision.pathway.location, null);
    assert.equal(decision.pathway.probability, null);
    assert.equal(decision.pathway.collection_rate, null);
    assert.equal(decision.pathway.model_specific_or_fallback_status, null);
    assert.deepEqual(decision.pathway.source_ids, ["S11"]);
    assert.equal(decision.pathway.sources.length, 1);
    assert.equal(
      decision.pathway.sources[0].citation,
      ACCEPTED_EWASTE_PEOPLE_SOURCES.S11.citation,
    );
    assert.equal(decision.exposure, null);
    assert.equal(decision.victim_count, null);
    assert.equal(decision.collection_rate, null);
    assert.equal(decision.unified_score, null);
    assert.equal(decision.exact_individual_damage, null);
    assert.equal(decision.exact_community_damage, null);
    assert.equal(decision.named_target_attribution, null);
    assert.equal(decision.device_person_attribution, null);
    assert.equal(decision.quantitative_value, null);
    assert.ok(decision.pathway.attribution_limits.includes("conditional_pathway"));
    assert.ok(
      decision.pathway.attribution_limits.includes(
        "authoritative_assessment_scope_preserved",
      ),
    );
    assert.equal(JSON.stringify(decision).includes("formal_recycling"), false);
  }
});

test("e-waste-people missing, malformed, unknown and conflicting claim identity/version are denied", () => {
  assert.equal(
    resolveEwastePeoplePathwayBoundary({
      unsafe_or_informal_handling_established: true,
    }).reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.MISSING_CLAIM_IDENTITY,
  );

  assert.equal(
    resolveEwastePeoplePathwayBoundary({
      claim_id: EWASTE_PEOPLE_CLAIM_ID,
      unsafe_or_informal_handling_established: true,
    }).reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.MISSING_CLAIM_VERSION,
  );

  assert.equal(
    resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest({ claim_id: "SP-PATH-UNKNOWN-999" }),
    ).reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.UNKNOWN_CLAIM,
  );

  assert.equal(
    resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest({ claim_id: "not a claim" }),
    ).reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.MALFORMED_CLAIM_IDENTITY,
  );

  assert.equal(
    resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest({ claim_version: "wrong-commit" }),
    ).reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.WRONG_CLAIM_VERSION,
  );

  assert.equal(
    resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest({
        claim_ref: `${EWASTE_PEOPLE_CLAIM_ID}@${EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT}`,
        claim_id: "SP-PATH-CLIMATE-001",
      }),
    ).reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.CONFLICTING_CLAIM_REPRESENTATION,
  );
});

test("pending empirical pathway IDs remain non-emitting in the e-waste-people slice", () => {
  assert.deepEqual(EWASTE_PEOPLE_PENDING_IDS, [
    "SP-PATH-EWASTE-ECO-001",
    "SP-PATH-WATER-001",
  ]);
  for (const claimId of EWASTE_PEOPLE_PENDING_IDS) {
    const decision = resolveEwastePeoplePathwayBoundary({
      claim_id: claimId,
      claim_version: EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
      unsafe_or_informal_handling_established: true,
    });
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.PATHWAY_NOT_IN_AUTHORIZED_SLICE,
    );
    assert.equal(decision.pathway, null);
  }

  for (const claimId of [
    CLIMATE_CLAIM_ID,
    MINING_ECO_CLAIM_ID,
    MINING_PEOPLE_CLAIM_ID,
  ]) {
    const decision = resolveEwastePeoplePathwayBoundary({
      claim_id: claimId,
      claim_version: EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
      unsafe_or_informal_handling_established: true,
    });
    assert.equal(decision.emitted, false);
    assert.equal(decision.reason_code, EWASTE_PEOPLE_PATHWAY_REASON.UNKNOWN_CLAIM);
  }
});

test("e-waste-people missing required claim/source/scope/condition/attribution metadata fails closed", () => {
  const missingStatement = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({
      authority_claim_record: {
        ...ACCEPTED_EWASTE_PEOPLE_CLAIM,
        statement: "",
      },
    }),
  );
  assert.equal(missingStatement.emitted, false);
  assert.equal(
    missingStatement.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CLAIM_METADATA,
  );

  const missingScope = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({
      authority_claim_record: {
        ...ACCEPTED_EWASTE_PEOPLE_CLAIM,
        evidence_scope: [],
      },
    }),
  );
  assert.equal(
    missingScope.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SCOPE,
  );

  const missingConditions = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({
      authority_claim_record: {
        ...ACCEPTED_EWASTE_PEOPLE_CLAIM,
        conditions: [],
      },
    }),
  );
  assert.equal(
    missingConditions.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_CONDITIONS,
  );

  const missingAttribution = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({
      authority_claim_record: {
        ...ACCEPTED_EWASTE_PEOPLE_CLAIM,
        attribution_status: "",
      },
    }),
  );
  assert.equal(
    missingAttribution.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_ATTRIBUTION,
  );

  const missingSource = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({
      authority_source_map: {},
    }),
  );
  assert.equal(
    missingSource.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
  );

  assert.equal(validateEwastePeopleClaimAuthorityRecord(null).ok, false);
});

test("e-waste-people malformed non-object source maps fail closed without throwing", () => {
  const malformedMaps = [null, [], ["S11"], "S11", 0, false];

  for (const [index, authority_source_map] of malformedMaps.entries()) {
    let decision;
    assert.doesNotThrow(() => {
      decision = resolveEwastePeoplePathwayBoundary(
        validEwastePeopleRequest({ authority_source_map }),
      );
    }, `resolve must not throw for malformed source map case ${index}`);
    assert.equal(decision.emitted, false, `case ${index}`);
    assert.equal(
      decision.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      `case ${index}`,
    );
    assert.equal(decision.pathway, null, `case ${index}`);

    let validation;
    assert.doesNotThrow(() => {
      validation = validateEwastePeopleSourceRecords(
        ACCEPTED_EWASTE_PEOPLE_CLAIM.source_ids,
        authority_source_map,
      );
    }, `validate must not throw for malformed source map case ${index}`);
    assert.equal(validation.ok, false, `case ${index}`);
    assert.equal(
      validation.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
      `case ${index}`,
    );
  }

  let undefinedValidation;
  assert.doesNotThrow(() => {
    undefinedValidation = validateEwastePeopleSourceRecords(
      ACCEPTED_EWASTE_PEOPLE_CLAIM.source_ids,
      undefined,
    );
  }, "validate must not throw for undefined source map");
  assert.equal(undefinedValidation.ok, false);
  assert.equal(
    undefinedValidation.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.MISSING_REQUIRED_SOURCE_METADATA,
  );
});

test("one-device-to-person/community exposure or health outcome is denied", () => {
  for (const marker of [
    { request_one_device_to_person_exposure: true },
    { request_one_device_to_community_exposure: true },
    { request_one_device_health_outcome: true },
  ]) {
    const decision = resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest(marker),
    );
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.DEVICE_PERSON_OR_COMMUNITY_ATTRIBUTION_PROHIBITED,
    );
    assert.equal(decision.device_person_attribution, null);
    assert.equal(decision.exposure, null);
  }
});

test("named person/child/worker/community/place/site/event attribution is denied", () => {
  for (const marker of [
    { named_person: "Person A" },
    { named_child: "Child B" },
    { named_worker: "Worker C" },
    { named_community: "Community D" },
    { named_place: "Place E" },
    { named_site: "Dumpsite F" },
    { named_event: "2021 exposure event" },
  ]) {
    const decision = resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest(marker),
    );
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.NAMED_TARGET_ATTRIBUTION_PROHIBITED,
    );
    assert.equal(decision.named_target_attribution, null);
  }
});

test("illness, injury, death and victim counts are denied", () => {
  for (const marker of [
    { request_illness_count: true },
    { request_injury_count: true },
    { request_death_count: true },
    { request_victim_count: true },
    { request_illness_injury_death_or_victim_counts: true },
  ]) {
    const decision = resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest(marker),
    );
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.ILLNESS_INJURY_DEATH_OR_VICTIM_COUNTS_PROHIBITED,
    );
    assert.equal(decision.illness_count, null);
    assert.equal(decision.injury_count, null);
    assert.equal(decision.death_count, null);
    assert.equal(decision.victim_count, null);
  }
});

test("exact exposure, dose, risk and probability are denied", () => {
  for (const marker of [
    { request_exposure: true },
    { request_dose: true },
    { request_risk: true },
    { request_probability: true },
  ]) {
    const decision = resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest(marker),
    );
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.EXPOSURE_DOSE_RISK_OR_PROBABILITY_PROHIBITED,
    );
    assert.equal(decision.exposure, null);
    assert.equal(decision.dose, null);
    assert.equal(decision.risk, null);
    assert.equal(decision.probability, null);
  }
});

test("global e-waste collection rates are not an individual route or probability", () => {
  for (const marker of [
    { request_global_collection_rate_as_individual_route: true },
    { request_global_collection_rate_as_probability: true },
    { global_ewaste_collection_rate_context: 0.2 },
  ]) {
    const decision = resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest(marker),
    );
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.GLOBAL_COLLECTION_RATE_AS_INDIVIDUAL_ROUTE_PROHIBITED,
    );
    assert.equal(decision.probability, null);
    assert.equal(decision.collection_rate, null);
  }
});

test("exact individual or community damage is denied", () => {
  for (const marker of [
    { request_exact_individual_damage: true },
    { request_exact_community_damage: true },
  ]) {
    const decision = resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest(marker),
    );
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.EXACT_INDIVIDUAL_OR_COMMUNITY_DAMAGE_PROHIBITED,
    );
    assert.equal(decision.exact_individual_damage, null);
    assert.equal(decision.exact_community_damage, null);
  }
});

test("e-waste-people unified scores, causal-proof and quantitative/location outputs are denied", () => {
  for (const marker of [
    { request_unified_score: true },
    { request_unified_environmental_score: true },
    { request_unified_safety_score: true },
    { request_protect_four_score: true },
    { request_unified_moral_score: true },
  ]) {
    const decision = resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest(marker),
    );
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.UNIFIED_SCORE_PROHIBITED,
    );
    assert.equal(decision.unified_score, null);
  }

  assert.equal(
    resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest({ request_causal_proof: true }),
    ).reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.UNSUPPORTED_CAUSAL_PROOF_WORDING,
  );

  for (const marker of [
    { request_numerical_burden: true },
    { request_location: true },
    { request_quantitative_output: true },
  ]) {
    const decision = resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest(marker),
    );
    assert.equal(decision.emitted, false);
    assert.equal(
      decision.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.QUANTITATIVE_OR_LOCATION_OUTPUT_PROHIBITED,
    );
    assert.equal(decision.quantitative_value, null);
    assert.equal(decision.location, null);
    assert.equal(decision.burden, null);
  }
});

test("e-waste-people missing, false, unknown or inferred handling does not emit", () => {
  assert.equal(
    resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest({ coerce_unknown_to_zero: true }),
    ).reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.UNKNOWN_COERCION_PROHIBITED,
  );
  assert.equal(
    resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest({ coerce_unknown_to_false: true }),
    ).reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.UNKNOWN_COERCION_PROHIBITED,
  );

  const omitted = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({
      unsafe_or_informal_handling_established: undefined,
    }),
  );
  assert.equal(omitted.emitted, false);
  assert.equal(
    omitted.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.CONDITION_NOT_SATISFIED,
  );
  assert.equal(omitted.quantitative_value, null);

  const unknownCondition = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({
      unsafe_or_informal_handling_established: null,
    }),
  );
  assert.equal(unknownCondition.emitted, false);
  assert.equal(
    unknownCondition.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.CONDITION_NOT_SATISFIED,
  );

  const falseCondition = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({
      unsafe_or_informal_handling_established: false,
    }),
  );
  assert.equal(falseCondition.emitted, false);
  assert.equal(
    falseCondition.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.CONDITION_NOT_SATISFIED,
  );

  const inferred = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({
      unsafe_or_informal_handling_inferred: true,
    }),
  );
  assert.equal(inferred.emitted, false);
  assert.equal(
    inferred.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.INFERRED_UNSAFE_OR_INFORMAL_HANDLING_PROHIBITED,
  );
});

test("disposal, fate and collection-rate context do not establish unsafe or informal handling", () => {
  assert.deepEqual(NON_ESTABLISHING_OLD_DEVICE_FATES, [
    "continue_use",
    "sell_or_gift_for_reuse",
    "trade_in_unknown_next_use",
    "store_in_drawer",
    "formal_recycling",
    "discard_general_waste",
    "unknown",
  ]);

  for (const old_device_fate of NON_ESTABLISHING_OLD_DEVICE_FATES) {
    const decision = resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest({
        unsafe_or_informal_handling_established: undefined,
        old_device_fate,
      }),
    );
    assert.equal(decision.emitted, false, old_device_fate);
    assert.equal(
      decision.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.FATE_OR_CONTEXT_DOES_NOT_ESTABLISH_UNSAFE_OR_INFORMAL_HANDLING,
      old_device_fate,
    );
    assert.equal(decision.pathway, null, old_device_fate);
  }

  const collectionContext = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({
      unsafe_or_informal_handling_established: false,
      global_ewaste_collection_rate_context: true,
    }),
  );
  assert.equal(collectionContext.emitted, false);
  assert.equal(
    collectionContext.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.FATE_OR_CONTEXT_DOES_NOT_ESTABLISH_UNSAFE_OR_INFORMAL_HANDLING,
  );
  assert.equal(collectionContext.collection_rate, null);
  assert.equal(collectionContext.probability, null);

  const formalWithExplicitCondition = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({ old_device_fate: "formal_recycling" }),
  );
  assert.equal(formalWithExplicitCondition.emitted, false);
  assert.equal(
    formalWithExplicitCondition.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.FATE_OR_CONTEXT_DOES_NOT_ESTABLISH_UNSAFE_OR_INFORMAL_HANDLING,
  );

  const explicitDespiteOtherFate = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({ old_device_fate: "continue_use" }),
  );
  assert.equal(explicitDespiteOtherFate.emitted, true);
  assert.equal(explicitDespiteOtherFate.reason_code, null);
  assert.equal(
    JSON.stringify(explicitDespiteOtherFate.pathway).includes("continue_use"),
    false,
  );
  assert.equal(explicitDespiteOtherFate.pathway.location, null);
  assert.equal(explicitDespiteOtherFate.pathway.probability, null);

  const explicitWithContextOnly = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({
      global_ewaste_collection_rate_context: true,
    }),
  );
  assert.equal(explicitWithContextOnly.emitted, true);
  assert.equal(explicitWithContextOnly.pathway.collection_rate, null);
  assert.equal(explicitWithContextOnly.pathway.probability, null);
  assert.equal(explicitWithContextOnly.collection_rate, null);
});

test("e-waste-people case/test metadata is not production authority", () => {
  const byCaseOnly = resolveEwastePeoplePathwayBoundary({
    case_id: "SP-PATH-EWASTE-PEOPLE-001",
    unsafe_or_informal_handling_established: true,
  });
  assert.equal(byCaseOnly.emitted, false);
  assert.equal(
    byCaseOnly.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY,
  );

  const byAssertionOnly = resolveEwastePeoplePathwayBoundary({
    assertion_id: "A-EWASTE-PEOPLE-001",
    unsafe_or_informal_handling_established: true,
  });
  assert.equal(
    byAssertionOnly.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY,
  );

  const forced = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({ use_case_id_as_claim_authority: true }),
  );
  assert.equal(
    forced.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.CASE_METADATA_NOT_PRODUCTION_AUTHORITY,
  );

  const incidental = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({ case_id: "fixture-name-only" }),
  );
  assert.equal(incidental.emitted, true);
  assert.equal(incidental.reason_code, null);
});

test("e-waste-people unsupported requested outputs do not emit", () => {
  const decision = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest({
      requested_output: "unified_environmental_harm_score",
    }),
  );
  assert.equal(decision.emitted, false);
  assert.equal(
    decision.reason_code,
    EWASTE_PEOPLE_PATHWAY_REASON.UNSUPPORTED_REQUESTED_OUTPUT,
  );
});

test("altered, reordered, extra or substituted e-waste-people claim authority fails closed", () => {
  const alteredClaims = [
    { statement: "Altered e-waste-people statement under accepted identity." },
    { evidence_domain: ["human_health", "waste"] },
    { evidence_domain: ["waste"] },
    { evidence_scope: ["site_specific"] },
    { confidence: "moderate" },
    { status: "QUALITATIVE" },
    { attribution_status: "not_attributable_to_specific_device" },
    {
      conditions: [
        "unsafe or informal handling occurs",
        "extra invented condition",
      ],
    },
    { conditions: ["unrelated condition"] },
    { source_ids: ["S12"] },
    { source_ids: ["S11", "S12"] },
    { package_commit: "ffffffffffffffffffffffffffffffffffffffff" },
    { package_provenance: "R&E-V0-SMARTPHONE-ALTERED" },
  ];

  for (const alteration of alteredClaims) {
    const decision = resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest({
        authority_claim_record: {
          ...ACCEPTED_EWASTE_PEOPLE_CLAIM,
          ...alteration,
        },
      }),
    );
    assert.equal(
      decision.emitted,
      false,
      `expected deny for ${JSON.stringify(alteration)}`,
    );
    assert.equal(
      decision.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
    );
    assert.equal(decision.pathway, null);
  }
});

test("altered, extra or substituted e-waste-people source authority fails closed", () => {
  const alteredSourceCases = [
    {
      S11: {
        ...ACCEPTED_EWASTE_PEOPLE_SOURCES.S11,
        package_commit: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      },
    },
    {
      S11: {
        ...ACCEPTED_EWASTE_PEOPLE_SOURCES.S11,
        citation: "Altered citation text.",
      },
    },
    {
      S11: {
        ...ACCEPTED_EWASTE_PEOPLE_SOURCES.S11,
        scope: "Altered source scope.",
      },
    },
    {
      S11: {
        ...ACCEPTED_EWASTE_PEOPLE_SOURCES.S11,
        metadata_limit: "Altered metadata limit.",
      },
    },
    {
      S11: ACCEPTED_EWASTE_PEOPLE_SOURCES.S11,
      S12: {
        source_id: "S12",
        package_commit: EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
        package_provenance: EWASTE_PEOPLE_PACKAGE_PROVENANCE,
        citation: "Extra substituted source.",
        scope: "extra",
        metadata_limit: "extra",
      },
    },
    {
      S12: {
        source_id: "S12",
        package_commit: EWASTE_PEOPLE_CLAIM_PACKAGE_COMMIT,
        package_provenance: EWASTE_PEOPLE_PACKAGE_PROVENANCE,
        citation: "Substituted source identity.",
        scope: "substituted",
        metadata_limit: "substituted",
      },
    },
  ];

  for (const [index, authority_source_map] of alteredSourceCases.entries()) {
    const decision = resolveEwastePeoplePathwayBoundary(
      validEwastePeopleRequest({ authority_source_map }),
    );
    assert.equal(
      decision.emitted,
      false,
      `expected deny for altered source case ${index}`,
    );
    assert.equal(
      decision.reason_code,
      EWASTE_PEOPLE_PATHWAY_REASON.AUTHORITY_RECORD_CONFLICT,
    );
    assert.equal(decision.pathway, null);
  }
});

test("existing climate, mining-eco and mining-people emission remain unchanged beside e-waste-people coverage", () => {
  const climate = resolveClimatePathwayBoundary({
    claim_id: CLIMATE_CLAIM_ID,
    claim_version: CLIMATE_CLAIM_PACKAGE_COMMIT,
    scenario_produces_ghg_emissions: true,
  });
  assert.equal(climate.emitted, true);
  assert.equal(climate.pathway.unit, CLIMATE_UNIT);
  assert.equal(climate.pathway.status, "APPROVED");

  const miningEco = resolveMiningEcoPathwayBoundary(validMiningEcoRequest());
  assert.equal(miningEco.emitted, true);
  assert.equal(miningEco.pathway.status, "APPROVED_QUALITATIVE");
  assert.equal(miningEco.pathway.unit, null);

  const miningPeople = resolveMiningPeoplePathwayBoundary(
    validMiningPeopleRequest(),
  );
  assert.equal(miningPeople.emitted, true);
  assert.equal(miningPeople.pathway.status, "QUALITATIVE");
  assert.equal(miningPeople.pathway.confidence, "moderate");

  const ewastePeople = resolveEwastePeoplePathwayBoundary(
    validEwastePeopleRequest(),
  );
  assert.equal(ewastePeople.emitted, true);
  assert.equal(ewastePeople.pathway.status, "APPROVED");
  assert.equal(ewastePeople.pathway.confidence, "high");
  assert.equal(ewastePeople.pathway.unit, null);
  assert.deepEqual(ewastePeople.pathway.source_ids, ["S11"]);
});
