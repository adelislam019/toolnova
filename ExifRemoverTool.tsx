import React, { useState } from 'react';
import JSZip from 'jszip';
import { ShieldCheck, Download, RefreshCw, AlertCircle, CheckCircle2, Archive } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/Button';
import {
  formatFileSize,
  triggerDownload,
  replaceFileExtension,
  createSampleJpegWithExif,
} from '../utils/fileHelpers';

interface MetadataSegment {
  marker: string;
  name: string;
  byteLength: number;
  preview: string;
}

interface CleanExifResult {
  blob: Blob;
  url: string;
  filename: string;
  originalSize: number;
  cleanedSize: number;
  width: number;
  height: number;
  detectedSegments: MetadataSegment[];
}

async function scanBinaryMetadataSegments(file: File): Promise<MetadataSegment[]> {
  const segments: MetadataSegment[] = [];
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);

  if (bytes.length > 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let offset = 2;
    const decoder = new TextDecoder('utf-8', { fatal: false });

    while (offset + 4 < bytes.length) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      if (marker === 0xda || marker === 0xd9) break;

      const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
      if (length < 2 || offset + 2 + length > bytes.length) break;

      const payload = bytes.subarray(offset + 4, offset + 2 + length);
      const asciiPreview = decoder
        .decode(payload.subarray(0, Math.min(120, payload.length)))
        .replace(/[^\x20-\x7E]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (marker === 0xe1) {
        segments.push({
          marker: '0xFFE1 (APP1)',
          name: 'EXIF / XMP Camera & GPS Metadata',
          byteLength: length,
          preview: asciiPreview || 'Binary EXIF/TIFF IFD tags',
        });
      } else if (marker === 0xe2) {
        segments.push({
          marker: '0xFFE2 (APP2)',
          name: 'ICC Color Profile / FlashPix',
          byteLength: length,
          preview: asciiPreview || 'Embedded ICC profile segment',
        });
      } else if (marker === 0xfe) {
        segments.push({
          marker: '0xFFFE (COM)',
          name: 'Embedded JPEG Comment',
          byteLength: length,
          preview: asciiPreview || 'Comment segment',
        });
      } else if (marker >= 0xe3 && marker <= 0xef) {
        segments.push({
          marker: `0xFF${marker.toString(16).toUpperCase()} (APP${marker - 0xe0})`,
          name: 'Application Metadata Segment',
          byteLength: length,
          preview: asciiPreview || 'Vendor metadata header',
        });
      }

      offset += 2 + length;
    }
  }

  return segments;
}

export const ExifRemoverTool: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [foundSegmentsByFile, setFoundSegmentsByFile] = useState<Record<string, MetadataSegment[]>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CleanExifResult[]>([]);

  const handleFilesSelected = async (selected: File[]) => {
    setFiles(selected);
    setResults([]);
    setError(null);
    const segMap: Record<string, MetadataSegment[]> = {};
    for (const f of selected) {
      const segs = await scanBinaryMetadataSegments(f);
      segMap[f.name] = segs;
    }
    setFoundSegmentsByFile(segMap);
  };

  const handleLoadSample = async () => {
    const sample = await createSampleJpegWithExif();
    await handleFilesSelected([sample]);
  };

  const handleReset = () => {
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setFiles([]);
    setFoundSegmentsByFile({});
    setResults([]);
    setError(null);
  };

  const handleStripMetadata = async () => {
    if (files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    results.forEach((r) => URL.revokeObjectURL(r.url));
    setResults([]);

    const cleanList: CleanExifResult[] = [];

    try {
      for (const file of files) {
        const bitmap = await createImageBitmap(file);
        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to initialize clean pixel canvas.');

        ctx.drawImage(bitmap, 0, 0);

        const outMime =
          file.type === 'image/png'
            ? 'image/png'
            : file.type === 'image/webp'
            ? 'image/webp'
            : 'image/jpeg';

        const cleanBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => (b ? resolve(b) : reject(new Error('Failed to encode clean image.'))),
            outMime,
            outMime === 'image/png' ? undefined : 0.94
          );
        });

        const ext = outMime === 'image/png' ? '.png' : outMime === 'image/webp' ? '.webp' : '.jpg';
        const outUrl = URL.createObjectURL(cleanBlob);

        cleanList.push({
          blob: cleanBlob,
          url: outUrl,
          filename: replaceFileExtension(file.name, `-clean${ext}`),
          originalSize: file.size,
          cleanedSize: cleanBlob.size,
          width: bitmap.width,
          height: bitmap.height,
          detectedSegments: foundSegmentsByFile[file.name] || [],
        });
      }

      setResults(cleanList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to strip metadata from images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAllZip = async () => {
    if (results.length === 0) return;
    const zip = new JSZip();
    results.forEach((r) => {
      zip.file(r.filename, r.blob);
    });
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(zipBlob, 'toolnova-clean-photos.zip');
  };

  const totalDetectedSegments = Object.values(foundSegmentsByFile).reduce(
    (acc, segs) => acc + segs.length,
    0
  );

  return (
    <div className="space-y-6">
      <FileUploader
        accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        acceptLabel="JPG, JPEG, PNG, WebP"
        multiple={true}
        files={files}
        onFilesSelected={handleFilesSelected}
        onRemoveFile={(idx) => {
          setFiles((prev) => prev.filter((_, i) => i !== idx));
          setResults([]);
        }}
        onClearAll={handleReset}
        onLoadSample={handleLoadSample}
        sampleLabel="Load Sample Photo with EXIF & GPS"
        helperText="Batch mode enabled: select multiple photos to strip GPS, camera metadata, and serial numbers all at once."
      />

      {files.length > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Binary Metadata Scan ({files.length} file{files.length > 1 ? 's' : ''} loaded)
            </h3>
            <span className="text-xs font-mono text-slate-600">
              {totalDetectedSegments > 0 ? (
                <strong className="text-amber-700">{totalDetectedSegments} metadata segment(s) detected</strong>
              ) : (
                'Clean or non-standard binary metadata'
              )}
            </span>
          </div>

          {totalDetectedSegments > 0 ? (
            <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3.5 space-y-2">
              <div className="text-xs font-semibold text-amber-900">
                Identified Embedded Metadata Segments (will be 100% stripped):
              </div>
              <ul className="text-xs text-amber-800 space-y-1 font-mono">
                {Object.entries(foundSegmentsByFile).flatMap(([fname, segs]) =>
                  segs.map((seg, i) => (
                    <li key={`${fname}-${seg.marker}-${i}`} className="truncate">
                      • <strong>{fname}</strong>: {seg.marker} — {seg.name} ({seg.byteLength} bytes)
                    </li>
                  ))
                )}
              </ul>
            </div>
          ) : (
            <p className="text-xs text-slate-500">
              No APP1/EXIF segments detected in the selected files. Re-encoding will ensure all
              hidden markers and thumbnail caches are removed.
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              isLoading={isProcessing}
              onClick={handleStripMetadata}
              leftIcon={<ShieldCheck className="w-5 h-5" />}
            >
              {files.length > 1
                ? `Strip Metadata from All (${files.length} Photos)`
                : 'Strip EXIF & Clean Image'}
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
        <div
          role="alert"
          className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-800 text-sm"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold">Processing Error</p>
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
                  Metadata Successfully Stripped ({results.length} photo{results.length > 1 ? 's' : ''})
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  All GPS locations, camera serials, timestamps, and EXIF headers were permanently removed.
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
                Download All Clean Photos (.ZIP)
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => triggerDownload(results[0].blob, results[0].filename)}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Download Clean Image
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
                      <strong>{formatFileSize(item.cleanedSize)}</strong>
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
