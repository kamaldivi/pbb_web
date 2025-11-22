import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Home' },
    { path: '/bookmarks', label: 'Bookmarks' },
    { path: '/glossary', label: 'Search' },
    { path: '/chat', label: 'Chat' },
    { path: 'https://youtu.be/P9PzwAzbRuE', label: 'Tutorial', external: true },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md border-b border-slate-200">
      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center space-x-1">
          {menuItems.map((item) => (
            item.external ? (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 lg:px-6 py-4 text-sm lg:text-base font-semibold transition-all duration-200 relative text-slate-700 border-b-4 border-transparent hover:text-blue-600 hover:bg-blue-50/30 hover:border-blue-300"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-4 lg:px-6 py-4 text-sm lg:text-base font-semibold transition-all duration-200
                  relative
                  ${
                    isActive(item.path)
                      ? 'text-blue-700 border-b-4 border-blue-600 bg-blue-50/50'
                      : 'text-slate-700 border-b-4 border-transparent hover:text-blue-600 hover:bg-blue-50/30 hover:border-blue-300'
                  }
                `}
              >
                {item.label}
              </Link>
            )
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          {/* Mobile Header with Hamburger */}
          <div className="flex items-center justify-between py-3">
            <span className="text-lg font-bold text-slate-800">Menu</span>
            <button
              onClick={handleMobileMenuToggle}
              className="p-2 rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="pb-4 border-t border-slate-200">
              <div className="flex flex-col space-y-1 pt-2">
                {menuItems.map((item) => (
                  item.external ? (
                    <a
                      key={item.path}
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMobileMenu}
                      className="px-4 py-3 text-base font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`
                        px-4 py-3 text-base font-semibold rounded-lg transition-colors
                        ${
                          isActive(item.path)
                            ? 'text-blue-700 bg-blue-50 border-l-4 border-blue-600'
                            : 'text-slate-700 hover:text-blue-600 hover:bg-blue-50'
                        }
                      `}
                    >
                      {item.label}
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
