import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicConstitution } from "@/components/public-constitution";
import { SiteNav } from "@/components/site-nav";
import {
  CONSTITUTION_LANGUAGE_LINKS,
  constitutionDocument,
  constitutionSearch,
  resolveConstitutionLanguage,
} from "@/lib/constitution/constitution-locale.mjs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/constitution")({
  validateSearch: constitutionSearch,
  component: ConstitutionPage,
  head: ({ match }) => {
    const copy = constitutionDocument(resolveConstitutionLanguage(match.search.lang));
    return {
      meta: [
        { title: `${copy.pageTitle.text} · Protect Four` },
        {
          name: "description",
          content: copy.description.text,
        },
      ],
    };
  },
});

function ConstitutionPage() {
  const { lang } = Route.useSearch();
  const language = resolveConstitutionLanguage(lang);
  const copy = constitutionDocument(language);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div lang={copy.contentLang} data-constitution-language={copy.language}>
          <nav aria-label="English / Deutsch (Pilot)" className="mb-6 flex flex-wrap gap-x-4 gap-y-1">
            {CONSTITUTION_LANGUAGE_LINKS.map((item) => {
              const current = item.language === language;
              return (
                <Link
                  key={item.language}
                  to="/constitution"
                  search={{ lang: item.language }}
                  lang={item.language}
                  aria-current={current ? "true" : undefined}
                  className={cn(
                    "rounded-md py-2 text-sm underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    current ? "text-foreground underline" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <p className="mb-8">
            <Link
              to="/"
              className="text-sm text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {copy.backHome.text}
            </Link>
          </p>
          <PublicConstitution copy={copy} />
        </div>
      </main>
    </div>
  );
}
