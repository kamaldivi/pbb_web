import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiService } from '../services/api';
import BookSelector from '../components/shared/BookSelector';
import TableOfContents from '../components/reader/TableOfContents';
import PageNavigation from '../components/reader/PageNavigation';
import ImageViewer from '../components/reader/ImageViewer';

const BookReaderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Ref for reading mode anchor
  const readerAnchorRef = useRef(null);

  // State management
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [toc, setToc] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  // Loading states
  const [booksLoading, setBooksLoading] = useState(true);
  const [tocLoading, setTocLoading] = useState(false);
  const [pagesLoading, setPagesLoading] = useState(false);

  // Error states
  const [booksError, setBooksError] = useState(null);
  const [tocError, setTocError] = useState(null);
  const [pagesError, setPagesError] = useState(null);

  // UI state
  const [bookSelectorCollapsed, setBookSelectorCollapsed] = useState(false);
  const [tocCollapsed, setTocCollapsed] = useState(false);
  const [showTopTab, setShowTopTab] = useState(false);

  // Load books on mount
  useEffect(() => {
    loadBooks();
  }, []);

  // Handle book_id from URL parameter (e.g., /reader?book_id=123)
  useEffect(() => {
    const bookIdFromUrl = searchParams.get('book_id');

    if (bookIdFromUrl && books.length > 0 && !selectedBook) {
      // Find the book in the loaded books list
      const book = books.find(b => {
        const id = String(b.id || b._id || b.book_id);
        return id === String(bookIdFromUrl);
      });

      if (book) {
        const bookWithId = {
          ...book,
          id: book.id || book._id || book.book_id
        };
        setSelectedBook(bookWithId);
        setBookSelectorCollapsed(true); // Auto-collapse book selector
        // Scroll to reading mode when book is selected from URL (e.g., from home page)
        setTimeout(() => scrollToReadingMode(), 500);
      }
    }
  }, [searchParams, books, selectedBook]);

  // Load TOC and pages when book changes
  useEffect(() => {
    if (selectedBook) {
      loadTOC(selectedBook.id);
      loadPages(selectedBook.id);
    } else {
      setToc(null);
      setPages([]);
      setCurrentPage(null);
      setTotalPages(0);
    }
  }, [selectedBook]);

  const loadBooks = async () => {
    try {
      setBooksLoading(true);
      setBooksError(null);
      const booksData = await apiService.getBooks();

      // Extract books array from response
      const booksArray = Array.isArray(booksData) ? booksData : (booksData?.books || []);
      setBooks(booksArray);
    } catch (error) {
      console.error('Error loading books:', error);
      setBooksError(error.message);
    } finally {
      setBooksLoading(false);
    }
  };

  const loadTOC = async (bookId) => {
    try {
      setTocLoading(true);
      setTocError(null);
      const tocData = await apiService.getBookTOC(bookId);
      setToc(tocData);
    } catch (error) {
      console.error('Error loading TOC:', error);
      setTocError(error.message);
    } finally {
      setTocLoading(false);
    }
  };

  const loadPages = async (bookId) => {
    try {
      setPagesLoading(true);
      setPagesError(null);
      const pagesData = await apiService.getBookPages(bookId);

      // Extract pages array from response - API returns page_maps array
      const pagesArray = Array.isArray(pagesData)
        ? pagesData
        : (pagesData?.page_maps || pagesData?.pages || pagesData?.data || []);

      setPages(pagesArray);
      setTotalPages(pagesData?.total || pagesArray.length);

      // Always default to page 1 when a book is selected
      // User can navigate using forward/previous buttons or TOC
      if (pagesArray && pagesArray.length > 0) {
        // Find the first page in the array (may not be page_number 1)
        const firstPage = pagesArray[0]?.page_number || 1;
        setCurrentPage(firstPage);
      }
    } catch (error) {
      console.error('Error loading pages:', error);
      setPagesError(error.message);
    } finally {
      setPagesLoading(false);
    }
  };

  const scrollToReadingMode = () => {
    if (readerAnchorRef.current) {
      readerAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowTopTab(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setShowTopTab(false);
  };

  const handleBookSelect = (book) => {
    const bookWithId = {
      ...book,
      id: book.id || book._id || book.book_id
    };
    setSelectedBook(bookWithId);

    // Update URL parameter to reflect new selection
    setSearchParams({ book_id: bookWithId.id });

    // Scroll to reading mode after book selection
    setTimeout(() => scrollToReadingMode(), 300);
  };

  const handleTocPageSelect = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to reading mode after page navigation
    setTimeout(() => scrollToReadingMode(), 100);
  };

  const handleRetryBooks = () => {
    loadBooks();
  };

  const handleRetryToc = () => {
    if (selectedBook) {
      loadTOC(selectedBook.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Book Selector - Collapsible */}
      <section className="relative">
        {/* Book Selector Content */}
        <div
          className={`transition-all duration-300 overflow-hidden ${
            bookSelectorCollapsed ? 'max-h-0 opacity-0' : 'max-h-[600px] opacity-100'
          }`}
        >
          <div className="relative">
            <BookSelector
              books={books}
              loading={booksLoading}
              error={booksError}
              selectedBooks={selectedBook}
              onBookSelect={handleBookSelect}
              multiSelect={false}
              showSearch={true}
              showAlphabet={true}
              onRetry={handleRetryBooks}
            />
            {/* Collapse Toggle Button - Top Right Corner Inside Panel */}
            {selectedBook && !bookSelectorCollapsed && (
              <button
                onClick={() => setBookSelectorCollapsed(true)}
                className="absolute top-4 right-4 bg-violet-600 hover:bg-violet-700 text-white p-2.5 rounded-lg shadow-lg transition-all duration-200 hover:scale-110 group"
                title="Hide book selector"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Hide Selector
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsed State - Show Selected Book */}
        {bookSelectorCollapsed && selectedBook && (
          <div className="relative bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-300 rounded-2xl p-4 shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-medium">Currently Selected</p>
                  <h3 className="text-lg font-bold text-slate-800">
                    {selectedBook?.original_book_title || selectedBook?.english_book_title || selectedBook?.title}
                  </h3>
                </div>
              </div>
              {/* Expand Button */}
              <button
                onClick={() => setBookSelectorCollapsed(false)}
                className="bg-violet-600 hover:bg-violet-700 text-white p-2.5 rounded-lg shadow-lg transition-all duration-200 hover:scale-110 group"
                title="Show book selector"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Show Selector
                </span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Reading Mode Anchor Point */}
      <div ref={readerAnchorRef} className="scroll-mt-4"></div>

      {/* "Top" Side Tab - Shows when in reading mode */}
      {showTopTab && (
        <div className="fixed top-1/2 right-0 -translate-y-1/2 z-50">
          <button
            onClick={scrollToTop}
            className="bg-gradient-to-l from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-2xl transition-all duration-300 hover:shadow-blue-500/50 rounded-l-xl flex flex-col items-center py-6 px-3 group"
            title="Back to top"
          >
            {/* Icon */}
            <div className="bg-white/20 hover:bg-white/30 p-2 rounded-lg mb-2 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </div>

            {/* Vertical Text */}
            <div className="flex flex-col items-center">
              <div className="text-sm font-bold tracking-wider mb-1" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                TOP
              </div>
            </div>

            {/* Hover Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
              Back to Top
            </span>
          </button>
        </div>
      )}

      {/* Two Column Layout: TOC + Page Viewer */}
      {selectedBook && (
        <section className="flex gap-6 relative">
          {/* Left Column: Table of Contents - Collapsible */}
          <div
            className={`transition-all duration-300 relative ${
              tocCollapsed ? 'w-0 min-w-0 opacity-0' : 'w-[30%] min-w-[300px] opacity-100'
            }`}
            style={{ overflow: tocCollapsed ? 'hidden' : 'visible' }}
          >
            <TableOfContents
              toc={toc}
              loading={tocLoading}
              error={tocError}
              onPageSelect={handleTocPageSelect}
              currentPage={currentPage}
              onRetry={handleRetryToc}
            />
            {/* TOC Hide Button - Top Right Corner Inside TOC Panel */}
            {!tocCollapsed && (
              <button
                onClick={() => setTocCollapsed(true)}
                className="absolute top-2 right-4 z-20 bg-amber-600 hover:bg-amber-700 text-white p-2.5 rounded-lg shadow-lg transition-all duration-200 hover:scale-110 group"
                title="Hide Table of Contents"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Hide TOC
                </span>
              </button>
            )}
          </div>

          {/* Right Column: Page Navigation + Image Viewer - Expands when TOC collapsed */}
          <div
            className={`flex flex-col transition-all duration-300 relative ${
              tocCollapsed ? 'w-full' : 'w-[70%]'
            }`}
          >
            {/* TOC Show Button - When Collapsed (Vertical Tab) */}
            {tocCollapsed && (
              <div className="absolute top-0 left-0 z-20 h-full flex items-start pt-20">
                <button
                  onClick={() => setTocCollapsed(false)}
                  className="bg-gradient-to-br from-amber-50/80 via-orange-50/60 to-yellow-50/80 border-2 border-amber-300 hover:border-amber-500 rounded-r-xl shadow-lg transition-all duration-200 hover:shadow-xl group flex flex-col items-center py-4 px-2"
                  title="Show Table of Contents"
                >
                  {/* Icon */}
                  <div className="bg-amber-600 hover:bg-amber-700 text-white p-2 rounded-lg mb-2 transition-colors">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>

                  {/* Vertical Text */}
                  <div className="flex flex-col items-center">
                    <svg className="w-5 h-5 text-amber-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <div className="writing-mode-vertical text-xs font-bold text-amber-800 tracking-wider" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                      TABLE OF CONTENTS
                    </div>
                  </div>

                  {/* Hover Tooltip */}
                  <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                    Click to show TOC
                  </span>
                </button>
              </div>
            )}
            {/* Debug Info */}
            {console.log('PageNavigation render check - currentPage:', currentPage, 'totalPages:', totalPages, 'condition:', !!(currentPage && totalPages > 0))}

            {/* Top Page Navigation Controls */}
            {currentPage && totalPages > 0 && (
              <PageNavigation
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                bookTitle={selectedBook?.original_book_title || selectedBook?.english_book_title || selectedBook?.title}
              />
            )}

            {/* Show warning if navigation should appear but doesn't */}
            {!currentPage || totalPages === 0 ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                ⚠️ Debug: currentPage={JSON.stringify(currentPage)}, totalPages={totalPages}
              </div>
            ) : null}

            {/* Page Image Viewer */}
            <div className="flex-1">
              <ImageViewer
                bookId={selectedBook?.id}
                pageNumber={currentPage}
                pageLabel={pages.find(p => p.page_number === currentPage)?.page_label || `Page ${currentPage}`}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

            {/* Bottom Page Navigation Controls - Repeat for convenience */}
            {currentPage && totalPages > 0 && (
              <PageNavigation
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                bookTitle={selectedBook?.original_book_title || selectedBook?.english_book_title || selectedBook?.title}
              />
            )}
          </div>
        </section>
      )}

      {/* Empty State */}
      {!selectedBook && !booksLoading && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-white/20">
          <div className="text-center">
            <div className="text-6xl mb-6">📖</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Book Reader</h2>
            <p className="text-lg text-slate-600">
              Select a book above to start reading
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReaderPage;
