import React from 'react';

// Decorative dark-green divider with a subtle topographic contour-line texture.
const TopoBand = ({ className = '' }) => (
  <div className={`relative w-full overflow-hidden bg-forest-dark ${className}`}>
    <svg
      className="absolute inset-0 w-full h-full opacity-20"
      viewBox="0 0 400 120"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="topo-lines" width="200" height="120" patternUnits="userSpaceOnUse">
          <path d="M-10 15 Q 20 0, 50 15 T 110 15 T 170 15 T 230 15" fill="none" stroke="#D9A855" strokeWidth="1" />
          <path d="M-10 38 Q 20 23, 50 38 T 110 38 T 170 38 T 230 38" fill="none" stroke="#D9A855" strokeWidth="1" />
          <path d="M-10 61 Q 20 46, 50 61 T 110 61 T 170 61 T 230 61" fill="none" stroke="#D9A855" strokeWidth="1" />
          <path d="M-10 84 Q 20 69, 50 84 T 110 84 T 170 84 T 230 84" fill="none" stroke="#D9A855" strokeWidth="1" />
          <path d="M-10 107 Q 20 92, 50 107 T 110 107 T 170 107 T 230 107" fill="none" stroke="#D9A855" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="400" height="120" fill="url(#topo-lines)" />
    </svg>
  </div>
);

export default TopoBand;
