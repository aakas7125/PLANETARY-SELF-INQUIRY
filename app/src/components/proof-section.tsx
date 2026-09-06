import { proofClose, proofLead, proofLinks } from "@/lib/proof";
import { useHousehold } from "@/store/household";

export function ProofSection() {
  const result = useHousehold((s) => s.result);
  const names = result.names;

  const lived = [
    {
      label: "Dangerous heat days",
      value: String(result.heatDays),
      hint: `around ${result.place.name}, order-of-magnitude under further warming`,
    },
    {
      label: "Food-price shock",
      value: `${Math.round(result.foodShock)}`,
      hint: "index of how exposed the kitchen is to other people's weather",
    },
    {
      label: "Water stress",
      value: `${Math.round(result.waterStress)}`,
      hint: "the tank is a delay, not a climate",
    },
    {
      label: "Smoke / foul-air days",
      value: String(result.airDays),
      hint: "filters buy hours, not a fire season",
    },
    {
      label: "Insurance retreat",
      value: `${Math.round(result.insuranceIndex)}`,
      hint: "when the pool of strangers refuses the house",
    },
    {
      label: "Social instability",
      value: `${Math.round(result.stabilityIndex)}`,
      hint: "the people othered first become the politics the four inherit",
    },
  ];

  return (
    <section id="proof" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        The theorem
      </p>
      <h2 className="mt-3 max-w-3xl font-display text-3xl sm:text-5xl">
        {names[0]}, {names[1]}, {names[2]}, {names[3]} are not a separate species.
      </h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">{proofLead}</p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {lived.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-card px-5 py-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]"
          >
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {item.label}
            </p>
            <p className="mt-1 font-display text-3xl tabular-nums text-clay">{item.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        These are illustrative indices scaled by local climate sensitivity and this household’s
        overshoot — not a forecast of a single year. They exist to make the pathway home visible.
      </p>

      <ol className="mt-12 space-y-0">
        {proofLinks.map((link, i) => (
          <li
            key={link.id}
            className="grid gap-4 border-t border-border py-8 sm:grid-cols-[4.5rem_minmax(0,1fr)_9rem] sm:gap-8"
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
        If this household’s consumption class were copied worldwide, a world near{" "}
        <span className="tabular-nums text-foreground">
          {result.classCopyWarming.toFixed(1)}°C
        </span>{" "}
        of warming is the kind of century the four would be asked to grow old in. That is not a
        private risk. It is a commons wearing a family name.
      </p>
    </section>
  );
}
