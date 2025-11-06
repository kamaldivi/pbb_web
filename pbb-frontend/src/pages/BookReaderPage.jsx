import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import BookSelector from '../components/shared/BookSelector';
import TableOfContents from '../components/reader/TableOfContents';
import PageNavigation from '../components/reader/PageNavigation';
import ImageViewer from '../components/reader/ImageViewer';
import BookmarkButton from '../components/bookmark/BookmarkButton';

const BookReaderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Ref for reading mode anchor
  const readerAnchorRef = useRef(null);
  // Ref for ImageViewer to control fullscreen
  const imageViewerRef = useRef(null);

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

  // Handle book_id and page from URL parameters (e.g., /reader?book_id=123&page=5)
  useEffect(() => {
    const bookIdFromUrl = searchParams.get('book_id');
    const pageFromUrl = searchParams.get('page');

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

        // If page parameter exists, set it after pages are loaded
        if (pageFromUrl) {
          const pageNum = parseInt(pageFromUrl, 10);
          if (!isNaN(pageNum)) {
            setCurrentPage(pageNum);
          }
        }

        // Scroll to reading mode when book is selected from URL (e.g., from home page or bookmarks)
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

      // Check if there's a page parameter in the URL
      const pageFromUrl = searchParams.get('page');

      if (pageFromUrl) {
        // If page parameter exists, use it
        const pageNum = parseInt(pageFromUrl, 10);
        if (!isNaN(pageNum)) {
          setCurrentPage(pageNum);
        } else {
          // Fallback to first page if invalid
          const firstPage = pagesArray[0]?.page_number || 1;
          setCurrentPage(firstPage);
        }
      } else if (pagesArray && pagesArray.length > 0 && !currentPage) {
        // Only set default page if no page is currently set and no URL param
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

    // Reset current page when selecting a new book
    // (will be set to page 1 when pages load, unless URL has page param)
    setCurrentPage(null);

    // Update URL parameter to reflect new selection (without page param)
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
      {/* Book Selector - Collapsible - COMMENTED OUT FOR FUTURE USE */}
      {/*
      <section className="relative">
        <div
          className={`transition-all duration-300 ${
            bookSelectorCollapsed ? 'max-h-0 opacity-0 overflow-hidden' : 'max-h-[600px] opacity-100 overflow-visible'
          }`}
        >
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
            onCollapse={selectedBook ? () => setBookSelectorCollapsed(true) : null}
          />
        </div>

        {bookSelectorCollapsed && selectedBook && (
          <div className="relative bg-gradient-to-r from-violet-50 to-purple-50 border border-white/20 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setBookSelectorCollapsed(false)}
                className="w-6 h-6 bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center flex-shrink-0"
                title="Show book selector"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <div>
                <p className="text-xs text-slate-600 font-medium">Currently Selected</p>
                <h3 className="text-lg font-bold text-slate-800">
                  {selectedBook?.original_book_title || selectedBook?.english_book_title || selectedBook?.title}
                </h3>
              </div>
            </div>
          </div>
        )}
      </section>
      */}

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
            className={`transition-all duration-300 relative flex-shrink-0 ${
              tocCollapsed ? 'w-auto' : 'w-[30%] min-w-[300px]'
            }`}
          >
            {/* TOC Expanded State */}
            {!tocCollapsed && (
              <TableOfContents
                toc={toc}
                loading={tocLoading}
                error={tocError}
                onPageSelect={handleTocPageSelect}
                currentPage={currentPage}
                onRetry={handleRetryToc}
                onCollapse={() => setTocCollapsed(true)}
              />
            )}

            {/* TOC Collapsed State - Vertical Tab */}
            {tocCollapsed && (
              <div className="h-full flex items-start pt-0">
                <button
                  onClick={() => setTocCollapsed(false)}
                  className="bg-gradient-to-br from-blue-50/80 via-slate-50/60 to-gray-50/80 border-2 border-blue-300 hover:border-blue-500 rounded-r-xl shadow-lg transition-all duration-200 hover:shadow-xl group flex flex-col items-center py-4 px-2"
                  title="Show Table of Contents"
                >
                  {/* Icon */}
                  <div className="w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mb-2 transition-colors flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>

                  {/* Vertical Text */}
                  <div className="flex flex-col items-center">
                    <svg className="w-5 h-5 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    <div className="writing-mode-vertical text-xs font-bold text-blue-800 tracking-wider" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
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
          </div>

          {/* Right Column: Page Navigation + Image Viewer */}
          <div className="flex flex-col flex-1 relative">
            {/* Ultra-Compact Navigation Bar (TOP) */}
            {currentPage && totalPages > 0 && (
              <PageNavigation
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageLabel={pages.find(p => p.page_number === currentPage)?.page_label}
                bookTitle={selectedBook?.original_book_title || selectedBook?.english_book_title || selectedBook?.title}
                bookId={selectedBook?.id}
                pages={pages}
                bookmarkButton={
                  <BookmarkButton
                    bookId={selectedBook?.id}
                    bookTitle={selectedBook?.original_book_title || selectedBook?.english_book_title || selectedBook?.title}
                    pageNumber={currentPage}
                    onBookmarkChange={(data) => {
                      console.log('Bookmark changed:', data);
                    }}
                    compactMode={true}
                  />
                }
                fullscreenButton={
                  <button
                    onClick={() => {
                      imageViewerRef.current?.toggleFullscreen();
                    }}
                    data-tooltip="Fullscreen"
                    className="tooltip-button p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all duration-200 active:scale-95"
                    title="View fullscreen"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                  </button>
                }
              />
            )}

            {/* Page Image Viewer (No Header) */}
            <div className="flex-1 image-viewer-container mb-4">
              <ImageViewer
                ref={imageViewerRef}
                bookId={selectedBook?.id}
                pageNumber={currentPage}
                pageLabel={pages.find(p => p.page_number === currentPage)?.page_label}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>

            {/* Ultra-Compact Navigation Bar (BOTTOM - REPEAT) */}
            {currentPage && totalPages > 0 && (
              <PageNavigation
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                pageLabel={pages.find(p => p.page_number === currentPage)?.page_label}
                bookTitle={selectedBook?.original_book_title || selectedBook?.english_book_title || selectedBook?.title}
                bookId={selectedBook?.id}
                pages={pages}
                bookmarkButton={
                  <BookmarkButton
                    bookId={selectedBook?.id}
                    bookTitle={selectedBook?.original_book_title || selectedBook?.english_book_title || selectedBook?.title}
                    pageNumber={currentPage}
                    onBookmarkChange={(data) => {
                      console.log('Bookmark changed:', data);
                    }}
                    compactMode={true}
                  />
                }
                fullscreenButton={
                  <button
                    onClick={() => {
                      imageViewerRef.current?.toggleFullscreen();
                    }}
                    data-tooltip="Fullscreen"
                    className="tooltip-button p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-all duration-200 active:scale-95"
                    title="View fullscreen"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                    </svg>
                  </button>
                }
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
            <p className="text-lg text-slate-600 mb-6">
              Please select a book from the library to start reading
            </p>
            <Link
              to="/#library"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Browse Library
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookReaderPage;
