import type { HouseholdResult } from "@/lib/calc";

export function FourOrbs({ result }: { result: HouseholdResult }) {
  const heat = Math.min(1, result.earths / 4);
  const ring = 78 - heat * 10;
  const inner = 22 + (1 - result.safety / 100) * 8;
  const glow = `oklch(${0.72 - heat * 0.22} ${0.12 + heat * 0.08} ${45 + heat * 20})`;
  const atmosphere = `oklch(${0.55 - heat * 0.15} ${0.08 + heat * 0.1} ${150 - heat * 90})`;

  return (
    <svg
      viewBox="0 0 240 240"
      className="mx-auto w-full max-w-[240px]"
      role="img"
      aria-label={`Safety of the four at ${Math.round(result.safety)} percent as consumption rises`}
    >
      <circle cx="120" cy="120" r="108" fill="none" stroke="currentColor" strokeOpacity="0.08" />
      <circle
        cx="120"
        cy="120"
        r={ring}
        fill="none"
        stroke={atmosphere}
        strokeWidth={10 + heat * 8}
        strokeOpacity={0.35 + heat * 0.35}
      />
      <circle cx="120" cy="120" r="46" fill="var(--color-card)" stroke="currentColor" strokeOpacity="0.14" />
      <circle cx="120" cy="120" r={inner} fill="none" stroke="var(--color-primary)" strokeOpacity="0.35" />
      {[
        [108, 108],
        [132, 108],
        [108, 132],
        [132, 132],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r="5.5"
          fill={heat > 0.55 ? "var(--color-clay)" : "var(--color-primary)"}
        />
      ))}
      <circle cx="120" cy="120" r="2" fill={glow} />
    </svg>
  );
}
