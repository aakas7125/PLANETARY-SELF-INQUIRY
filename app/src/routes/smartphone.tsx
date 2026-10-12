import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SmartphoneSituation } from "@/components/smartphone-situation";

export const Route = createFileRoute("/smartphone")({
  component: SmartphonePage,
  head: () => ({
    meta: [
      { title: "Phone inquiry · Protect Four" },
      {
        name: "description",
        content:
          "A situation step, six inquiry questions, an empirical comparison, conditional impact and dependency pathways, then a Protect Four and otherness inquiry when a displayed consequence establishes it. It does not recommend a purchase.",
      },
    ],
  }),
});

function SmartphonePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <SmartphoneSituation />
    </div>
  );
}
