import assert from "node:assert/strict";
import { test } from "node:test";
import {
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

test("mapping records positive and prohibited behavior without claiming current coverage", () => {
  const mapping = buildContractRegressionMap();
  const coverageKinds = new Set(mapping.map((row) => row.coverageKind));

  assert.deepEqual(
    [...coverageKinds].sort(),
    ["positive", "positive_and_prohibition", "prohibition", "release_gate"],
  );
  assert.ok(mapping.every((row) => row.status === IMPLEMENTATION_GAP));
  assert.ok(
    plannedTestTargets().every(({ exists }) => !exists),
    "a new smartphone behavior suite requires an explicit mapping-state update",
  );
});

test.todo(
  "implement the mapped input-model behavior suite (T01–T35, A-T-*, A-GLOBAL-*, A-LOGIC-*, PI-*, RC01–RC10)",
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
