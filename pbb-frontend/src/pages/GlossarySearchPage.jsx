import { useState } from 'react';
import { apiService } from '../services/api';
import GlossarySearchInput from '../components/search/GlossarySearchInput';
import GlossaryResultCard from '../components/search/GlossaryResultCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorMessage from '../components/shared/ErrorMessage';

const GlossarySearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const handleSearch = async (term) => {
    if (!term) {
      setSearchTerm('');
      setResults([]);
      setHasSearched(false);
      setTotalResults(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSearchTerm(term);
      setHasSearched(true);

      const response = await apiService.searchGlossary(term);
      console.log('Glossary search response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));

      // Extract results from response - try multiple possible structures
      let resultsArray = [];

      if (Array.isArray(response)) {
        resultsArray = response;
      } else if (response?.glossary_terms) {
        resultsArray = response.glossary_terms;
      } else if (response?.results) {
        resultsArray = response.results;
      } else if (response?.data) {
        resultsArray = response.data;
      } else if (response?.glossary) {
        resultsArray = response.glossary;
      }

      console.log('Extracted results array:', resultsArray);
      console.log('Results array length:', resultsArray?.length);

      setResults(resultsArray);
      setTotalResults(response?.total || response?.count || resultsArray.length);
    } catch (err) {
      console.error('Error searching glossary:', err);
      setError(err.message);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Search Input */}
      <GlossarySearchInput onSearch={handleSearch} loading={loading} />

      {/* Informational Message */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-400 rounded-xl shadow-md p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Currently Available:</span> Glossary Search only.
              <span className="text-slate-600"> Book Search and Verse Search will be coming soon.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {hasSearched && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
          {/* Results Header */}
          {!loading && !error && (
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">
                  Search Results for "{searchTerm}"
                </h3>
                <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full">
                  {totalResults} {totalResults === 1 ? 'result' : 'results'} found
                </span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-12">
              <LoadingSpinner size="large" message="Searching glossary..." />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <ErrorMessage error={error} onRetry={handleRetry} />
          )}

          {/* Results List */}
          {!loading && !error && results.length > 0 && (
            <div className="space-y-4">
              {results.map((result, index) => (
                <GlossaryResultCard
                  key={result.glossary_id || index}
                  result={result}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && !error && hasSearched && results.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No results found</h3>
              <p className="text-slate-600">
                No glossary terms match "{searchTerm}". Try a different search term.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State - Before Search */}
      {!hasSearched && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-12 border border-white/20">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Search the Glossary</h2>
            <p className="text-lg text-slate-600 mb-6">
              Discover spiritual terms and concepts from all books in our library
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-slate-700 mb-3 font-medium">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {['Bhakti', 'Krishna', 'Prema', 'Dharma', 'Yoga', 'Mantra'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlossarySearchPage;
