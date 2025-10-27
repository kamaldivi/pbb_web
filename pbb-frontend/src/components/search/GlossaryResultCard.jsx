const GlossaryResultCard = ({ result, searchTerm }) => {
  // Highlight search term in text
  const highlightText = (text, term) => {
    if (!term || !text) return text;

    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-slate-900 font-semibold px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-md hover:shadow-xl transition-all duration-200 p-5 border border-purple-100/50 hover:border-purple-300/50 group">
      {/* Term Header */}
      <div className="mb-3">
        <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
          {highlightText(result.term, searchTerm)}
        </h3>
        {result.book_name && (
          <div className="flex items-center mt-2 space-x-2">
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-sm font-semibold text-purple-600">{result.book_name}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {result.description && (
        <div className="mt-3">
          <p className="text-slate-700 leading-relaxed text-sm">
            {highlightText(result.description, searchTerm)}
          </p>
        </div>
      )}
    </div>
  );
};

export default GlossaryResultCard;
