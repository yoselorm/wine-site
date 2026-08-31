import React from 'react';
import InfoStrip from '../shared/InfoStrip';
import grapesImg from '../../../assets/images/home/who-we-are-grapes.png';
import bottleImg from '../../../assets/images/home/home-hero02.png';
import { Apple, PlayCircle } from 'lucide-react';

const AppCTA = () => {
  return (
    <section className="relative bg-forest overflow-hidden">
      <InfoStrip />

      <div className="relative max-w-6xl mx-auto px-6 pb-20 pt-4">
        <div className="relative bg-forest-dark/60 rounded-sm px-8 md:px-16 py-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden">
          <img
            src={grapesImg}
            alt=""
            aria-hidden="true"
            className="hidden md:block absolute -bottom-8 -left-10 w-24 opacity-90"
          />
          <img
            src={bottleImg}
            alt="Wine bottle"
            className="hidden md:block absolute -bottom-4 right-6 h-56 w-auto object-contain drop-shadow-2xl"
          />

          <div className="relative z-10 text-center md:text-left max-w-lg">
            <p className="text-gold-light text-sm font-light mb-3">All Exclusive wine at your finger tips</p>
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">Download our Mobile App</h2>
            <p className="text-cream/70 font-light text-sm mb-8 leading-relaxed">
              It's the fastest way to search for the best wine and make a purchase
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 bg-gold text-forest-dark px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:bg-gold-light transition-colors">
                <Apple size={16} /> Download from Apple Store
              </button>
              <button className="flex items-center justify-center gap-2 border border-cream/40 text-cream px-6 py-3 text-[11px] font-bold uppercase tracking-widest hover:border-cream transition-colors">
                <PlayCircle size={16} /> Download from Playstore
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppCTA;
