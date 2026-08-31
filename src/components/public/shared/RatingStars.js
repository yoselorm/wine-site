import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, count, size = 12, className = '' }) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            size={size}
            className={n <= Math.round(rating) ? 'fill-wine text-wine' : 'fill-transparent text-wine/30'}
          />
        ))}
      </div>
      {count != null && <span className="text-[11px] text-zinc-400">({count})</span>}
    </div>
  );
};

export default RatingStars;
