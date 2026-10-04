import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, AlertCircle, Code2, Upload } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/Button';
import { formatFileSize, triggerDownload, replaceFileExtension } from '../utils/fileHelpers';

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160" width="240" height="160" fill="none">
  <rect width="240" height="160" rx="20" fill="#1E3A8A"/>
  <circle cx="175" cy="52" r="24" fill="#F59E0B"/>
  <path d="M36 124L84 68L124 108L158 76L204 124H36Z" fill="#3B82F6"/>
  <rect x="28" y="26" width="96" height="28" rx="6" fill="#FFFFFF"/>
  <text x="40" y="45" fill="#0F172A" font-family="sans-serif" font-size="13" font-weight="bold">ToolNova SVG</text>
</svg>`;

interface RasterizedResult {
  blob: Blob;
  url: string;
  filename: string;
  width: number;
  height: number;
  size: number;
}

export const SvgToPngTool: React.FC = () => {
  const [inputMode, setInputMode] = useState<'file' | 'code'>('file');
  const [files, setFiles] = useState<File[]>([]);
  const [svgCode, setSvgCode] = useState<string>('');
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(2);
  const [transparentBg, setTransparentBg] = useState<boolean>(true);
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RasterizedResult | null>(null);

  const handleLoadSample = () => {
    setError(null);
    setResult(null);
    const blob = new Blob([SAMPLE_SVG], { type: 'image/svg+xml' });
    const file = new File([blob], 'sample-vector-graphic.svg', { type: 'image/svg+xml' });
    setFiles([file]);
    setSvgCode(SAMPLE_SVG);
  };

  const handleFilesSelected = async (selected: File[]) => {
    setFiles(selected);
    setResult(null);
    setError(null);
    if (selected[0]) {
      const text = await selected[0].text();
      setSvgCode(text);
    }
  };

  const handleReset = () => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFiles([]);
    setSvgCode('');
    setResult(null);
    setError(null);
  };

  const handleConvert = async () => {
    setError(null);
    const rawSvg = svgCode.trim();
    if (!rawSvg || !rawSvg.includes('<svg')) {
      setError('Please upload a valid .svg file or paste valid <svg> XML code.');
      return;
    }

    setIsProcessing(true);

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawSvg, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');
      if (!svgEl) {
        throw new Error('Could not find a root <svg> element in the provided markup.');
      }

      let baseW = parseFloat(svgEl.getAttribute('width') || '0');
      let baseH = parseFloat(svgEl.getAttribute('height') || '0');
      const viewBox = svgEl.getAttribute('viewBox');

      if ((!baseW || !baseH) && viewBox) {
        const parts = viewBox
          .trim()
          .split(/[\s,]+/)
          .map(Number);
        if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
          baseW = parts[2];
          baseH = parts[3];
        }
      }

      if (!baseW || !baseH || isNaN(baseW) || isNaN(baseH)) {
        baseW = 512;
        baseH = 512;
      }

      const outW = Math.min(8192, Math.max(16, Math.round(baseW * scaleMultiplier)));
      const outH = Math.min(8192, Math.max(16, Math.round(baseH * scaleMultiplier)));

      svgEl.setAttribute('width', String(outW));
      svgEl.setAttribute('height', String(outH));
      if (!svgEl.getAttribute('xmlns')) {
        svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      }

      const serialized = new XMLSerializer().serializeToString(svgEl);
      const svgBlob = new Blob([serialized], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Browser failed to render the SVG markup.'));
        img.src = svgUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to create canvas context.');

      if (!transparentBg) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, outW, outH);
      }

      ctx.drawImage(img, 0, 0, outW, outH);
      URL.revokeObjectURL(svgUrl);

      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Failed to encode PNG output.'))),
          'image/png'
        );
      });

      if (result?.url) URL.revokeObjectURL(result.url);
      const outUrl = URL.createObjectURL(pngBlob);
      const baseFilename = files[0]?.name || 'vector-graphic.svg';

      setResult({
        blob: pngBlob,
        url: outUrl,
        filename: replaceFileExtension(baseFilename, `-${scaleMultiplier}x.png`),
        width: outW,
        height: outH,
        size: pngBlob.size,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert SVG to PNG.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setInputMode('file')}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            inputMode === 'file'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload SVG File</span>
        </button>
        <button
          type="button"
          onClick={() => setInputMode('code')}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            inputMode === 'code'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Paste SVG Code</span>
        </button>
      </div>

      {inputMode === 'file' ? (
        <FileUploader
          accept=".svg,image/svg+xml"
          acceptLabel="SVG Vector (.svg)"
          files={files}
          onFilesSelected={handleFilesSelected}
          onRemoveFile={handleReset}
          onLoadSample={handleLoadSample}
          sampleLabel="Load Sample SVG Vector"
        />
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label htmlFor="svg-code-input" className="text-sm font-semibold text-slate-800">
              Raw SVG Markup
            </label>
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Load Sample &lt;svg&gt; Code
            </button>
          </div>
          <textarea
            id="svg-code-input"
            rows={7}
            value={svgCode}
            onChange={(e) => {
              setSvgCode(e.target.value);
              setResult(null);
            }}
            placeholder="<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 100 100&quot;>...</svg>"
            className="w-full p-3.5 font-mono text-xs sm:text-sm rounded-xl border border-slate-300 bg-slate-50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      )}

      {(files.length > 0 || svgCode.trim().length > 0) && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <span className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                Output Resolution Scale
              </span>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 4, 8].map((mult) => (
                  <button
                    key={mult}
                    type="button"
                    onClick={() => setScaleMultiplier(mult)}
                    className={`px-3.5 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-colors cursor-pointer ${
                      scaleMultiplier === mult
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-blue-500'
                    }`}
                  >
                    {mult}x Scale
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs sm:text-sm font-medium text-slate-700 mb-2">
                Background Fill
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={transparentBg}
                    onChange={(e) => setTransparentBg(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                  />
                  <span>Transparent PNG</span>
                </label>

                {!transparentBg && (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      aria-label="Background fill color"
                      className="h-8 w-10 rounded border border-slate-300 bg-white p-0.5 cursor-pointer"
                    />
                    <span className="text-xs font-mono text-slate-600">{bgColor}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button variant="primary" size="lg" isLoading={isProcessing} onClick={handleConvert}>
              Render PNG ({scaleMultiplier}x)
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
                  PNG Rasterized: {result.filename}
                </h3>
                <p className="text-xs sm:text-sm font-mono tabular-nums text-slate-600 mt-0.5">
                  Resolution: {result.width} × {result.height} px · Size: {formatFileSize(result.size)}
                </p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => triggerDownload(result.blob, result.filename)}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download PNG
            </Button>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-center max-h-96 overflow-hidden">
            <img
              src={result.url}
              alt={`Rasterized PNG ${result.filename}`}
              referrerPolicy="no-referrer"
              className="max-h-80 w-auto object-contain rounded-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};
