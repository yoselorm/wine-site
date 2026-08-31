import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Plus } from 'lucide-react';
import { addToCart } from '../../../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../../redux/wishlistSlice';
import toast from '../../Toast';
import RatingStars from './RatingStars';
import { getPlaceholderRating } from '../../../utils/placeholders';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x800.png?text=No+Image';

const getProductImage = (product) =>
  product.images?.find((img) => img.is_primary)?.image_url ||
  product.images?.[0]?.image_url ||
  product.image_url ||
  product.image ||
  PLACEHOLDER_IMAGE;

const ProductCard = ({ product, iconVariant = 'heart' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const isWishlisted = wishlistItems.some((item) => (item.product_id ?? item.product?.id ?? item.id) === product.id);

  const rating = product.rating ?? getPlaceholderRating(product.id ?? product.name);
  const subtitle = product.brand?.name || product.regions?.[0]?.name || product.categories?.[0]?.name || 'Bold Imperial';

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.sale_price || product.price,
        image_url: getProductImage(product),
        quantity: 1,
      })
    );
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(product.id)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error(err || 'Something went wrong');
    }
  };

  const goToProduct = () => product.slug && navigate(`/shop/${product.slug}`);

  return (
    <div onClick={goToProduct} className="group cursor-pointer transition-transform duration-300 ease-out hover:-translate-y-1">
      <div className="bg-white aspect-[3/4] relative overflow-hidden mb-4 flex items-center justify-center p-4 transition-shadow duration-300 ease-out group-hover:shadow-lg">
        <img
          src={getProductImage(product)}
          alt={product.name}
          className="h-full w-auto object-contain transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <button
          onClick={iconVariant === 'heart' ? handleToggleWishlist : handleAddToCart}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center transition-all duration-300 ease-out hover:scale-110 ${
            isWishlisted && iconVariant === 'heart' ? 'text-wine' : 'text-zinc-500 hover:text-forest'
          }`}
          aria-label={iconVariant === 'heart' ? 'Toggle wishlist' : 'Quick add to cart'}
        >
          {iconVariant === 'heart' ? (
            <Heart size={14} className={isWishlisted ? 'fill-wine' : ''} />
          ) : (
            <Plus size={15} />
          )}
        </button>
      </div>

      <RatingStars rating={rating} className="mb-1.5" />
      <p className="text-[11px] text-zinc-400 mb-0.5">{subtitle}</p>
      <h3 className="font-serif text-sm text-zinc-900 mb-1 transition-colors duration-300 group-hover:text-forest">{product.name}</h3>
      <p className="text-wine text-sm font-semibold">GHS {Number(product.sale_price || product.price || 0).toFixed(2)}</p>
    </div>
  );
};

export default ProductCard;
