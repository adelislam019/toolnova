import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ToolConfig } from '../data/toolsConfig';
import { ToolIcon } from './ToolIcon';

interface ToolCardProps {
  tool: ToolConfig;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  return (
    <article className="group bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between transition-colors duration-150 hover:border-blue-500/60">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-150">
            <ToolIcon name={tool.icon} className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>{tool.category}</span>
            <span aria-hidden="true">·</span>
            <span>{tool.processingType === 'client-side' ? 'Browser' : 'Modular'}</span>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
          <Link
            to={tool.route}
            className="focus-visible:outline-none focus-visible:underline"
          >
            {tool.name}
          </Link>
        </h3>

        <p className="mt-1.5 text-sm text-slate-600 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={tool.route}
          aria-label={`Use ${tool.name} tool`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors whitespace-nowrap"
        >
          <span>Use Tool</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};
