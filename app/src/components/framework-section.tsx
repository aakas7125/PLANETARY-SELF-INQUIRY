import { frameworkBlocks, frameworkIntro, frameworkNotes } from "@/lib/framework";

export function FrameworkSection() {
  return (
    <section id="framework" className="border-t border-border bg-paper/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Acharya Prashant
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl sm:text-5xl">
          {frameworkIntro.title}
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">{frameworkIntro.lead}</p>
        <a
          href={frameworkIntro.href}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex h-11 items-center text-sm text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
        >
          Read the AP Framework in full
        </a>

        <div className="mt-12 space-y-10">
          {frameworkBlocks.map((block) => (
            <article
              key={block.id}
              className="grid gap-6 rounded-3xl bg-card p-5 shadow-[0_0_0_1px_rgba(22,20,16,0.08)] sm:p-8 lg:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {block.kicker}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-snug">{block.title}</h3>
              </div>
              <div>
                <p className="text-foreground">{block.body}</p>
                {block.quote ? (
                  <blockquote className="mt-5 border-l-2 border-primary pl-4 font-display text-xl leading-snug text-foreground">
                    {block.quote}
                  </blockquote>
                ) : null}
                {block.source ? (
                  <a
                    href={block.source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-xs text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                  >
                    {block.source.label}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 space-y-2 text-xs text-muted-foreground">
          {frameworkNotes.map((n) => (
            <p key={n.slice(0, 40)}>{n}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
