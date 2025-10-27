# PureBhakti Base Test Bed

A comprehensive web application for browsing and reading spiritual texts from the PureBhakti Base collection. This project provides a beautiful, responsive interface for accessing Sanskrit and spiritual literature with support for transliterated text and high-quality book page images.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)

## ✨ Features

### 📚 Book Management
- **Smart Book Selection**: Intuitive book browser with search functionality
- **Alphabetical Grouping**: Intelligent grouping that combines English and transliterated Sanskrit characters (Ś, Ḍ, Ū, etc.) under their base letters
- **Multi-format Support**: Handles various book title formats and metadata

### 🔤 Sanskrit & Transliteration Support
- **Advanced Character Normalization**: Books starting with "Śrī" group under "S", "Ḍāmodara" under "D"
- **Comprehensive Diacritic Mapping**: Supports 100+ Sanskrit transliteration characters
- **Unicode Compatibility**: Proper handling of macrons, dots, and accent marks

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Glass Morphism**: Beautiful backdrop blur effects and modern styling
- **Smooth Animations**: Elegant transitions and hover effects
- **Dark/Light Theme Ready**: CSS variables for easy theme switching

### 🖼️ Book Reading Experience
- **High-Quality Images**: WebP format for optimized loading
- **Page Navigation**: Intuitive page selector with preview
- **Content Display**: Support for both text content and page images
- **Loading States**: Smooth loading spinners and error handling

## 🏗️ Architecture

### Frontend (React + Vite)
```
pbb-frontend/
├── src/
│   ├── components/
│   │   ├── BookSlider.jsx      # Smart book selection with grouping
│   │   ├── PageSelector.jsx    # Page navigation component
│   │   ├── ContentDisplay.jsx  # Book content viewer
│   │   ├── ImageViewer.jsx     # Optimized image display
│   │   ├── LoadingSpinner.jsx  # Loading states
│   │   └── ErrorMessage.jsx    # Error handling
│   ├── services/
│   │   └── api.js             # API service layer
│   └── App.jsx                # Main application
├── public/
│   ├── images/                # Static images
│   └── pbb_book_pages/       # Book page assets
└── Dockerfile                # Multi-stage production build
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
   git clone https://github.com/kamaldivi/pbb_test_bed.git
   cd pbb_test_bed
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
pbb_test_bed/
├── pbb-frontend/              # React application
│   ├── src/                   # Source code
│   ├── public/                # Static assets
│   ├── dist/                  # Production build
│   └── Dockerfile             # Frontend container
├── nginx/                     # Nginx configurations
│   └── nginx-ssl.conf         # SSL-enabled config
├── ssl/                       # SSL certificates
│   ├── purebhaktibase.com.crt
│   ├── purebhaktibase.com.key
│   └── trusted/               # Certificate chain
├── certbot/                   # Let's Encrypt automation
├── docker-compose.yml         # Development environment
├── docker-compose.prod.yml    # Production environment
└── README.md                  # This file
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
The frontend integrates with a PureBhakti Base API:
```javascript
// API Endpoints
GET /api/v1/books                    # List all books
GET /api/v1/books/{id}/pages/core    # Get book pages
GET /api/v1/books/{id}/content/{page} # Get page content
```

## 🎯 Key Features Deep Dive

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

- **PureBhakti Base**: For providing the spiritual texts and content
- **React Community**: For the excellent development framework
- **Vite**: For lightning-fast build tooling
- **Tailwind CSS**: For beautiful, responsive styling

---

**Generated with ❤️ using Claude Code**

For support or questions, please open an issue in the GitHub repository.