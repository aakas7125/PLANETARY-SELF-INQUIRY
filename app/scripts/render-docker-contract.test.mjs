/**
 * Source regressions for the Render Free Docker contract.
 * These checks read repository files. They do not build an image.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = join(appRoot, "..");

function read(path) {
  return readFileSync(path, "utf8");
}

function instructions(dockerfile) {
  return dockerfile
    .split("\n")
    .map((line) => line.replace(/#.*$/, "").trim())
    .filter(Boolean);
}

const dockerfile = read(join(appRoot, "Dockerfile"));
const dockerignore = read(join(appRoot, ".dockerignore"));
const guide = read(join(repoRoot, "project-state/RENDER_FREE_DOCKER.md"));
const profile = read(join(repoRoot, "project-state/PUBLIC_BETA_PROFILE.md"));
const dockerfileInstructions = instructions(dockerfile).join("\n");

test("Docker build pins Node 22.14.0, npm 11.19.0, and the locked install", () => {
  assert.match(dockerfileInstructions, /FROM node:22\.14\.0-bookworm-slim AS build/);
  assert.match(dockerfileInstructions, /FROM node:22\.14\.0-bookworm-slim AS runtime/);
  assert.equal(
    dockerfileInstructions.match(/FROM /g).length,
    2,
  );
  assert.match(dockerfileInstructions, /npm install -g npm@11\.19\.0/);
  assert.match(dockerfileInstructions, /npmVersion!=='11\.19\.0'/);
  assert.match(dockerfileInstructions, /process\.version!=='v22\.14\.0'/);
  assert.match(dockerfileInstructions, /npm ci --ignore-scripts/);
  assert.match(dockerfileInstructions, /package-lock\.json/);
  assert.match(dockerfileInstructions, /npm ci rewrote package-lock\.json/);
  assert.match(dockerfileInstructions, /npm run build/);
  assert.equal(
    dockerfileInstructions.match(/\bnpm install\b/g)?.length ?? 0,
    1,
  );
  assert.match(dockerfileInstructions, /npm install -g npm@11\.19\.0/);
  assert.doesNotMatch(dockerfileInstructions, /npm ci --(?!ignore-scripts)/);
});

test("runtime image listens through NITRO_HOST and does not override PORT", () => {
  assert.match(dockerfileInstructions, /COPY --from=build --chown=node:node \/src\/\.output \.\/\.output/);
  assert.match(dockerfileInstructions, /ENV NITRO_HOST=0\.0\.0\.0/);
  assert.match(dockerfileInstructions, /USER node/);
  assert.match(dockerfileInstructions, /CMD \["node", "\.output\/server\/index\.mjs"\]/);
  assert.match(dockerfileInstructions, /\.output\/public\/__grok/);
  assert.doesNotMatch(dockerfileInstructions, /^(?:ENV|ARG)\s+(?:PORT|NITRO_PORT|HOST)\b/m);
  assert.doesNotMatch(dockerfileInstructions, /\bUSER\s+root\b/);
  assert.doesNotMatch(
    dockerfileInstructions,
    /DATABASE_URL|XAI_API_KEY|BETTER_AUTH|GROK_AUTH|render\.yaml|VOLUME /,
  );
});

test("Docker context keeps the public-profile build inputs and drops local state", () => {
  const ignored = new Set(
    dockerignore
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#")),
  );
  for (const entry of [
    "node_modules",
    ".output",
    ".vercel",
    "dist",
    "coverage",
    ".env",
    ".env.*",
    "*.pem",
    "*.pfx",
    "*.key",
  ]) {
    assert.equal(ignored.has(entry), true, entry);
  }
  assert.equal(
    [...ignored].some((line) => line === ".grok" || line.startsWith(".grok/")),
    false,
  );
  assert.equal(ignored.has("package-lock.json"), false);
  assert.equal(ignored.has("package.json"), false);
  assert.equal(
    [...ignored].some((line) => line === "scripts" || line.startsWith("scripts/")),
    false,
  );
});

test("Render guide stays manual and does not authorize payment or release", () => {
  assert.match(guide, /root directory: `app`/i);
  assert.match(guide, /Dockerfile path, if Render asks: `\.\/Dockerfile`/);
  assert.match(guide, /Language\/runtime: Docker/);
  assert.match(guide, /Branch: `main`/);
  assert.match(guide, /Region: Frankfurt/);
  assert.match(guide, /Compute: Free/);
  assert.match(guide, /Do not add a database/);
  assert.match(guide, /Do not add environment variables or secrets/);
  assert.match(guide, /Do not enter a build command or a start command/);
  assert.match(guide, /Do not add a custom domain or change DNS/);
  assert.match(guide, /Do not authorize a card/);
  assert.match(guide, /NITRO_HOST=0\.0\.0\.0/);
  assert.match(guide, /injected `PORT`/);
  assert.match(guide, /\/journey/);
  assert.match(guide, /\/smartphone/);
  assert.match(guide, /Issue #130/);
  assert.match(guide, /do not enter payment information/i);
  assert.doesNotMatch(guide, /render\.yaml/);
  assert.match(profile, /RENDER_FREE_DOCKER\.md/);
  assert.equal(existsSync(join(appRoot, "render.yaml")), false);
  assert.equal(existsSync(join(repoRoot, "render.yaml")), false);
});
