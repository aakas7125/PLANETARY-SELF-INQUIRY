import { getPlace, type Place } from "./places.ts";

export type Diet = "high-meat" | "average" | "low-meat" | "vegetarian" | "vegan";

export type HouseholdInput = {
  names: [string, string, string, string];
  placeId: string;
  diet: Diet;
  flightsLhe: number;
  carKm: number;
  evShare: number;
  homeKwh: number;
};

export const defaultHousehold: HouseholdInput = {
  names: ["You", "The one beside you", "A child", "A parent"],
  placeId: "delhi",
  diet: "average",
  flightsLhe: 1,
  carKm: 8000,
  evShare: 0,
  homeKwh: 3500,
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

export type Slice = {
  id: string;
  label: string;
  t: number;
  inquiry: string;
  lens: string;
  notice: string;
};

export type HouseholdResult = {
  place: Place;
  names: [string, string, string, string];
  slices: Slice[];
  totalT: number;
  perPersonT: number;
  landM2: number;
  waterM3: number;
  seeing: string[];
};

export function computeHousehold(input: HouseholdInput): HouseholdResult {
  const place = getPlace(input.placeId);
  const diet = dietFootprint[input.diet];

  const dietT = diet.t * PEOPLE;
  const flightT = input.flightsLhe * 1.7;
  const iceKm = input.carKm * (1 - input.evShare / 100);
  const evKm = input.carKm * (input.evShare / 100);
  const carT = (iceKm * 0.17 + evKm * (place.gridG / 1000) * 0.18) / 1000;
  const homeT = (input.homeKwh * place.gridG) / 1_000_000;
  const servicesT = 1.1 * PEOPLE;

  const slices: Slice[] = [
    {
      id: "diet",
      label: "Food",
      t: dietT,
      inquiry:
        "Beyond calories, what is this plate meant to give the four — nourishment, taste, care, habit, or something else?",
      lens: "An AP lens could ask whether wanting, comparison, or identity is involved here. Your answer may also be no, practical necessity, or unclear.",
      notice:
        "Feed crops, methane, and land sit behind a mixed diet. Those systems do not live inside the household photograph.",
    },
    {
      id: "flights",
      label: "Flights",
      t: flightT,
      inquiry: "Beyond transport, what are you hoping this flight will give you, if anything?",
      lens: "Could comparison, fear of missing out, or the wish for a certain experience be involved — or is the reason simply practical? Unclear is a complete answer.",
      notice:
        "One long-haul can match a poorer person's yearly carbon in an afternoon. The sky does not keep a private tab for the four.",
    },
    {
      id: "car",
      label: "Road",
      t: carT,
      inquiry: "What does the car actually do in your life — time, safety, work, care, or something else?",
      lens: "An AP lens could ask whether the cabin is also a way of not sharing the street. You may answer no.",
      notice:
        "Exhaust and engine heat leave the cabin and enter the city the four still walk.",
    },
    {
      id: "home",
      label: "Home energy",
      t: homeT,
      inquiry: "What is the indoor climate for — health, sleep, work, comfort, or all of these?",
      lens: "Could a wish to never meet the weather be involved? It may also be heat that is simply unsafe. Either stands.",
      notice:
        "The grid and the outdoor heat island are not a separate climate. Cooling the room returns heat to the street.",
    },
    {
      id: "services",
      label: "Shared systems",
      t: servicesT,
      inquiry:
        "Which shared systems do you actually notice holding the household up — data, waste, cement, logistics — and which stay invisible?",
      lens: "Is this simply modern life, or does anything in it feel like a claim that the rest of the world should stay offstage? Either answer stands.",
      notice:
        "A modest home still stands on mines, servers, and roads built by people who may never enter it.",
    },
  ];

  const totalT = slices.reduce((s, x) => s + x.t, 0);
  const perPersonT = totalT / PEOPLE;

  // Diet land only. Goods land is excluded and unquantified, so this is not a complete household land figure.
  const landM2 = diet.land * PEOPLE;
  const waterM3 = diet.water * PEOPLE + input.homeKwh * 0.003;

  const ranked = [...slices].sort((a, b) => b.t - a.t);
  const seeing: string[] = [];
  const top = ranked[0]!;
  seeing.push(
    `This is one of the household's largest empirical burdens: ${top.label.toLowerCase()} (${top.t.toFixed(1)} tCO₂e). What role does this activity actually play in your life?`,
  );
  if (input.flightsLhe >= 2) {
    seeing.push(
      "Flying is among the fastest ways a household can spend carbon that other people will never have. An AP lens could ask whether wanting, comparison, or fear of a smaller life is involved. Your answer may also be no, work, family, or unclear.",
    );
  }
  if (input.diet === "high-meat" || input.diet === "average") {
    seeing.push(
      "The plate is not private: feed crops, methane, and cleared land sit behind many mixed diets. An AP lens could ask whether this is simply food, or also a way of recruiting the living world. You do not have to accept the lens.",
    );
  }
  seeing.push(
    "None of this stays outside. The same air, prices, pests, and politics that first strike the poor return, later and costlier, to the four you meant to keep apart.",
  );

  return {
    place,
    names: input.names,
    slices,
    totalT,
    perPersonT,
    landM2,
    waterM3,
    seeing: seeing.slice(0, 5),
  };
}

export function formatT(n: number) {
  return n >= 10 ? n.toFixed(1) : n.toFixed(2);
}
