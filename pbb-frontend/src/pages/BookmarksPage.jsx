import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getBookmarks,
  deleteBookmark,
  updateBookmark,
  clearAllBookmarks,
  exportBookmarks,
  importBookmarks,
} from '../services/bookmarkService';

const BookmarksPage = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, book
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks();
  }, []);

  // Filter and sort bookmarks when search or sort changes
  useEffect(() => {
    let filtered = [...bookmarks];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (bm) =>
          bm.bookTitle.toLowerCase().includes(query) ||
          bm.customName.toLowerCase().includes(query) ||
          bm.pageNumber.toString().includes(query)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'book':
        // Sort by book title first, then by page number (ascending)
        filtered.sort((a, b) => {
          const titleCompare = a.bookTitle.localeCompare(b.bookTitle);
          if (titleCompare !== 0) {
            return titleCompare;
          }
          // If same book, sort by page number ascending (lowest page first)
          return a.pageNumber - b.pageNumber;
        });
        break;
      default:
        break;
    }

    setFilteredBookmarks(filtered);
  }, [bookmarks, searchQuery, sortBy]);

  const loadBookmarks = () => {
    const loadedBookmarks = getBookmarks();
    setBookmarks(loadedBookmarks);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this bookmark?')) {
      const success = deleteBookmark(id);
      if (success) {
        loadBookmarks();
      }
    }
  };

  const handleNavigateToBookmark = (bookmark) => {
    navigate(`/reader?book_id=${bookmark.bookId}&page=${bookmark.pageNumber}`);
  };

  const handleStartEdit = (bookmark) => {
    setEditingId(bookmark.id);
    setEditName(bookmark.customName);
  };

  const handleSaveEdit = (id) => {
    updateBookmark(id, editName.trim());
    setEditingId(null);
    setEditName('');
    loadBookmarks();
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleClearAll = () => {
    if (
      window.confirm(
        `Are you sure you want to delete ALL ${bookmarks.length} bookmarks? This action cannot be undone.`
      )
    ) {
      clearAllBookmarks();
      loadBookmarks();
    }
  };

  const handleExport = () => {
    const json = exportBookmarks();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pbb-bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const success = importBookmarks(event.target.result);
            if (success) {
              loadBookmarks();
              alert('Bookmarks imported successfully!');
            } else {
              alert('Failed to import bookmarks. Please check the file format.');
            }
          } catch (error) {
            alert('Error importing bookmarks: ' + error.message);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">My Bookmarks</h1>
              <p className="text-slate-600">
                {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'} saved
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={bookmarks.length === 0}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              title="Export bookmarks as JSON"
            >
              Export
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors shadow-md"
              title="Import bookmarks from JSON"
            >
              Import
            </button>
            <button
              onClick={handleClearAll}
              disabled={bookmarks.length === 0}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear all bookmarks"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Search and Sort Controls */}
      {bookmarks.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by book title, page, or custom name..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-slate-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                />
                <svg
                  className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-semibold text-slate-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border-2 border-slate-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="book">Book Title</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bookmarks List */}
      {filteredBookmarks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-white rounded-xl shadow-md border-2 border-slate-200 hover:border-amber-400 transition-all duration-200 overflow-hidden group"
            >
              <div className="p-5">
                {/* Custom Name or Default Label */}
                {editingId === bookmark.id ? (
                  <div className="mb-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-1 border-2 border-amber-500 rounded-lg focus:outline-none"
                      autoFocus
                      maxLength={100}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(bookmark.id);
                        if (e.key === 'Escape') handleCancelEdit();
                      }}
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleSaveEdit(bookmark.id)}
                        className="flex-1 px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex-1 px-3 py-1 bg-slate-300 hover:bg-slate-400 text-slate-700 text-sm font-semibold rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-800 flex-1">
                      {bookmark.customName || `${bookmark.bookTitle} - Page ${bookmark.pageNumber}`}
                    </h3>
                    <button
                      onClick={() => handleStartEdit(bookmark)}
                      className="p-1 text-slate-400 hover:text-amber-600 transition-colors"
                      title="Edit name"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Book Title */}
                <p className="text-sm font-semibold text-slate-600 mb-1">
                  {bookmark.bookTitle}
                </p>

                {/* Page Number */}
                <p className="text-sm text-slate-500 mb-3">
                  Page {bookmark.pageNumber}
                </p>

                {/* Date */}
                <p className="text-xs text-slate-400 mb-4">
                  Saved: {formatDate(bookmark.createdAt)}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleNavigateToBookmark(bookmark)}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-lg transition-all shadow-md hover:shadow-lg"
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDelete(bookmark.id)}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-lg transition-colors"
                    title="Delete bookmark"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : bookmarks.length > 0 ? (
        // No results from search
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-200">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No bookmarks found</h3>
          <p className="text-slate-600">
            Try adjusting your search query or filters
          </p>
        </div>
      ) : (
        // Empty state - no bookmarks at all
        <div className="bg-white rounded-xl shadow-md p-12 text-center border border-slate-200">
          <div className="text-6xl mb-4">📖</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No bookmarks yet</h3>
          <p className="text-slate-600 mb-6">
            Start reading and bookmark your favorite pages!
          </p>
          <button
            onClick={() => navigate('/reader')}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Go to Reader
          </button>
        </div>
      )}
    </div>
  );
};

export default BookmarksPage;
