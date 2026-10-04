import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Shield, Zap, Smartphone, CheckCircle2, X } from 'lucide-react';
import {
  TOOLS_CONFIG,
  TOOL_CATEGORIES,
  HOMEPAGE_FAQS,
  getPopularTools,
  searchTools,
} from '../data/toolsConfig';
import { ToolCard } from '../components/ToolCard';
import { ToolIcon } from '../components/ToolIcon';
import { FAQ } from '../components/FAQ';
import { SEOHead } from '../components/SEOHead';

export const HomePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const popularTools = getPopularTools();
  const searchResults = query.trim() ? searchTools(query) : [];

  const filteredTools = TOOLS_CONFIG.filter((t) => {
    if (selectedCategory === 'all') return true;
    return t.categorySlug === selectedCategory;
  });

  return (
    <div>
      <SEOHead
        title="ToolNova — Free Online Tools for Everyday Tasks"
        description="Fast, simple and privacy-focused online tools for images, PDFs, OCR, and developer workflows. Free forever with zero registration, no server uploads, and no watermarks."
        path="/"
        faqs={HOMEPAGE_FAQS}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-radial-[at_50%_0%] from-blue-50/60 via-white to-white border-b border-slate-200/80 py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/70 text-xs font-semibold text-blue-700 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            100% Client-Side Privacy — Files Never Leave Your Browser
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight text-balance">
            Free Online Tools for Everyday Tasks
          </h1>

          <p className="mt-5 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed text-balance">
            Fast, simple, and privacy-focused online utilities for images, PDFs, OCR, and developer
            workflows. No registration required, zero watermarks, and instant processing.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 20+ free tools (e.g. compress image, merge pdf, ocr, qr code, json)..."
                className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm sm:text-base placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant Search Results Dropdown */}
            {query.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl border border-slate-200 shadow-xl p-2 z-30 max-h-96 overflow-y-auto text-left">
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {searchResults.map((tool) => (
                      <Link
                        key={tool.slug}
                        to={tool.route}
                        onClick={() => setQuery('')}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          <ToolIcon name={tool.icon} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-sm text-slate-900">{tool.name}</div>
                          <div className="text-xs text-slate-500 truncate">{tool.description}</div>
                        </div>
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {tool.category}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500 text-sm">
                    No tools matching &ldquo;{query}&rdquo;. Check spelling or browse categories below.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Trust Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-sm font-medium text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              Private &amp; Secure
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-blue-600" />
              No Upload Wait Times
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-purple-600" />
              Mobile, Tablet &amp; Desktop
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Free Forever
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20">
        {/* Popular Tools Section */}
        <section aria-labelledby="popular-tools-heading">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
                Handpicked Utilities
              </div>
              <h2
                id="popular-tools-heading"
                className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
              >
                Popular Tools
              </h2>
            </div>
            <Link
              to="/all-tools"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-800 group"
            >
              Browse all 20+ tools
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section aria-labelledby="categories-heading" className="pt-6 border-t border-slate-200">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
              Organized Workspace
            </div>
            <h2
              id="categories-heading"
              className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
            >
              Browse by Category
            </h2>
            <p className="mt-1 text-slate-600 text-sm sm:text-base">
              Find exactly the tool you need for images, PDFs, OCR, developer tasks, or marketing campaigns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TOOL_CATEGORIES.map((cat) => {
              const count = TOOLS_CONFIG.filter((t) => t.categorySlug === cat.slug).length;
              return (
                <Link
                  key={cat.slug}
                  to={cat.route}
                  className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-500/80 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {cat.name}
                      </h3>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                        {count} Tools
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">
                      {cat.description}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 group-hover:underline">
                    Explore {cat.name}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* All Tools Filterable Grid */}
        <section aria-labelledby="all-tools-heading" className="pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
                Complete Collection
              </div>
              <h2
                id="all-tools-heading"
                className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
              >
                All Tools
              </h2>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({TOOLS_CONFIG.length})
              </button>
              {TOOL_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedCategory === cat.slug
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section
          aria-labelledby="why-choose-heading"
          className="rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white p-8 sm:p-12 lg:p-16 shadow-xl"
        >
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Zero Compromise
            </span>
            <h2
              id="why-choose-heading"
              className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-1 mb-4 text-balance"
            >
              Why People Choose ToolNova
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Most online conversion and PDF tools secretly upload your private contracts, photos,
              and code snippets to remote servers. ToolNova runs on an entirely modern,
              client-side-first architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">100% Privacy by Design</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Images, documents, and text are processed directly inside your browser memory using
                WebAssembly and Canvas APIs. Your confidential files never touch our servers.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Instant, Zero-Queue Speed</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                No uploading 50 MB files over slow home Wi-Fi or waiting in server conversion queues.
                Conversions and formatting execute instantaneously on your device hardware.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400 mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">No Watermarks &amp; No Signup</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                We never stamp intrusive watermarks on your converted PDFs or images. No email
                registration, credit card traps, or subscription popups.
              </p>
            </div>
          </div>
        </section>

        {/* Homepage FAQ */}
        <section aria-labelledby="home-faq-heading" className="pt-6 border-t border-slate-200">
          <FAQ
            faqs={HOMEPAGE_FAQS}
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about ToolNova’s client-side technology, privacy guarantees, and browser support."
          />
        </section>
      </div>
    </div>
  );
};
