import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, Heart, ChevronRight, Minus, Plus, Info } from 'lucide-react';
import { fetchProductBySlug, clearSelectedItems } from '../../redux/catalogSlice';
import { addToCart } from '../../redux/cartSlice';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import toast from '../../components/Toast';

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct: product, loading, error } = useSelector((state) => state.catalog);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductBySlug(slug));
    dispatch(fetchWishlist());
    
    return () => {
      dispatch(clearSelectedItems());
    };
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
    return <div className="text-center py-24 text-red-500 font-serif text-xl">{error}</div>;
  }

  const primaryImage = product.images?.find(img => img.is_primary)?.image_url || product.images?.[0]?.image_url || 'https://via.placeholder.com/600x800.png?text=No+Image';
  const category = product.categories?.[0];
  const region = product.regions?.[0];
  const isOnSale = product.sale_price && product.sale_price < product.price;
  const isWishlisted = wishlistItems.some(item => (item.product_id ?? item.product?.id ?? item.id) === product.id);

  const formatAttributeName = (str) => {
    return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

const handleAddToCart = () => {
  dispatch(addToCart({
    id: product.id,
    name: product.name,
    price: isOnSale ? product.sale_price : product.price,
    image_url: primaryImage,
    quantity,
  }));
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
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8 md:mb-12">
        <Link to="/" className="hover:text-zinc-900 transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-zinc-900 transition-colors">Shop</Link>
        {category && (
          <>
            <ChevronRight size={12} />
            <Link to={`/shop?category_id=${category.id}`} className="hover:text-zinc-900 transition-colors">{category.name}</Link>
          </>
        )}
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        
        {/* Left Column: Image Gallery */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="bg-zinc-100 aspect-[3/4] relative overflow-hidden flex items-center justify-center">
            {product.is_featured && (
              <span className="absolute top-4 left-4 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 z-10">
                Featured
              </span>
            )}
            <img 
              src={primaryImage} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images?.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map(img => (
                <button key={img.id} className="w-24 h-32 flex-shrink-0 bg-zinc-100 border border-transparent hover:border-zinc-900 transition-colors">
                  <img src={img.image_url} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Info */}
        <div className="w-full lg:w-1/2 flex flex-col">
          
          <div className="mb-8 border-b border-zinc-200 pb-8">
            <h1 className="text-4xl lg:text-5xl font-serif text-zinc-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              {isOnSale ? (
                <>
                  <span className="text-2xl font-light text-zinc-900">GHS{product.sale_price}</span>
                  <span className="text-lg font-light text-zinc-400 line-through">GHS{product.price}</span>
                </>
              ) : (
                <span className="text-2xl font-light text-zinc-900">GHS{product.price}</span>
              )}
            </div>

            <p className="text-zinc-600 leading-relaxed font-light">
              {product.short_description || product.description}
            </p>
          </div>

          <div className="flex items-center gap-4 mb-12">
            <div className="flex items-center border border-zinc-300 h-12 w-32">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
              >
                <Minus size={16} />
              </button>
              <span className="flex-1 text-center text-sm font-bold">{quantity}</span>
              <button 
                onClick={() => setQuantity(q => Math.min(product.stock_quantity, q + 1))}
                className="w-10 h-full flex items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
                disabled={quantity >= product.stock_quantity}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock_quantity <= 0}
              className="flex-1 h-12 bg-zinc-900 text-white flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={16} /> {product.stock_quantity > 0 ? 'Add to Cart' : 'Sold Out'}
            </button>

            <button
              onClick={handleToggleWishlist}
              className={`h-12 w-12 border flex items-center justify-center transition-all ${
                isWishlisted
                  ? 'bg-red-50 border-red-500 text-red-500'
                  : 'border-zinc-300 text-zinc-500 hover:text-red-500 hover:border-red-500'
              }`}
            >
              <Heart size={20} className={isWishlisted ? 'fill-red-500' : ''} />
            </button>
          </div>

          {product.attributes && product.attributes.length > 0 && (
            <div className="mb-12">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-zinc-900 mb-6 flex items-center gap-2">
                <Info size={14} /> Sommelier Notes
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {product.attributes.map(attr => (
                  <div key={attr.id} className="flex justify-between border-b border-zinc-100 pb-2">
                    <span className="text-xs text-zinc-500">{formatAttributeName(attr.attribute_type)}</span>
                    <span className="text-xs font-bold text-zinc-900">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-zinc-50 p-6 space-y-4">
            {region && (
              <div className="flex items-center gap-4">
                {region.flag_url && <img src={region.flag_url} alt={`${region.name} flag`} className="w-8 h-8 rounded-full object-cover" />}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Origin</h4>
                  <p className="text-sm font-serif text-zinc-900">{region.name}</p>
                </div>
              </div>
            )}
            
            {product.brand && (
              <div className="flex items-center gap-4 pt-4 border-t border-zinc-200">
                <div className="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center overflow-hidden">
                  <img src={product.brand.logo_url} alt={product.brand.name} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Producer</h4>
                  <p className="text-sm font-serif text-zinc-900">{product.brand.name}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-2 text-[11px] text-zinc-400">
            <p>SKU: <span className="text-zinc-900">{product.sku}</span></p>
            <p>Availability: <span className={product.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}>
              {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
            </span></p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;