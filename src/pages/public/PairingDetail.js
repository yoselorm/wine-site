import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft } from 'lucide-react';
import { fetchDishPairings, clearSelectedDish } from '../../redux/foodPairingSlice';
import ProductCard from '../../components/public/shared/ProductCard';

const TYPE_FILTERS = [
  { label: 'All', value: '' },
  { label: 'Local', value: 'local' },
  { label: 'International', value: 'international' },
];

const PairingDetail = () => {
  const { dishId } = useParams();
  const dispatch = useDispatch();
  const { selectedDish: dish, pairings, pairingsMeta, pairingsLoading, pairingsError } = useSelector(
    (state) => state.foodPairing
  );
  const [pairingType, setPairingType] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    dispatch(fetchDishPairings({ dishId, params: { page: 1, ...(pairingType ? { pairing_type: pairingType } : {}) } }));
    return () => dispatch(clearSelectedDish());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dishId, pairingType, dispatch]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    dispatch(fetchDishPairings({ dishId, params: { page: nextPage, ...(pairingType ? { pairing_type: pairingType } : {}) } }));
  };

  const canLoadMore = pairingsMeta && pairingsMeta.current_page < pairingsMeta.last_page;

  if (pairingsLoading && !dish) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24 animate-pulse space-y-8">
        <div className="h-64 bg-zinc-100" />
        <div className="h-6 w-48 bg-zinc-100" />
      </div>
    );
  }

  if (pairingsError || !dish) {
    return (
      <div className="text-center py-32">
        <p className="text-wine font-serif text-xl mb-6">{pairingsError || 'Dish not found'}</p>
        <Link to="/pairings" className="text-xs font-bold uppercase tracking-widest border-b border-forest pb-1 hover:text-forest transition-colors">
          Back to Pairings
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <div className="relative h-[40vh] min-h-[300px] overflow-hidden flex items-end">
        {dish.image_url && <img src={dish.image_url} alt={dish.name} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-forest-dark/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-10 w-full">
          <Link
            to="/pairings"
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:text-white transition-colors mb-4"
          >
            <ChevronLeft size={14} /> Back to Pairings
          </Link>
          <p className="text-gold-light text-[11px] font-bold uppercase tracking-widest mb-2">{dish.origin}</p>
          <h1 className="font-serif text-3xl md:text-4xl text-white">{dish.name}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        {dish.description && <p className="text-zinc-600 font-light leading-relaxed max-w-2xl mb-10">{dish.description}</p>}

        <div className="flex items-center gap-2 mb-10">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setPairingType(f.value)}
              className={`px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest border transition-colors ${
                pairingType === f.value ? 'bg-forest text-white border-forest' : 'border-zinc-300 text-zinc-600 hover:border-forest hover:text-forest'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {pairings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="font-serif text-xl text-zinc-700 mb-2">No wines paired yet</p>
            <p className="text-sm text-zinc-400">Check back soon, or try a different filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {pairings.map((pairing, i) => (
              <div key={pairing.wine?.id || i}>
                <ProductCard product={pairing.wine} />
                <div className="mt-4 pt-4 border-t border-zinc-200">
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 mb-2 ${
                      pairing.pairing_type === 'local' ? 'bg-gold/10 text-gold' : 'bg-forest/10 text-forest'
                    }`}
                  >
                    {pairing.pairing_type}
                  </span>
                  <p className="text-xs text-zinc-500 font-light italic leading-relaxed">{pairing.reason}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {canLoadMore && (
          <div className="flex justify-center mt-16">
            <button
              onClick={handleLoadMore}
              disabled={pairingsLoading}
              className="border border-forest text-forest px-10 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-forest hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {pairingsLoading ? 'Loading...' : 'View More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PairingDetail;
