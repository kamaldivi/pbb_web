const PageNavigation = ({ currentPage, totalPages, onPageChange, bookTitle }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="bg-gradient-to-r from-indigo-50/80 via-blue-50/60 to-cyan-50/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 mb-4 border border-indigo-200/50">
      <div className="flex items-center justify-between gap-4">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={isFirstPage}
          className={`
            flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm
            transition-all duration-200 shadow-md
            ${isFirstPage
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:scale-95 hover:shadow-lg'
            }
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        {/* Book Title */}
        <div className="flex-1 flex items-center justify-center bg-white/70 backdrop-blur-sm px-6 py-3 rounded-xl border border-blue-200/50">
          <div className="text-center">
            <div className="text-xs text-slate-600 font-semibold mb-1">Currently Reading</div>
            <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent truncate max-w-md">
              {bookTitle || 'Select a book'}
            </div>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={isLastPage}
          className={`
            flex items-center space-x-2 px-5 py-2.5 rounded-xl font-semibold text-sm
            transition-all duration-200 shadow-md
            ${isLastPage
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:scale-95 hover:shadow-lg'
            }
          `}
        >
          <span>Next</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PageNavigation;
