import React, { useState } from 'react';
import JSZip from 'jszip';
import { Download, RefreshCw, CheckCircle2, AlertCircle, Sliders, Archive } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/Button';
import {
  formatFileSize,
  triggerDownload,
  replaceFileExtension,
  createSampleImageFile,
} from '../utils/fileHelpers';

interface CompressedResult {
  blob: Blob;
  url: string;
  filename: string;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  savingsPercent: number;
}

export const ImageCompressorTool: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState<number>(78);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/jpeg');
  const [maxWidth, setMaxWidth] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CompressedResult[]>([]);

  const handleLoadSample = async () => {
    setError(null);
    setResults([]);
    const file = await createSampleImageFile('high-res-photo.png', 'image/png', 1600, 1080);
    setFiles([file]);
    setOutputFormat('image/jpeg');
  };

  const handleReset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setFiles([]);
    setResults([]);
    setError(null);
    setIsProcessing(false);
    setProgressMsg('');
  };

  const handleCompress = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);

    const compressedList: CompressedResult[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgressMsg(
          files.length > 1
            ? `Compressing ${i + 1} of ${files.length}: ${file.name}...`
            : `Compressing ${file.name}...`
        );

        const bitmap = await createImageBitmap(file);
        let targetW = bitmap.width;
        let targetH = bitmap.height;

        if (maxWidth > 0 && bitmap.width > maxWidth) {
          const ratio = maxWidth / bitmap.width;
          targetW = maxWidth;
          targetH = Math.max(1, Math.round(bitmap.height * ratio));
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not initialize 2D canvas.');

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (outputFormat === 'image/jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetW, targetH);
        }

        ctx.drawImage(bitmap, 0, 0, targetW, targetH);

        const compressedBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('Failed to encode compressed image.'))),
            outputFormat,
            outputFormat === 'image/png' ? undefined : quality / 100
          );
        });

        const extMap: Record<typeof outputFormat, string> = {
          'image/jpeg': '.jpg',
          'image/webp': '.webp',
          'image/png': '.png',
        };

        const outUrl = URL.createObjectURL(compressedBlob);
        const outFilename = replaceFileExtension(
          file.name,
          `-compressed${extMap[outputFormat]}`
        );

        const rawSavings = ((file.size - compressedBlob.size) / file.size) * 100;

        compressedList.push({
          blob: compressedBlob,
          url: outUrl,
          filename: outFilename,
          width: targetW,
          height: targetH,
          originalSize: file.size,
          compressedSize: compressedBlob.size,
          savingsPercent: Number(rawSavings.toFixed(1)),
        });
      }

      setResults(compressedList);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not compress the selected image files.'
      );
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const handleDownloadAllZip = async () => {
    if (results.length === 0) return;
    const zip = new JSZip();
    results.forEach((r) => {
      zip.file(r.filename, r.blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(zipBlob, 'toolnova-compressed-images.zip');
  };

  return (
    <div className="space-y-6">
      <FileUploader
        accept="image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif"
        acceptLabel="JPG, PNG, WebP, AVIF"
        multiple={true}
        files={files}
        onFilesSelected={(selected) => {
          setFiles(selected);
          setResults([]);
          setError(null);
        }}
        onRemoveFile={(idx) => {
          setFiles((prev) => prev.filter((_, i) => i !== idx));
          setResults([]);
        }}
        onClearAll={handleReset}
        onLoadSample={handleLoadSample}
        sampleLabel="Load Sample High-Res Photo"
        helperText="Batch mode enabled: select or drop multiple images to compress them together."
      />

      {files.length > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Sliders className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <span>Compression Controls</span>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                <label htmlFor="compression-quality" className="font-medium text-slate-700">
                  Target Quality
                </label>
                <span className="font-mono font-semibold text-blue-600 tabular-nums">
                  {quality}%
                </span>
              </div>
              <input
                id="compression-quality"
                type="range"
                min={15}
                max={95}
                step={1}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>Maximum savings</span>
                <span>Balanced</span>
                <span>High clarity</span>
              </div>
            </div>

            <div>
              <label htmlFor="output-format" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Output Format
              </label>
              <select
                id="output-format"
                value={outputFormat}
                onChange={(e) =>
                  setOutputFormat(e.target.value as 'image/jpeg' | 'image/webp' | 'image/png')
                }
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-800"
              >
                <option value="image/jpeg">JPEG (.jpg) — Best compatibility</option>
                <option value="image/webp">WebP (.webp) — Maximum compression</option>
                <option value="image/png">PNG (.png) — Lossless compression</option>
              </select>
            </div>

            <div>
              <label htmlFor="max-width-constraint" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                Downscale Max Width (Optional)
              </label>
              <select
                id="max-width-constraint"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-800"
              >
                <option value={0}>Keep Original Resolution</option>
                <option value={2560}>Max 2560 px (2K QHD)</option>
                <option value={1920}>Max 1920 px (Full HD)</option>
                <option value={1280}>Max 1280 px (Web Standard)</option>
                <option value={800}>Max 800 px (Thumbnail/Blog)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              isLoading={isProcessing}
              onClick={handleCompress}
            >
              {files.length > 1 ? `Compress All (${files.length} Images)` : 'Compress Image'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Reset
            </Button>
            {isProcessing && progressMsg && (
              <span className="text-xs font-mono text-blue-600 animate-pulse">{progressMsg}</span>
            )}
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">Compression Error</p>
            <p className="mt-0.5 text-xs sm:text-sm">{error}</p>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200/70 pb-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Compression Complete: {results.length} File{results.length > 1 ? 's' : ''} Ready
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-mono tabular-nums mt-0.5">
                  Total original:{' '}
                  {formatFileSize(results.reduce((acc, r) => acc + r.originalSize, 0))} → Total
                  compressed:{' '}
                  <strong>
                    {formatFileSize(results.reduce((acc, r) => acc + r.compressedSize, 0))}
                  </strong>
                </p>
              </div>
            </div>

            {results.length > 1 ? (
              <Button
                variant="primary"
                size="md"
                onClick={handleDownloadAllZip}
                leftIcon={<Archive className="w-4 h-4" />}
              >
                Download All (.ZIP)
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => triggerDownload(results[0].blob, results[0].filename)}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download Compressed Image
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {results.map((item, idx) => (
              <div
                key={`${item.filename}-${idx}`}
                className="bg-white rounded-lg border border-slate-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
                  <img
                    src={item.url}
                    alt={item.filename}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-900 truncate">{item.filename}</p>
                    <p className="text-xs text-slate-500 font-mono tabular-nums">
                      {item.width}×{item.height}px · {formatFileSize(item.originalSize)} →{' '}
                      <strong className="text-slate-900">{formatFileSize(item.compressedSize)}</strong>{' '}
                      {item.savingsPercent > 0 ? (
                        <span className="text-emerald-700 font-semibold bg-emerald-100 px-1.5 py-0.5 rounded text-[11px] ml-1">
                          -{item.savingsPercent}% saved
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px] ml-1">(re-encoded)</span>
                      )}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => triggerDownload(item.blob, item.filename)}
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
