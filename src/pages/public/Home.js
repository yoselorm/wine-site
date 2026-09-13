import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Hero from '../../components/public/home/Hero';
import CollectionShowcase from '../../components/public/home/CollectionShowcase';
import TeaserCard from '../../components/public/shared/TeaserCard';
import Reveal from '../../components/public/shared/Reveal';
import TopoBand from '../../components/public/shared/TopoBand';
import besteller01 from '../../assets/images/bestseller01.jpg';
import besteller02 from '../../assets/images/bestseller02.jpg';
import besteller03 from '../../assets/images/bestseller03.jpg';
import besteller04 from '../../assets/images/bestseller04.jpg';
import exclusiveRangeBg from '../../assets/images/exclusiverangebg.jpg';
import jarnoBanner from '../../assets/images/cellar.jpg';
import jarnoBottle from '../../assets/images/home/home-hero02.png';

const bestsellers = [
  { id: 1, name: 'Bold & Chardon', price: 'GHS 88.00', image: besteller01 },
  { id: 2, name: 'Molti & Chardon', price: 'GHS 90.00', image: besteller02 },
  { id: 3, name: 'Andrit Chardon', price: 'GHS 84.00', image: besteller03 },
  { id: 4, name: 'Molti & Chardon', price: 'GHS 90.00', image: besteller04 },
];

const italyFinest = [
  { id: 5, name: 'Roseé Imperial', price: 'GHS 60.00', image: besteller03 },
  { id: 6, name: 'Bold Imperial', price: 'GHS 60.00', image: besteller04 },
  { id: 7, name: 'Bold Imperial', price: 'GHS 60.00', image: besteller01 },
  { id: 8, name: 'Bold Imperial', price: 'GHS 80.00', image: besteller02 },
];

const withSalads = [
  { id: 9, name: 'Bold Imperial', price: 'GHS 99.00', image: besteller02 },
  { id: 10, name: 'Bold Imperial', price: 'GHS 99.00', image: besteller01 },
  { id: 11, name: 'Bold Imperial', price: 'GHS 99.00', image: besteller04 },
  { id: 12, name: 'Bold Imperial', price: 'GHS 99.00', image: besteller03 },
];

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
        <TeaserCard key={item.id} image={item.image} name={item.name} price={item.price} />
      ))}
    </div>
  </section>
);

const CarouselHeader = ({ title }) => (
  <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-12">
    <h2 className="font-serif text-3xl text-zinc-900">{title}</h2>
    <div className="flex items-center gap-2 text-stone-500">
      <button type="button" aria-label="Previous" className="hover:text-forest transition-colors p-1">
        <ChevronLeft size={18} />
      </button>
      <button type="button" aria-label="Next" className="hover:text-forest transition-colors p-1">
        <ChevronRight size={18} />
      </button>
    </div>
  </div>
);

const Home = () => {
  return (
    <div className="bg-cream animate-fade-in">
      <Hero />

      <Reveal>
        <ProductRow title="Our Bestsellers" items={bestsellers} />
      </Reveal>

      <section className="relative h-[85vh] min-h-[620px] w-full overflow-hidden flex items-center">
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
        <CarouselHeader title="Top Rated Products" />
      </Reveal>

      <Reveal>
        <TopoBand className="h-32 md:h-40" />
      </Reveal>

      <Reveal>
        <CarouselHeader title="Champagne" />
      </Reveal>

      <Reveal>
        <ProductRow eyebrow="Regions" title="Italy's Finest" items={italyFinest} />
      </Reveal>

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

      <Reveal>
        <ProductRow title="Great With Salads" items={withSalads} />
      </Reveal>

      <Reveal>
        <CollectionShowcase />
      </Reveal>
    </div>
  );
};

export default Home;
