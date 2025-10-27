# Pure Bhakti Base - Project Structure

## Overview
This document outlines the folder structure and architecture for the Pure Bhakti Base web application - a comprehensive menu-driven platform for accessing spiritual texts with enhanced reading, search, and interactive features.

## Current Implementation Status
- ✅ **Fully implemented** menu-driven architecture with React Router
- ✅ **Responsive layout** with Header, Footer, and Navigation components
- ✅ **Book Reader** with anchor-style reading mode and immersive experience
- ✅ **Home Page** with book library, summaries, and modal views
- ✅ **Search features** including Glossary, Verse Lookup, and Book Search
- ✅ **Chat interface** for AI-powered spiritual text conversations
- ✅ **Advanced UI/UX** with collapsible panels, smooth animations, and modern styling

## Menu-Driven Architecture

### 7 Main Menu Items (All Implemented ✅)
1. **Home** - Library overview with book browser, summaries, and direct reader navigation
2. **Book Reader** - Immersive reading with anchor-style auto-scroll, TOC, and dual page navigation
3. **Book Search** - Search across all books and content
4. **Glossary** - Terminology and concept lookup with POST-based search API
5. **Verse Lookup** - Specific verse reference search across scriptures
6. **Chat** - AI-powered conversations with spiritual text context
7. **Tutorial** - Video tutorial link (external) for user guidance

## Recommended Folder Structure

```
pbb-frontend/
├── public/
│   ├── images/
│   │   ├── bhakti_base_logo.webp
│   │   ├── gurudev.jpg
│   │   └── radha_krishna_sevakunj.png
│   └── pbb_book_pages/
│       └── [existing book page images]
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx              # Shared header across all pages
│   │   │   ├── Footer.jsx              # Shared footer across all pages
│   │   │   ├── Navigation.jsx          # Main menu navigation
│   │   │   └── Layout.jsx              # Wrapper component for consistent layout
│   │   ├── shared/
│   │   │   ├── BookSelector.jsx        # 🌟 KEY: Reusable book selection component
│   │   │   ├── LoadingSpinner.jsx      # Loading states
│   │   │   ├── ErrorMessage.jsx        # Error handling
│   │   │   ├── SearchInput.jsx         # Reusable search input
│   │   │   └── Pagination.jsx          # Pagination controls
│   │   ├── book/
│   │   │   ├── BookCard.jsx            # Individual book display
│   │   │   ├── BookSlider.jsx          # Horizontal book carousel
│   │   │   ├── BookSummary.jsx         # Book overview and metadata
│   │   │   └── BookGrid.jsx            # Grid layout for book library
│   │   ├── reader/
│   │   │   ├── PageSelector.jsx        # Page navigation (current functionality)
│   │   │   ├── ImageViewer.jsx         # Book page image display
│   │   │   ├── ContentDisplay.jsx      # Text content display
│   │   │   ├── BookmarkButton.jsx      # Save reading progress
│   │   │   └── ReadingProgress.jsx     # Track reading position
│   │   ├── search/
│   │   │   ├── SearchFilters.jsx       # Advanced search filters
│   │   │   ├── SearchResults.jsx       # Display search results
│   │   │   └── AdvancedSearch.jsx      # Complex search interface
│   │   ├── verse/
│   │   │   ├── VerseCard.jsx           # Individual verse display
│   │   │   ├── VerseReference.jsx      # Citation and reference info
│   │   │   └── VerseCommentary.jsx     # Commentary and explanations
│   │   └── chat/
│   │       ├── ChatWindow.jsx          # Main chat interface
│   │       ├── MessageBubble.jsx       # Individual chat messages
│   │       ├── ChatInput.jsx           # Message input component
│   │       ├── ConversationList.jsx    # Chat history sidebar
│   │       ├── ChatSidebar.jsx         # Chat navigation
│   │       └── BookContextPanel.jsx    # Show selected books for context
│   ├── pages/
│   │   ├── HomePage.jsx                # Landing page with library overview
│   │   ├── BookReaderPage.jsx          # Enhanced reading experience
│   │   ├── BookSearchPage.jsx          # Search across books
│   │   ├── GlossarySearchPage.jsx      # Terminology lookup
│   │   ├── VerseLookupPage.jsx         # Verse reference search
│   │   ├── ChatPage.jsx                # AI chat with book context
│   │   └── TestbedPage.jsx             # Current functionality preserved
│   ├── hooks/
│   │   ├── useBooks.js                 # Book data management
│   │   ├── usePages.js                 # Page navigation logic
│   │   ├── useSearch.js                # Search functionality
│   │   ├── useBookmarks.js             # User bookmarks and progress
│   │   ├── useChat.js                  # Chat state management
│   │   ├── useBookSelector.js          # Shared book selection logic
│   │   └── useLocalStorage.js          # Browser storage utilities
│   ├── services/
│   │   ├── api.js                      # Base API configuration
│   │   ├── bookService.js              # Book-related API calls
│   │   ├── searchService.js            # Search API integration
│   │   ├── glossaryService.js          # Glossary data service
│   │   ├── verseService.js             # Verse lookup service
│   │   └── chatService.js              # Chat/AI API integration
│   ├── utils/
│   │   ├── constants.js                # Application constants
│   │   ├── helpers.js                  # Utility functions
│   │   ├── formatters.js               # Data formatting utilities
│   │   └── validators.js               # Input validation
│   ├── context/
│   │   ├── AppContext.jsx              # Global application state
│   │   ├── BookContext.jsx             # Book-related state
│   │   ├── SearchContext.jsx           # Search state management
│   │   └── ChatContext.jsx             # Chat state and history
│   ├── styles/
│   │   ├── globals.css                 # Global styles
│   │   ├── components.css              # Component-specific styles
│   │   └── utilities.css               # Utility classes
│   ├── App.jsx                         # Main application component
│   ├── main.jsx                        # Application entry point
│   └── router.jsx                      # Route configuration
├── package.json
└── vite.config.js
```

## Key Architectural Decisions

### 1. Shared Components Strategy
- **BookSelector**: Core reusable component for book selection across all features
- **Layout Components**: Consistent header, footer, and navigation
- **Common UI**: Reusable loading, error, and form components

### 2. Feature-Based Organization
- Each major feature (reader, search, chat) has dedicated component folders
- Page components orchestrate feature-specific functionality
- Services provide clean API abstraction per domain

### 3. State Management
- React Context for global state (books, user preferences)
- Custom hooks for reusable state logic
- Local state for component-specific interactions

### 4. BookSelector Component Specifications

The BookSelector is the cornerstone shared component with these features:

```jsx
<BookSelector
  selectedBooks={[]}           // Current selection(s)
  onBookSelect={handleSelect}  // Selection callback
  multiSelect={false}          // Single vs multiple selection
  showSearch={true}            // Include search functionality
  showAlphabet={true}          // Show A-Z navigation
  showCategories={false}       // Category filtering
  showRecent={true}            // Recent books section
  showBookmarks={true}         // Bookmarked books
  placeholder="Select books..."
  className="custom-styles"
/>
```

### Usage Across Features:
- **Book Reader**: Select single book to read
- **Book Search**: Filter search within specific books
- **Glossary Search**: Limit glossary to selected books
- **Verse Lookup**: Find verses within chosen books
- **Chat**: Provide book context for AI conversations
- **Home Page**: Feature different book collections

## Routing Structure (Implemented ✅)

```
/                    → HomePage (book library and summaries)
/reader             → BookReaderPage (with ?book_id parameter support)
/books              → BookSearchPage (search across books)
/glossary           → GlossarySearchPage (terminology lookup)
/verses             → VerseLookupPage (scripture verse search)
/chat               → ChatPage (AI conversations)
/testbed            → TestbedPage (development/testing)
```

## Technology Stack (Fully Implemented ✅)

### Core Technologies
- **Framework**: React 19.1.1 with Hooks (useState, useEffect, useRef)
- **Build Tool**: Vite 7.1.2
- **Styling**: TailwindCSS 4.1.13 with custom gradients and animations
- **HTTP Client**: Axios 1.12.1
- **Routing**: React Router DOM 7.1.3 (implemented)
- **State Management**: React built-in state (useState, useRef, URL parameters)

### Key Features Implemented
- **Anchor Navigation**: Smooth scroll with `scrollIntoView` API
- **URL Parameters**: Book selection via `?book_id=X` query strings
- **Component Architecture**: Modular, reusable components with clear separation
- **API Integration**: RESTful API calls with proper error handling
- **Responsive Design**: Mobile-first approach with Tailwind utilities

## Implementation Progress

### ✅ Phase 1: Foundation (Completed)
1. ✅ Implemented routing and navigation structure (React Router DOM)
2. ✅ Created Header/Footer/Layout shared components
3. ✅ Built reusable BookSelector component
4. ✅ Converted testbed to enhanced BookReaderPage with anchor navigation

### ✅ Phase 2: Core Features (Completed)
1. ✅ Implemented HomePage with book library, search, and modal summaries
2. ✅ Added BookSearchPage functionality
3. ✅ Created GlossarySearchPage with POST-based API
4. ✅ Developed VerseLookupPage for scripture search

### ✅ Phase 3: Advanced Features (Completed)
1. ✅ Implemented ChatPage with AI integration
2. ✅ Added anchor-style reading mode with Top navigation tab
3. ✅ Enhanced UI with collapsible panels (book selector, TOC)
4. ✅ Integrated Tutorial link in navigation menu
5. ✅ Added dual page navigation (top and bottom controls)

### 🔄 Phase 4: Future Enhancements (Planned)
1. ⏳ Bookmark and reading progress tracking
2. ⏳ User authentication and preferences
3. ⏳ Offline support for books
4. ⏳ Advanced search filters and facets
5. ⏳ Performance optimization for large book collections
6. ⏳ Accessibility improvements (ARIA labels, keyboard navigation)

## Benefits of This Structure

1. **Maintainability**: Clear separation of concerns
2. **Reusability**: Shared components reduce duplication
3. **Scalability**: Easy to add new features
4. **Consistency**: Unified user experience across features
5. **Developer Experience**: Intuitive folder organization
6. **Testing**: Isolated components for better testing

## Key Architectural Highlights

### Anchor-Style Reading Mode
The signature feature of BookReaderPage that provides immersive reading:

**Trigger Scenarios:**
1. Book selected from HomePage (URL parameter: `?book_id=X`)
2. Book selected from top Book Selection Panel
3. Page navigation via Previous/Next buttons

**Behavior:**
- Smooth scroll to reading anchor point (`readerAnchorRef`)
- Hides header, navigation, and book selector from view
- Shows only Book Reader + Table of Contents
- Displays fixed "Top" side tab for returning to full layout

**Implementation:**
```javascript
const scrollToReadingMode = () => {
  if (readerAnchorRef.current) {
    readerAnchorRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    setShowTopTab(true);
  }
};
```

### BookSelector Component
Reusable across multiple pages with configurable options:
- Single or multi-select mode
- Integrated search functionality
- Alphabetical grouping with Sanskrit character normalization
- Recent books and bookmarks support

## Future Considerations

### Potential Enhancements
1. **User Authentication**: Add accounts for personalized bookmarks and reading progress
2. **Offline Support**: Progressive Web App (PWA) with service workers for offline reading
3. **Search Optimization**: Consider Elasticsearch or Algolia for advanced full-text search
4. **Performance**: Implement virtual scrolling for large book lists
5. **Mobile App**: React Native version for iOS/Android
6. **Analytics**: Track reading patterns and popular books

### Open Questions
1. Should we implement reading statistics and goals?
2. Do we need annotation and highlighting features?
3. Should users be able to share bookmarks or reading lists?
4. Is multi-language support needed for UI elements?

---

**Last Updated**: 2025-10-27
**Status**: Production-ready with active development
**Repository**: [github.com/kamaldivi/pbb_web](https://github.com/kamaldivi/pbb_web)