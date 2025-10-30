import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

const PageNavigation = ({
  currentPage,
  totalPages,
  onPageChange,
  pageLabel,
  bookTitle,
  bookmarkButton,
  fullscreenButton,
  pages = []  // Array of page objects with page_number and page_label
}) => {
  const [showGoToDialog, setShowGoToDialog] = useState(false);
  const [goToInput, setGoToInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    if (!showGoToDialog) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowGoToDialog(false);
        setGoToInput('');
        setErrorMessage('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showGoToDialog]);

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

  const handleGoToPage = useCallback(() => {
    // Calculate position for dropdown
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8, // 8px below the button
        left: rect.left
      });
    }
    setShowGoToDialog(true);
    setErrorMessage('');
    setGoToInput('');
  }, []);

  const handleGoToSubmit = () => {
    if (!goToInput.trim()) {
      setErrorMessage('Please enter a page label or number');
      return;
    }

    const input = goToInput.trim();

    // Try to find page by label first (case-insensitive)
    let foundPage = pages.find(p =>
      p.page_label && p.page_label.toLowerCase() === input.toLowerCase()
    );

    // If not found by label, try as page number
    if (!foundPage) {
      const pageNum = parseInt(input, 10);
      if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
        foundPage = pages.find(p => p.page_number === pageNum);
        if (!foundPage) {
          // Page number is valid but not in pages array, use it anyway
          onPageChange(pageNum);
          setShowGoToDialog(false);
          setGoToInput('');
          setErrorMessage('');
          return;
        }
      }
    }

    if (foundPage) {
      onPageChange(foundPage.page_number);
      setShowGoToDialog(false);
      setGoToInput('');
      setErrorMessage('');
    } else {
      setErrorMessage(`Page "${input}" not found. Try a page label (e.g., "xxvii") or number (1-${totalPages})`);
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Format: Page xxvii (56 of 204)
  const pageDisplay = pageLabel
    ? `Page ${pageLabel} (${currentPage} of ${totalPages})`
    : `Page ${currentPage} of ${totalPages}`;

  return (
    <>
      <div className="bg-gradient-to-r from-slate-50/90 via-gray-50/80 to-slate-50/90 backdrop-blur-sm rounded-xl shadow-md border border-slate-200/50 px-4 py-2.5 mb-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Bookmark Buttons */}
          <div className="flex items-center gap-2">
            {bookmarkButton}
          </div>

          {/* Center-Left: Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={isFirstPage}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${isFirstPage
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50 active:scale-95'
              }
            `}
            title="Previous page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Center: Book Title + Page Info */}
          <div className="flex-1 min-w-0 text-center">
            <div className="text-sm font-bold text-slate-800 truncate">
              {bookTitle}
            </div>
            <div className="text-xs text-slate-600">
              {pageDisplay}
            </div>
          </div>

          {/* Center-Right: Next Button */}
          <button
            onClick={handleNext}
            disabled={isLastPage}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${isLastPage
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50 active:scale-95'
              }
            `}
            title="Next page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Right: Go To + Fullscreen Buttons */}
          <div className="flex items-center gap-2">
            {/* Go To Button */}
            <button
              ref={buttonRef}
              onClick={handleGoToPage}
              className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-all duration-200 active:scale-95"
              title="Go to specific page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h8m0 0-3-3m3 3-3 3" />
              </svg>
            </button>

            {/* Fullscreen Button */}
            {fullscreenButton}
          </div>
        </div>
      </div>

      {/* Go To Page Dropdown */}
      {showGoToDialog && createPortal(
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => {
              setShowGoToDialog(false);
              setGoToInput('');
              setErrorMessage('');
            }}
          />

          {/* Dropdown positioned below button */}
          <div
            ref={dropdownRef}
            className="fixed w-80 bg-white rounded-xl shadow-2xl border-2 border-emerald-200 p-5 z-[9999]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 2h9l5 5v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 12h8m0 0-3-3m3 3-3 3" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Go To Page</h3>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Enter page label:
              </label>
              <input
                type="text"
                value={goToInput}
                onChange={(e) => {
                  setGoToInput(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="e.g., xxvii, a1, 32"
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                  errorMessage
                    ? 'border-red-400 focus:border-red-500'
                    : 'border-slate-300 focus:border-emerald-500'
                }`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleGoToSubmit();
                  } else if (e.key === 'Escape') {
                    setShowGoToDialog(false);
                    setGoToInput('');
                    setErrorMessage('');
                  }
                }}
              />
              {errorMessage && (
                <p className="text-xs text-red-600 mt-2 font-medium">
                  {errorMessage}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-2">
                Current page: {pageLabel || currentPage} ({currentPage} of {totalPages})
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowGoToDialog(false);
                  setGoToInput('');
                  setErrorMessage('');
                }}
                className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGoToSubmit}
                disabled={!goToInput.trim()}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Go
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

export default PageNavigation;
