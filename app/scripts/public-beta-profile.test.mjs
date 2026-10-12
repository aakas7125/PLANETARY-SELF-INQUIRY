/**
 * Source regressions for the Option A public profile.
 * These checks read the repository contract. They do not start a server.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(appRoot, "..");

function read(path) {
  return readFileSync(path, "utf8");
}

const pkg = JSON.parse(read(join(appRoot, "package.json")));
const viteConfig = read(join(appRoot, "vite.config.ts"));
const rootRoute = read(join(appRoot, "src/routes/__root.tsx"));
const research = read(join(appRoot, "src/components/research-section.tsx"));
const styles = read(join(appRoot, "src/styles.css"));
const start = read(join(appRoot, "scripts/start-public-profile.mjs"));
const profile = read(join(repoRoot, "project-state/PUBLIC_BETA_PROFILE.md"));

test("production build does not migrate a database", () => {
  assert.equal(pkg.scripts.build, "node scripts/with-app-env.mjs vite build");
  assert.equal(pkg.scripts.start, "node scripts/start-public-profile.mjs");
  assert.doesNotMatch(pkg.scripts.build, /db:migrate/);
});

test("nitro output is the provider-neutral node server", () => {
  assert.match(viteConfig, /preset:\s*"node-server"/);
  assert.doesNotMatch(viteConfig, /preset:\s*"vercel"/);
  assert.doesNotMatch(viteConfig, /serverDir:\s*"\.\/server"/);
  assert.match(viteConfig, /command === "serve" && !isPreview \? \[grokPwaPlugin\(\)\]/);
  assert.match(viteConfig, /\*\*\/__grok\/\*\*/);
});

test("public root has no auth, preview bridge, Grok, or Google Fonts", () => {
  assert.doesNotMatch(rootRoute, /AuthProvider|PreviewHostBridge|fonts\.googleapis|fonts\.gstatic|__grok/);
  assert.match(rootRoute, /rel: "icon"/);
  assert.match(rootRoute, /href: appCss/);
});

test("homepage research renders the stored canon without runtime retrieval", () => {
  assert.match(research, /canonPapers/);
  assert.match(research, /not a live index/);
  assert.match(research, /not presented as current or exhaustive/);
  assert.match(research, /Notice:/);
  assert.doesNotMatch(research, /fetchRecentPapers|interpretPaper|openalex|crossref|api\.x\.ai|XAI_API_KEY|Read again|Read through the AP Framework/i);
});

test("presentation uses a local font stack", () => {
  assert.doesNotMatch(styles, /fonts\.googleapis|fonts\.gstatic|Fraunces|Source Sans 3/);
  assert.match(styles, /ui-sans-serif/);
  assert.match(styles, /Iowan Old Style/);
});

test("start contract requires no secret", () => {
  assert.match(start, /\.output\/server\/index\.mjs/);
  assert.match(start, /NITRO_HOST/);
  assert.match(start, /NITRO_PORT/);
  assert.doesNotMatch(start, /DATABASE_URL|XAI_API_KEY|BETTER_AUTH_SECRET|GROK_AUTH_/);
});

test("public profile runbook records the zero-secret contract", () => {
  assert.match(profile, /npm run build/);
  assert.match(profile, /npm run start/);
  assert.match(profile, /no secret/i);
  assert.match(profile, /127\.0\.0\.1/);
  assert.match(profile, /public-beta-profile-graph\.mjs/);
  assert.match(profile, /e2e-local-preview-smoke\.mjs/);
});
