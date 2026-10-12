import { Badge } from "@/components/ui/badge";
import { canonPapers } from "@/lib/papers";

export function ResearchSection() {
  return (
    <section id="papers" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Repository-backed sources
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl sm:text-5xl">
          Canonical papers held in this repository.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          These entries are the canon already stored in this repository. The set is fixed here.
          It is not a live index, and it is not presented as current or exhaustive. Source and
          DOI links go to the works themselves. The notice under each entry is inquiry beside the
          stored source text. It is not a finding of the paper.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {canonPapers.map((paper) => (
          <article
            key={paper.id}
            className="rounded-3xl bg-card p-5 shadow-[0_0_0_1px_rgba(22,20,16,0.08)] sm:p-7"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={paper.source === "canon" ? "default" : "muted"}>
                {paper.source === "canon" ? "Canon" : paper.source}
              </Badge>
              <span className="text-xs tabular-nums text-muted-foreground">{paper.year}</span>
              <span className="text-xs text-muted-foreground">{paper.venue}</span>
              {paper.citedBy ? (
                <span className="text-xs tabular-nums text-muted-foreground">
                  {paper.citedBy} citations
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 font-display text-xl leading-snug sm:text-2xl">
              <a
                href={paper.url}
                target="_blank"
                rel="noreferrer"
                className="hover:underline hover:decoration-primary/40 hover:underline-offset-4"
              >
                {paper.title}
              </a>
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">{paper.authors}</p>
            {paper.abstract ? (
              <p className="mt-3 text-sm text-foreground">{paper.abstract}</p>
            ) : null}
            <p className="mt-4 border-l-2 border-primary pl-4 text-sm text-muted-foreground">
              Notice: {paper.why}
            </p>
            {paper.doi ? (
              <p className="mt-4">
                <a
                  href={`https://doi.org/${paper.doi}`}
                  className="text-xs text-primary underline decoration-primary/30 underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  {paper.doi}
                </a>
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
