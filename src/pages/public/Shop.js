import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories, fetchRegions } from '../../redux/catalogSlice';
import { fetchWishlist } from '../../redux/wishlistSlice';
import SectionBanner from '../../components/public/shared/SectionBanner';
import ProductCard from '../../components/public/shared/ProductCard';
import { WINE_TYPES, GRAPE_VARIETIES, FOOD_PAIRINGS } from '../../utils/placeholders';

const RadioFacet = ({ title, options, selected, onSelect }) => (
  <div className="mb-10">
    <h4 className="font-bold text-sm text-zinc-900 mb-4">{title}</h4>
    <div className="space-y-3">
      {options.map((opt) => (
        <label key={opt} className="flex items-center justify-between cursor-pointer group">
          <span className={`text-sm ${selected === opt ? 'text-forest font-medium' : 'text-zinc-600'} group-hover:text-forest transition-colors`}>
            {opt}
          </span>
          <input
            type="radio"
            name={title}
            checked={selected === opt}
            onChange={() => onSelect(selected === opt ? '' : opt)}
            className="accent-forest w-4 h-4"
          />
        </label>
      ))}
    </div>
  </div>
);

const CharacteristicSlider = ({ leftLabel, rightLabel, value, onChange }) => (
  <div className="mb-8">
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-forest mb-2"
    />
    <div className="flex justify-between text-[11px] text-zinc-500">
      <span>{leftLabel}</span>
      <span>{rightLabel}</span>
    </div>
  </div>
);

const Shop = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { products, loading } = useSelector((state) => state.catalog);

  const [filters, setFilters] = useState({
    page: searchParams.get('page') || 1,
    category_id: searchParams.get('category_id') || '',
    region_id: searchParams.get('region_id') || '',
    search: searchParams.get('search') || '',
    sort_by: searchParams.get('sort_by') || '',
    sort_order: searchParams.get('sort_order') || 'desc',
  });

  const [wineType, setWineType] = useState('');
  const [grapeVariety, setGrapeVariety] = useState('');
  const [foodPairing, setFoodPairing] = useState('');
  const [maxPrice, setMaxPrice] = useState(500);
  const [lightBold, setLightBold] = useState(50);
  const [smoothTannic, setSmoothTannic] = useState(50);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchRegions());
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts(filters));
    const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
    setSearchParams(activeFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, dispatch]);

  const visibleProducts = products.filter((p) => Number(p.price) <= maxPrice);

  const handleLoadMore = () => {
    setFilters((prev) => ({ ...prev, page: Number(prev.page) + 1 }));
  };

  const handleSortChange = (e) => {
    const [sort_by, sort_order] = e.target.value ? e.target.value.split('_') : ['', 'desc'];
    setFilters((prev) => ({ ...prev, page: 1, sort_by, sort_order }));
  };

  return (
    <div className="bg-cream min-h-screen">
      <SectionBanner title="Wines" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Wines' }]} />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row gap-14">
          <aside className="w-full md:w-64 shrink-0">
            <RadioFacet title="Wine Type" options={WINE_TYPES} selected={wineType} onSelect={setWineType} />
            <RadioFacet title="Grape Variety" options={GRAPE_VARIETIES} selected={grapeVariety} onSelect={setGrapeVariety} />
            <RadioFacet title="Food Pairings" options={FOOD_PAIRINGS} selected={foodPairing} onSelect={setFoodPairing} />

            <div className="mb-10">
              <h4 className="font-bold text-sm text-zinc-900 mb-4">Price</h4>
              <input
                type="range"
                min="10"
                max="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-forest mb-2"
              />
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span>GHS 10</span>
                <span>GHS {maxPrice}</span>
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
            ) : visibleProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <p className="font-serif text-2xl text-zinc-700 mb-2">No wines found</p>
                <p className="text-sm text-zinc-400">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className="max-h-[1400px] overflow-y-auto pr-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                  {visibleProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}

            {visibleProducts.length > 0 && (
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
