import React, { useState } from 'react';
import { Copy, Check, Download, RefreshCw } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/Button';
import { createSampleImageFile, triggerDownload } from '../utils/fileHelpers';

interface Swatch {
  hex: string;
  rgb: string;
  hsl: string;
  r: number;
  g: number;
  b: number;
  percentage: number;
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((c) => Math.max(0, Math.min(255, Math.round(c))).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function rgbToHslString(r: number, g: number, b: number): string {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      case bn:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export const ImageColorPaletteTool: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [swatchCount, setSwatchCount] = useState<number>(8);
  const [swatches, setSwatches] = useState<Swatch[]>([]);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const extractPalette = async (file: File, targetCount: number) => {
    const bitmap = await createImageBitmap(file);
    const sampleSize = 140;
    const canvas = document.createElement('canvas');
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(bitmap, 0, 0, sampleSize, sampleSize);
    const data = ctx.getImageData(0, 0, sampleSize, sampleSize).data;

    const buckets = new Map<string, { r: number; g: number; b: number; count: number }>();
    let totalValid = 0;

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 128) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const qr = Math.round(r / 24) * 24;
      const qg = Math.round(g / 24) * 24;
      const qb = Math.round(b / 24) * 24;
      const key = `${qr},${qg},${qb}`;

      const existing = buckets.get(key);
      if (existing) {
        existing.r += r;
        existing.g += g;
        existing.b += b;
        existing.count += 1;
      } else {
        buckets.set(key, { r, g, b, count: 1 });
      }
      totalValid++;
    }

    const sortedClusters = Array.from(buckets.values())
      .map((item) => ({
        r: Math.round(item.r / item.count),
        g: Math.round(item.g / item.count),
        b: Math.round(item.b / item.count),
        count: item.count,
      }))
      .sort((a, b) => b.count - a.count);

    const selected: typeof sortedClusters = [];
    for (const candidate of sortedClusters) {
      if (selected.length >= targetCount) break;
      const tooClose = selected.some((s) => {
        const dist = Math.sqrt(
          Math.pow(s.r - candidate.r, 2) +
            Math.pow(s.g - candidate.g, 2) +
            Math.pow(s.b - candidate.b, 2)
        );
        return dist < 42;
      });
      if (!tooClose) {
        selected.push(candidate);
      }
    }

    for (const candidate of sortedClusters) {
      if (selected.length >= targetCount) break;
      if (!selected.includes(candidate)) selected.push(candidate);
    }

    const selectedSum = selected.reduce((acc, s) => acc + s.count, 0) || totalValid || 1;
    const finalSwatches: Swatch[] = selected.map((s) => ({
      hex: rgbToHex(s.r, s.g, s.b),
      rgb: `rgb(${s.r}, ${s.g}, ${s.b})`,
      hsl: rgbToHslString(s.r, s.g, s.b),
      r: s.r,
      g: s.g,
      b: s.b,
      percentage: Number(((s.count / selectedSum) * 100).toFixed(1)),
    }));

    setSwatches(finalSwatches);
  };

  const handleFilesSelected = async (selected: File[]) => {
    setFiles(selected);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (selected[0]) {
      setPreviewUrl(URL.createObjectURL(selected[0]));
      await extractPalette(selected[0], swatchCount);
    }
  };

  const handleLoadSample = async () => {
    const file = await createSampleImageFile('brand-inspiration.png', 'image/png', 1200, 800);
    await handleFilesSelected([file]);
  };

  const handleReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setFiles([]);
    setPreviewUrl(null);
    setSwatches([]);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(text);
    setTimeout(() => setCopiedValue(null), 1600);
  };

  const downloadPalettePng = async () => {
    if (swatches.length === 0) return;
    const cardW = 1000;
    const cardH = 320;
    const canvas = document.createElement('canvas');
    canvas.width = cardW;
    canvas.height = cardH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cardW, cardH);

    const colW = cardW / swatches.length;
    swatches.forEach((sw, i) => {
      const x = i * colW;
      ctx.fillStyle = sw.hex;
      ctx.fillRect(x, 0, colW, 230);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(sw.hex, x + 14, 265);

      ctx.fillStyle = '#64748b';
      ctx.font = '12px monospace';
      ctx.fillText(`${sw.percentage}%`, x + 14, 290);
    });

    canvas.toBlob((blob) => {
      if (blob) triggerDownload(blob, 'toolnova-color-palette.png');
    }, 'image/png');
  };

  const cssVariablesCode =
    swatches.length > 0
      ? `:root {\n${swatches
          .map((s, idx) => `  --palette-color-${idx + 1}: ${s.hex}; /* ${s.rgb} */`)
          .join('\n')}\n}`
      : '';

  return (
    <div className="space-y-6">
      <FileUploader
        accept="image/*"
        acceptLabel="JPG, PNG, WebP, SVG, AVIF"
        files={files}
        onFilesSelected={handleFilesSelected}
        onRemoveFile={handleReset}
        onLoadSample={handleLoadSample}
        sampleLabel="Load Sample Artwork"
      />

      {files.length > 0 && swatches.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-slate-700">Palette Size:</span>
              {[5, 8, 12].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={async () => {
                    setSwatchCount(count);
                    if (files[0]) await extractPalette(files[0], count);
                  }}
                  className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-colors cursor-pointer ${
                    swatchCount === count
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-blue-500'
                  }`}
                >
                  {count} Colors
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyText(cssVariablesCode)}
                leftIcon={
                  copiedValue === cssVariablesCode ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )
                }
              >
                {copiedValue === cssVariablesCode ? 'Copied CSS Variables' : 'Copy CSS :root'}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={downloadPalettePng}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Download Palette PNG
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Reset
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {previewUrl && (
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Uploaded inspiration"
                  referrerPolicy="no-referrer"
                  className="max-h-72 w-auto object-contain rounded-lg"
                />
              </div>
            )}

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {swatches.map((swatch) => (
                <div
                  key={swatch.hex}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 flex items-center gap-3.5"
                >
                  <div
                    className="w-14 h-14 rounded-lg border border-black/10 shrink-0 shadow-2xs"
                    style={{ backgroundColor: swatch.hex }}
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => copyText(swatch.hex)}
                        className="font-mono text-sm font-bold text-slate-900 hover:text-blue-600 flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{swatch.hex}</span>
                        {copiedValue === swatch.hex ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                      <span className="text-xs font-mono text-slate-500 tabular-nums">
                        {swatch.percentage}%
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 text-[11px] font-mono text-slate-500">
                      <button
                        type="button"
                        onClick={() => copyText(swatch.rgb)}
                        className="hover:text-blue-600 cursor-pointer truncate"
                      >
                        {swatch.rgb}
                      </button>
                      <span>·</span>
                      <button
                        type="button"
                        onClick={() => copyText(swatch.hsl)}
                        className="hover:text-blue-600 cursor-pointer truncate"
                      >
                        {swatch.hsl}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
