import { getPlace, type Place } from "./places";

export type Diet = "high-meat" | "average" | "low-meat" | "vegetarian" | "vegan";

export type HouseholdInput = {
  names: [string, string, string, string];
  placeId: string;
  diet: Diet;
  flightsLhe: number;
  carKm: number;
  evShare: number;
  homeKwh: number;
  goods: number;
  cooling: number;
};

export const defaultHousehold: HouseholdInput = {
  names: ["You", "The one beside you", "A child", "A parent"],
  placeId: "delhi",
  diet: "average",
  flightsLhe: 1,
  carKm: 8000,
  evShare: 0,
  homeKwh: 3500,
  goods: 5,
  cooling: 5,
};

/** tCO2e / person / year from food. Poore & Nemecek 2018; OWID dietary footprints. */
export const dietFootprint: Record<Diet, { t: number; land: number; water: number; label: string }> =
  {
    "high-meat": { t: 3.3, land: 4100, water: 2200, label: "High meat" },
    average: { t: 1.85, land: 2400, water: 1600, label: "Typical mixed" },
    "low-meat": { t: 1.4, land: 1700, water: 1300, label: "Low meat" },
    vegetarian: { t: 1.05, land: 1200, water: 1000, label: "Vegetarian" },
    vegan: { t: 0.7, land: 700, water: 700, label: "Plant" },
  };

export const dietOptions: Diet[] = [
  "high-meat",
  "average",
  "low-meat",
  "vegetarian",
  "vegan",
];

const PEOPLE = 4;
/** 1.5°C-aligned 2030 per-capita fair share, tCO2e / yr (order of UNEP / IPCC pathways). */
export const FAIR_SHARE_T = 2.0;
/** Illustrative remaining 1.5°C (50%) budget from 2026, GtCO2 — IGCC updates shrink this yearly. */
export const REMAINING_BUDGET_GT = 150;
export const WORLD_EMISSIONS_GT = 41.6;
export const WORLD_POPULATION = 8_200_000_000;

export type Slice = {
  id: string;
  label: string;
  t: number;
  greed: string;
  fear: string;
  otherness: string;
};

export type HouseholdResult = {
  place: Place;
  names: [string, string, string, string];
  slices: Slice[];
  totalT: number;
  perPersonT: number;
  earths: number;
  fairMultiple: number;
  budgetHours: number;
  lifetimeSharePct: number;
  landM2: number;
  waterM3: number;
  safety: number;
  heatDays: number;
  floodIndex: number;
  foodShock: number;
  waterStress: number;
  airDays: number;
  diseaseIndex: number;
  insuranceIndex: number;
  stabilityIndex: number;
  classCopyWarming: number;
  seeing: string[];
  whoPaysFirst: string;
};

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

export function computeHousehold(input: HouseholdInput): HouseholdResult {
  const place = getPlace(input.placeId);
  const diet = dietFootprint[input.diet];

  const dietT = diet.t * PEOPLE;
  const flightT = input.flightsLhe * 1.7;
  const iceKm = input.carKm * (1 - input.evShare / 100);
  const evKm = input.carKm * (input.evShare / 100);
  const carT = (iceKm * 0.17 + evKm * (place.gridG / 1000) * 0.18) / 1000;
  const homeT = (input.homeKwh * place.gridG) / 1_000_000;
  const coolT = (input.cooling / 10) * 1.8;
  const goodsT = 0.35 + (input.goods / 10) * 3.4;
  const servicesT = 1.1 * PEOPLE;

  const slices: Slice[] = [
    {
      id: "diet",
      label: "Food",
      t: dietT,
      greed: "Taste, protein myth, and the plate as status.",
      fear: "The fear of not-enough body, not-enough feast, not-enough care.",
      otherness:
        "The animal, the farm worker, the river drawn for feed — none of them sit at your table, so they do not count as kin.",
    },
    {
      id: "flights",
      label: "Flights",
      t: flightT,
      greed: "The world as a catalog of experiences the four must not miss.",
      fear: "If we do not go, we will have lived a smaller life.",
      otherness:
        "The sky is treated as empty. One long-haul can spend a poorer person's yearly carbon in a single afternoon.",
    },
    {
      id: "car",
      label: "Road",
      t: carT,
      greed: "Door-to-door comfort as a right of the enclosed family.",
      fear: "The street as threat; the cabin as a portable house.",
      otherness:
        "Exhaust is exported to lungs you will never name. Heat from the engine returns to the city your four must walk.",
    },
    {
      id: "home",
      label: "Home energy",
      t: homeT + coolT,
      greed: "A private climate inside four walls, whatever the street is doing.",
      fear: "Heat, darkness, stillness — the body as something that must never suffer weather.",
      otherness:
        "The grid's coal and the outdoor heat island are someone else's weather. Air-conditioning is a machine for othering the season.",
    },
    {
      id: "goods",
      label: "Goods",
      t: goodsT,
      greed: "Identity purchased, boredom medicated, love expressed as parcels.",
      fear: "Obsolescence, comparison, the child's 'everyone has it'.",
      otherness:
        "A shirt has a factory, a river, and a landfill. None of them are invited into the photograph of the four.",
    },
    {
      id: "services",
      label: "Shared systems",
      t: servicesT,
      greed: "The quiet consumption of public machines — data, waste, cement, logistics.",
      fear: "Life without the hidden infrastructure that holds a modern household up.",
      otherness:
        "Even a modest home stands on mines, servers, and roads built by people who will never enter it.",
    },
  ];

  const totalT = slices.reduce((s, x) => s + x.t, 0);
  const perPersonT = totalT / PEOPLE;
  const earths = perPersonT / FAIR_SHARE_T;
  const fairMultiple = perPersonT / FAIR_SHARE_T;

  const worldPerSecond = (WORLD_EMISSIONS_GT * 1e9) / (365.25 * 24 * 3600);
  const budgetHours = (totalT / worldPerSecond) / 3600;

  const lifetimeT = totalT * 55;
  const lifetimeSharePct = (lifetimeT / (REMAINING_BUDGET_GT * 1e9)) * 100;

  const landM2 = diet.land * PEOPLE + input.goods * 40;
  const waterM3 = diet.water * PEOPLE + input.homeKwh * 0.003;

  const overshoot = Math.max(0, fairMultiple - 1);
  const safety = clamp(100 * Math.exp(-0.42 * overshoot) - (input.flightsLhe + input.cooling / 5), 4, 96);

  const extraWarmingFelt = 0.7;
  const heatDays = Math.round(18 * place.heat + extraWarmingFelt * 22 * place.heat + overshoot * 6);
  const floodIndex = clamp(28 * place.flood + overshoot * 8, 8, 98);
  const foodShock = clamp(18 * place.food + overshoot * 14 + (diet.t - 0.7) * 6, 8, 96);
  const waterStress = clamp(20 * place.water + overshoot * 10, 8, 98);
  const airDays = Math.round(12 * place.air + input.carKm / 900 + extraWarmingFelt * 10 * place.air);
  const diseaseIndex = clamp(22 * place.disease + extraWarmingFelt * 12, 8, 96);
  const insuranceIndex = clamp(20 + overshoot * 16 + place.flood * 8 + place.sea * 8, 10, 98);
  const stabilityIndex = clamp(16 + overshoot * 12 + place.food * 8 + place.water * 6, 10, 95);

  const classCopyWarming = clamp(0.9 + (perPersonT / 4.7) * 1.4, 1.6, 3.8);

  const ranked = [...slices].sort((a, b) => b.t - a.t);
  const seeing: string[] = [];
  const top = ranked[0]!;
  seeing.push(
    `The largest leak in the circle of the four is ${top.label.toLowerCase()} (${top.t.toFixed(1)} tCO₂e). ${top.otherness}`,
  );
  if (input.flightsLhe >= 2) {
    seeing.push(
      "Flying is the fastest way a comfortable household burns the carbon of people it will never meet. Greed wants the view; fear of a small life books the seat; otherness treats the atmosphere as a free road.",
    );
  }
  if (input.diet === "high-meat" || input.diet === "average") {
    seeing.push(
      "The plate is not private. Feed crops, methane, and cleared land are how a household recruits the living world into its hunger. Acharya Prashant names this plainly: man consuming the natural world.",
    );
  }
  if (input.cooling >= 6) {
    seeing.push(
      "Cooling the room heats the street. The four feel relief; the city, and later the four, feel the return. Fear of weather becomes a machine that manufactures weather.",
    );
  }
  if (input.goods >= 7) {
    seeing.push(
      "Parcels are how incompleteness tries to complete itself. The hole is not in the warehouse. It is in the one who cannot sit still without a purchase.",
    );
  }
  seeing.push(
    "None of this stays outside. The same air, prices, pests, and politics that first strike the poor return, later and costlier, to the four you meant to seal away.",
  );

  const whoPaysFirst =
    place.heat >= 1.4
      ? "Outdoor workers, farmers, and anyone whose house cannot manufacture winter in May."
      : place.sea >= 1.3
        ? "Coastal labour, fishing families, and ground-floor tenants — then the insured, when the insurer leaves."
        : "The uninsured, the undernourished, and those whose work is the weather — then, with a lag, everyone who eats.";

  return {
    place,
    names: input.names,
    slices,
    totalT,
    perPersonT,
    earths,
    fairMultiple,
    budgetHours,
    lifetimeSharePct,
    landM2,
    waterM3,
    safety,
    heatDays,
    floodIndex,
    foodShock,
    waterStress,
    airDays,
    diseaseIndex,
    insuranceIndex,
    stabilityIndex,
    classCopyWarming,
    seeing: seeing.slice(0, 5),
    whoPaysFirst,
  };
}

export function formatT(n: number) {
  return n >= 10 ? n.toFixed(1) : n.toFixed(2);
}
