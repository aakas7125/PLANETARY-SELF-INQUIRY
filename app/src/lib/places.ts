export type Place = {
  id: string;
  name: string;
  region: string;
  gridG: number;
  blurb: string;
};

export const places: Place[] = [
  {
    id: "delhi",
    name: "Delhi",
    region: "North India",
    gridG: 710,
    blurb:
      "Heat, toxic air, monsoon swings, and falling groundwater already press on a household here. A gate does not filter PM2.5 or 48°C.",
  },
  {
    id: "mumbai",
    name: "Mumbai",
    region: "West India",
    gridG: 710,
    blurb:
      "The Arabian Sea is rising into a city already flooded by rain on concrete. Coastal wealth is not a seawall that lasts.",
  },
  {
    id: "chennai",
    name: "Chennai",
    region: "South India",
    gridG: 710,
    blurb:
      "Cyclone, drought, and flood rotate through the same streets. Water tankers are not a climate policy.",
  },
  {
    id: "kolkata",
    name: "Kolkata",
    region: "East India",
    gridG: 710,
    blurb:
      "A delta city lives at the mercy of the Bay, the rivers, and the monsoon. Other people's emissions arrive as water.",
  },
  {
    id: "london",
    name: "London",
    region: "United Kingdom",
    gridG: 210,
    blurb:
      "A temperate capital still eats from elsewhere, insures against flood, and discovers that heat kills in houses built for cold.",
  },
  {
    id: "nyc",
    name: "New York",
    region: "United States",
    gridG: 380,
    blurb:
      "Insurance retreat, storm surge, and smoke from other people's fires already write the city's future in premiums.",
  },
  {
    id: "lagos",
    name: "Lagos",
    region: "Nigeria",
    gridG: 440,
    blurb:
      "A megacity on a sinking coast. Those with generators buy hours; they do not buy a stable sea.",
  },
  {
    id: "sao-paulo",
    name: "São Paulo",
    region: "Brazil",
    gridG: 90,
    blurb:
      "Reservoirs, heat, and the dying of the forest that makes rain. A penthouse still drinks from a watershed.",
  },
  {
    id: "sydney",
    name: "Sydney",
    region: "Australia",
    gridG: 550,
    blurb:
      "Fire weather and a drying east. Smoke does not stop at the suburb line you chose for the children.",
  },
  {
    id: "nairobi",
    name: "Nairobi",
    region: "Kenya",
    gridG: 320,
    blurb:
      "Rain that fails or arrives as flood, food priced on a continent's weather. A compound wall does not grow maize.",
  },
  {
    id: "generic-temperate",
    name: "Temperate inland",
    region: "Mid-latitudes",
    gridG: 400,
    blurb:
      "Mildness is not immunity. Supply chains, insurance, and a warming mean still pass through the front door.",
  },
  {
    id: "generic-arid",
    name: "Arid city",
    region: "Drylands",
    gridG: 480,
    blurb:
      "Water is already politics. Air-conditioning is a private weather machine that returns heat to the street.",
  },
];

export function getPlace(id: string): Place {
  return places.find((p) => p.id === id) ?? places[0]!;
}
