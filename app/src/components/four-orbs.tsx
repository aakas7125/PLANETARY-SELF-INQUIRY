const RING_RADIUS = 78;
const GLOW = "oklch(0.72 0.12 45)";
const ATMOSPHERE = "oklch(0.55 0.08 150)";

export function FourOrbs() {

  return (
    <svg
      viewBox="0 0 240 240"
      className="mx-auto w-full max-w-[240px]"
      role="img"
      aria-label="Four people inside shared air, water, food, and energy systems"
    >
      <circle cx="120" cy="120" r="108" fill="none" stroke="currentColor" strokeOpacity="0.08" />
      <circle
        cx="120"
        cy="120"
        r={RING_RADIUS}
        fill="none"
        stroke={ATMOSPHERE}
        strokeWidth={10}
        strokeOpacity={0.35}
      />
      <circle cx="120" cy="120" r="46" fill="var(--color-card)" stroke="currentColor" strokeOpacity="0.14" />
      <circle cx="120" cy="120" r="26" fill="none" stroke="var(--color-primary)" strokeOpacity="0.35" />
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
          fill="var(--color-primary)"
        />
      ))}
      <circle cx="120" cy="120" r="2" fill={GLOW} />
    </svg>
  );
}
