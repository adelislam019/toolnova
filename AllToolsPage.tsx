import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import {
  TOOLS_CONFIG,
  TOOL_CATEGORIES,
  getCategoryBySlug,
  searchTools,
  ToolConfig,
} from '../data/toolsConfig';
import { ToolCard } from '../components/ToolCard';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHead } from '../components/SEOHead';

export const AllToolsPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const activeCategory = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  useEffect(() => {
    if (initialQuery !== searchQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const handleQueryChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  };

  let displayedTools: ToolConfig[] = activeCategory
    ? TOOLS_CONFIG.filter((t) => t.categorySlug === activeCategory.slug)
    : TOOLS_CONFIG;

  if (searchQuery.trim()) {
    const matched = searchTools(searchQuery.trim());
    if (activeCategory) {
      displayedTools = matched.filter((t) => t.categorySlug === activeCategory.slug);
    } else {
      displayedTools = matched;
    }
  }

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    ...(activeCategory
      ? [
          { name: 'All Tools', path: '/all-tools' },
          { name: activeCategory.name, path: activeCategory.route },
        ]
      : [{ name: 'All Tools', path: '/all-tools' }]),
  ];

  const pageTitle = activeCategory
    ? `${activeCategory.name} — Free Online Utilities | ToolNova`
    : 'All Free Online Tools — Fast, Private, No Watermarks | ToolNova';

  const pageDescription = activeCategory
    ? activeCategory.description
    : 'Browse all 20+ free, fast, and privacy-focused online tools for image conversion, PDF merging, OCR diagnostics, development, and marketing workflows.';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        path={activeCategory ? activeCategory.route : '/all-tools'}
        breadcrumbs={breadcrumbs}
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {activeCategory ? activeCategory.name : 'All Online Tools'}
        </h1>
        <p className="mt-2 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          {activeCategory
            ? activeCategory.description
            : 'Explore our complete library of browser-based utilities. All tools are free forever with no watermarks and no registration.'}
        </p>

        {/* Category selector pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            to="/all-tools"
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              !activeCategory
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Categories ({TOOLS_CONFIG.length})
          </Link>
          {TOOL_CATEGORIES.map((cat) => {
            const isSelected = activeCategory?.slug === cat.slug;
            const count = TOOLS_CONFIG.filter((t) => t.categorySlug === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                to={cat.route}
                className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name} ({count})
              </Link>
            );
          })}
        </div>

        {/* Search input */}
        <div className="mt-6 max-w-xl relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={`Filter ${activeCategory ? activeCategory.name.toLowerCase() : 'all tools'}...`}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              aria-label="Clear filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Grid of tools */}
      {displayedTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto my-8">
          <p className="text-slate-700 font-semibold mb-1">No matching tools found</p>
          <p className="text-slate-500 text-sm mb-4">
            Try adjusting your search query or switch categories.
          </p>
          <button
            type="button"
            onClick={() => handleQueryChange('')}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};
