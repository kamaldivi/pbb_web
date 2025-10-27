# Pure Bhakti Base - Frontend Application

React-based frontend for the Pure Bhakti Base web application, providing an immersive reading experience for spiritual texts.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```
Access at: `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 📦 Technology Stack

- **React** 19.1.1 - Modern UI library with hooks
- **Vite** 7.1.2 - Fast build tool and dev server
- **TailwindCSS** 4.1.13 - Utility-first CSS framework
- **React Router DOM** 7.1.3 - Client-side routing
- **Axios** 1.12.1 - HTTP client for API calls
- **ESLint** - Code quality and consistency

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Navigation, Layout
│   ├── shared/          # Reusable components (BookSelector, Loading, Error)
│   ├── book/            # Book-specific components (BookSlider)
│   ├── reader/          # Reading components (PageNav, ImageViewer, TOC)
│   └── search/          # Search components (Glossary results)
├── pages/               # Route pages (Home, Reader, Search, Chat, Verses)
├── services/            # API integration (api.js)
├── router.jsx           # Route configuration
└── main.jsx             # Application entry point
```

## 🎯 Key Features

### Anchor-Style Reading Mode
Immersive reading experience with automatic scroll to focused view:
- Triggered on book selection from Home or Reader
- Smooth scroll to Book Reader + Table of Contents
- Fixed "Top" side tab to return to full layout
- Hides navigation for distraction-free reading

### Responsive Components
- **BookSelector**: Multi/single select, search, alphabetical grouping
- **TableOfContents**: Interactive TOC with current page highlighting
- **PageNavigation**: Dual controls (top and bottom of reader)
- **ImageViewer**: Optimized book page display

### API Integration
```javascript
// Base URL configured dynamically
const API_BASE_URL = `https://${window.location.hostname}:8443`;

// Main endpoints
GET  /api/v1/books              // List all books
GET  /api/v1/books/{id}/toc     // Table of contents
GET  /api/v1/books/{id}/pages   // Book pages
POST /api/v1/glossary/search    // Search glossary
```

## 🎨 Styling

TailwindCSS with custom configuration:
- Glass morphism effects with backdrop blur
- Gradient backgrounds and modern color schemes
- Smooth animations and transitions
- Mobile-first responsive design
- Consistent max-width layouts (max-w-7xl)

## 📱 Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | HomePage | Book library with summaries and search |
| `/reader?book_id=X` | BookReaderPage | Immersive book reading with TOC |
| `/books` | BookSearchPage | Search across all books |
| `/glossary` | GlossarySearchPage | Terminology lookup |
| `/verses` | VerseLookupPage | Scripture verse search |
| `/chat` | ChatPage | AI-powered conversations |
| `/testbed` | TestbedPage | Development testing |

## 🛠️ Available Scripts

```bash
npm run dev       # Start development server (port 5173)
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 🐳 Docker Support

Multi-stage Dockerfile for optimized production builds:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
# ... build process

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

Build and run:
```bash
docker build -t pbb-frontend .
docker run -p 80:80 pbb-frontend
```

## 🔧 Configuration

### Vite Config
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})
```

### API Base URL
Configured dynamically based on hostname:
```javascript
const API_BASE_URL = `https://${window.location.hostname}:8443`;
```

## 📝 Development Guidelines

### Component Structure
- Functional components with hooks
- Props validation recommended
- Error boundaries for graceful failures
- Loading states for async operations

### State Management
- Local state with `useState` for component-specific data
- URL parameters for shareable state (book selection)
- Refs with `useRef` for DOM manipulation (scroll anchors)

### Code Style
- ESLint configuration enforced
- Consistent naming conventions
- Component files in PascalCase
- Utility files in camelCase

## 🚢 Deployment

### Production Checklist
- [ ] Run `npm run build`
- [ ] Test production build with `npm run preview`
- [ ] Verify API endpoints are configured correctly
- [ ] Check Docker build: `docker build -t pbb-frontend .`
- [ ] Ensure nginx configuration is production-ready

### Environment Considerations
- API base URL auto-configured from hostname
- SSL/TLS required for production
- CORS headers must allow frontend domain
- Static assets served from `/images/` path

## 🙏 Credits

Built with modern web technologies for the Pure Bhakti Base spiritual literature platform.

**Repository**: [github.com/kamaldivi/pbb_web](https://github.com/kamaldivi/pbb_web)

---

For more details, see the main [project README](../README.md) and [project structure documentation](../PROJECT_STRUCTURE.md).
