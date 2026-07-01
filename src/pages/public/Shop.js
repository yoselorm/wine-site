import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { fetchProducts, fetchCategories, fetchRegions } from '../../redux/catalogSlice';
import { addToCart } from '../../redux/cartSlice';
import { fetchWishlist, addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import toast from '../../components/Toast';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/600x800.png?text=No+Image';

const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { products, categories, regions, loading } = useSelector((state) => state.catalog);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const wishlistIds = wishlistItems.map(item => item.product?.id || item.id);

  const [filters, setFilters] = useState({
    page: searchParams.get('page') || 1,
    category_id: searchParams.get('category_id') || '',
    region_id: searchParams.get('region_id') || '',
    search: searchParams.get('search') || '',
    sort_order: searchParams.get('sort_order') || 'desc'
  });

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchRegions());
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    );
    setSearchParams(activeFilters);
  }, [filters, dispatch, setSearchParams]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const activeFilterCount = [filters.category_id, filters.region_id, filters.search].filter(Boolean).length;

  const clearFilters = () => {
    setFilters(prev => ({ ...prev, category_id: '', region_id: '', search: '', page: 1 }));
  };

  const getProductImage = (product) =>
    product.images?.find(img => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    product.image_url ||
    PLACEHOLDER_IMAGE;

const handleAddToCart = (e, product) => {
  e.stopPropagation();
  dispatch(addToCart({
    id: product.id,
    name: product.name,
    price: product.price,
    image_url: getProductImage(product),
    quantity: 1,
  }));
  toast.success(`${product.name} added to cart`);
};

const handleToggleWishlist = async (e, product) => {
  e.stopPropagation();
  try {
    if (wishlistIds.includes(product.id)) {
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



  return (
    <div className="max-w-7xl mx-auto px-6 py-16 mt-14">
      <div className="mb-14 border-b border-zinc-200 pb-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-400 mb-3">The Collection</p>
        <h1 className="font-serif text-4xl md:text-5xl text-zinc-900 tracking-tight">Shop All Wines</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-14">
        <aside className="w-full md:w-56 shrink-0 space-y-10">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] text-zinc-900">Refine</h4>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-[11px] text-zinc-400 hover:text-zinc-900 underline underline-offset-2 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">Category</h4>
            <select 
              value={filters.category_id}
              onChange={(e) => handleFilterChange('category_id', e.target.value)}
              className="w-full border-b border-zinc-300 py-2 bg-transparent outline-none cursor-pointer text-sm text-zinc-800 hover:border-zinc-900 transition-colors"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">Region</h4>
            <select 
              value={filters.region_id}
              onChange={(e) => handleFilterChange('region_id', e.target.value)}
              className="w-full border-b border-zinc-300 py-2 bg-transparent outline-none cursor-pointer text-sm text-zinc-800 hover:border-zinc-900 transition-colors"
            >
              <option value="">All Regions</option>
              {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>

          <div>
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-3">Sort By</h4>
            <select 
              value={filters.sort_order}
              onChange={(e) => handleFilterChange('sort_order', e.target.value)}
              className="w-full border-b border-zinc-300 py-2 bg-transparent outline-none cursor-pointer text-sm text-zinc-800 hover:border-zinc-900 transition-colors"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </aside>

        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i}>
                  <div className="h-80 bg-zinc-100 mb-4" />
                  <div className="h-4 w-2/3 bg-zinc-100 mb-2" />
                  <div className="h-3 w-1/4 bg-zinc-100" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <p className="font-serif text-2xl text-zinc-700 mb-2">No wines found</p>
              <p className="text-sm text-zinc-400 mb-6">Try adjusting your filters to see more results.</p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[11px] font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-900 pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
              {products.map(p => {
                const isWishlisted = wishlistIds.includes(p.id);
                return (
                  <div key={p.id} className="group cursor-pointer">
                    <div className="h-80 bg-zinc-100 mb-5 overflow-hidden relative">
                      <img
                        src={getProductImage(p)}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/10 transition-colors duration-500" />

                      <button
                        onClick={(e) => handleToggleWishlist(e, p)}
                        className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white ${isWishlisted ? 'opacity-100' : ''}`}
                        aria-label="Toggle wishlist"
                      >
                        <Heart size={15} className={isWishlisted ? 'fill-zinc-900 text-zinc-900' : 'text-zinc-700'} />
                      </button>

                      <div className="absolute bottom-0 left-0 right-0 flex translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                        <button
                          onClick={(e) => handleAddToCart(e, p)}
                          disabled={p.stock_quantity <= 0}
                          className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-white py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:bg-zinc-400 disabled:cursor-not-allowed"
                        >
                          <ShoppingBag size={13} />
                          {p.stock_quantity > 0 ? 'Add to Cart' : 'Sold Out'}
                        </button>
                        <button
                          onClick={()=>navigate(`/shop/${p.slug}`)}
                          className="w-12 flex items-center justify-center bg-white text-zinc-900 hover:bg-zinc-100 transition-colors border-l border-zinc-200"
                          aria-label="Quick view"
                        >
                          <Eye size={15} />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-serif text-lg text-zinc-900 leading-snug group-hover:text-zinc-600 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-zinc-400 text-xs font-light tracking-wide mt-1">
                      GHS {Number(p.price).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;