import React, { useState, useEffect } from 'react';
import {
  ScanText,
  RefreshCw,
  Copy,
  Check,
  Download,
  AlertCircle,
  CheckCircle2,
  Info,
  ClipboardPaste,
} from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/Button';
import { createSampleImageFile } from '../utils/fileHelpers';
import { runOcrService, OcrExtractionResult } from '../services/ocrService';

interface OcrToolsWorkspaceProps {
  mode: 'image-to-text' | 'screenshot-to-text';
}

export const OcrToolsWorkspace: React.FC<OcrToolsWorkspaceProps> = ({ mode }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [normalizeContrast, setNormalizeContrast] = useState<boolean>(true);
  const [invertDarkBackground, setInvertDarkBackground] = useState<boolean>(false);
  const [languageHint, setLanguageHint] = useState<string>('en');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<OcrExtractionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setInvertDarkBackground(false);
  }, [mode]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const f = items[i].getAsFile();
          if (f) {
            const namedFile = new File([f], 'clipboard-capture.png', { type: f.type });
            setFiles([namedFile]);
            setResult(null);
            setError(null);
            break;
          }
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleLoadSample = async () => {
    setError(null);
    setResult(null);
    const sample = await createSampleImageFile(
      mode === 'screenshot-to-text' ? 'sample-ui-screenshot.png' : 'sample-document-scan.png',
      'image/png',
      1280,
      800
    );
    setFiles([sample]);
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setIsProcessing(false);
  };

  const handleRunOcr = async () => {
    if (!files[0]) return;
    setIsProcessing(true);
    setError(null);
    try {
      const res = await runOcrService(files[0], {
        normalizeContrast,
        invertDarkBackground,
        languageHint,
      });
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OCR analysis failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadPreprocessed = () => {
    if (!result?.preprocessedDataUrl) return;
    const a = document.createElement('a');
    a.href = result.preprocessedDataUrl;
    a.download = 'preprocessed-ocr-ready.png';
    a.click();
  };

  return (
    <div className="space-y-6">
      {mode === 'screenshot-to-text' && (
        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center gap-2.5 text-xs sm:text-sm text-blue-900">
          <ClipboardPaste className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Clipboard Paste Active:</strong> Press <kbd className="font-mono font-semibold">Ctrl+V</kbd> or{' '}
            <kbd className="font-mono font-semibold">⌘V</kbd> anywhere on this page to load a screenshot directly from your clipboard.
          </span>
        </div>
      )}

      <FileUploader
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        acceptLabel="JPG, PNG, WebP"
        files={files}
        onFilesSelected={(selected) => {
          setFiles(selected);
          setResult(null);
          setError(null);
        }}
        onRemoveFile={handleReset}
        onLoadSample={handleLoadSample}
        sampleLabel={
          mode === 'screenshot-to-text' ? 'Load Sample Screenshot' : 'Load Sample Document Image'
        }
      />

      {files.length > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
          <div className="text-sm font-semibold text-slate-900">
            OCR Preprocessing & Pipeline Settings
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <label className="inline-flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={normalizeContrast}
                onChange={(e) => setNormalizeContrast(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <span>Normalize Grayscale Contrast</span>
            </label>

            <label className="inline-flex items-center gap-2.5 text-xs sm:text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={invertDarkBackground}
                onChange={(e) => setInvertDarkBackground(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
              />
              <span>Invert Dark-Mode Background</span>
            </label>

            <div>
              <label htmlFor="ocr-lang" className="block text-xs font-medium text-slate-600 mb-1">
                Document Language Hint
              </label>
              <select
                id="ocr-lang"
                value={languageHint}
                onChange={(e) => setLanguageHint(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
              >
                <option value="en">English (en)</option>
                <option value="de">German (de)</option>
                <option value="fr">French (fr)</option>
                <option value="es">Spanish (es)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              isLoading={isProcessing}
              onClick={handleRunOcr}
              leftIcon={<ScanText className="w-4 h-4" />}
            >
              Run OCR Analysis & Extraction
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Reset
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900">
                Client-Side OCR Pre-Flight Diagnostics
              </h3>
              <span className="text-xs font-mono text-slate-500 tabular-nums">
                {result.diagnostics.width} × {result.diagnostics.height} px ({result.diagnostics.megapixels} MP)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <div className="text-xs text-slate-500">Resolution Status</div>
                <div className="mt-1 text-sm font-semibold text-slate-900 capitalize">
                  {result.diagnostics.resolutionStatus}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <div className="text-xs text-slate-500">Contrast Score</div>
                <div className="mt-1 text-sm font-mono font-semibold text-slate-900 tabular-nums">
                  {result.diagnostics.contrastScore} / 100
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <div className="text-xs text-slate-500">Background Polarity</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">
                  {result.diagnostics.polarity === 'dark-background' ? 'Dark Mode' : 'Light Mode'}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200/70">
                <div className="text-xs text-slate-500">Avg Luminance</div>
                <div className="mt-1 text-sm font-mono font-semibold text-slate-900 tabular-nums">
                  {result.diagnostics.averageLuminance} / 255
                </div>
              </div>
            </div>

            <ul className="space-y-1 text-xs sm:text-sm text-slate-600">
              {result.diagnostics.recommendations.map((rec, i) => (
                <li key={i}>• {rec}</li>
              ))}
            </ul>
          </div>

          {result.status === 'success' && result.extractedText ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Extracted Text ({result.detectedBlocksCount} regions)</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(result.extractedText || '');
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                  leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                >
                  {copied ? 'Copied' : 'Copy Text'}
                </Button>
              </div>
              <textarea
                readOnly
                rows={6}
                value={result.extractedText}
                aria-label="Extracted OCR text"
                className="w-full p-3.5 rounded-lg border border-slate-300 bg-white font-mono text-xs sm:text-sm text-slate-900"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-900">
                    Modular OCR Service Layer Ready (No Fake Output)
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {result.message}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    To connect a production OCR backend (such as Cloudflare Workers AI, Google Cloud Vision, or a dedicated Tesseract worker), set <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">VITE_OCR_API_ENDPOINT</code> in your deployment environment variables. In the meantime, you can download the contrast-normalized preprocessed image below.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-blue-200/60">
                <span className="text-xs font-medium text-slate-700">
                  Normalized High-Contrast Preprocessed Image:
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={downloadPreprocessed}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download Preprocessed PNG
                </Button>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 p-3 flex items-center justify-center max-h-72 overflow-hidden">
                <img
                  src={result.preprocessedDataUrl}
                  alt="Preprocessed OCR ready graphic"
                  referrerPolicy="no-referrer"
                  className="max-h-60 w-auto object-contain rounded-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
