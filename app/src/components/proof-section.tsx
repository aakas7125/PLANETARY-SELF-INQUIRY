import { proofClose, proofLead, proofLinks } from "@/lib/proof";
import { useHousehold } from "@/store/household";

const dependencies = [
  {
    label: "Air",
    value: "Shared atmosphere",
    hint: "Greenhouse gases and air pollution move beyond household boundaries.",
    sourceId: "air",
  },
  {
    label: "Heat",
    value: "Shelter & power",
    hint: "Exposure depends on weather, buildings, health, electricity, and access to cooling.",
    sourceId: "heat",
  },
  {
    label: "Food",
    value: "Farms to markets",
    hint: "The kitchen depends on soils, water, labour, transport, energy, and prices.",
    sourceId: "food",
  },
  {
    label: "Water",
    value: "Cycle & infrastructure",
    hint: "Household supply depends on hydrology, energy, treatment, pipes, and governance.",
    sourceId: "water",
  },
  {
    label: "Smoke / pollution",
    value: "Air systems",
    hint: "Filters can reduce exposure; they do not make the surrounding air independent.",
    sourceId: "smoke",
  },
  {
    label: "Disease / health",
    value: "Public health",
    hint: "Health depends on climate, ecosystems, sanitation, care, and collective prevention.",
    sourceId: "disease",
  },
  {
    label: "Money / insurance",
    value: "Shared risk pools",
    hint: "Property protection depends on insurers, infrastructure, public finance, and neighbours.",
    sourceId: "money",
  },
  {
    label: "Peace / stability",
    value: "Social systems",
    hint: "Food, housing, displacement, institutions, and politics connect private life to the wider century.",
    sourceId: "peace",
  },
];

export function ProofSection() {
  const names = useHousehold((s) => s.result.names);

  return (
    <section id="proof" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        Follow the dependencies
      </p>
      <h2 className="mt-3 max-w-3xl font-display text-3xl sm:text-5xl">
        {names[0]}, {names[1]}, {names[2]}, {names[3]} are not a separate species.
      </h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">{proofLead}</p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {dependencies.map((item) => (
          <div
            key={item.label}
            className="flex min-h-40 flex-col rounded-2xl bg-card px-5 py-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]"
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1 font-display text-2xl text-clay">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
            <a
              href={`#evidence-${item.sourceId}`}
              className="mt-auto pt-4 text-xs text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
            >
              Inspect evidence
            </a>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        These are dependency pathways, not numerical forecasts for this household. Follow each
        pathway to the cited evidence below.
      </p>

      <ol className="mt-12 space-y-0">
        {proofLinks.map((link, i) => (
          <li
            key={link.id}
            id={`evidence-${link.id}`}
            className="grid scroll-mt-24 gap-4 border-t border-border py-8 sm:grid-cols-[4.5rem_minmax(0,1fr)_9rem] sm:gap-8"
          >
            <p className="font-display text-2xl text-muted-foreground">{link.n}</p>
            <div>
              <h3 className="font-display text-2xl">{link.title}</h3>
              <p className="mt-2 font-medium text-foreground">{link.claim}</p>
              <p className="mt-2 text-sm text-muted-foreground sm:text-base">{link.body}</p>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
              >
                {link.citation}
              </a>
            </div>
            <div className={i % 2 === 0 ? "sm:text-right" : "sm:text-right"}>
              <p className="font-display text-2xl text-primary">{link.number}</p>
              <p className="mt-1 text-xs text-muted-foreground">{link.numberLabel}</p>
            </div>
          </li>
        ))}
      </ol>

      <blockquote className="mt-4 max-w-3xl font-display text-2xl leading-snug text-foreground sm:text-3xl">
        {proofClose}
      </blockquote>
      <p className="mt-6 max-w-2xl text-sm text-muted-foreground">
        If this household’s consumption pattern were widely copied, which shared systems would
        carry the consequences? No temperature for that scenario is calculated here. The inquiry
        is whether the four can be secured while depending on the same commons as everyone else.
      </p>
    </section>
  );
}
