import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const appDirectory = resolve(scriptsDirectory, "..");
const repositoryDirectory = resolve(appDirectory, "..");

export const IMPLEMENTATION_GAP = "requires_smartphone_implementation";

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

function rowsFor(ids, domain, coverageKind, target, source) {
  return ids.map((id) => ({
    id,
    domain,
    coverageKind,
    source,
    target,
    status: IMPLEMENTATION_GAP,
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

  return [
    ...rowsFor(inputCaseIds, "input", "positive", TARGETS.input, SOURCES.inputPackage),
    ...rowsFor(inputAssertionIds, "input", "positive", TARGETS.input, SOURCES.inputPackage),
    ...rowsFor(inputGlobalIds, "input", "positive", TARGETS.input, SOURCES.inputPackage),
    ...rowsFor(inputLogicIds, "input", "positive", TARGETS.input, SOURCES.inputPackage),
    ...rowsFor(inputProhibitionIds, "input", "prohibition", TARGETS.input, SOURCES.inputPackage),
    ...rowsFor(inputReleaseIds, "input", "release_gate", TARGETS.input, SOURCES.inputPackage),
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
