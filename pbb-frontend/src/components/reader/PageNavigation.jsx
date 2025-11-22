import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PageNavigation = ({
  currentPage,
  totalPages,
  onPageChange,
  pageLabel,
  bookTitle,
  bookmarkButton,
  fullscreenButton,
  pages = [],  // Array of page objects with page_number and page_label
  bookId  // Add bookId for URL generation
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showGoToDialog, setShowGoToDialog] = useState(false);
  const [goToInput, setGoToInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareMenuPosition, setShareMenuPosition] = useState({ top: 0, left: 0 });
  const [linkCopied, setLinkCopied] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const shareButtonRef = useRef(null);
  const shareMenuRef = useRef(null);

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

  // Handle click outside to close share menu
  useEffect(() => {
    if (!showShareMenu) return;

    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

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

  // Share functionality
  const generateShareUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/reader?book_id=${bookId}&page=${currentPage}`;
  };

  const generateShareMessage = () => {
    const url = generateShareUrl();
    const pageInfo = pageLabel ? `Page ${pageLabel}` : `Page ${currentPage}`;
    return `A glimpse into the eternal teachings of Śrīla Bhaktivedānta Nārāyaṇa Gosvāmī Mahārāja — from Pure Bhakti Base.\n\n${bookTitle} - ${pageInfo}\n${url}`;
  };

  const handleShareClick = useCallback(() => {
    if (shareButtonRef.current) {
      const rect = shareButtonRef.current.getBoundingClientRect();
      setShareMenuPosition({
        top: rect.bottom + 8,
        left: rect.left
      });
    }
    setShowShareMenu(true);
  }, []);

  const handleCopyLink = async () => {
    const url = generateShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
      setShowShareMenu(false);
    } catch (err) {
      console.error('Failed to copy link:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
        setShowShareMenu(false);
      } catch (err) {
        console.error('Fallback copy failed:', err);
      }
      document.body.removeChild(textArea);
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(generateShareMessage());
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const whatsappUrl = isMobile
      ? `whatsapp://send?text=${message}`
      : `https://web.whatsapp.com/send?text=${message}`;
    window.open(whatsappUrl, '_blank');
    setShowShareMenu(false);
  };

  const handleEmailShare = () => {
    const pageInfo = pageLabel ? `Page ${pageLabel}` : `Page ${currentPage}`;
    const subject = encodeURIComponent(`${bookTitle} - ${pageInfo} - Pure Bhakti Base`);
    const body = encodeURIComponent(generateShareMessage());
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShareMenu(false);
  };

  const handleBackToLibrary = () => {
    const returnTab = searchParams.get('return_tab') || 'english';
    navigate(`/?tab=${returnTab}#library`);
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // Format: Page xxvii (56 of 204)
  const pageDisplay = pageLabel
    ? `Page ${pageLabel} (${currentPage} of ${totalPages})`
    : `Page ${currentPage} of ${totalPages}`;

  return (
    <>
      <style>{`
        .tooltip-button {
          position: relative;
        }
        .tooltip-button::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-4px);
          background-color: rgba(15, 23, 42, 0.95);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.15s ease-in-out;
          z-index: 1000;
        }
        .tooltip-button:hover::after {
          opacity: 1;
        }
      `}</style>
      <div className="bg-white rounded-xl shadow-md border border-slate-200 px-4 py-2.5 mb-3">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Library + Share + Bookmark Buttons */}
          <div className="flex items-center gap-2">
            {/* Back to Library Button */}
            <button
              onClick={handleBackToLibrary}
              data-tooltip="Back to Library"
              className="tooltip-button p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all duration-200 active:scale-95"
              title="Back to library"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>

            {/* Share Button */}
            <button
              ref={shareButtonRef}
              onClick={handleShareClick}
              data-tooltip={linkCopied ? 'Link Copied!' : 'Share Page'}
              className={`
                tooltip-button p-2 rounded-lg transition-all duration-200 active:scale-95
                ${linkCopied
                  ? 'text-green-600 hover:bg-green-50'
                  : 'text-blue-600 hover:bg-blue-50'
                }
              `}
              title="Share this page"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>

            {bookmarkButton}
          </div>

          {/* Center-Left: Previous Button */}
          <button
            onClick={handlePrevious}
            disabled={isFirstPage}
            data-tooltip="Previous Page"
            className={`
              tooltip-button p-2 rounded-lg transition-all duration-200
              ${isFirstPage
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50 active:scale-95'
              }
            `}
            title="Previous page"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            data-tooltip="Next Page"
            className={`
              tooltip-button p-2 rounded-lg transition-all duration-200
              ${isLastPage
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50 active:scale-95'
              }
            `}
            title="Next page"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Right: Go To + Fullscreen Buttons */}
          <div className="flex items-center gap-2">
            {/* Go To Button */}
            <button
              ref={buttonRef}
              onClick={handleGoToPage}
              data-tooltip="Go to Page"
              className="tooltip-button p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all duration-200 active:scale-95"
              title="Go to specific page"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
            className="fixed w-80 bg-white rounded-xl shadow-2xl border-2 border-blue-200 p-5 z-[9999]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
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
                    : 'border-slate-300 focus:border-blue-500'
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
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Go
              </button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Share Menu Dropdown */}
      {showShareMenu && createPortal(
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setShowShareMenu(false)}
          />

          {/* Share menu positioned below button */}
          <div
            ref={shareMenuRef}
            className="fixed w-64 bg-white rounded-xl shadow-2xl border-2 border-blue-200 p-4 z-[9999]"
            style={{
              top: `${shareMenuPosition.top}px`,
              left: `${shareMenuPosition.left}px`
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Share Page</h3>
            </div>

            <div className="space-y-2">
              {/* WhatsApp Option */}
              <button
                onClick={handleWhatsAppShare}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-50 transition-colors text-left group"
              >
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <span className="text-slate-700 font-medium">WhatsApp</span>
              </button>

              {/* Email Option */}
              <button
                onClick={handleEmailShare}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors text-left group"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-slate-700 font-medium">Email Link</span>
              </button>

              {/* Copy Link Option */}
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors text-left group"
              >
                <div className="w-8 h-8 bg-slate-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-slate-700 font-medium">Copy Link</span>
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
