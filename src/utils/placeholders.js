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

const CHARACTERISTIC_SETS = [
  { light_bold: 70, smooth_tannic: 55, dry_sweet: 30, soft_acidic: 60 },
  { light_bold: 40, smooth_tannic: 30, dry_sweet: 65, soft_acidic: 45 },
  { light_bold: 85, smooth_tannic: 80, dry_sweet: 20, soft_acidic: 35 },
  { light_bold: 55, smooth_tannic: 45, dry_sweet: 50, soft_acidic: 50 },
];
export const getPlaceholderCharacteristics = (id) => CHARACTERISTIC_SETS[hashToIndex(id, CHARACTERISTIC_SETS.length)];

const AVATAR_COLORS = ['#8C2F39', '#C08A34', '#2F3A2C', '#6B7A5E', '#A65B4B'];
export const getAvatarColor = (seed) => AVATAR_COLORS[hashToIndex(seed, AVATAR_COLORS.length)];

export const getInitials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('') || '?';
