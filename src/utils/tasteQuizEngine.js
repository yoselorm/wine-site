// Question content (prompt, help text, options, order) comes from GET /v1/quiz —
// it's admin-editable, so it must never be hardcoded here. See
// src/redux/tasteProfileSlice.js's fetchQuizQuestions and TasteQuizModal.js.
//
// The derivation logic below (letter/value -> profile field) stays static: the
// quiz's answer *codes* (A/B/C/D/E, vegan/organic/low-sulfite) are a stable
// contract independent of how an admin rewords the question or option labels.

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

// Driven by the fetched question list rather than a hardcoded key list, so a
// question an admin adds, removes or flips required/optional is respected
// automatically. An empty `questions` list (still loading) is never "complete".
export const isQuizComplete = (answers, questions = []) => {
  if (questions.length === 0) return false;
  return questions.every((q) => {
    if (!q.is_required) return true;
    const answer = answers[q.key];
    return q.input_type === 'multi' ? Array.isArray(answer) : !!answer;
  });
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