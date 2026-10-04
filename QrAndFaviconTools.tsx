import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import JSZip from 'jszip';
import { Download, RefreshCw, Copy, Check, Sparkles } from 'lucide-react';
import { FileUploader } from '../components/FileUploader';
import { Button } from '../components/Button';
import { triggerDownload } from '../utils/fileHelpers';

// ==================== 16. QR CODE GENERATOR ====================
export const QrCodeGeneratorTool: React.FC = () => {
  const [contentType, setContentType] = useState<'url' | 'text' | 'wifi'>('url');
  const [textInput, setTextInput] = useState<string>('https://toolnova.app');
  const [wifiSsid, setWifiSsid] = useState<string>('OfficeGuestWiFi');
  const [wifiPassword, setWifiPassword] = useState<string>('Welcome2026!');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');

  const [size, setSize] = useState<number>(320);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fgColor, setFgColor] = useState<string>('#0f172a');
  const [bgColor, setBgColor] = useState<string>('#ffffff');
  const [pngDataUrl, setPngDataUrl] = useState<string>('');
  const [svgMarkup, setSvgMarkup] = useState<string>('');

  const payload =
    contentType === 'wifi'
      ? `WIFI:T:${wifiEncryption};S:${wifiSsid};P:${wifiPassword};;`
      : textInput.trim() || 'https://toolnova.app';

  useEffect(() => {
    let active = true;
    const generate = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(payload, {
          width: size,
          margin: 2,
          errorCorrectionLevel: errorLevel,
          color: { dark: fgColor, light: bgColor },
        });
        const svgStr = await QRCode.toString(payload, {
          type: 'svg',
          width: size,
          margin: 2,
          errorCorrectionLevel: errorLevel,
          color: { dark: fgColor, light: bgColor },
        });
        if (active) {
          setPngDataUrl(dataUrl);
          setSvgMarkup(svgStr);
        }
      } catch {
        // Ignore typing hex errors
      }
    };
    generate();
    return () => {
      active = false;
    };
  }, [payload, size, errorLevel, fgColor, bgColor]);

  const handleDownloadPng = async () => {
    if (!pngDataUrl) return;
    const res = await fetch(pngDataUrl);
    const blob = await res.blob();
    triggerDownload(blob, `toolnova-qrcode-${size}px.png`);
  };

  const handleDownloadSvg = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
    triggerDownload(blob, 'toolnova-qrcode-vector.svg');
  };

  const handleReset = () => {
    setContentType('url');
    setTextInput('https://toolnova.app');
    setSize(320);
    setErrorLevel('M');
    setFgColor('#0f172a');
    setBgColor('#ffffff');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-5">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          {[
            { id: 'url', label: 'Website URL' },
            { id: 'text', label: 'Plain Text' },
            { id: 'wifi', label: 'Wi-Fi Network' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setContentType(tab.id as 'url' | 'text' | 'wifi')}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
                contentType === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {contentType === 'wifi' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="wifi-ssid" className="block text-xs font-medium text-slate-700 mb-1">
                Network Name (SSID)
              </label>
              <input
                id="wifi-ssid"
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="wifi-pass" className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                id="wifi-pass"
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
              />
            </div>
            <div>
              <label htmlFor="wifi-sec" className="block text-xs font-medium text-slate-700 mb-1">
                Security
              </label>
              <select
                id="wifi-sec"
                value={wifiEncryption}
                onChange={(e) => setWifiEncryption(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
              >
                <option value="WPA">WPA / WPA2 / WPA3</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Open (No Password)</option>
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label htmlFor="qr-text-input" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5">
              {contentType === 'url' ? 'Destination Website URL' : 'Text Content'}
            </label>
            <textarea
              id="qr-text-input"
              rows={3}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={contentType === 'url' ? 'https://example.com' : 'Enter text to encode...'}
              className="w-full p-3 text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        )}

        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="qr-size" className="block text-xs font-medium text-slate-700 mb-1">
              Output Size (Pixels)
            </label>
            <select
              id="qr-size"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 bg-white text-slate-900"
            >
              <option value={200}>200 × 200 px (Small Web)</option>
              <option value={320}>320 × 320 px (Standard)</option>
              <option value={512}>512 × 512 px (High-Res)</option>
              <option value={1024}>1024 × 1024 px (Print Quality)</option>
            </select>
          </div>

          <div>
            <label htmlFor="qr-ecc" className="block text-xs font-medium text-slate-700 mb-1">
              Error Correction Level
            </label>
            <select
              id="qr-ecc"
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
            >
              <option value="L">Low (7% recovery)</option>
              <option value="M">Medium (15% — Recommended)</option>
              <option value="Q">Quartile (25% recovery)</option>
              <option value="H">High (30% — Best for Print)</option>
            </select>
          </div>

          <div>
            <label htmlFor="qr-fg-color" className="block text-xs font-medium text-slate-700 mb-1">
              Foreground Color
            </label>
            <div className="flex items-center gap-2">
              <input
                id="qr-fg-color"
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-9 w-12 rounded border border-slate-300 bg-white p-0.5 cursor-pointer"
              />
              <input
                type="text"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                aria-label="Foreground hex color"
                className="w-28 px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="qr-bg-color" className="block text-xs font-medium text-slate-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                id="qr-bg-color"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-9 w-12 rounded border border-slate-300 bg-white p-0.5 cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                aria-label="Background hex color"
                className="w-28 px-2.5 py-1.5 text-xs font-mono border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={handleReset}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Reset to Defaults
        </Button>
      </div>

      <div className="lg:col-span-2 bg-slate-50 rounded-xl border border-slate-200 p-5 flex flex-col items-center justify-between gap-5">
        <div className="text-center">
          <span className="text-xs font-semibold text-slate-700">Live Static QR Preview</span>
          <p className="text-[11px] text-slate-500 font-mono tabular-nums mt-0.5">
            {size} × {size} px · ECC Level {errorLevel}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center">
          {pngDataUrl && (
            <img
              src={pngDataUrl}
              alt="Generated QR code"
              referrerPolicy="no-referrer"
              className="w-52 h-52 object-contain"
            />
          )}
        </div>

        <div className="w-full space-y-2.5">
          <Button
            variant="primary"
            size="md"
            className="w-full"
            onClick={handleDownloadPng}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download PNG ({size}×{size})
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={handleDownloadSvg}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Download Vector SVG
          </Button>
        </div>
      </div>
    </div>
  );
};

// ==================== 17. FAVICON GENERATOR ====================
const FAVICON_SIZES = [
  { size: 16, name: 'favicon-16x16.png', label: '16×16 Browser Tab' },
  { size: 32, name: 'favicon-32x32.png', label: '32×32 Retina Tab' },
  { size: 48, name: 'favicon-48x48.png', label: '48×48 Desktop Shortcut' },
  { size: 180, name: 'apple-touch-icon.png', label: '180×180 Apple Touch' },
  { size: 192, name: 'android-chrome-192x192.png', label: '192×192 Android Icon' },
  { size: 512, name: 'android-chrome-512x512.png', label: '512×512 PWA Splash' },
];

function createIcoFromPngBytes(pngBytes: Uint8Array, width = 32, height = 32): Blob {
  const headerSize = 6;
  const directorySize = 16;
  const totalSize = headerSize + directorySize + pngBytes.length;
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);

  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, 1, true);

  view.setUint8(6, width);
  view.setUint8(7, height);
  view.setUint8(8, 0);
  view.setUint8(9, 0);
  view.setUint16(10, 1, true);
  view.setUint16(12, 32, true);
  view.setUint32(14, pngBytes.length, true);
  view.setUint32(18, headerSize + directorySize, true);

  const outBytes = new Uint8Array(buffer);
  outBytes.set(pngBytes, headerSize + directorySize);
  return new Blob([outBytes], { type: 'image/x-icon' });
}

export const FaviconGeneratorTool: React.FC = () => {
  const [sourceMode, setSourceMode] = useState<'text' | 'upload'>('text');
  const [files, setFiles] = useState<File[]>([]);
  const [badgeText, setBadgeText] = useState<string>('TN');
  const [badgeBg, setBadgeBg] = useState<string>('#2563eb');
  const [badgeFg, setBadgeFg] = useState<string>('#ffffff');
  const [borderRadiusPct, setBorderRadiusPct] = useState<number>(22);
  const [generatedPreviews, setGeneratedPreviews] = useState<Record<number, string>>({});
  const [isGeneratingZip, setIsGeneratingZip] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const renderIcons = async () => {
      const master = document.createElement('canvas');
      master.width = 512;
      master.height = 512;
      const ctx = master.getContext('2d');
      if (!ctx) return;

      if (sourceMode === 'upload' && files[0]) {
        try {
          const bitmap = await createImageBitmap(files[0]);
          ctx.drawImage(bitmap, 0, 0, 512, 512);
        } catch {
          return;
        }
      } else {
        const r = (borderRadiusPct / 100) * 512;
        ctx.fillStyle = badgeBg;
        ctx.beginPath();
        ctx.roundRect(0, 0, 512, 512, r);
        ctx.fill();

        ctx.fillStyle = badgeFg;
        const cleanText = (badgeText || 'A').slice(0, 3);
        const fontSize = cleanText.length === 1 ? 300 : cleanText.length === 2 ? 235 : 180;
        ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(cleanText, 256, 272);
      }

      const previews: Record<number, string> = {};
      for (const item of FAVICON_SIZES) {
        const c = document.createElement('canvas');
        c.width = item.size;
        c.height = item.size;
        const cCtx = c.getContext('2d');
        if (cCtx) {
          cCtx.imageSmoothingEnabled = true;
          cCtx.imageSmoothingQuality = 'high';
          cCtx.drawImage(master, 0, 0, item.size, item.size);
          previews[item.size] = c.toDataURL('image/png');
        }
      }

      if (active) setGeneratedPreviews(previews);
    };

    renderIcons();
    return () => {
      active = false;
    };
  }, [sourceMode, files, badgeText, badgeBg, badgeFg, borderRadiusPct]);

  const handleDownloadBundle = async () => {
    setIsGeneratingZip(true);
    try {
      const zip = new JSZip();

      for (const item of FAVICON_SIZES) {
        const dataUrl = generatedPreviews[item.size];
        if (!dataUrl) continue;
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        zip.file(item.name, blob);

        if (item.size === 32) {
          const buf = await blob.arrayBuffer();
          const icoBlob = createIcoFromPngBytes(new Uint8Array(buf), 32, 32);
          zip.file('favicon.ico', icoBlob);
        }
      }

      const manifest = {
        name: 'My Web Application',
        short_name: 'App',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        theme_color: badgeBg,
        background_color: '#ffffff',
        display: 'standalone',
      };

      zip.file('site.webmanifest', JSON.stringify(manifest, null, 2));
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(zipBlob, 'toolnova-favicon-package.zip');
    } finally {
      setIsGeneratingZip(false);
    }
  };

  const htmlSnippet = `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setSourceMode('text')}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
            sourceMode === 'text'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Design Monogram Favicon</span>
        </button>
        <button
          type="button"
          onClick={() => setSourceMode('upload')}
          className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
            sourceMode === 'upload'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Upload Logo Image
        </button>
      </div>

      {sourceMode === 'upload' ? (
        <FileUploader
          accept="image/png,image/jpeg,image/svg+xml,image/webp,.png,.jpg,.svg,.webp"
          acceptLabel="Square PNG, SVG, JPG, WebP"
          files={files}
          onFilesSelected={setFiles}
          onRemoveFile={() => setFiles([])}
        />
      ) : (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label htmlFor="fav-text" className="block text-xs font-medium text-slate-700 mb-1">
              Initials (1–3 chars)
            </label>
            <input
              id="fav-text"
              type="text"
              maxLength={3}
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              className="w-full px-3 py-2 text-sm font-bold rounded-lg border border-slate-300 bg-white text-slate-900"
            />
          </div>

          <div>
            <label htmlFor="fav-bg" className="block text-xs font-medium text-slate-700 mb-1">
              Background Color
            </label>
            <div className="flex items-center gap-2">
              <input
                id="fav-bg"
                type="color"
                value={badgeBg}
                onChange={(e) => setBadgeBg(e.target.value)}
                className="h-9 w-12 rounded border border-slate-300 bg-white p-0.5 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-600">{badgeBg}</span>
            </div>
          </div>

          <div>
            <label htmlFor="fav-fg" className="block text-xs font-medium text-slate-700 mb-1">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              <input
                id="fav-fg"
                type="color"
                value={badgeFg}
                onChange={(e) => setBadgeFg(e.target.value)}
                className="h-9 w-12 rounded border border-slate-300 bg-white p-0.5 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-600">{badgeFg}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
              <label htmlFor="fav-radius">Corner Rounding</label>
              <span className="font-mono tabular-nums">{borderRadiusPct}%</span>
            </div>
            <input
              id="fav-radius"
              type="range"
              min={0}
              max={50}
              value={borderRadiusPct}
              onChange={(e) => setBorderRadiusPct(Number(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer mt-2"
            />
          </div>
        </div>
      )}

      {Object.keys(generatedPreviews).length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FAVICON_SIZES.map((item) => (
              <div
                key={item.size}
                className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 flex flex-col items-center justify-between text-center gap-3"
              >
                <div className="h-16 flex items-center justify-center">
                  <img
                    src={generatedPreviews[item.size]}
                    alt={item.label}
                    referrerPolicy="no-referrer"
                    style={{
                      width: Math.min(64, Math.max(16, item.size)),
                      height: Math.min(64, Math.max(16, item.size)),
                    }}
                    className="object-contain"
                  />
                </div>
                <div>
                  <div className="text-xs font-mono font-semibold text-slate-900 tabular-nums">
                    {item.size}×{item.size}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[120px]">
                    {item.name}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 sm:p-5">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Complete Favicon & PWA Package Ready
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                Includes <code className="font-mono">favicon.ico</code>, 6 PNG sizes, and{' '}
                <code className="font-mono">site.webmanifest</code>.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              isLoading={isGeneratingZip}
              onClick={handleDownloadBundle}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download All Favicons (.ZIP)
            </Button>
          </div>

          <div className="bg-slate-900 rounded-xl p-4 text-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400">
                HTML &lt;head&gt; Integration Snippet
              </span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(htmlSnippet);
                  setCopiedHtml(true);
                  setTimeout(() => setCopiedHtml(false), 1500);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                {copiedHtml ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedHtml ? 'Copied HTML' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono overflow-x-auto text-slate-200 leading-relaxed">
              {htmlSnippet}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
