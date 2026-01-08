import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePlatform } from '../../services/usePlatform';

/**
 * Global floating action buttons that appear on all pages after scrolling
 * - Mobile: Stack of circular FABs in bottom-right (Home + Back to Top)
 * - Desktop: Consistent circular button in bottom-right (Back to Top)
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

  // Desktop: Consistent circular button in bottom-right (same as mobile now)
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={scrollToTop}
        className="bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-2xl transition-all duration-200 hover:scale-110 flex items-center justify-center"
        title="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
};

export default FloatingButtons;