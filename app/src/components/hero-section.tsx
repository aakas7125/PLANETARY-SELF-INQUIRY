import { ArrowDown } from "lucide-react";
import { useHousehold } from "@/store/household";

export function HeroSection() {
  const names = useHousehold((s) => s.names);
  const setName = useHousehold((s) => s.setName);

  return (
    <section id="top" className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pb-24 sm:pt-16">
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
        A living ledger
      </p>
      <h1 className="mt-5 max-w-4xl font-display text-5xl leading-[1.08] text-foreground sm:text-6xl">
        If you want to protect just four people, you have to protect the whole planet.
      </h1>
      <p className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
        There is no private climate. This page investigates whether the people you call
        “mine” can in fact be protected independently of the ecological and human systems
        you call “other.” Science traces the dependencies.{" "}
        <a
          className="text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
          href="https://acharyaprashant.org/en/ap-framework"
          target="_blank"
          rel="noreferrer"
        >
          Acharya Prashant’s AP Framework
        </a>{" "}
        is a lens for self-inquiry — not a verdict on your motives, and not a theorem
        already proved.
      </p>

      <div className="mt-10 max-w-3xl rounded-3xl bg-card p-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)] sm:p-6">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          Name the four you would save
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {names.map((name, i) => (
            <label key={i} className="block">
              <span className="sr-only">Person {i + 1}</span>
              <input
                value={name}
                onChange={(e) => setName(i as 0 | 1 | 2 | 3, e.target.value)}
                className="h-12 w-full rounded-xl border-0 bg-paper px-4 font-display text-lg text-foreground shadow-[0_0_0_1px_rgba(22,20,16,0.08)] outline-none ring-ring/40 placeholder:text-muted-foreground focus:ring-2"
                placeholder={`Person ${i + 1}`}
              />
            </label>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Name them. Then follow how far the systems that keep them alive actually reach.
        </p>
      </div>

      <a
        href="#ledger"
        className="mt-10 inline-flex h-11 items-center gap-2 text-sm text-primary"
      >
        Open the household ledger
        <ArrowDown className="size-4" />
      </a>
    </section>
  );
}
