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
    await page.close();
  }
}

async function frame(variant, vp, name, { stage = "components", grayscale = false, scrollTo = "ol" } = {}) {
  if (!framesDir) return;
  const { page } = await open(variant, vp);
  if (grayscale) await page.addStyleTag({ content: "html{filter:grayscale(1)}" });
  if (stage) await page.evaluate((id) => document.querySelector(`#lifecycle-panel-${id}`).closest("details").setAttribute("open", ""), stage);
  await page.evaluate((target) => {
    const el = target === "ol" ? document.querySelector("ol[aria-label='Lifecycle stages']") : document.querySelector(target);
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 24);
  }, scrollTo);
  await page.waitForTimeout(150);
  const path = join(framesDir, `INITIAL-1-${name}.png`);
  await page.screenshot({ path });
  report.frames.push(path);
  await page.close();
}

const tall = (w) => ({ name: String(w), width: w, height: 1400 });
await frame("control", tall(390), "control-390-components-open");
await frame("candidate", tall(390), "candidate-390-components-open");
await frame("control", { name: "1280", width: 1280, height: 1300 }, "control-1280-components-open");
await frame("candidate", { name: "1280", width: 1280, height: 1300 }, "candidate-1280-components-open");
await frame("candidate", tall(390), "candidate-390-later-stages-collapsed", { stage: null, scrollTo: "[data-stage-id='distribution-transport']" });
await frame("candidate", tall(320), "candidate-320-grayscale-components-open", { grayscale: true });

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
        stage: a.closest("li[data-stage-id], ol > li") ? [...a.closest("ol").children].indexOf(a.closest("ol > li")) + 1 : null,
      };
    });
  await page.keyboard.press("Tab");
  trail.push(await describe());
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    trail.push(await describe());
  }
  const summaries = trail.filter((t) => t.tag === "SUMMARY");
  assert.equal(summaries.length, 9, `${variant}: production + 8 stage summaries reachable by Tab in order`);
  assert.ok(trail.every((t) => t.ring), `${variant}: visible focus indicator on every stop ` + JSON.stringify(trail));
  assert.ok(trail.every((t) => t.inViewportX), `${variant}: focused element horizontally inside viewport`);
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
