import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "dist");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css" };

export async function startServer() {
  const server = createServer(async (req, res) => {
    const path = normalize(new URL(req.url, "http://x").pathname).replace(/^(\.\.[/\\])+/, "");
    if (path === "/favicon.ico") {
      res.writeHead(204).end();
      return;
    }
    try {
      const body = await readFile(join(dist, path));
      res.writeHead(200, { "content-type": types[extname(path)] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end("not found");
    }
  });
  await new Promise((ok) => server.listen(0, "127.0.0.1", ok));
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

export async function launchBrowser() {
  const { createRequire } = await import("node:module");
  const requireFromApp = createRequire(join(dirname(fileURLToPath(import.meta.url)), "../../app/package.json"));
  const pw = await import(requireFromApp.resolve("playwright"));
  const chromium = pw.chromium ?? pw.default.chromium;
  return chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/opt/google/chrome/chrome", args: ["--no-sandbox"] });
}
