import axios from 'axios';
import { Capacitor } from '@capacitor/core';
import { LOCAL_CONFIG } from '../../local';

const getBaseUrl = () => {
  const platform = Capacitor.getPlatform();
  
  console.log('Capacitor Platform:', platform);
  console.log('Is Native:', Capacitor.isNativePlatform());
  
  if (platform === 'ios' || platform === 'android') {
    // Mobile: Use proxy to bypass CORS
    // REPLACE 192.168.1.XXX with your actual IP address
    const proxyUrl = `https://${LOCAL_CONFIG.PROXY_IP}:3000`;
    console.log('Using mobile proxy URL:', proxyUrl);
    return proxyUrl;
  }
  
  // Web: Connect directly to production
  console.log('Using production API URL');
  return 'https://purebhaktibase.com:8443';
};

const BASE_URL = getBaseUrl();

console.log('API Base URL:', BASE_URL);
console.log('Platform:', Capacitor.getPlatform());

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
      const firstResponse = await api.get('/api/v1/books?page=1&size=100');
      console.log('API Response Data:', firstResponse.data);

      const { books: firstBooks, total, size } = firstResponse.data;

      if (firstBooks.length >= total) {
        return firstResponse.data;
      }

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