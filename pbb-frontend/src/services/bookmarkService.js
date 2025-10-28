/**
 * Bookmark Service
 * Manages bookmark operations using localStorage for an unauthenticated application
 */

const STORAGE_KEY = 'pbb_bookmarks';

/**
 * Get all bookmarks from localStorage
 * @returns {Array} Array of bookmark objects
 */
export const getBookmarks = () => {
  try {
    const bookmarks = localStorage.getItem(STORAGE_KEY);
    return bookmarks ? JSON.parse(bookmarks) : [];
  } catch (error) {
    console.error('Error loading bookmarks:', error);
    return [];
  }
};

/**
 * Add a new bookmark
 * @param {Object} bookmark - Bookmark object
 * @param {number} bookmark.bookId - Book ID
 * @param {string} bookmark.bookTitle - Book title
 * @param {number} bookmark.pageNumber - Page number
 * @param {string} [bookmark.customName] - Optional custom bookmark name
 * @returns {Object} The newly created bookmark with id and timestamps
 */
export const addBookmark = ({ bookId, bookTitle, pageNumber, customName = '' }) => {
  try {
    // Validate required fields
    if (!bookId || !bookTitle || !pageNumber) {
      throw new Error('Missing required bookmark fields: bookId, bookTitle, pageNumber');
    }

    const bookmarks = getBookmarks();

    // Check if bookmark already exists for this book/page combination
    const existingIndex = bookmarks.findIndex(
      bm => bm.bookId === bookId && bm.pageNumber === pageNumber
    );

    const timestamp = new Date().toISOString();
    const newBookmark = {
      id: `bm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      bookId,
      bookTitle,
      pageNumber,
      customName,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    if (existingIndex >= 0) {
      // Update existing bookmark
      bookmarks[existingIndex] = {
        ...bookmarks[existingIndex],
        customName: customName || bookmarks[existingIndex].customName,
        updatedAt: timestamp,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      return bookmarks[existingIndex];
    } else {
      // Add new bookmark
      bookmarks.push(newBookmark);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      return newBookmark;
    }
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
};

/**
 * Delete a bookmark by ID
 * @param {string} id - Bookmark ID
 * @returns {boolean} True if deleted successfully
 */
export const deleteBookmark = (id) => {
  try {
    const bookmarks = getBookmarks();
    const filteredBookmarks = bookmarks.filter(bm => bm.id !== id);

    if (filteredBookmarks.length === bookmarks.length) {
      return false; // Bookmark not found
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredBookmarks));
    return true;
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return false;
  }
};

/**
 * Check if a specific page is bookmarked
 * @param {number} bookId - Book ID
 * @param {number} pageNumber - Page number
 * @returns {Object|null} Bookmark object if exists, null otherwise
 */
export const isPageBookmarked = (bookId, pageNumber) => {
  try {
    const bookmarks = getBookmarks();
    return bookmarks.find(bm => bm.bookId === bookId && bm.pageNumber === pageNumber) || null;
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return null;
  }
};

/**
 * Update a bookmark's custom name
 * @param {string} id - Bookmark ID
 * @param {string} customName - New custom name
 * @returns {Object|null} Updated bookmark or null if not found
 */
export const updateBookmark = (id, customName) => {
  try {
    const bookmarks = getBookmarks();
    const index = bookmarks.findIndex(bm => bm.id === id);

    if (index < 0) {
      return null; // Bookmark not found
    }

    bookmarks[index] = {
      ...bookmarks[index],
      customName,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return bookmarks[index];
  } catch (error) {
    console.error('Error updating bookmark:', error);
    return null;
  }
};

/**
 * Get all bookmarks for a specific book
 * @param {number} bookId - Book ID
 * @returns {Array} Array of bookmarks for the specified book
 */
export const getBookmarksByBook = (bookId) => {
  try {
    const bookmarks = getBookmarks();
    return bookmarks.filter(bm => bm.bookId === bookId);
  } catch (error) {
    console.error('Error getting bookmarks by book:', error);
    return [];
  }
};

/**
 * Clear all bookmarks (use with caution)
 * @returns {boolean} True if cleared successfully
 */
export const clearAllBookmarks = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing bookmarks:', error);
    return false;
  }
};

/**
 * Export bookmarks as JSON string
 * @returns {string} JSON string of all bookmarks
 */
export const exportBookmarks = () => {
  const bookmarks = getBookmarks();
  return JSON.stringify(bookmarks, null, 2);
};

/**
 * Import bookmarks from JSON string (merges with existing)
 * @param {string} jsonString - JSON string of bookmarks
 * @returns {boolean} True if imported successfully
 */
export const importBookmarks = (jsonString) => {
  try {
    const importedBookmarks = JSON.parse(jsonString);

    if (!Array.isArray(importedBookmarks)) {
      throw new Error('Invalid bookmark data: expected an array');
    }

    const existingBookmarks = getBookmarks();
    const merged = [...existingBookmarks];

    // Merge imported bookmarks, avoiding duplicates
    importedBookmarks.forEach(imported => {
      const exists = merged.some(
        existing => existing.bookId === imported.bookId && existing.pageNumber === imported.pageNumber
      );

      if (!exists) {
        merged.push({
          ...imported,
          id: imported.id || `bm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        });
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return true;
  } catch (error) {
    console.error('Error importing bookmarks:', error);
    return false;
  }
};
