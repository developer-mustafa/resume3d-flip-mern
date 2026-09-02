import useBookStore from '../../stores/bookStore';

export default function TableOfContents({ pages }) {
  const { currentPage, goToPage, closeTOC } = useBookStore();

  return (
    <div className="book-toc-overlay fixed inset-0 z-50 flex items-center justify-center no-print">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeTOC} />
      <div className="relative bg-charcoal-light border border-white/10 rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl">
        <h2 className="text-lg font-semibold text-ivory mb-6 tracking-wide">TABLE OF CONTENTS</h2>
        <nav>
          <ul className="space-y-1">
            {pages.map((page, index) => (
              <li key={page.id}>
                <button
                  onClick={() => goToPage(index)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-4 transition-colors ${
                    currentPage === index
                      ? 'bg-accent/10 text-accent'
                      : 'text-ivory/70 hover:bg-white/5 hover:text-ivory'
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
          className="mt-6 w-full py-2.5 text-sm text-muted-light hover:text-ivory border border-white/10 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
