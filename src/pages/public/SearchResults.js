import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../../redux/catalogSlice';
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

const SearchResults = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { products, loading } = useSelector((state) => state.catalog);
  const [wineType, setWineType] = useState('');
  const [grapeVariety, setGrapeVariety] = useState('');
  const [foodPairing, setFoodPairing] = useState('');
  const [maxPrice, setMaxPrice] = useState(500);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({ search: query }));
  }, [query, dispatch]);

  const visibleProducts = products.filter((p) => Number(p.price) <= maxPrice);

  return (
    <div className="bg-cream min-h-screen">
      <SectionBanner title={`showing results for "${query || 'all wines'}"`} />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row gap-14">
          <aside className="w-full md:w-64 shrink-0">
            <RadioFacet title="Wine Type" options={WINE_TYPES} selected={wineType} onSelect={setWineType} />
            <RadioFacet title="Grape Variety" options={GRAPE_VARIETIES} selected={grapeVariety} onSelect={setGrapeVariety} />
            <RadioFacet title="Food Pairings" options={FOOD_PAIRINGS} selected={foodPairing} onSelect={setFoodPairing} />

            <div>
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
          </aside>

          <main className="flex-1">
            {loading ? (
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
                <p className="font-serif text-2xl text-zinc-700 mb-2">No results found</p>
                <p className="text-sm text-zinc-400">Try a different search term or adjust your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                {visibleProducts.map((p) => (
                  <ProductCard key={p.id} product={p} iconVariant="plus" />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
