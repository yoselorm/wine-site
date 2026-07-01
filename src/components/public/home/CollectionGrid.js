import React from 'react';
import { Link } from 'react-router-dom';
import gridrose from '../../../assets/images/img-grid01.jpeg';
import gridred from '../../../assets/images/grid-redwine.jpeg';
import gridwhite from '../../../assets/images/grid-whitewine.jpeg';
import gridprosecco from '../../../assets/images/grid-proseco.jpeg';
import gridchampagne from '../../../assets/images/grid-champagne.jpg';

const categories = [
  { name: 'Champagne', image: gridchampagne, span: 'md:col-span-8 md:row-span-2' },
  { name: 'Rosé', image: gridrose, span: 'md:col-span-4 md:row-span-1' },
  { name: 'Prosecco', image: gridprosecco, span: 'md:col-span-4 md:row-span-1' },
  { name: 'Red Wine', image: gridred, span: 'md:col-span-6 md:row-span-1' },
  { name: 'White Wine', image: gridwhite, span: 'md:col-span-6 md:row-span-1' },
];

const CollectionGrid = () => {
  return (
    <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-4xl font-serif text-zinc-900">Explore by Category</h2>
        <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors hidden sm:block">
          View All &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 auto-rows-[300px] gap-4">
        {categories.map((cat, idx) => (
          <Link 
            key={idx} 
            to={`/shop?category=${cat.name.toLowerCase()}`}
            className={`group relative overflow-hidden block ${cat.span}`}
          >
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 transition-opacity duration-500 group-hover:bg-black/50" />
            
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <h3 className="text-3xl font-serif text-white mb-4">{cat.name}</h3>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/50 px-6 py-2 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                Discover
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CollectionGrid;