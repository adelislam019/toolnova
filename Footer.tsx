import React from 'react';
import { Link } from 'react-router-dom';
import { TOOL_CATEGORIES, getPopularTools } from '../data/toolsConfig';

export const Footer: React.FC = () => {
  const popularTools = getPopularTools();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          <div className="lg:col-span-2 space-y-3">
            <Link
              to="/"
              className="text-xl font-bold tracking-tight text-slate-900 hover:text-blue-600 transition-colors inline-block"
            >
              ToolNova
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              Fast, simple, and privacy-focused online utilities for images, PDFs, metadata scrubbing, developers, and digital marketers. Built for reliable everyday workflows with no watermarks or forced sign-ups.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
              <span>Browser-First Processing</span>
              <span aria-hidden="true">·</span>
              <span>No Watermarks</span>
              <span aria-hidden="true">·</span>
              <span>Free Utility Suite</span>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-3.5">Categories</h2>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/all-tools" className="hover:text-blue-600 transition-colors">
                  All 20 Tools
                </Link>
              </li>
              {TOOL_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <Link to={cat.route} className="hover:text-blue-600 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-3.5">Popular Tools</h2>
            <ul className="space-y-2.5 text-sm text-slate-600">
              {popularTools.map((tool) => (
                <li key={tool.slug}>
                  <Link to={tool.route} className="hover:text-blue-600 transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-3.5">Company & Legal</h2>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors">
                  About ToolNova
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  Sitemap (XML)
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors"
                >
                  Robots.txt
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} ToolNova. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="hover:text-slate-800 transition-colors">
              Privacy
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/terms-of-service" className="hover:text-slate-800 transition-colors">
              Terms
            </Link>
            <span aria-hidden="true">·</span>
            <Link to="/contact" className="hover:text-slate-800 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
