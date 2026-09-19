import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProducts, fetchRegions, parseProductsResponse } from '../../redux/catalogSlice';
import { fetchFoodDishes } from '../../redux/foodPairingSlice';
import { getProductImage } from '../../utils/productImage';
import Hero from '../../components/public/home/Hero';
import CollectionShowcase from '../../components/public/home/CollectionShowcase';
import TeaserCard from '../../components/public/shared/TeaserCard';
import Reveal from '../../components/public/shared/Reveal';
import TopoBand from '../../components/public/shared/TopoBand';
import exclusiveRangeBg from '../../assets/images/exclusiverangebg.jpg';
import jarnoBanner from '../../assets/images/cellar.jpg';
import jarnoBottle from '../../assets/images/home/home-hero02.png';

// Both endpoints paginate to a small default page size, so a plain list-lookup
// can silently miss the row we're after — ask for a page big enough to hold it.
const findByName = (list, name) => list.find((r) => r.name?.toLowerCase() === name.toLowerCase());

// Shapes a real product into the flat props TeaserCard/carousel items expect.
const toTeaser = (p) => ({
  id: p.id,
  image: getProductImage(p),
  name: p.name,
  subtitle: p.brand?.name || p.categories?.find((c) => c.type === 'wine_type')?.name || p.categories?.[0]?.name || '',
  price: `GHS ${Number(p.sale_price || p.price || 0).toFixed(2)}`,
  to: `/shop/${p.slug}`,
});

const ProductRow = ({ eyebrow, title, items }) => (
  <section className="py-20 px-6 max-w-7xl mx-auto">
    <div className="flex items-end justify-between mb-12">
      <div>
        {eyebrow && <p className="text-[11px] font-bold uppercase tracking-widest text-gold mb-2">{eyebrow}</p>}
        <h2 className="font-serif text-3xl text-zinc-900">{title}</h2>
      </div>
      <Link to="/shop" className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-forest hover:text-gold transition-colors">
        View More
      </Link>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {items.map((item) => (
        <TeaserCard key={item.id} {...item} />
      ))}
    </div>
  </section>
);

// A horizontally-scrolling row of real products, with working left/right arrows.
const ProductCarousel = ({ title, items }) => {
  const scrollRef = useRef(null);

  const scrollBy = (direction) => {
    scrollRef.current?.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  if (items.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-12">
        <h2 className="font-serif text-3xl text-zinc-900">{title}</h2>
        <div className="flex items-center gap-2 text-stone-500">
          <button type="button" aria-label="Scroll left" onClick={() => scrollBy(-1)} className="hover:text-forest transition-colors p-1">
            <ChevronLeft size={18} />
          </button>
          <button type="button" aria-label="Scroll right" onClick={() => scrollBy(1)} className="hover:text-forest transition-colors p-1">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto scroll-smooth px-6 pb-2 max-w-7xl mx-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div key={item.id} className="w-48 sm:w-56 shrink-0">
            <TeaserCard {...item} />
          </div>
        ))}
      </div>
    </section>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const [bestsellers, setBestsellers] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [champagnes, setChampagnes] = useState([]);
  const [italyFinest, setItalyFinest] = useState([]);
  const [withSalads, setWithSalads] = useState([]);

  useEffect(() => {
    // min_price=0 — every product in this catalog currently has price 0, so the
    // shop's default min_price=10 would exclude everything here too.
    dispatch(fetchProducts({ page: 1, per_page: 4, min_price: 0 }))
      .unwrap()
      .then((res) => setBestsellers(parseProductsResponse(res).products.map(toTeaser)))
      .catch(() => {});

    dispatch(fetchProducts({ page: 2, per_page: 4, min_price: 0 }))
      .unwrap()
      .then((res) => setTopRated(parseProductsResponse(res).products.map(toTeaser)))
      .catch(() => {});

    // No "Champagne" category exists on this backend — champagne is just a
    // product name here, so `search` is the filter that actually works.
    dispatch(fetchProducts({ search: 'champagne', per_page: 10, min_price: 0 }))
      .unwrap()
      .then((res) => setChampagnes(parseProductsResponse(res).products.map(toTeaser)))
      .catch(() => {});

    // "Italy's Finest" -> region_id for the Italy country row. Regions paginate
    // too, so ask for enough of a page to actually contain it.
    dispatch(fetchRegions({ per_page: 200 }))
      .unwrap()
      .then((res) => {
        const regions = res?.data?.data || res?.data || [];
        const italy = findByName(regions, 'Italy');
        if (!italy) return null;
        return dispatch(fetchProducts({ region_id: italy.id, per_page: 4, min_price: 0 })).unwrap();
      })
      .then((res) => res && setItalyFinest(parseProductsResponse(res).products.map(toTeaser)))
      .catch(() => {});

    // "Great With Salads" -> dish_id for the Salad food pairing.
    dispatch(fetchFoodDishes({ per_page: 100 }))
      .unwrap()
      .then((res) => {
        const dishes = res?.data?.data || res?.data || [];
        const salad = findByName(dishes, 'Salad');
        if (!salad) return null;
        return dispatch(fetchProducts({ dish_id: salad.id, per_page: 4, min_price: 0 })).unwrap();
      })
      .then((res) => res && setWithSalads(parseProductsResponse(res).products.map(toTeaser)))
      .catch(() => {});
  }, [dispatch]);

  return (
    <div className="bg-cream animate-fade-in">
      <Hero />

      {bestsellers.length > 0 && (
        <Reveal>
          <ProductRow title="Our Bestsellers" items={bestsellers} />
        </Reveal>
      )}

      <section className="relative h-[50vh] min-h-[380px] w-full overflow-hidden flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${exclusiveRangeBg})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-forest-dark/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-md">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">Exclusive range of winery</h2>
            <p className="text-cream/80 font-light leading-relaxed mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-gold text-forest-dark px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gold-light transition-colors duration-300"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <Reveal>
        <ProductCarousel title="Top Rated Products" items={topRated} />
      </Reveal>

      <Reveal>
        <TopoBand className="h-32 md:h-40" />
      </Reveal>

      <Reveal>
        <ProductCarousel title="Champagne" items={champagnes} />
      </Reveal>

      {italyFinest.length > 0 && (
        <Reveal>
          <ProductRow eyebrow="Regions" title="Italy's Finest" items={italyFinest} />
        </Reveal>
      )}

      <Reveal>
        <section className="relative py-24 px-6 overflow-hidden">
          <img src={jarnoBanner} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover grayscale" />
          <div className="absolute inset-0 bg-forest/90" />
          <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
            <div className="flex justify-center order-2 md:order-1">
              <img src={jarnoBottle} alt="Jarno Jazzor Wine" className="h-80 w-auto object-contain drop-shadow-2xl" />
            </div>
            <div className="text-center md:text-left order-1 md:order-2">
              <p className="text-gold-light text-[11px] font-bold uppercase tracking-widest mb-4">Featured by W2U</p>
              <h2 className="font-serif text-4xl md:text-5xl text-white mb-6">Jarno Jazzor Wine</h2>
              <p className="text-cream/70 font-light leading-relaxed max-w-md mx-auto md:mx-0 mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tempus, tellus at semper cursus, ante velit convallis massa.
              </p>
              <p className="text-gold-light font-serif text-2xl mb-8">GHS 118.00</p>
              <Link
                to="/shop"
                className="inline-block border border-gold text-gold px-8 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gold hover:text-forest-dark transition-colors duration-300"
              >
                Discover More
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      {withSalads.length > 0 && (
        <Reveal>
          <ProductRow title="Great With Salads" items={withSalads} />
        </Reveal>
      )}

      <Reveal>
        <CollectionShowcase />
      </Reveal>
    </div>
  );
};

export default Home;
