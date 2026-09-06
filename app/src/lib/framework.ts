export type FrameworkBlock = {
  id: string;
  kicker: string;
  title: string;
  body: string;
  quote?: string;
  source?: { label: string; href: string };
};

export const frameworkIntro = {
  title: "The AP Framework: the climate is a symptom",
  lead: "Acharya Prashant’s framework does not begin with carbon. It begins with the ego — the felt “I am this body, these four, this name” — and the incompleteness that sends that “I” out to consume the world. Climate change, in this reading, is not an accident of industry. It is the outer face of a mind that does not know itself.",
  href: "https://acharyaprashant.org/en/ap-framework",
};

export const frameworkBlocks: FrameworkBlock[] = [
  {
    id: "ego",
    kicker: "I. Ego",
    title: "The hungry “I” that must complete itself",
    body: "The ego is not arrogance. It is the false self-image that arises with the body: I am this skin, this story, these people. Because the image is incomplete, it seeks completion in objects — food, flights, houses, children, status, even “being green”. The AP Framework calls this the first superstition: the unexamined “I”. From that superstition, the planet is only a warehouse.",
    quote:
      "If you have this big a hole in your heart, what else will you do? You will use the entire universe to plug this hole.",
    source: {
      label: "Man Is Climate Change — Acharya Prashant",
      href: "https://acharyaprashant.org/en/articles/man-is-climate-change-1_3743466",
    },
  },
  {
    id: "otherness",
    kicker: "II. Otherness",
    title: "The four are still a fence",
    body: "Love of four people is not yet the end of otherness. It is often otherness made tender: mine versus not-mine. The partner, the child, the parent become an extended body. Everyone beyond the fence — the farm worker, the future stranger, the animal, the river — can be used to keep the fence comfortable. The science of a shared atmosphere is the proof that this fence is a fiction. The teaching is that the fence was always the wound.",
    quote:
      "The ego… manufactures this thought not out of malice but as the expression of its most fundamental operation: the construction of a self that stands apart from its predicament.",
    source: {
      label: "When comfort masquerades as immunity — Acharya Prashant",
      href: "https://acharyaprashant.org/en/articles/climate-crisis-when-comfort-masquerades-as-immunity-acharya-prashant-on-the-pioneer-1_7c55a7798",
    },
  },
  {
    id: "greed-fear",
    kicker: "III. Greed and fear",
    title: "Two names for the same incompleteness",
    body: "Desire is the ego reaching forward for an object it believes will complete it. Fear is the same desire in a defensive form: do not take from me what I am using to feel whole. Consumption is how both speak. We emit when we celebrate and when we shop to feel better. A crisis that lives in the way a human being wants cannot be answered by a treaty that leaves wanting untouched.",
    quote:
      "Fear is desire’s defensive form. The two forces behind the climate crisis — population growth and consumption — share one common root: the existential illusion that consumption brings fulfilment.",
    source: {
      label: "AP Framework / Before the Ice Melts, the Ego Must",
      href: "https://acharyaprashant.org/en/articles/before-the-ice-melts-the-ego-must-the-real-crisis-behind-cop-30-acharya-prashant-on-the-pioneer-1_3fd32bf00",
    },
  },
  {
    id: "three",
    kicker: "IV. Three consumptions",
    title: "Man, objects, nature — nothing is spared",
    body: "Acharya Prashant names three doors the outward-going mind knocks on: man consuming man (the restless multiplication of unexamined lives), man consuming man-made objects (energy, cement, fashion, screens), and man consuming the natural world (feed, fish, forest, river). IPCC inventories measure the smoke from these three. They do not ask why a human being cannot stop.",
    quote:
      "Nothing drives climate change except these three: man consuming man, man consuming man-made objects, and man consuming the natural world. The very basis of climate change is the constitution of man himself. Man cannot help climate change; man is climate change.",
    source: {
      label: "Man Is Climate Change — Acharya Prashant",
      href: "https://acharyaprashant.org/en/articles/man-is-climate-change-1_3743466",
    },
  },
  {
    id: "axes",
    kicker: "V. Two axes",
    title: "Green machines on the horizontal, freedom on the vertical",
    body: "The AP Framework distinguishes a horizontal axis of change — more, better, greener objects — from a vertical axis of ego-thinning. The great lie is Y = F(x, z): that enough horizontal movement will yield a vertical result. An electric car driven by the same hunger is still hunger. “When greed drives the engine, every invention accelerates collapse.” Technology is not refused; it is refused as a substitute for seeing.",
    quote:
      "We promote green energy without questioning the culture of limitless consumption that fuels the need for it. Climate change is not out there — it is the externalized manifestation of an internal disorder.",
    source: {
      label: "The Climate Crisis and the Need for Inner Awakening",
      href: "https://acharyaprashant.org/en/articles/climate-crisis-need-for-awakening-acharya-prashant-1_b5a0823",
    },
  },
  {
    id: "change",
    kicker: "VI. Change = Seeing + Intent",
    title: "Guilt is not a climate policy",
    body: "Seeing the mechanism is necessary and not sufficient. The framework’s formula is Change = Seeing + Intent: a sovereign turn toward dissolution, not willpower against a habit while the “I” remains. Action from fear, image, or virtue-signalling is still the ego fattening itself — now as the good one. Nishkama karma is work that does not need the world to complete you. From that ground, restraint is not a slogan. Excess is simply uninteresting.",
    quote:
      "When joy is rediscovered within, compulsive consumption loses its purpose. A person with self-knowledge cannot be sold dissatisfaction. The cleanest energy on Earth is contentment.",
    source: {
      label: "Before the Ice Melts, the Ego Must — Acharya Prashant",
      href: "https://acharyaprashant.org/en/articles/before-the-ice-melts-the-ego-must-the-real-crisis-behind-cop-30-acharya-prashant-on-the-pioneer-1_3fd32bf00",
    },
  },
  {
    id: "compassion",
    kicker: "VII. Compassion",
    title: "To protect four, stop manufacturing an other",
    body: "Mercy reduces a symptom and leaves the root. Compassion, in this framework, is demonstrating the unreality of the sufferer’s ego — which first requires self-knowledge. Practically: the four you love are not a separate species. Their food, sleep, health, and peace are functions of a planet you do not own. Otherness is not only cruel to strangers. It is incompetent at saving kin.",
    quote:
      "We exploit the Earth for the same reason we exploit one another: because we feel hollow inside. The planet bleeds because we do. Climate change is not the disease; it is the symptom. The real disease is ignorance, the failure to know oneself.",
    source: {
      label: "Before the Ice Melts, the Ego Must — Acharya Prashant",
      href: "https://acharyaprashant.org/en/articles/before-the-ice-melts-the-ego-must-the-real-crisis-behind-cop-30-acharya-prashant-on-the-pioneer-1_3fd32bf00",
    },
  },
];

export const frameworkNotes = [
  "The AP Framework is the philosophical architecture published by Acharya Prashant at acharyaprashant.org/en/ap-framework. This page does not replace it. It sets its diagnosis of ego, objects, desire, fear, and otherness beside the physical science of a shared Earth system.",
  "Quotations are from Acharya Prashant’s public essays on climate and from the AP Framework lexicon (ego, otherness, greed/fear as desire’s forms, horizontal vs vertical axes, Change = Seeing + Intent, compassion vs mercy). Read the source essays in full.",
];
