import React from 'react';
import Hero from '../../components/public/home/Hero';
import Philosophy from '../../components/public/home/Philosophy';
import CollectionGrid from '../../components/public/home/CollectionGrid';
import AppCTA from '../../components/public/home/AppCTA';
import besteller01 from '../../assets/images/bestseller01.jpg';
import besteller02 from '../../assets/images/bestseller02.jpg';
import besteller03 from '../../assets/images/bestseller03.jpg';
import besteller04 from '../../assets/images/bestseller04.jpg';

const Home = () => {

  const bestsellers = [
    { id: 1, name: 'Estate Reserve 1', price: 'GHS45.00', image: besteller01 },
    { id: 2, name: 'Estate Reserve 2', price: 'GHS45.00', image: besteller02 },
    { id: 3, name: 'Estate Reserve 3', price: 'GHS45.00', image: besteller03 },
    { id: 4, name: 'Estate Reserve 4', price: 'GHS45.00', image: besteller04 },
  ];
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
          {bestsellers.map((bottle) => (
            <div key={bottle.id} className="group cursor-pointer">
              <div className="bg-[#F4F1E9] aspect-[3/4] mb-4 flex items-center justify-center p-6 relative overflow-hidden">
                <img 
                  src={bottle.image} 
                  alt={bottle.name} 
                  className="h-full w-auto object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h4 className="font-serif text-lg text-zinc-900">{bottle.name}</h4>
              <p className="text-zinc-500 text-sm">{bottle.price}</p>
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