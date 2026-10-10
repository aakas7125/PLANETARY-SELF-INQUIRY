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

test("pending empirical pathway IDs remain non-emitting in this slice", () => {
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
