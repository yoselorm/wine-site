import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Builds a compact page list like: 1 … 4 5 6 … 12
const buildPageList = (current, last) => {
  const pages = [];
  for (let p = 1; p <= last; p += 1) {
    if (p === 1 || p === last || Math.abs(p - current) <= 1) {
      pages.push(p);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }
  return pages;
};

const Pagination = ({ currentPage, lastPage, onPageChange, className = '' }) => {
  if (!lastPage || lastPage <= 1) return null;

  const pages = buildPageList(currentPage, lastPage);

  return (
    <nav className={`flex items-center justify-center gap-2 ${className}`} aria-label="Pagination">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
        className="w-9 h-9 flex items-center justify-center border border-zinc-300 text-zinc-600 hover:border-forest hover:text-forest transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-zinc-300 disabled:hover:text-zinc-600"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-zinc-400 text-sm">
            …
          </span>
        ) : (
          <button
            type="button"
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={`w-9 h-9 flex items-center justify-center text-sm font-medium border transition-colors ${
              p === currentPage ? 'bg-forest text-white border-forest' : 'border-zinc-300 text-zinc-600 hover:border-forest hover:text-forest'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= lastPage}
        aria-label="Next page"
        className="w-9 h-9 flex items-center justify-center border border-zinc-300 text-zinc-600 hover:border-forest hover:text-forest transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-zinc-300 disabled:hover:text-zinc-600"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
