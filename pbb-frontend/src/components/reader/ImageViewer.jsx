import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { getBookPage } from '../../services/assetHelper';
import LoadingSpinner from '../shared/LoadingSpinner';

const ImageViewer = forwardRef(({
  bookId,
  pageNumber,
  pageLabel,
  totalPages,
  pages = [],
  onPageChange
}, ref) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentVisiblePage, setCurrentVisiblePage] = useState(pageNumber);
  const scrollContainerRef = useRef(null);
  const pageRefs = useRef({});
  const isScrollingProgrammatically = useRef(false);
  const previousPageNumber = useRef(pageNumber);

  // Expose toggleFullscreen method to parent via ref
  useImperativeHandle(ref, () => ({
    toggleFullscreen: () => {
      const willEnterFullscreen = !fullscreen;
      setFullscreen(willEnterFullscreen);

      // Scroll to current page when entering fullscreen
      if (willEnterFullscreen) {
        setTimeout(() => {
          if (pageRefs.current[pageNumber]) {
            pageRefs.current[pageNumber].scrollIntoView({
              behavior: 'auto',
              block: 'start'
            });
          }
        }, 100);
      }
    }
  }));

  // Scroll to page ONLY when external navigation occurs (TOC, buttons, Go To Page)
  // NOT when scroll tracking updates the page
  useEffect(() => {
    // Only handle scrolling in fullscreen mode
    if (!fullscreen) return;

    // Check if this is an external page change (not from scroll tracking)
    const isExternalPageChange = previousPageNumber.current !== pageNumber;

    // IMPORTANT: Only scroll if the page change came from outside (user clicked something)
    // We detect this by checking if we're already scrolling programmatically
    // If scroll tracking updated the page, we should NOT scroll
    if (isExternalPageChange && !isScrollingProgrammatically.current) {
      // This is a genuine external navigation (TOC click, button press, etc.)
      previousPageNumber.current = pageNumber;

      if (pageRefs.current[pageNumber]) {
        isScrollingProgrammatically.current = true;
        pageRefs.current[pageNumber].scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Reset flag after scroll completes
        setTimeout(() => {
          isScrollingProgrammatically.current = false;
        }, 300);
      }
    } else {
      // Just update the ref without scrolling (scroll tracking updated the page)
      previousPageNumber.current = pageNumber;
    }
  }, [fullscreen, pageNumber]);

  // Track visible page in fullscreen mode using "top of viewport" detection
  useEffect(() => {
    if (!fullscreen || !scrollContainerRef.current) return;

    let scrollTimeout = null;

    const handleScroll = () => {
      // Skip scroll tracking if we're scrolling programmatically
      if (isScrollingProgrammatically.current) return;

      // Clear previous timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Debounce the scroll handler
      scrollTimeout = setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const viewportTop = containerRect.top;

        // Find the page that is at or just past the top of the viewport
        // This gives us the "current page" the user is reading
        let detectedPage = 1;
        let minDistance = Infinity;

        for (let i = 1; i <= totalPages; i++) {
          const pageEl = pageRefs.current[i];
          if (pageEl) {
            const rect = pageEl.getBoundingClientRect();
            const pageTop = rect.top;

            // Distance from page top to viewport top
            // Positive = page is below viewport, Negative = page is above viewport
            const distance = pageTop - viewportTop;

            // If page top is visible or just above viewport (within reasonable threshold)
            // and it's closer than previous candidates, this is our current page
            if (distance <= 50 && Math.abs(distance) < minDistance) {
              minDistance = Math.abs(distance);
              detectedPage = i;
            }
          }
        }

        // Update only if page changed
        if (currentVisiblePage !== detectedPage) {
          setCurrentVisiblePage(detectedPage);
          // Update parent's current page WITHOUT triggering auto-scroll
          if (onPageChange && pageNumber !== detectedPage) {
            // Set flag to prevent auto-scroll from this update
            isScrollingProgrammatically.current = true;
            onPageChange(detectedPage);
            // Clear flag immediately so actual navigation still works
            setTimeout(() => {
              isScrollingProgrammatically.current = false;
            }, 50);
          }
        }
      }, 150); // Debounce delay
    };

    const container = scrollContainerRef.current;
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [fullscreen, totalPages, currentVisiblePage, onPageChange, pageNumber]);

  if (!bookId || !pageNumber) {
    return (
      <div className="w-full h-full bg-white rounded-lg shadow-md p-6 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">Select a page to view image</p>
          <p className="text-sm text-gray-400 mt-1">Choose a book and page from the left panel</p>
        </div>
      </div>
    );
  }

  const imagePath = getBookPage(bookId, pageNumber);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const closeFullscreen = () => {
    setFullscreen(false);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1 && onPageChange) {
      onPageChange(pageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (pageNumber < totalPages && onPageChange) {
      onPageChange(pageNumber + 1);
    }
  };

  const canGoPrevious = pageNumber > 1;
  const canGoNext = totalPages && pageNumber < totalPages;

  // Normal mode: Always render single page (pagination)
  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        {/* Image Container - No Header */}
        <div className="relative bg-gray-100 flex items-center justify-center p-4">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoadingSpinner size="large" message="Loading image..." />
            </div>
          )}

          {imageError && !imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-lg font-medium mb-2">Image not found</p>
                <p className="text-sm text-gray-400">
                  {imagePath}
                </p>
              </div>
            </div>
          )}

          <img
            src={imagePath}
            alt={`Page ${pageNumber} of Book ${bookId}`}
            className={`w-full object-contain transition-opacity duration-200 ${
              imageLoading || imageError ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      </div>

      {/* Fullscreen Modal - Continuous Scroll Mode (Always enabled in fullscreen) */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex flex-col">
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-20 bg-black bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-80 transition-all shadow-lg"
              title="Close fullscreen (Esc)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Continuous Scroll Content */}
            <div
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-8"
            >
              <div className="max-w-5xl mx-auto">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                  const pageImagePath = getBookPage(bookId, pageNum);

                  return (
                    <div
                      key={pageNum}
                      ref={el => pageRefs.current[pageNum] = el}
                      className="mb-12 last:mb-0"
                    >
                      {/* Page Image */}
                      <img
                        src={pageImagePath}
                        alt={`Page ${pageNum} of Book ${bookId} - Fullscreen`}
                        className="w-full object-contain"
                        loading={Math.abs(pageNum - pageNumber) <= 5 ? "eager" : "lazy"}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ImageViewer.displayName = 'ImageViewer';

export default ImageViewer;