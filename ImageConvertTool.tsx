import React, { useState } from 'react';
import heic2any from 'heic2any';
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

interface ImageConvertToolProps {
  mode: 'heic-to-jpg' | 'webp-to-jpg' | 'webp-to-png' | 'avif-to-jpg';
}

interface ConvertedResult {
  blob: Blob;
  url: string;
  filename: string;
  width: number;
  height: number;
  originalSize: number;
  convertedSize: number;
}

export const ImageConvertTool: React.FC<ImageConvertToolProps> = ({ mode }) => {
  const isOutputPng = mode === 'webp-to-png';
  const targetMime = isOutputPng ? 'image/png' : 'image/jpeg';
  const targetExt = isOutputPng ? '.png' : '.jpg';

  const [files, setFiles] = useState<File[]>([]);
  const [quality, setQuality] = useState<number>(90);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ConvertedResult[]>([]);

  const configMap = {
    'heic-to-jpg': {
      accept: '.heic,.heif,image/heic,image/heif,image/*',
      acceptLabel: 'HEIC, HEIF (or standard images to test)',
      sampleName: 'sample-iphone-photo.heic',
      buttonLabel: 'Convert to JPG',
    },
    'webp-to-jpg': {
      accept: '.webp,image/webp,image/*',
      acceptLabel: 'WebP (.webp)',
      sampleName: 'sample-graphic.webp',
      buttonLabel: 'Convert WebP to JPG',
    },
    'webp-to-png': {
      accept: '.webp,image/webp,image/*',
      acceptLabel: 'WebP (.webp)',
      sampleName: 'sample-transparent.webp',
      buttonLabel: 'Convert WebP to PNG',
    },
    'avif-to-jpg': {
      accept: '.avif,image/avif,image/*',
      acceptLabel: 'AVIF (.avif)',
      sampleName: 'sample-nextgen.avif',
      buttonLabel: 'Convert AVIF to JPG',
    },
  }[mode];

  const handleLoadSample = async () => {
    setError(null);
    setResults([]);
    const sampleMime =
      mode === 'webp-to-jpg' || mode === 'webp-to-png' ? 'image/webp' : 'image/png';
    const file = await createSampleImageFile(configMap.sampleName, sampleMime, 1280, 850);
    setFiles([file]);
  };

  const handleReset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setFiles([]);
    setResults([]);
    setError(null);
    setIsProcessing(false);
    setProgressMsg('');
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);

    const convertedList: ConvertedResult[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgressMsg(
          files.length > 1
            ? `Converting ${i + 1} of ${files.length}: ${file.name}...`
            : `Processing ${file.name}...`
        );

        let decodeSourceBlob: Blob = file;
        const isHeicFile =
          file.name.toLowerCase().endsWith('.heic') ||
          file.name.toLowerCase().endsWith('.heif') ||
          file.type === 'image/heic' ||
          file.type === 'image/heif';

        if (mode === 'heic-to-jpg' && isHeicFile) {
          try {
            const converted = await heic2any({
              blob: file,
              toType: 'image/jpeg',
              quality: quality / 100,
            });
            decodeSourceBlob = Array.isArray(converted) ? converted[0] : converted;
          } catch {
            decodeSourceBlob = file;
          }
        }

        const bitmap = await createImageBitmap(decodeSourceBlob);
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Failed to initialize browser 2D graphics canvas.');
        }

        if (!isOutputPng) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(bitmap, 0, 0);

        const outputBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (!b) reject(new Error('Browser failed to encode output image.'));
              else resolve(b);
            },
            targetMime,
            isOutputPng ? undefined : quality / 100
          );
        });

        const outUrl = URL.createObjectURL(outputBlob);
        const outFilename = replaceFileExtension(file.name, targetExt);

        convertedList.push({
          blob: outputBlob,
          url: outUrl,
          filename: outFilename,
          width: bitmap.width,
          height: bitmap.height,
          originalSize: file.size,
          convertedSize: outputBlob.size,
        });
      }

      setResults(convertedList);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Conversion encountered an issue: ${err.message}`
          : 'An unexpected error occurred while converting the image.'
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
    triggerDownload(zipBlob, `toolnova-${mode}-converted.zip`);
  };

  return (
    <div className="space-y-6">
      <FileUploader
        accept={configMap.accept}
        acceptLabel={configMap.acceptLabel}
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
        sampleLabel="Load Sample Image"
        helperText="Batch mode enabled: select or drag multiple images to convert them all at once."
      />

      {files.length > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Sliders className="w-4 h-4 text-blue-600" aria-hidden="true" />
              <span>Output Settings</span>
            </div>
            <span className="text-xs font-medium text-slate-500">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </span>
          </div>

          {!isOutputPng ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center justify-between text-xs sm:text-sm mb-1.5">
                  <label htmlFor="jpg-quality-slider" className="font-medium text-slate-700">
                    JPEG Quality
                  </label>
                  <span className="font-mono font-semibold text-blue-600 tabular-nums">
                    {quality}%
                  </span>
                </div>
                <input
                  id="jpg-quality-slider"
                  type="range"
                  min={10}
                  max={100}
                  step={2}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>Smaller file (10%)</span>
                  <span>Balanced (90%)</span>
                  <span>Maximum (100%)</span>
                </div>
              </div>

              <div>
                <label htmlFor="bg-matte-color" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
                  Transparency Fill Color
                </label>
                <div className="flex items-center gap-2.5">
                  <input
                    id="bg-matte-color"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-9 w-12 rounded-md border border-slate-300 bg-white p-0.5 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    aria-label="Transparency fill hex code"
                    className="w-28 px-3 py-1.5 text-sm font-mono border border-slate-300 rounded-lg bg-white text-slate-800"
                  />
                  <span className="text-xs text-slate-500">Used if source has alpha</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-slate-600">
              Lossless PNG encoding preserves full 32-bit RGBA alpha transparency with zero compression artifacts.
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              isLoading={isProcessing}
              onClick={handleConvert}
            >
              {files.length > 1 ? `Convert All (${files.length} Files)` : configMap.buttonLabel}
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
            <p className="font-semibold">Conversion Failed</p>
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
                  Conversion Complete: {results.length} File{results.length > 1 ? 's' : ''} Ready
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-mono tabular-nums mt-0.5">
                  Total output: {formatFileSize(results.reduce((acc, r) => acc + r.convertedSize, 0))}
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
                Download {isOutputPng ? 'PNG' : 'JPG'}
              </Button>
            )}
          </div>

          {/* Results list */}
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
                      <strong className="text-slate-800">{formatFileSize(item.convertedSize)}</strong>
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
