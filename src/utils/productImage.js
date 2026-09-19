export const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x800.png?text=No+Image';

export const getProductImage = (product) =>
  product?.images?.find((img) => img.is_primary)?.image_url ||
  product?.images?.[0]?.image_url ||
  product?.image_url ||
  product?.image ||
  PLACEHOLDER_IMAGE;
