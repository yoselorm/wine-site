import React from 'react';
import { Link } from 'react-router-dom';
import WaveDecor from './WaveDecor';

// The dark-green banner with the gold wave graphic used at the top of
// Shop, ProductDetail, Search Results and Blog listing pages.
const SectionBanner = ({ title, breadcrumbs = [] }) => {
  return (
    <div className="relative bg-forest overflow-hidden py-10 md:py-14 px-6">
      <WaveDecor className="!w-56 md:!w-72 !top-0 !left-0 opacity-40" />
      <div className="relative max-w-7xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-gold-light">{title}</h1>
        {breadcrumbs.length > 0 && (
          <nav className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-widest text-cream/60">
            {breadcrumbs.map((bc, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span>/</span>}
                {bc.to ? (
                  <Link to={bc.to} className="hover:text-cream transition-colors">
                    {bc.label}
                  </Link>
                ) : (
                  <span>{bc.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
};

export default SectionBanner;
