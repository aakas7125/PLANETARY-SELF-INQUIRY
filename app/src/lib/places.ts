export type Place = {
  id: string;
  name: string;
  region: string;
  gridG: number;
  heat: number;
  flood: number;
  air: number;
  food: number;
  water: number;
  sea: number;
  disease: number;
  blurb: string;
};

export const places: Place[] = [
  {
    id: "delhi",
    name: "Delhi",
    region: "North India",
    gridG: 710,
    heat: 1.7,
    flood: 1.1,
    air: 1.8,
    food: 1.3,
    water: 1.6,
    sea: 0.1,
    disease: 1.3,
    blurb:
      "Heat, toxic air, monsoon swings, and falling groundwater already press on a household here. A gate does not filter PM2.5 or 48°C.",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    region: "West India",
    gridG: 710,
    heat: 1.3,
    flood: 1.8,
    air: 1.4,
    food: 1.2,
    water: 1.2,
    sea: 1.7,
    disease: 1.2,
    blurb:
      "The Arabian Sea is rising into a city already flooded by rain on concrete. Coastal wealth is not a seawall that lasts.",
  },
  {
    id: "chennai",
    name: "Chennai",
    region: "South India",
    gridG: 710,
    heat: 1.5,
    flood: 1.5,
    air: 1.2,
    food: 1.2,
    water: 1.7,
    sea: 1.4,
    disease: 1.2,
    blurb:
      "Cyclone, drought, and flood rotate through the same streets. Water tankers are not a climate policy.",
  },
  {
    id: "kolkata",
    name: "Kolkata",
    region: "East India",
    gridG: 710,
    heat: 1.4,
    flood: 1.6,
    air: 1.6,
    food: 1.3,
    water: 1.3,
    sea: 1.5,
    disease: 1.4,
    blurb:
      "A delta city lives at the mercy of the Bay, the rivers, and the monsoon. Other people's emissions arrive as water.",
  },
  {
    id: "london",
    name: "London",
    region: "United Kingdom",
    gridG: 210,
    heat: 0.9,
    flood: 1.2,
    air: 0.8,
    food: 1.1,
    water: 0.8,
    sea: 0.9,
    disease: 0.7,
    blurb:
      "A temperate capital still eats from elsewhere, insures against flood, and discovers that heat kills in houses built for cold.",
  },
  {
    id: "nyc",
    name: "New York",
    region: "United States",
    gridG: 380,
    heat: 1.1,
    flood: 1.4,
    air: 0.9,
    food: 1.0,
    water: 0.7,
    sea: 1.5,
    disease: 0.8,
    blurb:
      "Insurance retreat, storm surge, and smoke from other people's fires already write the city's future in premiums.",
  },
  {
    id: "lagos",
    name: "Lagos",
    region: "Nigeria",
    gridG: 440,
    heat: 1.4,
    flood: 1.7,
    air: 1.3,
    food: 1.4,
    water: 1.3,
    sea: 1.6,
    disease: 1.5,
    blurb:
      "A megacity on a sinking coast. Those with generators buy hours; they do not buy a stable sea.",
  },
  {
    id: "sao-paulo",
    name: "São Paulo",
    region: "Brazil",
    gridG: 90,
    heat: 1.2,
    flood: 1.3,
    air: 1.1,
    food: 1.2,
    water: 1.4,
    sea: 0.2,
    disease: 1.3,
    blurb:
      "Reservoirs, heat, and the dying of the forest that makes rain. A penthouse still drinks from a watershed.",
  },
  {
    id: "sydney",
    name: "Sydney",
    region: "Australia",
    gridG: 550,
    heat: 1.3,
    flood: 1.1,
    air: 1.4,
    food: 1.1,
    water: 1.3,
    sea: 1.1,
    disease: 0.8,
    blurb:
      "Fire weather and a drying east. Smoke does not stop at the suburb line you chose for the children.",
  },
  {
    id: "nairobi",
    name: "Nairobi",
    region: "Kenya",
    gridG: 320,
    heat: 1.1,
    flood: 1.2,
    air: 1.1,
    food: 1.5,
    water: 1.5,
    sea: 0.1,
    disease: 1.4,
    blurb:
      "Rain that fails or arrives as flood, food priced on a continent's weather. A compound wall does not grow maize.",
  },
  {
    id: "generic-temperate",
    name: "Temperate inland",
    region: "Mid-latitudes",
    gridG: 400,
    heat: 1.0,
    flood: 1.0,
    air: 1.0,
    food: 1.1,
    water: 1.0,
    sea: 0.2,
    disease: 0.8,
    blurb:
      "Mildness is not immunity. Supply chains, insurance, and a warming mean still pass through the front door.",
  },
  {
    id: "generic-arid",
    name: "Arid city",
    region: "Drylands",
    gridG: 480,
    heat: 1.6,
    flood: 0.7,
    air: 1.2,
    food: 1.5,
    water: 1.8,
    sea: 0.1,
    disease: 1.1,
    blurb:
      "Water is already politics. Air-conditioning is a private weather machine that returns heat to the street.",
  },
];

export function getPlace(id: string): Place {
  return places.find((p) => p.id === id) ?? places[0]!;
}
