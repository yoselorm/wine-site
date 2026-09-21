import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// A continuously auto-scrolling row (right-to-left) with manual arrow overrides.
// Driven by `transform: translateX` on a plain, non-scrollable track rather than
// mutating `scrollLeft` on an overflow container — repeated small `scrollLeft`
// writes inside a rAF loop turned out not to reliably stick in testing, while a
// transform (the same technique Reveal.js already uses in this codebase) does.
//
// The item list is rendered twice back-to-back; once the offset passes the first
// copy's width, it's snapped back by exactly that width — since the two copies
// are identical, the snap is invisible and the scroll reads as infinite.
const InfiniteCarousel = ({ items, renderItem, itemWidth = 240, speed = 0.4, keyFor = (item, i) => i }) => {
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length === 0) return undefined;

    let rafId;
    const tick = () => {
      if (!pausedRef.current) {
        offsetRef.current += speed;
        const fullWidth = track.scrollWidth / 2;
        if (offsetRef.current >= fullWidth) offsetRef.current -= fullWidth;
        track.style.transform = `translateX(-${offsetRef.current}px)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [items.length, speed]);

  const scrollByAmount = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const fullWidth = track.scrollWidth / 2;
    let next = offsetRef.current + direction * itemWidth * 1.3;
    if (next >= fullWidth) next -= fullWidth;
    if (next < 0) next += fullWidth;
    offsetRef.current = next;
    track.style.transition = 'transform 0.4s ease-out';
    track.style.transform = `translateX(-${next}px)`;
    window.setTimeout(() => {
      if (trackRef.current) trackRef.current.style.transition = '';
    }, 400);
  };

  if (items.length === 0) return null;

  const looped = [...items, ...items];

  return (
    <div
      className="relative"
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      <div className="overflow-hidden">
        <div ref={trackRef} className="flex gap-6" style={{ willChange: 'transform' }}>
          {looped.map((item, i) => (
            <div key={keyFor(item, i)} style={{ minWidth: itemWidth, maxWidth: itemWidth }} className="shrink-0">
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => scrollByAmount(-1)}
        aria-label="Scroll left"
        className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md items-center justify-center text-zinc-500 hover:text-forest transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        type="button"
        onClick={() => scrollByAmount(1)}
        aria-label="Scroll right"
        className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-md items-center justify-center text-zinc-500 hover:text-forest transition-colors"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

export default InfiniteCarousel;
