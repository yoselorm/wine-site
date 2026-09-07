import React, { useEffect, useRef, useState } from 'react';

// Fades + lifts children into place the first time they scroll into view.
const Reveal = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: visible ? `${delay}ms` : '0ms',
        // Settle on a literal `none` (rather than Tailwind's translate-y-0, which is
        // always a non-none matrix) so revealed sections don't become an accidental
        // containing block — that breaks `background-attachment: fixed` in children.
        transform: visible ? 'none' : 'translateY(2.5rem)',
      }}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100' : 'opacity-0'} ${className}`}
    >
      {children}
    </div>
  );
};

export default Reveal;
