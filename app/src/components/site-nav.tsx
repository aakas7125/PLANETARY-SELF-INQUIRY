import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const sectionLinks = [
  { href: "/#ledger", label: "Ledger" },
  { href: "/#proof", label: "Dependencies" },
  { href: "/#framework", label: "Framework" },
  { href: "/#papers", label: "Papers" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-200",
        scrolled
          ? "border-border bg-background/92 backdrop-blur-md"
          : "border-transparent bg-background/70",
      )}
    >
      <div className="mx-auto flex min-h-14 max-w-6xl flex-wrap items-center justify-between gap-x-2 gap-y-1 px-4 py-2 sm:h-16 sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-0">
        <a href="/#top" className="flex shrink-0 items-center gap-2.5 text-foreground">
          <span className="relative flex size-7 items-center justify-center" aria-hidden>
            <span className="absolute inset-0 rounded-full border border-primary/40" />
            <span className="grid grid-cols-2 gap-0.5">
              <span className="size-1 rounded-full bg-primary" />
              <span className="size-1 rounded-full bg-primary" />
              <span className="size-1 rounded-full bg-primary" />
              <span className="size-1 rounded-full bg-clay" />
            </span>
          </span>
          <span className="font-display text-base tracking-tight sm:text-lg">Protect Four</span>
        </a>
        <nav
          className="flex min-w-0 flex-wrap items-center justify-end gap-x-1 gap-y-0 sm:gap-2"
          aria-label="Sections"
        >
          {sectionLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-1.5 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground sm:px-3 sm:text-sm"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/journey"
            className="rounded-md px-1.5 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground sm:px-3 sm:text-sm"
          >
            Journey
          </a>
        </nav>
      </div>
    </header>
  );
}
