#!/usr/bin/env node
/**
 * Start the built provider-neutral public profile.
 *
 * No secret is required. This script does not migrate a database, contact a
 * host, or read credential files. Host and port are optional:
 *
 * - NITRO_HOST, otherwise HOST. Unset leaves the Node listener default.
 * - NITRO_PORT, otherwise PORT. Unset uses Nitro's default port 3000.
 *
 * The built entry is app/.output/server/index.mjs.
 */
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const entry = join(dirname(fileURLToPath(import.meta.url)), "../.output/server/index.mjs");

if (!existsSync(entry)) {
  console.error("Built server entry is missing. From app/, run npm run build first.");
  process.exit(1);
}

const host = process.env.NITRO_HOST || process.env.HOST || "(unset; Node default)";
const port = process.env.NITRO_PORT || process.env.PORT || "(unset; Nitro default 3000)";
console.log(`Public profile server: ${entry}`);
console.log(`Host: ${host}`);
console.log(`Port: ${port}`);

const child = spawn(process.execPath, [entry], {
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.exit(1);
  }
  process.exit(code ?? 1);
});
