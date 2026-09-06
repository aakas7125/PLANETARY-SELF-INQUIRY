import { useHousehold } from "@/store/household";

export function CloseSection() {
  const names = useHousehold((s) => s.names);

  return (
    <section className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground/70">
          What remains to be seen
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight sm:text-5xl">
          To love {names[0] || "one"}, {names[1] || "two"}, {names[2] || "three"}, and{" "}
          {names[3] || "four"} is already to live inside the air they must breathe.
        </h2>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
          The AP Framework is not a green lifestyle brand. It offers a reading: ego as
          incompleteness; greed and fear as that incompleteness reaching and defending;
          otherness as a fence called love. That is philosophy to examine — not a verdict
          on you. Earth-system science investigates whether the fence is drawn on a single
          air, a single hydrology, a single food web, a single century. Seeing is not yet
          change. In that framework, change is seeing plus intent, if you want it.
        </p>
        <p className="mt-6 max-w-2xl text-sm text-primary-foreground/80">
          Acharya Prashant writes that man, as he is, is climate change. That is an AP claim;
          science does not inherit it. The four will still live in the systems this page
          traces. Whether contentment is the cleanest energy is a question the framework
          raises — not a score this ledger assigns.
        </p>
        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a
            className="underline decoration-primary-foreground/30 underline-offset-4 hover:decoration-primary-foreground"
            href="https://acharyaprashant.org/en/ap-framework"
            target="_blank"
            rel="noreferrer"
          >
            AP Framework
          </a>
          <a
            className="underline decoration-primary-foreground/30 underline-offset-4 hover:decoration-primary-foreground"
            href="https://acharyaprashant.org/en/articles/man-is-climate-change-1_3743466"
            target="_blank"
            rel="noreferrer"
          >
            Man Is Climate Change
          </a>
          <a
            className="underline decoration-primary-foreground/30 underline-offset-4 hover:decoration-primary-foreground"
            href="https://doi.org/10.5194/essd-18-3889-2026"
            target="_blank"
            rel="noreferrer"
          >
            IGCC 2025
          </a>
        </div>
      </div>
    </section>
  );
}
