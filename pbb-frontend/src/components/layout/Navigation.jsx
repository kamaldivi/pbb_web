import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/reader', label: 'Reader', icon: '📖' },
    { path: '/bookmarks', label: 'Bookmarks', icon: '🔖' },
    { path: '/search', label: 'Search', icon: '🔍' },
    { path: '/glossary', label: 'Glossary', icon: '📚' },
    { path: '/verses', label: 'Verse Lookup', icon: '📜' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: 'https://youtu.be/P9PzwAzbRuE', label: 'Tutorial', icon: '🎥', external: true },
    // { path: '/testbed', label: 'Test Bed', icon: '🧪' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md border-b border-slate-200">
      <div className="px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center space-x-1">
          {menuItems.map((item) => (
            item.external ? (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 text-base font-semibold transition-all duration-200 border-b-3 relative text-slate-700 border-b-4 border-transparent hover:text-blue-600 hover:bg-blue-50/30 hover:border-blue-300"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  px-6 py-4 text-base font-semibold transition-all duration-200
                  border-b-3 relative
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
      </div>
    </nav>
  );
};

export default Navigation;