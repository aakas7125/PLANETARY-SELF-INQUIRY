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
  "RC01_ADEQUATE_KEEP_GENERIC_NEW",
  "RC02_UNKNOWN_REMAINING_LIFE",
  "RC03_UNSAFE_KEEP_REMOVAL",
  "RC04_SECURITY_SUPPORT_NO_AUTO_REPLACE",
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
