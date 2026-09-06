export type ProofLink = {
  id: string;
  n: string;
  title: string;
  claim: string;
  body: string;
  number: string;
  numberLabel: string;
  citation: string;
  href: string;
};

export const proofLead =
  "The ego draws a circle around four bodies and calls it safety. Earth-system science is the demonstration that the circle is drawn on a commons. Heat, carbon, grain, water, smoke, mosquitoes, prices, and unrest do not present passports at the gate.";

export const proofLinks: ProofLink[] = [
  {
    id: "air",
    n: "01",
    title: "The air is one",
    claim: "There is no private atmosphere.",
    body: "A CO₂ molecule from a family SUV is mixed through the global troposphere within about a year. The greenhouse effect does not keep accounts by household. To emit for the comfort of four is to thicken the blanket over eight billion — including the four.",
    number: "~1 year",
    numberLabel: "global mixing time for CO₂ in the troposphere",
    citation: "IPCC AR6 WGI — well-mixed greenhouse gases; TCRE ~0.45°C per 1,000 GtCO₂",
    href: "https://www.ipcc.ch/report/ar6/wg1/",
  },
  {
    id: "heat",
    n: "02",
    title: "Heat does not honor the gate",
    claim: "Wealth delays wet-bulb. It does not repeal it.",
    body: "Air-conditioning is a private weather machine. It fails in blackouts, raises street temperatures, and does nothing once wet-bulb temperatures near 35°C make outdoor labour and, eventually, indoor life unsurvivable without continuous power. The four still live in a city, not in a spacecraft.",
    number: "35°C",
    numberLabel: "wet-bulb threshold beyond which humans cannot shed heat",
    citation: "Mora et al., Nature Climate Change, 2017 — global risk of deadly heat",
    href: "https://www.nature.com/articles/nclimate3322",
  },
  {
    id: "food",
    n: "03",
    title: "The plate is a supply chain",
    claim: "You cannot grow a supermarket behind a compound wall.",
    body: "Grain, edible oils, fertiliser, and animal feed are telecoupled. A drought in one breadbasket moves through prices into every kitchen. Heat and groundwater collapse hit farm workers first — the people othered by a diet — and then they hit the four as cost, quality, and scarcity.",
    number: "3.3 t",
    numberLabel: "typical high-meat diet, tCO₂e per person per year",
    citation: "Poore & Nemecek, Science, 2018 — food-system environmental impacts",
    href: "https://www.science.org/doi/10.1126/science.aaq0216",
  },
  {
    id: "water",
    n: "04",
    title: "Water is a cycle, not a tank",
    claim: "Glaciers, monsoons, and aquifers do not accept membership fees.",
    body: "Household tanks and bottled water are delays. Cities in drylands and monsoon belts already live on falling groundwater and borrowed rivers. When the hydrological cycle lurches, the four drink from the same lurch — only later, and more expensively.",
    number: "7 / 9",
    numberLabel: "planetary boundaries now transgressed, including freshwater",
    citation: "Richardson et al., Science Advances, 2023; later updates to seven of nine",
    href: "https://www.science.org/doi/10.1126/sciadv.adh2458",
  },
  {
    id: "smoke",
    n: "05",
    title: "Smoke travels",
    claim: "Someone else’s fire is your child’s asthma.",
    body: "Wildfire PM2.5 crosses continents. Dust, ozone, and urban smog do not respect school-district lines. A household can buy filters. It cannot buy a stable fire season or a sky that stays outside the lungs of the four.",
    number: "PM2.5",
    numberLabel: "the fraction that enters blood, brain, and placenta",
    citation: "WMO / Lancet Countdown assessments of wildfire smoke and health",
    href: "https://www.lancetcountdown.org/",
  },
  {
    id: "disease",
    n: "06",
    title: "Vectors do not read addresses",
    claim: "Warming moves mosquitoes, ticks, and wastewater into new postcodes.",
    body: "Dengue, malaria, Lyme, and cholera-risk maps are redrawn with isotherms. A gated colony can fog the garden. It cannot freeze the climate that expanded the range. The four share blood with a biosphere that is being asked to move.",
    number: "+1.4°C",
    numberLabel: "human-induced warming, 2025 assessment range",
    citation: "Forster et al., Indicators of Global Climate Change 2025, ESSD",
    href: "https://doi.org/10.5194/essd-18-3889-2026",
  },
  {
    id: "money",
    n: "07",
    title: "Insurance is a social fiction",
    claim: "When risk is systemic, the premium is exile.",
    body: "Insurers are already leaving fire and flood zones. A house is not safe because it is owned. It is safe while a pool of strangers still agrees to share its risk. Climate makes that pool uninsurable. The four discover that property was never a climate shelter.",
    number: "2.7°C",
    numberLabel: "warming this century under policies still on the books (order of UNEP gap reports)",
    citation: "UNEP Emissions Gap; 2024 State of the Climate, BioScience",
    href: "https://www.unep.org/resources/emissions-gap-report",
  },
  {
    id: "peace",
    n: "08",
    title: "Unrest comes home",
    claim: "Food shock, heat, and displacement do not stay in the news.",
    body: "The people a comfortable household others — the farmer, the migrant, the coastal labourer — are the first climate casualties. Their instability becomes food prices, strained cities, and politics of fear. A family cannot secede from the century. To want four people safe in a failing commons is to want a contradiction.",
    number: "10% / 50%",
    numberLabel: "richest tenth produce about half of consumption emissions; poorest half about a tenth",
    citation: "Chancel, Nature Sustainability, 2022 — global carbon inequality",
    href: "https://www.nature.com/articles/s41893-022-00955-z",
  },
];

export const proofClose =
  "Hence the theorem, which is only seeing: if you actually want the four to eat, sleep, and grow old, you are already committed to the habitability of the whole. Otherness is not merely unjust. It is a failed security strategy.";
