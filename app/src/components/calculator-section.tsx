import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip as RTooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { FourOrbs } from "@/components/four-orbs";
import { dietFootprint, dietOptions, formatT, type Diet } from "@/lib/calc";
import { places } from "@/lib/places";
import { useHousehold } from "@/store/household";
import { cn } from "@/lib/utils";

const LEDGER_QUALIFICATION =
  "This illustrative estimate excludes goods impacts, which are unquantified; it is not a complete audited footprint.";

const SLICE_COLORS: Record<string, string> = {
  diet: "var(--color-pine)",
  flights: "var(--color-primary)",
  car: "var(--color-clay)",
  home: "var(--color-heat)",
  services: "var(--color-border)",
};

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p
        className="mt-1 font-display text-2xl tabular-nums tracking-tight text-foreground sm:text-3xl"
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

const EV_ROAD_SHARE_NAME = "Household road kilometres travelled by electric vehicle (%)";
const EV_ROAD_SHARE_INSTRUCTION_ID = "ledger-ev-road-share-instruction";
const EV_ROAD_SHARE_INSTRUCTION =
  "Of your household’s road travel entered above for one year, what percentage is travelled in an electric vehicle? 0% means none of those kilometres; 100% means all of them.";
const EV_ROAD_SHARE_CONTEXT =
  "An electric kilometre still carries the local grid. Quieter is not the same as disconnected.";

const FLIGHTS_THUMB_NAME = "Long-haul-equivalent flights per year";
const FLIGHTS_HELPER_ID = "ledger-flights-helper";
const ROAD_THUMB_NAME = "Household road travel (kilometres per year)";
const HOME_THUMB_NAME = "Home electricity (kilowatt-hours per year)";

function FieldLabel({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-end justify-between gap-3">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-sm tabular-nums text-muted-foreground">{value}</p>
    </div>
  );
}

export function CalculatorSection() {
  const state = useHousehold();
  const { result } = state;
  const pie = result.slices.map((s) => ({ name: s.label, value: Number(s.t.toFixed(2)) }));

  return (
    <section id="ledger" className="border-t border-border bg-paper/60">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          The household ledger
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl sm:text-5xl">
          Every act of consumption is a claim on a commons the four must inhabit.
        </h2>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Numbers are order-of-magnitude, from published emission factors (Poore & Nemecek;
          household consumption reviews; national grid intensities). Not a kitchen audit — a
          seeing-device. Move the sliders. Watch how far the circle actually reaches.
        </p>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-12">
          <div className="rounded-3xl bg-card p-4 shadow-[0_0_0_1px_rgba(22,20,16,0.08)] sm:p-6 lg:col-span-7">
            <div className="space-y-8">
              <div>
                <FieldLabel title="Where the four live" value={result.place.region} />
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {places.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => state.setField("placeId", p.id)}
                      className={cn(
                        "h-11 rounded-xl px-3 text-left text-sm transition-colors",
                        state.placeId === p.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-paper text-foreground shadow-[0_0_0_1px_rgba(22,20,16,0.08)] hover:bg-muted",
                      )}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{result.place.blurb}</p>
              </div>

              <div>
                <FieldLabel title="Diet" value={dietFootprint[state.diet].label} />
                <div className="mt-3 flex flex-wrap gap-2">
                  {dietOptions.map((d: Diet) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => state.setField("diet", d)}
                      className={cn(
                        "h-11 rounded-full px-4 text-sm transition-colors",
                        state.diet === d
                          ? "bg-primary text-primary-foreground"
                          : "bg-paper text-foreground shadow-[0_0_0_1px_rgba(22,20,16,0.08)] hover:bg-muted",
                      )}
                    >
                      {dietFootprint[d].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel
                  title="Long-haul-equivalent flights / year"
                  value={`${state.flightsLhe}`}
                />
                <Slider
                  min={0}
                  max={12}
                  step={1}
                  value={[state.flightsLhe]}
                  onValueChange={([v]) => state.setField("flightsLhe", v ?? 0)}
                  thumbProps={{
                    "aria-label": FLIGHTS_THUMB_NAME,
                    "aria-describedby": FLIGHTS_HELPER_ID,
                  }}
                />
                <p id={FLIGHTS_HELPER_ID} className="text-xs text-muted-foreground">
                  One long-haul return ≈ 1.7 tCO₂e including warming from high-altitude effects.
                  A Delhi–London return is about one unit.
                </p>
              </div>

              <div>
                <FieldLabel
                  title="Household road travel"
                  value={`${state.carKm.toLocaleString("en-US")} km/yr`}
                />
                <Slider
                  min={0}
                  max={40000}
                  step={500}
                  value={[state.carKm]}
                  onValueChange={([v]) => state.setField("carKm", v ?? 0)}
                  thumbProps={{
                    "aria-label": ROAD_THUMB_NAME,
                  }}
                />
              </div>

              <div>
                <FieldLabel title={EV_ROAD_SHARE_NAME} value={`${state.evShare}%`} />
                <Slider
                  min={0}
                  max={100}
                  step={5}
                  value={[state.evShare]}
                  onValueChange={([v]) => state.setField("evShare", v ?? 0)}
                  thumbProps={{
                    "aria-label": EV_ROAD_SHARE_NAME,
                    "aria-describedby": EV_ROAD_SHARE_INSTRUCTION_ID,
                  }}
                />
                <p id={EV_ROAD_SHARE_INSTRUCTION_ID} className="text-xs text-muted-foreground">
                  {EV_ROAD_SHARE_INSTRUCTION}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{EV_ROAD_SHARE_CONTEXT}</p>
              </div>

              <div>
                <FieldLabel
                  title="Home electricity"
                  value={`${state.homeKwh.toLocaleString("en-US")} kWh/yr`}
                />
                <Slider
                  min={500}
                  max={12000}
                  step={100}
                  value={[state.homeKwh]}
                  onValueChange={([v]) => state.setField("homeKwh", v ?? 500)}
                  thumbProps={{
                    "aria-label": HOME_THUMB_NAME,
                  }}
                />
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button type="button" variant="secondary" onClick={() => state.reset()}>
                Reset the ledger
              </Button>
              <p className="text-xs text-muted-foreground">
                Baseline is a four-person urban household — not a monk, not a private jet.
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-20 lg:col-span-5 lg:self-start">
            <div className="rounded-3xl bg-card p-5 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]">
              <FourOrbs />
              <p className="mt-1 text-center font-display text-lg">
                Shared dependencies
              </p>
              <p className="text-center font-display text-3xl text-primary sm:text-4xl">
                Air · water · food · energy
              </p>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                A household footprint can show pressure on shared systems. It cannot be converted
                into a numerical safety score for four people.
              </p>
              <p
                id="ledger-qualification"
                className="mt-2 text-center text-xs font-medium text-foreground"
              >
                {LEDGER_QUALIFICATION}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Stat
                  label="Household"
                  value={`${formatT(result.totalT)} t`}
                  hint="CO₂e / year"
                />
                <Stat
                  label="Each of the four"
                  value={`${formatT(result.perPersonT)} t`}
                  hint="CO₂e / year, household total ÷ 4"
                />
              </div>

              <div className="mt-5 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pie}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={42}
                      outerRadius={64}
                      paddingAngle={2}
                      stroke="none"
                    >
                      {result.slices.map((s) => (
                        <Cell key={s.id} fill={SLICE_COLORS[s.id]} />
                      ))}
                    </Pie>
                    <RTooltip
                      formatter={(v) => [`${v} t`, ""]}
                      contentStyle={{
                        background: "#f7f3ea",
                        border: "1px solid #d4cec0",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-muted-foreground">
                {result.slices.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ background: SLICE_COLORS[s.id] }}
                    />
                    {s.label} {formatT(s.t)} t
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {result.slices
            .slice()
            .sort((a, b) => b.t - a.t)
            .slice(0, 3)
            .map((s) => (
              <article
                key={s.id}
                className="rounded-3xl bg-card p-5 shadow-[0_0_0_1px_rgba(22,20,16,0.08)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-xl">{s.label}</h3>
                  <Badge variant="clay">{formatT(s.t)} t</Badge>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Inquiry</dt>
                    <dd className="mt-1 text-foreground">{s.inquiry}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">AP lens</dt>
                    <dd className="mt-1 text-foreground">{s.lens}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Notice</dt>
                    <dd className="mt-1 text-foreground">{s.notice}</dd>
                  </div>
                </dl>
              </article>
            ))}
        </div>

        <div className="mt-6 rounded-3xl bg-primary px-5 py-6 text-primary-foreground sm:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary-foreground/70">
            Notice
          </p>
          <div className="mt-3 space-y-3 text-sm sm:text-base">
            {result.seeing.map((line) => (
              <p key={line.slice(0, 48)}>{line}</p>
            ))}
          </div>
          <p className="mt-4 text-sm text-primary-foreground/80">
            Dependency: who is exposed first varies by place and circumstance. The four still rely
            on shared air, food, water, energy, infrastructure, and public systems.
          </p>
        </div>
      </div>
    </section>
  );
}
