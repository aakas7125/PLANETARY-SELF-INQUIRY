/**
 * Rendered probe for the smartphone R2 navigation/focus mechanics
 * (HQ-CURSOR-2026-10-17-063). Drives an already-built public profile.
 *
 * It measures and, in EXPECT=candidate mode, asserts presentation mechanics
 * only: helper association, focus after Situation "Edit answers", and
 * controlled stage/question arrival. It decides no scientific, AP, calculator
 * or product semantics and reads no case identifiers as domain input.
 *
 *   PREVIEW_URL=http://127.0.0.1:8081 EXPECT=candidate \
 *     node scripts/r2-navigation-probe.mjs [outfile.json]
 *
 * EXPECT=baseline only records. Viewport emulation is not browser-native zoom.
 */
import { existsSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const base = (process.env.PREVIEW_URL ?? "http://127.0.0.1:8081").replace(/\/$/, "");
const expectCandidate = process.env.EXPECT === "candidate";
const shotDir = process.env.QA_SCREENSHOT_DIR;
const outFile = process.argv[2];
const NOT_SURE = "I\u2019m not sure";
const VIEWPORTS = [
  { label: "390", width: 390, height: 844 },
  { label: "1280", width: 1280, height: 800 },
  { label: "320", width: 320, height: 640 },
  { label: "640-200pct-equivalent", width: 640, height: 400 },
];
const MOTIONS = ["no-preference", "reduce"];
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function chromePath() {
  return [process.env.CHROME_PATH, chromium.executablePath(), "/opt/google/chrome/chrome"].find(
    (candidate) => typeof candidate === "string" && candidate && existsSync(candidate),
  );
}

async function installTracker(page) {
  await page.evaluate(() => {
    window.__track = () => {
      const start = performance.now();
      const samples = [];
      let lastChange = 0;
      let lastY = window.scrollY;
      return new Promise((resolve) => {
        const tick = () => {
          const t = performance.now() - start;
          if (window.scrollY !== lastY) {
            lastY = window.scrollY;
            lastChange = t;
            samples.push([Math.round(t), Math.round(lastY)]);
          }
          if (t < 2200) requestAnimationFrame(tick);
          else resolve({ settledMs: Math.round(lastChange), samples: samples.length, finalY: Math.round(lastY) });
        };
        requestAnimationFrame(tick);
      });
    };
  });
}

async function describeActive(page) {
  return page.evaluate(() => {
    const el = document.activeElement;
    const header = document.querySelector("header");
    const headerBottom = header ? Math.round(header.getBoundingClientRect().bottom) : 0;
    if (!el || el === document.body) return { tag: "BODY", headerBottom };
    const rect = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      role: el.getAttribute("role") ?? el.getAttribute("type"),
      text: (el.innerText || el.getAttribute("aria-label") || "").trim().slice(0, 60),
      top: Math.round(rect.top),
      headerBottom,
      belowHeader: rect.top >= headerBottom - 1,
      inViewport: rect.top >= 0 && rect.bottom <= window.innerHeight,
    };
  });
}

async function settle(page) {
  await page.evaluate(
    () =>
      new Promise((resolve) => {
        let last = window.scrollY;
        let stableSince = performance.now();
        const tick = () => {
          if (window.scrollY !== last) {
            last = window.scrollY;
            stableSince = performance.now();
          }
          if (performance.now() - stableSince > 400) resolve();
          else requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
  );
}

async function toBottom(page) {
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" }));
  await page.waitForTimeout(100);
}

async function arrival(page, label, action) {
  await toBottom(page);
  const docHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const startY = await page.evaluate(() => Math.round(window.scrollY));
  const tracked = page.evaluate(() => window.__track());
  await action();
  const motion = await tracked;
  const active = await describeActive(page);
  return { label, docHeight, startY, ...motion, active };
}

async function snapshot(page) {
  return page.evaluate(() => {
    const radios = [...document.querySelectorAll("input[type=radio]")]
      .filter((el) => el.checked)
      .map((el) => `${el.name}=${el.value}`);
    const boxes = [...document.querySelectorAll("input[type=checkbox]")]
      .filter((el) => el.checked)
      .map((el) => el.name + ":" + (el.closest("label")?.innerText ?? "").trim().slice(0, 40));
    const texts = [...document.querySelectorAll("textarea, input[type=text], input:not([type])")].map(
      (el) => `${el.id || el.name}=${el.value}`,
    );
    const h1 = document.querySelector("h1")?.innerText ?? null;
    const stages = [...document.querySelectorAll('nav[aria-label="Smartphone inquiry stages"] li')].map((li) =>
      li.innerText.replace(/\s+/g, " ").trim(),
    );
    const buttons = [...document.querySelectorAll("main button")].map((b) => b.innerText.trim()).filter(Boolean);
    return { h1, radios, boxes, texts, stages, buttons };
  });
}

async function clickExact(page, name) {
  await page.getByRole("button", { name, exact: true }).click();
}

async function answerSituation(page, answers = ["Yes", "No", "Not sure"]) {
  const questions = [
    "Is your current phone safe to keep using?",
    "Does it adequately perform the functions you actually need?",
    "Is its software and security support adequate for the way you need to use it?",
  ];
  for (const [index, question] of questions.entries()) {
    await page.getByRole("group", { name: question }).getByRole("radio", { name: answers[index], exact: true }).check();
  }
}

async function enterComparison(page) {
  const answers = ["a1", NOT_SURE, "  a3  ", "a4", "a5", "a6"];
  for (const [index, answer] of answers.entries()) {
    await page.getByText(`Question ${index + 1} of 6`).waitFor();
    if (index === 1) await clickExact(page, NOT_SURE);
    else await page.locator("#inquiry-answer").fill(answer);
    if (index === 5) {
      await page.getByRole("radio", { name: "Consider a used or refurbished phone", exact: true }).check();
      await page.getByRole("group", { name: "Whether it looks different" }).getByRole("radio", { name: "Unchanged", exact: true }).check();
    }
    await clickExact(page, "Continue");
  }
  await clickExact(page, "Continue to empirical comparison");
  await page.getByRole("heading", { level: 1, name: "Empirical comparison" }).waitFor();
}

async function helperEvidence(page) {
  const input = page.locator("#comparison-horizon");
  const evidence = await input.evaluate((el) => {
    const id = el.getAttribute("aria-describedby");
    const target = id ? document.getElementById(id) : null;
    return {
      describedBy: id,
      idCount: id ? document.querySelectorAll(`[id="${id}"]`).length : 0,
      helperText: target?.innerText ?? null,
      value: el.value,
      invalid: el.getAttribute("aria-invalid"),
    };
  });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("DOM.enable");
  await cdp.send("Accessibility.enable");
  const { root } = await cdp.send("DOM.getDocument");
  const { nodeId } = await cdp.send("DOM.querySelector", { nodeId: root.nodeId, selector: "#comparison-horizon" });
  const { nodes } = await cdp.send("Accessibility.getPartialAXTree", { nodeId, fetchRelatives: false });
  const ax = nodes[0];
  await cdp.detach();
  return {
    ...evidence,
    axName: ax?.name?.value ?? null,
    axDescription: ax?.description?.value ?? null,
  };
}

async function runViewport(browser, viewport, motion) {
  const tag = `${viewport.label}/${motion}`;
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: motion,
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(`pageerror: ${error}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  const result = { arrivals: [], errors };
  await page.goto(`${base}/smartphone`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: "The phone you already have" }).waitFor();
  await installTracker(page);
  result.htmlScrollBehavior = await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);

  await answerSituation(page);
  const submit = page.getByRole("button", { name: "See situation status", exact: true });
  result.arrivals.push(await arrival(page, "situation submit -> result", () => submit.click()));
  await page.getByRole("region", { name: "Situation status" }).waitFor();

  result.arrivals.push(
    await arrival(page, "Continue to inquiry (forward stage)", () => clickExact(page, "Continue to inquiry")),
  );
  await page.locator("#inquiry-answer").waitFor();
  if (shotDir && motion === "no-preference" && (viewport.label === "390" || viewport.label === "1280")) {
    await page.screenshot({ path: `${shotDir}/${viewport.label}-stage-arrival-inquiry.png` });
  }
  await page.locator("#inquiry-answer").fill("first answer");
  result.arrivals.push(await arrival(page, "AP next question (Q1 -> Q2)", () => clickExact(page, "Continue")));
  await page.getByText("Question 2 of 6").waitFor();
  result.arrivals.push(await arrival(page, "AP previous question (Q2 -> Q1)", () => clickExact(page, "Back")));
  await page.getByText("Question 1 of 6").waitFor();
  result.arrivals.push(
    await arrival(page, "Back to situation (Q1 Back)", () => clickExact(page, "Back")),
  );
  await page.getByRole("button", { name: "Edit answers", exact: true }).waitFor();

  result.situationBeforeEdit = await snapshot(page);
  const editButton = page.getByRole("button", { name: "Edit answers", exact: true });
  await editButton.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "See situation status", exact: true }).waitFor();
  await settle(page);
  result.keyboardEdit = { active: await describeActive(page), state: await snapshot(page) };
  if (shotDir && motion === "no-preference" && (viewport.label === "390" || viewport.label === "1280")) {
    await page.screenshot({ path: `${shotDir}/${viewport.label}-after-edit-focus.png` });
  }
  await page.keyboard.press("Tab");
  await settle(page);
  result.keyboardEdit.nextTab = await describeActive(page);
  await page.keyboard.press("Shift+Tab");
  result.keyboardEdit.shiftTab = await describeActive(page);

  const functionsGroup = page.getByRole("group", { name: "Does it adequately perform the functions you actually need?" });
  try {
    await functionsGroup.getByRole("radio", { name: "Yes", exact: true }).check({ timeout: 5000 });
    result.afterAnswerChange = await describeActive(page);
    await functionsGroup.getByRole("radio", { name: "No", exact: true }).check({ timeout: 5000 });
  } catch (error) {
    result.answerChangeError = String(error.message).split("\n")[0];
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await functionsGroup.getByRole("radio", { name: "No", exact: true }).check();
    result.afterAnswerChange = await describeActive(page);
  }

  await submit.click();
  await page.getByRole("button", { name: "Edit answers", exact: true }).waitFor();
  await settle(page);
  await page.getByRole("button", { name: "Edit answers", exact: true }).click();
  await settle(page);
  result.mouseEdit = { active: await describeActive(page), state: await snapshot(page) };

  await answerSituation(page);
  await submit.click();
  await clickExact(page, "Continue to inquiry");
  result.inquiryAfterEdit = await page.locator("#inquiry-answer").inputValue();
  await enterComparison(page);
  await page.waitForTimeout(300);
  result.comparisonArrivalActive = await describeActive(page);
  for (const name of ["Keep the current phone", "Buy a used/second-hand phone", "Buy a refurbished phone"]) {
    await page.getByRole("checkbox", { name, exact: true }).check();
  }
  await page.locator("#comparison-horizon").fill("4");
  result.helper = await helperEvidence(page);
  await page.locator("#comparison-horizon").fill("abc");
  result.helperInvalid = await helperEvidence(page);
  await page.locator("#comparison-horizon").fill("4");
  result.comparisonState = await snapshot(page);
  if (motion === "no-preference" && shotDir && (viewport.label === "390" || viewport.label === "1280")) {
    await page.locator("#comparison-horizon").focus();
    await page.screenshot({ path: `${shotDir}/${viewport.label}-comparison-helper.png` });
  }

  const anchors = {};
  const explore = page.locator('main a[href^="#"]').first();
  anchors.firstHref = await explore.getAttribute("href");
  await explore.click();
  await page.waitForTimeout(1500);
  anchors.afterExplore = { hash: await page.evaluate(() => location.hash), y: await page.evaluate(() => Math.round(scrollY)) };
  await page.locator('main a[href^="#"]').last().click();
  await page.waitForTimeout(1500);
  anchors.afterReturn = { hash: await page.evaluate(() => location.hash), y: await page.evaluate(() => Math.round(scrollY)) };
  result.anchors = anchors;

  await toBottom(page);
  await clickExact(page, "Back to inquiry");
  await page.getByText("Question 6 of 6").waitFor().catch(() => {});
  result.afterBackToInquiry = await snapshot(page);
  await clickExact(page, "Continue").catch(() => {});
  await clickExact(page, "Continue to empirical comparison").catch(() => {});
  await page.getByRole("heading", { level: 1, name: "Empirical comparison" }).waitFor();
  result.afterReturnToComparison = await snapshot(page);
  await clickExact(page, "Back to inquiry");
  for (let i = 0; i < 9; i += 1) {
    if (await page.getByRole("button", { name: "Edit answers", exact: true }).count()) break;
    await clickExact(page, "Back");
  }
  await settle(page);
  await page.getByRole("button", { name: "Edit answers", exact: true }).click();
  await settle(page);
  result.downstreamEdit = { active: await describeActive(page), state: await snapshot(page) };
  await page.getByRole("button", { name: "See situation status", exact: true }).click();
  await clickExact(page, "Continue to inquiry");
  result.downstreamInquiryAnswer = await page.locator("#inquiry-answer").inputValue();
  await enterComparison(page);
  result.comparisonAfterSituationEdit = await snapshot(page);
  await clickExact(page, "Reset comparison");
  result.afterResetComparison = await snapshot(page);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  const ordinary = page.evaluate(() => window.__track());
  await page.evaluate(() => window.scrollTo({ top: 1500 }));
  result.ordinaryScroll = await ordinary;

  result.overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await context.close();

  if (expectCandidate) {
    const ids = `[${tag}]`;
    check(result.helper.describedBy === "comparison-horizon-helper", `${ids} helper not associated`);
    check(result.helper.idCount === 1, `${ids} helper id not unique`);
    check(result.helper.axDescription && result.helper.axDescription === result.helper.helperText?.trim(), `${ids} helper not in accessibility description`);
    check(result.helperInvalid.invalid === "true", `${ids} invalid state lost`);
    check(result.keyboardEdit.active.tag !== "BODY", `${ids} keyboard Edit lost focus to BODY`);
    check(result.mouseEdit.active.tag !== "BODY", `${ids} mouse Edit lost focus to BODY`);
    check(result.keyboardEdit.active.belowHeader, `${ids} keyboard Edit target under sticky header`);
    check(result.afterAnswerChange.tag === "INPUT", `${ids} ordinary answer change moved focus`);
    for (const a of result.arrivals) {
      check(a.settledMs < 200, `${ids} ${a.label} animated for ${a.settledMs}ms`);
      if (!a.label.startsWith("Back to situation")) check(a.active.tag !== "BODY", `${ids} ${a.label} focus on BODY`);
    }
    check(result.anchors.afterExplore.hash === `${anchors.firstHref}`, `${ids} explore anchor changed`);
    check(result.inquiryAfterEdit === "" && result.downstreamInquiryAnswer === "", `${ids} inquiry answer survived situation edit`);
    check(result.comparisonAfterSituationEdit.texts.every((t) => !t.startsWith("comparison-horizon=") || t === "comparison-horizon="), `${ids} comparison horizon survived situation edit`);
    check(result.downstreamEdit.active.tag !== "BODY", `${ids} downstream edit lost focus`);
    check(result.comparisonArrivalActive.tag === "H1", `${ids} comparison arrival not on H1`);
  }
  return [tag, result];
}

const browser = await chromium.launch({ executablePath: chromePath(), headless: true });
const output = { base, expect: expectCandidate ? "candidate" : "baseline", runs: {} };
const combos = VIEWPORTS.flatMap((viewport) => MOTIONS.map((motion) => [viewport, motion]));
for (const [tag, result] of await Promise.all(combos.map(([v, m]) => runViewport(browser, v, m)))) {
  output.runs[tag] = result;
}
await browser.close();
output.failures = failures;
const json = JSON.stringify(output, null, 2);
if (outFile) writeFileSync(outFile, json);
else console.log(json);
for (const [tag, run] of Object.entries(output.runs)) {
  console.error(tag, "overflow", run.overflow, "errors", run.errors.length);
}
if (failures.length > 0) {
  console.error(failures.join("\n"));
  process.exit(1);
}
