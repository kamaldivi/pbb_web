import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiService } from '../services/api';
import { usePlatform } from '../services/usePlatform';
import TableOfContents from '../components/reader/TableOfContents';
import PageNavigation from '../components/reader/PageNavigation';
import ImageViewer from '../components/reader/ImageViewer';
import BookmarkButton from '../components/bookmark/BookmarkButton';

const BookReaderPage = () => {
  const [searchParams] = useSearchParams();
  
  const platform = usePlatform();

  const readerAnchorRef = useRef(null);
  const imageViewerRef = useRef(null);
  const viewerContainerRef = useRef(null);

  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [toc, setToc] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [bookmarkKey, setBookmarkKey] = useState(0);

  const [booksLoading, setBooksLoading] = useState(true);
  const [tocLoading, setTocLoading] = useState(false);
  const [pagesLoading, setPagesLoading] = useState(false);

  const [booksError, setBooksError] = useState(null);
  const [tocError, setTocError] = useState(null);
  const [pagesError, setPagesError] = useState(null);

  const [tocCollapsed, setTocCollapsed] = useState(true); // Start collapsed by default
  const [showTocModal, setShowTocModal] = useState(false);

  // No need to auto-collapse on mobile since it's a modal
  // useEffect removed

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    const bookIdFromUrl = searchParams.get('book_id');
    const pageFromUrl = searchParams.get('page');

    if (bookIdFromUrl && books.length > 0 && !selectedBook) {
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

        if (pageFromUrl) {
          const pageNum = parseInt(pageFromUrl, 10);
          if (!isNaN(pageNum)) {
            setCurrentPage(pageNum);
          }
        }

        setTimeout(() => scrollToReadingMode(), 500);
      }
    }
  }, [searchParams, books, selectedBook]);

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
      const pagesArray = Array.isArray(pagesData)
        ? pagesData
        : (pagesData?.page_maps || pagesData?.pages || pagesData?.data || []);

      setPages(pagesArray);
      setTotalPages(pagesData?.total || pagesArray.length);

      const pageFromUrl = searchParams.get('page');

      if (pageFromUrl) {
        const pageNum = parseInt(pageFromUrl, 10);
        if (!isNaN(pageNum)) {
          setCurrentPage(pageNum);
        } else {
          const firstPage = pagesArray[0]?.page_number || 1;
          setCurrentPage(firstPage);
        }
      } else if (pagesArray && pagesArray.length > 0 && !currentPage) {
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
    }
  };

  const handleTocPageSelect = (pageNumber) => {
    setCurrentPage(pageNumber);
    setBookmarkKey(prev => prev + 1);
    
    // Hide TOC after selecting a page
    if (platform.isMobile) {
      setShowTocModal(false);
      setTimeout(() => {
        if (viewerContainerRef.current) {
          viewerContainerRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } else {
      setTocCollapsed(true);
    }
  };

  const toggleTocModal = () => {
    setShowTocModal(!showTocModal);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setBookmarkKey(prev => prev + 1);
    if (!platform.isMobile) {
      setTimeout(() => scrollToReadingMode(), 100);
    }
  };

  const handleRetryToc = () => {
    if (selectedBook) {
      loadTOC(selectedBook.id);
    }
  };

  return (
    <div className="space-y-6">
      <div ref={readerAnchorRef} className="scroll-mt-4"></div>

      {/* Mobile & Desktop: TOC Button */}
      {selectedBook && (
        <>
          {/* Desktop Layout */}
          {!platform.isMobile && (
            <section className="space-y-4">
              <div className="flex items-start gap-4">
                {/* TOC Toggle Button */}
                <button
                  onClick={() => setTocCollapsed(!tocCollapsed)}
                  className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center"
                  title={tocCollapsed ? "Show Table of Contents" : "Hide Table of Contents"}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </button>

                {/* Main Content Column */}
                <div className="flex-1 min-w-0">
                  {/* Page Navigation */}
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
                          key={`bookmark-top-${bookmarkKey}`}
                          bookId={selectedBook?.id}
                          bookTitle={selectedBook?.original_book_title || selectedBook?.english_book_title || selectedBook?.title}
                          pageNumber={currentPage}
                          onBookmarkChange={(data) => {
                            console.log('Bookmark changed:', data);
                            setBookmarkKey(prev => prev + 1);
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
                          className="tooltip-button p-2 rounded-lg text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 active:scale-95"
                          title="View fullscreen"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                          </svg>
                        </button>
                      }
                    />
                  )}

                  {/* Image Viewer */}
                  <div ref={viewerContainerRef} className="image-viewer-container mb-4">
                    <ImageViewer
                      ref={imageViewerRef}
                      bookId={selectedBook?.id}
                      pageNumber={currentPage}
                      pageLabel={pages.find(p => p.page_number === currentPage)?.page_label}
                      totalPages={totalPages}
                      pages={pages}
                      onPageChange={handlePageChange}
                    />
                  </div>

                  {/* Bottom Page Navigation */}
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
                          key={`bookmark-bottom-${bookmarkKey}`}
                          bookId={selectedBook?.id}
                          bookTitle={selectedBook?.original_book_title || selectedBook?.english_book_title || selectedBook?.title}
                          pageNumber={currentPage}
                          onBookmarkChange={(data) => {
                            console.log('Bookmark changed:', data);
                            setBookmarkKey(prev => prev + 1);
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
              </div>
            </section>
          )}

          {/* Mobile Layout - Matching Desktop Style */}
          {platform.isMobile && (
            <section className="space-y-4">
              <div className="flex items-start gap-2">
                {/* TOC Toggle Button - Same style as desktop */}
                <button
                  onClick={() => setShowTocModal(!showTocModal)}
                  className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 active:from-blue-700 active:to-blue-800 text-white rounded-xl shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center"
                  title={showTocModal ? "Hide Table of Contents" : "Show Table of Contents"}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </button>

                {/* Main Content Column */}
                <div className="flex-1 min-w-0">
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
                          key={`bookmark-top-${bookmarkKey}`}
                          bookId={selectedBook?.id}
                          bookTitle={selectedBook?.original_book_title || selectedBook?.english_book_title || selectedBook?.title}
                          pageNumber={currentPage}
                          onBookmarkChange={(data) => {
                            console.log('Bookmark changed:', data);
                            setBookmarkKey(prev => prev + 1);
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
                          className="tooltip-button p-2 rounded-lg text-blue-600 hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 active:scale-95"
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
              </div>

              {/* Image Viewer - Full width below the TOC button + Nav bar row */}
              <div ref={viewerContainerRef} className="image-viewer-container">
                <ImageViewer
                  ref={imageViewerRef}
                  bookId={selectedBook?.id}
                  pageNumber={currentPage}
                  pageLabel={pages.find(p => p.page_number === currentPage)?.page_label}
                  totalPages={totalPages}
                  pages={pages}
                  onPageChange={handlePageChange}
                />
              </div>
            </section>
          )}
        </>
      )}

      {/* Desktop: TOC Overlay Modal (when toggled on) */}
      {!platform.isMobile && selectedBook && !tocCollapsed && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-start p-4 pt-24" onClick={() => setTocCollapsed(true)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[calc(100vh-8rem)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <TableOfContents
              toc={toc}
              loading={tocLoading}
              error={tocError}
              onPageSelect={handleTocPageSelect}
              currentPage={currentPage}
              onRetry={handleRetryToc}
              onCollapse={() => setTocCollapsed(true)}
            />
          </div>
        </div>
      )}

      {/* Mobile: TOC Overlay Modal (matching desktop style) */}
      {platform.isMobile && showTocModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-start p-4 pt-24" onClick={() => setShowTocModal(false)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[calc(100vh-8rem)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <TableOfContents
              toc={toc}
              loading={tocLoading}
              error={tocError}
              onPageSelect={handleTocPageSelect}
              currentPage={currentPage}
              onRetry={handleRetryToc}
              onCollapse={() => setShowTocModal(false)}
            />
          </div>
        </div>
      )}

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
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
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