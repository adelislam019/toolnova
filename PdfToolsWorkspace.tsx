import React, { useState, useEffect } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import JSZip from 'jszip';
import {
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  AlertCircle,
  ClipboardPaste,
} from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/Button';
import {
  formatFileSize,
  triggerDownload,
  createSampleImageFile,
  createSamplePdfFile,
} from '../utils/fileHelpers';

interface PdfToolsWorkspaceProps {
  mode: 'jpg-png-to-pdf' | 'merge-pdf' | 'split-pdf' | 'screenshot-to-pdf';
}

export const PdfToolsWorkspace: React.FC<PdfToolsWorkspaceProps> = ({ mode }) => {
  const isImageInput = mode === 'jpg-png-to-pdf' || mode === 'screenshot-to-pdf';

  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [marginSize, setMarginSize] = useState<number>(24);
  const [captionHeader, setCaptionHeader] = useState<string>('');
  const [splitMode, setSplitMode] = useState<'range' | 'all-zip'>('range');
  const [pageRangeInput, setPageRangeInput] = useState<string>('1-2');
  const [pdfPageCounts, setPdfPageCounts] = useState<Record<string, number>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputFilename, setOutputFilename] = useState<string>('');
  const [outputSummary, setOutputSummary] = useState<string>('');

  useEffect(() => {
    setFiles([]);
    setError(null);
    setOutputBlob(null);
    setOutputFilename('');
    setOutputSummary('');
    setPdfPageCounts({});
  }, [mode]);

  useEffect(() => {
    if (mode !== 'screenshot-to-pdf') return;
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      const pastedFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const f = items[i].getAsFile();
          if (f) {
            const namedFile = new File(
              [f],
              `clipboard-screenshot-${files.length + pastedFiles.length + 1}.png`,
              { type: f.type }
            );
            pastedFiles.push(namedFile);
          }
        }
      }
      if (pastedFiles.length > 0) {
        setFiles((prev) => [...prev, ...pastedFiles]);
        setOutputBlob(null);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [mode, files.length]);

  const inspectPdfFiles = async (selected: File[]) => {
    setFiles(selected);
    setOutputBlob(null);
    setError(null);

    if (!isImageInput) {
      const counts: Record<string, number> = {};
      for (const f of selected) {
        try {
          const buf = await f.arrayBuffer();
          const doc = await PDFDocument.load(buf);
          counts[f.name] = doc.getPageCount();
        } catch {
          counts[f.name] = 0;
        }
      }
      setPdfPageCounts(counts);
    }
  };

  const handleLoadSample = async () => {
    setError(null);
    setOutputBlob(null);
    if (isImageInput) {
      const img1 = await createSampleImageFile('page-1-capture.png', 'image/png', 1200, 850);
      const img2 = await createSampleImageFile('page-2-capture.jpg', 'image/jpeg', 1200, 850);
      setFiles([img1, img2]);
    } else if (mode === 'merge-pdf') {
      const pdf1 = await createSamplePdfFile('invoice-part-1.pdf', 2, 'Invoice Summary (Part 1)');
      const pdf2 = await createSamplePdfFile('contract-appendix-2.pdf', 3, 'Contract Appendix (Part 2)');
      await inspectPdfFiles([pdf1, pdf2]);
    } else {
      const pdf = await createSamplePdfFile('quarterly-report-5pages.pdf', 5, 'Quarterly Report');
      await inspectPdfFiles([pdf]);
      setPageRangeInput('1-3, 5');
    }
  };

  const moveFile = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= files.length) return;
    const copy = [...files];
    const [item] = copy.splice(index, 1);
    copy.splice(target, 0, item);
    setFiles(copy);
    setOutputBlob(null);
  };

  const removeFileAt = (index: number) => {
    const copy = files.filter((_, i) => i !== index);
    setFiles(copy);
    setOutputBlob(null);
  };

  const handleReset = () => {
    setFiles([]);
    setOutputBlob(null);
    setError(null);
    setPdfPageCounts({});
  };

  const runImagesToPdf = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);

    try {
      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const bitmap = await createImageBitmap(file);

        const canvas = document.createElement('canvas');
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to create canvas for image embedding.');
        ctx.drawImage(bitmap, 0, 0);

        const pngDataUrl = canvas.toDataURL('image/png');
        const embeddedImg = await pdfDoc.embedPng(pngDataUrl);

        let pageW = bitmap.width;
        let pageH = bitmap.height;

        if (pageSize === 'a4') {
          pageW = 595.28;
          pageH = 841.89;
        } else if (pageSize === 'letter') {
          pageW = 612;
          pageH = 792;
        }

        const page = pdfDoc.addPage([pageW, pageH]);
        const effectiveMargin = pageSize === 'fit' ? 0 : marginSize;
        const headerOffset = mode === 'screenshot-to-pdf' && captionHeader.trim() ? 24 : 0;

        const availW = Math.max(50, pageW - effectiveMargin * 2);
        const availH = Math.max(50, pageH - effectiveMargin * 2 - headerOffset);

        const scale =
          pageSize === 'fit'
            ? 1
            : Math.min(availW / bitmap.width, availH / bitmap.height);

        const drawW = bitmap.width * scale;
        const drawH = bitmap.height * scale;
        const drawX = (pageW - drawW) / 2;
        const drawY = (pageH - headerOffset - drawH) / 2;

        if (mode === 'screenshot-to-pdf' && captionHeader.trim()) {
          page.drawText(`${captionHeader.trim()} (Screen ${i + 1})`, {
            x: Math.max(20, effectiveMargin),
            y: pageH - Math.max(24, effectiveMargin),
            size: 11,
            font,
            color: rgb(0.15, 0.23, 0.4),
          });
        }

        page.drawImage(embeddedImg, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
      const outName =
        mode === 'screenshot-to-pdf'
          ? 'toolnova-screenshots.pdf'
          : 'toolnova-images-combined.pdf';

      setOutputBlob(blob);
      setOutputFilename(outName);
      setOutputSummary(
        `${files.length} page(s) generated · Final PDF size: ${formatFileSize(blob.size)}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to build PDF from images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const runMergePdf = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();
      let totalPages = 0;

      for (const file of files) {
        const buf = await file.arrayBuffer();
        const srcDoc = await PDFDocument.load(buf);
        const indices = srcDoc.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(srcDoc, indices);
        copiedPages.forEach((p) => mergedPdf.addPage(p));
        totalPages += indices.length;
      }

      const bytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      setOutputBlob(blob);
      setOutputFilename('toolnova-merged-document.pdf');
      setOutputSummary(
        `Merged ${files.length} PDF files (${totalPages} total pages) · Size: ${formatFileSize(blob.size)}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? `Failed to merge PDFs: ${err.message}`
          : 'Could not merge the uploaded PDF documents.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const runSplitPdf = async () => {
    const file = files[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const buf = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buf);
      const totalPages = srcDoc.getPageCount();

      if (splitMode === 'all-zip') {
        const zip = new JSZip();
        const baseName = file.name.replace(/\.pdf$/i, '');

        for (let i = 0; i < totalPages; i++) {
          const singleDoc = await PDFDocument.create();
          const [copied] = await singleDoc.copyPages(srcDoc, [i]);
          singleDoc.addPage(copied);
          const singleBytes = await singleDoc.save();
          zip.file(`${baseName}-page-${i + 1}.pdf`, new Uint8Array(singleBytes));
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setOutputBlob(zipBlob);
        setOutputFilename(`${baseName}-split-pages.zip`);
        setOutputSummary(
          `Split all ${totalPages} pages into individual PDFs inside ZIP (${formatFileSize(zipBlob.size)})`
        );
      } else {
        const selectedZeroBased: number[] = [];
        const parts = pageRangeInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        for (const part of parts) {
          if (part.includes('-')) {
            const [startStr, endStr] = part.split('-').map((s) => s.trim());
            const start = parseInt(startStr, 10);
            const end = parseInt(endStr, 10);
            if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
              throw new Error(
                `Invalid page range "${part}". Document has ${totalPages} page(s) (valid range: 1-${totalPages}).`
              );
            }
            for (let p = start; p <= end; p++) {
              if (!selectedZeroBased.includes(p - 1)) selectedZeroBased.push(p - 1);
            }
          } else {
            const pageNum = parseInt(part, 10);
            if (isNaN(pageNum) || pageNum < 1 || pageNum > totalPages) {
              throw new Error(
                `Invalid page number "${part}". Document has ${totalPages} page(s).`
              );
            }
            if (!selectedZeroBased.includes(pageNum - 1)) selectedZeroBased.push(pageNum - 1);
          }
        }

        if (selectedZeroBased.length === 0) {
          throw new Error('Please specify at least one valid page number to extract.');
        }

        const extractedDoc = await PDFDocument.create();
        const copiedPages = await extractedDoc.copyPages(srcDoc, selectedZeroBased);
        copiedPages.forEach((p) => extractedDoc.addPage(p));

        const outBytes = await extractedDoc.save();
        const blob = new Blob([new Uint8Array(outBytes)], { type: 'application/pdf' });
        const baseName = file.name.replace(/\.pdf$/i, '');

        setOutputBlob(blob);
        setOutputFilename(`${baseName}-extracted.pdf`);
        setOutputSummary(
          `Extracted ${selectedZeroBased.length} of ${totalPages} pages · Output size: ${formatFileSize(
            blob.size
          )}`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to split PDF document.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {mode === 'screenshot-to-pdf' && (
        <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/80 flex items-center gap-2.5 text-xs sm:text-sm text-blue-900">
          <ClipboardPaste className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            <strong>Tip:</strong> You can press <kbd className="font-mono font-semibold">Ctrl+V</kbd> or{' '}
            <kbd className="font-mono font-semibold">⌘V</kbd> anywhere on this page to paste screenshots directly from your clipboard.
          </span>
        </div>
      )}

      <FileUploader
        accept={isImageInput ? 'image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp' : '.pdf,application/pdf'}
        acceptLabel={isImageInput ? 'JPG, PNG, WebP' : 'PDF Document (.pdf)'}
        multiple={mode !== 'split-pdf'}
        files={files}
        onFilesSelected={inspectPdfFiles}
        onRemoveFile={removeFileAt}
        onClearAll={handleReset}
        onLoadSample={handleLoadSample}
        sampleLabel={
          isImageInput
            ? 'Load 2 Sample Pages'
            : mode === 'merge-pdf'
            ? 'Load 2 Sample PDFs'
            : 'Load 5-Page Sample PDF'
        }
      />

      {files.length > 1 && mode !== 'split-pdf' && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2.5">
          <div className="text-xs font-semibold text-slate-700">
            Page / Document Sequence (Use arrows to reorder)
          </div>
          <div className="space-y-2">
            {files.map((file, idx) => (
              <div
                key={`${file.name}-${idx}`}
                className="bg-white rounded-lg border border-slate-200 px-3.5 py-2.5 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-mono font-semibold text-blue-600 tabular-nums">
                    #{idx + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-900 truncate">{file.name}</span>
                  {pdfPageCounts[file.name] ? (
                    <span className="text-xs font-mono text-slate-500 tabular-nums">
                      ({pdfPageCounts[file.name]} pages)
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveFile(idx, -1)}
                    aria-label={`Move ${file.name} up`}
                    className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowUp className="w-4 h-4 text-slate-700" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === files.length - 1}
                    onClick={() => moveFile(idx, 1)}
                    aria-label={`Move ${file.name} down`}
                    className="p-1.5 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ArrowDown className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
          {isImageInput && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="pdf-page-size" className="block text-xs font-medium text-slate-700 mb-1">
                  PDF Page Size
                </label>
                <select
                  id="pdf-page-size"
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as 'a4' | 'letter' | 'fit')}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
                >
                  <option value="a4">A4 Standard (210 × 297 mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="fit">Fit to Exact Image Pixels</option>
                </select>
              </div>

              <div>
                <label htmlFor="pdf-margin" className="block text-xs font-medium text-slate-700 mb-1">
                  Page Margin
                </label>
                <select
                  id="pdf-margin"
                  value={marginSize}
                  disabled={pageSize === 'fit'}
                  onChange={(e) => setMarginSize(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900 disabled:opacity-50"
                >
                  <option value={0}>No Margin (Full Bleed)</option>
                  <option value={24}>Standard Margin (24 pt)</option>
                  <option value={48}>Wide Margin (48 pt)</option>
                </select>
              </div>

              {mode === 'screenshot-to-pdf' && (
                <div>
                  <label htmlFor="screenshot-caption" className="block text-xs font-medium text-slate-700 mb-1">
                    Optional Header Caption
                  </label>
                  <input
                    id="screenshot-caption"
                    type="text"
                    value={captionHeader}
                    onChange={(e) => setCaptionHeader(e.target.value)}
                    placeholder="e.g., Release QA Verification"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
                  />
                </div>
              )}
            </div>
          )}

          {mode === 'split-pdf' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-900">Split Configuration</span>
                {pdfPageCounts[files[0].name] && (
                  <span className="text-xs font-mono font-semibold text-blue-600 tabular-nums">
                    Total Pages Detected: {pdfPageCounts[files[0].name]}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSplitMode('range')}
                  className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    splitMode === 'range'
                      ? 'bg-blue-50/70 border-blue-600 text-slate-900'
                      : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-sm font-semibold">Extract Custom Page Range</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Creates a single new PDF with your chosen pages (e.g., 1-3, 5)
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSplitMode('all-zip')}
                  className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    splitMode === 'all-zip'
                      ? 'bg-blue-50/70 border-blue-600 text-slate-900'
                      : 'bg-white border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-sm font-semibold">Split Every Page into ZIP</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Saves every page as an individual 1-page PDF file inside a ZIP archive
                  </div>
                </button>
              </div>

              {splitMode === 'range' && (
                <div className="max-w-sm">
                  <label htmlFor="page-range-input" className="block text-xs font-medium text-slate-700 mb-1">
                    Pages to Extract (comma-separated or ranges)
                  </label>
                  <input
                    id="page-range-input"
                    type="text"
                    value={pageRangeInput}
                    onChange={(e) => setPageRangeInput(e.target.value)}
                    placeholder="e.g., 1-3, 5"
                    className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 bg-white text-slate-900"
                  />
                </div>
              )}
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="lg"
              isLoading={isProcessing}
              onClick={
                isImageInput
                  ? runImagesToPdf
                  : mode === 'merge-pdf'
                  ? runMergePdf
                  : runSplitPdf
              }
            >
              {isImageInput
                ? 'Generate PDF Document'
                : mode === 'merge-pdf'
                ? `Merge ${files.length} PDF Files`
                : splitMode === 'all-zip'
                ? 'Split All Pages (ZIP)'
                : 'Extract Selected Pages'}
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

      {outputBlob && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Ready for Download: {outputFilename}
              </h3>
              <p className="text-xs sm:text-sm font-mono tabular-nums text-slate-600 mt-0.5">
                {outputSummary}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => triggerDownload(outputBlob, outputFilename)}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download {outputFilename.endsWith('.zip') ? 'ZIP Archive' : 'PDF File'}
          </Button>
        </div>
      )}
    </div>
  );
};
