import useBookStore from '../../stores/bookStore';
import { ChevronLeft, ChevronRight, List, Printer } from 'lucide-react';

export default function BookNavigation({ onNext, onPrev }) {
  const { currentPage, totalPages, toggleTOC } = useBookStore();

  return (
    <div className="book-nav flex items-center justify-center gap-4 mt-8 no-print z-50">
      {/* Previous */}
      <button
        onClick={onPrev}
        disabled={currentPage === 0}
        aria-label="Previous page"
        className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* TOC Button */}
      <button
        onClick={toggleTOC}
        aria-label="Table of contents"
        className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
      >
        <List className="w-5 h-5" />
      </button>

      {/* Page Counter */}
      <div className="px-4 py-2 text-sm font-mono text-white/50 tracking-wider">
        <span className="text-white font-medium">{String(currentPage + 1).padStart(2, '0')}</span>
        <span className="mx-1">/</span>
        <span>{String(totalPages || 6).padStart(2, '0')}</span>
      </div>

      {/* Print */}
      <button
        onClick={() => window.print()}
        aria-label="Print resume"
        className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all"
      >
        <Printer className="w-4 h-4" />
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={currentPage === (totalPages || 6) - 1}
        aria-label="Next page"
        className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
