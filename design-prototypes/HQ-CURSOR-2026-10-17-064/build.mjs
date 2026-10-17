import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, "../../app");
const requireFromApp = createRequire(join(appRoot, "package.json"));
const { build } = await import(requireFromApp.resolve("vite"));
const { default: react } = await import(requireFromApp.resolve("@vitejs/plugin-react"));
const { default: tailwindcss } = await import(requireFromApp.resolve("@tailwindcss/vite"));

const appModules = join(appRoot, "node_modules");
await build({
  root: here,
  configFile: false,
  logLevel: "warn",
  base: "./",
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: [
      { find: /^@\//, replacement: `${join(appRoot, "src")}/` },
      { find: /^(react|react-dom)(\/.*)?$/, replacement: `${appModules}/$1$2` },
    ],
  },
  build: {
    outDir: join(here, "dist"),
    emptyOutDir: true,
    rollupOptions: { input: { control: join(here, "control.html"), candidate: join(here, "candidate.html") } },
  },
});
console.log("built", join(here, "dist"));
