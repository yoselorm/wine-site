// Placeholder data for anything the backend doesn't yet expose (ratings, reviews,
// awards, taste notes, pairings, characteristic sliders, filter facets).
// Values are keyed deterministically off an id so a given product/blog always
// renders the same placeholder instead of a new random value on every render.

const hashToIndex = (id, length) => {
  const n = typeof id === 'number' ? id : String(id ?? '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return Math.abs(n) % length;
};

export const WINE_TYPES = ['Red', 'White', 'Sparkling', 'Dessert', 'Port'];
export const GRAPE_VARIETIES = ['Cabernet Sauvignon', 'Merlot', 'Cabernet Franc'];
export const FOOD_PAIRINGS = ['Beef', 'Game', 'Poultry'];

const RATINGS = [4.8, 4.5, 4.2, 4.6, 4.0, 4.7, 4.3];
export const getPlaceholderRating = (id) => RATINGS[hashToIndex(id, RATINGS.length)];

const REVIEW_COUNTS = [128, 64, 302, 47, 210, 89, 156];
export const getPlaceholderReviewCount = (id) => REVIEW_COUNTS[hashToIndex(id, REVIEW_COUNTS.length)];

const CHARACTERISTIC_SETS = [
  { light_bold: 70, smooth_tannic: 55, dry_sweet: 30, soft_acidic: 60 },
  { light_bold: 40, smooth_tannic: 30, dry_sweet: 65, soft_acidic: 45 },
  { light_bold: 85, smooth_tannic: 80, dry_sweet: 20, soft_acidic: 35 },
  { light_bold: 55, smooth_tannic: 45, dry_sweet: 50, soft_acidic: 50 },
];
export const getPlaceholderCharacteristics = (id) => CHARACTERISTIC_SETS[hashToIndex(id, CHARACTERISTIC_SETS.length)];

const TASTE_NOTE_SETS = [
  ['Blackberry', 'Red Fruit', 'Oak'],
  ['Citrus', 'Green Apple', 'Honey'],
  ['Cherry', 'Vanilla', 'Spice'],
  ['Pear', 'Almond', 'Floral'],
];
export const getPlaceholderTasteNotes = (id) => TASTE_NOTE_SETS[hashToIndex(id, TASTE_NOTE_SETS.length)];

const PAIRING_SETS = [
  ['Red Meat', 'Hard Cheese', 'Roast'],
  ['Seafood', 'Poultry', 'Salad'],
  ['Pasta', 'Charcuterie', 'Pizza'],
];
export const getPlaceholderPairings = (id) => PAIRING_SETS[hashToIndex(id, PAIRING_SETS.length)];

const AWARD_SETS = [
  ['Best Wine Awards', '2nd Best Tasting Award'],
  ['Gold Medal, International Wine Challenge'],
  ['Decanter World Wine Awards — Silver'],
  [],
];
export const getPlaceholderAwards = (id) => AWARD_SETS[hashToIndex(id, AWARD_SETS.length)];

export const getPlaceholderReviews = (id) => {
  const seedIndex = hashToIndex(id, 3);
  const names = [['John Doe', 'Sarah Lee'], ['Michael Owusu', 'Ama Boateng'], ['Kwame Mensah', 'Linda Osei']];
  const [nameA, nameB] = names[seedIndex];
  return [
    {
      name: nameA,
      rating: 5,
      date: 'August 1, 2020',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquam purus sit amet luctus venenatis, lectus magna fringilla urna.',
    },
    {
      name: nameB,
      rating: 4,
      date: 'August 16, 2020',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut aliquam purus sit amet luctus venenatis, lectus magna fringilla urna.',
    },
  ];
};

export const getRatingBreakdown = (id) => {
  const sets = [
    [62, 22, 9, 4, 3],
    [48, 30, 12, 6, 4],
    [70, 18, 7, 3, 2],
  ];
  return sets[hashToIndex(id, sets.length)];
};

const AVATAR_COLORS = ['#8C2F39', '#C08A34', '#2F3A2C', '#6B7A5E', '#A65B4B'];
export const getAvatarColor = (seed) => AVATAR_COLORS[hashToIndex(seed, AVATAR_COLORS.length)];

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || '?';
