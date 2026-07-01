import React from 'react';
import cellarImg from '../../../assets/images/cellar.jpg';

const AppCTA = () => {
  return (
    <section className="py-24 px-6 md:px-12 bg-white border-t border-zinc-100 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Side: Editorial Imagery */}
        <div className="w-full md:w-1/2 relative">
          {/* Main Image */}
          <div className="aspect-[4/5] bg-[#F4F1E9] relative z-10 overflow-hidden">
            <img 
              src={cellarImg} 
              alt="Pouring wine" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          
          {/* Decorative Offset Background (Aperitif-inspired) */}
          <div className="absolute -bottom-6 -left-6 w-full h-full bg-[#FDFBF7] border border-zinc-200 -z-10 hidden md:block" />
        </div>

        {/* Right Side: Typography & Minimalist Call to Action */}
        <div className="w-full md:w-1/2 flex flex-col items-center text-center md:items-start md:text-left">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6 block">
            The Connoisseur's App
          </span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-zinc-900 mb-8 leading-[1.1]">
            Your Private <br className="hidden md:block" /> Cellar.
          </h2>
          
          <p className="text-zinc-500 font-light text-lg mb-12 leading-relaxed max-w-md">
            Unlock exclusive vintages, receive personalized tasting notes, and manage your collection directly from our vineyard to your fingertips.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <button className="group relative pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-900 transition-colors hover:text-zinc-500">
              Download for iOS
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-900 transition-all duration-300 group-hover:bg-zinc-300" />
            </button>
            
            <span className="w-1 h-1 rounded-full bg-zinc-300 hidden sm:block" />
            
            <button className="group relative pb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-900 transition-colors hover:text-zinc-500">
              Download for Android
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-900 transition-all duration-300 group-hover:bg-zinc-300" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AppCTA;