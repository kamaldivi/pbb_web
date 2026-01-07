import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlatform } from '../services/usePlatform';

/**
 * Global floating action buttons that appear on all pages after scrolling
 * - Mobile: Stack of circular FABs in bottom-right (Home + Back to Top)
 * - Desktop: Side button on right edge (Back to Top)
 */
const FloatingButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const platform = usePlatform();
  const [showButtons, setShowButtons] = useState(false);

  // Show buttons after scrolling down 400px
  useEffect(() => {
    const handleScroll = () => {
      setShowButtons(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToHome = () => {
    navigate('/#library');
  };

  if (!showButtons) return null;

  // Mobile: Stack of FABs in bottom-right
  if (platform.isMobile) {
    return (
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Home Button - Show on all pages except home */}
        {location.pathname !== '/' && (
          <button
            onClick={goToHome}
            className="bg-gradient-to-br from-slate-600 to-slate-700 text-white p-4 rounded-full shadow-2xl transition-all duration-200 active:scale-95 flex items-center justify-center"
            title="Back to Library"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        )}

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl transition-all duration-200 active:scale-95 flex items-center justify-center"
          title="Back to Top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    );
  }

  // Desktop: Side button on right edge
  return (
    <div className="fixed top-1/2 right-0 -translate-y-1/2 z-50">
      <button
        onClick={scrollToTop}
        className="bg-gradient-to-l from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-2xl transition-all duration-300 hover:shadow-blue-500/50 rounded-l-xl flex flex-col items-center py-4 px-3 group"
        title="Back to top"
      >
        <div className="bg-white/20 group-hover:bg-white/30 p-2 rounded-lg transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </div>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
          Back to Top
        </span>
      </button>
    </div>
  );
};

export default FloatingButtons;