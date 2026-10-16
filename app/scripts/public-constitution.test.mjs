import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  CONSTITUTION_LANGUAGE_LINKS,
  constitutionDocument,
  resolveConstitutionLanguage,
} from "../src/lib/constitution/constitution-locale.mjs";
import {
  PUBLIC_CONSTITUTION_DE_LABELS,
  PUBLIC_CONSTITUTION_DE_SOURCE,
  PUBLIC_CONSTITUTION_DE_UNITS,
} from "../src/lib/constitution/public-constitution-de.mjs";
import {
  PUBLIC_CONSTITUTION_ACCOUNTABILITY_HREF,
  PUBLIC_CONSTITUTION_AUTHORITY,
  PUBLIC_CONSTITUTION_LABELS,
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

  assert.match(page, /data-content-id=\{unit\.id\}/);
  assert.match(page, /unit\.text/);
  assert.doesNotMatch(page, /issues\/new/);
  assert.match(route, /createFileRoute\("\/constitution"\)/);
  assert.match(route, /SiteNav/);
  assert.match(route, /copy\.backHome\.text/);
  assert.equal(PUBLIC_CONSTITUTION_LABELS["LBL-BACK-HOME"], "Back to home");
  assert.match(nav, /href="\/constitution"/);
  assert.match(nav, />\s*Principles\s*</);
  assert.match(nav, /pathname === "\/constitution" \? "page"/);
  assert.doesNotMatch(nav, /Deutsch|lang=de|constitution-locale/);
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
  assert.match(profile, /lang=de/);
  assert.match(profile, /no account, login, session, persistent user/);
});

function tableRows(section, prefix) {
  return section
    .split("\n")
    .filter((line) => line.startsWith(prefix))
    .map((line) => line.split("|").slice(1, -1).map((cell) => cell.trim()));
}

test("German pilot copy matches the adopted handoff and English stays canonical", () => {
  const germanHandoff = read(join(repoRoot, "handoffs/ap/HQ-AP-2026-10-15-004-german-constitution-pilot.md"));
  const inventory = germanHandoff.slice(germanHandoff.indexOf("## 1."), germanHandoff.indexOf("## 2."));
  const semantics = germanHandoff.slice(germanHandoff.indexOf("## 3."), germanHandoff.indexOf("## 4."));
  const labelRows = tableRows(inventory, "| LBL-");
  const unitRows = tableRows(semantics, "| PC-");
  assert.equal(labelRows.length, 53);
  assert.equal(unitRows.length, 21);
  assert.equal(PUBLIC_CONSTITUTION_DE_SOURCE.decision, "D-008");
  assert.equal(PUBLIC_CONSTITUTION_DE_SOURCE.specialistHead, "87be66a8c65c198b6bdc0e42dbefbfff9c50519f");

  for (const [id, english, german] of labelRows) {
    assert.equal(PUBLIC_CONSTITUTION_LABELS[id], english, id);
    assert.equal(PUBLIC_CONSTITUTION_DE_LABELS[id], german, id);
  }
  for (const [id, english, german] of unitRows) {
    assert.equal(PUBLIC_CONSTITUTION_UNITS[id].text, english, id);
    assert.equal(PUBLIC_CONSTITUTION_DE_UNITS[id].text, german, id);
  }

  const german = constitutionDocument("de");
  const canonical = constitutionDocument("en");
  assert.equal(german.fallbacks.length, 0);
  assert.equal(canonical.fallbacks.length, 0);
  assert.equal(german.contentLang, "de");
  assert.equal(canonical.contentLang, "en");
  assert.deepEqual(
    CONSTITUTION_LANGUAGE_LINKS.map((item) => item.label),
    ["English", "Deutsch (Pilot)"],
  );

  const germanUnits = german.scenes.flatMap((scene) => scene.blocks.flatMap((block) => block.units));
  assert.equal(new Set(germanUnits.map((unit) => unit.id)).size, 21);
  const raw = germanUnits.filter((unit) => unit.id === "PC-RAW-01");
  assert.equal(raw.length, 2);
  assert.equal(raw[0].text, raw[1].text);
  assert.equal(raw[0].text, PUBLIC_CONSTITUTION_DE_UNITS["PC-RAW-01"].text);
  assert.equal(germanUnits.every((unit) => unit.lang === "de" && unit.text.length > 0), true);
  for (const unit of Object.values(PUBLIC_CONSTITUTION_UNITS)) {
    const rendered = canonical.scenes.flatMap((scene) => scene.blocks.flatMap((block) => block.units)).find((item) => item.id === unit.id);
    assert.equal(rendered.text, unit.text);
    assert.equal(rendered.lang, "en");
  }

  assert.equal(
    german.sourcesIntro.text,
    PUBLIC_CONSTITUTION_DE_LABELS["LBL-SOURCES-INTRO"],
  );
  assert.equal(german.sourcesIntro.text.includes("englischen"), true);
  assert.equal(german.sourcesIntro.text.includes("kanonische"), true);
  assert.equal(german.sourcesIntro.text === canonical.sourcesIntro.text, false);
  assert.equal(PUBLIC_CONSTITUTION_DE_UNITS["PC-ACCOUNT-01"].href, PUBLIC_CONSTITUTION_ACCOUNTABILITY_HREF);
  assert.equal(
    PUBLIC_CONSTITUTION_DE_UNITS["PC-ACCOUNT-01"].linkPhrase,
    "öffentlichen Issue-Tracker des Projekts",
  );
  const accountability = german.scenes.find((scene) => scene.id === "return").blocks.at(-1).units;
  assert.ok(accountability.findIndex((unit) => unit.id === "PC-ACCOUNT-02") < accountability.findIndex((unit) => unit.id === "PC-ACCOUNT-01"));
  assert.equal(PUBLIC_CONSTITUTION_DE_LABELS["LBL-CHOICE-USED"] === PUBLIC_CONSTITUTION_DE_LABELS["LBL-CHOICE-REFURB"], false);
  assert.equal(PUBLIC_CONSTITUTION_DE_UNITS["PC-CHOICE-01"].text.includes("Secondhand"), true);
  assert.equal(PUBLIC_CONSTITUTION_DE_UNITS["PC-CHOICE-01"].text.includes("aufbereitet"), true);
  assert.equal(PUBLIC_CONSTITUTION_DE_UNITS["PC-PRIV-02"].text.includes("nur auf deinem Gerät"), true);
  assert.equal(PUBLIC_CONSTITUTION_DE_UNITS["PC-EVID-02"].text.includes("einsehbar"), true);
  assert.equal(PUBLIC_CONSTITUTION_DE_UNITS["PC-PRIV-01"].text.includes("Nutzungsverhaltens"), true);
});

test("missing or unsupported locale uses the complete English unit", () => {
  assert.equal(resolveConstitutionLanguage(undefined), "en");
  assert.equal(resolveConstitutionLanguage("en"), "en");
  assert.equal(resolveConstitutionLanguage("de"), "de");
  assert.equal(resolveConstitutionLanguage("fr"), "en");
  assert.equal(resolveConstitutionLanguage("DE"), "en");
  assert.equal(resolveConstitutionLanguage(""), "en");

  const units = { ...PUBLIC_CONSTITUTION_DE_UNITS };
  delete units["PC-PRIV-02"];
  units["PC-EVID-02"] = { id: "PC-EVID-02", text: "" };
  const labels = { ...PUBLIC_CONSTITUTION_DE_LABELS };
  delete labels["LBL-SCENE-4"];
  const fallback = constitutionDocument("de", { units, labels });
  const rendered = fallback.scenes.flatMap((scene) => scene.blocks.flatMap((block) => block.units));
  const privacy = rendered.find((unit) => unit.id === "PC-PRIV-02");
  const evidence = rendered.find((unit) => unit.id === "PC-EVID-02");
  assert.equal(privacy.text, PUBLIC_CONSTITUTION_UNITS["PC-PRIV-02"].text);
  assert.equal(privacy.lang, "en");
  assert.equal(evidence.text, PUBLIC_CONSTITUTION_UNITS["PC-EVID-02"].text);
  assert.equal(evidence.lang, "en");
  assert.equal(fallback.scenes.find((scene) => scene.id === "evidence").title.text, PUBLIC_CONSTITUTION_LABELS["LBL-SCENE-4"]);
  assert.equal(fallback.scenes.find((scene) => scene.id === "evidence").title.lang, "en");
  assert.equal(privacy.text.length > 0, true);
  assert.equal(fallback.contentLang, "de");
  const kept = rendered.find((unit) => unit.id === "PC-OPEN-01");
  assert.equal(kept.text, PUBLIC_CONSTITUTION_DE_UNITS["PC-OPEN-01"].text);
  assert.equal(kept.lang, "de");
});
