import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';

const ContentDisplay = ({ content, loading, error, bookId, pageNumber, pageLabel, onRetry }) => {
  if (!bookId || !pageNumber) {
    return (
      <div className="w-full h-full bg-white rounded-lg shadow-md p-4 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm font-medium">Select a page to view content</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-white rounded-lg shadow-md p-4">
        <div className="bg-gray-50 px-3 py-2 border-b rounded-t-lg mb-4">
          <h3 className="text-sm font-semibold text-gray-800">
            {pageLabel || `Page ${pageNumber}`}
          </h3>
        </div>
        <LoadingSpinner size="large" message="Loading content..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-white rounded-lg shadow-md p-4">
        <div className="bg-gray-50 px-3 py-2 border-b rounded-t-lg mb-4">
          <h3 className="text-sm font-semibold text-gray-800">
            {pageLabel || `Page ${pageNumber}`}
          </h3>
        </div>
        <ErrorMessage error={error} onRetry={onRetry} />
      </div>
    );
  }

  // Extract ai_page_content from the API response
  // API returns: {content: {book_id, page_number, ai_page_content, ...}, message: null}
  let pageContent = '';
  if (typeof content === 'string') {
    pageContent = content;
  } else if (content && typeof content === 'object') {
    // Handle nested structure: content.content.ai_page_content
    if (content.content && content.content.ai_page_content) {
      pageContent = content.content.ai_page_content;
    } else {
      pageContent = content.ai_page_content || content.content || '';
    }
  }

  console.log('Content type:', typeof content, 'Content:', content);
  console.log('Extracted page content:', pageContent);

  return (
    <div className="w-full h-full bg-gradient-to-br from-emerald-50/80 via-green-50/60 to-teal-50/80 backdrop-blur-sm rounded-2xl shadow-xl border border-emerald-200/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-100/80 to-teal-100/80 backdrop-blur-sm px-4 py-3 border-b border-emerald-200/50">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            Extracted Content - Page Label : {pageLabel || `Page ${pageNumber}`}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto">
        {pageContent ? (
          <div className="prose max-w-none text-sm">
            <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed">
              {pageContent}
            </pre>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No content available for this page</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentDisplay;