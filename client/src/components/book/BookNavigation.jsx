import useBookStore from '../../stores/bookStore';
import { ChevronLeft, ChevronRight, List, Printer } from 'lucide-react';
import ThemeSwitcher from '../ui/ThemeSwitcher';

export default function BookNavigation({ onNext, onPrev }) {
  const { currentPage, totalPages, toggleTOC } = useBookStore();

  return (
    <div className="book-nav flex flex-col md:flex-row items-center justify-between gap-4 mt-8 no-print z-50 w-full max-w-4xl mx-auto px-4">
      {/* Theme Switcher on the left */}
      <div className="flex-1 flex justify-start">
        <ThemeSwitcher className="text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white" placement="top" />
      </div>

      {/* Center Navigation */}
      <div className="flex items-center gap-4">
        {/* Previous */}
        <button
        onClick={onPrev}
        disabled={currentPage === 0}
        aria-label="Previous page"
        className="w-11 h-11 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* TOC Button */}
      <button
        onClick={toggleTOC}
        aria-label="Table of contents"
        className="w-11 h-11 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
      >
        <List className="w-5 h-5" />
      </button>

      {/* Page Counter */}
      <div className="px-4 py-2 text-sm font-mono text-slate-500 dark:text-white/50 tracking-wider">
        <span className="text-slate-800 dark:text-white font-medium">{String(currentPage + 1).padStart(2, '0')}</span>
        <span className="mx-1">/</span>
        <span>{String(totalPages || 6).padStart(2, '0')}</span>
      </div>

      {/* Print */}
      <button
        onClick={() => window.print()}
        aria-label="Print resume"
        className="w-11 h-11 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
      >
        <Printer className="w-4 h-4" />
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={currentPage === (totalPages || 6) - 1}
        aria-label="Next page"
        className="w-11 h-11 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-white/60 hover:text-slate-800 dark:hover:text-white hover:border-slate-400 dark:hover:border-white/30 hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      </div>
      
      {/* Spacer on right to balance center alignment */}
      <div className="flex-1 hidden md:block"></div>
    </div>
  );
}
