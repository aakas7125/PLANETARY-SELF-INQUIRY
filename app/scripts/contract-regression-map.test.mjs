import assert from "node:assert/strict";
import { test } from "node:test";
import {
  EXECUTING_ASSERTION_COVERAGE,
  IMPLEMENTATION_GAP,
  buildContractRegressionMap,
  contractRegressionSources,
  plannedTestTargets,
} from "./contract-regression-map.mjs";

const expectedInputCases = Array.from({ length: 35 }, (_, index) =>
  `T${String(index + 1).padStart(2, "0")}`,
);
const expectedReleaseGates = Array.from({ length: 10 }, (_, index) =>
  `RC${String(index + 1).padStart(2, "0")}_${[
    "ADEQUATE_KEEP_GENERIC_NEW",
    "UNKNOWN_REMAINING_LIFE",
    "UNSAFE_KEEP_REMOVAL",
    "SECURITY_SUPPORT_NO_AUTO_REPLACE",
    "BATTERY_REPAIR_KNOWN_EXTENSION",
    "BATTERY_REPAIR_UNKNOWN_EXTENSION",
    "MAJOR_BOARD_UNKNOWN_IMPACT",
    "REPAIR_REPLACEMENT_SEQUENCE",
    "UNSUPPORTED_REFURB_FOOTPRINT",
    "OLD_DEVICE_FATE",
  ][index]}`,
);
const expectedSecondaryCases = Array.from({ length: 12 }, (_, index) =>
  `SEC-${String(index + 1).padStart(2, "0")}`,
);
const expectedApInvariants = Array.from({ length: 20 }, (_, index) =>
  `INV-AP-${String(index + 1).padStart(2, "0")}`,
);
const expectedApQuestions = [
  "APQ1_FUNCTION",
  "APQ2_EXPECTATION",
  "APQ3_ORIGIN",
  "APQ4_VISIBILITY",
  "APQ5_NONPURCHASE",
  "APQ6_RESEE",
];
const expectedEmpiricalClaims = [
  "SP-PATH-CLIMATE-001",
  "SP-PATH-MINING-ECO-001",
  "SP-PATH-MINING-PEOPLE-001",
  "SP-PATH-EWASTE-PEOPLE-001",
  "SP-PATH-EWASTE-ECO-001",
  "SP-PATH-WATER-001",
];

function idsFor(rows, domain) {
  return rows.filter((row) => row.domain === domain).map((row) => row.id);
}

test("contract mapping covers every accepted source identifier exactly once", () => {
  const mapping = buildContractRegressionMap();
  const ids = mapping.map((row) => row.id);

  assert.equal(new Set(ids).size, ids.length, "mapping identifiers must be unique");
  assert.deepEqual(
    expectedInputCases,
    idsFor(mapping, "input").filter((id) => /^T\d{2}$/.test(id)),
  );
  assert.deepEqual(
    expectedReleaseGates,
    idsFor(mapping, "input").filter((id) => id.startsWith("RC")),
  );
  assert.deepEqual(
    expectedSecondaryCases,
    idsFor(mapping, "secondary").filter((id) => id.startsWith("SEC-")),
  );
  assert.deepEqual(
    expectedApQuestions,
    idsFor(mapping, "ap").filter((id) => id.startsWith("APQ")),
  );
  assert.deepEqual(
    expectedApInvariants,
    idsFor(mapping, "ap").filter((id) => id.startsWith("INV-AP-")),
  );
  assert.deepEqual(
    expectedEmpiricalClaims,
    idsFor(mapping, "empirical"),
  );
  assert.ok(
    Object.values(contractRegressionSources).every(Boolean),
    "each mapping row must retain its immutable or accepted source reference",
  );
});

test("mapping records only T01–T14 input coverage backed by executing assertions", () => {
  const mapping = buildContractRegressionMap();
  const coverageKinds = new Set(mapping.map((row) => row.coverageKind));
  const coveredInputIds = mapping
    .filter(
      (row) =>
        row.domain === "input" && row.status === EXECUTING_ASSERTION_COVERAGE,
    )
    .map((row) => row.id);
  const remainingInputCases = mapping
    .filter(
      (row) =>
        row.domain === "input" &&
        /^T\d{2}$/.test(row.id) &&
        row.status === IMPLEMENTATION_GAP,
    )
    .map((row) => row.id);

  const expectedCoveredInputIds = [
    "T01", "T02", "T03", "T04", "T05", "T06", "T07",
    "T08", "T09", "T10", "T11", "T12", "T13", "T14",
    "A-T01-HORIZON-2Y", "A-T01-GENERIC-NEW-RANGES", "A-T01-NO-3Y-DEFAULT",
    "A-T02-HORIZON-REMAINS-UNKNOWN", "A-T02-NO-3Y-FALLBACK",
    "A-T03-AGE-NOT-ADEQUACY", "A-T03-NO-OBSOLESCENCE-INFERENCE",
    "A-T04-UNSAFE-REMOVES-KEEP", "A-T05-FUNCTIONAL-INadequacy",
    "A-T06-SUPPORT-END-NOT-AUTO-REPLACE", "A-T06-SUPPORT-IS-ADEQUACY-INPUT",
    "A-T07-SUPPORT-UNKNOWN-STAYS-UNKNOWN",
    "A-T08-BATTERY-RANGE", "A-T08-POST-REPAIR-SERVICE-KNOWN",
    "A-T09-NO-SERVICE-EXTENSION-DEFAULT", "A-T10-DISPLAY-RANGE",
    "A-T11-MAJOR-BOARD-NO-GENERIC", "A-T11-MAJOR-BOARD-UNKNOWN-NOT-ZERO",
    "A-T12-FP5-MODEL-OVERRIDE", "A-T13-SEQUENCE-NOT-TRUNCATED",
    "A-T13-NEXT-ACQUISITION-INCLUDED", "A-T14-NO-INVENTED-NEXT-EVENT",
    "RC01_ADEQUATE_KEEP_GENERIC_NEW", "RC02_UNKNOWN_REMAINING_LIFE",
    "RC03_UNSAFE_KEEP_REMOVAL", "RC04_SECURITY_SUPPORT_NO_AUTO_REPLACE",
    "RC05_BATTERY_REPAIR_KNOWN_EXTENSION", "RC06_BATTERY_REPAIR_UNKNOWN_EXTENSION",
    "RC07_MAJOR_BOARD_UNKNOWN_IMPACT", "RC08_REPAIR_REPLACEMENT_SEQUENCE",
  ];

  assert.deepEqual(
    [...coverageKinds].sort(),
    ["positive", "positive_and_prohibition", "prohibition", "release_gate"],
  );
  assert.deepEqual(coveredInputIds, expectedCoveredInputIds);
  assert.deepEqual(remainingInputCases, expectedInputCases.slice(14));
  assert.ok(
    mapping
      .filter((row) => row.domain !== "input" || !expectedCoveredInputIds.includes(row.id))
      .every((row) => row.status === IMPLEMENTATION_GAP),
  );
  assert.deepEqual(plannedTestTargets(), [
    { target: "scripts/smartphone-input-contract.test.mjs", exists: true },
    { target: "scripts/smartphone-secondary-contract.test.mjs", exists: false },
    { target: "scripts/smartphone-ap-contract.test.mjs", exists: false },
    { target: "scripts/smartphone-empirical-boundary.test.mjs", exists: false },
  ]);
});

test.todo(
  "implement the remaining mapped input-model behavior suite (T15–T35, uncovered A-T-*, A-GLOBAL-*, A-LOGIC-*, PI-*, RC09–RC10)",
);
test.todo(
  "implement the mapped secondary-pathway behavior suite (SEC-01–SEC-12 and A-SEC-*)",
);
test.todo(
  "implement the mapped AP interaction behavior suite (APQ1–APQ6 and INV-AP-01–INV-AP-20)",
);
test.todo(
  "implement the mapped empirical boundary suite (SP-PATH-CLIMATE-001 through SP-PATH-WATER-001)",
);
