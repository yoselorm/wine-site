import React from 'react';

// One mathematically exact period of the wave (each line is two matched quadratic
// arcs, chosen so the tangent at x=120 equals the tangent at x=0 — the shape tiles
// with no visible seam or kink, however many times it repeats).
const WAVE_TILE = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120">
  <path d="M0 15 Q 30 0, 60 15 Q 90 30, 120 15" fill="none" stroke="#D9A855" stroke-width="1" stroke-opacity="0.2"/>
  <path d="M0 38 Q 30 23, 60 38 Q 90 53, 120 38" fill="none" stroke="#D9A855" stroke-width="1" stroke-opacity="0.2"/>
  <path d="M0 61 Q 30 46, 60 61 Q 90 76, 120 61" fill="none" stroke="#D9A855" stroke-width="1" stroke-opacity="0.2"/>
  <path d="M0 84 Q 30 69, 60 84 Q 90 99, 120 84" fill="none" stroke="#D9A855" stroke-width="1" stroke-opacity="0.2"/>
  <path d="M0 107 Q 30 92, 60 107 Q 90 122, 120 107" fill="none" stroke="#D9A855" stroke-width="1" stroke-opacity="0.2"/>
</svg>`);

// Decorative dark-green divider with a subtle topographic contour-line texture.
//
// Previously this stretched one wide SVG `<pattern>` across the whole band via
// `viewBox` + `preserveAspectRatio="none"`, which browsers can render with a
// visibly different line density on either half of the band (a real rendering
// quirk, confirmed — not just a design nit). A CSS `background-image` tiled at a
// fixed pixel width has no such ambiguity: every repeat is an identical copy, so
// the pattern is uniform all the way to the edge no matter how wide the band is.
const TopoBand = ({ className = '' }) => (
  <div
    className={`w-full bg-forest-dark ${className}`}
    style={{
      backgroundImage: `url("data:image/svg+xml,${WAVE_TILE}")`,
      backgroundRepeat: 'repeat-x',
      backgroundSize: '120px 100%',
    }}
    aria-hidden="true"
  />
);

export default TopoBand;
