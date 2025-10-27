# Pure Bhakti Base - Project Structure Recommendation

## Overview
This document outlines the recommended folder structure for converting the Pure Bhakti Base application into a menu-driven web application with enhanced functionality.

## Current State
- Single-page application focused on book reading (testbed functionality)
- React + Vite + TailwindCSS stack
- Basic book selection and page viewing capabilities

## Proposed Menu-Driven Architecture

### 7 Main Menu Items
1. **Home Page** - Library overview with book summaries
2. **Book Reader** - Enhanced reading experience with current testbed functionality
3. **Book Search** - Search across all books and content
4. **Glossary Search** - Terminology and concept lookup
5. **Verse Lookup** - Specific verse reference search
6. **Chat** - AI-powered conversations with book context
7. **Testbed** - Current functionality preserved for development

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

## Routing Structure

```
/                    → HomePage
/reader             → BookReaderPage
/search/books       → BookSearchPage
/search/glossary    → GlossarySearchPage
/verses             → VerseLookupPage
/chat               → ChatPage
/testbed            → TestbedPage (development)
```

## Technology Stack

### Current (Preserved)
- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **Styling**: TailwindCSS 4.1.13
- **HTTP Client**: Axios 1.12.1

### Additions Needed
- **Routing**: React Router DOM
- **State Management**: React Context (built-in)
- **Chat Integration**: WebSocket or Server-Sent Events
- **Search**: Full-text search capability

## Implementation Strategy

### Phase 1: Foundation
1. Implement routing and navigation structure
2. Extract header/footer into shared layout components
3. Create BookSelector component
4. Convert current testbed to BookReaderPage

### Phase 2: Core Features
1. Implement HomePage with book library
2. Add BookSearchPage functionality
3. Create basic GlossarySearchPage
4. Develop VerseLookupPage

### Phase 3: Advanced Features
1. Implement ChatPage with AI integration
2. Add bookmark and progress tracking
3. Enhance search with advanced filters
4. Add user preferences and settings

### Phase 4: Enhancement
1. Performance optimization
2. Mobile responsiveness
3. Accessibility improvements
4. Advanced chat features

## Benefits of This Structure

1. **Maintainability**: Clear separation of concerns
2. **Reusability**: Shared components reduce duplication
3. **Scalability**: Easy to add new features
4. **Consistency**: Unified user experience across features
5. **Developer Experience**: Intuitive folder organization
6. **Testing**: Isolated components for better testing

## Questions for Team Discussion

1. **Chat Integration**: What AI/chat service should we integrate with?
2. **Search Backend**: Do we need a dedicated search service (Elasticsearch, etc.)?
3. **User Authentication**: Should we add user accounts for bookmarks/progress?
4. **Mobile Strategy**: Native app or responsive web design priority?
5. **Offline Support**: Should books be available offline?
6. **Performance**: Any specific performance requirements for large book collections?

## Next Steps

1. Review and discuss this structure with the team
2. Create detailed technical specifications for each component
3. Set up development environment with routing
4. Begin Phase 1 implementation
5. Establish coding standards and component guidelines

---

*This document serves as a foundation for team discussion and can be modified based on feedback and technical requirements.*