import React from 'react';
import Hero from '../../components/public/home/Hero';
import Philosophy from '../../components/public/home/Philosophy';
import CollectionGrid from '../../components/public/home/CollectionGrid';
import AppCTA from '../../components/public/home/AppCTA';

const Home = () => {
  return (
    <div className="bg-[#FDFBF7] animate-fade-in">
      <Hero />
      <Philosophy />
      
      {/* 
        Bestsellers Section 
        (Can be swapped later with a real Redux-connected ProductCarousel)
      */}
      <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-serif text-zinc-900 mb-2">Our Bestsellers</h2>
        <p className="text-zinc-500 font-light text-sm mb-12">The most beloved bottles from our cellar.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="group cursor-pointer">
              <div className="bg-[#F4F1E9] aspect-[3/4] mb-4 flex items-center justify-center p-6 relative overflow-hidden">
                <img 
                  src={`/images/bottle-placeholder-${item}.png`} 
                  alt="Wine Bottle" 
                  className="h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h4 className="font-serif text-lg text-zinc-900">Estate Reserve {item}</h4>
              <p className="text-zinc-500 text-sm">$45.00</p>
            </div>
          ))}
        </div>
      </section>

      <CollectionGrid />
      <AppCTA />
    </div>
  );
};

export default Home;