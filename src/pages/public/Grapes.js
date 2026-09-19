import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Loader2, X } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../../redux/catalogSlice';
import { fetchFoodDishes } from '../../redux/foodPairingSlice';
import { fetchWishlist } from '../../redux/wishlistSlice';
import SectionBanner from '../../components/public/shared/SectionBanner';
import ProductCard from '../../components/public/shared/ProductCard';
import { RadioFacet, CharacteristicSlider } from '../../components/public/shop/FacetControls';
import { CHARACTERISTIC_KEYS, buildCharacteristicsPatch } from '../../utils/characteristicFilters';

// A dedicated route (rather than a mode flag on Shop) — visiting it always mounts
// fresh and re-fetches, and the sidebar only shows facets relevant once you're
// already scoped to grapes (no Wine Type here).
const Grapes = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, categories, productsLoading: loading, productsMeta } = useSelector((state) => state.catalog);
  const { dishes } = useSelector((state) => state.foodPairing);

  const grapeOptions = categories.filter((c) => c.type === 'grape').map((c) => ({ value: c.id, label: c.name }));
  const dishOptions = dishes.map((d) => ({ value: d.id, label: d.name }));
  const allGrapeIds = grapeOptions.map((o) => o.value).join(',');

  const [filters, setFilters] = useState({
    page: searchParams.get('page') || 1,
    // Undocumented-but-confirmed: /products defaults to per_page=15 with no error
    // and no hint there's more — always send it explicitly.
    per_page: 24,
    category_id: searchParams.get('category_id') || '',
    dish_id: searchParams.get('dish_id') || '',
    search: '',
    sort_by: searchParams.get('sort_by') || '',
    sort_order: searchParams.get('sort_order') || 'desc',
    min_price: searchParams.get('min_price') || 0,
    max_price: searchParams.get('max_price') || 500,
  });

  const [priceValue, setPriceValue] = useState(Number(filters.max_price) || 500);
  const [lightBold, setLightBold] = useState(50);
  const [smoothTannic, setSmoothTannic] = useState(50);

  useEffect(() => {
    // This page only ever needs grape categories — the type is just "grape".
    // /categories paginates (15 per page by default) even without asking for it —
    // without a high per_page this silently drops most grape varieties off the list.
    dispatch(fetchCategories({ type: 'grape', per_page: 200 }));
    dispatch(fetchFoodDishes({ per_page: 50 }));
    dispatch(fetchWishlist());
  }, [dispatch]);

  // Scope to every grape variety as soon as they've loaded, unless a specific one
  // is already selected (e.g. from a shared/bookmarked URL).
  useEffect(() => {
    if (filters.category_id || !allGrapeIds) return;
    setFilters((prev) => ({ ...prev, category_id: allGrapeIds }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allGrapeIds]);

  useEffect(() => {
    if (!filters.category_id) return; // wait for the "all grapes" scope to resolve first
    // The real product filter is category_id (confirmed working against the backend —
    // a bare `type=grape` is silently ignored on /products, it's only a filter on
    // /categories). But the address bar doesn't need to expose that raw, comma-joined
    // ID list — show the clean `type=grape` the page actually represents instead.
    dispatch(fetchProducts(filters));
    const { category_id, ...rest } = filters;
    const publicParams = { type: 'grape', ...rest };
    const activeParams = Object.fromEntries(Object.entries(publicParams).filter(([_, v]) => v !== ''));
    setSearchParams(activeParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, dispatch]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setFilters((prev) => {
        if (Number(prev.max_price) === priceValue) return prev;
        return { ...prev, page: 1, max_price: priceValue };
      });
    }, 500);
    return () => clearTimeout(handle);
  }, [priceValue]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setFilters((prev) => {
        const next = { ...prev, page: 1 };
        CHARACTERISTIC_KEYS.forEach((k) => delete next[k]);
        Object.assign(next, buildCharacteristicsPatch(lightBold, smoothTannic));
        return next;
      });
    }, 500);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightBold, smoothTannic]);

  const visibleProducts = products;
  const canLoadMore = !productsMeta || productsMeta.current_page < productsMeta.last_page;

  const handleLoadMore = () => {
    setFilters((prev) => ({ ...prev, page: Number(prev.page) + 1 }));
  };

  const handleSortChange = (e) => {
    const [sort_by, sort_order] = e.target.value ? e.target.value.split('_') : ['', 'desc'];
    setFilters((prev) => ({ ...prev, page: 1, sort_by, sort_order }));
  };

  const handleGrapeSelect = (categoryId) => {
    // Deselecting a specific grape falls back to "all grapes", not "everything" —
    // this page is always scoped to grapes.
    setFilters((prev) => ({ ...prev, page: 1, category_id: categoryId || allGrapeIds }));
  };

  const handleDishSelect = (dishId) => {
    setFilters((prev) => ({ ...prev, page: 1, dish_id: dishId }));
  };

  const isFilterActive = Boolean(
    (filters.category_id && filters.category_id !== allGrapeIds) ||
      filters.dish_id ||
      Number(filters.min_price) !== 0 ||
      Number(filters.max_price) !== 500 ||
      CHARACTERISTIC_KEYS.some((k) => filters[k] !== undefined)
  );

  const handleClearFilters = () => {
    setPriceValue(500);
    setLightBold(50);
    setSmoothTannic(50);
    setFilters((prev) => ({
      page: 1,
      per_page: 24,
      category_id: allGrapeIds,
      dish_id: '',
      search: '',
      sort_by: '',
      sort_order: 'desc',
      min_price: 0,
      max_price: 500,
    }));
  };

  return (
    <div className="bg-cream min-h-screen">
      <SectionBanner title="Grapes" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Grapes' }]} />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row gap-14">
          <aside className="w-full md:w-64 shrink-0">
            {isFilterActive && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-wine hover:text-wine/70 transition-colors mb-8"
              >
                <X size={13} /> Clear Filters
              </button>
            )}

            {grapeOptions.length > 0 && (
              <RadioFacet title="Grape Variety" options={grapeOptions} selected={filters.category_id} onSelect={handleGrapeSelect} />
            )}
            {dishOptions.length > 0 && (
              <RadioFacet title="Food Pairings" options={dishOptions} selected={filters.dish_id} onSelect={handleDishSelect} scrollable />
            )}

            <div className="mb-10">
              <h4 className="font-bold text-sm text-zinc-900 mb-4">Price</h4>
              <input
                type="range"
                min="0"
                max="500"
                value={priceValue}
                onChange={(e) => setPriceValue(Number(e.target.value))}
                className="w-full accent-forest mb-2"
              />
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span>GHS 0</span>
                <span>GHS {priceValue}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-zinc-900 mb-4">Characteristics</h4>
              <CharacteristicSlider leftLabel="Light" rightLabel="Bold" value={lightBold} onChange={setLightBold} />
              <CharacteristicSlider leftLabel="Smooth" rightLabel="Tannic" value={smoothTannic} onChange={setSmoothTannic} />
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex justify-end mb-8">
              <select
                value={filters.sort_by ? `${filters.sort_by}_${filters.sort_order}` : ''}
                onChange={handleSortChange}
                className="border border-zinc-300 px-4 py-2 text-xs uppercase tracking-widest text-zinc-600 focus:outline-none focus:border-forest transition-colors bg-white"
              >
                <option value="">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            {(loading || !filters.category_id) && products.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="h-72 bg-zinc-100 mb-4" />
                    <div className="h-4 w-2/3 bg-zinc-100 mb-2" />
                    <div className="h-3 w-1/4 bg-zinc-100" />
                  </div>
                ))}
              </div>
            ) : !loading && visibleProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="font-serif text-2xl text-zinc-700 mb-2">No grape wines found</p>
                <p className="text-sm text-zinc-400">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className="relative">
                {loading && (
                  <div className="absolute inset-0 z-10 flex justify-center pt-24 bg-cream/60">
                    <Loader2 size={32} className="animate-spin text-forest" />
                  </div>
                )}
                <div
                  className={`max-h-[1400px] overflow-y-auto pr-2 transition-opacity duration-300 ${
                    loading ? 'opacity-40 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                    {visibleProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {visibleProducts.length > 0 && canLoadMore && (
              <div className="flex justify-center mt-16">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="border border-forest text-forest px-10 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-forest hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'View More'}
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Grapes;
