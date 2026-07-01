import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, HeartCrack } from 'lucide-react';
import { fetchWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import { addToCart } from '../../redux/cartSlice';
import toast from '../../components/Toast';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

const handleRemove = async (productId) => {
  try {
    await dispatch(removeFromWishlist(productId)).unwrap();
    toast.success('Removed from wishlist');
  } catch (err) {
    toast.error(err || 'Failed to remove item');
  }
};

const handleMoveToCart = (product) => {
  dispatch(addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image_url: product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url,
    quantity: 1,
  }));
  toast.success(`${product.name} added to cart`);
};

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
        <h1 className="text-3xl font-serif text-zinc-900 mb-8">My Wishlist</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-4">
              <div className="h-80 bg-zinc-200"></div>
              <div className="h-4 bg-zinc-200 w-3/4"></div>
              <div className="h-4 bg-zinc-200 w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => dispatch(fetchWishlist())} className="text-xs font-bold uppercase tracking-widest border-b border-zinc-900 pb-1">
          Try Again
        </button>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col items-center justify-center text-center">
        <HeartCrack size={48} strokeWidth={1} className="text-zinc-300 mb-6" />
        <h2 className="text-2xl font-serif text-zinc-900 mb-4">Your cellar is empty</h2>
        <p className="text-zinc-500 font-light max-w-md mb-8">
          You haven't saved any wines to your wishlist yet. Explore our collection and find your next favorite vintage.
        </p>
        <Link 
          to="/shop" 
          className="bg-zinc-900 text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
        >
          Discover Wines
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
      <div className="flex items-end justify-between mb-12 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-3xl lg:text-4xl font-serif text-zinc-900 mb-2">My Wishlist</h1>
          <p className="text-sm text-zinc-500 font-light">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item) => {
          // Depending on your API, the product data might be nested inside item.product or top-level. 
          // Adjust this mapping if necessary.
          const product = item.product || item; 
          const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url || 'https://via.placeholder.com/600x800.png?text=No+Image';

          return (
            <div key={item.id} className="group relative flex flex-col">
              
              {/* Product Image */}
              <Link to={`/shop/${product.slug}`} className="bg-zinc-100 aspect-[3/4] mb-4 overflow-hidden relative block">
                <img 
                  src={primaryImage} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Out of Stock Overlay */}
                {product.stock_quantity <= 0 && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-xs font-bold uppercase tracking-widest text-zinc-900 bg-white px-4 py-2">Out of Stock</span>
                  </div>
                )}
              </Link>

              {/* Remove Button (Absolute positioned top right of image) */}
              <button 
                onClick={() => handleRemove(product.id)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-white transition-all shadow-sm z-10"
                title="Remove from wishlist"
              >
                <Trash2 size={14} />
              </button>

              {/* Product Details */}
              <div className="flex-1 flex flex-col">
                <Link to={`/shop/${product.slug}`}>
                  <h3 className="font-serif text-lg text-zinc-900 hover:text-zinc-600 transition-colors mb-1 truncate">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-zinc-500 text-sm font-light mb-4">${product.price}</p>
                
                {/* Action Buttons */}
                <div className="mt-auto">
                  <button 
                    onClick={() => handleMoveToCart(product)}
                    disabled={product.stock_quantity <= 0}
                    className="w-full h-10 border border-zinc-900 text-zinc-900 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-900 hover:text-white transition-colors disabled:border-zinc-300 disabled:text-zinc-400 disabled:bg-transparent disabled:cursor-not-allowed"
                  >
                    <ShoppingBag size={14} /> 
                    {product.stock_quantity > 0 ? 'Move to Cart' : 'Sold Out'}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;