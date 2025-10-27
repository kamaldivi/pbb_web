import { useState } from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';

const ImageViewer = ({ bookId, pageNumber, pageLabel, totalPages, onPageChange }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

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

  const imagePath = `/pbb_book_pages/${bookId}/${pageNumber}.webp`;

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

  return (
    <>
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-3 py-3 border-b border-gray-200 relative">
          <div className="flex items-center justify-center">
            {/* Center-aligned Page Information */}
            <h3 className="text-base font-bold text-slate-800 text-center">
              {pageLabel || `Page ${pageNumber}`}
              {totalPages && (
                <span className="text-sm font-medium text-slate-600 ml-2">
                  (Page {pageNumber} of {totalPages})
                </span>
              )}
            </h3>

            {/* Fullscreen Button - Top Right Corner */}
            <button
              onClick={toggleFullscreen}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-700 hover:bg-slate-800 text-white p-2 rounded-lg shadow-lg transition-all duration-200 hover:scale-110 group"
              title="View fullscreen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Fullscreen
              </span>
            </button>
          </div>
        </div>

        {/* Image Container */}
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

      {/* Fullscreen Modal */}
      {fullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-80 transition-all shadow-lg"
              title="Close fullscreen (Esc)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Previous Page Button */}
            {canGoPrevious && (
              <button
                onClick={handlePreviousPage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-60 text-white p-4 rounded-full hover:bg-opacity-80 transition-all shadow-lg"
                title="Previous page (←)"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Next Page Button */}
            {canGoNext && (
              <button
                onClick={handleNextPage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-60 text-white p-4 rounded-full hover:bg-opacity-80 transition-all shadow-lg"
                title="Next page (→)"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Image */}
            <div className="max-w-[90%] max-h-[90%] flex items-center justify-center">
              <img
                src={imagePath}
                alt={`Page ${pageNumber} of Book ${bookId} - Fullscreen`}
                className="max-w-full max-h-full object-contain"
                style={{ maxHeight: 'calc(100vh - 100px)' }}
              />
            </div>

            {/* Page Info Footer */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-6 py-3 rounded-xl shadow-lg">
              <p className="text-base font-medium">
                {pageLabel || `Page ${pageNumber}`}
                {totalPages && ` of ${totalPages}`}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageViewer;