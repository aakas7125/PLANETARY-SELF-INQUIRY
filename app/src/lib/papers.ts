export type Paper = {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  abstract: string;
  doi?: string;
  url: string;
  citedBy?: number;
  source: "canon" | "openalex" | "crossref";
  why: string;
  topics: string[];
};

export const canonPapers: Paper[] = [
  {
    id: "igcc-2025",
    title:
      "Indicators of Global Climate Change 2025: annual update of key indicators of the state of the climate system and human influence",
    authors: "Forster et al.",
    year: 2026,
    venue: "Earth System Science Data",
    abstract:
      "The IGCC annual update assesses anthropogenic warming, effective radiative forcing, Earth's energy imbalance, and remaining carbon budgets with methods traceable to IPCC AR6. The 2025 update finds human-induced warming of about 1.37 C, a forcing near 3.1 W m-2, and a remaining 1.5 C budget still shrinking as CO2-induced warming sets a new decadal high.",
    doi: "10.5194/essd-18-3889-2026",
    url: "https://doi.org/10.5194/essd-18-3889-2026",
    source: "canon",
    topics: ["warming", "budget", "anthropogenic"],
    why: "This is the closest living successor to the IPCC numbers. It says the fever is human. Your four do not live in a natural fluctuation; they live inside an attributed trend.",
  },
  {
    id: "boundaries-2023",
    title: "Earth beyond six of nine planetary boundaries",
    authors:
      "Richardson, Steffen, Lucht, Bendtsen, Cornell, Donges, Druke, Fetzer, Bala, von Bloh, Feulner, Fiedler, Gerten, Gleeson, Hofmann, Huiskamp, Kummu, Mohan, Nogues-Bravo, Petri, Porkka, Rahmstorf, Schaphoff, Thonicke, Tobian, Virkki, Wang-Erlandsson, Weber, Rockstrom",
    year: 2023,
    venue: "Science Advances",
    abstract:
      "An update of the planetary boundaries framework finds Earth well outside the Holocene-like safe operating space, with climate, biosphere integrity, land system change, freshwater, biogeochemical flows, and novel entities transgressed — later assessments raise the count to seven of nine.",
    doi: "10.1126/sciadv.adh2458",
    url: "https://www.science.org/doi/10.1126/sciadv.adh2458",
    source: "canon",
    topics: ["boundaries", "biosphere", "freshwater"],
    why: "Climate is one boundary among several your household presses at once: land, water, nitrogen, the living fabric. A carbon-only fence around the four is still a fence on a failing system.",
  },
  {
    id: "poore-2018",
    title: "Reducing food’s environmental impacts through producers and consumers",
    authors: "Poore & Nemecek",
    year: 2018,
    venue: "Science",
    abstract:
      "A global meta-analysis of food-system impacts shows that animal-sourced foods dominate land use, greenhouse gases, and nutrient pollution. Dietary change is among the highest-leverage household interventions because it is daily, cumulative, and land-hungry.",
    doi: "10.1126/science.aaq0216",
    url: "https://www.science.org/doi/10.1126/science.aaq0216",
    source: "canon",
    topics: ["food", "land", "consumption"],
    why: "The plate is how a family recruits forests, rivers, and animals into its identity. What looks like care for four is often the consumption of the world that feeds them.",
  },
  {
    id: "chancel-2022",
    title: "Global carbon inequality over 1990–2019",
    authors: "Lucas Chancel",
    year: 2022,
    venue: "Nature Sustainability",
    abstract:
      "The richest 10% of the world population are responsible for about half of global consumption-related emissions, while the poorest 50% contribute around a tenth. Inequality is not a side note to climate; it is the shape of the fire.",
    doi: "10.1038/s41893-022-00955-z",
    url: "https://www.nature.com/articles/s41893-022-00955-z",
    source: "canon",
    topics: ["inequality", "consumption"],
    why: "If your four live in the emitting class, protecting them by consuming more is how the poorest — and then the four — lose a livable mean.",
  },
  {
    id: "mora-2017",
    title: "Global risk of deadly heat",
    authors: "Mora et al.",
    year: 2017,
    venue: "Nature Climate Change",
    abstract:
      "Exposure to deadly climatic conditions is rising sharply with warming. Around one-third of the world’s population is already exposed to deadly heat for at least twenty days a year; that share grows under every additional increment of warming.",
    doi: "10.1038/nclimate3322",
    url: "https://www.nature.com/articles/nclimate3322",
    source: "canon",
    topics: ["heat", "health"],
    why: "The four cannot be moved into a climate that no longer exists. Deadly heat is the most bodily proof that walls are not weather.",
  },
  {
    id: "lenton-2023",
    title: "The Earth system on the edge: climate tipping points and their risks",
    authors: "Lenton and colleagues / Global Tipping Points literature",
    year: 2023,
    venue: "Global Tipping Points report",
    abstract:
      "Ice sheets, the Amazon, coral reefs, and circulation patterns can shift qualitatively, not just gradually. Tipping elements couple: losing one raises the odds of losing another. Gradual household emissions participate in non-linear planetary risk.",
    url: "https://global-tipping-points.org/",
    source: "canon",
    topics: ["tipping", "systems"],
    why: "A family budget assumes continuity. Tipping points are the scientific name for a world that stops being continuous — the world the four must inherit.",
  },
  {
    id: "ivanova-2020",
    title: "Quantifying the potential for climate change mitigation of consumption options",
    authors: "Ivanova, Barrett, Wiedenhofer, Macura, Callaghan, Creutzig",
    year: 2020,
    venue: "Environmental Research Letters",
    abstract:
      "A systematic review of consumption options ranks living car-free, reducing flying, switching to plant-rich diets, and renewable household energy among the highest-impact choices available to individuals in high-emitting contexts.",
    doi: "10.1088/1748-9326/ab8589",
    url: "https://iopscience.iop.org/article/10.1088/1748-9326/ab8589",
    source: "canon",
    topics: ["consumption", "mitigation"],
    why: "The ledger on this page is not a vibe. The large items — flying, meat, cars, household energy — are the ones the literature keeps finding.",
  },
  {
    id: "rockstrom-2026",
    title: "We Are in the Anthropocene — Now What?",
    authors: "Rockstrom, Martin, Ganopolski, Donges, Feulner, Marwan, Rahmstorf",
    year: 2026,
    venue: "Earth's Future",
    abstract:
      "Earth-system scientists describe pathways in the Anthropocene after the Holocene envelope has already been left. 2024 warmth and a three-year mean above 1.5 C by the end of 2025 are treated as departure, not weather.",
    url: "https://agupubs.onlinelibrary.wiley.com/journal/23284277",
    source: "canon",
    topics: ["anthropocene", "warming"],
    why: "Naming the epoch is naming the agent. The Anthropocene is the century your four will not get to opt out of.",
  },
  {
    id: "ipcc-wg2",
    title: "Climate Change 2022: Impacts, Adaptation and Vulnerability",
    authors: "IPCC AR6 Working Group II",
    year: 2022,
    venue: "IPCC",
    abstract:
      "Observed impacts are already widespread: heat mortality, food and water insecurity, mental health, displacement. Adaptation has limits. Soft limits are already reached in some systems; hard limits appear with further warming.",
    url: "https://www.ipcc.ch/report/ar6/wg2/",
    source: "canon",
    topics: ["impacts", "vulnerability"],
    why: "Impacts are not evenly paid. The people a household others pay first. Limits to adaptation are the scientific name for the failure of private shelter.",
  },
  {
    id: "gcb",
    title: "Global Carbon Budget (annual)",
    authors: "Friedlingstein et al.",
    year: 2025,
    venue: "Earth System Science Data",
    abstract:
      "The living account of fossil and land-use CO2. Emissions remain near record, sinks are stressed, and the remaining carbon budget is a function of what is burned this year — including by households that believe themselves too small to count.",
    url: "https://globalcarbonbudget.org/",
    source: "canon",
    topics: ["carbon", "budget"],
    why: "A budget is a moral document. Every tonne the four spend is a tonne the young of the four cannot spend on remaining below thresholds.",
  },
];

export function whyFromText(title: string, abstract: string): string {
  const t = `${title} ${abstract}`.toLowerCase();
  if (t.includes("heat") || t.includes("wet-bulb") || t.includes("temperature")) {
    return "Heat is the impact that walks into the room. If the paper is about warming, it is about whether the four can still work, sleep, and play outside.";
  }
  if (t.includes("food") || t.includes("agricult") || t.includes("crop") || t.includes("famine")) {
    return "Food systems are how other people's weather becomes your kitchen. The four eat from a planet, not from a cupboard.";
  }
  if (t.includes("water") || t.includes("drought") || t.includes("glacier") || t.includes("monsoon")) {
    return "Water is already the politics of many cities. A paper on hydrology is a paper on the daily life of the four.";
  }
  if (t.includes("biodivers") || t.includes("extinct") || t.includes("ecosystem") || t.includes("forest")) {
    return "The living world is not scenery around a family. It is the farm, the pollinator, the disease regulator, the rain.";
  }
  if (t.includes("emission") || t.includes("carbon") || t.includes("methane") || t.includes("budget")) {
    return "Emissions accounting is the physical name of consumption. The hole in the heart has a unit: tCO2e.";
  }
  if (t.includes("inequal") || t.includes("justice") || t.includes("poverty") || t.includes("vulnerab")) {
    return "The first victims are the people othered by a comfortable household. Their injury is the preview of the four's century.";
  }
  if (t.includes("health") || t.includes("disease") || t.includes("mortality") || t.includes("vector")) {
    return "Bodies do not live in GDP. They live in air, heat, and pathogens that warming redistributes.";
  }
  if (t.includes("tipping") || t.includes("ice sheet") || t.includes("amoc") || t.includes("amazon")) {
    return "Non-linear Earth-system risk is why a private savings account cannot underwrite a family's future.";
  }
  return "Anthropogenic change is the water the four must swim in. If the paper is credible and recent, it is already about them.";
}

export function reconstructAbstract(index: Record<string, number[]> | undefined): string {
  if (!index) return "";
  const slots: string[] = [];
  for (const [word, positions] of Object.entries(index)) {
    for (const pos of positions) slots[pos] = word;
  }
  return slots.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}
