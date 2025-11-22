import { useState } from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';

const TableOfContents = ({ toc, loading, error, onPageSelect, currentPage, onRetry, onCollapse }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  if (loading) {
    return (
      <div className="w-full h-full bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Table of Contents</h3>
        <LoadingSpinner size="medium" message="Loading table of contents..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Table of Contents</h3>
        <ErrorMessage error={error} onRetry={onRetry} />
      </div>
    );
  }

  if (!toc || !toc.table_of_contents || toc.table_of_contents.length === 0) {
    return (
      <div className="w-full h-full bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Table of Contents</h3>
        <div className="text-center text-gray-500 py-8 text-sm">
          No table of contents available
        </div>
      </div>
    );
  }

  // Build tree structure from flat TOC data
  const buildTree = (items) => {
    const map = {};
    const roots = [];

    // First pass: create map of all items
    items.forEach(item => {
      map[item.toc_id] = { ...item, children: [] };
    });

    // Second pass: build tree structure
    items.forEach(item => {
      if (item.parent_toc_id === null || item.parent_toc_id === undefined) {
        roots.push(map[item.toc_id]);
      } else if (map[item.parent_toc_id]) {
        map[item.parent_toc_id].children.push(map[item.toc_id]);
      }
    });

    return roots;
  };

  const toggleNode = (tocId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(tocId)) {
      newExpanded.delete(tocId);
    } else {
      newExpanded.add(tocId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleTocClick = (item) => {
    if (item.page_number !== null && item.page_number !== undefined) {
      onPageSelect(item.page_number);
    }
  };

  const renderTocItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedNodes.has(item.toc_id);
    const hasPageNumber = item.page_number !== null && item.page_number !== undefined;

    // Only show level 1 by default (level 0 is root)
    const defaultVisible = level === 0;

    return (
      <div key={item.toc_id} className="select-none">
        <div
          className={`
            flex items-center py-2 px-2 rounded-md cursor-pointer
            transition-colors duration-150
            ${hasPageNumber ? 'hover:bg-blue-50' : 'cursor-default'}
            ${level > 0 ? 'ml-' + (level * 4) : ''}
          `}
          style={{ paddingLeft: `${level * 1}rem` }}
        >
          {/* Expand/Collapse Icon */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(item.toc_id);
              }}
              className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Empty space for items without children */}
          {!hasChildren && <span className="w-4 mr-2"></span>}

          {/* TOC Label */}
          <div
            onClick={() => hasPageNumber && handleTocClick(item)}
            className={`
              flex-1 text-sm
              ${hasPageNumber ? 'text-blue-700 hover:text-blue-900 hover:underline font-medium' : 'text-gray-600 font-semibold'}
              ${level === 0 ? 'font-bold text-base' : ''}
            `}
          >
            {item.toc_label}
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="ml-2">
            {item.children.map(child => renderTocItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const tocTree = buildTree(toc.table_of_contents);

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          {/* Collapse Button */}
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-110 flex items-center justify-center flex-shrink-0"
              title="Hide Table of Contents"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
              </svg>
            </button>
          )}
          <h3 className="text-sm font-bold text-slate-800">Table of Contents</h3>
        </div>
      </div>

      {/* TOC Tree */}
      <div className="overflow-y-auto p-4" style={{ maxHeight: '800px' }}>
        {tocTree.map(item => renderTocItem(item, 0))}
      </div>
    </div>
  );
};

export default TableOfContents;
