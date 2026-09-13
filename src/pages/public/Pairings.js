import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Search } from 'lucide-react';
import { fetchFoodDishes } from '../../redux/foodPairingSlice';
import SectionBanner from '../../components/public/shared/SectionBanner';
import Pagination from '../../components/public/shared/Pagination';

const PER_PAGE = 12;

const FILTERS = [
  { label: 'All', value: '' },
  { label: 'Local', value: '1' },
  { label: 'International', value: '0' },
];

const Pairings = () => {
  const dispatch = useDispatch();
  const { dishes, dishesMeta, dishesLoading, dishesError } = useSelector((state) => state.foodPairing);
  const [isLocal, setIsLocal] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchFoodDishes({
        page,
        per_page: PER_PAGE,
        ...(isLocal !== '' ? { is_local: isLocal } : {}),
        ...(search ? { search } : {}),
      })
    );
  }, [isLocal, search, page, dispatch]);

  const handleFilterChange = (value) => {
    setIsLocal(value);
    setPage(1);
  };

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-cream min-h-screen">
      <SectionBanner title="Food & Wine Pairings" breadcrumbs={[{ label: 'Home', to: '/' }, { label: 'Pairings' }]} />

      <div className="max-w-7xl mx-auto px-6 py-14">
        <p className="text-zinc-500 font-light leading-relaxed max-w-2xl mb-10">
          Find the right bottle for what's on the table — from Ghanaian classics to dishes from around the world.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
          <div className="flex items-center gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.label}
                onClick={() => handleFilterChange(f.value)}
                className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest border transition-colors ${
                  isLocal === f.value ? 'bg-forest text-white border-forest' : 'border-zinc-300 text-zinc-600 hover:border-forest hover:text-forest'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search dishes..."
              className="w-full border border-zinc-300 pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-forest transition-colors"
            />
          </div>
        </div>

        {dishesMeta && dishesMeta.total > 0 && (
          <p className="text-xs text-zinc-400 uppercase tracking-widest mb-8">
            Showing {dishesMeta.from}–{dishesMeta.to} of {dishesMeta.total} dishes
          </p>
        )}

        {dishesLoading && dishes.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[4/3] bg-zinc-100 mb-4" />
                <div className="h-4 w-2/3 bg-zinc-100 mb-2" />
                <div className="h-3 w-1/4 bg-zinc-100" />
              </div>
            ))}
          </div>
        ) : dishesError ? (
          <div className="text-center py-24 text-wine">{dishesError}</div>
        ) : dishes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="font-serif text-2xl text-zinc-700 mb-2">No dishes found</p>
            <p className="text-sm text-zinc-400">Try a different search or filter.</p>
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity duration-300 ${
              dishesLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'
            }`}
          >
            {dishes.map((dish) => (
              <Link key={dish.id} to={`/pairings/${dish.id}`} className="group block">
                <div className="aspect-[4/3] bg-white overflow-hidden mb-4 relative">
                  {dish.image_url ? (
                    <img
                      src={dish.image_url}
                      alt={dish.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 font-serif text-2xl">
                      {dish.name?.[0]}
                    </div>
                  )}
                  <span
                    className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest px-3 py-1 ${
                      dish.is_local ? 'bg-gold text-forest-dark' : 'bg-forest text-white'
                    }`}
                  >
                    {dish.is_local ? 'Local' : 'International'}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-zinc-900 mb-1 group-hover:text-forest transition-colors">{dish.name}</h3>
                <p className="text-xs text-zinc-400 uppercase tracking-widest mb-1">{dish.origin}</p>
                <p className="text-sm text-zinc-500 font-light">
                  {dish.pairings_count ?? 0} {dish.pairings_count === 1 ? 'wine' : 'wines'}
                </p>
              </Link>
            ))}
          </div>
        )}

        <Pagination
          currentPage={dishesMeta?.current_page || page}
          lastPage={dishesMeta?.last_page}
          onPageChange={handlePageChange}
          className="mt-16"
        />
      </div>
    </div>
  );
};

export default Pairings;
