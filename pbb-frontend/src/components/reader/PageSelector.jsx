import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';

const PageSelector = ({
  pages,
  loading,
  error,
  selectedPage,
  onPageSelect,
  onRetry
}) => {
  if (loading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-cyan-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 p-4">
        <h3 className="text-sm font-bold text-slate-800 mb-2">Pages</h3>
        <LoadingSpinner size="small" message="" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-cyan-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 p-4">
        <h3 className="text-sm font-bold text-slate-800 mb-2">Pages</h3>
        <ErrorMessage error={error} onRetry={onRetry} />
      </div>
    );
  }

  // Handle different API response formats for pages
  const pagesArray = Array.isArray(pages) ? pages : (pages?.page_maps || pages?.pages || pages?.data || []);

  if (!pagesArray || pagesArray.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-cyan-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 p-4">
        <h3 className="text-sm font-bold text-slate-800 mb-2">Pages</h3>
        <div className="text-center text-gray-500 py-4 text-xs">
          No pages available
        </div>
      </div>
    );
  }

  const sortedPages = [...pagesArray].sort((a, b) => {
    const aNum = parseInt(a.page_number) || 0;
    const bNum = parseInt(b.page_number) || 0;
    return aNum - bNum;
  });

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-cyan-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-blue-200/50 p-4">
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-slate-800">Pages</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
          <p className="text-xs font-medium text-slate-600">
            {pagesArray.length} core pages
          </p>
        </div>
      </div>

      <div className="max-h-[750px] overflow-y-auto space-y-1 pr-1">
        {sortedPages.map((page) => (
          <button
            key={page.page_number}
            onClick={() => onPageSelect(page)}
            className={`w-full text-left p-3 rounded-xl text-xs font-semibold transition-all duration-200 ${
              selectedPage?.page_number === page.page_number
                ? 'bg-gradient-to-r from-blue-700 to-blue-800 text-white shadow-lg border border-blue-600 ring-2 ring-blue-400/40'
                : 'bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 border border-blue-200/50 hover:border-blue-400 hover:shadow-md hover:scale-[1.02]'
            }`}
          >
            <div className="font-mono">
              {page.page_number} ({page.page_label})
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PageSelector;