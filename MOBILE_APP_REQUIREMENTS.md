# Pure Bhakti Base Mobile App - Requirements Documentation

## Project Overview

**Application Name:** Pure Bhakti Base Mobile App
**Target Platforms:** iOS and Android (React Native)
**Initial Release Features:** Library, Reader, Reader Page Navigation
**Base Project:** pbb_web codebase
**Web Application:** pbb-frontend (React + Vite)

---

## 1. Executive Summary

The Pure Bhakti Base mobile application is a spiritual library app that provides users with access to a collection of sacred texts, books, and magazines. The initial release focuses on three core features:

1. **Library** - Browse and discover books organized by category
2. **Reader** - Read book pages with an immersive experience
3. **Reader Page Navigation** - Navigate through book pages with multiple methods

This document extracts requirements from the existing web application to define the mobile app specifications.

---

## 2. LIBRARY FEATURE REQUIREMENTS

### 2.1 Overview
The Library is the main entry point where users browse and select books from the Pure Bhakti Base collection.

### 2.2 Functional Requirements

#### 2.2.1 Book Organization
- **FR-LIB-001**: The Library SHALL organize books into three categories via tabs:
  - English Books
  - Tamil Books
  - Rays of The Harmonist (magazine collection)

- **FR-LIB-002**: The Library SHALL display a count badge on each tab showing the number of books in that category

- **FR-LIB-003**: The Library SHALL persist the active tab selection in navigation state/URL parameters

- **FR-LIB-004**: When returning from the Reader, the Library SHALL restore the previously active tab

#### 2.2.2 Book Display
- **FR-LIB-005**: Books SHALL be displayed in a grid layout with the following attributes:
  - Book thumbnail image (aspect ratio 3:4)
  - Book title (original_book_title or english_book_title)
  - "View Details" button

- **FR-LIB-006**: Books SHALL be sorted alphabetically by `original_book_title` within each category

- **FR-LIB-007**: Book thumbnails SHALL be loaded from: `/pbb_book_thumbnails/{bookId}.jpg`

- **FR-LIB-008**: If a thumbnail fails to load, a fallback icon SHALL be displayed with gradient background

- **FR-LIB-009**: Grid layout SHALL be responsive:
  - Mobile: 2 columns
  - Tablet: 3-4 columns
  - Desktop: 6 columns (reference only)

#### 2.2.3 Search Functionality
- **FR-LIB-010**: The Library SHALL provide a search bar scoped to the active tab

- **FR-LIB-011**: Search SHALL filter books by title (case-insensitive partial match)

- **FR-LIB-012**: Search SHALL clear when switching tabs

- **FR-LIB-013**: The Library SHALL display:
  - "No books found" message when search returns no results
  - Clear search button (X) when search term exists

#### 2.2.4 Book Details Modal
- **FR-LIB-014**: Tapping "View Details" SHALL open a modal displaying:
  - Book thumbnail (larger size)
  - Book title
  - Original author (if available)
  - Commentary author (if available)
  - Book summary
  - Action buttons: "Close", "Download PDF" (if available), "Read Book"

- **FR-LIB-015**: The "Read Book" button SHALL navigate to the Reader with the selected book

- **FR-LIB-016**: The "Download PDF" button SHALL download the PDF file from: `/pbb_pdf_files/{pdf_name}`

#### 2.2.5 Book Selection
- **FR-LIB-017**: Tapping a book card SHALL navigate directly to the Reader

- **FR-LIB-018**: Navigation SHALL pass the `book_id` parameter to the Reader

#### 2.2.6 Announcements
- **FR-LIB-019**: The Library MAY display announcement banners above the collection (optional for MVP)

### 2.3 Data Model

#### Book Object Structure
```javascript
{
  id: number | string,              // Primary identifier
  book_id: number,                  // Alternative identifier
  original_book_title: string,      // Primary title
  english_book_title: string,       // Fallback title
  book_type: string,                // Category: "english" | "tamil" | "rays"
  original_author: string,          // Original author name
  commentary_author: string,        // Commentary author name
  book_summary: string,             // Book description
  pdf_name: string,                 // PDF filename for download
  total_pages: number              // Total page count
}
```

### 2.4 API Integration

#### GET /api/v1/books
**Purpose:** Retrieve all books with pagination support

**Request:**
```
GET /api/v1/books?page=1&size=100
```

**Response:**
```javascript
{
  books: Array<Book>,
  total: number,
  size: number,
  page: number
}
```

**Notes:**
- The app SHALL fetch all pages automatically (paginated API)
- First request gets page 1, then fetches remaining pages if `total > size`

### 2.5 UI/UX Requirements

#### 2.5.1 Visual Design
- **UI-LIB-001**: Use card-based design with rounded corners and shadows
- **UI-LIB-002**: Implement smooth transitions when switching tabs
- **UI-LIB-003**: Show loading spinner while fetching books
- **UI-LIB-004**: Display error message with retry button on API failure
- **UI-LIB-005**: Use gradient backgrounds (blue/cyan theme)

#### 2.5.2 Interactions
- **UI-LIB-006**: Tapping a book card SHALL provide visual feedback (scale/opacity)
- **UI-LIB-007**: Search input SHALL have clear icon when text is present
- **UI-LIB-008**: Tab selection SHALL be visually distinct with underline/highlight

#### 2.5.3 Empty States
- **UI-LIB-009**: Display empty state when no books exist in category:
  - Icon (book icon)
  - Message: "[Category] Coming Soon"
  - Subtitle: "We're working on adding books to this collection"

- **UI-LIB-010**: Display "No books found" state for empty search results with search icon

### 2.6 Mobile-Specific Considerations

#### 2.6.1 Performance
- **PERF-LIB-001**: Implement lazy loading for book thumbnails
- **PERF-LIB-002**: Cache book list locally to reduce API calls
- **PERF-LIB-003**: Optimize image loading with appropriate compression
- **PERF-LIB-004**: Implement pull-to-refresh for book list updates

#### 2.6.2 Offline Support
- **OFF-LIB-001**: Cache book metadata for offline browsing (nice-to-have)
- **OFF-LIB-002**: Display cached thumbnails when offline (nice-to-have)
- **OFF-LIB-003**: Show offline indicator when network unavailable

#### 2.6.3 Native Features
- **NAT-LIB-001**: Support native share functionality for book details
- **NAT-LIB-002**: Implement native PDF download and storage
- **NAT-LIB-003**: Use native modal transitions for book details

---

## 3. READER FEATURE REQUIREMENTS

### 3.1 Overview
The Reader provides an immersive book reading experience with page images, table of contents navigation, and bookmarking capabilities.

### 3.2 Functional Requirements

#### 3.2.1 Book Loading
- **FR-READ-001**: The Reader SHALL accept `book_id` and optional `page` parameters from navigation

- **FR-READ-002**: The Reader SHALL load the following data on book selection:
  - Book metadata
  - Table of Contents (TOC)
  - Page list with page numbers and labels
  - Initial page image

- **FR-READ-003**: If `page` parameter exists in URL, the Reader SHALL navigate to that specific page

- **FR-READ-004**: If no `page` parameter exists, the Reader SHALL default to page 1

#### 3.2.2 Layout Structure
- **FR-READ-005**: The Reader SHALL implement a two-panel layout:
  - Left panel: Table of Contents (collapsible)
  - Right panel: Page viewer with navigation bars

- **FR-READ-006**: On mobile devices, the TOC panel SHALL be:
  - Hidden by default with a toggle button visible
  - Displayed as overlay/drawer when opened
  - Closeable with back gesture or close button

#### 3.2.3 Page Display
- **FR-READ-007**: Book pages SHALL be displayed as WebP images loaded from:
  - `/pbb_book_pages/{bookId}/{pageNumber}.webp`

- **FR-READ-008**: The page viewer SHALL:
  - Display a loading spinner while image loads
  - Show error state if image fails to load
  - Support pinch-to-zoom on mobile
  - Display page in fullscreen mode

- **FR-READ-009**: Pages SHALL maintain aspect ratio and fit within viewport

#### 3.2.4 Table of Contents (TOC)
- **FR-READ-010**: The TOC SHALL display a hierarchical tree structure with:
  - Expandable/collapsible nodes
  - Indentation based on hierarchy level
  - Visual indicators for expandable items (chevron icon)

- **FR-READ-011**: TOC items with page numbers SHALL be clickable links

- **FR-READ-012**: Clicking a TOC item SHALL:
  - Navigate to the corresponding page
  - Highlight the active item (optional)
  - Auto-scroll to reading section

- **FR-READ-013**: The TOC SHALL show loading state while fetching

- **FR-READ-014**: The TOC SHALL be collapsible via toggle button

#### 3.2.5 Fullscreen Mode
- **FR-READ-015**: The Reader SHALL support fullscreen mode for page images

- **FR-READ-016**: In fullscreen mode:
  - Image SHALL fill the screen with max dimensions
  - Navigation controls SHALL be overlaid (prev/next buttons)
  - Page info footer SHALL display at bottom
  - Close button SHALL be available (top-right)
  - Keyboard shortcuts SHALL work (←/→ arrows, Esc)

- **FR-READ-017**: Fullscreen mode SHALL be toggleable via button or double-tap gesture

#### 3.2.6 Empty State
- **FR-READ-018**: When no book is selected, display:
  - Book icon
  - "Book Reader" heading
  - Message: "Please select a book from the library"
  - "Browse Library" button linking to Library

### 3.3 Data Model

#### TOC Object Structure
```javascript
{
  table_of_contents: [
    {
      toc_id: number,               // Unique TOC entry ID
      parent_toc_id: number | null, // Parent ID for hierarchy
      toc_label: string,            // Display text
      page_number: number | null,   // Target page (null for headers)
      level: number                 // Hierarchy depth
    }
  ]
}
```

#### Page Object Structure
```javascript
{
  page_number: number,    // Sequential page number (1, 2, 3...)
  page_label: string,     // Display label ("i", "ii", "xxvii", "1", etc.)
  page_type: string       // Optional: "front_matter" | "content" | "back_matter"
}
```

#### Pages Response Structure
```javascript
{
  page_maps: Array<Page>,
  total: number
}
```

### 3.4 API Integration

#### GET /api/v1/books/{id}/toc
**Purpose:** Retrieve table of contents for a book

**Response:**
```javascript
{
  table_of_contents: Array<TOCItem>
}
```

#### GET /api/v1/books/{id}/pages
**Purpose:** Retrieve page list with labels

**Response:**
```javascript
{
  page_maps: Array<PageMap>,
  total: number
}
```

### 3.5 UI/UX Requirements

#### 3.5.1 Visual Design
- **UI-READ-001**: Use immersive design with minimal chrome
- **UI-READ-002**: TOC panel SHALL have gradient background with glassmorphism effect
- **UI-READ-003**: Page viewer SHALL have white background
- **UI-READ-004**: Loading states SHALL use animated spinners
- **UI-READ-005**: Error states SHALL display friendly messages with retry option

#### 3.5.2 Interactions
- **UI-READ-006**: Smooth scrolling when navigating via TOC
- **UI-READ-007**: Smooth transitions when changing pages
- **UI-READ-008**: Swipe gestures for page navigation (left/right)
- **UI-READ-009**: Pinch-to-zoom on page images
- **UI-READ-010**: Double-tap to enter/exit fullscreen

#### 3.5.3 Responsive Behavior
- **UI-READ-011**: On mobile portrait: TOC as drawer overlay
- **UI-READ-012**: On mobile landscape: Side-by-side TOC and page (optional)
- **UI-READ-013**: On tablet: Side-by-side TOC and page (default)

### 3.6 Mobile-Specific Considerations

#### 3.6.1 Performance
- **PERF-READ-001**: Preload next/previous page images for smooth navigation
- **PERF-READ-002**: Cache recently viewed pages
- **PERF-READ-003**: Use progressive image loading (blur-up technique)
- **PERF-READ-004**: Optimize memory usage by limiting cached images

#### 3.6.2 Gestures
- **GEST-READ-001**: Swipe left to go to next page
- **GEST-READ-002**: Swipe right to go to previous page
- **GEST-READ-003**: Pinch-to-zoom on page images
- **GEST-READ-004**: Double-tap to toggle fullscreen
- **GEST-READ-005**: Swipe from left edge to open TOC drawer

#### 3.6.3 Native Features
- **NAT-READ-001**: Support device orientation changes
- **NAT-READ-002**: Respect system-level zoom settings
- **NAT-READ-003**: Support dark mode (optional for v1)

---

## 4. READER PAGE NAVIGATION REQUIREMENTS

### 4.1 Overview
Page Navigation provides multiple methods for users to navigate through book pages efficiently.

### 4.2 Functional Requirements

#### 4.2.1 Navigation Bar Placement
- **FR-NAV-001**: Navigation bars SHALL appear both above and below the page viewer

- **FR-NAV-002**: Both navigation bars SHALL remain visible and synchronized

- **FR-NAV-003**: On mobile, navigation bars SHALL be sticky (fixed position)

#### 4.2.2 Navigation Controls
The navigation bar SHALL include the following controls:

**Previous/Next Buttons**
- **FR-NAV-004**: "Previous" button navigates to previous page (disabled on page 1)
- **FR-NAV-005**: "Next" button navigates to next page (disabled on last page)
- **FR-NAV-006**: Disabled buttons SHALL be visually distinct (grayed out)

**Page Display**
- **FR-NAV-007**: Display current page information:
  - Book title
  - Page label if available: "Page xxvii (56 of 204)"
  - Or page number only: "Page 56 of 204"

**Go To Page Button**
- **FR-NAV-008**: "Go To Page" button opens a dialog/modal
- **FR-NAV-009**: Dialog SHALL allow input of:
  - Page label (e.g., "xxvii", "a1", "32")
  - Page number (e.g., "56")
- **FR-NAV-010**: Dialog SHALL validate input and show error for invalid pages
- **FR-NAV-011**: Dialog SHALL support keyboard submission (Enter key)
- **FR-NAV-012**: Dialog SHALL dismiss on Cancel, Submit, or outside click

**Fullscreen Button**
- **FR-NAV-013**: Fullscreen button toggles fullscreen mode for page image
- **FR-NAV-014**: Button icon SHALL indicate current state

**Bookmark Button**
- **FR-NAV-015**: Bookmark button allows saving current page
- **FR-NAV-016**: Button SHALL show visual state: bookmarked vs not bookmarked
- **FR-NAV-017**: Clicking bookmarked page SHALL allow editing/removing bookmark

**Share Button**
- **FR-NAV-018**: Share button opens share menu with options:
  - WhatsApp
  - Email
  - Copy Link
- **FR-NAV-019**: Share SHALL generate deep link: `/reader?book_id={id}&page={page}`
- **FR-NAV-020**: Share message SHALL include:
  - Book title
  - Page information
  - Inspirational message
  - Deep link URL

#### 4.2.3 Page Navigation Methods

The Reader SHALL support the following navigation methods:

1. **Previous/Next Buttons** (FR-NAV-004, FR-NAV-005)
2. **Go To Page Dialog** (FR-NAV-008 - FR-NAV-012)
3. **Table of Contents Links** (see Reader TOC requirements)
4. **Swipe Gestures** (mobile-specific)
5. **Keyboard Shortcuts** (fullscreen mode: ← → Esc)
6. **Deep Links** (from Library, Bookmarks, Share)

#### 4.2.4 Page Label System
- **FR-NAV-021**: Support multiple page label formats:
  - Roman numerals (lowercase): i, ii, iii, xxvii
  - Letters: a, b, c
  - Numbers: 1, 2, 3
  - Special formats: a1, b12

- **FR-NAV-022**: Page label search SHALL be case-insensitive

- **FR-NAV-023**: If page label not found, try parsing as page number

#### 4.2.5 Auto-Scroll Behavior
- **FR-NAV-024**: After page change via TOC, SHALL auto-scroll to page viewer

- **FR-NAV-025**: After book selection, SHALL auto-scroll to reading section

- **FR-NAV-026**: "Back to Top" button SHALL appear when scrolled down (web behavior - may not apply to mobile)

### 4.3 Data Requirements

#### Share URL Structure
```
https://purebhaktibase.com/reader?book_id={bookId}&page={pageNumber}
```

#### Share Message Template
```
A glimpse into the eternal teachings of Śrīla Bhaktivedānta Nārāyaṇa Gosvāmī Mahārāja — from Pure Bhakti Base.

{bookTitle} - Page {pageLabel}
{shareUrl}
```

### 4.4 UI/UX Requirements

#### 4.4.1 Visual Design
- **UI-NAV-001**: Navigation bar SHALL have gradient background with glassmorphism
- **UI-NAV-002**: Buttons SHALL have hover/active states with visual feedback
- **UI-NAV-003**: Page info SHALL be centered and prominent
- **UI-NAV-004**: Tooltips SHALL appear on button hover (desktop)
- **UI-NAV-005**: Use blue color scheme matching app theme

#### 4.4.2 Interactions
- **UI-NAV-006**: Button press SHALL provide haptic feedback (mobile)
- **UI-NAV-007**: Disabled buttons SHALL not respond to clicks
- **UI-NAV-008**: Share menu SHALL close after action selection
- **UI-NAV-009**: "Link Copied" confirmation SHALL appear briefly

#### 4.4.3 Responsive Behavior
- **UI-NAV-010**: On mobile, reduce button sizes and spacing
- **UI-NAV-011**: On mobile, show icons only (hide text labels)
- **UI-NAV-012**: On tablet/desktop, show both icons and labels
- **UI-NAV-013**: Go To Page dialog SHALL be full-width on mobile

#### 4.4.4 Accessibility
- **UI-NAV-014**: All buttons SHALL have descriptive aria-labels
- **UI-NAV-015**: Navigation SHALL be keyboard accessible
- **UI-NAV-016**: Focus states SHALL be clearly visible
- **UI-NAV-017**: Screen reader support for page information

### 4.5 Mobile-Specific Considerations

#### 4.5.1 Native Navigation Patterns
- **NAT-NAV-001**: Use native modal for "Go To Page" dialog
- **NAT-NAV-002**: Use native share sheet for sharing
- **NAT-NAV-003**: Support native back button behavior
- **NAT-NAV-004**: Implement swipe-back gesture

#### 4.5.2 Gesture Controls
- **GEST-NAV-001**: Swipe left/right for prev/next page
- **GEST-NAV-002**: Long press page for options menu
- **GEST-NAV-003**: Pinch-to-zoom on page image
- **GEST-NAV-004**: Double-tap to toggle fullscreen

#### 4.5.3 Share Integration
- **NAT-NAV-005**: Use iOS/Android native share functionality
- **NAT-NAV-006**: Generate platform-specific share messages
- **NAT-NAV-007**: Support app-to-app sharing (WhatsApp, email, etc.)
- **NAT-NAV-008**: Copy link to clipboard with confirmation

#### 4.5.4 Performance
- **PERF-NAV-001**: Debounce rapid page navigation to prevent overload
- **PERF-NAV-002**: Cancel pending image loads when navigating away
- **PERF-NAV-003**: Optimize re-renders on page changes

---

## 5. BOOKMARKING REQUIREMENTS

### 5.1 Overview
Bookmarking allows users to save their reading progress and favorite pages for quick access.

### 5.2 Functional Requirements

#### 5.2.1 Bookmark Creation
- **FR-BM-001**: Users SHALL be able to bookmark any page in any book

- **FR-BM-002**: Bookmark button SHALL be integrated in the page navigation bar

- **FR-BM-003**: Clicking bookmark button SHALL:
  - Create a new bookmark if page not bookmarked
  - Show edit options if page already bookmarked

- **FR-BM-004**: Bookmark creation SHALL capture:
  - Book ID
  - Book title
  - Page number
  - Optional custom name
  - Timestamp (created, updated)

#### 5.2.2 Bookmark Management
- **FR-BM-005**: Users SHALL be able to edit bookmark custom names

- **FR-BM-006**: Users SHALL be able to delete bookmarks

- **FR-BM-007**: System SHALL prevent duplicate bookmarks (same book + page)

- **FR-BM-008**: System SHALL support multiple bookmarks per book (different pages)

#### 5.2.3 Bookmark Storage
- **FR-BM-009**: Bookmarks SHALL be stored locally (no authentication required)

- **FR-BM-010**: Use localStorage on web, AsyncStorage/SecureStore on mobile

- **FR-BM-011**: Bookmarks SHALL persist across app sessions

- **FR-BM-012**: Bookmarks SHALL support export/import (JSON format)

#### 5.2.4 Bookmark Navigation
- **FR-BM-013**: Clicking a bookmark SHALL navigate to the Reader with:
  - Correct book selected
  - Correct page loaded

### 5.3 Data Model

#### Bookmark Object Structure
```javascript
{
  id: string,              // Unique bookmark ID: "bm_{timestamp}_{random}"
  bookId: number,          // Book ID
  bookTitle: string,       // Book title for display
  pageNumber: number,      // Page number
  customName: string,      // Optional custom name
  createdAt: string,       // ISO 8601 timestamp
  updatedAt: string        // ISO 8601 timestamp
}
```

### 5.4 Storage Service

The bookmark service SHALL provide the following operations:

- **getBookmarks()**: Retrieve all bookmarks
- **addBookmark(data)**: Create or update bookmark
- **deleteBookmark(id)**: Remove bookmark
- **isPageBookmarked(bookId, page)**: Check if page is bookmarked
- **updateBookmark(id, customName)**: Update bookmark name
- **getBookmarksByBook(bookId)**: Get all bookmarks for a book
- **exportBookmarks()**: Export as JSON string
- **importBookmarks(json)**: Import from JSON (merge with existing)
- **clearAllBookmarks()**: Delete all bookmarks

### 5.5 UI/UX Requirements

#### 5.5.1 Bookmark Button States
- **UI-BM-001**: Not bookmarked: Outline bookmark icon
- **UI-BM-002**: Bookmarked: Filled bookmark icon (blue)
- **UI-BM-003**: Hover/press: Scale animation and color change

#### 5.5.2 Bookmark Dialog
- **UI-BM-004**: Edit dialog SHALL show:
  - Book title
  - Page information
  - Custom name input field
  - Save and Delete buttons

- **UI-BM-005**: Custom name SHALL be optional with placeholder text

---

## 6. TECHNICAL ARCHITECTURE

### 6.1 Technology Stack

#### Mobile Framework
- **React Native** (recommended) or Flutter
- Target: iOS 13+ and Android 8+

#### State Management
- Context API + Hooks (for consistency with web app)
- Or Redux Toolkit (for complex state needs)

#### Navigation
- React Navigation (React Native)
- Support for deep linking

#### Storage
- AsyncStorage for app data
- SecureStore for sensitive data (if needed)
- SQLite for advanced caching (optional)

#### Image Handling
- React Native Fast Image (caching and performance)
- React Native Image Zoom Viewer (pinch-to-zoom)

#### Networking
- Axios (consistent with web app)
- React Query or SWR for data fetching and caching

### 6.2 API Configuration

#### Base URL
- Dynamic base URL based on environment
- Development: `https://dev.purebhaktibase.com:8443`
- Production: `https://purebhaktibase.com:8443`

#### Endpoints (Same as Web)
```
GET  /api/v1/books                      - List books (paginated)
GET  /api/v1/books/{id}/pages           - Get book pages
GET  /api/v1/books/{id}/content/{page}  - Get page content
GET  /api/v1/books/{id}/toc             - Get table of contents
```

#### Static Assets
```
/pbb_book_thumbnails/{bookId}.jpg       - Book covers
/pbb_book_pages/{bookId}/{page}.webp    - Book pages
/pbb_pdf_files/{pdfName}                - Downloadable PDFs
```

### 6.3 App Structure

```
/src
  /screens
    LibraryScreen.tsx          - Library feature
    ReaderScreen.tsx           - Reader feature
    BookmarksScreen.tsx        - Bookmarks list (future)
  /components
    /library
      BookGrid.tsx             - Book grid display
      BookCard.tsx             - Individual book card
      BookDetailsModal.tsx     - Book details modal
      TabBar.tsx               - Category tabs
      SearchBar.tsx            - Search input
    /reader
      PageViewer.tsx           - Page image viewer
      TableOfContents.tsx      - TOC tree component
      PageNavigation.tsx       - Navigation bar
      FullscreenViewer.tsx     - Fullscreen mode
      BookmarkButton.tsx       - Bookmark control
    /shared
      LoadingSpinner.tsx       - Loading indicator
      ErrorMessage.tsx         - Error display
  /services
    api.ts                     - API client
    bookmarkService.ts         - Bookmark CRUD
    storageService.ts          - AsyncStorage wrapper
  /navigation
    AppNavigator.tsx           - Main navigation
    linking.ts                 - Deep link configuration
  /hooks
    useBooks.ts               - Books data hook
    useReader.ts              - Reader state hook
    useBookmarks.ts           - Bookmarks hook
  /utils
    constants.ts              - App constants
    helpers.ts                - Utility functions
  /types
    models.ts                 - TypeScript interfaces
```

### 6.4 Performance Targets

- **App Launch:** < 2 seconds to interactive
- **Library Load:** < 1 second to display books
- **Page Navigation:** < 500ms to display next page
- **Image Load:** < 2 seconds for page images
- **Smooth Animations:** 60 FPS

### 6.5 Offline Capabilities (Future Enhancement)

- Cache book metadata for offline browsing
- Store recently viewed pages
- Queue bookmark changes when offline
- Sync bookmarks when online
- Download books for offline reading

---

## 7. USER FLOWS

### 7.1 Library Flow

```
1. App Launch
   → Show Library screen (English Books tab by default)
   → Load books from API
   → Display books in grid

2. Browse Books
   → User taps tab to switch category
   → User searches for specific book
   → User scrolls through book grid

3. View Book Details
   → User taps "View Details" on book card
   → Modal opens with book information
   → User can Read, Download PDF, or Close

4. Select Book to Read
   → User taps book card OR "Read Book" button
   → Navigate to Reader screen with book_id
   → Reader loads book data and first page
```

### 7.2 Reader Flow

```
1. Open Book
   → Reader screen opens with book_id
   → Load TOC, pages, and first page image
   → Display TOC (collapsed on mobile) and page viewer

2. Read Pages
   → User navigates via:
     - Prev/Next buttons
     - Swipe gestures
     - TOC links
     - Go To Page dialog
   → Page changes, image loads
   → Navigation bars update

3. Use TOC
   → User opens TOC drawer (mobile)
   → User expands/collapses sections
   → User taps chapter to jump to page
   → TOC closes, page loads

4. Fullscreen Mode
   → User taps fullscreen button or double-taps image
   → Enter fullscreen with overlay controls
   → Navigate with swipe or buttons
   → Exit with close button or Esc key

5. Bookmark Page
   → User taps bookmark button
   → Bookmark created with optional custom name
   → Button shows filled state
   → User can edit/remove bookmark

6. Share Page
   → User taps share button
   → Share menu opens
   → User selects WhatsApp, Email, or Copy Link
   → Share message with deep link is created

7. Return to Library
   → User taps back button
   → Return to Library with previous tab restored
```

### 7.3 Bookmark Flow (Future)

```
1. View Bookmarks
   → User opens Bookmarks screen
   → List of all bookmarks displayed
   → Grouped by book

2. Open Bookmarked Page
   → User taps bookmark
   → Navigate to Reader with book_id and page number
   → Page loads directly

3. Edit Bookmark
   → User long-presses bookmark or taps edit icon
   → Edit dialog opens
   → User updates custom name or deletes
```

---

## 8. DESIGN SPECIFICATIONS

### 8.1 Color Palette

**Primary Colors:**
- Blue: #2563EB (Primary actions, links)
- Slate: #334155 (Text)
- Gray: #6B7280 (Secondary text)

**Accent Colors:**
- Cyan: #06B6D4 (Highlights)
- Purple: #7C3AED (Selections)
- Green: #10B981 (Success, PDF download)

**Background Colors:**
- White: #FFFFFF (Cards, panels)
- Light Gray: #F9FAFB (Backgrounds)
- Blue Tint: #EFF6FF (Highlights)

**Gradients:**
- Blue Gradient: from-blue-50 to-cyan-50
- Slate Gradient: from-slate-50 to-gray-50
- Violet Gradient: from-violet-50 to-purple-50

### 8.2 Typography

**Font Family:**
- Primary: System font (San Francisco on iOS, Roboto on Android)
- Alternative: Inter, Helvetica Neue, Arial

**Font Sizes:**
- Heading 1: 24-28px, bold
- Heading 2: 20-24px, bold
- Heading 3: 18-20px, semibold
- Body: 16px, regular
- Small: 14px, regular
- Tiny: 12px, regular

### 8.3 Spacing

- Base unit: 8px
- Small: 8px
- Medium: 16px
- Large: 24px
- XLarge: 32px

### 8.4 Component Styling

**Cards:**
- Border radius: 12-16px
- Shadow: Medium elevation
- Padding: 16-24px
- Border: 1px solid (subtle)

**Buttons:**
- Border radius: 8-12px
- Padding: 12px 24px
- Font weight: 600
- Shadow on hover

**Modals:**
- Border radius: 16-20px
- Max width: 90% viewport
- Shadow: High elevation
- Backdrop: rgba(0,0,0,0.5)

---

## 9. TESTING REQUIREMENTS

### 9.1 Functional Testing

- Verify all user flows (Library, Reader, Navigation)
- Test API integration and error handling
- Test offline behavior
- Test deep linking
- Test bookmark CRUD operations
- Test share functionality

### 9.2 UI Testing

- Verify responsive layouts on multiple screen sizes
- Test animations and transitions
- Verify image loading and error states
- Test gesture interactions
- Verify accessibility features

### 9.3 Performance Testing

- Measure app launch time
- Measure page navigation speed
- Test with large book collections (1000+ books)
- Test memory usage with many cached images
- Test on low-end devices

### 9.4 Platform Testing

- Test on iOS (iPhone, iPad)
- Test on Android (phone, tablet)
- Test on different OS versions
- Test with different screen densities
- Test with different network conditions

---

## 10. RELEASE CRITERIA

### 10.1 Minimum Viable Product (MVP)

#### Must Have Features:
- ✅ Library with 3 category tabs
- ✅ Book grid display with thumbnails
- ✅ Search within category
- ✅ Book details modal
- ✅ Reader with page viewer
- ✅ Table of Contents navigation
- ✅ Page navigation (prev/next, go to page)
- ✅ Fullscreen mode
- ✅ Bookmark creation and management
- ✅ Share page functionality
- ✅ Deep linking support

#### Nice to Have (Post-MVP):
- Bookmarks screen
- Offline reading
- Download books for offline
- Dark mode
- Reading progress tracking
- Reading history
- Search across all books
- Notes and highlights
- PDF reader integration

### 10.2 Quality Gates

- All critical bugs resolved
- No crashes or ANRs
- All core features functional
- Smooth 60 FPS animations
- Passes accessibility audit
- Meets performance targets
- Approved by design review
- Security audit passed

---

## 11. FUTURE ENHANCEMENTS

### 11.1 Phase 2 Features
- Bookmarks management screen
- Reading history
- Reading statistics
- Multiple bookmark collections
- Sync bookmarks across devices (with auth)

### 11.2 Phase 3 Features
- Offline book downloads
- Advanced search (full-text search)
- Notes and highlights
- Reading progress sync
- Social features (share highlights)
- Audio narration (if available)
- Verse lookup integration
- Glossary integration
- Chat feature (AI assistant)

### 11.3 Phase 4 Features
- User authentication
- Personal library
- Reading goals and streaks
- Community features
- Push notifications
- Apple Watch / Android Wear support

---

## 12. APPENDIX

### 12.1 Glossary

- **TOC**: Table of Contents
- **MVP**: Minimum Viable Product
- **API**: Application Programming Interface
- **Deep Link**: URL that opens specific app content
- **WebP**: Modern image format with compression
- **AsyncStorage**: React Native persistent storage
- **Glassmorphism**: UI style with frosted glass effect

### 12.2 References

- Web Application: [pbb-frontend](file:///Users/kamaldivi/Development/web_apps/pbb_web/pbb-frontend)
- API Documentation: (To be provided)
- Design Mockups: (To be created)
- React Native Docs: https://reactnative.dev
- React Navigation: https://reactnavigation.org

### 12.3 Key Files Analyzed

1. [HomePage.jsx](file:///Users/kamaldivi/Development/web_apps/pbb_web/pbb-frontend/src/pages/HomePage.jsx:1) - Library implementation
2. [BookReaderPage.jsx](file:///Users/kamaldivi/Development/web_apps/pbb_web/pbb-frontend/src/pages/BookReaderPage.jsx:1) - Reader implementation
3. [PageNavigation.jsx](file:///Users/kamaldivi/Development/web_apps/pbb_web/pbb-frontend/src/components/reader/PageNavigation.jsx:1) - Navigation controls
4. [ImageViewer.jsx](file:///Users/kamaldivi/Development/web_apps/pbb_web/pbb-frontend/src/components/reader/ImageViewer.jsx:1) - Page display and fullscreen
5. [TableOfContents.jsx](file:///Users/kamaldivi/Development/web_apps/pbb_web/pbb-frontend/src/components/reader/TableOfContents.jsx:1) - TOC tree component
6. [api.js](file:///Users/kamaldivi/Development/web_apps/pbb_web/pbb-frontend/src/services/api.js:1) - API service layer
7. [bookmarkService.js](file:///Users/kamaldivi/Development/web_apps/pbb_web/pbb-frontend/src/services/bookmarkService.js:1) - Bookmark management

---

## Document Information

**Version:** 1.0
**Date:** 2025-11-07
**Prepared By:** Claude (AI Assistant)
**Prepared For:** Pure Bhakti Base Mobile App Development
**Status:** Draft for Review
