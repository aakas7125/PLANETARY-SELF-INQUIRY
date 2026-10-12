/**
 * Scan the built public profile for prohibited runtime surfaces.
 *
 * Usage, from app/, after npm run build:
 *   node scripts/public-beta-profile-graph.mjs
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const outputRoot = join(appRoot, ".output");
const serverEntry = join(outputRoot, "server/index.mjs");
const textExtensions = new Set([".mjs", ".js", ".css", ".html", ".json", ".txt", ".map", ".svg"]);

const prohibited = [
  /api\.openalex\.org/,
  /api\.crossref\.org/,
  /api\.x\.ai/,
  /fonts\.googleapis\.com/,
  /fonts\.gstatic\.com/,
  /grok\.com\/grok-app-builder/,
  /\/__grok\//,
  /XAI_API_KEY/,
  /BETTER_AUTH_SECRET/,
  /GROK_AUTH_/,
  /GROK_CONNECTORS_URL/,
  /PreviewHostBridge/,
  /installPreviewHostBridge/,
  /\/auth\/popup/,
  /better-auth/,
  /@electric-sql\/pglite/,
  /DATABASE_URL/,
  /\.vc-config\.json/,
];

function extensionOf(path) {
  const index = path.lastIndexOf(".");
  return index === -1 ? "" : path.slice(index);
}

function walk(dir, files) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (name === "__grok") {
      files.push(path);
      continue;
    }
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path, files);
      continue;
    }
    files.push(path);
  }
}

if (!existsSync(serverEntry)) {
  console.error(`Built server entry is missing: ${serverEntry}`);
  process.exit(1);
}

const files = [];
walk(outputRoot, files);
const findings = [];
const publicAssetRefs = new Set();
const assetRefPattern = /\/assets\/styles-[A-Za-z0-9_-]+\.css/g;

for (const path of files) {
  const rel = relative(outputRoot, path);
  if (rel === "__grok" || rel.startsWith("__grok/") || rel.includes("/__grok/") || rel.includes("/__grok")) {
    findings.push(`${rel}: Grok public asset is in the production output`);
    continue;
  }
  if (!textExtensions.has(extensionOf(path))) continue;
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    continue;
  }
  for (const pattern of prohibited) {
    if (pattern.test(text)) {
      findings.push(`${rel}: ${pattern}`);
    }
  }
  if (rel.startsWith("server/") && textExtensions.has(extensionOf(path))) {
    for (const match of text.match(assetRefPattern) ?? []) {
      publicAssetRefs.add(match);
    }
  }
}

for (const assetPath of publicAssetRefs) {
  const filePath = join(outputRoot, "public", assetPath.slice(1));
  if (!existsSync(filePath)) {
    findings.push(`missing public asset referenced by the server: ${assetPath}`);
  }
}

if (findings.length > 0) {
  console.error("Prohibited public-profile surfaces:");
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      output: outputRoot,
      serverEntry,
      filesScanned: files.length,
      prohibitedPatterns: prohibited.length,
      result: "clear",
    },
    null,
    2,
  ),
);
