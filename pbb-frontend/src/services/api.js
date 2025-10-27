import axios from 'axios';

// Use the current window's hostname for API calls so it works from any device on the network
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `https://${window.location.hostname}:8443`;
  }
  // Fallback for server-side rendering or non-browser environments
  return 'https://localhost:8443';
};

const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  async getBooks() {
    try {
      // Get first page to see total count
      const firstResponse = await api.get('/api/v1/books?page=1&size=100');
      console.log('API Response Data:', firstResponse.data);

      const { books: firstBooks, total, size } = firstResponse.data;

      // If we got all books in first request, return them
      if (firstBooks.length >= total) {
        return firstResponse.data;
      }

      // Otherwise, get all remaining pages
      const allBooks = [...firstBooks];
      const totalPages = Math.ceil(total / size);

      for (let page = 2; page <= totalPages; page++) {
        const response = await api.get(`/api/v1/books?page=${page}&size=${size}`);
        allBooks.push(...response.data.books);
      }

      return {
        ...firstResponse.data,
        books: allBooks,
        size: allBooks.length
      };
    } catch (error) {
      throw new Error(`Failed to fetch books: ${error.message}`);
    }
  },

  async getBookPages(bookId) {
    try {
      const response = await api.get(`/api/v1/books/${bookId}/pages`);
      console.log('Pages API Response Data:', response.data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch pages for book ${bookId}: ${error.message}`);
    }
  },

  async getPageContent(bookId, pageNumber) {
    try {
      const response = await api.get(`/api/v1/books/${bookId}/content/${pageNumber}`);
      console.log('Page Content API Response Data:', response.data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch content for book ${bookId}, page ${pageNumber}: ${error.message}`);
    }
  },

  async getBookTOC(bookId) {
    try {
      const response = await api.get(`/api/v1/books/${bookId}/toc`);
      console.log('TOC API Response Data:', response.data);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch TOC for book ${bookId}: ${error.message}`);
    }
  },

  async searchGlossary(term, page = 1, size = 50) {
    try {
      const response = await api.post('/api/v1/glossary/search', {
        query: term,
        page,
        size
      });
      console.log('Glossary Search API Response Data:', response.data);
      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('Your search contains words that are not appropriate for this sacred library. Please refine your search.');
      }
      throw new Error(`Failed to search glossary for term "${term}": ${error.message}`);
    }
  }
};

export default api;