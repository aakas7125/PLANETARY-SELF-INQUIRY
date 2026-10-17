// Control/candidate parity: both render describeLifecycleGuide() output from the same accepted module.
import assert from "node:assert/strict";
import { describeLifecycleGuide } from "../../app/src/lib/smartphone/lifecycle-presentation.mjs";
import { launchBrowser, startServer } from "./harness-server.mjs";

const guide = describeLifecycleGuide();
const EXPECTED_IDS = [
  "raw-materials",
  "refining-processing",
  "components",
  "assembly",
  "distribution-transport",
  "use-repair",
  "resale-refurbishment-second-life",
  "end-of-life",
];
const EXPECTED_PREVIEW_COUNTS = [0, 0, 0, 0, 3, 5, 1, 0];

assert.deepEqual(guide.stages.map((s) => s.id), EXPECTED_IDS);

const { server, origin } = await startServer();
const browser = await launchBrowser();

async function collect(variant, openAll) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(`${origin}/${variant}.html`);
  await page.waitForSelector("section[aria-label] ol[aria-label='Lifecycle stages'] li");
  const data = await page.evaluate((openAllFlag) => {
    const section = document.querySelector("section[aria-label]");
    section.querySelectorAll("ol[aria-label='Lifecycle stages'] details").forEach((d) => (d.open = openAllFlag));
    const rows = [];
    const skip = (el) => el.closest("[data-group-label],[data-harness-banner]");
    for (const el of section.querySelectorAll("*")) {
      if (skip(el)) continue;
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).filter(Boolean).join(" ");
      if (own) rows.push({ tag: el.tagName, text: own, visible: el.checkVisibility() });
    }
    const ol = section.querySelector("ol[aria-label='Lifecycle stages']");
    const lis = [...ol.children];
    return {
      rows,
      liCount: lis.length,
      stageIds: lis.map((li) => li.querySelector("[id^='lifecycle-panel-']").id.replace("lifecycle-panel-", "")),
      links: [...section.querySelectorAll("a")].map((a) => [a.getAttribute("href"), a.textContent.trim(), a.getAttribute("aria-label"), a.target, a.rel]),
      svgPaths: lis.map((li) => [...li.querySelectorAll("summary svg")].map((s) => s.innerHTML)),
      headings: [...section.querySelectorAll("h2,h3,h4,h5")].filter((h) => !h.closest("[data-group-label]")).map((h) => [h.tagName, h.textContent.trim()]),
      previewVisibleCounts: lis.map((li) => {
        const spans = li.querySelectorAll("summary > span.space-y-2 > span");
        return [...spans].filter((s) => s.checkVisibility()).length;
      }),
      detailsOpen: lis.map((li) => li.querySelector("details").open),
      orderedLandmarks: [...section.querySelectorAll("h2, article > h3, details > summary, ol > li")].length,
      headingId: section.querySelector("h2").id,
      summariesFocusable: [...ol.querySelectorAll("summary")].length,
    };
  }, openAll);
  await page.close();
  return { ...data, errors };
}

const results = {};
for (const openAll of [false, true]) {
  const control = await collect("control", openAll);
  const candidate = await collect("candidate", openAll);
  const label = openAll ? "open" : "collapsed";
  assert.deepEqual(control.errors, [], `control console/page errors (${label})`);
  assert.deepEqual(candidate.errors, [], `candidate console/page errors (${label})`);
  assert.deepEqual(candidate.rows, control.rows, `text rows with visibility (${label})`);
  assert.deepEqual(candidate.links, control.links, `links (${label})`);
  assert.deepEqual(candidate.svgPaths, control.svgPaths, `stage glyph SVG parity (${label})`);
  assert.deepEqual(candidate.headings, control.headings, `heading outline (${label})`);
  assert.deepEqual(candidate.stageIds, EXPECTED_IDS, `candidate stage ids/order (${label})`);
  assert.deepEqual(control.stageIds, EXPECTED_IDS, `control stage ids/order (${label})`);
  assert.equal(candidate.liCount, 8);
  assert.equal(candidate.headingId, control.headingId);
  if (!openAll) {
    assert.deepEqual(control.previewVisibleCounts, EXPECTED_PREVIEW_COUNTS, "control collapsed preview counts");
    assert.deepEqual(candidate.previewVisibleCounts, EXPECTED_PREVIEW_COUNTS, "candidate collapsed preview counts");
  } else {
    assert.deepEqual(candidate.previewVisibleCounts, [0, 0, 0, 0, 0, 0, 0, 0], "previews hide when open");
  }
  results[label] = { control, candidate };
}

const openText = results.open.candidate.rows.map((r) => r.text);
const joined = openText.join("\n");
const mustContain = [
  guide.sectionLabel,
  guide.roleNote,
  guide.banner,
  guide.inquiryBoundary,
  guide.production.heading,
  ...guide.production.lines,
  guide.production.disclosureSummary,
  ...guide.production.disclosureLines,
];
for (const stage of guide.stages) {
  mustContain.push(stage.label, stage.generallyHeading, stage.generally, stage.thisPhoneHeading, ...stage.thisPhoneLines, stage.sourcesHeading, ...stage.sourceLines);
  if (stage.widerContext) {
    mustContain.push(stage.widerContext.heading);
    for (const r of stage.widerContext.records) mustContain.push(r.label, r.scopeLabel, r.fact, r.limit, r.linkLabel);
  }
  if (stage.explore) {
    mustContain.push(stage.explore.heading, stage.explore.note);
    for (const l of stage.explore.links) mustContain.push(l.label, l.provenance);
  }
}
for (const text of mustContain) assert.ok(openText.includes(text), `candidate lacks exact line: ${text}`);

const candidateHrefs = results.open.candidate.links.map((l) => l[0]);
for (const stage of guide.stages) {
  for (const l of stage.explore?.links ?? []) assert.ok(candidateHrefs.includes(l.href), `missing href ${l.href}`);
  for (const r of stage.widerContext?.records ?? []) assert.ok(candidateHrefs.includes(r.href), `missing href ${r.href}`);
}

const literal = (re, msg) => assert.match(joined, re, msg);
literal(/Generic new production is 25–70 kg CO₂e\/device \(GWP100\)\./, "production whole-group range");
literal(/2–4 kg CO₂e/, "distribution fallback range");
literal(/4 kWh\/year/, "charging central energy");
literal(/2–8 kWh\/year/, "charging sensitivity");
literal(/7\.61/, "ADEME reference");
literal(/2 years?|2-year|two-year/i, "ADEME 2-year reference");
literal(/Global · 2022 · annual mass flow/, "global context scope");

const production = guide.production.lines.join(" ");
assert.match(production, /25–70/);
for (const id of ["raw-materials", "refining-processing", "components", "assembly"]) {
  const stage = guide.stages.find((s) => s.id === id);
  assert.doesNotMatch([stage.generally, ...stage.sourceLines].filter((l) => /kg CO₂e/.test(l)).join(" "), /25–70/, `${id} must not carry its own production share`);
}

await browser.close();
server.close();
console.log(
  JSON.stringify({
    parity: "PASS",
    stageIds: EXPECTED_IDS,
    collapsedPreviewCounts: results.collapsed.candidate.previewVisibleCounts,
    textRowsCollapsed: results.collapsed.candidate.rows.length,
    textRowsOpen: results.open.candidate.rows.length,
    linksOpen: results.open.candidate.links.length,
    exactLinesAsserted: mustContain.length,
  }),
);
