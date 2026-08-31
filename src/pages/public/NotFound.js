import React from 'react';
import { Link } from 'react-router-dom';
import { Wine } from 'lucide-react';
import WaveDecor from '../../components/public/shared/WaveDecor';

const NotFound = () => {
  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      <WaveDecor className="!top-16" />

      <div className="relative z-10 flex items-center justify-center gap-2 md:gap-4 font-serif text-[6rem] md:text-[9rem] leading-none text-gold select-none">
        <span>4</span>
        <span className="relative w-20 h-20 md:w-32 md:h-32 rounded-full border-[6px] md:border-[10px] border-gold flex items-center justify-center">
          <Wine size={40} className="md:w-16 md:h-16 text-gold" strokeWidth={1.5} />
        </span>
        <span>4</span>
      </div>

      <p className="relative z-10 mt-8 text-lg md:text-xl text-zinc-600 font-light">
        Ooops!.... something went wrong
      </p>

      <Link
        to="/"
        className="relative z-10 mt-4 text-sm font-semibold text-forest underline underline-offset-4 hover:text-gold transition-colors"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
