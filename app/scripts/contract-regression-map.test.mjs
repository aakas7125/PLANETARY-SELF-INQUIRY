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

test("mapping records T01–T35, the ten executed globals, and sixteen executed logic assertions", () => {
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
  const coveredSecondaryIds = mapping
    .filter(
      (row) =>
        row.domain === "secondary" && row.status === EXECUTING_ASSERTION_COVERAGE,
    )
    .map((row) => row.id);
  const remainingSecondaryCases = mapping
    .filter(
      (row) =>
        row.domain === "secondary" &&
        /^SEC-\d{2}$/.test(row.id) &&
        row.status === IMPLEMENTATION_GAP,
    )
    .map((row) => row.id);
  const secondaryGlobalIds = mapping
    .filter((row) => row.domain === "secondary" && row.id.startsWith("A-SEC-GLOBAL-"))
    .map((row) => row.id);
  const remainingSecondaryGlobals = mapping
    .filter(
      (row) =>
        row.domain === "secondary" &&
        row.id.startsWith("A-SEC-GLOBAL-") &&
        row.status === IMPLEMENTATION_GAP,
    )
    .map((row) => row.id);

  const expectedCoveredInputIds = [
    "T01", "T02", "T03", "T04", "T05", "T06", "T07",
    "T08", "T09", "T10", "T11", "T12", "T13", "T14",
    "T15", "T16", "T17", "T18", "T19", "T20", "T21", "T22", "T23",
    "T24", "T25", "T26", "T27", "T28", "T29", "T30", "T31", "T32", "T33", "T34", "T35",
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
    "A-T15-NO-GENERIC-REFURB-FOOTPRINT", "A-T15-ADEME-NOT-DEFAULT",
    "A-T16-ADEME-OPAQUE", "A-T16-ADEME-2Y-LABEL",
    "A-T17-GENERIC-NEW-ALLOWED", "A-T18-MODEL-OVERRIDE-PRIORITY",
    "A-T19-REUSE-NOT-EWASTE", "A-T19-NO-1TO1-CREDIT",
    "A-T20-STORAGE-NOT-RECYCLING", "A-T21-EXACT-MASS",
    "A-T21-NO-GLOBAL-RATE", "A-T22-NO-GENERIC-MASS",
    "A-T23-TRADEIN-STAYS-UNKNOWN",
    "A-T24-EOL-NULL-NOT-ZERO", "A-T25-NO-UPSTREAM-DOUBLECOUNT",
    "A-T26-SUBSTITUTION-NOT-DISPLACEMENT",
    "A-T27-US-0POINT40-SCENARIO", "A-T27-NOT-GLOBAL",
    "A-T28-RANGE-PRESERVED", "A-T29-NO-SILENT-CLAMP",
    "A-T30-NO-GRID-DEFAULT", "A-T30-NO-EXPERT-QUESTION",
    "A-T31-IDENTITY-OPTIONAL-FOR-GENERIC",
    "A-T32-NO-GRADE-TO-LIFETIME", "A-T32-NO-GRADE-TO-FOOTPRINT",
    "A-T33-OPERATIONAL-NOT-ADEQUATE",
    "A-T34-PRIMARY-HORIZON-REMAINS-CURRENT-2Y",
    "A-T34-NO-EARLY-REPLACEMENT-AMORTIZATION",
    "A-T35-MISSING-CLASSES-DISTINCT", "A-T35-NO-SILENT-DEFAULT",
    "A-GLOBAL-UNKNOWN-NOT-ZERO", "A-GLOBAL-UNKNOWN-NOT-FALSE",
    "A-GLOBAL-NO-SITUATIONAL-DEFAULT", "A-GLOBAL-RESEARCH-FALLBACK",
    "A-GLOBAL-NO-UNAPPROVED-FALLBACK",
    "A-GLOBAL-EQUAL-SERVICE", "A-GLOBAL-SUNK-MANUFACTURING",
    "A-GLOBAL-NO-GENERIC-EOL-ZERO", "A-GLOBAL-NO-GENERIC-RECYCLING-CREDIT",
    "A-GLOBAL-NO-UNIFIED-HARM-SCORE",
    "A-LOGIC-ADEQUACY-001", "A-LOGIC-ADEQUACY-002", "A-LOGIC-ADEQUACY-003",
    "A-LOGIC-LIFE-001", "A-LOGIC-LIFE-002",
    "A-LOGIC-REPAIR-001", "A-LOGIC-REPAIR-002",
    "A-LOGIC-REFURB-001", "A-LOGIC-REFURB-002",
    "A-LOGIC-FATE-001", "A-LOGIC-FATE-002",
    "A-LOGIC-MISSING-001", "A-LOGIC-MISSING-002", "A-LOGIC-MISSING-003",
    "A-LOGIC-EOL-001", "A-LOGIC-MATERIALS-001",
    "PI-001", "PI-002", "PI-003", "PI-004", "PI-005", "PI-006",
    "PI-007", "PI-008", "PI-009", "PI-010", "PI-011", "PI-012", "PI-013",
    "PI-014", "PI-015", "PI-016", "PI-017", "PI-018", "PI-019", "PI-020",
    "RC01_ADEQUATE_KEEP_GENERIC_NEW", "RC02_UNKNOWN_REMAINING_LIFE",
    "RC03_UNSAFE_KEEP_REMOVAL", "RC04_SECURITY_SUPPORT_NO_AUTO_REPLACE",
    "RC05_BATTERY_REPAIR_KNOWN_EXTENSION", "RC06_BATTERY_REPAIR_UNKNOWN_EXTENSION",
    "RC07_MAJOR_BOARD_UNKNOWN_IMPACT", "RC08_REPAIR_REPLACEMENT_SEQUENCE",
    "RC09_UNSUPPORTED_REFURB_FOOTPRINT", "RC10_OLD_DEVICE_FATE",
  ];
  const expectedCoveredSecondaryIds = [
    "SEC-01", "SEC-02", "SEC-03", "SEC-04", "SEC-05", "SEC-06", "SEC-09",
    "A-SEC-01-01", "A-SEC-01-02", "A-SEC-01-03", "A-SEC-01-04",
    "A-SEC-02-01", "A-SEC-02-02", "A-SEC-02-03", "A-SEC-02-04",
    "A-SEC-03-01", "A-SEC-03-02", "A-SEC-03-03",
    "A-SEC-04-01", "A-SEC-04-02", "A-SEC-04-03",
    "A-SEC-05-01", "A-SEC-05-02", "A-SEC-05-03",
    "A-SEC-06-01", "A-SEC-06-02", "A-SEC-06-03",
    "A-SEC-09-01", "A-SEC-09-02", "A-SEC-09-03", "A-SEC-09-04",
  ];
  const expectedSecondaryGlobals = [
    "A-SEC-GLOBAL-01",
    "A-SEC-GLOBAL-02",
    "A-SEC-GLOBAL-03",
    "A-SEC-GLOBAL-04",
    "A-SEC-GLOBAL-05",
    "A-SEC-GLOBAL-06",
    "A-SEC-GLOBAL-07",
    "A-SEC-GLOBAL-08",
  ];

  assert.deepEqual(
    [...coverageKinds].sort(),
    ["positive", "positive_and_prohibition", "prohibition", "release_gate"],
  );
  assert.deepEqual(coveredInputIds, expectedCoveredInputIds);
  assert.deepEqual(remainingInputCases, []);
  assert.deepEqual(coveredSecondaryIds, expectedCoveredSecondaryIds);
  assert.deepEqual(remainingSecondaryCases, [
    "SEC-07", "SEC-08", "SEC-10", "SEC-11", "SEC-12",
  ]);
  assert.deepEqual(secondaryGlobalIds, expectedSecondaryGlobals);
  assert.deepEqual(remainingSecondaryGlobals, expectedSecondaryGlobals);
  assert.ok(
    mapping
      .filter(
        (row) =>
          !(row.domain === "input" && expectedCoveredInputIds.includes(row.id)) &&
          !(row.domain === "secondary" && expectedCoveredSecondaryIds.includes(row.id)),
      )
      .every((row) => row.status === IMPLEMENTATION_GAP),
  );
  assert.deepEqual(plannedTestTargets(), [
    { target: "scripts/smartphone-input-contract.test.mjs", exists: true },
    { target: "scripts/smartphone-secondary-contract.test.mjs", exists: true },
    { target: "scripts/smartphone-ap-contract.test.mjs", exists: false },
    { target: "scripts/smartphone-empirical-boundary.test.mjs", exists: false },
  ]);
});

test.todo(
  "implement remaining secondary-pathway cases (SEC-07, SEC-08, SEC-10–SEC-12, their A-SEC-* case assertions, and A-SEC-GLOBAL-01–A-SEC-GLOBAL-08)",
);
test.todo(
  "implement the mapped AP interaction behavior suite (APQ1–APQ6 and INV-AP-01–INV-AP-20)",
);
test.todo(
  "implement the mapped empirical boundary suite (SP-PATH-CLIMATE-001 through SP-PATH-WATER-001)",
);
