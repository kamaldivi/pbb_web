import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import BookSlider from '../components/book/BookSlider';
import PageSelector from '../components/reader/PageSelector';
import ImageViewer from '../components/reader/ImageViewer';
import ContentDisplay from '../components/reader/ContentDisplay';

function TestbedPage() {
  // State management
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);
  const [pageContent, setPageContent] = useState(null);

  // Loading states
  const [booksLoading, setBooksLoading] = useState(true);
  const [pagesLoading, setPagesLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);

  // Error states
  const [booksError, setBooksError] = useState(null);
  const [pagesError, setPagesError] = useState(null);
  const [contentError, setContentError] = useState(null);

  // Load books on mount
  useEffect(() => {
    loadBooks();
  }, []);

  // Load pages when book changes
  useEffect(() => {
    if (selectedBook) {
      loadPages(selectedBook.id);
    } else {
      setPages([]);
      setSelectedPage(null);
      setPageContent(null);
    }
  }, [selectedBook]);

  // Load content when page changes
  useEffect(() => {
    if (selectedBook && selectedPage) {
      loadPageContent(selectedBook.id, selectedPage.page_number);
    } else {
      setPageContent(null);
    }
  }, [selectedBook, selectedPage]);

  const loadBooks = async () => {
    try {
      setBooksLoading(true);
      setBooksError(null);
      const booksData = await apiService.getBooks();
      setBooks(booksData);
    } catch (error) {
      console.error('Error loading books:', error);
      setBooksError(error.message);
    } finally {
      setBooksLoading(false);
    }
  };

  const loadPages = async (bookId) => {
    try {
      setPagesLoading(true);
      setPagesError(null);
      setSelectedPage(null);
      console.log('Loading pages for book ID:', bookId);
      const pagesData = await apiService.getBookPages(bookId);
      console.log('Pages data received:', pagesData);
      setPages(pagesData);

      // Extract pages array from response
      const pagesArray = Array.isArray(pagesData) ? pagesData : (pagesData?.page_maps || pagesData?.pages || pagesData?.data || []);
      console.log('Pages array extracted:', pagesArray);

      // Auto-select first page if available
      if (pagesArray && pagesArray.length > 0) {
        const sortedPages = [...pagesArray].sort((a, b) => {
          const aNum = parseInt(a.page_number) || 0;
          const bNum = parseInt(b.page_number) || 0;
          return aNum - bNum;
        });
        console.log('Auto-selecting first page:', sortedPages[0]);
        setSelectedPage(sortedPages[0]);
      }
    } catch (error) {
      console.error('Error loading pages:', error);
      setPagesError(error.message);
    } finally {
      setPagesLoading(false);
    }
  };

  const loadPageContent = async (bookId, pageNumber) => {
    try {
      setContentLoading(true);
      setContentError(null);
      const contentData = await apiService.getPageContent(bookId, pageNumber);
      setPageContent(contentData);
    } catch (error) {
      console.error('Error loading page content:', error);
      setContentError(error.message);
    } finally {
      setContentLoading(false);
    }
  };

  const handleBookSelect = (book) => {
    console.log('App: Book selected:', book);
    // Ensure the book has an id field for consistency
    const bookWithId = {
      ...book,
      id: book.id || book._id || book.book_id
    };
    setSelectedBook(bookWithId);
  };

  const handlePageSelect = (page) => {
    setSelectedPage(page);
  };

  const handleRetryBooks = () => {
    loadBooks();
  };

  const handleRetryPages = () => {
    if (selectedBook) {
      loadPages(selectedBook.id);
    }
  };

  const handleRetryContent = () => {
    if (selectedBook && selectedPage) {
      loadPageContent(selectedBook.id, selectedPage.page_number);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Section - Book Slider */}
      <section>
        <BookSlider
          books={books}
          loading={booksLoading}
          error={booksError}
          selectedBookId={selectedBook?.id}
          onBookSelect={handleBookSelect}
          onRetry={handleRetryBooks}
        />
      </section>

      {/* Bottom Section - Three Columns */}
      <section className="flex gap-4 min-h-[700px]">
        {/* Column 1: Page Selector - 10% width */}
        <div className="w-[10%] min-w-[120px]">
          <PageSelector
            pages={pages}
            loading={pagesLoading}
            error={pagesError}
            selectedPage={selectedPage}
            onPageSelect={handlePageSelect}
            onRetry={handleRetryPages}
          />
        </div>

        {/* Column 2: Image Viewer - 45% width */}
        <div className="w-[45%]">
          <ImageViewer
            bookId={selectedBook?.id}
            pageNumber={selectedPage?.page_number}
            pageLabel={selectedPage?.page_label}
          />
        </div>

        {/* Column 3: Content Display - 45% width */}
        <div className="w-[45%]">
          <ContentDisplay
            content={pageContent}
            loading={contentLoading}
            error={contentError}
            bookId={selectedBook?.id}
            pageNumber={selectedPage?.page_number}
            pageLabel={selectedPage?.page_label}
            onRetry={handleRetryContent}
          />
        </div>
      </section>
    </div>
  );
}

export default TestbedPage;
