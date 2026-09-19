import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Loader2, X } from 'lucide-react';
import { fetchProducts, fetchCategories, fetchRegions } from '../../redux/catalogSlice';
import { fetchFoodDishes } from '../../redux/foodPairingSlice';
import { fetchWishlist } from '../../redux/wishlistSlice';
import SectionBanner from '../../components/public/shared/SectionBanner';
import ProductCard from '../../components/public/shared/ProductCard';
import { RadioFacet, CharacteristicSlider } from '../../components/public/shop/FacetControls';
import { CHARACTERISTIC_KEYS, buildCharacteristicsPatch } from '../../utils/characteristicFilters';

const Shop = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, categories, productsLoading: loading, productsMeta } = useSelector((state) => state.catalog);
  const { dishes } = useSelector((state) => state.foodPairing);

  const [filters, setFilters] = useState({
    page: searchParams.get('page') || 1,
    category_id: searchParams.get('category_id') || '',
    dish_id: searchParams.get('dish_id') || '',
    region_id: searchParams.get('region_id') || '',
    search: searchParams.get('search') || '',
    sort_by: searchParams.get('sort_by') || '',
    sort_order: searchParams.get('sort_order') || 'desc',
    min_price: searchParams.get('min_price') || 0,
    max_price: searchParams.get('max_price') || 500,
  });

  // Live slider positions — committed into `filters` (debounced) so dragging doesn't
  // fire a request per pixel.
  const [priceValue, setPriceValue] = useState(Number(filters.max_price) || 500);
  const [lightBold, setLightBold] = useState(50);
  const [smoothTannic, setSmoothTannic] = useState(50);

  const wineTypeOptions = categories.filter((c) => c.type === 'wine_type').map((c) => ({ value: c.id, label: c.name }));
  const grapeOptions = categories.filter((c) => c.type === 'grape').map((c) => ({ value: c.id, label: c.name }));
  const dishOptions = dishes.map((d) => ({ value: d.id, label: d.name }));

  useEffect(() => {
    // /categories paginates (15 per page by default) even without asking for it —
    // without a high per_page this silently drops most grapes and even some wine
    // types (Rosé Wine included) off the end of the facet list.
    dispatch(fetchCategories({ type: 'wine_type,grape', per_page: 200 }));
    dispatch(fetchRegions());
    dispatch(fetchFoodDishes({ per_page: 50 }));
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
    const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
    setSearchParams(activeFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, dispatch]);

  // Header/tile links navigate here with router `state`, carrying either a
  // `categorySlug` (a real category — Rosé, White Wine, ...) or a `search` term
  // (Champagne/Cognac/Prosecco aren't categories on this backend, just product
  // names, so `search` is what actually filters for them).
  //
  // `location.state` can't be read lazily, though: the effect below calls
  // `setSearchParams` on every filter change (including the very first render),
  // which pushes a fresh history entry with no `state` — wiping it out before
  // categories even finish loading. So it's captured into local state the instant
  // it arrives, then applied once categories are ready. `location.key` still
  // drives the capture so this re-fires on every click, even between two links
  // that both point at `/shop`.
  const [pendingIntent, setPendingIntent] = useState(location.state || null);
  useEffect(() => {
    if (location.state) setPendingIntent(location.state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  useEffect(() => {
    if (!pendingIntent) return;
    const { categorySlug, search: searchTerm } = pendingIntent;
    if (categorySlug) {
      if (categories.length === 0) return; // wait for categories, don't drop the intent
      const match = categories.find(
        (c) => c.slug === categorySlug || c.name?.toLowerCase() === categorySlug.toLowerCase()
      );
      if (match) {
        setFilters((prev) =>
          prev.category_id === match.id ? prev : { ...prev, page: 1, category_id: match.id, search: '' }
        );
      }
      setPendingIntent(null);
    } else if (searchTerm) {
      setFilters((prev) =>
        prev.search === searchTerm ? prev : { ...prev, page: 1, search: searchTerm, category_id: '' }
      );
      setPendingIntent(null);
    }
  }, [pendingIntent, categories]);

  // Debounce the price slider into a real min_price/max_price request.
  useEffect(() => {
    const handle = setTimeout(() => {
      setFilters((prev) => {
        if (Number(prev.max_price) === priceValue) return prev;
        return { ...prev, page: 1, max_price: priceValue };
      });
    }, 500);
    return () => clearTimeout(handle);
  }, [priceValue]);

  // Debounce the characteristic sliders into characteristics[<axis>][min|max] requests.
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

  const handleCategorySelect = (categoryId) => {
    setFilters((prev) => ({ ...prev, page: 1, category_id: categoryId }));
  };

  const handleDishSelect = (dishId) => {
    setFilters((prev) => ({ ...prev, page: 1, dish_id: dishId }));
  };

  const isFilterActive = Boolean(
    filters.category_id ||
      filters.dish_id ||
      filters.region_id ||
      filters.search ||
      Number(filters.min_price) !== 0 ||
      Number(filters.max_price) !== 500 ||
      CHARACTERISTIC_KEYS.some((k) => filters[k] !== undefined)
  );

  const handleClearFilters = () => {
    setPriceValue(500);
    setLightBold(50);
    setSmoothTannic(50);
    setFilters({
      page: 1,
      category_id: '',
      dish_id: '',
      region_id: '',
      search: '',
      sort_by: '',
      sort_order: 'desc',
      min_price: 0,
      max_price: 500,
    });
  };

  return (
    <div className="bg-cream min-h-screen">
      <SectionBanner title="Wines" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Wines' }]} />

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

            {wineTypeOptions.length > 0 && (
              <RadioFacet title="Wine Type" options={wineTypeOptions} selected={filters.category_id} onSelect={handleCategorySelect} />
            )}
            {grapeOptions.length > 0 && (
              <RadioFacet title="Grape Variety" options={grapeOptions} selected={filters.category_id} onSelect={handleCategorySelect} />
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

            {loading && products.length === 0 ? (
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
                <p className="font-serif text-2xl text-zinc-700 mb-2">No wines found</p>
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

export default Shop;
