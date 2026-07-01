

export const QUESTIONS = [
  {
    key: 'experience',
    number: 1,
    title: 'Experience Level',
    prompt: 'How would you describe your experience with wine?',
    type: 'single',
    options: [
      { letter: 'A', label: 'Total beginner' },
      { letter: 'B', label: 'Casual enjoyer' },
      { letter: 'C', label: 'Enthusiast' },
      { letter: 'D', label: 'Connoisseur / Expert' },
    ],
  },
  {
    key: 'color',
    number: 2,
    title: 'Wine Colour Preference',
    prompt: 'When you drink wine, what colour do you usually reach for?',
    type: 'single',
    options: [
      { letter: 'A', label: 'Red, always' },
      { letter: 'B', label: 'White, mostly' },
      { letter: 'C', label: 'I love Rosé' },
      { letter: 'D', label: 'Mix it up' },
    ],
  },
  {
    key: 'coffee',
    number: 3,
    title: 'Coffee / Tea Preference',
    subtitle: 'Tannin proxy',
    prompt: 'How do you take your coffee or tea?',
    type: 'single',
    options: [
      { letter: 'A', label: 'Black and strong / espresso' },
      { letter: 'B', label: 'A little milk or cream' },
      { letter: 'C', label: 'Lots of milk, sugar, or sweet syrups' },
      { letter: 'D', label: 'I prefer fruit juice or soda' },
    ],
  },
  {
    key: 'lemon',
    number: 4,
    title: 'Lemon Reaction',
    subtitle: 'Acidity proxy',
    prompt: "Imagine you're eating a fresh lemon wedge. What is your reaction?",
    type: 'single',
    options: [
      { letter: 'A', label: 'Love it, extra lemon on everything' },
      { letter: 'B', label: 'Okay, balanced with something sweet' },
      { letter: 'C', label: 'Too sour, I pucker up' },
    ],
  },
  {
    key: 'dessert',
    number: 5,
    title: 'Dessert Choice',
    subtitle: 'Sweetness + flavour proxy',
    prompt: 'If you were choosing a dessert, which sounds best right now?',
    type: 'single',
    options: [
      { letter: 'A', label: 'Dark chocolate truffles' },
      { letter: 'B', label: 'Lemon tart or berry sorbet' },
      { letter: 'C', label: 'Warm apple pie with vanilla ice cream' },
      { letter: 'D', label: 'Sticky toffee pudding or milk chocolate' },
      { letter: 'E', label: 'A cheese plate over sweets' },
    ],
  },
  {
    key: 'fruit',
    number: 6,
    title: 'Fruit Flavour Preference',
    subtitle: 'Primary flavour',
    prompt: 'What kind of fruit flavours do you find most appealing?',
    type: 'single',
    options: [
      { letter: 'A', label: 'Crisp green apples, pears, citrus' },
      { letter: 'B', label: 'Tropical fruits (pineapple, mango, passionfruit)' },
      { letter: 'C', label: 'Tart red berries (raspberries, cherries)' },
      { letter: 'D', label: 'Dark jammy fruits (blackberries, plums)' },
    ],
  },
  {
    key: 'dietary',
    number: 7,
    title: 'Dietary Restrictions',
    prompt: 'Do you have any specific dietary preferences regarding wine?',
    type: 'multi',
    options: [
      { value: 'vegan', label: 'Vegan' },
      { value: 'organic', label: 'Organic / Biodynamic' },
      { value: 'low-sulfite', label: 'Low Sulfite' },
    ],
  },
  {
    key: 'budget',
    number: 8,
    title: 'Budget Per Bottle',
    prompt: 'What is your typical comfortable budget for a bottle of wine at home?',
    type: 'single',
    options: [
      { letter: 'A', label: 'Under GHS 150' },
      { letter: 'B', label: 'GHS 150 – 350' },
      { letter: 'C', label: 'GHS 350 – 750' },
      { letter: 'D', label: 'Over GHS 750' },
    ],
  },
];

export const EXPERIENCE_MAP = { A: 'beginner', B: 'intermediate', C: 'advanced', D: 'expert' };
export const COLOR_MAP = { A: ['red'], B: ['white'], C: ['rose'], D: ['red', 'white', 'rose', 'sparkling'] };
export const TANNIN_MAP = { A: 'high', B: 'medium', C: 'low', D: 'low' };
export const ACIDITY_MAP = { A: 'high', B: 'medium', C: 'low' };
export const DESSERT_SWEETNESS_MAP = { A: 'dry', B: 'off-dry', C: 'medium-sweet', D: 'sweet', E: 'dry' };
export const DESSERT_LIKES_MAP = {
  A: ['chocolate', 'earthy', 'rich'],
  B: ['citrus-fruit', 'red-fruit'],
  C: ['vanilla', 'buttery', 'stone-fruit', 'spice'],
  D: ['caramel', 'honey', 'rich'],
  E: ['savory', 'earthy'],
};
export const FRUIT_LIKES_MAP = {
  A: ['citrus-fruit', 'stone-fruit'],
  B: ['tropical-fruit'],
  C: ['red-fruit'],
  D: ['black-fruit', 'jammy'],
};
export const BUDGET_MAP = {
  A: { min: 0, max: 150 },
  B: { min: 150, max: 350 },
  C: { min: 350, max: 750 },
  D: { min: 750, max: null },
};

export const isAdvancedOrExpert = (experienceLetter) => experienceLetter === 'C' || experienceLetter === 'D';

export const isQuizComplete = (answers) => {
  return ['experience', 'color', 'coffee', 'lemon', 'dessert', 'fruit', 'budget'].every((k) => !!answers[k])
    && Array.isArray(answers.dietary);
};

// Kept for anywhere that just wants the final payload from raw answers alone (e.g. a bulk import)
export const buildTasteProfilePayload = (answers) => {
  const { experience, color, coffee, lemon, dessert, fruit, dietary, budget } = answers;

  const experience_level = EXPERIENCE_MAP[experience];
  const wine_color = COLOR_MAP[color] || [];
  const tannin_tolerance = TANNIN_MAP[coffee];
  const acidity_preference = ACIDITY_MAP[lemon];

  let sweetness_tolerance = DESSERT_SWEETNESS_MAP[dessert];
  if (dessert === 'E' && isAdvancedOrExpert(experience)) {
    sweetness_tolerance = 'bone-dry';
  }

  const likes = [...(DESSERT_LIKES_MAP[dessert] || []), ...(FRUIT_LIKES_MAP[fruit] || [])];

  return {
    preferences: { wine_color, sweetness_tolerance, tannin_tolerance, acidity_preference },
    flavor_profile: { likes: [...new Set(likes)], dislikes: [] },
    dietary_restrictions: Array.isArray(dietary) ? dietary : [],
    typical_budget_per_bottle: BUDGET_MAP[budget],
    experience_level,
    quiz_answers: { experience, color, coffee, lemon, dessert, fruit, dietary: dietary || [], budget },
  };
};