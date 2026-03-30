import { useState, useEffect, useRef } from 'react';
import { apiService } from '../services/api';

function TestBedPage() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [pages, setPages] = useState([]);
  const [toc, setToc] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formatType, setFormatType] = useState('plain'); // 'plain' or 'html'
  const tocContainerRef = useRef(null);

  // Fetch english-gurudev books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await apiService.getBooks();
        console.log('Books response:', response);
        const englishGurudevBooks = response.books.filter(
          book => book.book_type === 'english-gurudev'
        );
        console.log('Filtered english-gurudev books:', englishGurudevBooks);
        // Check first book's structure to find correct ID field
        if (englishGurudevBooks.length > 0) {
          console.log('Sample book structure:', englishGurudevBooks[0]);
          console.log('book.id:', englishGurudevBooks[0].id);
          console.log('book.book_id:', englishGurudevBooks[0].book_id);
          console.log('book._id:', englishGurudevBooks[0]._id);
        }
        // Sort alphabetically by pdf_name
        const sortedBooks = englishGurudevBooks.sort((a, b) => {
          const nameA = (a.pdf_name || '').toLowerCase();
          const nameB = (b.pdf_name || '').toLowerCase();
          return nameA.localeCompare(nameB);
        });
        setBooks(sortedBooks);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books');
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Fetch pages and TOC when book is selected
  useEffect(() => {
    if (!selectedBook) {
      console.log('No book selected, skipping page fetch');
      return;
    }

    console.log('Fetching pages and TOC for book:', selectedBook);
    const fetchPagesAndTOC = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use book_id if available, otherwise fall back to id
        const bookIdToUse = selectedBook.book_id || selectedBook.id;
        console.log('Using book ID for pages fetch:', bookIdToUse);

        // Fetch both pages and TOC in parallel
        const [pagesResponse, tocResponse] = await Promise.all([
          apiService.getBookPages(bookIdToUse),
          apiService.getBookTOC(bookIdToUse)
        ]);

        console.log('Pages response:', pagesResponse);
        console.log('TOC response:', tocResponse);
        console.log('TOC response type:', typeof tocResponse, 'Is array:', Array.isArray(tocResponse));

        // Extract pages array from response
        const pagesArray = Array.isArray(pagesResponse)
          ? pagesResponse
          : (pagesResponse?.page_maps || pagesResponse?.pages || pagesResponse?.data || []);
        console.log('Extracted pages array:', pagesArray);

        // Extract TOC array from response - handle various response structures
        let tocArray = [];
        if (Array.isArray(tocResponse)) {
          tocArray = tocResponse;
        } else if (tocResponse?.table_of_contents && Array.isArray(tocResponse.table_of_contents)) {
          tocArray = tocResponse.table_of_contents;
        } else if (tocResponse?.toc && Array.isArray(tocResponse.toc)) {
          tocArray = tocResponse.toc;
        } else if (tocResponse?.data && Array.isArray(tocResponse.data)) {
          tocArray = tocResponse.data;
        }

        console.log('Extracted TOC array:', tocArray);
        console.log('TOC array length:', tocArray.length);
        if (tocArray.length > 0) {
          console.log('First TOC item:', tocArray[0]);
        }

        setPages(pagesArray);
        setToc(tocArray);
        setCurrentPage(1);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching pages/TOC:', err);
        setError('Failed to load pages');
        setLoading(false);
      }
    };
    fetchPagesAndTOC();
  }, [selectedBook]);

  // Fetch page content when page changes
  useEffect(() => {
    if (!selectedBook || !currentPage) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        // Use book_id if available, otherwise fall back to id
        const bookIdToUse = selectedBook.book_id || selectedBook.id;
        console.log('Fetching content for book:', bookIdToUse, 'page:', currentPage);
        const response = await apiService.getPageContent(bookIdToUse, currentPage);
        console.log('Content response:', response);
        setPageContent(response);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(`Failed to load content for page ${currentPage}`);
        setPageContent(null);
        setLoading(false);
      }
    };
    fetchContent();
  }, [selectedBook, currentPage]);

  const handleBookChange = (e) => {
    console.log('Book selection changed, value:', e.target.value);
    const bookId = e.target.value;
    console.log('Book ID:', bookId);

    // Try to find book by book_id first, then id
    const book = books.find(b =>
      b.book_id == bookId ||
      b.id == bookId ||
      String(b.book_id) === String(bookId) ||
      String(b.id) === String(bookId)
    );
    console.log('Selected book:', book);

    if (!book) {
      console.error('Book not found! Available books:', books);
      return;
    }

    setSelectedBook(book);
    setPageContent(null);
    setError(null);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages.length) {
      setCurrentPage(newPage);
    }
  };

  const handleTOCClick = (pageNum) => {
    // Save current scroll position
    const scrollPosition = tocContainerRef.current?.scrollTop;

    setCurrentPage(pageNum);

    // Restore scroll position after state update
    if (tocContainerRef.current && scrollPosition !== undefined) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        if (tocContainerRef.current) {
          tocContainerRef.current.scrollTop = scrollPosition;
        }
      });
    }
  };

  const currentPageData = pages.find(p => p.page_number === currentPage);

  return (
    <div className="min-h-screen bg-slate-50 p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Test Bed - Content Review</h1>

        {/* Book Selection and Format Type */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Book Selection */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Book (English - Gurudev)
              </label>
              <select
                value={selectedBook?.book_id || selectedBook?.id || ''}
                onChange={handleBookChange}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select a Book --</option>
                {books.map(book => (
                  <option key={book.book_id || book.id} value={book.book_id || book.id}>
                    {book.pdf_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Format Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Format Type
              </label>
              <div className="flex gap-4 pb-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="formatType"
                    value="plain"
                    checked={formatType === 'plain'}
                    onChange={(e) => setFormatType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700">Plain Text</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="formatType"
                    value="html"
                    checked={formatType === 'html'}
                    onChange={(e) => setFormatType(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm text-slate-700">HTML</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Page Controls */}
        {selectedBook && (
          <div className="bg-white rounded-lg shadow p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= pages.length}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
              >
                Next
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-medium">
                Page {currentPage} of {pages.length}
              </span>
              <span className="text-slate-500">|</span>
              <input
                type="number"
                min="1"
                max={pages.length}
                value={currentPage}
                onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                className="w-20 px-2 py-1 border border-slate-300 rounded text-center"
              />
              <button
                onClick={() => handlePageChange(currentPage)}
                className="px-3 py-1 bg-slate-600 text-white rounded hover:bg-slate-700 transition"
              >
                Go
              </button>
            </div>

            {currentPageData?.page_label && (
              <div className="text-sm text-slate-600">
                Label: <span className="font-medium">{currentPageData.page_label}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* 3-Column Layout */}
      {selectedBook && !loading && (
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-280px)]">
          {/* Column 1: Table of Contents */}
          <div ref={tocContainerRef} className="col-span-2 bg-white rounded-lg shadow p-4 overflow-y-auto">
            <h3 className="font-bold text-slate-800 mb-3 sticky top-0 bg-white pb-2 border-b">
              Table of Contents
            </h3>
            <div className="space-y-1 mt-2">
              {toc && toc.length > 0 ? (
                toc.map((item, index) => (
                  <button
                    key={item.toc_id || index}
                    onClick={() => handleTOCClick(item.page_number)}
                    className={`w-full text-left px-2 py-1.5 rounded transition text-xs ${
                      currentPage === item.page_number
                        ? 'bg-blue-600 text-white font-medium'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                    style={{ paddingLeft: `${(item.toc_level || 1) * 8}px` }}
                  >
                    <div className="font-medium truncate leading-tight" title={item.toc_label || item.title}>
                      {item.toc_label || item.title}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center text-slate-500 py-4 text-sm">
                  No table of contents available
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Page Image */}
          <div className="col-span-5 bg-white rounded-lg shadow p-4 overflow-y-auto">
            <h3 className="font-bold text-slate-800 mb-3">Page Image</h3>
            {selectedBook && currentPage ? (
              <div className="flex justify-center">
                <img
                  src={`/pbb_book_pages/${selectedBook.book_id || selectedBook.id}/${currentPage}.webp`}
                  alt={`Page ${currentPage}`}
                  className="max-w-full h-auto border border-slate-200 rounded"
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <div style={{display: 'none'}} className="text-center text-slate-500 py-8">
                  Image not found for this page
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 py-8">
                No image available for this page
              </div>
            )}
          </div>

          {/* Column 3: Extracted Text */}
          <div className="col-span-5 bg-white rounded-lg shadow p-4 overflow-y-auto">
            <h3 className="font-bold text-slate-800 mb-3">
              {formatType === 'html' ? 'Extracted Text - Auto Formatted' : 'Extracted Text'}
            </h3>
            {(() => {
              // Get content based on format type
              const content = formatType === 'html'
                ? (pageContent?.content?.ai_page_content || pageContent?.ai_page_content)
                : (pageContent?.content?.page_content || pageContent?.page_content);

              if (content) {
                // Render HTML format
                if (formatType === 'html') {
                  return (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  );
                }

                // Render plain text format
                return (
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded border border-slate-200">
                      {content}
                    </pre>
                  </div>
                );
              }

              return (
                <div className="text-center text-slate-500 py-8">
                  {pageContent ? (
                    <div>
                      <p className="mb-2 text-red-600">{pageContent.message || 'No content available for this page'}</p>
                      <details className="text-left max-w-2xl mx-auto">
                        <summary className="cursor-pointer text-xs text-blue-600 hover:text-blue-800">Show API Response</summary>
                        <pre className="text-xs mt-2 bg-slate-100 p-2 rounded overflow-auto max-h-96">
                          {JSON.stringify(pageContent, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ) : 'Loading content...'}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Initial State */}
      {!selectedBook && !loading && (
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">Select a book from the dropdown above to begin</p>
        </div>
      )}
    </div>
  );
}

export default TestBedPage;
