export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x800.png?text=No+Image';

// `images` (a full gallery) is only present on /products and /products/{slug}.
// Other places a product object shows up — sommelier recommendations, history,
// pairing cards — carry a single `primary_image` object instead (per the API
// guide), so both shapes need checking or those images silently never render.
export const getProductImage = (product) =>
  product?.images?.find((img) => img.is_primary)?.image_url ||
  product?.images?.[0]?.image_url ||
  product?.primary_image?.image_url ||
  product?.image_url ||
  product?.image ||
  PLACEHOLDER_IMAGE;
