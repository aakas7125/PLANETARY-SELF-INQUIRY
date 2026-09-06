import { useHousehold } from "@/store/household";

export function CloseSection() {
  const names = useHousehold((s) => s.names);

  return (
    <section className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary-foreground/70">
          The only security strategy that works
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-3xl leading-tight sm:text-5xl">
          To love {names[0] || "one"}, {names[1] || "two"}, {names[2] || "three"}, and{" "}
          {names[3] || "four"} without othering the rest is already to protect the planet they
          must breathe.
        </h2>
        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
          The AP Framework is not a green lifestyle brand. It is a diagnosis: the ego consumes
          because it is incomplete; greed and fear are that incompleteness reaching and defending;
          otherness is how it draws a fence and calls the fence love. Science is the demonstration
          that the fence is drawn on a single air, a single hydrology, a single food web, a single
          century. Seeing is not yet change. Change is seeing plus intent — a turn in which the
          four are no longer a private species.
        </p>
        <p className="mt-6 max-w-2xl text-sm text-primary-foreground/80">
          Man, as he is, is climate change. The four will not be spared a constitution he refuses
          to examine. The cleanest energy on Earth is contentment. The greatest regulator is a
          mind that no longer needs the world to complete it.
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
