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
import { constitutionDocument } from "../src/lib/constitution/constitution-locale.mjs";
import { PUBLIC_CONSTITUTION_ACCOUNTABILITY_HREF } from "../src/lib/constitution/public-constitution.mjs";

function chromeExecutable() {
  const candidates = [
    process.env.CHROME_PATH,
    chromium.executablePath(),
    "/opt/google/chrome/chrome",
  ].filter((candidate) => typeof candidate === "string" && candidate.length > 0);
  return candidates.find((candidate) => existsSync(candidate));
}

const base = (process.env.PREVIEW_URL ?? "http://127.0.0.1:8081").replace(/\/$/, "");
const shotDir = process.env.QA_SCREENSHOT_DIR ?? "/tmp/psi-qa-052";
const english = constitutionDocument("en");
const german = constitutionDocument("de");
const PROHIBITED_REQUEST =
  /api\.openalex\.org|api\.crossref\.org|api\.x\.ai|fonts\.googleapis\.com|fonts\.gstatic\.com|grok\.com|\/__grok\/|\/auth\/|\/__app-env|\/api\/auth|stun:|turn:|github\.com|translate\.google|deepl\.com/i;

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

async function scrollBelowNav(locator) {
  await locator.evaluate((element) => {
    const header = document.querySelector("header");
    const offset = header ? header.getBoundingClientRect().bottom + 16 : 16;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo(0, Math.max(0, top));
  });
}

async function readHead(page, copy, label) {
  assert((await page.title()) === `${copy.pageTitle.text} · Protect Four`, `${label} title`);
  const description = await page.locator('meta[name="description"]').getAttribute("content");
  assert(description === copy.description.text, `${label} description`);
  const rootLang = await page.locator("html").getAttribute("lang");
  assert(rootLang === "en", `${label} root lang ${rootLang}`);
  const contentLang = await page.locator("[data-constitution-language]").getAttribute("lang");
  assert(contentLang === copy.contentLang, `${label} content lang ${contentLang}`);
}

async function readCopy(page, copy, label) {
  await page.getByRole("heading", { level: 1, name: copy.pageTitle.text }).waitFor();
  const body = await page.locator("body").innerText();
  const units = copy.scenes.flatMap((scene) => scene.blocks.flatMap((block) => block.units));
  for (const unit of units) {
    assert(body.includes(unit.text), `${label} missing ${unit.id}`);
  }
  for (const scene of copy.scenes) {
    assert(body.includes(scene.title.text), `${label} missing scene ${scene.title.text}`);
    for (const block of scene.blocks) {
      if (block.heading) assert(body.includes(block.heading.text), `${label} missing heading ${block.heading.text}`);
    }
  }
  for (const choice of copy.openChoices) {
    assert(body.includes(choice.text), `${label} missing choice ${choice.text}`);
  }
  const phrase = copy.language === "de"
    ? "öffentlichen Issue-Tracker des Projekts"
    : "public project issue tracker";
  const link = page.getByRole("link", { name: phrase });
  assert((await link.getAttribute("href")) === PUBLIC_CONSTITUTION_ACCOUNTABILITY_HREF, `${label} accountability href`);
  const order = await page.evaluate(() => {
    const warning = document.querySelector("[data-content-id='PC-ACCOUNT-02']");
    const account = document.querySelector("[data-content-id='PC-ACCOUNT-01'] a");
    if (!warning || !account) return "missing";
    return warning.compareDocumentPosition(account) & Node.DOCUMENT_POSITION_FOLLOWING ? "before" : "after";
  });
  assert(order === "before", `${label} privacy warning is not before the tracker link`);
  const raw = await page.locator("[data-content-id='PC-RAW-01']").allTextContents();
  assert(raw.length === 2 && raw[0] === raw[1], `${label} repeated raw answer text differs`);
  await readHead(page, copy, label);
  await assertNoOverflow(page, `${label} constitution`);
}

async function expectCurrentLanguage(page, language, label) {
  for (const item of [
    { language: "en", name: "English" },
    { language: "de", name: "Deutsch (Pilot)" },
  ]) {
    const link = page.getByRole("link", { name: item.name, exact: true });
    const current = await link.getAttribute("aria-current");
    const marked = current === "true" || current === "page";
    assert(marked === (item.language === language), `${label} ${item.name} current ${current}`);
  }
  const principles = page.getByRole("link", { name: "Principles", exact: true });
  assert((await principles.getAttribute("aria-current")) === "page", `${label} Principles current`);
}

async function captureGerman(page, label) {
  await page.evaluate(() => window.scrollTo(0, 0));
  const deutsch = page.getByRole("link", { name: "Deutsch (Pilot)", exact: true });
  await deutsch.focus();
  const focused = await deutsch.evaluate((element) => element === document.activeElement);
  assert(focused, `${label} Deutsch control was not keyboard-focused`);
  await assertNoOverflow(page, `${label} language`);
  await shot(page, `INITIAL-1-${label}-de-language`);
  for (const [index, scene] of german.scenes.entries()) {
    const section = page.locator(`#constitution-${scene.id}`);
    await scrollBelowNav(section);
    await assertNoOverflow(page, `${label} ${scene.id}`);
    await shot(page, `INITIAL-1-${label}-de-scene-${index + 1}`);
    const prose = section.locator("div.space-y-6").first();
    await page.evaluate(() => {
      const header = document.querySelector("header");
      if (header instanceof HTMLElement) header.style.position = "static";
    });
    await prose.screenshot({ path: `${shotDir}/INITIAL-1-${label}-de-scene-${index + 1}-text.png` });
    await page.evaluate(() => {
      const header = document.querySelector("header");
      if (header instanceof HTMLElement) header.style.position = "";
    });
  }
  await scrollBelowNav(page.getByRole("heading", { level: 3, name: german.scenes.at(-1).blocks[1].heading.text }));
  await shot(page, `INITIAL-1-${label}-de-privacy`);
  await scrollBelowNav(page.getByRole("heading", { level: 3, name: german.scenes.at(-1).blocks[2].heading.text }));
  await shot(page, `INITIAL-1-${label}-de-accountability`);
  await page.getByRole("navigation", { name: "English / Deutsch (Pilot)" }).waitFor();
  const summary = page.locator("summary");
  await summary.click();
  await scrollBelowNav(summary);
  await shot(page, `INITIAL-1-${label}-de-sources`);
  const intro = await page.locator("details p").innerText();
  assert(intro === german.sourcesIntro.text, `${label} sources intro`);
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
    await readCopy(page, english, `${label} direct`);
    await expectCurrentLanguage(page, "en", `${label} direct`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, `INITIAL-1-${label}-en-top`);
    const principles = page.getByRole("link", { name: "Principles", exact: true });
    await principles.focus();
    const focused = await principles.evaluate((element) => element === document.activeElement);
    assert(focused, `${label} Principles was not keyboard-focused`);
    await page.getByRole("link", { name: "Back to home", exact: true }).click();
    await page.waitForURL(/\/$/);
    await page.getByRole("heading", { level: 1, name: /protect the whole planet/ }).waitFor();
    await page.getByRole("link", { name: "Principles", exact: true }).click();
    await page.waitForURL(/\/constitution$/);
    await readCopy(page, english, `${label} from home`);
    await page.getByRole("link", { name: "Phone inquiry", exact: true }).click();
    await page.waitForURL(/\/smartphone$/);
    await page.getByRole("heading", { level: 1, name: "The phone you already have" }).waitFor();
    assert(await page.getByRole("button", { name: "See situation status" }).isDisabled(), `${label} smartphone state changed`);
    await page.getByRole("link", { name: "Journey", exact: true }).click();
    await page.waitForURL(/\/journey$/);
    await page.getByRole("heading", { level: 1, name: "How Planetary Self-Inquiry assembled itself" }).waitFor();

    await page.goto(`${base}/constitution?lang=en`, { waitUntil: "networkidle" });
    await readCopy(page, english, `${label} explicit en`);
    await page.getByRole("link", { name: "Deutsch (Pilot)", exact: true }).click();
    await page.waitForURL(/\/constitution\?lang=de$/);
    await readCopy(page, german, `${label} client de`);
    await expectCurrentLanguage(page, "de", `${label} client de`);
    await page.goBack();
    await page.waitForURL(/\/constitution\?lang=en$/);
    await readCopy(page, english, `${label} back`);
    await page.goForward();
    await page.waitForURL(/\/constitution\?lang=de$/);
    await readCopy(page, german, `${label} forward`);
    await page.reload({ waitUntil: "networkidle" });
    await readCopy(page, german, `${label} reload de`);
    await captureGerman(page, label);

    await page.goto(`${base}/constitution?lang=zz`, { waitUntil: "networkidle" });
    assert(page.url().includes("lang=zz"), `${label} unsupported locale was rewritten`);
    await readCopy(page, english, `${label} fallback`);
    await expectCurrentLanguage(page, "en", `${label} fallback`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await shot(page, `INITIAL-1-${label}-fallback`);

    await page.goto(`${base}/constitution?lang=de`, { waitUntil: "networkidle" });
    const privacy = await assertPrivacyQuiet(page, context, label);
    const previewHost = new URL(base).host;
    const external = bag.requests.filter((url) => {
      try {
        const host = new URL(url).host;
        return host && host !== previewHost;
      } catch {
        return false;
      }
    });
    assert(external.length === 0, `${label} external ${external.join(" | ")}`);
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

function visibleTitle(html, title) {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/);
  if (!match) return false;
  const text = match[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return text === title;
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

const routes = ["/constitution", "/constitution?lang=en", "/constitution?lang=de", "/constitution?lang=zz"];
const server = [];
for (const route of routes) {
  const response = await fetch(`${base}${route}`, { redirect: "manual" });
  const html = await response.text();
  const setCookie = response.headers.get("set-cookie");
  const germanTitle = visibleTitle(html, german.pageTitle.text);
  const englishTitle = visibleTitle(html, english.pageTitle.text);
  const expectedGerman = route.endsWith("lang=de");
  if (response.status !== 200 || setCookie || germanTitle !== expectedGerman || englishTitle === expectedGerman) {
    failed = true;
  }
  server.push({
    route,
    status: response.status,
    setCookie: Boolean(setCookie),
    germanTitle,
    englishTitle,
    rootLangEn: html.includes('<html lang="en"'),
  });
}

const report = {
  preview: base,
  browser: executablePath,
  accountabilityHref: PUBLIC_CONSTITUTION_ACCOUNTABILITY_HREF,
  server,
  results,
};
console.log(JSON.stringify(report, null, 2));
if (failed || results.some((result) => result.ok !== true)) process.exit(1);
