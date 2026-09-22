import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Heart, Minus, Plus, Star } from 'lucide-react';
import { fetchProductBySlug, fetchProducts, submitProductReview, clearSelectedItems } from '../../redux/catalogSlice';
import { addToCart } from '../../redux/cartSlice';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import toast from '../../components/Toast';
import SectionBanner from '../../components/public/shared/SectionBanner';
import RatingStars from '../../components/public/shared/RatingStars';
import ProductCard from '../../components/public/shared/ProductCard';
import InfiniteCarousel from '../../components/public/shared/InfiniteCarousel';
import { stripHtml } from '../../utils/text';
import {
  getPlaceholderCharacteristics,
  getInitials,
  getAvatarColor,
} from '../../utils/placeholders';

const PairingCard = ({ pairing }) => (
  <div className="bg-white border border-zinc-200 h-full flex flex-col">
    <div className="w-full aspect-[4/3] bg-cream flex items-center justify-center overflow-hidden">
      {pairing.dish?.image_url ? (
        <img src={pairing.dish.image_url} alt={pairing.dish.name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-serif text-3xl text-gold/50">{pairing.dish?.name?.[0]}</span>
      )}
    </div>
    <div className="p-4">
      <h4 className="font-serif text-sm text-zinc-900 mb-1">{pairing.dish?.name}</h4>
      {pairing.reason && <p className="text-xs text-zinc-500 font-light leading-relaxed line-clamp-3">{pairing.reason}</p>}
    </div>
  </div>
);

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, products, productLoading: loading, error } = useSelector((state) => state.catalog);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    dispatch(fetchWishlist());
    if (products.length === 0) dispatch(fetchProducts());
    setReviewRating(0);
    setReviewComment('');
    setReviewSubmitted(false);

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

  // A whole average arrives as an integer over JSON (4, not 4.0) — coerce before
  // formatting. Null (not zero) means no approved reviews yet — never render an
  // empty star row for that, it reads as "rated zero".
  const averageRating = product.average_rating != null ? Number(product.average_rating) : null;
  const reviewsList = product.reviews || [];
  const reviewsCount = product.reviews_count ?? reviewsList.length;
  const characteristics = getPlaceholderCharacteristics(product.id);
  const similarProducts = products.filter((p) => p.id !== product.id).slice(0, 12);

  // Grouped by dish.is_local (not `pairing_type`, which is authored per-pairing and
  // can disagree with the dish's own local/international flag) — local dishes first.
  const pairings = product.pairings || [];
  const localPairings = pairings.filter((p) => p.dish?.is_local);
  const internationalPairings = pairings.filter((p) => !p.dish?.is_local);

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewRating < 1) {
      toast.error('Please select a star rating');
      return;
    }
    setSubmittingReview(true);
    try {
      await dispatch(submitProductReview({ slug, rating: reviewRating, comment: reviewComment.trim() || undefined })).unwrap();
      setReviewSubmitted(true);
      toast.success('Thanks for your review! It will appear here once approved.');
    } catch (err) {
      toast.error(err || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
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
              {averageRating != null ? (
                <RatingStars rating={averageRating} count={reviewsCount} size={16} className="mb-4" />
              ) : (
                <p className="text-xs text-zinc-400 mb-4">No reviews yet</p>
              )}
              <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 mb-4">{product.name}</h1>

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

            <div className="mb-10">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-900 mb-3">Description</h3>
              <p className="text-zinc-600 leading-relaxed font-light mb-4">{stripHtml(product.description || product.short_description)}</p>
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

        <div className="bg-white p-8 md:p-10 mt-16 max-w-md">
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

        {localPairings.length > 0 && (
          <div className="mt-16">
            <h3 className="font-serif text-2xl text-zinc-900 mb-8">Local Pairings</h3>
            <InfiniteCarousel
              items={localPairings}
              itemWidth={240}
              keyFor={(p, i) => `${p.dish_id}-${i}`}
              renderItem={(pairing) => <PairingCard pairing={pairing} />}
            />
          </div>
        )}

        {internationalPairings.length > 0 && (
          <div className="mt-16">
            <h3 className="font-serif text-2xl text-zinc-900 mb-8">International Pairings</h3>
            <InfiniteCarousel
              items={internationalPairings}
              itemWidth={240}
              keyFor={(p, i) => `${p.dish_id}-${i}`}
              renderItem={(pairing) => <PairingCard pairing={pairing} />}
            />
          </div>
        )}

        <div className="mt-16">
          <h3 className="font-serif text-2xl text-zinc-900 mb-10">Reviews</h3>

          {averageRating != null ? (
            <div className="flex items-center gap-4 mb-12">
              <p className="font-serif text-5xl text-zinc-900">{averageRating.toFixed(1)}</p>
              <div>
                <RatingStars rating={averageRating} size={16} className="mb-1" />
                <p className="text-xs text-zinc-400">
                  {reviewsCount} {reviewsCount === 1 ? 'rating' : 'ratings'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-zinc-400 mb-12">No reviews yet — be the first to review this wine.</p>
          )}

          {reviewsList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
              {reviewsList.map((rev) => {
                const reviewerName = rev.reviewer?.name || 'Anonymous';
                return (
                  <div key={rev.id} className="border-t border-zinc-200 pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      {rev.reviewer?.avatar_url ? (
                        <img src={rev.reviewer.avatar_url} alt={reviewerName} className="w-9 h-9 rounded-full object-cover" />
                      ) : (
                        <span
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                          style={{ backgroundColor: getAvatarColor(reviewerName) }}
                        >
                          {getInitials(reviewerName)}
                        </span>
                      )}
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{reviewerName}</p>
                        <p className="text-[11px] text-zinc-400">
                          {new Date(rev.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <RatingStars rating={rev.rating} className="mb-3" />
                    {rev.comment && <p className="text-sm text-zinc-500 font-light leading-relaxed">{rev.comment}</p>}
                  </div>
                );
              })}
            </div>
          )}

          <div className="bg-white p-8 md:p-10 max-w-xl">
            <h4 className="font-serif text-lg text-zinc-900 mb-1">Write a Review</h4>
            {!isAuthenticated ? (
              <p className="text-sm text-zinc-500 font-light">
                <Link to="/login" className="text-forest font-medium border-b border-forest hover:text-forest-dark hover:border-forest-dark transition-colors">
                  Log in
                </Link>{' '}
                to leave a review for this wine.
              </p>
            ) : reviewSubmitted ? (
              <p className="text-sm text-zinc-500 font-light">
                Thanks for your review! It's awaiting approval and will appear here once approved.
              </p>
            ) : (
              <form onSubmit={handleSubmitReview}>
                <p className="text-xs text-zinc-400 font-light mb-4">Reviews are checked by our team before appearing publicly.</p>
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setReviewRating(n)}
                      onMouseEnter={() => setReviewHoverRating(n)}
                      onMouseLeave={() => setReviewHoverRating(0)}
                      aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
                      className="p-0.5"
                    >
                      <Star
                        size={22}
                        className={n <= (reviewHoverRating || reviewRating) ? 'fill-wine text-wine' : 'fill-transparent text-wine/30'}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value.slice(0, 1000))}
                  placeholder="Share your thoughts on this wine (optional)"
                  rows={4}
                  maxLength={1000}
                  className="w-full border border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:border-forest transition-colors mb-2 resize-none"
                />
                <p className="text-[11px] text-zinc-400 mb-4">{reviewComment.length}/1000</p>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="bg-forest text-white px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-forest-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>

        {similarProducts.length > 0 && (
          <div className="mt-20">
            <h3 className="font-serif text-2xl text-zinc-900 mb-10">Similar Products</h3>
            <InfiniteCarousel
              items={similarProducts}
              itemWidth={240}
              keyFor={(p) => p.id}
              renderItem={(p) => <ProductCard product={p} />}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
