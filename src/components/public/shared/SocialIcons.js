import React from 'react';

// lucide-react dropped brand/social glyphs a long time ago, so these are small
// hand-rolled outline icons to match the bordered-square social row in the mockups.
const boxCls = 'w-7 h-7 border border-current rounded-sm flex items-center justify-center';

export const FacebookIcon = ({ className = '' }) => (
  <span className={`${boxCls} ${className}`}>
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 9h3V6h-3c-1.66 0-3 1.34-3 3v2H9v3h2v6h3v-6h3l1-3h-4V9c0-.55.45-1 1-1z" fill="currentColor" stroke="none" />
    </svg>
  </span>
);

export const TwitterIcon = ({ className = '' }) => (
  <span className={`${boxCls} ${className}`}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 4.9c-.8.4-1.7.6-2.6.8 1-.6 1.7-1.5 2-2.6-.9.5-1.9.9-3 1.1a4.6 4.6 0 0 0-7.9 4.2A13 13 0 0 1 1.6 3.4a4.6 4.6 0 0 0 1.4 6.2c-.7 0-1.4-.2-2-.6v.1c0 2.2 1.6 4.1 3.7 4.5-.7.2-1.4.2-2 .1.6 1.9 2.3 3.2 4.3 3.3A9.3 9.3 0 0 1 0 19.5 13 13 0 0 0 7.1 21.5c8.5 0 13.1-7 13.1-13.1v-.6c.9-.6 1.7-1.5 2.3-2.4-.8.4-1.7.6-2.5.7.9-.6 1.6-1.4 2-2.3Z" />
    </svg>
  </span>
);

export const InstagramIcon = ({ className = '' }) => (
  <span className={`${boxCls} ${className}`}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  </span>
);
