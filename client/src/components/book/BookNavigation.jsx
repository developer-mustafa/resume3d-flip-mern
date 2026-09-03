import useBookStore from '../../stores/bookStore';
import { ChevronUp, ChevronDown, List, Printer, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeSwitcher from '../ui/ThemeSwitcher';

export default function BookNavigation({ onNext, onPrev, onPrint }) {
  const { currentPage, totalPages, toggleTOC } = useBookStore();

  return (
    <div className="book-nav no-print">
      {/* Unified Toolbar Container - Vertical Compact */}
      <div className="flex flex-col items-center gap-1.5 md:gap-2 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-1.5 md:px-2 md:py-3 rounded-full border border-slate-200 dark:border-white/10 shadow-2xl">
        
        {/* Theme Switcher */}
        <ThemeSwitcher className="flex-col text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white transition-colors scale-90 mb-1" placement="right" />
        
        <div className="w-5 h-px bg-slate-300 dark:bg-white/10 my-0.5 hidden md:block"></div>

        {/* Previous */}
        <button
          onClick={onPrev}
          disabled={currentPage === 0}
          aria-label="Previous page"
          className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronUp className="w-4 h-4" />
        </button>

        {/* TOC Button */}
        <button
          onClick={toggleTOC}
          aria-label="Table of contents"
          className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
        >
          <List className="w-4 h-4" />
        </button>

        {/* Page Counter (Vertical) */}
        <div className="px-1 py-1.5 md:py-2 text-[10px] md:text-xs font-mono text-slate-500 dark:text-white/50 tracking-wider flex flex-col items-center leading-none gap-0.5">
          <span className="text-slate-800 dark:text-white font-medium">{String(currentPage + 1).padStart(2, '0')}</span>
          <span className="opacity-50">/</span>
          <span>{String(totalPages || 6).padStart(2, '0')}</span>
        </div>

        {/* Print */}
        <button
          onClick={onPrint}
          aria-label="Print resume"
          className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
        >
          <Printer className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          disabled={currentPage === (totalPages || 6) - 1}
          aria-label="Next page"
          className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronDown className="w-4 h-4" />
        </button>

        <div className="w-5 h-px bg-slate-300 dark:bg-white/10 my-0.5 hidden md:block mt-1"></div>
        
        {/* Admin Link */}
        <Link 
          to="/admin" 
          title="Admin Dashboard" 
          className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-800 dark:text-white/40 dark:hover:text-white transition-colors"
        >
          <Settings className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </Link>
      </div>
    </div>
  );
}
