import type { constitutionDocument } from "@/lib/constitution/constitution-locale.mjs";

type ConstitutionCopy = ReturnType<typeof constitutionDocument>;
type ConstitutionText = ConstitutionCopy["pageTitle"];
type ConstitutionUnit = ConstitutionCopy["description"];

function textLang(contentLang: ConstitutionCopy["contentLang"], text: ConstitutionText) {
  return text.lang === contentLang ? undefined : text.lang;
}

function UnitParagraph({
  unit,
  contentLang,
}: {
  unit: ConstitutionUnit;
  contentLang: ConstitutionCopy["contentLang"];
}) {
  const className = "max-w-2xl text-base leading-relaxed text-foreground sm:text-lg";
  const lang = textLang(contentLang, unit);
  if (unit.linkPhrase && unit.href && unit.text.includes(unit.linkPhrase)) {
    const start = unit.text.indexOf(unit.linkPhrase);
    const before = unit.text.slice(0, start);
    const after = unit.text.slice(start + unit.linkPhrase.length);
    return (
      <p data-content-id={unit.id} lang={lang} className={className}>
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
    <p data-content-id={unit.id} lang={lang} className={className}>
      {unit.text}
    </p>
  );
}

function LifeSketch({ caption }: { caption: ConstitutionText }) {
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
      <figcaption className="mt-3 text-xs text-primary">{caption.text}</figcaption>
    </figure>
  );
}

function ChoiceSketch({ choices, caption }: { choices: ConstitutionText[]; caption: ConstitutionText }) {
  return (
    <figure aria-hidden="true">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {choices.map((choice) => (
          <li
            key={choice.id}
            className="border border-border bg-paper px-3 py-4 text-center text-sm text-balance text-foreground"
          >
            {choice.text}
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 text-xs text-primary">{caption.text}</figcaption>
    </figure>
  );
}

function SystemsSketch({ nodes, caption }: { nodes: ConstitutionText[]; caption: ConstitutionText }) {
  return (
    <figure aria-hidden="true">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {nodes.map((node) => (
          <li key={node.id} className="border border-border bg-paper px-3 py-3 text-sm text-balance text-foreground">
            {node.text}
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 text-xs text-primary">{caption.text}</figcaption>
    </figure>
  );
}

function EvidenceSketch({
  domains,
  unknown,
  modelled,
  caption,
}: {
  domains: ConstitutionText[];
  unknown: ConstitutionText;
  modelled: ConstitutionText;
  caption: ConstitutionText;
}) {
  return (
    <figure aria-hidden="true">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {domains.map((domain) => (
          <div key={domain.id} className="border border-border bg-paper px-3 py-3">
            <p className="text-sm text-foreground">{domain.text}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.14em] text-primary">{unknown.text}</p>
            <p className="mt-2 text-xs text-foreground">{modelled.text}</p>
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-xs text-primary">{caption.text}</figcaption>
    </figure>
  );
}

function QuestionSketch({ notSure, caption }: { notSure: ConstitutionText; caption: ConstitutionText }) {
  return (
    <figure className="border border-border bg-paper px-5 py-5" aria-hidden="true">
      <p className="font-display text-2xl text-balance text-foreground">{notSure.text}</p>
      <div className="mt-4 space-y-3" aria-hidden="true">
        <span className="block h-px bg-border" />
        <span className="block h-px bg-border" />
        <span className="block h-px bg-border" />
      </div>
      <figcaption className="mt-4 text-xs text-primary">{caption.text}</figcaption>
    </figure>
  );
}

function ReturnSketch({ choices, caption }: { choices: ConstitutionText[]; caption: ConstitutionText }) {
  return (
    <figure aria-hidden="true">
      <ul className="grid gap-2 sm:grid-cols-2">
        {choices.map((choice) => (
          <li key={choice.id} className="flex items-center gap-3 border border-border bg-paper px-3 py-3 text-sm text-foreground">
            <span className="size-4 shrink-0 rounded-full border border-foreground/70" />
            <span className="min-w-0 text-balance">{choice.text}</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 text-xs text-primary">{caption.text}</figcaption>
    </figure>
  );
}

function SceneVisual({ copy, kind }: { copy: ConstitutionCopy; kind: string }) {
  if (kind === "life") return <LifeSketch caption={copy.lifeCaption} />;
  if (kind === "choices") return <ChoiceSketch choices={copy.choices} caption={copy.choiceCaption} />;
  if (kind === "systems") return <SystemsSketch nodes={copy.systems} caption={copy.systemCaption} />;
  if (kind === "evidence") {
    return (
      <EvidenceSketch
        domains={copy.evidenceDomains}
        unknown={copy.unknown}
        modelled={copy.modelled}
        caption={copy.evidenceCaption}
      />
    );
  }
  if (kind === "questions") return <QuestionSketch notSure={copy.notSure} caption={copy.questionCaption} />;
  if (kind === "return") return <ReturnSketch choices={copy.openChoices} caption={copy.returnCaption} />;
  return null;
}

export function PublicConstitution({ copy }: { copy: ConstitutionCopy }) {
  return (
    <article>
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">{copy.eyebrow.text}</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl text-balance leading-tight text-foreground sm:text-6xl">
        {copy.pageTitle.text}
      </h1>

      <div className="mt-14 space-y-16 sm:space-y-24">
        {copy.scenes.map((scene, index) => (
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
              lang={textLang(copy.contentLang, scene.title)}
              className="mt-3 max-w-3xl font-display text-3xl text-balance text-foreground sm:text-4xl"
            >
              {scene.title.text}
            </h2>
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,0.7fr)] lg:items-start">
              <div className="space-y-6">
                {scene.blocks.map((block) => (
                  <div key={`${scene.id}-${block.heading?.id ?? block.units[0]?.id}`} className="space-y-4">
                    {block.heading ? (
                      <h3
                        lang={textLang(copy.contentLang, block.heading)}
                        className="font-display text-2xl text-balance text-foreground"
                      >
                        {block.heading.text}
                      </h3>
                    ) : null}
                    {block.units.map((unit) => (
                      <UnitParagraph key={`${scene.id}-${unit.id}`} unit={unit} contentLang={copy.contentLang} />
                    ))}
                  </div>
                ))}
              </div>
              <SceneVisual copy={copy} kind={scene.visual} />
            </div>
          </section>
        ))}
      </div>

      <details className="mt-16 border-t border-border pt-8">
        <summary className="cursor-pointer text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {copy.sourcesSummary.text}
        </summary>
        <p lang={textLang(copy.contentLang, copy.sourcesIntro)} className="mt-4 max-w-2xl text-sm leading-relaxed text-foreground">
          {copy.sourcesIntro.text}
        </p>
        <ul className="mt-4 space-y-2">
          {copy.reviewLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                lang={textLang(copy.contentLang, link)}
                rel="noreferrer"
                className="text-sm text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </details>
    </article>
  );
}
