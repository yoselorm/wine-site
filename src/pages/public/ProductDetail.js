import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Heart, ChevronRight, Minus, Plus, ChevronLeft, Award } from 'lucide-react';
import { fetchProductBySlug, fetchProducts, clearSelectedItems } from '../../redux/catalogSlice';
import { addToCart } from '../../redux/cartSlice';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import toast from '../../components/Toast';
import SectionBanner from '../../components/public/shared/SectionBanner';
import RatingStars from '../../components/public/shared/RatingStars';
import ProductCard from '../../components/public/shared/ProductCard';
import {
  getPlaceholderRating,
  getPlaceholderReviewCount,
  getPlaceholderCharacteristics,
  getPlaceholderTasteNotes,
  getPlaceholderPairings,
  getPlaceholderAwards,
  getPlaceholderReviews,
  getRatingBreakdown,
  getInitials,
  getAvatarColor,
} from '../../utils/placeholders';

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, products, loading, error } = useSelector((state) => state.catalog);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    dispatch(fetchWishlist());
    if (products.length === 0) dispatch(fetchProducts());

    return () => {
      dispatch(clearSelectedItems());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, dispatch]);

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 flex gap-12 animate-pulse">
        <div className="w-1/2 h-[600px] bg-zinc-200"></div>
        <div className="w-1/2 space-y-6 pt-12">
          <div className="h-4 w-32 bg-zinc-200"></div>
          <div className="h-10 w-3/4 bg-zinc-200"></div>
          <div className="h-6 w-24 bg-zinc-200"></div>
          <div className="h-32 w-full bg-zinc-200 mt-8"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-24 text-wine font-serif text-xl">{error}</div>;
  }

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    'https://via.placeholder.com/600x800.png?text=No+Image';
  const category = product.categories?.[0];
  const isOnSale = product.sale_price && product.sale_price < product.price;
  const isWishlisted = wishlistItems.some((item) => (item.product_id ?? item.product?.id ?? item.id) === product.id);

  const rating = getPlaceholderRating(product.id);
  const reviewCount = getPlaceholderReviewCount(product.id);
  const characteristics = getPlaceholderCharacteristics(product.id);
  const tasteNotes = getPlaceholderTasteNotes(product.id);
  const pairings = getPlaceholderPairings(product.id);
  const awards = getPlaceholderAwards(product.id);
  const reviews = getPlaceholderReviews(product.id);
  const breakdown = getRatingBreakdown(product.id);
  const similarProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: isOnSale ? product.sale_price : product.price,
        image_url: primaryImage,
        quantity,
      })
    );
    toast.success(`${product.name} added to cart`);
  };

  const handleToggleWishlist = async () => {
    try {
      if (isWishlisted) {
        await dispatch(removeFromWishlist(product.id)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
        dispatch(fetchWishlist());
        toast.success('Added to wishlist');
      }
    } catch (err) {
      toast.error(err || 'Something went wrong');
    }
  };

  return (
    <div className="bg-cream min-h-screen">
      <SectionBanner
        title={product.name}
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Shop', to: '/shop' },
          ...(category ? [{ label: category.name, to: `/shop?category_id=${category.id}` }] : []),
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="w-full lg:w-2/5">
            <div className="bg-white aspect-[3/4] relative overflow-hidden flex items-center justify-center p-8">
              {product.is_featured && (
                <span className="absolute top-4 left-4 bg-forest text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">
                  Featured
                </span>
              )}
              <img src={primaryImage} alt={product.name} className="w-full h-full object-contain" />
            </div>
          </div>

          <div className="w-full lg:w-3/5">
            <div className="mb-6">
              <RatingStars rating={rating} count={reviewCount} size={16} className="mb-4" />
              <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 mb-4">{product.name}</h1>

              <button className="flex items-center gap-2 border border-zinc-300 px-4 py-2 text-xs text-zinc-600 mb-5 hover:border-forest transition-colors">
                Compare
              </button>

              {isOnSale ? (
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-semibold text-wine">GHS{product.sale_price}</span>
                  <span className="text-lg font-light text-zinc-400 line-through">GHS{product.price}</span>
                </div>
              ) : (
                <span className="text-2xl font-semibold text-wine block mb-4">GHS{product.price}</span>
              )}
            </div>

            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center border border-zinc-300 h-12 w-32">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-forest transition-colors">
                  <Minus size={16} />
                </button>
                <span className="flex-1 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity || 99, q + 1))}
                  className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-forest transition-colors"
                  disabled={quantity >= (product.stock_quantity || 99)}
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock_quantity <= 0}
                className="flex-1 h-12 bg-forest text-white flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={16} /> {product.stock_quantity > 0 ? 'Add to Cart' : 'Sold Out'}
              </button>

              <button
                onClick={handleToggleWishlist}
                className={`h-12 w-12 border flex items-center justify-center transition-all ${
                  isWishlisted ? 'bg-wine/5 border-wine text-wine' : 'border-zinc-300 text-zinc-500 hover:text-wine hover:border-wine'
                }`}
              >
                <Heart size={20} className={isWishlisted ? 'fill-wine' : ''} />
              </button>
            </div>

            {awards.length > 0 && (
              <div className="flex flex-wrap gap-4 mb-8">
                {awards.map((award, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-600">
                    <Award size={16} className="text-gold" /> {award}
                  </div>
                ))}
              </div>
            )}

            <div className="mb-10">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-900 mb-3">Description</h3>
              <p className="text-zinc-600 leading-relaxed font-light mb-4">{product.short_description || product.description}</p>
              <div className="flex flex-wrap gap-2">
                {[product.categories?.[0]?.name, product.regions?.[0]?.name, 'Aroma'].filter(Boolean).map((tag) => (
                  <span key={tag} className="text-[10px] uppercase tracking-widest px-3 py-1 bg-white border border-zinc-200 text-zinc-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 bg-white p-8 md:p-12 mt-16">
          <div>
            <h3 className="font-serif text-xl text-zinc-900 mb-8">Characteristics</h3>
            {[
              ['Light', 'Bold', characteristics.light_bold],
              ['Smooth', 'Tannic', characteristics.smooth_tannic],
              ['Dry', 'Sweet', characteristics.dry_sweet],
              ['Soft', 'Acidic', characteristics.soft_acidic],
            ].map(([left, right, val]) => (
              <div key={left} className="mb-6">
                <div className="w-full h-1.5 bg-zinc-100 rounded-full relative">
                  <div className="absolute -top-1 h-3.5 w-3.5 rounded-full bg-forest" style={{ left: `calc(${val}% - 7px)` }} />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 mt-2">
                  <span>{left}</span>
                  <span>{right}</span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-serif text-xl text-zinc-900 mb-8">Taste Notes</h3>
            <div className="flex gap-4 mb-12 flex-wrap">
              {tasteNotes.map((note) => (
                <div key={note} className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-cream border border-gold/40 flex items-center justify-center text-forest">
                    <span className="text-[10px] text-center px-1">{note}</span>
                  </div>
                </div>
              ))}
            </div>

            <h3 className="font-serif text-xl text-zinc-900 mb-6">Pairings</h3>
            <div className="flex gap-3 flex-wrap">
              {pairings.map((pair) => (
                <span key={pair} className="text-xs px-4 py-2 bg-cream border border-zinc-200 text-zinc-600">
                  {pair}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="font-serif text-2xl text-zinc-900 mb-10">Reviews</h3>
          <div className="flex flex-col md:flex-row gap-16 mb-12">
            <div className="text-center shrink-0">
              <p className="font-serif text-5xl text-zinc-900 mb-2">{rating.toFixed(1)}</p>
              <RatingStars rating={rating} size={16} className="justify-center mb-2" />
              <p className="text-xs text-zinc-400">{reviewCount} ratings</p>
            </div>
            <div className="flex-1 space-y-2 max-w-md">
              {breakdown.map((pct, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-500 w-10">{5 - i} star</span>
                  <div className="flex-1 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-wine rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {reviews.map((rev) => (
              <div key={rev.name} className="border-t border-zinc-200 pt-6">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: getAvatarColor(rev.name) }}
                  >
                    {getInitials(rev.name)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{rev.name}</p>
                    <p className="text-[11px] text-zinc-400">{rev.date}</p>
                  </div>
                </div>
                <RatingStars rating={rev.rating} className="mb-3" />
                <p className="text-sm text-zinc-500 font-light leading-relaxed">{rev.text}</p>
              </div>
            ))}
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-10">
              <h3 className="font-serif text-2xl text-zinc-900">Similar Products</h3>
              <div className="flex gap-2 text-zinc-400">
                <ChevronLeft size={18} />
                <ChevronRight size={18} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
