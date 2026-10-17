// Verbatim copy of the unexported StageGlyph in app/src/components/smartphone-lifecycle.tsx
// (accepted at app tree d48217e3). Parity of the rendered SVG paths is asserted by verify-parity.mjs.
export function StageGlyph({ id }: { id: string }) {
  const common = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
    className: "h-10 w-10",
  };

  if (id === "raw-materials") {
    return (
      <svg {...common}>
        <path d="M24 8 32 20H16Z" />
        <path d="M14 22 22 34H6Z" />
        <path d="M34 22 42 34H26Z" />
      </svg>
    );
  }
  if (id === "refining-processing") {
    return (
      <svg {...common}>
        <path d="M16 10h16l-3 10H19Z" />
        <path d="M19 20h10v6c0 6-2 10-5 10s-5-4-5-10Z" />
        <path d="M18 40h12" />
      </svg>
    );
  }
  if (id === "components") {
    return (
      <svg {...common}>
        <rect x="14" y="14" width="20" height="20" rx="2" />
        <path d="M18 14v-4M24 14v-4M30 14v-4M18 34v4M24 34v4M30 34v4M14 18h-4M14 24h-4M14 30h-4M34 18h4M34 24h4M34 30h4" />
      </svg>
    );
  }
  if (id === "assembly") {
    return (
      <svg {...common}>
        <rect x="18" y="10" width="12" height="28" rx="2" />
        <path d="M8 16h6M8 24h6M8 32h6M34 16h6M34 24h6M34 32h6" />
      </svg>
    );
  }
  if (id === "distribution-transport") {
    return (
      <svg {...common}>
        <rect x="8" y="14" width="20" height="16" rx="1.5" />
        <path d="M8 20h20" />
        <path d="M32 22h8M36 18l4 4-4 4" />
      </svg>
    );
  }
  if (id === "use-repair") {
    return (
      <svg {...common}>
        <rect x="16" y="8" width="16" height="28" rx="2" />
        <path d="M22 32h4" />
        <path d="M30 28l8 8M34 26l6 6" />
      </svg>
    );
  }
  if (id === "resale-refurbishment-second-life") {
    return (
      <svg {...common}>
        <rect x="6" y="12" width="14" height="24" rx="2" />
        <rect x="28" y="12" width="14" height="24" rx="2" />
        <path d="M12 32h2M34 32h2" />
      </svg>
    );
  }
  if (id === "end-of-life") {
    return (
      <svg {...common}>
        <rect x="16" y="8" width="16" height="28" rx="2" strokeDasharray="3 2" />
        <path d="M22 32h4" />
        <path d="M10 40h28" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <circle cx="24" cy="24" r="8" />
    </svg>
  );
}
