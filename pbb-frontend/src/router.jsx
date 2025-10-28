import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import BookReaderPage from './pages/BookReaderPage';
import BookmarksPage from './pages/BookmarksPage';
import BookSearchPage from './pages/BookSearchPage';
import GlossarySearchPage from './pages/GlossarySearchPage';
import VerseLookupPage from './pages/VerseLookupPage';
import ChatPage from './pages/ChatPage';
import TestbedPage from './pages/TestbedPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'reader',
        element: <BookReaderPage />,
      },
      {
        path: 'bookmarks',
        element: <BookmarksPage />,
      },
      {
        path: 'search',
        element: <BookSearchPage />,
      },
      {
        path: 'glossary',
        element: <GlossarySearchPage />,
      },
      {
        path: 'verses',
        element: <VerseLookupPage />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'testbed',
        element: <TestbedPage />,
      },
    ],
  },
]);
