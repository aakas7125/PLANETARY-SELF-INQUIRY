import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import { evaluateAdequacyAndUnknownState } from "../src/lib/smartphone/input-decision.mjs";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryDirectory = resolve(scriptDirectory, "../..");
const sourcePackage = JSON.parse(
  readFileSync(
    join(
      repositoryDirectory,
      "provenance/source-packages/R&E-V0-SMARTPHONE-INPUT-TESTS-1.0.0.json",
    ),
    "utf8",
  ),
);
const coveredCaseIds = ["T01", "T02", "T03", "T04", "T05", "T06", "T07"];
const coveredAssertionIds = [
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
];
const coveredReleaseGroups = [
  "RC01_ADEQUATE_KEEP_GENERIC_NEW",
  "RC02_UNKNOWN_REMAINING_LIFE",
  "RC03_UNSAFE_KEEP_REMOVAL",
  "RC04_SECURITY_SUPPORT_NO_AUTO_REPLACE",
];
const cases = sourcePackage.cases.filter((candidate) => coveredCaseIds.includes(candidate.id));

function valueAt(object, dottedPath) {
  return dottedPath.split(".").reduce((value, key) => value?.[key], object);
}

test("T01–T07 coverage remains pinned to the immutable source cases", () => {
  assert.deepEqual(cases.map(({ id }) => id), coveredCaseIds);
  assert.deepEqual(
    cases.flatMap(({ assertionIds }) => assertionIds),
    coveredAssertionIds,
  );
  assert.deepEqual(
    sourcePackage.releaseCriticalChecklist
      .filter(({ id }) => coveredReleaseGroups.includes(id))
      .map(({ id }) => id),
    coveredReleaseGroups,
  );
});

for (const sourceCase of cases) {
  test(`${sourceCase.id}: enforces its expected adequacy and unknown-state outputs`, () => {
    const result = evaluateAdequacyAndUnknownState(sourceCase.inputs);

    for (const [path, expected] of Object.entries(sourceCase.expected)) {
      assert.deepEqual(valueAt(result, path), expected, `${sourceCase.id} ${path}`);
    }
  });
}

test("T02 and T03 never infer a three-year horizon or obsolescence from age", () => {
  const t02 = cases.find(({ id }) => id === "T02");
  const t03 = cases.find(({ id }) => id === "T03");
  assert.ok(t02 && t03);

  const unknownHorizon = evaluateAdequacyAndUnknownState(t02.inputs);
  assert.equal(unknownHorizon.H_primary_years, null);
  assert.notEqual(unknownHorizon.H_primary_years, 3);

  const young = evaluateAdequacyAndUnknownState({
    ...t03.inputs,
    "current_device.total_service_age_years": 1,
  });
  const old = evaluateAdequacyAndUnknownState({
    ...t03.inputs,
    "current_device.total_service_age_years": 99,
  });
  assert.deepEqual(old, young);
  assert.equal("obsolete" in old, false);
});

test("T04–T07 preserve infeasibility, stated function limits, and support unknowns", () => {
  const byId = Object.fromEntries(cases.map((sourceCase) => [sourceCase.id, sourceCase]));
  const unsafe = evaluateAdequacyAndUnknownState(byId.T04.inputs);
  const functionsMissing = evaluateAdequacyAndUnknownState(byId.T05.inputs);
  const supportEnded = evaluateAdequacyAndUnknownState(byId.T06.inputs);
  const supportUnknown = evaluateAdequacyAndUnknownState(byId.T07.inputs);

  assert.equal(unsafe.keep_as_is.feasible, false);
  assert.equal(functionsMissing.keep_as_is.provides_equivalent_service, false);
  assert.equal(supportEnded.replacement_forced_by_support_status, false);
  assert.equal(supportUnknown.derived.adequacy_gate.adequacy_status, "unknown");
  assert.equal(supportUnknown.replacement_forced_by_support_status, false);
  assert.equal("recommendation" in supportUnknown, false);
});
