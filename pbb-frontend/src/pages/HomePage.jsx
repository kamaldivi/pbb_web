import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const HomePage = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookForSummary, setSelectedBookForSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksData = await apiService.getBooks();
      // Sort alphabetically by original_book_title
      const sortedBooks = (booksData?.books || booksData || []).sort((a, b) => {
        const titleA = a.original_book_title || a.english_book_title || '';
        const titleB = b.original_book_title || b.english_book_title || '';
        return titleA.localeCompare(titleB);
      });
      setBooks(sortedBooks);
    } catch (err) {
      console.error('Error loading books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (book) => {
    const bookId = book.id || book._id || book.book_id;
    navigate(`/reader?book_id=${bookId}`);
  };

  const handleShowSummary = async (e, book) => {
    e.stopPropagation(); // Prevent triggering handleBookClick
    setSelectedBookForSummary(book);
  };

  const closeSummaryModal = () => {
    setSelectedBookForSummary(null);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Welcome to Pure Bhakti Base
          </h1>
          <p className="text-lg text-slate-600 mb-8">
            Your gateway to the divine teachings of Śrīla Bhaktivedānta Nārāyaṇa Gosvāmī Mahārāja
          </p>

          {/* Quick Action Cards - Clickable */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {/* Reader Card */}
            <button
              onClick={() => navigate('/reader')}
              className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-200 hover:scale-105 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📖</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Book Reader</h3>
              <p className="text-slate-600">
                Browse and read from our collection of sacred texts
              </p>
            </button>
            {/* Search Card */}
            <button
              onClick={() => navigate('/search')}
              className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all duration-200 hover:scale-105 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Search</h3>
              <p className="text-slate-600">
                Find specific teachings and verses across all books
              </p>
            </button>

            {/* AI Chat Card */}
            <button
              onClick={() => navigate('/chat')}
              className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-200 hover:scale-105 group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">💬</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">AI Chat</h3>
              <p className="text-slate-600">
                Engage in meaningful conversations with AI guidance
              </p>
            </button>

            
          </div>
        </div>
      </div>

      {/* Library Section */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="text-4xl">📚</div>
            <h2 className="text-3xl font-bold text-slate-800">Library Collection</h2>
            {!loading && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                {books.length} Books
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-12">
            <LoadingSpinner size="large" message="Loading library..." />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">Failed to load books: {error}</p>
            <button
              onClick={loadBooks}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {books.map((book) => {
              const bookId = book.id || book._id || book.book_id;
              const bookTitle = book.original_book_title || book.english_book_title || book.title || `Book ${bookId}`;
              const thumbnailPath = `/pbb_book_thumbnails/${bookId}.jpg`;

              return (
                <div
                  key={bookId}
                  onClick={() => handleBookClick(book)}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 hover:scale-105 cursor-pointer overflow-hidden border border-gray-200 group"
                >
                  {/* Thumbnail */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-amber-50 to-orange-50 relative overflow-hidden">
                    <img
                      src={thumbnailPath}
                      alt={bookTitle}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to gradient with book icon if image fails
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-orange-100 hidden items-center justify-center">
                      <svg className="w-16 h-16 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="p-3">
                    <h3 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[2.5rem]">
                      {bookTitle}
                    </h3>
                    {/* Info Button */}
                    <button
                      onClick={(e) => handleShowSummary(e, book)}
                      className="mt-2 w-full px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors flex items-center justify-center space-x-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Book Summary Modal */}
      {selectedBookForSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closeSummaryModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 relative">
              <button
                onClick={closeSummaryModal}
                className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold pr-8">
                {selectedBookForSummary.original_book_title || selectedBookForSummary.english_book_title || selectedBookForSummary.title}
              </h2>
              <div className="text-blue-100 mt-2 space-y-1">
                {selectedBookForSummary.original_author && (
                  <p className="text-sm">
                    <span className="font-medium">Original Author:</span> {selectedBookForSummary.original_author}
                  </p>
                )}
                {selectedBookForSummary.commentary_author && (
                  <p className="text-sm">
                    <span className="font-medium">Commentary Author:</span> {selectedBookForSummary.commentary_author}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
              <div className="flex gap-6">
                {/* Thumbnail */}
                <div className="flex-shrink-0">
                  <img
                    src={`/pbb_book_thumbnails/${selectedBookForSummary.id || selectedBookForSummary._id || selectedBookForSummary.book_id}.jpg`}
                    alt={selectedBookForSummary.original_book_title}
                    className="w-48 h-64 object-cover rounded-lg shadow-lg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>

                {/* Summary */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 mb-3">Book Summary</h3>
                  <div className="prose prose-sm text-slate-600">
                    {selectedBookForSummary.book_summary || selectedBookForSummary.summary || 'No summary available for this book.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200">
              <button
                onClick={closeSummaryModal}
                className="px-4 py-2 text-slate-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  closeSummaryModal();
                  handleBookClick(selectedBookForSummary);
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-md"
              >
                Read Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
