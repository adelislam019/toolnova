import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getToolBySlug, getPopularTools } from '../data/toolsConfig';
import { ToolLayout } from '../components/ToolLayout';
import { ImageConvertTool } from '../tools/ImageConvertTool';
import { ImageCompressorTool } from '../tools/ImageCompressorTool';
import { ImageResizerTool } from '../tools/ImageResizerTool';
import { SvgToPngTool } from '../tools/SvgToPngTool';
import { ImageColorPaletteTool } from '../tools/ImageColorPaletteTool';
import { PdfToolsWorkspace } from '../tools/PdfToolsWorkspace';
import { OcrToolsWorkspace } from '../tools/OcrToolsWorkspace';
import { ExifRemoverTool } from '../tools/ExifRemoverTool';
import { QrCodeGeneratorTool, FaviconGeneratorTool } from '../tools/QrAndFaviconTools';
import {
  JsonFormatterTool,
  UrlEncoderDecoderTool,
  UtmBuilderTool,
} from '../tools/TextAndUrlTools';

export const ToolPage: React.FC = () => {
  const { toolSlug } = useParams<{ toolSlug: string }>();
  const tool = toolSlug ? getToolBySlug(toolSlug) : undefined;

  if (!tool) {
    const popular = getPopularTools();
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Tool Not Found</h1>
        <p className="text-slate-600 mb-8">
          The requested tool could not be found or may have been relocated.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <Link
            to="/all-tools"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
          >
            Browse All Tools
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <div className="text-left bg-slate-50 border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Popular Tools You Might Need:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {popular.map((p) => (
              <Link
                key={p.slug}
                to={p.route}
                className="text-blue-600 hover:text-blue-800 hover:underline py-1"
              >
                {p.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const renderToolWorkspace = () => {
    switch (tool.slug) {
      case 'heic-to-jpg':
        return <ImageConvertTool mode="heic-to-jpg" />;
      case 'webp-to-jpg':
        return <ImageConvertTool mode="webp-to-jpg" />;
      case 'webp-to-png':
        return <ImageConvertTool mode="webp-to-png" />;
      case 'image-compressor':
        return <ImageCompressorTool />;
      case 'image-resizer':
        return <ImageResizerTool />;
      case 'svg-to-png':
        return <SvgToPngTool />;
      case 'avif-to-jpg':
        return <ImageConvertTool mode="avif-to-jpg" />;
      case 'image-color-palette':
        return <ImageColorPaletteTool />;
      case 'jpg-png-to-pdf':
        return <PdfToolsWorkspace mode="jpg-png-to-pdf" />;
      case 'merge-pdf':
        return <PdfToolsWorkspace mode="merge-pdf" />;
      case 'split-pdf':
        return <PdfToolsWorkspace mode="split-pdf" />;
      case 'screenshot-to-pdf':
        return <PdfToolsWorkspace mode="screenshot-to-pdf" />;
      case 'image-to-text':
        return <OcrToolsWorkspace mode="image-to-text" />;
      case 'screenshot-to-text':
        return <OcrToolsWorkspace mode="screenshot-to-text" />;
      case 'exif-remover':
        return <ExifRemoverTool />;
      case 'qr-code-generator':
        return <QrCodeGeneratorTool />;
      case 'favicon-generator':
        return <FaviconGeneratorTool />;
      case 'json-formatter':
        return <JsonFormatterTool />;
      case 'url-encoder-decoder':
        return <UrlEncoderDecoderTool />;
      case 'utm-builder':
        return <UtmBuilderTool />;
      default:
        return (
          <div className="p-8 text-center text-slate-500">
            Tool workspace is being loaded...
          </div>
        );
    }
  };

  return <ToolLayout tool={tool}>{renderToolWorkspace()}</ToolLayout>;
};
