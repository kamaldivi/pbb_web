# Pure Bhakti Base Web Application

A comprehensive web application for browsing and reading spiritual texts from the Pure Bhakti Base collection. This project provides a beautiful, responsive interface for accessing Sanskrit and spiritual literature with support for transliterated text, high-quality book page images, and an immersive reading experience.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

## ✨ Features

### 📚 Book Management & Navigation
- **Smart Book Selection**: Intuitive book browser with search functionality
- **Alphabetical Grouping**: Intelligent grouping that combines English and transliterated Sanskrit characters (Ś, Ḍ, Ū, etc.) under their base letters
- **Multi-format Support**: Handles various book title formats and metadata
- **Book Summaries**: Rich book information with author details and descriptions
- **Direct Navigation**: Select books from Home Page and navigate directly to reading mode

### 🎯 Immersive Reading Mode
- **Anchor-Style Focus**: Auto-scroll to reading view when selecting books or navigating pages
- **Distraction-Free Reading**: Focused view with Book Reader and Table of Contents
- **Top Navigation Tab**: Fixed side button to return to full layout view
- **Smooth Transitions**: Beautiful scroll animations for seamless navigation
- **Collapsible Panels**: Hide/show book selector and table of contents as needed

### 🔤 Sanskrit & Transliteration Support
- **Advanced Character Normalization**: Books starting with "Śrī" group under "S", "Ḍāmodara" under "D"
- **Comprehensive Diacritic Mapping**: Supports 100+ Sanskrit transliteration characters
- **Unicode Compatibility**: Proper handling of macrons, dots, and accent marks

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Glass Morphism**: Beautiful backdrop blur effects and modern styling
- **Smooth Animations**: Elegant transitions and hover effects
- **Consistent Layout**: Centered max-width design with unified styling
- **Enhanced Footer**: Logo, vision/mission statements, and licensing information

### 🖼️ Book Reading Experience
- **High-Quality Images**: WebP format for optimized loading
- **Dual Page Navigation**: Control panels above and below page viewer for convenience
- **Table of Contents**: Interactive TOC with current page highlighting
- **Page-by-Page Navigation**: Previous/Next buttons with automatic reading mode focus
- **Loading States**: Smooth loading spinners and error handling
- **Image Viewer**: Optimized display with proper aspect ratios

### 🔍 Search & Discovery
- **Glossary Search**: Search spiritual terminology and concepts (POST-based API)
- **Verse Lookup**: Find specific verses across books
- **Book Search**: Search across entire book collection
- **Advanced Filtering**: Filter by book, author, or category

### 💬 Interactive Features
- **Chat Interface**: AI-powered conversations about spiritual texts
- **Video Tutorial**: Integrated tutorial link in navigation menu
- **Multi-page Support**: Browse through complete books page by page

## 🏗️ Architecture

### Frontend (React + Vite)
```
pbb-frontend/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx           # App header with logo
│   │   │   ├── Footer.jsx           # Footer with vision/mission/licensing
│   │   │   ├── Navigation.jsx       # Main menu with Tutorial link
│   │   │   └── Layout.jsx           # Consistent page wrapper
│   │   ├── shared/
│   │   │   ├── BookSelector.jsx     # Reusable book selection
│   │   │   ├── LoadingSpinner.jsx   # Loading states
│   │   │   └── ErrorMessage.jsx     # Error handling
│   │   ├── book/
│   │   │   └── BookSlider.jsx       # Book carousel
│   │   ├── reader/
│   │   │   ├── PageNavigation.jsx   # Page controls with Prev/Next
│   │   │   ├── ImageViewer.jsx      # Page image display
│   │   │   ├── TableOfContents.jsx  # Interactive TOC
│   │   │   └── ContentDisplay.jsx   # Text content viewer
│   │   └── search/
│   │       ├── GlossarySearchInput.jsx    # Glossary search
│   │       └── GlossaryResultCard.jsx     # Search results
│   ├── pages/
│   │   ├── HomePage.jsx             # Library overview
│   │   ├── BookReaderPage.jsx       # Reading mode with anchor navigation
│   │   ├── GlossarySearchPage.jsx   # Glossary search
│   │   ├── VerseLookupPage.jsx      # Verse search
│   │   ├── ChatPage.jsx             # AI chat
│   │   └── BookSearchPage.jsx       # Book search
│   ├── services/
│   │   └── api.js                   # API service layer
│   ├── router.jsx                   # Route configuration
│   └── main.jsx                     # App entry point
├── public/
│   └── images/                      # Static images and logos
└── Dockerfile                       # Multi-stage production build
```

### Infrastructure
- **Docker**: Containerized application with multi-stage builds
- **Nginx**: Production web server with SSL termination
- **SSL/TLS**: Full HTTPS support with Let's Encrypt integration
- **Production Ready**: Optimized builds with resource limits and health checks

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local development)
- SSL certificates (provided in `/ssl` directory)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone git@github.com:kamaldivi/pbb_web.git
   cd pbb_web
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - HTTPS: `https://purebhaktibase.com` (or your configured domain)
   - HTTP: `http://localhost` (redirects to HTTPS)

### Local Development

1. **Navigate to frontend**
   ```bash
   cd pbb-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access locally**
   - Development: `http://localhost:5173`

## 🐳 Docker Deployment

### Development Environment
```bash
docker-compose up -d
```

### Production Environment
```bash
docker-compose -f docker-compose.prod.yml up -d
```

The production configuration includes:
- **Resource Limits**: CPU and memory constraints
- **Health Checks**: Container health monitoring
- **Log Rotation**: Automated log management
- **Security Headers**: Enhanced security configurations
- **SSL Optimization**: Production SSL settings

## 📁 Project Structure

```
pbb_web/
├── pbb-frontend/              # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-level components
│   │   ├── services/          # API integration
│   │   └── router.jsx         # Route configuration
│   ├── public/
│   │   └── images/            # Static assets and logos
│   ├── dist/                  # Production build
│   └── Dockerfile             # Frontend container
├── nginx/                     # Nginx configurations
│   └── nginx-ssl.conf         # SSL-enabled config
├── ssl/                       # SSL certificates (if configured)
├── certbot/                   # Let's Encrypt automation
├── docker-compose.yml         # Development environment
├── docker-compose.prod.yml    # Production environment
├── README.md                  # This file
└── PROJECT_STRUCTURE.md       # Detailed architecture guide
```

## 🔧 Configuration

### Environment Variables
The application uses dynamic configuration based on the current hostname:
- **API Endpoint**: `https://${window.location.hostname}:8443`
- **SSL Configuration**: Automatic HTTPS enforcement
- **CORS Settings**: Configured for cross-origin requests

### SSL Configuration
The application includes production-ready SSL configuration:
- **TLS 1.2 & 1.3**: Modern encryption protocols
- **HSTS**: HTTP Strict Transport Security
- **Security Headers**: XSS protection, content type validation
- **CSP**: Content Security Policy for enhanced security

### API Integration
The frontend integrates with a Pure Bhakti Base API:
```javascript
// API Endpoints
GET  /api/v1/books                     # List all books
GET  /api/v1/books/{id}/toc            # Get table of contents
GET  /api/v1/books/{id}/pages          # Get book pages
POST /api/v1/glossary/search           # Search glossary terms
GET  /api/v1/verses                    # Verse lookup
POST /api/v1/chat                      # AI chat interactions
```

## 🎯 Key Features Deep Dive

### Anchor-Style Reading Mode
The BookReaderPage features an immersive reading experience with automatic focus:

**Auto-Scroll Triggers:**
- When book selected from Home Page (via URL parameter)
- When book selected from Top Book Selection Panel
- When navigating pages using Previous/Next buttons

**Reading Mode Behavior:**
- Smoothly scrolls to Book Reader + Table of Contents view
- Hides header, navigation, and book selector from view
- Maximizes reading space with distraction-free layout
- Shows "Top" side tab for easy return to full layout

**Implementation:**
```javascript
// Scroll to reading mode with smooth animation
const scrollToReadingMode = () => {
  readerAnchorRef.current.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
  setShowTopTab(true);
};
```

### Smart Alphabetical Grouping
The application features intelligent character normalization for Sanskrit texts:

```javascript
// Example: These books all group under "S"
"Śrī Brahma-saṁhitā"     // Ś → S
"Śrī Caitanya-caritāmṛta" // Ś → S
"Spirituality"            // S → S
"Śikṣāṣṭaka"             // Ś → S
```

### Performance Optimizations
- **Lazy Loading**: Components load on demand
- **Image Optimization**: WebP format with fallbacks
- **Bundle Splitting**: Optimized JavaScript chunks
- **Caching**: Proper cache headers for static assets

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Flexible Layouts**: CSS Grid and Flexbox
- **Touch Friendly**: Large touch targets and gestures
- **Cross-Browser**: Compatible with modern browsers

## 🛠️ Development

### Available Scripts

```bash
# Frontend development
cd pbb-frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint

# Docker operations
docker-compose up -d              # Start development environment
docker-compose -f docker-compose.prod.yml up -d  # Start production
docker-compose down               # Stop all services
docker-compose logs -f            # View logs
```

### Code Quality
- **ESLint**: JavaScript/React linting
- **Modern React**: Latest React 19 with hooks
- **Component Architecture**: Modular, reusable components
- **Error Boundaries**: Graceful error handling

## 🔒 Security

### Production Security Features
- **HTTPS Enforcement**: All traffic redirected to SSL
- **Security Headers**: XSS protection, CSRF prevention
- **Content Security Policy**: Script and resource restrictions
- **Certificate Management**: Automated Let's Encrypt integration

### API Security
- **CORS Configuration**: Controlled cross-origin access
- **Request Timeout**: 10-second timeout limits
- **Error Handling**: Secure error messages without sensitive data

## 📊 Monitoring & Logging

### Health Checks
- **Container Health**: Automated health monitoring
- **Service Dependencies**: Proper startup order
- **Resource Monitoring**: CPU and memory tracking

### Logging
- **Structured Logs**: JSON format with timestamps
- **Log Rotation**: Automatic log file management
- **API Logging**: Request/response tracking
- **Error Tracking**: Comprehensive error logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure Docker builds work correctly

## 📜 License

This project is part of the PureBhakti Base spiritual literature collection.

## 🙏 Acknowledgments

- **Pure Bhakti Base**: For providing the spiritual texts and content
- **Gaudiya Vedanta Publications**: For book content (CC BY-ND 3.0 license)
- **Gokul Bhajan Gaudiya Matha**: For supporting this spiritual technology initiative
- **React Community**: For the excellent development framework
- **Vite**: For lightning-fast build tooling
- **Tailwind CSS**: For beautiful, responsive styling

## 📜 License

- **Books & Content**: Licensed under CC BY-ND 3.0 by Gaudiya Vedanta Publications
- **Software**: Rights reserved by Gokul Bhajan Gaudiya Matha
- **Permissions**: [purebhakti.com/pluslicense](http://purebhakti.com/pluslicense) | gvp.contactus@gmail.com

---

**Generated with ❤️ using Claude Code**

Repository: [github.com/kamaldivi/pbb_web](https://github.com/kamaldivi/pbb_web)

For support or questions, please open an issue in the GitHub repository.