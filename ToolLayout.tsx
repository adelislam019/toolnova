import React from 'react';
import { ToolConfig } from '../data/toolsConfig';
import { SEOHead, BreadcrumbItem } from './SEOHead';
import { Breadcrumbs } from './Breadcrumbs';
import { ToolIcon } from './ToolIcon';
import { FAQ } from './FAQ';
import { RelatedTools } from './RelatedTools';

interface ToolLayoutProps {
  tool: ToolConfig;
  children: React.ReactNode;
}

export const ToolLayout: React.FC<ToolLayoutProps> = ({ tool, children }) => {
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', path: '/' },
    { name: tool.category, path: `/category/${tool.categorySlug}` },
    { name: tool.name, path: tool.route },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <SEOHead
        title={tool.metaTitle}
        description={tool.metaDescription}
        path={tool.route}
        type="webapp"
        appName={tool.h1Title}
        appCategory={
          tool.category === 'Developer Tools' ? 'DeveloperApplication' : 'UtilitiesApplication'
        }
        breadcrumbs={breadcrumbs}
        faqs={tool.faqs}
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <ToolIcon name={tool.icon} className="w-5 h-5" />
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-500">
            <span className="font-medium text-slate-700">{tool.category}</span>
            <span aria-hidden="true">·</span>
            <span>
              {tool.processingType === 'client-side'
                ? 'Browser-Based Processing'
                : 'Client Pre-Flight + Modular OCR Service'}
            </span>
            <span aria-hidden="true">·</span>
            <span>No Watermark</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight text-balance">
          {tool.h1Title}
        </h1>
        <p className="mt-2.5 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          {tool.description}
        </p>
      </header>

      <section
        aria-label={`${tool.name} Workspace`}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-8 mb-14"
      >
        {children}
      </section>

      <section aria-labelledby="how-it-works-heading" className="py-10 border-t border-slate-200">
        <h2 id="how-it-works-heading" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-6">
          How to Use {tool.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tool.howItWorks.map((step, idx) => (
            <div key={step.title} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="text-xs font-mono font-semibold text-blue-600 mb-2 tabular-nums">
                0{idx + 1}. STEP
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">{step.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="benefits-heading" className="py-10 border-t border-slate-200">
        <h2 id="benefits-heading" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-6">
          Key Benefits & Use Cases
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {tool.benefits.map((benefit, idx) => (
            <div key={benefit.title} className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">
                0{idx + 1}. {benefit.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="seo-guide-heading" className="py-10 border-t border-slate-200">
        <div className="max-w-3xl">
          <h2 id="seo-guide-heading" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-4">
            {tool.seoContent.heading}
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed">
            {tool.seoContent.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="border-t border-slate-200">
        <FAQ faqs={tool.faqs} />
      </div>

      <RelatedTools currentTool={tool} />
    </div>
  );
};
