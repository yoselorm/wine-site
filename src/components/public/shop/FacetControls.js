import React, { useEffect, useRef, useState } from 'react';

// Button-based pseudo-radios rather than real <input type="radio"> — native radios
// never fire a change event when you click the one that's already checked, so
// "click again to deselect" silently did nothing. Buttons give full manual control.
export const RadioFacet = ({ title, options, selected, onSelect, scrollable = false }) => {
  const scrollRef = useRef(null);
  // A capped-height, overflow-scroll list gives no visual hint there's more below
  // the fold — a fade at whichever edge still has content hides/shows as you
  // scroll, the same affordance used for horizontally-scrolling carousels.
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const updateFades = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowTopFade(el.scrollTop > 4);
    setShowBottomFade(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
  };

  useEffect(() => {
    if (scrollable) updateFades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollable, options.length]);

  return (
    <div className="mb-10">
      <h4 className="font-bold text-sm text-zinc-900 mb-4">{title}</h4>
      <div className="relative">
        <div
          ref={scrollRef}
          onScroll={scrollable ? updateFades : undefined}
          className={`space-y-3 ${scrollable ? 'max-h-56 overflow-y-auto pr-1' : ''}`}
          role="radiogroup"
          aria-label={title}
        >
          {options.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelect(isSelected ? '' : opt.value)}
                className="w-full flex items-center justify-between cursor-pointer group text-left"
              >
                <span className={`text-sm ${isSelected ? 'text-forest font-medium' : 'text-zinc-600'} group-hover:text-forest transition-colors`}>
                  {opt.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`w-4 h-4 rounded-full border shrink-0 ml-2 flex items-center justify-center transition-colors ${
                    isSelected ? 'border-forest' : 'border-zinc-300 group-hover:border-forest'
                  }`}
                >
                  {isSelected && <span className="w-2 h-2 rounded-full bg-forest" />}
                </span>
              </button>
            );
          })}
        </div>
        {scrollable && showTopFade && (
          <div className="pointer-events-none absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-cream to-transparent" />
        )}
        {scrollable && showBottomFade && (
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-cream to-transparent" />
        )}
      </div>
    </div>
  );
};

export const CharacteristicSlider = ({ leftLabel, rightLabel, value, onChange }) => (
  <div className="mb-8">
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full accent-forest mb-2"
    />
    <div className="flex justify-between text-[11px] text-zinc-500">
      <span>{leftLabel}</span>
      <span>{rightLabel}</span>
    </div>
  </div>
);
