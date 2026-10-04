import React from 'react';
import { ToolConfig, getRelatedToolsFor } from '../data/toolsConfig';
import { ToolCard } from './ToolCard';

interface RelatedToolsProps {
  currentTool: ToolConfig;
}

export const RelatedTools: React.FC<RelatedToolsProps> = ({ currentTool }) => {
  const related = getRelatedToolsFor(currentTool);

  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-tools-heading" className="py-10 border-t border-slate-200">
      <div className="mb-6">
        <h2 id="related-tools-heading" className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Related Tools
        </h2>
        <p className="mt-1 text-sm sm:text-base text-slate-600">
          Continue your workflow with these complementary {currentTool.category.toLowerCase()} and utilities.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {related.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </section>
  );
};
