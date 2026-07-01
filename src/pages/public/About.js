import React from 'react';
import { Link } from 'react-router-dom';
import { Wine, Globe2, Award, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-[#FDFBF7] min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=2000" 
            alt="Vineyard landscape" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-zinc-900/40"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/80 mb-6">Our Heritage</h4>
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight">
            Curating the world's most <br className="hidden md:block" /> extraordinary vintages.
          </h1>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-8">The WINE2U Story</h2>
        <h3 className="text-3xl md:text-4xl font-serif text-zinc-900 mb-10 leading-snug">
          We believe that every bottle holds a story of its soil, its climate, and the hands that crafted it.
        </h3>
        <div className="space-y-6 text-zinc-600 font-light leading-relaxed max-w-2xl mx-auto">
          <p>
            Founded in 2020, WINE2U began with a simple mission: to bridge the gap between exclusive, heritage-rich vineyards and the modern connoisseur. We spent years traveling across Bordeaux, Tuscany, Napa, and emerging regions to build relationships directly with independent winemakers.
          </p>
          <p>
            Today, our cellar represents a meticulously curated collection of wines that you won't find on standard supermarket shelves. From bold, gripping reds to crisp, bone-dry whites, every bottle is tasted, vetted, and verified by our in-house sommeliers before it ever reaches your glass.
          </p>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="bg-white py-24 px-6 border-y border-zinc-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Our Philosophy</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center mb-6 text-zinc-900">
                <Wine size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-zinc-900 mb-4">Uncompromising Curation</h3>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">
                Quantity is never our goal. We taste hundreds of wines every month, selecting only the exceptional few that meet our rigorous standards for character and complexity.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center mb-6 text-zinc-900">
                <Globe2 size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-zinc-900 mb-4">Direct from the Vineyard</h3>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">
                By bypassing traditional importers and distributors, we ensure perfect provenance and deliver extraordinary value by shipping straight from the estate to your door.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#FDFBF7] rounded-full flex items-center justify-center mb-6 text-zinc-900">
                <Award size={24} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-zinc-900 mb-4">Sommelier Support</h3>
              <p className="text-sm text-zinc-500 font-light leading-relaxed">
                Whether you are building a legacy cellar or looking for the perfect pairing for a Tuesday night dinner, our expert team is always available to guide your palate.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-6 text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-serif text-zinc-900 mb-6">Ready to explore the collection?</h2>
        <p className="text-zinc-500 font-light mb-10">
          Discover our latest arrivals and rare allocations.
        </p>
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-3 bg-zinc-900 text-white px-8 py-4 text-[11px] font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors"
        >
          Enter the Shop <ArrowRight size={16} />
        </Link>
      </section>

    </div>
  );
};

export default About;