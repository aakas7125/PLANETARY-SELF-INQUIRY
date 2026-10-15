/**
 * Focused rendered check for the static Principles page on the built public profile.
 *
 * Usage, from app/, against the built server:
 *   HOST=127.0.0.1 PORT=8081 npm run start
 *   PREVIEW_URL=http://127.0.0.1:8081 node scripts/constitution-public-profile-smoke.mjs
 *
 * Does not open the GitHub issue form or submit an issue.
 */
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
import {
  PUBLIC_CONSTITUTION_ACCOUNTABILITY_HREF,
  PUBLIC_CONSTITUTION_PAGE_TITLE,
  PUBLIC_CONSTITUTION_SCENES,
  PUBLIC_CONSTITUTION_SECTION_HEADINGS,
  PUBLIC_CONSTITUTION_UNITS,
} from "../src/lib/constitution/public-constitution.mjs";

function chromeExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    chromium.executablePath(),
    "/opt/google/chrome/chrome",
  ].filter((candidate) => typeof candidate === "string" && candidate.length > 0);
  return candidates.find((candidate) => existsSync(candidate));
}

const base = (process.env.PREVIEW_URL ?? "http://127.0.0.1:8081").replace(/\/$/, "");
const shotDir = process.env.QA_SCREENSHOT_DIR ?? "/tmp/psi-qa-051";
const PROHIBITED_REQUEST =
  /api\.openalex\.org|api\.crossref\.org|api\.x\.ai|fonts\.googleapis\.com|fonts\.gstatic\.com|grok\.com|\/__grok\/|\/auth\/|\/__app-env|\/api\/auth|stun:|turn:|github\.com/i;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function attachMonitors(page, bag) {
  page.on("pageerror", (error) => bag.pageErrors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") bag.consoleErrors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() < 400) return;
    bag.httpFailures.push({ status: response.status(), url: response.url() });
  });
  page.on("request", (request) => {
    const url = request.url();
    bag.requests.push(url);
    if (PROHIBITED_REQUEST.test(url)) bag.prohibitedRequests.push(url);
  });
}

function freshBag() {
  return { pageErrors: [], consoleErrors: [], httpFailures: [], requests: [], prohibitedRequests: [] };
}

async function shot(page, name) {
  await page.screenshot({ path: `${shotDir}/${name}.png` });
}

async function assertNoOverflow(page, where) {
  const box = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  assert(box.scrollWidth <= box.clientWidth + 1, `${where} horizontal overflow ${box.scrollWidth} > ${box.clientWidth}`);
  return box;
}

async function persistence(page, context) {
  const storage = await page.evaluate(async () => {
    const databases = indexedDB.databases ? await indexedDB.databases() : [];
    const cacheKeys = "caches" in window ? await caches.keys() : [];
    const registrations = "serviceWorker" in navigator ? await navigator.serviceWorker.getRegistrations() : [];
    return {
      cookie: document.cookie,
      local: localStorage.length,
      session: sessionStorage.length,
      databases: databases.map((database) => database.name),
      cacheKeys,
      serviceWorkers: registrations.length,
      passwordInputs: document.querySelectorAll("input[type='password'], input[type='email']").length,
    };
  });
  const cookies = await context.cookies();
  return { ...storage, browserCookies: cookies.map((cookie) => cookie.name) };
}

async function assertPrivacyQuiet(page, context, where) {
  const found = await persistence(page, context);
  assert(found.cookie === "", `${where} document cookie ${found.cookie}`);
  assert(found.local === 0, `${where} localStorage`);
  assert(found.session === 0, `${where} sessionStorage`);
  assert(found.browserCookies.length === 0, `${where} cookies ${found.browserCookies.join(",")}`);
  assert(found.databases.length === 0, `${where} indexedDB ${found.databases.join(",")}`);
  assert(found.cacheKeys.length === 0, `${where} caches ${found.cacheKeys.join(",")}`);
  assert(found.serviceWorkers === 0, `${where} service workers`);
  assert(found.passwordInputs === 0, `${where} account inputs`);
  return found;
}

async function readConstitution(page, label) {
  await page.getByRole("heading", { level: 1, name: PUBLIC_CONSTITUTION_PAGE_TITLE }).waitFor();
  const body = await page.locator("body").innerText();
  for (const unit of Object.values(PUBLIC_CONSTITUTION_UNITS)) {
    assert(body.includes(unit.text), `${label} missing ${unit.id}`);
  }
  for (const heading of PUBLIC_CONSTITUTION_SECTION_HEADINGS) {
    assert(body.includes(heading), `${label} missing heading ${heading}`);
  }
  for (const scene of PUBLIC_CONSTITUTION_SCENES) {
    assert(body.includes(scene.title), `${label} missing scene ${scene.title}`);
  }
  const link = page.getByRole("link", { name: "public project issue tracker" });
  assert((await link.getAttribute("href")) === PUBLIC_CONSTITUTION_ACCOUNTABILITY_HREF, `${label} accountability href`);
  const order = await page.evaluate(() => {
    const warning = document.querySelector("[data-content-id='PC-ACCOUNT-02']");
    const account = document.querySelector("[data-content-id='PC-ACCOUNT-01'] a");
    if (!warning || !account) return "missing";
    return warning.compareDocumentPosition(account) & Node.DOCUMENT_POSITION_FOLLOWING ? "before" : "after";
  });
  assert(order === "before", `${label} privacy warning is not before the tracker link`);
  await assertNoOverflow(page, `${label} constitution`);
}

async function scrollBelowNav(locator) {
  await locator.evaluate((element) => {
    const top = element.getBoundingClientRect().top + window.scrollY - 150;
    window.scrollTo(0, Math.max(0, top));
  });
}

async function captureScenes(page, label) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, `INITIAL-1-${label}-top`);
  for (const [index, scene] of PUBLIC_CONSTITUTION_SCENES.entries()) {
    const section = page.locator(`#constitution-${scene.id}`);
    await scrollBelowNav(section);
    await assertNoOverflow(page, `${label} ${scene.id}`);
    await shot(page, `INITIAL-1-${label}-scene-${index + 1}`);
    const figure = section.locator("figure");
    if ((await figure.count()) > 0) {
      await scrollBelowNav(figure);
      await assertNoOverflow(page, `${label} ${scene.id} diagram`);
      await shot(page, `INITIAL-1-${label}-scene-${index + 1}-diagram`);
    }
  }
  await scrollBelowNav(page.getByRole("heading", { level: 3, name: "Privacy in this public beta" }));
  await shot(page, `INITIAL-1-${label}-privacy`);
  await scrollBelowNav(page.getByRole("heading", { level: 3, name: "Hold us to these promises" }));
  await shot(page, `INITIAL-1-${label}-accountability`);
}

async function runViewport(browser, width, height) {
  const bag = freshBag();
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
  const page = await context.newPage();
  attachMonitors(page, bag);
  const label = String(width);
  try {
    await page.goto(`${base}/constitution`, { waitUntil: "networkidle" });
    await page.reload({ waitUntil: "networkidle" });
    await readConstitution(page, `${label} direct`);
    await captureScenes(page, label);
    const principles = page.getByRole("link", { name: "Principles", exact: true });
    assert((await principles.getAttribute("aria-current")) === "page", `${label} Principles current`);
    await principles.focus();
    const focused = await principles.evaluate((element) => element === document.activeElement);
    assert(focused, `${label} Principles was not keyboard-focused`);
    await page.getByRole("link", { name: "Back to home", exact: true }).click();
    await page.waitForURL(/\/$/);
    await page.getByRole("heading", { level: 1, name: /protect the whole planet/ }).waitFor();
    await page.getByRole("link", { name: "Principles", exact: true }).click();
    await page.waitForURL(/\/constitution$/);
    await readConstitution(page, `${label} from home`);
    await page.getByRole("link", { name: "Phone inquiry", exact: true }).click();
    await page.waitForURL(/\/smartphone$/);
    await page.getByRole("heading", { level: 1, name: "The phone you already have" }).waitFor();
    assert(await page.getByRole("button", { name: "See situation status" }).isDisabled(), `${label} smartphone state changed`);
    await page.getByRole("link", { name: "Journey", exact: true }).click();
    await page.waitForURL(/\/journey$/);
    await page.getByRole("heading", { level: 1, name: "How Planetary Self-Inquiry assembled itself" }).waitFor();
    await page.goto(`${base}/constitution`, { waitUntil: "networkidle" });
    const privacy = await assertPrivacyQuiet(page, context, label);
    assert(bag.prohibitedRequests.length === 0, `${label} prohibited ${bag.prohibitedRequests.join(" | ")}`);
    assert(bag.pageErrors.length === 0, `${label} page errors ${bag.pageErrors.join(" | ")}`);
    return { bag, privacy };
  } catch (error) {
    await page.screenshot({ path: `${shotDir}/${label}-failure.png`, fullPage: true }).catch(() => {});
    throw new Error(`${label}px at ${page.url()}: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await context.close();
  }
}

const executablePath = chromeExecutable();
if (!executablePath) {
  console.error("No Chrome or Playwright Chromium executable is available.");
  process.exit(1);
}

await mkdir(shotDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath });
const results = [];
let failed = false;
for (const [width, height] of [
  [390, 844],
  [1280, 800],
]) {
  try {
    const { bag, privacy } = await runViewport(browser, width, height);
    const http = bag.httpFailures.filter((failure) => failure.url.startsWith(base) && !failure.url.endsWith("/favicon.ico"));
    if (http.length > 0 || bag.consoleErrors.length > 0) {
      failed = true;
      results.push({ width, height, ok: false, http, consoleErrors: bag.consoleErrors });
    } else {
      results.push({ width, height, ok: true, privacy, prohibitedRequests: bag.prohibitedRequests });
    }
  } catch (error) {
    failed = true;
    results.push({ width, height, ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}
await browser.close();

const constitution = await fetch(`${base}/constitution`, { redirect: "manual" });
const setCookie = constitution.headers.get("set-cookie");
if (constitution.status !== 200 || setCookie) failed = true;

const report = {
  preview: base,
  browser: executablePath,
  constitutionStatus: constitution.status,
  constitutionSetCookie: Boolean(setCookie),
  accountabilityHref: PUBLIC_CONSTITUTION_ACCOUNTABILITY_HREF,
  results,
};
console.log(JSON.stringify(report, null, 2));
if (failed || results.some((result) => result.ok !== true)) process.exit(1);
