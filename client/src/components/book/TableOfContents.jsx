import useBookStore from '../../stores/bookStore';

export default function TableOfContents({ pages, onPageSelect }) {
  const { currentPage, closeTOC } = useBookStore();

  return (
    <div className="book-toc-overlay fixed inset-0 z-50 flex items-center justify-center no-print">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeTOC} />
      <div className="relative bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-6 tracking-wide">TABLE OF CONTENTS</h2>
        <nav>
          <ul className="space-y-1">
            {pages.map((page, index) => (
              <li key={page.id}>
                <button
                  onClick={() => onPageSelect(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-4 transition-colors ${
                    currentPage === index
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <span className="font-mono text-xs opacity-50 w-6">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-sm font-medium">{page.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <button
          onClick={closeTOC}
          className="mt-6 w-full py-2.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
