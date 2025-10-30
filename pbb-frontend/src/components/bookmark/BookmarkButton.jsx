import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { addBookmark, deleteBookmark, isPageBookmarked } from '../../services/bookmarkService';

/**
 * BookmarkButton Component
 * Displays a button to add/remove bookmarks for the current page
 * Shows visual indicator if page is already bookmarked
 *
 * @param {boolean} compactMode - If true, shows icon-only buttons suitable for navigation bar
 */
const BookmarkButton = ({ bookId, bookTitle, pageNumber, onBookmarkChange, compactMode = false }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [currentBookmark, setCurrentBookmark] = useState(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [customName, setCustomName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Check if current page is bookmarked on mount and when page changes
  useEffect(() => {
    if (bookId && pageNumber) {
      const bookmark = isPageBookmarked(bookId, pageNumber);
      setIsBookmarked(!!bookmark);
      setCurrentBookmark(bookmark);
    }
  }, [bookId, pageNumber]);

  // Handle click outside to close dropdown in compact mode
  useEffect(() => {
    if (!compactMode || !showNameDialog) return;

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        handleCancelDialog();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNameDialog, compactMode]);

  const handleQuickBookmark = async () => {
    if (!bookId || !bookTitle || !pageNumber) {
      console.error('Missing required bookmark data');
      return;
    }

    setIsProcessing(true);

    try {
      if (isBookmarked && currentBookmark) {
        // Remove bookmark
        const success = deleteBookmark(currentBookmark.id);
        if (success) {
          setIsBookmarked(false);
          setCurrentBookmark(null);
          onBookmarkChange?.({ action: 'removed', bookId, pageNumber });
        }
      } else {
        // Add bookmark without custom name
        const newBookmark = addBookmark({
          bookId,
          bookTitle,
          pageNumber,
          customName: '',
        });
        setIsBookmarked(true);
        setCurrentBookmark(newBookmark);
        onBookmarkChange?.({ action: 'added', bookmark: newBookmark });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Failed to save bookmark. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBookmarkWithName = useCallback(() => {
    // Calculate position for dropdown
    if (compactMode && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8, // 8px below the button
        left: rect.left
      });
    }
    setShowNameDialog(true);
    setCustomName(currentBookmark?.customName || '');
  }, [compactMode, currentBookmark]);

  const handleSaveWithName = async () => {
    if (!bookId || !bookTitle || !pageNumber) {
      return;
    }

    setIsProcessing(true);

    try {
      const newBookmark = addBookmark({
        bookId,
        bookTitle,
        pageNumber,
        customName: customName.trim(),
      });

      setIsBookmarked(true);
      setCurrentBookmark(newBookmark);
      setShowNameDialog(false);
      setCustomName('');
      onBookmarkChange?.({ action: 'added', bookmark: newBookmark });
    } catch (error) {
      console.error('Error saving bookmark with name:', error);
      alert('Failed to save bookmark. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelDialog = () => {
    setShowNameDialog(false);
    setCustomName('');
  };

  // Compact mode for navigation bar
  if (compactMode) {
    return (
      <>
        <div className="relative flex items-center gap-1">
          {/* Bookmark Toggle Icon */}
          <button
            onClick={handleQuickBookmark}
            disabled={isProcessing}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${isBookmarked
                ? 'text-amber-600 hover:bg-amber-50'
                : 'text-slate-400 hover:bg-slate-100'
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <svg
              className={`w-5 h-5 ${isBookmarked ? 'fill-current' : 'fill-none'}`}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>

          {/* Edit Name Icon (only when bookmarked) */}
          {isBookmarked && (
            <button
              ref={buttonRef}
              onClick={handleBookmarkWithName}
              disabled={isProcessing}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Edit bookmark name"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Portal for dropdown - renders at document.body level */}
        {showNameDialog && createPortal(
          <>
            {/* Backdrop overlay when dropdown is open */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={handleCancelDialog}
            />

            {/* Custom Name Dropdown (fixed positioning to escape stacking context) */}
            <div
              ref={dropdownRef}
              className="fixed w-80 bg-white rounded-xl shadow-2xl border-2 border-amber-200 p-5 z-[9999]"
              style={{
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  {currentBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
                </h3>
              </div>

              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">
                  <span className="font-semibold">Book:</span> {bookTitle}
                </p>
                <p className="text-sm text-slate-600 mb-4">
                  <span className="font-semibold">Page:</span> {pageNumber}
                </p>

                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Custom Name (Optional)
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., Important verse, Key concept..."
                  className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                  maxLength={100}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveWithName();
                    } else if (e.key === 'Escape') {
                      handleCancelDialog();
                    }
                  }}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {customName.length}/100 characters
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancelDialog}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveWithName}
                  disabled={isProcessing}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                >
                  {isProcessing ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </>,
          document.body
        )}
      </>
    );
  }

  // Full mode (original design)
  return (
    <>
      <div className="flex items-center gap-2">
        {/* Quick Bookmark Toggle Button */}
        <button
          onClick={handleQuickBookmark}
          disabled={isProcessing}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
            transition-all duration-200 shadow-md hover:shadow-lg
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              isBookmarked
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-white hover:bg-amber-50 text-slate-700 border-2 border-amber-300'
            }
          `}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <svg
            className={`w-5 h-5 ${isBookmarked ? 'fill-current' : 'fill-none'}`}
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <span className="text-sm">
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </span>
        </button>

        {/* Add Bookmark with Custom Name Button */}
        {!isBookmarked && (
          <button
            onClick={handleBookmarkWithName}
            disabled={isProcessing}
            className="
              flex items-center gap-2 px-3 py-2 rounded-lg
              bg-gradient-to-r from-blue-500 to-indigo-500
              hover:from-blue-600 hover:to-indigo-600
              text-white font-semibold text-sm
              transition-all duration-200 shadow-md hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            title="Add bookmark with custom name"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Name</span>
          </button>
        )}

        {/* Edit Name Button (when bookmarked) */}
        {isBookmarked && (
          <button
            onClick={handleBookmarkWithName}
            disabled={isProcessing}
            className="
              flex items-center gap-2 px-3 py-2 rounded-lg
              bg-slate-100 hover:bg-slate-200
              text-slate-700 font-semibold text-sm
              transition-all duration-200 shadow-sm hover:shadow-md
              disabled:opacity-50 disabled:cursor-not-allowed
            "
            title="Edit bookmark name"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>Edit</span>
          </button>
        )}
      </div>

      {/* Custom Name Dialog */}
      {showNameDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">
                {currentBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
              </h3>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">
                <span className="font-semibold">Book:</span> {bookTitle}
              </p>
              <p className="text-sm text-slate-600 mb-4">
                <span className="font-semibold">Page:</span> {pageNumber}
              </p>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Custom Name (Optional)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g., Important verse, Key concept..."
                className="w-full px-4 py-2 border-2 border-slate-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                maxLength={100}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveWithName();
                  } else if (e.key === 'Escape') {
                    handleCancelDialog();
                  }
                }}
              />
              <p className="text-xs text-slate-500 mt-1">
                {customName.length}/100 characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCancelDialog}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWithName}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isProcessing ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookmarkButton;
