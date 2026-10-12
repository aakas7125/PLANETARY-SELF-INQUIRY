/**
 * Rendered local production-preview smoke for the integrated Protect Four
 * site and canonical smartphone journey.
 *
 * This harness does not decide scientific, AP, or calculator semantics.
 * It drives the already-built preview and checks the accepted visitor-facing
 * boundaries. It does not start hosting, change dependencies, or read
 * case identifiers as domain inputs.
 *
 * Usage, from app/, against a running `npm run preview`:
 *   node scripts/e2e-local-preview-smoke.mjs
 *
 * PREVIEW_URL defaults to http://127.0.0.1:8081
 * QA_SCREENSHOT_DIR defaults to /tmp/psi-qa-040
 */
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

function chromeExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    chromium.executablePath(),
    "/opt/google/chrome/chrome",
  ].filter((candidate) => typeof candidate === "string" && candidate.length > 0);
  return candidates.find((candidate) => existsSync(candidate));
}

const base = (process.env.PREVIEW_URL ?? "http://127.0.0.1:8081").replace(/\/$/, "");
const shotDir = process.env.QA_SCREENSHOT_DIR ?? "/tmp/psi-qa-040";
const NOT_SURE = "I\u2019m not sure";
const SPACED = "  spaced answer  ";

const FINAL_OPTIONS = [
  ["keep", "Keep the current phone"],
  ["repair", "Repair the current phone"],
  ["used_secondhand", "Buy a used/second-hand phone"],
  ["refurbished", "Buy a refurbished phone"],
  ["new", "Buy a new phone"],
  ["investigate_further", "Investigate further"],
  ["unclear", "Unclear"],
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function attachMonitors(page, bag) {
  page.on("pageerror", (error) => {
    bag.pageErrors.push(String(error));
  });
  page.on("console", (message) => {
    if (message.type() === "error") bag.consoleErrors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() < 400) return;
    bag.httpFailures.push({ status: response.status(), url: response.url() });
  });
  page.on("requestfailed", (request) => {
    bag.requestFailed.push({
      url: request.url(),
      error: request.failure()?.errorText ?? "",
    });
  });
}

function freshBag() {
  return { pageErrors: [], consoleErrors: [], httpFailures: [], requestFailed: [] };
}

async function shot(page, name) {
  await page.screenshot({ path: `${shotDir}/${name}.png`, fullPage: false });
}

async function assertNoOverflow(page, where) {
  const box = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  assert(
    box.scrollWidth <= box.clientWidth + 1,
    `${where} horizontal overflow ${box.scrollWidth} > ${box.clientWidth}`,
  );
  return box;
}

function ringVisible(style) {
  const shadow = style.boxShadow && style.boxShadow !== "none";
  const outline =
    style.outlineStyle && style.outlineStyle !== "none" && style.outlineWidth !== "0px";
  return Boolean(shadow || outline);
}

async function keyboardFocus(page, locator) {
  await locator.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  const focused = await page.evaluate(() => document.activeElement === document.querySelector(":focus"));
  if (!focused) throw new Error("Keyboard focus did not land");
  const matches = await locator.evaluate((element) => element === document.activeElement);
  if (!matches) throw new Error("Keyboard focus did not return to the requested control");
  return page.evaluate(() => {
    const style = getComputedStyle(document.activeElement);
    return {
      outlineStyle: style.outlineStyle,
      outlineWidth: style.outlineWidth,
      boxShadow: style.boxShadow,
      animationName: style.animationName,
      animationDuration: style.animationDuration,
      transitionDuration: style.transitionDuration,
    };
  });
}

function tinyMotion(value) {
  return value.split(",").every((part) => {
    const duration = part.trim();
    return duration === "0.01ms" || duration === "1e-05s";
  });
}

async function clickExact(page, name) {
  await page.getByRole("button", { name, exact: true }).click();
}

async function checkedPresentChoice(page) {
  return page.locator('input[name="present-choice"]').evaluateAll((elements) =>
    elements.filter((element) => element.checked).map((element) => element.value),
  );
}

async function bodyText(page) {
  return page.locator("body").innerText();
}

async function unnamedControls(page) {
  return page.evaluate(() => {
    const controls = [...document.querySelectorAll("button, a, input, textarea, select")];
    return controls
      .filter((element) => {
        if (element instanceof HTMLInputElement && element.type === "hidden") return false;
        const labelledBy = element.getAttribute("aria-labelledby");
        const labelledText = labelledBy
          ? labelledBy
              .split(/\s+/)
              .map((id) => document.getElementById(id)?.textContent ?? "")
              .join(" ")
          : "";
        const wrapping = element.closest("label")?.innerText ?? "";
        const name =
          element.getAttribute("aria-label") ||
          element.innerText ||
          labelledText ||
          wrapping ||
          (element instanceof HTMLInputElement ? element.value : "");
        return !String(name).trim();
      })
      .map((element) => element.outerHTML.slice(0, 160));
  });
}

async function walkHome(page, label) {
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: /protect the whole planet/ }).waitFor();
  await shot(page, `${label}-home-top`);
  const bridge = page.locator("#phone-inquiry");
  await bridge.getByRole("heading", { name: "Follow one phone question through to your own choice" }).waitFor();
  const bridgeText = await bridge.innerText();
  assert(
    bridgeText.includes("situation, reflection, comparison, conditional") &&
      bridgeText.includes("otherness") &&
      bridgeText.includes("your own final choice"),
    "Phone-inquiry bridge does not describe the accepted inquiry path",
  );
  assert(bridgeText.includes("does not recommend a purchase"), "Bridge is missing the non-recommendation boundary");
  assert(bridgeText.includes("does not prove the Protect Four proposition"), "Bridge is missing the proposition boundary");
  assert(bridgeText.includes("not a complete life-cycle assessment"), "Bridge is missing the assessment boundary");
  for (const name of ["Ledger", "Dependencies", "Framework", "Papers", "Journey", "Phone inquiry"]) {
    await page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name, exact: true }).waitFor();
  }
  await page.getByRole("link", { name: "Framework", exact: true }).click();
  await page.waitForURL(/#framework$/);
  await page.locator("#framework").waitFor();
  const cta = page.getByRole("link", { name: "Begin the phone inquiry" });
  const style = await keyboardFocus(page, cta);
  assert(ringVisible(style), `Begin the phone inquiry has no visible focus ring: ${JSON.stringify(style)}`);
  assert(
    tinyMotion(style.animationDuration) && tinyMotion(style.transitionDuration),
    `Reduced motion is not in force on the call to action: ${JSON.stringify(style)}`,
  );
  await assertNoOverflow(page, `${label} home`);
  await shot(page, `${label}-home`);
  await page.keyboard.press("Enter");
  await page.waitForURL(/\/smartphone$/);
  await page.getByRole("heading", { level: 1, name: "The phone you already have" }).waitFor();
}

async function answerSituation(page, answers) {
  const questions = [
    "Is your current phone safe to keep using?",
    "Does it adequately perform the functions you actually need?",
    "Is its software and security support adequate for the way you need to use it?",
  ];
  for (const [index, question] of questions.entries()) {
    const group = page.getByRole("group", { name: question });
    await group.getByRole("radio", { name: answers[index], exact: true }).check();
  }
}

async function walkJourney(page, label) {
  await page.getByRole("heading", { level: 1, name: "The phone you already have" }).waitFor();
  const submit = page.getByRole("button", { name: "See situation status", exact: true });
  assert(await submit.isDisabled(), "Situation submit is enabled before every answer is explicit");
  const firstGroup = page.getByRole("group", { name: "Is your current phone safe to keep using?" });
  await firstGroup.getByRole("radio", { name: "Yes", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  assert(
    await firstGroup.getByRole("radio", { name: "No", exact: true }).isChecked(),
    "Arrow key did not move the situation radio group",
  );
  await answerSituation(page, ["Yes", "No", "Not sure"]);
  assert(!(await submit.isDisabled()), "Situation submit stays disabled after Yes, No, and Not sure");
  await submit.click();
  await page.getByRole("region", { name: "Situation status" }).waitFor();
  await clickExact(page, "Continue to inquiry");
  await page.getByRole("heading", { level: 1, name: "Inquiry" }).waitFor();
  await page.locator("#inquiry-answer").fill("temporary answer");
  await clickExact(page, "Back");
  await page.getByRole("heading", { level: 1, name: "The phone you already have" }).waitFor();
  await clickExact(page, "Edit answers");
  assert(
    (await page.getByRole("button", { name: "Continue to inquiry" }).count()) === 0,
    "Edit answers left the inquiry continuation in place",
  );
  await page.getByRole("button", { name: "See situation status", exact: true }).click();
  await clickExact(page, "Continue to inquiry");
  await page.locator("#inquiry-answer").waitFor();
  assert((await page.locator("#inquiry-answer").inputValue()) === "", "Editing the situation did not clear the inquiry answer");

  const answers = [
    "A sharper camera for work I already do.",
    null,
    SPACED,
    "The want would stay.",
    "Keeping it feels ordinary.",
    "It still looks like a practical limit.",
  ];
  for (const [index, answer] of answers.entries()) {
    await page.getByText(`Question ${index + 1} of 6`).waitFor();
    if (index === 1) {
      await clickExact(page, NOT_SURE);
      assert((await page.locator("#inquiry-answer").inputValue()) === NOT_SURE, "I’m not sure was not stored as the answer");
    } else {
      await page.locator("#inquiry-answer").fill(answer);
    }
    if (index === 5) {
      await page.getByRole("radio", { name: "Consider a used or refurbished phone", exact: true }).check();
      await page.getByRole("group", { name: "Whether it looks different" }).getByRole("radio", { name: "Unchanged", exact: true }).check();
      const choiceNote = await page.getByRole("group", { name: "Choice" }).innerText();
      assert(
        choiceNote.includes("Buying a new phone is an ordinary choice, not a failed inquiry."),
        "Inquiry choice note is missing the ordinary-choice boundary",
      );
      assert(!choiceNote.includes("consider_used_or_refurbished"), "Inquiry shows an internal choice token");
    }
    await clickExact(page, "Continue");
  }

  await page.getByRole("heading", { name: "Your answers" }).waitFor();
  const reviewFields = page.getByRole("region", { name: "Your answers" }).locator("textarea");
  assert((await reviewFields.nth(2).inputValue()) === SPACED, "Review did not preserve the spaced inquiry answer");
  assert((await reviewFields.nth(1).inputValue()) === NOT_SURE, "Review did not preserve I’m not sure");
  await clickExact(page, "Back");
  await page.getByText("Question 6 of 6").waitFor();
  assert((await page.locator("#inquiry-answer").inputValue()) === answers[5], "Back did not preserve the sixth answer");
  await clickExact(page, "Continue");
  await clickExact(page, "Continue to empirical comparison");

  await page.getByRole("heading", { level: 1, name: "Empirical comparison" }).waitFor();
  const pathwayBoxes = page.locator('input[name="comparison-pathway"]');
  assert((await pathwayBoxes.count()) === 5, "Comparison did not offer the five pathways");
  assert(
    (await pathwayBoxes.evaluateAll((elements) => elements.every((element) => !element.checked))),
    "A comparison pathway was preselected",
  );
  for (const name of ["Keep the current phone", "Buy a used/second-hand phone", "Buy a refurbished phone"]) {
    await page.getByRole("checkbox", { name, exact: true }).check();
  }
  await page.getByText("How many years of adequate service are expected for this used or second-hand candidate?").waitFor();
  await page.getByText("How many years of adequate service are expected for this refurbished candidate?").waitFor();
  assert((await page.locator("#post-repair-service").count()) === 0, "Repair facts appeared without a repair pathway");
  await page.locator("#comparison-horizon").fill("4");
  await page.getByRole("button", { name: "Not sure about remaining service without repair" }).click();
  const keepWhileUnsure = page.getByRole("article", { name: "Keep the current phone" });
  await keepWhileUnsure.waitFor();
  assert(
    (await keepWhileUnsure.innerText()).includes("was not replaced with zero or a default"),
    "Unsure remaining service was not kept unknown",
  );
  await page.locator("#remaining-service").fill("2.50");
  await page.locator("#used-candidate-service").fill("1.50");
  await page.locator("#refurbished-candidate-service").fill("3");
  assert((await page.locator("#comparison-horizon").inputValue()) === "4", "Horizon was not preserved as 4");
  assert((await page.locator("#remaining-service").inputValue()) === "2.50", "Remaining service was not preserved as 2.50");
  assert((await page.locator("#used-candidate-service").inputValue()) === "1.50", "Used service was not preserved as 1.50");
  assert((await page.locator("#refurbished-candidate-service").inputValue()) === "3", "Refurbished service was not preserved as 3");
  const horizonLine = await page.getByText("The same horizon is used for every selected pathway: 4.").innerText();
  assert(horizonLine.endsWith("4."), "Horizon statement did not keep the entered 4");
  assert(
    !(await keepWhileUnsure.innerText()).includes("not replaced with zero"),
    "A supplied remaining service was still described as replaced or withheld as zero",
  );
  await page.getByRole("article", { name: "Buy a used/second-hand phone" }).waitFor();
  await page.getByRole("article", { name: "Buy a refurbished phone" }).waitFor();
  const comparisonText = await bodyText(page);
  assert(!/winner|recommended purchase|you should buy/i.test(comparisonText), "Comparison presents a winner or purchase instruction");
  await assertNoOverflow(page, `${label} comparison`);
  await clickExact(page, "Continue to impact and dependency pathways");

  await page.getByRole("heading", { level: 1, name: "Impact and dependency pathways" }).waitFor();
  await page.getByText("Each stays unknown and is not treated as zero.").waitFor();
  const water = page.getByRole("article", { name: "Water" });
  await water.waitFor();
  assert(!(await water.innerText()).includes("This pathway is not shown."), "Water pathway was withheld");
  for (const heading of [
    "Climate",
    "Mining pressure and ecosystems",
    "Mining pressure and people",
    "E-waste and people",
    "E-waste and ecosystems",
  ]) {
    const article = page.getByRole("article", { name: heading });
    assert(
      (await article.innerText()).includes("Its condition is not established from the facts given, and that gap was not filled in."),
      `${heading} filled an unestablished condition`,
    );
  }
  const impactText = await bodyText(page);
  assert(!impactText.includes("condition_not_satisfied"), "Impact page shows an internal reason code");
  await assertNoOverflow(page, `${label} impact`);
  await water.scrollIntoViewIfNeeded();
  await shot(page, `${label}-impact`);
  await clickExact(page, "Continue to Protect Four and otherness inquiry");

  await page.getByRole("heading", { level: 1, name: "Protect Four and otherness inquiry" }).waitFor();
  const othernessText = await bodyText(page);
  assert(
    othernessText.includes("That is not a finding that those effects are absent") &&
      othernessText.includes("not a finding that they stay with you and the people closest to you"),
    "Non-activated otherness was described as absence or confinement",
  );
  assert(
    !othernessText.includes("Some effects of this choice extend beyond you and the people closest to you."),
    "The otherness question was shown without a displayed qualifying consequence",
  );
  await assertNoOverflow(page, `${label} otherness`);
  await clickExact(page, "Continue to user choice");

  await page.getByRole("heading", { level: 1, name: "User choice" }).waitFor();
  const choiceInputs = page.locator('input[name="present-choice"]');
  assert((await choiceInputs.count()) === 7, "User choice did not offer seven options");
  assert((await checkedPresentChoice(page)).length === 0, "A final option was preselected");
  const choiceText = await bodyText(page);
  assert(choiceText.includes("Consider a used or refurbished phone"), "Provisional inquiry choice is missing");
  assert(choiceText.includes("These pathways were inspected. Inspecting them does not select or rank an option here."), "Inspected pathways are not kept distinct");
  assert(choiceText.includes("Buy a used/second-hand phone"), "Inspected used pathway is missing from the choice review");
  assert(choiceText.includes("Buy a refurbished phone"), "Inspected refurbished pathway is missing from the choice review");
  assert(!choiceText.includes("consider_used_or_refurbished"), "Final choice shows an internal token");
  assert(!choiceText.includes("investigate_further"), "Final choice shows an internal token");
  for (const [id, name] of FINAL_OPTIONS) {
    await page.getByRole("radio", { name, exact: true }).check();
    const checked = await checkedPresentChoice(page);
    assert(checked.length === 1 && checked[0] === id, `${name} did not select exactly ${id}; got ${checked.join(",")}`);
  }
  assert(
    (await bodyText(page)).includes("Consider a used or refurbished phone"),
    "Selecting Unclear replaced the provisional inquiry choice",
  );
  await clickExact(page, "Clear this choice");
  assert((await checkedPresentChoice(page)).length === 0, "Clear this choice left a selection");
  await page.getByRole("radio", { name: "Unclear", exact: true }).check();
  await clickExact(page, "Back to Protect Four and otherness inquiry");
  await clickExact(page, "Continue to user choice");
  assert(
    (await checkedPresentChoice(page)).join(",") === "unclear",
    "Back from user choice did not preserve Unclear",
  );
  await assertNoOverflow(page, `${label} choice`);
  await page.getByRole("group", { name: "Your choice" }).scrollIntoViewIfNeeded();
  await shot(page, `${label}-choice`);

  await clickExact(page, "Back to Protect Four and otherness inquiry");
  await clickExact(page, "Back to impact and dependency pathways");
  await clickExact(page, "Back to comparison");
  await page.getByRole("heading", { level: 1, name: "Empirical comparison" }).waitFor();
  assert((await page.locator("#comparison-horizon").inputValue()) === "4", "Back to comparison did not preserve horizon 4");
  assert((await page.locator("#remaining-service").inputValue()) === "2.50", "Back to comparison did not preserve remaining service");
  assert((await page.locator("#used-candidate-service").inputValue()) === "1.50", "Back to comparison did not preserve used service");
  assert((await page.locator("#refurbished-candidate-service").inputValue()) === "3", "Back to comparison did not preserve refurbished service");
  assert(await page.getByRole("checkbox", { name: "Buy a refurbished phone", exact: true }).isChecked(), "Back cleared the refurbished pathway");
  await page.locator("#comparison-horizon").fill("5");
  await page.getByRole("heading", { level: 1, name: "Empirical comparison" }).waitFor();
  await clickExact(page, "Continue to impact and dependency pathways");
  await clickExact(page, "Continue to Protect Four and otherness inquiry");
  await clickExact(page, "Continue to user choice");
  assert((await checkedPresentChoice(page)).length === 0, "Changing the horizon left the final choice selected");
  assert(
    (await bodyText(page)).includes("Consider a used or refurbished phone"),
    "Changing the horizon erased the provisional inquiry choice",
  );
}

async function walkRoutes(page, label) {
  await page.goto(`${base}/journey`, { waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: "How Planetary Self-Inquiry assembled itself" }).waitFor();
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: "How Planetary Self-Inquiry assembled itself" }).waitFor();
  await assertNoOverflow(page, `${label} journey direct`);
  await page.getByRole("link", { name: "Back to main experience" }).click();
  await page.waitForURL(/\/$/);
  await page.getByRole("heading", { level: 1, name: /protect the whole planet/ }).waitFor();

  await page.goto(`${base}/smartphone`, { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: "The phone you already have" }).waitFor();
  assert(
    (await page.getByRole("button", { name: "See situation status" }).isDisabled()),
    "A deep link or refresh restored a completed situation",
  );
  await page.getByRole("link", { name: "Journey", exact: true }).click();
  await page.waitForURL(/\/journey$/);
  await page.getByRole("heading", { level: 1, name: "How Planetary Self-Inquiry assembled itself" }).waitFor();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1, name: /protect the whole planet/ }).waitFor();
  await assertNoOverflow(page, `${label} home reload`);
}

async function runViewport(browser, width, height) {
  const bag = freshBag();
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  attachMonitors(page, bag);
  const label = String(width);
  try {
    await walkHome(page, label);
    const unnamed = await unnamedControls(page);
    assert(unnamed.length === 0, `Unnamed controls on smartphone: ${unnamed.join(" | ")}`);
    await walkJourney(page, label);
    await walkRoutes(page, label);
    await assertNoOverflow(page, `${label} final home`);
  } catch (error) {
    await page.screenshot({ path: `${shotDir}/${label}-failure.png`, fullPage: true }).catch(() => {});
    const heading = await page.locator("h1").first().textContent().catch(() => "");
    throw new Error(`${label}px at ${page.url()} h1="${heading}": ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await context.close();
  }
  return bag;
}

function sameOriginFailures(bag) {
  return bag.httpFailures.filter((failure) => {
    if (!failure.url.startsWith(base)) return false;
    return !failure.url.endsWith("/favicon.ico");
  });
}

function optimizer504(bag) {
  return [...bag.httpFailures.map((failure) => `${failure.status} ${failure.url}`), ...bag.consoleErrors].filter((line) =>
    /504|Outdated Optimize Dep/i.test(line),
  );
}

const executablePath = chromeExecutable();
if (!executablePath) {
  console.error("No Chrome or Playwright Chromium executable is available.");
  process.exit(1);
}
const browser = await chromium.launch({ headless: true, executablePath });
await mkdir(shotDir, { recursive: true });
const viewports = [
  [390, 844],
  [1280, 800],
];
const results = [];
let failed = false;
for (const [width, height] of viewports) {
  try {
    const bag = await runViewport(browser, width, height);
    const productHttp = sameOriginFailures(bag);
    const stale = optimizer504(bag);
    const problems = [];
    if (bag.pageErrors.length > 0) problems.push(`pageerrors: ${bag.pageErrors.join(" | ")}`);
    if (productHttp.length > 0) problems.push(`same-origin http: ${JSON.stringify(productHttp)}`);
    if (stale.length > 0) problems.push(`optimizer 504: ${stale.join(" | ")}`);
    const thirdPartyConsole = bag.consoleErrors.filter((line) => !/Outdated Optimize Dep/i.test(line));
    if (problems.length > 0) {
      failed = true;
      results.push({ width, height, ok: false, problems, thirdPartyConsole, requestFailed: bag.requestFailed });
    } else {
      results.push({
        width,
        height,
        ok: true,
        thirdPartyConsole,
        ignoredFavicon: bag.httpFailures.filter((failure) => failure.url.endsWith("/favicon.ico")),
        requestFailed: bag.requestFailed,
      });
    }
  } catch (error) {
    failed = true;
    results.push({ width, height, ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}
await browser.close();
const report = {
  preview: base,
  browser: executablePath,
  reducedMotion: "reduce",
  renderedOtherness: "non-activated; the approved question is not shown because displayed impact records do not carry explicit extent and support",
  results,
};
console.log(JSON.stringify(report, null, 2));
if (failed || results.some((result) => result.ok !== true)) process.exit(1);
