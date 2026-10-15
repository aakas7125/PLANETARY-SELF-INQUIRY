import {
  PUBLIC_CONSTITUTION_PAGE_TITLE,
  PUBLIC_CONSTITUTION_REVIEW_LINKS,
  PUBLIC_CONSTITUTION_SCENES,
  PUBLIC_CONSTITUTION_UNITS,
} from "@/lib/constitution/public-constitution.mjs";

const CHOICE_PATHS = [
  "Keep",
  "Repair",
  "Used or second-hand",
  "Refurbished",
  "New",
  "Investigate further",
];

const OPEN_CHOICES = [...CHOICE_PATHS, "Unclear"];

const SYSTEM_NODES = [
  "Materials",
  "Processing",
  "Components",
  "Transport",
  "Use / repair",
  "Second life",
  "End of life",
  "People",
  "Ecosystems",
];

const EVIDENCE_DOMAINS = ["Climate", "Materials", "Water", "Waste", "People", "Ecosystems"];

type ConstitutionUnit = {
  id: string;
  text: string;
  linkPhrase?: string;
  href?: string;
};

function unitById(id: string): ConstitutionUnit {
  const unit = PUBLIC_CONSTITUTION_UNITS[id as keyof typeof PUBLIC_CONSTITUTION_UNITS];
  if (!unit) {
    throw new Error(`Missing constitution unit ${id}`);
  }
  return unit;
}

function UnitParagraph({ unit }: { unit: ConstitutionUnit }) {
  const className = "max-w-2xl text-base leading-relaxed text-foreground sm:text-lg";
  if (unit.linkPhrase && unit.href && unit.text.includes(unit.linkPhrase)) {
    const start = unit.text.indexOf(unit.linkPhrase);
    const before = unit.text.slice(0, start);
    const after = unit.text.slice(start + unit.linkPhrase.length);
    return (
      <p data-content-id={unit.id} className={className}>
        {before}
        <a
          href={unit.href}
          rel="noreferrer"
          className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {unit.linkPhrase}
        </a>
        {after}
      </p>
    );
  }
  return (
    <p data-content-id={unit.id} className={className}>
      {unit.text}
    </p>
  );
}

function SceneVisual({ kind }: { kind: string }) {
  if (kind === "life") return <LifeSketch />;
  if (kind === "choices") return <ChoiceSketch />;
  if (kind === "systems") return <SystemsSketch />;
  if (kind === "evidence") return <EvidenceSketch />;
  if (kind === "questions") return <QuestionSketch />;
  if (kind === "return") return <ReturnSketch />;
  return null;
}

function LifeSketch() {
  return (
    <figure className="border border-border bg-paper px-4 py-5" aria-hidden="true">
      <svg viewBox="0 0 280 160" className="h-auto w-full text-foreground">
        <path d="M16 132h248" stroke="currentColor" strokeWidth="1.5" />
        <rect x="28" y="36" width="70" height="96" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="48" y="50" width="28" height="44" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="62" cy="108" r="3" fill="currentColor" />
        <circle cx="138" cy="78" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M138 88v28" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="176" cy="86" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M176 96v22" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="210" cy="94" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M210 102v18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M248 132v-30" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="248" cy="94" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <figcaption className="mt-3 text-xs text-primary">A phone among ordinary things, and people nearby.</figcaption>
    </figure>
  );
}

function ChoiceSketch() {
  return (
    <figure aria-hidden="true">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {CHOICE_PATHS.map((path) => (
          <li
            key={path}
            className="border border-border bg-paper px-3 py-4 text-center text-sm text-foreground"
          >
            {path}
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 text-xs text-primary">
        Side by side. None is marked as the better purchase.
      </figcaption>
    </figure>
  );
}

function SystemsSketch() {
  return (
    <figure aria-hidden="true">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {SYSTEM_NODES.map((node) => (
          <li key={node} className="border border-border bg-paper px-3 py-3 text-sm text-foreground">
            {node}
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 text-xs text-primary">
        Illustrative. Not a measurement or a causal model.
      </figcaption>
    </figure>
  );
}

function EvidenceSketch() {
  return (
    <figure aria-hidden="true">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {EVIDENCE_DOMAINS.map((domain) => (
          <div key={domain} className="border border-border bg-paper px-3 py-3">
            <p className="text-sm text-foreground">{domain}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-primary">Unknown</p>
            <p className="mt-2 text-xs text-foreground">Modelled or conditional</p>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-xs text-primary">
        Separate domains. No single score.
      </figcaption>
    </figure>
  );
}

function QuestionSketch() {
  return (
    <figure className="border border-border bg-paper px-5 py-5" aria-hidden="true">
      <p className="font-display text-2xl text-foreground">“I’m not sure”</p>
      <div className="mt-4 space-y-3" aria-hidden="true">
        <span className="block h-px bg-border" />
        <span className="block h-px bg-border" />
        <span className="block h-px bg-border" />
      </div>
      <figcaption className="mt-4 text-xs text-primary">A literal answer, left as written.</figcaption>
    </figure>
  );
}

function ReturnSketch() {
  return (
    <figure aria-hidden="true">
      <ul className="grid gap-2 sm:grid-cols-2">
        {OPEN_CHOICES.map((choice) => (
          <li key={choice} className="flex items-center gap-3 border border-border bg-paper px-3 py-3 text-sm text-foreground">
            <span className="size-4 shrink-0 rounded-full border border-foreground/70" />
            {choice}
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 text-xs text-primary">Nothing in this panel is selected.</figcaption>
    </figure>
  );
}

export function PublicConstitution() {
  return (
    <article>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Principles</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-foreground sm:text-6xl">
        {PUBLIC_CONSTITUTION_PAGE_TITLE}
      </h1>

      <div className="mt-14 space-y-16 sm:space-y-24">
        {PUBLIC_CONSTITUTION_SCENES.map((scene, index) => (
          <section
            key={scene.id}
            id={`constitution-${scene.id}`}
            aria-labelledby={`constitution-${scene.id}-title`}
            className="scroll-mt-36 border-t border-border pt-10"
          >
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2
              id={`constitution-${scene.id}-title`}
              className="mt-3 max-w-3xl font-display text-3xl text-foreground sm:text-4xl"
            >
              {scene.title}
            </h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.7fr)] lg:items-start">
              <div className="space-y-6">
                {scene.blocks.map((block) => (
                  <div key={`${scene.id}-${block.heading ?? block.unitIds[0]}`} className="space-y-4">
                    {block.heading ? (
                      <h3 className="font-display text-2xl text-foreground">{block.heading}</h3>
                    ) : null}
                    {block.unitIds.map((id) => (
                      <UnitParagraph key={`${scene.id}-${id}`} unit={unitById(id)} />
                    ))}
                  </div>
                ))}
              </div>
              <SceneVisual kind={scene.visual} />
            </div>
          </section>
        ))}
      </div>

      <details className="mt-16 border-t border-border pt-8">
        <summary className="cursor-pointer text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          Sources for these promises
        </summary>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground">
          The sentences above are the accepted English public copy. These links open the project
          Constitution, the adopted public-copy handoff, and the public beta profile.
        </p>
        <ul className="mt-4 space-y-2">
          {PUBLIC_CONSTITUTION_REVIEW_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                rel="noreferrer"
                className="text-sm text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </article>
  );
}
