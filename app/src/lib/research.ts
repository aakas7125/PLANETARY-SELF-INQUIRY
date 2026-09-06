import { createServerFn } from "@tanstack/react-start";
import { canonPapers, reconstructAbstract, whyFromText, type Paper } from "./papers";

type OpenAlexWork = {
  id: string;
  display_name?: string;
  title?: string;
  publication_year?: number;
  doi?: string | null;
  cited_by_count?: number;
  abstract_inverted_index?: Record<string, number[]>;
  authorships?: { author?: { display_name?: string } }[];
  primary_location?: { source?: { display_name?: string } | null; landing_page_url?: string | null };
  open_access?: { oa_url?: string | null };
};

type CrossrefWork = {
  DOI?: string;
  title?: string[];
  author?: { given?: string; family?: string }[];
  issued?: { "date-parts"?: number[][] };
  abstract?: string;
  "container-title"?: string[];
  URL?: string;
  "is-referenced-by-count"?: number;
};

function unwrapAbstract(raw: string): string {
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapOpenAlex(work: OpenAlexWork): Paper | null {
  const title = (work.display_name || work.title || "").trim();
  if (!title) return null;
  const abstract = reconstructAbstract(work.abstract_inverted_index);
  const authors =
    (work.authorships ?? [])
      .map((a) => a.author?.display_name)
      .filter(Boolean)
      .slice(0, 4)
      .join(", ") || "Unknown authors";
  const doi = work.doi ? work.doi.replace("https://doi.org/", "") : undefined;
  const url =
    (doi ? `https://doi.org/${doi}` : null) ||
    work.primary_location?.landing_page_url ||
    work.open_access?.oa_url ||
    work.id;
  return {
    id: work.id,
    title,
    authors,
    year: work.publication_year ?? new Date().getFullYear(),
    venue: work.primary_location?.source?.display_name || "Journal article",
    abstract: abstract.slice(0, 900),
    doi,
    url,
    citedBy: work.cited_by_count,
    source: "openalex",
    why: whyFromText(title, abstract),
    topics: [],
  };
}

function mapCrossref(work: CrossrefWork): Paper | null {
  const title = work.title?.[0]?.trim();
  if (!title) return null;
  const abstract = work.abstract ? unwrapAbstract(work.abstract) : "";
  const authors =
    (work.author ?? [])
      .slice(0, 4)
      .map((a) => [a.given, a.family].filter(Boolean).join(" "))
      .filter(Boolean)
      .join(", ") || "Unknown authors";
  const year = work.issued?.["date-parts"]?.[0]?.[0] ?? new Date().getFullYear();
  const doi = work.DOI;
  return {
    id: doi ? `cr:${doi}` : `cr:${title.slice(0, 40)}`,
    title,
    authors,
    year,
    venue: work["container-title"]?.[0] || "Journal article",
    abstract: abstract.slice(0, 900),
    doi,
    url: doi ? `https://doi.org/${doi}` : work.URL || "#",
    citedBy: work["is-referenced-by-count"],
    source: "crossref",
    why: whyFromText(title, abstract),
    topics: [],
  };
}

async function fetchJson(url: string, timeoutMs: number): Promise<unknown | null> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "ProtectFour/1.0 (https://acharyaprashant.org; research ledger)",
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function isClimatePaper(p: Paper): boolean {
  const t = `${p.title} ${p.abstract} ${p.venue}`.toLowerCase();
  const hits = [
    "climate",
    "warming",
    "emission",
    "carbon",
    "anthropogenic",
    "greenhouse",
    "biodiversity",
    "planetary",
    "heatwave",
    "drought",
    "ice sheet",
    "methane",
    "deforestation",
    "ocean acid",
  ];
  return hits.some((h) => t.includes(h));
}

export const fetchRecentPapers = createServerFn({ method: "GET" }).handler(async () => {
  const openAlexUrl =
    "https://api.openalex.org/works?search=anthropogenic%20climate%20change%20emissions%20impacts" +
    "&filter=from_publication_date:2024-01-01,type:article,has_abstract:true,cited_by_count:>2" +
    "&sort=publication_date:desc&per_page=16" +
    "&select=id,doi,title,display_name,publication_year,cited_by_count,abstract_inverted_index,authorships,primary_location,open_access";

  const crossrefUrl =
    "https://api.crossref.org/works?query.bibliographic=anthropogenic%20climate%20change" +
    "&filter=from-pub-date:2024-01-01,type:journal-article" +
    "&sort=published&order=desc&rows=12&select=DOI,title,author,issued,abstract,container-title,URL,is-referenced-by-count";

  const [oaRaw, crRaw] = await Promise.all([
    fetchJson(openAlexUrl, 8000),
    fetchJson(crossrefUrl, 8000),
  ]);

  const live: Paper[] = [];
  if (oaRaw && typeof oaRaw === "object" && "results" in oaRaw) {
    const results = (oaRaw as { results: OpenAlexWork[] }).results ?? [];
    for (const w of results) {
      const mapped = mapOpenAlex(w);
      if (mapped && isClimatePaper(mapped)) live.push(mapped);
    }
  }
  if (live.length < 6 && crRaw && typeof crRaw === "object" && "message" in crRaw) {
    const items = (crRaw as { message: { items?: CrossrefWork[] } }).message.items ?? [];
    for (const w of items) {
      const mapped = mapCrossref(w);
      if (mapped && isClimatePaper(mapped) && !live.some((p) => p.doi && p.doi === mapped.doi)) {
        live.push(mapped);
      }
    }
  }

  const seen = new Set<string>();
  const merged: Paper[] = [];
  for (const p of [...live, ...canonPapers]) {
    const key = (p.doi || p.title).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(p);
  }

  return {
    fetchedAt: new Date().toISOString(),
    liveCount: live.length,
    papers: merged.slice(0, 18),
  };
});

export const interpretPaper = createServerFn({ method: "POST" })
  .validator((input: { title: string; abstract: string; venue: string; year: number }) => input)
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      return { ok: false as const, error: "Reading is unavailable in this environment." };
    }

    const prompt = `You are reading a climate-science paper through Acharya Prashant's AP Framework (ego as incomplete "I"; greed and fear as desire and its defence; otherness as mine vs not-mine; consumption of man, objects, and nature; climate as symptom of inner hollowness; Change = Seeing + Intent).

Paper: "${data.title}" (${data.venue}, ${data.year})
Abstract: ${data.abstract || "(no abstract)"}

Write exactly two short paragraphs (120-180 words total):
1) What the paper actually shows, in plain language, as physical science.
2) How this finding lands on a household that wants to protect "just four people" — name greed, fear, or otherness only if they are the honest mechanism, not as decoration.

No bullet points. No hype. No policy slogans. Do not invent results not in the abstract.`;

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 420,
          temperature: 0.4,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        return { ok: false as const, error: "The reading could not be completed just now." };
      }
      const body = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = body.choices?.[0]?.message?.content?.trim() ?? "";
      if (!text) return { ok: false as const, error: "Empty reading." };
      return { ok: true as const, text };
    } catch {
      return { ok: false as const, error: "The reading could not be completed just now." };
    }
  });
