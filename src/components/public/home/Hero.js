import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import heroImg from '../../../assets/images/home/hero-right.png';
import thumb1 from '../../../assets/images/bestseller02.jpg';
import thumb2 from '../../../assets/images/bestseller03.jpg';
import thumb3 from '../../../assets/images/bestseller04.jpg';

const newArrivals = [
  {
    sub: 'Moët & Chandon | Paris',
    name: 'Moet Impérial',
    image: thumb1,
    to: '/shop',
  },
  {
    sub: 'Moët & Chandon | Paris',
    name: 'Podere Castorani',
    image: thumb2,
    to: '/shop',
  },
  {
    sub: 'Moët & Chandon | Paris',
    name: 'Jarno Jozzo',
    image: thumb3,
    to: '/shop',
  },
];

const Hero = () => {
  return (
    <section className="relative bg-[#FFF9F3] overflow-hidden pt-8 pb-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center relative z-10">
        
        {/* Left Column */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[62px] text-[#1E3B2B] leading-[1.05] tracking-tight mb-5">
            Shop <br />
            Winery-Direct <br />
            Exclusives
          </h1>

          <p className="text-stone-600 text-xs sm:text-[13px] font-normal leading-relaxed max-w-md mb-8">
            Shop the latest releases of wine along with exclusive offers, rare and limited edition wines, 
            as well as the latest merchandise from our tasting rooms.
          </p>

          {/* New Arrivals Container with Overlapping Bottles */}
          <div className="max-w-lg w-full">
            {/* Header: Title & Navigation Arrows */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold tracking-widest text-[#2C2C2C] uppercase font-sans">
                NEW ARRIVALS
              </span>
              <div className="flex items-center gap-2 text-stone-500">
                <button
                  type="button"
                  aria-label="Previous"
                  className="hover:text-black transition-colors p-1"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  aria-label="Next"
                  className="hover:text-black transition-colors p-1"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Dark Green Box with Bottles Popping Out */}
            <div className="relative pt-20">
              {/* Background Dark Container */}
              <div className="absolute bottom-0 left-0 right-0 h-[105px] bg-[#1B3828] rounded-sm">
                {/* Thin Gold Band on top */}
                <div className="absolute top-0 left-0 right-0 h-[5px] bg-[#C59B4B]" />
              </div>

              {/* 3 Columns for Overlapping Bottles & Meta */}
              <div className="relative z-10 grid grid-cols-3 gap-3 px-3">
                {newArrivals.map((wine, index) => (
                  <div key={index} className="flex flex-col items-center text-center group">
                    {/* Bottle + Circular Add Button Container */}
                    <div className="relative h-44 flex items-end justify-center mb-2 w-full">
                      <img
                        src={wine.image}
                        alt={wine.name}
                        className="max-h-full w-auto object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                      />
                      {/* Crimson Plus Badge */}
                      <Link
                        to={wine.to}
                        aria-label={`View ${wine.name}`}
                        className="absolute bottom-2 left-2 sm:left-4 w-6 h-6 bg-[#931D38] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#78162D] transition-colors"
                      >
                        <Plus size={13} strokeWidth={2.5} />
                      </Link>
                    </div>

                    {/* Wine Name & Details */}
                    <div className="w-full text-center pb-2">
                      <p className="text-[9px] text-[#C9D6CE] font-light truncate mb-0.5">
                        {wine.sub}
                      </p>
                      <h4 className="text-[11px] font-medium text-white tracking-wide truncate">
                        {wine.name}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Stage Graphic */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          <img
            src={heroImg}
            alt="Exclusive wrapped bottle and fresh vineyard grapes"
            className="w-full max-w-[540px] lg:max-w-[620px] h-auto object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;