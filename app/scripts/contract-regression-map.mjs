import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const appDirectory = resolve(scriptsDirectory, "..");
const repositoryDirectory = resolve(appDirectory, "..");

export const IMPLEMENTATION_GAP = "requires_smartphone_implementation";
export const EXECUTING_ASSERTION_COVERAGE = "covered_by_executing_assertion";

const EXECUTED_INPUT_IDS = new Set([
  "T01",
  "T02",
  "T03",
  "T04",
  "T05",
  "T06",
  "T07",
  "A-T01-HORIZON-2Y",
  "A-T01-GENERIC-NEW-RANGES",
  "A-T01-NO-3Y-DEFAULT",
  "A-T02-HORIZON-REMAINS-UNKNOWN",
  "A-T02-NO-3Y-FALLBACK",
  "A-T03-AGE-NOT-ADEQUACY",
  "A-T03-NO-OBSOLESCENCE-INFERENCE",
  "A-T04-UNSAFE-REMOVES-KEEP",
  "A-T05-FUNCTIONAL-INadequacy",
  "A-T06-SUPPORT-END-NOT-AUTO-REPLACE",
  "A-T06-SUPPORT-IS-ADEQUACY-INPUT",
  "A-T07-SUPPORT-UNKNOWN-STAYS-UNKNOWN",
  "T08",
  "T09",
  "T10",
  "T11",
  "T12",
  "T13",
  "T14",
  "A-T08-BATTERY-RANGE",
  "A-T08-POST-REPAIR-SERVICE-KNOWN",
  "A-T09-NO-SERVICE-EXTENSION-DEFAULT",
  "A-T10-DISPLAY-RANGE",
  "A-T11-MAJOR-BOARD-NO-GENERIC",
  "A-T11-MAJOR-BOARD-UNKNOWN-NOT-ZERO",
  "A-T12-FP5-MODEL-OVERRIDE",
  "A-T13-SEQUENCE-NOT-TRUNCATED",
  "A-T13-NEXT-ACQUISITION-INCLUDED",
  "A-T14-NO-INVENTED-NEXT-EVENT",
  "RC01_ADEQUATE_KEEP_GENERIC_NEW",
  "RC02_UNKNOWN_REMAINING_LIFE",
  "RC03_UNSAFE_KEEP_REMOVAL",
  "RC04_SECURITY_SUPPORT_NO_AUTO_REPLACE",
  "RC05_BATTERY_REPAIR_KNOWN_EXTENSION",
  "RC06_BATTERY_REPAIR_UNKNOWN_EXTENSION",
  "RC07_MAJOR_BOARD_UNKNOWN_IMPACT",
  "RC08_REPAIR_REPLACEMENT_SEQUENCE",
  "T15",
  "T16",
  "T17",
  "T18",
  "T19",
  "T20",
  "T21",
  "T22",
  "T23",
  "A-T15-NO-GENERIC-REFURB-FOOTPRINT",
  "A-T15-ADEME-NOT-DEFAULT",
  "A-T16-ADEME-OPAQUE",
  "A-T16-ADEME-2Y-LABEL",
  "A-T17-GENERIC-NEW-ALLOWED",
  "A-T18-MODEL-OVERRIDE-PRIORITY",
  "A-T19-REUSE-NOT-EWASTE",
  "A-T19-NO-1TO1-CREDIT",
  "A-T20-STORAGE-NOT-RECYCLING",
  "A-T21-EXACT-MASS",
  "A-T21-NO-GLOBAL-RATE",
  "A-T22-NO-GENERIC-MASS",
  "A-T23-TRADEIN-STAYS-UNKNOWN",
  "RC09_UNSUPPORTED_REFURB_FOOTPRINT",
  "RC10_OLD_DEVICE_FATE",
  "T24",
  "T25",
  "T26",
  "T27",
  "T28",
  "T29",
  "T30",
  "T31",
  "T32",
  "T33",
  "T34",
  "T35",
  "A-T24-EOL-NULL-NOT-ZERO",
  "A-T25-NO-UPSTREAM-DOUBLECOUNT",
  "A-T26-SUBSTITUTION-NOT-DISPLACEMENT",
  "A-T27-US-0POINT40-SCENARIO",
  "A-T27-NOT-GLOBAL",
  "A-T28-RANGE-PRESERVED",
  "A-T29-NO-SILENT-CLAMP",
  "A-T30-NO-GRID-DEFAULT",
  "A-T30-NO-EXPERT-QUESTION",
  "A-T31-IDENTITY-OPTIONAL-FOR-GENERIC",
  "A-T32-NO-GRADE-TO-LIFETIME",
  "A-T32-NO-GRADE-TO-FOOTPRINT",
  "A-T33-OPERATIONAL-NOT-ADEQUATE",
  "A-T34-PRIMARY-HORIZON-REMAINS-CURRENT-2Y",
  "A-T34-NO-EARLY-REPLACEMENT-AMORTIZATION",
  "A-T35-MISSING-CLASSES-DISTINCT",
  "A-T35-NO-SILENT-DEFAULT",
  "A-GLOBAL-UNKNOWN-NOT-ZERO",
  "A-GLOBAL-UNKNOWN-NOT-FALSE",
  "A-GLOBAL-NO-SITUATIONAL-DEFAULT",
  "A-GLOBAL-RESEARCH-FALLBACK",
  "A-GLOBAL-NO-UNAPPROVED-FALLBACK",
  "A-GLOBAL-EQUAL-SERVICE",
  "A-GLOBAL-SUNK-MANUFACTURING",
  "A-GLOBAL-NO-GENERIC-EOL-ZERO",
  "A-GLOBAL-NO-GENERIC-RECYCLING-CREDIT",
  "A-GLOBAL-NO-UNIFIED-HARM-SCORE",
  "A-LOGIC-ADEQUACY-001",
  "A-LOGIC-ADEQUACY-002",
  "A-LOGIC-ADEQUACY-003",
  "A-LOGIC-LIFE-001",
  "A-LOGIC-LIFE-002",
  "A-LOGIC-REPAIR-001",
  "A-LOGIC-REPAIR-002",
  "A-LOGIC-REFURB-001",
  "A-LOGIC-REFURB-002",
  "A-LOGIC-FATE-001",
  "A-LOGIC-FATE-002",
  "A-LOGIC-MISSING-001",
  "A-LOGIC-MISSING-002",
  "A-LOGIC-MISSING-003",
  "A-LOGIC-EOL-001",
  "A-LOGIC-MATERIALS-001",
  "PI-001",
  "PI-002",
  "PI-003",
  "PI-004",
  "PI-005",
  "PI-006",
  "PI-007",
  "PI-008",
  "PI-009",
  "PI-010",
  "PI-011",
  "PI-012",
  "PI-013",
  "PI-014",
  "PI-015",
]);

const SOURCES = {
  inputPackage:
    "provenance/source-packages/R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json",
  secondaryPackage:
    "provenance/source-packages/R&E-V0-SMARTPHONE-SECONDARY-PATHWAY-TESTS-1.0.0.md",
  apInvariants: "tests/ap-integrity/AP_V0_INVARIANTS.md",
  apContract: "contracts/AP_INTERACTION_V0.md",
  empiricalContract: "contracts/EMPIRICAL_SMARTPHONE_V0.md",
};

const TARGETS = {
  input: "scripts/smartphone-input-contract.test.mjs",
  secondary: "scripts/smartphone-secondary-contract.test.mjs",
  ap: "scripts/smartphone-ap-contract.test.mjs",
  empirical: "scripts/smartphone-empirical-boundary.test.mjs",
};

function readRepositoryFile(relativePath) {
  return readFileSync(join(repositoryDirectory, relativePath), "utf8");
}

function idList(value) {
  return Array.isArray(value)
    ? value
    : String(value ?? "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
}

function rowsFor(ids, domain, coverageKind, target, source, statusFor = () => IMPLEMENTATION_GAP) {
  return ids.map((id) => ({
    id,
    domain,
    coverageKind,
    source,
    target,
    status: statusFor(id),
  }));
}

function unique(ids) {
  return [...new Set(ids)];
}

export function buildContractRegressionMap() {
  const inputPackage = JSON.parse(readRepositoryFile(SOURCES.inputPackage));
  const secondaryPackage = readRepositoryFile(SOURCES.secondaryPackage);
  const apInvariants = readRepositoryFile(SOURCES.apInvariants);
  const apContract = readRepositoryFile(SOURCES.apContract);
  const empiricalContract = readRepositoryFile(SOURCES.empiricalContract);

  const inputCaseIds = inputPackage.cases.map(({ id }) => id);
  const inputAssertionIds = inputPackage.cases.flatMap(({ assertionIds }) => idList(assertionIds));
  const inputGlobalIds = inputPackage.globalAssertions.map(({ id }) => id);
  const inputLogicIds = inputPackage.logicAssertions.map(({ id }) => id);
  const inputProhibitionIds = inputPackage.prohibitedInterpretations.map(({ id }) => id);
  const inputReleaseIds = inputPackage.releaseCriticalChecklist.map(({ id }) => id);

  const secondaryCaseIds = unique(
    [...secondaryPackage.matchAll(/^case_id = "(SEC-\d{2})"$/gm)].map(([, id]) => id),
  );
  const secondaryAssertionIds = unique(
    [...secondaryPackage.matchAll(/^(A-SEC-\d{2}-\d{2}):$/gm)].map(([, id]) => id),
  );
  const apQuestionIds = unique(
    [...apContract.matchAll(/^### `(APQ\d_[A-Z]+)`$/gm)].map(([, id]) => id),
  );
  const apInvariantIds = unique(
    [...apInvariants.matchAll(/^## (INV-AP-\d{2}) — /gm)].map(([, id]) => id),
  );
  const empiricalClaimIds = unique(
    [...empiricalContract.matchAll(/`(SP-PATH-[A-Z-]+-\d{3})`/g)].map(([, id]) => id),
  );

  const inputStatus = (id) =>
    EXECUTED_INPUT_IDS.has(id) ? EXECUTING_ASSERTION_COVERAGE : IMPLEMENTATION_GAP;

  return [
    ...rowsFor(inputCaseIds, "input", "positive", TARGETS.input, SOURCES.inputPackage, inputStatus),
    ...rowsFor(inputAssertionIds, "input", "positive", TARGETS.input, SOURCES.inputPackage, inputStatus),
    ...rowsFor(inputGlobalIds, "input", "positive", TARGETS.input, SOURCES.inputPackage, inputStatus),
    ...rowsFor(inputLogicIds, "input", "positive", TARGETS.input, SOURCES.inputPackage, inputStatus),
    ...rowsFor(inputProhibitionIds, "input", "prohibition", TARGETS.input, SOURCES.inputPackage, inputStatus),
    ...rowsFor(inputReleaseIds, "input", "release_gate", TARGETS.input, SOURCES.inputPackage, inputStatus),
    ...rowsFor(
      secondaryCaseIds,
      "secondary",
      "positive_and_prohibition",
      TARGETS.secondary,
      SOURCES.secondaryPackage,
    ),
    ...rowsFor(
      secondaryAssertionIds,
      "secondary",
      "positive_and_prohibition",
      TARGETS.secondary,
      SOURCES.secondaryPackage,
    ),
    ...rowsFor(apQuestionIds, "ap", "positive", TARGETS.ap, SOURCES.apContract),
    ...rowsFor(
      apInvariantIds,
      "ap",
      "positive_and_prohibition",
      TARGETS.ap,
      SOURCES.apInvariants,
    ),
    ...rowsFor(
      empiricalClaimIds,
      "empirical",
      "prohibition",
      TARGETS.empirical,
      SOURCES.empiricalContract,
    ),
  ];
}

export function plannedTestTargets() {
  return Object.values(TARGETS).map((target) => ({
    target,
    exists: existsSync(join(appDirectory, target)),
  }));
}

export const contractRegressionSources = SOURCES;
