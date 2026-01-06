import { Capacitor } from '@capacitor/core';
import { CapacitorHttp } from '@capacitor/core';
import axios from 'axios';

const BASE_URL = 'https://purebhaktibase.com:8443';

console.log('API Base URL:', BASE_URL);
console.log('Platform:', Capacitor.getPlatform());

// Use native HTTP on mobile to avoid CORS, axios on web
const isNative = Capacitor.isNativePlatform();

const makeRequest = async (method, url, data = null) => {
  const fullUrl = `${BASE_URL}${url}`;
  
  console.log(`API Request: ${method.toUpperCase()} ${url}`);

  if (isNative) {
    // Use Capacitor HTTP for native platforms (bypasses CORS)
    const options = {
      url: fullUrl,
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.data = data;
    }

    try {
      const response = await CapacitorHttp.request(options);
      console.log(`API Response: ${response.status} ${url}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  } else {
    // Use axios for web
    const axiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    try {
      const response = await axiosInstance({
        method,
        url,
        data,
      });
      console.log(`API Response: ${response.status} ${url}`);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  }
};

export const apiService = {
  async getBooks() {
    try {
      // Get first page to see total count
      const firstResponse = await makeRequest('get', '/api/v1/books?page=1&size=100');
      console.log('API Response Data:', firstResponse);

      const { books: firstBooks, total, size } = firstResponse;

      // If we got all books in first request, return them
      if (firstBooks.length >= total) {
        return firstResponse;
      }

      // Otherwise, get all remaining pages
      const allBooks = [...firstBooks];
      const totalPages = Math.ceil(total / size);

      for (let page = 2; page <= totalPages; page++) {
        const response = await makeRequest('get', `/api/v1/books?page=${page}&size=${size}`);
        allBooks.push(...response.books);
      }

      return {
        ...firstResponse,
        books: allBooks,
        size: allBooks.length
      };
    } catch (error) {
      throw new Error(`Failed to fetch books: ${error.message}`);
    }
  },

  async getBookPages(bookId) {
    try {
      const response = await makeRequest('get', `/api/v1/books/${bookId}/pages`);
      console.log('Pages API Response Data:', response);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch pages for book ${bookId}: ${error.message}`);
    }
  },

  async getPageContent(bookId, pageNumber) {
    try {
      const response = await makeRequest('get', `/api/v1/books/${bookId}/content/${pageNumber}`);
      console.log('Page Content API Response Data:', response);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch content for book ${bookId}, page ${pageNumber}: ${error.message}`);
    }
  },

  async getBookTOC(bookId) {
    try {
      const response = await makeRequest('get', `/api/v1/books/${bookId}/toc`);
      console.log('TOC API Response Data:', response);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch TOC for book ${bookId}: ${error.message}`);
    }
  },

  async searchGlossary(term, page = 1, size = 50) {
    try {
      const response = await makeRequest('post', '/api/v1/glossary/search', {
        query: term,
        page,
        size
      });
      console.log('Glossary Search API Response Data:', response);
      return response;
    } catch (error) {
      if (error.response?.status === 400 || error.status === 400) {
        throw new Error('Your search contains words that are not appropriate for this sacred library. Please refine your search.');
      }
      throw new Error(`Failed to search glossary for term "${term}": ${error.message}`);
    }
  }
};

export default apiService;