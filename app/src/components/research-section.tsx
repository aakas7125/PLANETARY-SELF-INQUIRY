import { useEffect, useMemo, useState } from "react";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { canonPapers, type Paper } from "@/lib/papers";
import { fetchRecentPapers, interpretPaper } from "@/lib/research";
import { useHousehold } from "@/store/household";

type Feed = {
  fetchedAt: string;
  liveCount: number;
  papers: Paper[];
};

export function ResearchSection() {
  const names = useHousehold((s) => s.names);
  const [feed, setFeed] = useState<Feed | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [readings, setReadings] = useState<Record<string, string>>({});
  const [readError, setReadError] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRecentPapers();
      setFeed(data);
    } catch {
      setError("Live indexes could not be reached. Showing the canon instead.");
      setFeed({
        fetchedAt: new Date().toISOString(),
        liveCount: 0,
        papers: canonPapers,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const papers = feed?.papers ?? canonPapers;
  const fetchedLabel = useMemo(() => {
    if (!feed?.fetchedAt) return null;
    try {
      return new Date(feed.fetchedAt).toLocaleString();
    } catch {
      return feed.fetchedAt;
    }
  }, [feed]);

  const onRead = async (paper: Paper) => {
    if (readings[paper.id] || readingId) return;
    setReadingId(paper.id);
    setReadError((e) => ({ ...e, [paper.id]: "" }));
    try {
      const res = await interpretPaper({
        data: {
          title: paper.title,
          abstract: paper.abstract,
          venue: paper.venue,
          year: paper.year,
        },
      });
      if (res.ok) {
        setReadings((r) => ({ ...r, [paper.id]: res.text }));
      } else {
        setReadError((e) => ({ ...e, [paper.id]: res.error }));
      }
    } catch {
      setReadError((e) => ({
        ...e,
        [paper.id]: "The reading could not be completed just now.",
      }));
    } finally {
      setReadingId(null);
    }
  };

  return (
    <section id="papers" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            The literature, still arriving
          </p>
          <h2 className="mt-3 max-w-3xl font-display text-3xl sm:text-5xl">
            Recent credible papers, read for {names[0] || "the four"}.
          </h2>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            OpenAlex and Crossref are queried for peer-reviewed work on anthropogenic climate
            change and Earth-system impacts, then set beside a canon (IPCC lineage, planetary
            boundaries, food, inequality, heat). Each abstract can be read two ways: what the
            paper supports, and what question it might raise for a household that hoped to
            secede. The second reading is inquiry, not a finding.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => void load()}
          disabled={loading}
          className="shrink-0"
        >
          {loading ? <LoaderCircle className="animate-spin" /> : <RefreshCw />}
          {loading ? "Reading indexes" : "Read again"}
        </Button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {error ? error : null}{" "}
        {feed
          ? `${feed.liveCount} live records this pass · fetched ${fetchedLabel ?? "just now"}`
          : "Opening the indexes…"}
      </p>

      <div className="mt-8 space-y-4">
        {papers.map((paper) => (
          <article
            key={paper.id}
            className="rounded-3xl bg-card p-5 shadow-[0_0_0_1px_rgba(22,20,16,0.08)] sm:p-7"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={paper.source === "canon" ? "default" : "muted"}>
                {paper.source === "canon" ? "Canon" : paper.source === "openalex" ? "OpenAlex" : "Crossref"}
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
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={readingId === paper.id}
                onClick={() => void onRead(paper)}
              >
                {readingId === paper.id ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Reading through the framework
                  </>
                ) : readings[paper.id] ? (
                  "Read through the AP Framework"
                ) : (
                  "Read through the AP Framework"
                )}
              </Button>
              {paper.doi ? (
                <a
                  href={`https://doi.org/${paper.doi}`}
                  className="text-xs text-primary underline decoration-primary/30 underline-offset-4"
                  target="_blank"
                  rel="noreferrer"
                >
                  {paper.doi}
                </a>
              ) : null}
            </div>
            {readings[paper.id] ? (
              <div className="mt-4 whitespace-pre-line rounded-2xl bg-paper px-4 py-4 text-sm leading-relaxed text-foreground">
                {readings[paper.id]}
              </div>
            ) : null}
            {readError[paper.id] ? (
              <p className="mt-3 text-sm text-clay">{readError[paper.id]}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
