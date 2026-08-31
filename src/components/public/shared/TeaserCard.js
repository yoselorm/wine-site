import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star } from 'lucide-react';

const TeaserCard = ({
  id,
  image,
  name,
  subtitle = 'Moët & Chandon | Paris',
  price,
  rating = 5,
  to = '/shop',
}) => {
  return (
    <div className="group relative flex flex-col items-center text-center">
      {/* Bottle Display Area */}
      <div className="relative w-full aspect-[3/4] max-h-[300px] flex items-center justify-center p-4 mb-3 transition-transform duration-300 group-hover:-translate-y-1">
        <img
          src={image}
          alt={name}
          className="h-full w-auto object-contain drop-shadow-md"
        />
      </div>

      {/* Meta Information */}
      <div className="w-full flex flex-col items-center">
        <span className="text-[10px] text-stone-400 font-light tracking-wide uppercase mb-1">
          {subtitle}
        </span>

        <h3 className="font-serif text-[15px] font-medium text-stone-800 leading-snug mb-1 line-clamp-1 group-hover:text-[#1F3D2B] transition-colors">
          {name}
        </h3>

        {/* Rating Stars */}
        <div className="flex items-center gap-0.5 text-[#931D38] mb-1.5">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} size={10} fill="currentColor" stroke="none" />
          ))}
        </div>

        <p className="text-xs font-semibold text-stone-900 tracking-tight mb-3">
          {price}
        </p>

        {/* Floating Red Circular Action */}
        <Link
          to={to}
          aria-label={`View ${name}`}
          className="w-6 h-6 rounded-full bg-[#931D38] text-white flex items-center justify-center shadow hover:bg-[#77152B] transition-colors"
        >
          <Plus size={13} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
};

export default TeaserCard;