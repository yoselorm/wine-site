import React from 'react';
import heroImg from '../../../assets/images/hero.webp';

const Hero = () => {
  return (
    <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
      {/* Background Image/Video - Using imagery similar to the inspiration */}
      <img 
        src={heroImg} 
        alt="Vineyard landscape"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Dark Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-zinc-950/30" />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <span className="text-white/80 uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">
          Exclusively From Our Winery
        </span>
        <h1 className="text-5xl md:text-7xl font-serif text-white mb-8 leading-tight">
          Crafted by Nature, <br /> Perfected by Tradition
        </h1>
        <button className="px-8 py-3 bg-white text-zinc-900 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-zinc-100 transition-all">
          Explore the Collection
        </button>
      </div>
    </section>
  );
};

export default Hero;