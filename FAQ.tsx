import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { ToolFAQ } from '../data/toolsConfig';

interface FAQProps {
  faqs: ToolFAQ[];
  title?: string;
  subtitle?: string;
}

export const FAQ: React.FC<FAQProps> = ({
  faqs,
  title = 'Frequently Asked Questions',
  subtitle = 'Clear answers about how this tool works, browser privacy, and supported formats.',
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="py-10">
      <div className="mb-6">
        <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h2>
        {subtitle && <p className="mt-1.5 text-sm sm:text-base text-slate-600">{subtitle}</p>}
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-200">
        {faqs.map((item, idx) => {
          const isOpen = openIndex === idx;
          const buttonId = `faq-question-${idx}`;
          const panelId = `faq-answer-${idx}`;

          return (
            <div key={item.question}>
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left px-5 sm:px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-900">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-150 ${
                      isOpen ? 'rotate-180 text-blue-600' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </h3>
              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className="px-5 sm:px-6 pb-5 text-sm sm:text-base text-slate-600 leading-relaxed"
                >
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
