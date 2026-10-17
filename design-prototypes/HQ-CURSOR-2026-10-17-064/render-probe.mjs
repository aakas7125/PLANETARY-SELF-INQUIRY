// Rendered control-vs-candidate probe. Usage: node render-probe.mjs [--frames <dir>]
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { launchBrowser, startServer } from "./harness-server.mjs";

const framesIdx = process.argv.indexOf("--frames");
const framesDir = framesIdx > 0 ? process.argv[framesIdx + 1] : null;
if (framesDir) mkdirSync(framesDir, { recursive: true });

const { server, origin } = await startServer();
const browser = await launchBrowser();
const report = { measurements: [], keyboard: {}, frames: [], anchor: {} };

const VIEWPORTS = [
  { name: "390", width: 390, height: 900 },
  { name: "1280", width: 1280, height: 900 },
  { name: "320", width: 320, height: 800 },
  { name: "640-as-200pct-of-1280", width: 640, height: 450 },
];

async function open(variant, vp) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(`${origin}/${variant}.html`);
  await page.waitForSelector("ol[aria-label='Lifecycle stages'] li");
  return { page, errors };
}

// A single-word stage label that wraps onto a second line has been split mid-word.
const labelLines = (page) =>
  page.evaluate(() => {
    const out = { checked: 0, broken: [] };
    const ol = document.querySelector("ol[aria-label='Lifecycle stages']");
    for (const li of ol.children) {
      const labelEl = li.querySelector("summary .text-base");
      const text = labelEl.textContent.trim();
      const lineHeight = parseFloat(getComputedStyle(labelEl).lineHeight);
      const range = document.createRange();
      range.selectNodeContents(labelEl);
      const lines = new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size;
      out.checked += 1;
      if (!/\s/.test(text) && lines > 1) out.broken.push({ text, lines, lineHeight });
    }
    return out;
  });

const metrics = (page) =>
  page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const section = document.querySelector("section[aria-label]");
    const ol = section.querySelector("ol[aria-label='Lifecycle stages']");
    const clipped = [...section.querySelectorAll("*")]
      .filter((el) => el.checkVisibility())
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.right > vw + 0.5 || r.left < -0.5);
      }).length;
    return {
      docScrollWidth: document.documentElement.scrollWidth,
      viewportWidth: vw,
      horizontalOverflowPx: Math.max(0, document.documentElement.scrollWidth - vw),
      elementsOutsideViewport: clipped,
      pageHeight: document.documentElement.scrollHeight,
      railHeight: Math.round(ol.getBoundingClientRect().height),
    };
  });

for (const vp of VIEWPORTS) {
  for (const variant of ["control", "candidate"]) {
    const { page, errors } = await open(variant, vp);
    const closed = await metrics(page);
    await page.evaluate(() => document.querySelector("#lifecycle-panel-components").closest("details").setAttribute("open", ""));
    const oneOpen = await metrics(page);
    await page.evaluate(() => document.querySelectorAll("ol[aria-label='Lifecycle stages'] details").forEach((d) => (d.open = true)));
    const allOpen = await metrics(page);
    report.measurements.push({ viewport: vp.name, variant, closed, oneOpen, allOpen, errors });
    assert.deepEqual(errors, [], `${variant}@${vp.name} errors`);
    report.measurements.at(-1).labelLines = await labelLines(page);
    await page.close();
  }
}

const MEASURED_STATES = ["closed", "oneOpen", "allOpen"];
for (const vp of VIEWPORTS) {
  const control = report.measurements.find((m) => m.viewport === vp.name && m.variant === "control");
  const candidate = report.measurements.find((m) => m.viewport === vp.name && m.variant === "candidate");
  for (const state of MEASURED_STATES) {
    const c = control[state];
    const k = candidate[state];
    assert.ok(
      k.horizontalOverflowPx <= c.horizontalOverflowPx,
      `candidate@${vp.name}/${state}: horizontal overflow ${k.horizontalOverflowPx}px exceeds control ${c.horizontalOverflowPx}px`,
    );
    assert.ok(
      k.elementsOutsideViewport <= c.elementsOutsideViewport,
      `candidate@${vp.name}/${state}: ${k.elementsOutsideViewport} clipped elements exceeds control ${c.elementsOutsideViewport}`,
    );
  }
  assert.deepEqual(candidate.labelLines.broken, [], `candidate@${vp.name}: stage labels broken mid-word`);
}

async function frame(variant, vp, name, { stage = "components", grayscale = false, scrollTo = "ol", offset = 24 } = {}) {
  if (!framesDir) return;
  const { page } = await open(variant, vp);
  if (grayscale) await page.addStyleTag({ content: "html{filter:grayscale(1)}" });
  if (stage) await page.evaluate((id) => document.querySelector(`#lifecycle-panel-${id}`).closest("details").setAttribute("open", ""), stage);
  await page.evaluate(({ target, offset }) => {
    const el = target === "ol" ? document.querySelector("ol[aria-label='Lifecycle stages']") : document.querySelector(target);
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - offset);
  }, { target: scrollTo, offset });
  await page.waitForTimeout(150);
  const path = join(framesDir, `CORRECTION-1-${name}.png`);
  await page.screenshot({ path });
  report.frames.push(path);
  await page.close();
}

const tall = (w, h = 1400) => ({ name: String(w), width: w, height: h });
await frame("control", tall(320, 1100), "control-320-grayscale-components-open", { grayscale: true });
await frame("candidate", tall(320, 1100), "candidate-320-grayscale-components-open", { grayscale: true });
await frame("candidate", tall(390), "candidate-390-production-context-components-open", { stage: "components", scrollTo: "article[aria-label]", offset: 16 });
await frame("candidate", tall(390), "candidate-390-later-stages-unconnected", { stage: null, scrollTo: "[data-stage-id='use-repair']", offset: 360 });
await frame("candidate", { name: "1280", width: 1280, height: 1300 }, "candidate-1280-production-context-components-open", { stage: "components", scrollTo: "article[aria-label]", offset: 16 });

const railStructure = {};
for (const variant of ["candidate"]) {
  const { page } = await open(variant, { width: 390, height: 900 });
  railStructure[variant] = await page.evaluate(() => {
    const items = [...document.querySelector("ol[aria-label='Lifecycle stages']").children];
    return items.map((li) => ({
      id: li.dataset.stageId,
      line: !!li.querySelector("[data-rail-line]"),
      node: !!li.querySelector("[data-rail-node]"),
      bracket: !!li.querySelector("[data-group-bracket]"),
    }));
  });
  await page.close();
}
report.railStructure = railStructure;
assert.deepEqual(
  railStructure.candidate.map((s) => s.line),
  [true, true, true, true, false, false, false, false],
  "connecting rail lines exist only for stages 1-4",
);
assert.ok(railStructure.candidate.every((s) => s.node), "every stage keeps a decorative node");
assert.deepEqual(
  railStructure.candidate.map((s) => s.bracket),
  [true, true, true, true, false, false, false, false],
  "group bracket only on stages 1-4",
);

for (const variant of ["control", "candidate"]) {
  const { page } = await open(variant, { width: 390, height: 900 });
  const trail = [];
  const describe = () =>
    page.evaluate(() => {
      const a = document.activeElement;
      const cs = getComputedStyle(a);
      const r = a.getBoundingClientRect();
      return {
        tag: a.tagName,
        text: (a.getAttribute("aria-label") ?? a.textContent).trim().replace(/\s+/g, " ").slice(0, 48),
        ring: cs.boxShadow !== "none" || (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0),
        inViewportX: r.left >= 0 && r.right <= document.documentElement.clientWidth,
        inViewportY: r.top >= 0 && r.bottom <= window.innerHeight,
        stage: a.closest("li[data-stage-id], ol > li") ? [...a.closest("ol").children].indexOf(a.closest("ol > li")) + 1 : null,
      };
    });
  await page.keyboard.press("Tab");
  await page.waitForTimeout(400);
  trail.push(await describe());
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(400);
    trail.push(await describe());
  }
  const summaries = trail.filter((t) => t.tag === "SUMMARY");
  assert.equal(summaries.length, 9, `${variant}: production + 8 stage summaries reachable by Tab in order`);
  assert.ok(trail.every((t) => t.ring), `${variant}: visible focus indicator on every stop ` + JSON.stringify(trail));
  assert.ok(trail.every((t) => t.inViewportX), `${variant}: focused element horizontally inside viewport`);
  assert.ok(trail.every((t) => t.inViewportY), `${variant}: focused element vertically inside viewport after scroll settles ` + JSON.stringify(trail));
  const stageOrder = trail.map((t) => t.stage).filter((s) => s !== null);
  assert.deepEqual(stageOrder, [1, 2, 3, 4, 5, 6, 7, 8], `${variant}: Tab order follows stages 1-8`);

  await page.keyboard.press("Shift+Tab");
  await page.keyboard.press("Shift+Tab");
  const back = await describe();
  assert.equal(back.stage, 6, `${variant}: Shift+Tab moves back`);
  await page.keyboard.press("Enter");
  const openAfterEnter = await page.evaluate(() => document.activeElement.closest("details").open);
  await page.keyboard.press("Space");
  const openAfterSpace = await page.evaluate(() => document.activeElement.closest("details").open);
  assert.equal(openAfterEnter, true, `${variant}: Enter opens`);
  assert.equal(openAfterSpace, false, `${variant}: Space closes`);

  await page.keyboard.press("Enter");
  const innerTab = [];
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press("Tab");
    innerTab.push(await describe());
  }
  report.keyboard[variant] = { tabTrail: trail.map((t) => `${t.tag}:${t.stage ?? "-"}:${t.text}`), enterOpens: openAfterEnter, spaceCloses: !openAfterSpace, linksAfterOpeningStage6: innerTab.map((t) => `${t.tag}:${t.text}`) };
  await page.close();
}

for (const variant of ["control", "candidate"]) {
  const { page } = await open(variant, { width: 390, height: 700 });
  await page.evaluate(() => (location.hash = "lifecycle-guide-heading"));
  await page.waitForTimeout(900);
  report.anchor[variant] = await page.evaluate(() => {
    const h = document.getElementById("lifecycle-guide-heading");
    const r = h.getBoundingClientRect();
    return { exists: !!h, tabindex: h.getAttribute("tabindex"), focused: document.activeElement === h, topPx: Math.round(r.top), inViewport: r.top >= 0 && r.bottom <= innerHeight };
  });
  await page.close();
}

await browser.close();
server.close();
console.log(JSON.stringify(report, null, 1));
