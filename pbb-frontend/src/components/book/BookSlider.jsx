import { useState } from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';

const BookSlider = ({ books, loading, error, onBookSelect, selectedBookId, onRetry }) => {
  const [activeTab, setActiveTab] = useState('A');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <div className="w-full bg-white shadow-md rounded-lg p-6">
        <LoadingSpinner size="large" message="Loading books..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-white shadow-md rounded-lg p-6">
        <ErrorMessage error={error} onRetry={onRetry} />
      </div>
    );
  }

  // Ensure books is an array and handle different API response formats
  const booksArray = Array.isArray(books) ? books : (books?.books || books?.data || []);

  if (!booksArray || booksArray.length === 0) {
    return (
      <div className="w-full bg-white shadow-md rounded-lg p-6">
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
    // Handle common Sanskrit/Hindi transliteration characters and international diacritics
    const charMap = {
      // A variations
      'Ā': 'A', 'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A', 'Ą': 'A', 'Ă': 'A', 'Ȧ': 'A', 'Ạ': 'A', 'Ả': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
      'ā': 'A', 'à': 'A', 'á': 'A', 'â': 'A', 'ã': 'A', 'ä': 'A', 'å': 'A', 'ą': 'A', 'ă': 'A', 'ȧ': 'A', 'ạ': 'A', 'ả': 'A', 'ấ': 'A', 'ầ': 'A', 'ẩ': 'A', 'ẫ': 'A', 'ậ': 'A', 'ắ': 'A', 'ằ': 'A', 'ẳ': 'A', 'ẵ': 'A', 'ặ': 'A',
      // B variations
      'Ḃ': 'B', 'Ḅ': 'B', 'Ḇ': 'B',
      'ḃ': 'B', 'ḅ': 'B', 'ḇ': 'B',
      // C variations
      'Ć': 'C', 'Ĉ': 'C', 'Ċ': 'C', 'Č': 'C', 'Ç': 'C',
      'ć': 'C', 'ĉ': 'C', 'ċ': 'C', 'č': 'C', 'ç': 'C',
      // D variations
      'Ḍ': 'D', 'Ḏ': 'D', 'Ḑ': 'D', 'Ḓ': 'D', 'Ď': 'D', 'Đ': 'D',
      'ḍ': 'D', 'ḏ': 'D', 'ḑ': 'D', 'ḓ': 'D', 'ď': 'D', 'đ': 'D',
      // E variations
      'Ē': 'E', 'Ĕ': 'E', 'Ė': 'E', 'Ę': 'E', 'Ě': 'E', 'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
      'ē': 'E', 'ĕ': 'E', 'ė': 'E', 'ę': 'E', 'ě': 'E', 'è': 'E', 'é': 'E', 'ê': 'E', 'ë': 'E',
      // G variations
      'Ḡ': 'G', 'Ģ': 'G', 'Ĝ': 'G', 'Ğ': 'G', 'Ġ': 'G',
      'ḡ': 'G', 'ģ': 'G', 'ĝ': 'G', 'ğ': 'G', 'ġ': 'G',
      // H variations
      'Ḥ': 'H', 'Ḧ': 'H', 'Ḩ': 'H', 'Ḫ': 'H', 'Ĥ': 'H', 'Ħ': 'H',
      'ḥ': 'H', 'ḧ': 'H', 'ḩ': 'H', 'ḫ': 'H', 'ĥ': 'H', 'ħ': 'H',
      // I variations
      'Ī': 'I', 'Ĭ': 'I', 'Į': 'I', 'İ': 'I', 'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
      'ī': 'I', 'ĭ': 'I', 'į': 'I', 'ì': 'I', 'í': 'I', 'î': 'I', 'ï': 'I', 'ı': 'I',
      // J variations
      'Ĵ': 'J', 'ĵ': 'J',
      // K variations
      'Ķ': 'K', 'Ḱ': 'K', 'Ḳ': 'K', 'Ḵ': 'K',
      'ķ': 'K', 'ḱ': 'K', 'ḳ': 'K', 'ḵ': 'K',
      // L variations
      'Ĺ': 'L', 'Ļ': 'L', 'Ľ': 'L', 'Ŀ': 'L', 'Ł': 'L', 'Ḷ': 'L', 'Ḹ': 'L', 'Ḻ': 'L', 'Ḽ': 'L',
      'ĺ': 'L', 'ļ': 'L', 'ľ': 'L', 'ŀ': 'L', 'ł': 'L', 'ḷ': 'L', 'ḹ': 'L', 'ḻ': 'L', 'ḽ': 'L',
      // M variations
      'Ḿ': 'M', 'Ṁ': 'M', 'Ṃ': 'M',
      'ḿ': 'M', 'ṁ': 'M', 'ṃ': 'M',
      // N variations
      'Ń': 'N', 'Ņ': 'N', 'Ň': 'N', 'Ŋ': 'N', 'Ñ': 'N', 'Ṅ': 'N', 'Ṇ': 'N', 'Ṉ': 'N', 'Ṋ': 'N',
      'ń': 'N', 'ņ': 'N', 'ň': 'N', 'ŋ': 'N', 'ñ': 'N', 'ṅ': 'N', 'ṇ': 'N', 'ṉ': 'N', 'ṋ': 'N',
      // O variations
      'Ō': 'O', 'Ŏ': 'O', 'Ő': 'O', 'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O', 'Ø': 'O', 'Ǫ': 'O',
      'ō': 'O', 'ŏ': 'O', 'ő': 'O', 'ò': 'O', 'ó': 'O', 'ô': 'O', 'õ': 'O', 'ö': 'O', 'ø': 'O', 'ǫ': 'O',
      // P variations
      'Ṕ': 'P', 'Ṗ': 'P',
      'ṕ': 'P', 'ṗ': 'P',
      // R variations
      'Ŕ': 'R', 'Ŗ': 'R', 'Ř': 'R', 'Ṙ': 'R', 'Ṛ': 'R', 'Ṝ': 'R', 'Ṟ': 'R',
      'ŕ': 'R', 'ŗ': 'R', 'ř': 'R', 'ṙ': 'R', 'ṛ': 'R', 'ṝ': 'R', 'ṟ': 'R',
      // S variations
      'Ś': 'S', 'Ŝ': 'S', 'Ş': 'S', 'Š': 'S', 'Ṡ': 'S', 'Ṣ': 'S', 'Ṥ': 'S', 'Ṧ': 'S', 'Ṩ': 'S',
      'ś': 'S', 'ŝ': 'S', 'ş': 'S', 'š': 'S', 'ṡ': 'S', 'ṣ': 'S', 'ṥ': 'S', 'ṧ': 'S', 'ṩ': 'S',
      // T variations
      'Ţ': 'T', 'Ť': 'T', 'Ŧ': 'T', 'Ṫ': 'T', 'Ṭ': 'T', 'Ṯ': 'T', 'Ṱ': 'T',
      'ţ': 'T', 'ť': 'T', 'ŧ': 'T', 'ṫ': 'T', 'ṭ': 'T', 'ṯ': 'T', 'ṱ': 'T',
      // U variations
      'Ū': 'U', 'Ŭ': 'U', 'Ů': 'U', 'Ű': 'U', 'Ų': 'U', 'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
      'ū': 'U', 'ŭ': 'U', 'ů': 'U', 'ű': 'U', 'ų': 'U', 'ù': 'U', 'ú': 'U', 'û': 'U', 'ü': 'U',
      // V variations
      'Ṽ': 'V', 'Ṿ': 'V',
      'ṽ': 'V', 'ṿ': 'V',
      // W variations
      'Ŵ': 'W', 'Ẁ': 'W', 'Ẃ': 'W', 'Ẅ': 'W', 'Ẇ': 'W', 'Ẉ': 'W', 'Ẋ': 'W',
      'ŵ': 'W', 'ẁ': 'W', 'ẃ': 'W', 'ẅ': 'W', 'ẇ': 'W', 'ẉ': 'W', 'ẋ': 'W',
      // Y variations
      'Ý': 'Y', 'Ŷ': 'Y', 'Ÿ': 'Y', 'Ỳ': 'Y', 'Ẏ': 'Y', 'Ỹ': 'Y',
      'ý': 'Y', 'ŷ': 'Y', 'ÿ': 'Y', 'ỳ': 'Y', 'ẏ': 'Y', 'ỹ': 'Y',
      // Z variations
      'Ź': 'Z', 'Ż': 'Z', 'Ž': 'Z', 'Ẑ': 'Z', 'Ẓ': 'Z', 'Ẕ': 'Z',
      'ź': 'Z', 'ż': 'Z', 'ž': 'Z', 'ẑ': 'Z', 'ẓ': 'Z', 'ẕ': 'Z'
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
    onBookSelect(book);
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
    <div className="w-full bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-white/20 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Select a Book</h2>
        </div>
        <div className="flex items-center space-x-2 bg-slate-100 rounded-full px-3 py-1.5">
          <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
          <span className="text-sm font-medium text-slate-700">
            {booksArray.length} books
          </span>
        </div>
      </div>

      {/* Search Box */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search books..."
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

      {/* Tab Navigation */}
      {!searchTerm && (
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

              return (
                <div
                  key={bookId || index}
                  onClick={() => handleBookClick(book)}
                  className={`group p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.01] ${
                    selectedBookId === bookId
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

                    {selectedBookId === bookId && (
                      <div className="ml-3">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default BookSlider;