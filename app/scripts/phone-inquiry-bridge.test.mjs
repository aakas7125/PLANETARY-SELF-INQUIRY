import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const readApp = (relativePath) => readFileSync(join(appRoot, relativePath), "utf8");

const SEMANTIC_MODULE_MARKERS = [
  "smartphone-situation",
  "smartphone-inquiry",
  "smartphone-comparison",
  "smartphone-impact",
  "smartphone-otherness",
  "smartphone-final-choice",
  "ap-otherness-ux",
  "final-choice-ux",
  "lib/smartphone/",
];

describe("homepage phone inquiry bridge", () => {
  it("exposes one homepage call to action to the canonical phone inquiry", () => {
    const home = readApp("src/routes/index.tsx");
    const bridge = readApp("src/components/phone-inquiry-bridge.tsx");

    assert.match(home, /createFileRoute\("\/"\)/);
    assert.match(home, /HeroSection/);
    assert.match(home, /PhoneInquiryBridge/);
    assert.match(bridge, /href="\/smartphone"/);
    assert.match(bridge, />\s*Begin the phone inquiry\s*</);
    assert.match(bridge, /focus-visible:ring-2/);
    assert.equal(bridge.includes("target="), false);
  });

  it("keeps the inquiry boundary and does not recommend a purchase", () => {
    const bridge = readApp("src/components/phone-inquiry-bridge.tsx");
    const copy = bridge.replace(/\s+/g, " ");

    assert.match(
      copy,
      /inquiry through situation, reflection, comparison, conditional pathways, otherness, and your own final choice/,
    );
    assert.match(copy, /does not recommend a purchase/);
    assert.match(copy, /does not prove the Protect Four proposition/);
    assert.match(copy, /is not a complete life-cycle assessment/);
    assert.doesNotMatch(copy, /you should|we recommend|best choice|winner|ranking|\bscore\b/i);
    assert.equal(bridge.includes("fetch("), false);
    assert.equal(bridge.includes("localStorage"), false);
    assert.equal(bridge.includes("analytics"), false);
  });

  it("leaves the phone inquiry, home, and journey routes reachable", () => {
    const home = readApp("src/routes/index.tsx");
    const journey = readApp("src/routes/journey.tsx");
    const smartphone = readApp("src/routes/smartphone.tsx");
    const tree = readApp("src/routeTree.gen.ts");

    assert.match(home, /createFileRoute\("\/"\)/);
    assert.match(journey, /createFileRoute\("\/journey"\)/);
    assert.match(smartphone, /createFileRoute\("\/smartphone"\)/);
    assert.match(smartphone, /SmartphoneSituation/);
    assert.match(tree, /path:\s*'\/'/);
    assert.match(tree, /path:\s*'\/journey'/);
    assert.match(tree, /path:\s*'\/smartphone'/);
  });

  it("keeps shared navigation pointed at the phone inquiry", () => {
    const nav = readApp("src/components/site-nav.tsx");

    assert.match(nav, /href="\/smartphone"/);
    assert.match(nav, /Phone inquiry/);
    assert.match(nav, /href="\/journey"/);
    assert.match(nav, />\s*Journey\s*</);
    assert.match(nav, /Protect Four/);
    assert.match(nav, /href="\/#top"/);
  });

  it("does not pull accepted smartphone semantic modules into the homepage bridge", () => {
    const home = readApp("src/routes/index.tsx");
    const bridge = readApp("src/components/phone-inquiry-bridge.tsx");
    const button = readApp("src/components/ui/button.tsx");

    for (const marker of SEMANTIC_MODULE_MARKERS) {
      assert.equal(home.includes(marker), false, marker);
      assert.equal(bridge.includes(marker), false, marker);
    }
    assert.match(bridge, /from "@\/components\/ui\/button"/);
    assert.match(button, /focus-visible:ring-2/);
    assert.match(button, /asChild/);
  });
});
