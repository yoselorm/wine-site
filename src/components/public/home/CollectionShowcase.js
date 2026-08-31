import React from 'react';
import { Link } from 'react-router-dom';
import { Wine } from 'lucide-react';
import wineryImg from '../../../assets/images/about/what-makes-us-diff.png';
import roseImg from '../../../assets/images/img-grid01.jpeg';
import champagneImg from '../../../assets/images/grid-champagne.jpeg';
import proseccoImg from '../../../assets/images/grid-proseco.jpeg';
import redWineImg from '../../../assets/images/grid-redwine.jpeg';
import whiteWineImg from '../../../assets/images/grid-whitewine.jpeg';

const StyleTile = ({ image, title, description, to = '/shop', className = '' }) => (
  <Link
    to={to}
    className={`group relative flex items-end justify-center overflow-hidden ${className}`}
  >
    <img
      src={image}
      alt={title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/90 via-forest-dark/25 to-transparent" />
    <div className="relative z-10 flex flex-col items-center text-center py-10 px-6">
      <h3 className="font-serif text-2xl md:text-3xl text-gold-light mb-2">{title}</h3>
      <p className="text-cream/70 text-xs font-light leading-relaxed max-w-[220px] mb-4">{description}</p>
      <span className="inline-block border border-gold text-gold text-[11px] font-bold uppercase tracking-widest px-5 py-2 group-hover:bg-gold group-hover:text-forest-dark transition-colors">
        Shop
      </span>
    </div>
  </Link>
);

const CollectionShowcase = () => {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <p className="text-[11px] font-bold uppercase tracking-widest text-gold mb-2">Explore</p>
        <h2 className="font-serif text-3xl text-zinc-900">Shop By Style</h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2 bg-forest-dark px-10 py-14 flex flex-col justify-center items-center text-center">
            <Wine size={30} strokeWidth={1.25} className="text-gold mb-6" />
            <p className="text-[11px] font-bold uppercase tracking-widest text-gold mb-4">Who We Are</p>
            <p className="text-cream text-sm italic font-light leading-relaxed max-w-sm mb-4">
              The connection we build with our customers and suppliers is at the heart of everything we do.
            </p>
            <p className="text-cream/60 text-sm font-light leading-relaxed max-w-sm mb-8">
              At w2u, we set out to inspire a passion for fine wine, offering a curated portfolio our
              suppliers and customers can rely on. Our specialists bring the finest wines in the
              world straight to your door, and every order a truly "Winetastic" experience.
            </p>
            <Link
              to="/about"
              className="inline-block border border-gold text-gold text-[11px] font-bold uppercase tracking-widest px-6 py-3 hover:bg-gold hover:text-forest-dark transition-colors"
            >
              Learn More
            </Link>
          </div>
          <div className="md:w-1/2 h-72 md:h-auto overflow-hidden">
            <img src={wineryImg} alt="The w2u winery estate" className="w-full h-full object-cover" />
          </div>
        </div>

        <StyleTile
          image={roseImg}
          title="Rosé"
          description="Delicate, dry and endlessly food-friendly — our pick of rosé for warm-weather sipping."
          className="h-80 md:h-96"
        />

        <div className="flex flex-col md:flex-row gap-4">
          <StyleTile
            image={champagneImg}
            title="Champagne"
            description="Celebration in a glass. Grower champagnes and classic houses, cellared and ready to pour."
            to="/shop?category=champagne"
            className="h-72 md:h-auto md:w-1/2"
          />
          <div className="md:w-1/2 flex flex-col gap-4">
            <StyleTile
              image={proseccoImg}
              title="Prosecco"
              description="Light, bright and effortlessly sociable — perfect for aperitivo hour."
              className="h-56 flex-1"
            />
            <StyleTile
              image={redWineImg}
              title="Red Wine"
              description="Bold tannins and rich fruit from vineyards across the globe."
              className="h-56 flex-1"
            />
          </div>
        </div>

        <StyleTile
          image={whiteWineImg}
          title="White Wine"
          description="Crisp, aromatic whites sourced from cool-climate vineyards around the world."
          className="h-80 md:h-96"
        />
      </div>
    </section>
  );
};

export default CollectionShowcase;
