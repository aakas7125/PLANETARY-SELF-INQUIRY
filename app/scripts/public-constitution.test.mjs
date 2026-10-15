import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  PUBLIC_CONSTITUTION_ACCOUNTABILITY_HREF,
  PUBLIC_CONSTITUTION_AUTHORITY,
  PUBLIC_CONSTITUTION_PAGE_TITLE,
  PUBLIC_CONSTITUTION_SCENES,
  PUBLIC_CONSTITUTION_SECTION_HEADINGS,
  PUBLIC_CONSTITUTION_UNITS,
} from "../src/lib/constitution/public-constitution.mjs";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(appRoot, "..");

function read(path) {
  return readFileSync(path, "utf8");
}

function sectionOne(handoff) {
  const start = handoff.indexOf("# 1. Ready-to-use English public copy");
  const end = handoff.indexOf("# 2. Traceability");
  assert.ok(start >= 0 && end > start, "Section 1 is missing from the adopted handoff");
  return handoff.slice(start, end);
}

function visibleParagraphs(section) {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#") && line !== "---")
    .map((line) => line.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"));
}

const handoff = read(join(repoRoot, "handoffs/ap/HQ-AP-2026-10-15-003-public-constitution.md"));
const section = sectionOne(handoff);
const paragraphs = visibleParagraphs(section);
const orderedUnits = Object.values(PUBLIC_CONSTITUTION_UNITS);
const visibleCopy = orderedUnits.map((unit) => unit.text).join(" ");

test("stable units preserve every section 1 paragraph and heading", () => {
  assert.equal(PUBLIC_CONSTITUTION_PAGE_TITLE, "What PSI promises you");
  assert.match(section, /## What PSI promises you/);
  for (const paragraph of paragraphs) {
    assert.equal(visibleCopy.includes(paragraph), true, paragraph);
  }
  for (const heading of PUBLIC_CONSTITUTION_SECTION_HEADINGS) {
    assert.match(section, new RegExp(`### ${heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`));
  }
  const renderedHeadings = PUBLIC_CONSTITUTION_SCENES.flatMap((scene) =>
    scene.blocks.map((block) => block.heading).filter(Boolean),
  );
  for (const heading of PUBLIC_CONSTITUTION_SECTION_HEADINGS) {
    assert.equal(renderedHeadings.includes(heading), true, heading);
  }
});

test("scene map reuses shared promises without dropping a content id", () => {
  assert.deepEqual(
    PUBLIC_CONSTITUTION_SCENES.map((scene) => scene.title),
    [
      "Your life is where the question starts",
      "Ordinary choices repeat",
      "Choices sit inside wider systems",
      "Evidence has edges",
      "Questions, not judgement",
      "The choice returns to you",
    ],
  );
  assert.deepEqual(
    PUBLIC_CONSTITUTION_SCENES.map((scene) => scene.blocks.flatMap((block) => block.unitIds)),
    [
      ["PC-OPEN-01", "PC-RAW-01"],
      ["PC-CHOICE-01", "PC-INPUT-01"],
      ["PC-CAUSE-01", "PC-PMF-01"],
      ["PC-EVID-01", "PC-EVID-02", "PC-EVID-03", "PC-SEPARATE-01", "PC-DISTINCT-01"],
      ["PC-RAW-01", "PC-DESIGN-01", "PC-DESIGN-02", "PC-INQUIRY-01"],
      ["PC-CHOICE-02", "PC-PRIV-01", "PC-PRIV-02", "PC-ACCOUNT-02", "PC-ACCOUNT-01", "PC-ACCOUNT-03", "PC-CONFLICT-01"],
    ],
  );
  const rendered = new Set(PUBLIC_CONSTITUTION_SCENES.flatMap((scene) => scene.blocks.flatMap((block) => block.unitIds)));
  assert.deepEqual(rendered, new Set(Object.keys(PUBLIC_CONSTITUTION_UNITS)));
  assert.deepEqual(Object.keys(PUBLIC_CONSTITUTION_AUTHORITY).sort(), Object.keys(PUBLIC_CONSTITUTION_UNITS).sort());
});

test("accountability points at the public tracker landing page", () => {
  assert.equal(
    PUBLIC_CONSTITUTION_ACCOUNTABILITY_HREF,
    "https://github.com/aakas7125/PLANETARY-SELF-INQUIRY/issues",
  );
  assert.equal(PUBLIC_CONSTITUTION_UNITS["PC-ACCOUNT-01"].href, PUBLIC_CONSTITUTION_ACCOUNTABILITY_HREF);
  assert.equal(PUBLIC_CONSTITUTION_UNITS["PC-ACCOUNT-01"].linkPhrase, "public project issue tracker");
  const returnScene = PUBLIC_CONSTITUTION_SCENES.find((scene) => scene.id === "return");
  const accountabilityIds = returnScene.blocks.at(-1).unitIds;
  assert.ok(accountabilityIds.indexOf("PC-ACCOUNT-02") < accountabilityIds.indexOf("PC-ACCOUNT-01"));
  assert.equal(visibleCopy.includes("/issues/new"), false);
  assert.equal(PUBLIC_CONSTITUTION_UNITS["PC-CHOICE-01"].text.includes("used or second-hand"), true);
  assert.equal(PUBLIC_CONSTITUTION_UNITS["PC-CHOICE-01"].text.includes("refurbished"), true);
  assert.equal(/[äöüÄÖÜß]/.test(visibleCopy), false);
});

test("the page renders the module and navigation without rewriting home or the phone inquiry", () => {
  const page = read(join(appRoot, "src/components/public-constitution.tsx"));
  const route = read(join(appRoot, "src/routes/constitution.tsx"));
  const nav = read(join(appRoot, "src/components/site-nav.tsx"));
  const home = read(join(appRoot, "src/routes/index.tsx"));
  const journey = read(join(appRoot, "src/routes/journey.tsx"));
  const smartphone = read(join(appRoot, "src/routes/smartphone.tsx"));
  const tree = read(join(appRoot, "src/routeTree.gen.ts"));
  const profile = read(join(repoRoot, "project-state/PUBLIC_BETA_PROFILE.md"));

  assert.match(page, /PUBLIC_CONSTITUTION_SCENES/);
  assert.match(page, /data-content-id=\{unit\.id\}/);
  assert.match(page, /unit\.text/);
  assert.doesNotMatch(page, /issues\/new/);
  assert.match(route, /createFileRoute\("\/constitution"\)/);
  assert.match(route, /SiteNav/);
  assert.match(route, /Back to home/);
  assert.match(nav, /href="\/constitution"/);
  assert.match(nav, />\s*Principles\s*</);
  assert.match(nav, /pathname === "\/constitution" \? "page"/);
  assert.match(nav, /href="\/smartphone"/);
  assert.match(nav, /Phone inquiry/);
  assert.match(nav, /href="\/journey"/);
  assert.match(nav, />\s*Journey\s*</);
  assert.match(tree, /path:\s*'\/constitution'/);
  assert.doesNotMatch(home, /public-constitution|\/constitution/);
  assert.doesNotMatch(journey, /public-constitution/);
  assert.match(smartphone, /createFileRoute\("\/smartphone"\)/);
  assert.match(profile, /\/constitution/);
  assert.match(profile, /constitution-public-profile-smoke\.mjs/);
  assert.match(profile, /no account, login, session, persistent user/);
});
