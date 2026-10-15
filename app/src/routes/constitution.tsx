import { createFileRoute } from "@tanstack/react-router";
import { PublicConstitution } from "@/components/public-constitution";
import { SiteNav } from "@/components/site-nav";
import {
  PUBLIC_CONSTITUTION_PAGE_TITLE,
  PUBLIC_CONSTITUTION_UNITS,
} from "@/lib/constitution/public-constitution.mjs";

export const Route = createFileRoute("/constitution")({
  component: ConstitutionPage,
  head: () => ({
    meta: [
      { title: `${PUBLIC_CONSTITUTION_PAGE_TITLE} · Protect Four` },
      {
        name: "description",
        content: PUBLIC_CONSTITUTION_UNITS["PC-OPEN-01"].text,
      },
    ],
  }),
});

function ConstitutionPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="mb-8">
          <a
            href="/"
            className="text-sm text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Back to home
          </a>
        </p>
        <PublicConstitution />
      </main>
    </div>
  );
}
