import { Capacitor } from '@capacitor/core';

const ASSET_BASE_URL = 'https://purebhaktibase.com';

export const getAssetUrl = (path) => {
  // Always use full URL for Capacitor apps
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  return `${ASSET_BASE_URL}/${cleanPath}`;
};

export const getBookThumbnail = (bookId) => {
  return getAssetUrl(`pbb_book_thumbnails/${bookId}.jpg`);
};

export const getBookPage = (bookId, pageNumber) => {
  return getAssetUrl(`pbb_book_pages/${bookId}/${pageNumber}.webp`);
};

export const getBookPdf = (pdfName) => {
  return getAssetUrl(`pbb_pdf_files/${pdfName}`);
};