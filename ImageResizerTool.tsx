import React, { useState } from 'react';
import { Download, RefreshCw, Lock, Unlock, CheckCircle2, AlertCircle } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/Button';
import {
  formatFileSize,
  triggerDownload,
  replaceFileExtension,
  createSampleImageFile,
} from '../utils/fileHelpers';

interface ResizedResult {
  blob: Blob;
  url: string;
  filename: string;
  width: number;
  height: number;
  size: number;
}

export const ImageResizerTool: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp'>('image/png');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResizedResult | null>(null);

  const inspectAndLoadFile = async (selected: File[]) => {
    setFiles(selected);
    setResult(null);
    setError(null);
    if (selected.length === 0) return;

    try {
      const bitmap = await createImageBitmap(selected[0]);
      setOrigWidth(bitmap.width);
      setOrigHeight(bitmap.height);
      setTargetWidth(Math.round(bitmap.width * 0.5));
      setTargetHeight(Math.round(bitmap.height * 0.5));
    } catch {
      setError('Unable to read dimensions from the selected image.');
    }
  };

  const handleLoadSample = async () => {
    const sample = await createSampleImageFile('landscape-photo.png', 'image/png', 1600, 1000);
    await inspectAndLoadFile([sample]);
  };

  const handleWidthChange = (newW: number) => {
    const clampedW = Math.max(1, Math.min(8000, newW || 1));
    setTargetWidth(clampedW);
    if (lockAspect && origWidth > 0) {
      setTargetHeight(Math.max(1, Math.round((clampedW / origWidth) * origHeight)));
    }
  };

  const handleHeightChange = (newH: number) => {
    const clampedH = Math.max(1, Math.min(8000, newH || 1));
    setTargetHeight(clampedH);
    if (lockAspect && origHeight > 0) {
      setTargetWidth(Math.max(1, Math.round((clampedH / origHeight) * origWidth)));
    }
  };

  const applyScalePercent = (pct: number) => {
    if (!origWidth || !origHeight) return;
    setTargetWidth(Math.max(1, Math.round(origWidth * (pct / 100))));
    setTargetHeight(Math.max(1, Math.round(origHeight * (pct / 100))));
  };

  const applyPreset = (w: number, h: number) => {
    setLockAspect(false);
    setTargetWidth(w);
    setTargetHeight(h);
  };

  const handleReset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFiles([]);
    setOrigWidth(0);
    setOrigHeight(0);
    setResult(null);
    setError(null);
  };

  const handleResize = async () => {
    const file = files[0];
    if (!file || targetWidth < 1 || targetHeight < 1) return;

    setIsProcessing(true);
    setError(null);

    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not initialize canvas for resizing.');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Failed to encode resized image.'))),
          outputFormat,
          outputFormat === 'image/png' ? undefined : 0.92
        );
      });

      const ext =
        outputFormat === 'image/jpeg' ? '.jpg' : outputFormat === 'image/webp' ? '.webp' : '.png';

      if (result?.url) URL.revokeObjectURL(result.url);
      const outUrl = URL.createObjectURL(blob);
      const outName = replaceFileExtension(file.name, `-${targetWidth}x${targetHeight}${ext}`);

      setResult({
        blob,
        url: outUrl,
        filename: outName,
        width: targetWidth,
        height: targetHeight,
        size: blob.size,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resize image.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileUploader
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        acceptLabel="JPG, PNG, WebP"
        files={files}
        onFilesSelected={inspectAndLoadFile}
        onRemoveFile={handleReset}
        onLoadSample={handleLoadSample}
        sampleLabel="Load Sample Image (1600×1000)"
      />

      {files.length > 0 && origWidth > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <span className="text-sm font-semibold text-slate-900">Resize Dimensions</span>
            <span className="text-xs font-mono text-slate-600 tabular-nums">
              Original: {origWidth} × {origHeight} px
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="resize-width" className="block text-xs font-medium text-slate-700 mb-1">
                Width (px)
              </label>
              <input
                id="resize-width"
                type="number"
                min={1}
                max={8000}
                value={targetWidth}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono tabular-nums rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label htmlFor="resize-height" className="block text-xs font-medium text-slate-700 mb-1">
                Height (px)
              </label>
              <input
                id="resize-height"
                type="number"
                min={1}
                max={8000}
                value={targetHeight}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm font-mono tabular-nums rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <button
                type="button"
                onClick={() => setLockAspect((prev) => !prev)}
                className={`w-full px-3.5 py-2 rounded-lg border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[38px] ${
                  lockAspect
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {lockAspect ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                <span>{lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <span className="block text-xs font-medium text-slate-600 mb-2">
                Quick Percentage Scale
              </span>
              <div className="flex flex-wrap gap-2">
                {[25, 50, 75, 100].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => applyScalePercent(pct)}
                    className="px-3 py-1.5 text-xs font-mono font-medium rounded-md bg-white border border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 cursor-pointer"
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-600 mb-2">
                Standard Web & Social Presets
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset(1920, 1080)}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-md bg-white border border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 cursor-pointer"
                >
                  1920×1080 (HD)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(1200, 630)}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-md bg-white border border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 cursor-pointer"
                >
                  1200×630 (OG Card)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(1080, 1080)}
                  className="px-2.5 py-1.5 text-xs font-medium rounded-md bg-white border border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 cursor-pointer"
                >
                  1080×1080 (Square)
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-xs">
            <label htmlFor="resize-format" className="block text-xs font-medium text-slate-700 mb-1">
              Export Format
            </label>
            <select
              id="resize-format"
              value={outputFormat}
              onChange={(e) =>
                setOutputFormat(e.target.value as 'image/png' | 'image/jpeg' | 'image/webp')
              }
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
            >
              <option value="image/png">PNG (.png)</option>
              <option value="image/jpeg">JPEG (.jpg)</option>
              <option value="image/webp">WebP (.webp)</option>
            </select>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" isLoading={isProcessing} onClick={handleResize}>
              Resize to {targetWidth} × {targetHeight} px
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
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200/70 pb-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Resized Image Ready: {result.filename}
                </h3>
                <p className="text-xs sm:text-sm font-mono tabular-nums text-slate-600 mt-0.5">
                  New Resolution: {result.width} × {result.height} px · File Size:{' '}
                  {formatFileSize(result.size)}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => triggerDownload(result.blob, result.filename)}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download Resized Image
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-3 flex items-center justify-center max-h-96 overflow-hidden">
            <img
              src={result.url}
              alt={`Resized output ${result.filename}`}
              referrerPolicy="no-referrer"
              className="max-h-80 w-auto object-contain rounded-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};
