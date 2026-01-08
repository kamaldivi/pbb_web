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

  const [tocCollapsed, setTocCollapsed] = useState(false);
  const [showTocModal, setShowTocModal] = useState(false);

  useEffect(() => {
    if (platform.isMobile) {
      setTocCollapsed(true);
    }
  }, [platform.isMobile]);

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
    }
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

  const toggleTocModal = () => {
    setShowTocModal(!showTocModal);
  };

  return (
    <div className="space-y-6">
      <div ref={readerAnchorRef} className="scroll-mt-4"></div>

      {/* Mobile: TOC Button (FAB) - Only show when book is selected */}
      {platform.isMobile && selectedBook && (
        <button
          onClick={toggleTocModal}
          className="fixed bottom-[180px] right-6 z-40 bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-200 active:scale-95 flex items-center justify-center"
          title="Table of Contents"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        </button>
      )}

      {selectedBook && (
        <section className="flex flex-col md:flex-row gap-4 md:gap-6 relative">
          {!platform.isMobile && (
            <div className={`transition-all duration-300 relative flex-shrink-0 ${
              tocCollapsed ? 'w-auto' : 'w-full md:w-[30%] md:min-w-[300px]'
            }`}>
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

              {tocCollapsed && (
                <div className="h-full flex items-start pt-0">
                  <button
                    onClick={() => setTocCollapsed(false)}
                    className="relative bg-gradient-to-br from-blue-50/80 via-slate-50/60 to-gray-50/80 border-2 border-blue-300 hover:border-blue-500 rounded-r-xl shadow-lg transition-all duration-200 hover:shadow-xl group flex flex-col items-center py-4 px-2"
                    title="Show Table of Contents"
                  >
                    <div className="w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg mb-2 transition-colors flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="flex flex-col items-center">
                      <svg className="w-5 h-5 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      <div className="writing-mode-vertical text-xs font-bold text-blue-800 tracking-wider" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                        TABLE OF CONTENTS
                      </div>
                    </div>
                    <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-[1000]">
                      Click to show TOC
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col flex-1 relative">
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

            <div ref={viewerContainerRef} className="flex-1 image-viewer-container mb-4">
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

            {!platform.isMobile && currentPage && totalPages > 0 && (
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
        </section>
      )}

      {platform.isMobile && showTocModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60]" onClick={toggleTocModal}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-slide-up" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1 bg-slate-300 rounded-full"></div>
            </div>

            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-slate-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-800">Table of Contents</h3>
              </div>
              <button
                onClick={toggleTocModal}
                className="p-2 active:bg-slate-200 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <TableOfContents
                toc={toc}
                loading={tocLoading}
                error={tocError}
                onPageSelect={handleTocPageSelect}
                currentPage={currentPage}
                onRetry={handleRetryToc}
                onCollapse={null}
              />
            </div>
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