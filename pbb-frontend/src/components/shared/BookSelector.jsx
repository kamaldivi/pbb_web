import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const BookSelector = ({
  books = [],
  selectedBooks = [],
  onBookSelect,
  loading = false,
  error = null,
  multiSelect = false,
  showSearch = true,
  showAlphabet = true,
  placeholder = 'Select books...',
  className = '',
  onRetry,
  onCollapse
}) => {
  const [activeTab, setActiveTab] = useState('A');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className={`w-full bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-6 ${className}`}>
        <LoadingSpinner size="large" message="Loading books..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`w-full bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-6 ${className}`}>
        <ErrorMessage error={error} onRetry={onRetry} />
      </div>
    );
  }

  // Ensure books is an array
  const booksArray = Array.isArray(books) ? books : (books?.books || books?.data || []);

  if (!booksArray || booksArray.length === 0) {
    return (
      <div className={`w-full bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-6 ${className}`}>
        <div className="text-center text-gray-500">No books available</div>
      </div>
    );
  }

  const getBookId = (book) => {
    return book.id || book._id || book.book_id;
  };

  const getBookTitle = (book) => {
    return book.original_book_title || book.english_book_title || book.title || book.name || `Book ${getBookId(book) || 'Unknown'}`;
  };

  // Function to normalize transliterated characters to their base English letters
  const normalizeToEnglishLetter = (char) => {
    const charMap = {
      'Ā': 'A', 'ā': 'A', 'Ī': 'I', 'ī': 'I', 'Ū': 'U', 'ū': 'U',
      'Ś': 'S', 'ś': 'S', 'Ṣ': 'S', 'ṣ': 'S', 'Ṭ': 'T', 'ṭ': 'T',
      'Ḍ': 'D', 'ḍ': 'D', 'Ṅ': 'N', 'ṅ': 'N', 'Ñ': 'N', 'ñ': 'N',
      'Ḥ': 'H', 'ḥ': 'H', 'Ṁ': 'M', 'ṁ': 'M', 'Ṛ': 'R', 'ṛ': 'R',
      'Ḷ': 'L', 'ḷ': 'L', 'Ṇ': 'N', 'ṇ': 'N'
    };

    const upperChar = char.toUpperCase();
    return charMap[upperChar] || (upperChar.match(/[A-Z]/) ? upperChar : '#');
  };

  // Group books by first letter (normalized)
  const groupedBooks = booksArray.reduce((groups, book) => {
    const title = getBookTitle(book);
    const firstLetter = title.charAt(0);
    const normalizedLetter = normalizeToEnglishLetter(firstLetter);

    if (!groups[normalizedLetter]) {
      groups[normalizedLetter] = [];
    }
    groups[normalizedLetter].push(book);
    return groups;
  }, {});

  // Sort books within each group
  Object.keys(groupedBooks).forEach(letter => {
    groupedBooks[letter].sort((a, b) => getBookTitle(a).localeCompare(getBookTitle(b)));
  });

  // Get available tabs (letters that have books)
  const availableTabs = Object.keys(groupedBooks).sort();

  const handleBookClick = (book) => {
    if (multiSelect) {
      const bookId = getBookId(book);
      const isSelected = selectedBooks.some(b => getBookId(b) === bookId);

      if (isSelected) {
        onBookSelect(selectedBooks.filter(b => getBookId(b) !== bookId));
      } else {
        onBookSelect([...selectedBooks, book]);
      }
    } else {
      onBookSelect(book);
    }
  };

  const isBookSelected = (book) => {
    const bookId = getBookId(book);
    if (multiSelect) {
      return selectedBooks.some(b => getBookId(b) === bookId);
    }
    return selectedBooks && getBookId(selectedBooks) === bookId;
  };

  // If search term exists, show search results instead of tab content
  const getDisplayBooks = () => {
    if (searchTerm) {
      return booksArray.filter(book =>
        getBookTitle(book).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return groupedBooks[activeTab] || [];
  };

  const displayBooks = getDisplayBooks();

  return (
    <div className={`w-full bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="flex items-center space-x-3">
          {/* Collapse Button */}
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="w-6 h-6 bg-violet-600 hover:bg-violet-700 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center flex-shrink-0"
              title="Hide book selector"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
              </svg>
            </button>
          )}
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold text-slate-800">
              {multiSelect ? 'Select Books' : 'Select a Book'}
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 text-violet-800 border border-violet-300">
              {booksArray.length}
            </span>
          </div>
        </div>
      </div>

      {/* Search Box */}
      {showSearch && (
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-4 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all duration-200 placeholder-slate-400"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-slate-100 rounded-r-xl transition-colors"
              >
                <svg className="h-5 w-5 text-slate-400 hover:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      {showAlphabet && !searchTerm && (
        <div className="mb-6">
          <div className="bg-slate-50/50 rounded-xl p-2">
            <nav className="flex flex-wrap gap-1">
              {availableTabs.map((letter) => (
                <button
                  key={letter}
                  onClick={() => setActiveTab(letter)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === letter
                      ? 'bg-white shadow-sm text-violet-700 ring-1 ring-violet-200'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-white/50'
                  }`}
                >
                  {letter} <span className="text-xs opacity-70">({groupedBooks[letter].length})</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Search Results Header */}
      {searchTerm && (
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            {displayBooks.length} book{displayBooks.length !== 1 ? 's' : ''} found for "{searchTerm}"
          </p>
        </div>
      )}

      {/* Books List */}
      <div className="max-h-80 overflow-y-auto">
        {displayBooks.length > 0 ? (
          <div className="space-y-2">
            {displayBooks.map((book, index) => {
              const bookId = getBookId(book);
              const bookTitle = getBookTitle(book);
              const isSelected = isBookSelected(book);

              return (
                <div
                  key={bookId || index}
                  onClick={() => handleBookClick(book)}
                  className={`group p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${
                    isSelected
                      ? 'border-violet-300 bg-gradient-to-r from-violet-50 to-purple-50 ring-2 ring-violet-200 shadow-md'
                      : 'border-slate-200 bg-white/60 hover:border-violet-200 hover:bg-white/90 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {bookTitle}
                      </h3>
                    </div>

                    {isSelected && (
                      <div className="ml-3">
                        <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            {searchTerm ? `No books found for "${searchTerm}"` : 'No books in this category'}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSelector;
