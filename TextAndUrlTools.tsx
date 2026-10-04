import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  Copy,
  Check,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ArrowLeftRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/Button';
import { triggerDownload, formatFileSize } from '../utils/fileHelpers';

// ==================== 18. JSON FORMATTER ====================
const SAMPLE_JSON = `{"service":"ToolNova Platform","version":1,"privacy":{"clientSideProcessing":true,"watermarks":false,"regions":["USA","UK","Canada","Australia","Europe"]},"activeTools":["heic-to-jpg","merge-pdf","json-formatter","utm-builder"]}`;

function sortObjectKeysRecursively(val: unknown): unknown {
  if (Array.isArray(val)) {
    return val.map(sortObjectKeysRecursively);
  }
  if (val !== null && typeof val === 'object') {
    const sorted: Record<string, unknown> = {};
    Object.keys(val as Record<string, unknown>)
      .sort((a, b) => a.localeCompare(b))
      .forEach((k) => {
        sorted[k] = sortObjectKeysRecursively((val as Record<string, unknown>)[k]);
      });
    return sorted;
  }
  return val;
}

function inspectJsonStats(val: unknown): { keys: number; arrays: number; maxDepth: number } {
  let keys = 0;
  let arrays = 0;
  let maxDepth = 0;

  function traverse(node: unknown, depth: number) {
    if (depth > maxDepth) maxDepth = depth;
    if (Array.isArray(node)) {
      arrays++;
      node.forEach((child) => traverse(child, depth + 1));
    } else if (node !== null && typeof node === 'object') {
      const objKeys = Object.keys(node as Record<string, unknown>);
      keys += objKeys.length;
      objKeys.forEach((k) => traverse((node as Record<string, unknown>)[k], depth + 1));
    }
  }

  traverse(val, 1);
  return { keys, arrays, maxDepth };
}

export const JsonFormatterTool: React.FC = () => {
  const [input, setInput] = useState<string>(SAMPLE_JSON);
  const [indent, setIndent] = useState<'2' | '4' | 'tab' | 'minify'>('2');
  const [sortKeys, setSortKeys] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const parsedAnalysis = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { valid: false, empty: true, output: '', error: null, stats: null };
    }
    try {
      let parsed = JSON.parse(trimmed);
      if (sortKeys) {
        parsed = sortObjectKeysRecursively(parsed);
      }
      const stats = inspectJsonStats(parsed);
      const spaceArg =
        indent === 'minify' ? undefined : indent === 'tab' ? '\t' : Number(indent);
      const formatted = JSON.stringify(parsed, null, spaceArg);

      return {
        valid: true,
        empty: false,
        output: formatted,
        error: null,
        stats: {
          ...stats,
          byteSize: new Blob([formatted]).size,
        },
      };
    } catch (err) {
      return {
        valid: false,
        empty: false,
        output: '',
        error: err instanceof Error ? err.message : 'Invalid JSON syntax.',
        stats: null,
      };
    }
  }, [input, indent, sortKeys]);

  const handleDownloadJson = () => {
    if (!parsedAnalysis.valid) return;
    const blob = new Blob([parsedAnalysis.output], { type: 'application/json;charset=utf-8' });
    triggerDownload(blob, 'toolnova-formatted.json');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
            {[
              { id: '2', label: '2 Spaces' },
              { id: '4', label: '4 Spaces' },
              { id: 'tab', label: 'Tabs' },
              { id: 'minify', label: 'Minify' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setIndent(opt.id as '2' | '4' | 'tab' | 'minify')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  indent === opt.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={sortKeys}
              onChange={(e) => setSortKeys(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
            />
            <span>Sort Keys (A–Z)</span>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInput(SAMPLE_JSON)}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-blue-600" />}
          >
            Sample JSON
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInput('')}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="json-raw-input" className="text-xs sm:text-sm font-semibold text-slate-800">
              Input JSON
            </label>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              {formatFileSize(new Blob([input]).size)}
            </span>
          </div>
          <textarea
            id="json-raw-input"
            rows={14}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste raw or minified JSON here..."
            className="w-full p-3.5 font-mono text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-800">
              Validated Output
            </span>
            {parsedAnalysis.valid && parsedAnalysis.stats && (
              <span className="text-xs font-mono text-emerald-700 tabular-nums">
                {parsedAnalysis.stats.keys} keys · Depth {parsedAnalysis.stats.maxDepth} ·{' '}
                {formatFileSize(parsedAnalysis.stats.byteSize)}
              </span>
            )}
          </div>

          {parsedAnalysis.error ? (
            <div
              role="alert"
              className="h-[318px] p-5 rounded-xl bg-red-50 border border-red-200 text-red-900 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Invalid JSON Syntax Detected</h3>
                  <p className="text-xs sm:text-sm font-mono bg-white/80 p-3 rounded-lg border border-red-200">
                    {parsedAnalysis.error}
                  </p>
                </div>
              </div>
              <p className="text-xs text-red-700">
                Tip: Check for trailing commas, unquoted property names, or single quotes instead of double quotes.
              </p>
            </div>
          ) : (
            <textarea
              readOnly
              rows={14}
              value={parsedAnalysis.output}
              aria-label="Formatted JSON output"
              placeholder="Formatted JSON will appear here..."
              className="w-full p-3.5 font-mono text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none"
            />
          )}
        </div>
      </div>

      {parsedAnalysis.valid && (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Valid RFC 8259 JSON</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                navigator.clipboard.writeText(parsedAnalysis.output);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              leftIcon={copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied to Clipboard' : 'Copy Formatted JSON'}
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleDownloadJson}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Download .JSON
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== 19. URL ENCODER / DECODER ====================
export const UrlEncoderDecoderTool: React.FC = () => {
  const [input, setInput] = useState<string>(
    'https://toolnova.app/search?q=image compressor & format=webp&region=US & UK'
  );
  const [operation, setOperation] = useState<'encode' | 'decode'>('encode');
  const [scopeMode, setScopeMode] = useState<'component' | 'uri'>('component');
  const [copied, setCopied] = useState<boolean>(false);

  const { output, error, parsedUrl } = useMemo(() => {
    let resultText = '';
    let err: string | null = null;

    try {
      if (operation === 'encode') {
        if (scopeMode === 'component') {
          resultText = encodeURIComponent(input).replace(
            /[!'()*]/g,
            (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
          );
        } else {
          resultText = encodeURI(input);
        }
      } else {
        const normalized = input.replace(/\+/g, '%20');
        resultText =
          scopeMode === 'component'
            ? decodeURIComponent(normalized)
            : decodeURI(normalized);
      }
    } catch (e) {
      err = e instanceof Error ? e.message : 'Malformed percent-encoded URI sequence.';
    }

    let urlBreakdown: {
      protocol: string;
      host: string;
      pathname: string;
      params: Array<[string, string]>;
    } | null = null;

    try {
      const candidate = input.trim();
      if (candidate.startsWith('http://') || candidate.startsWith('https://')) {
        const u = new URL(candidate);
        urlBreakdown = {
          protocol: u.protocol,
          host: u.host,
          pathname: u.pathname,
          params: Array.from(u.searchParams.entries()),
        };
      }
    } catch {
      // Ignore non-URL
    }

    return { output: resultText, error: err, parsedUrl: urlBreakdown };
  }, [input, operation, scopeMode]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setOperation('encode')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
                operation === 'encode'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Encode
            </button>
            <button
              type="button"
              onClick={() => setOperation('decode')}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
                operation === 'decode'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Decode
            </button>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setScopeMode('component')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                scopeMode === 'component'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Component (encodeURIComponent)
            </button>
            <button
              type="button"
              onClick={() => setScopeMode('uri')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                scopeMode === 'uri'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Full URL (encodeURI)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!error && output) {
                setInput(output);
                setOperation((prev) => (prev === 'encode' ? 'decode' : 'encode'));
              }
            }}
            leftIcon={<ArrowLeftRight className="w-3.5 h-3.5" />}
          >
            Swap Input / Output
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInput('')}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div>
          <label htmlFor="url-input" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-2">
            Input String or URL
          </label>
          <textarea
            id="url-input"
            rows={6}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste URL or query parameter value here..."
            className="w-full p-3.5 font-mono text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-semibold text-slate-800">
              {operation === 'encode' ? 'Percent-Encoded Output' : 'Decoded Output'}
            </span>
            <button
              type="button"
              disabled={Boolean(error) || !output}
              onClick={() => {
                navigator.clipboard.writeText(output);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-40 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Output'}</span>
            </button>
          </div>

          {error ? (
            <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm">
              {error}
            </div>
          ) : (
            <textarea
              readOnly
              rows={6}
              value={output}
              aria-label="Encoded or decoded URL output"
              className="w-full p-3.5 font-mono text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none"
            />
          )}
        </div>
      </div>

      {parsedUrl && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-slate-900">
              Parsed URL & Query Parameter Breakdown
            </h3>
            <span className="text-xs font-mono text-slate-600">
              Host: {parsedUrl.host} · Path: {parsedUrl.pathname}
            </span>
          </div>

          {parsedUrl.params.length > 0 ? (
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse text-xs sm:text-sm font-mono">
                <thead>
                  <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700">
                    <th className="py-2 px-3.5 font-semibold">Parameter Key</th>
                    <th className="py-2 px-3.5 font-semibold">Decoded Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedUrl.params.map(([k, v], i) => (
                    <tr key={`${k}-${i}`}>
                      <td className="py-2 px-3.5 font-semibold text-blue-700">{k}</td>
                      <td className="py-2 px-3.5 text-slate-800 break-all">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500">No query parameters (?key=value) found in this URL.</p>
          )}
        </div>
      )}
    </div>
  );
};

// ==================== 20. UTM BUILDER ====================
export const UtmBuilderTool: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState<string>('https://toolnova.app/tools/image-compressor');
  const [utmSource, setUtmSource] = useState<string>('newsletter');
  const [utmMedium, setUtmMedium] = useState<string>('email');
  const [utmCampaign, setUtmCampaign] = useState<string>('october_product_launch');
  const [utmTerm, setUtmTerm] = useState<string>('');
  const [utmContent, setUtmContent] = useState<string>('hero_cta_button');
  const [utmId, setUtmId] = useState<string>('');
  const [forceLowercase, setForceLowercase] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const applyPreset = (source: string, medium: string, campaign: string, content: string) => {
    setUtmSource(source);
    setUtmMedium(medium);
    setUtmCampaign(campaign);
    setUtmContent(content);
  };

  const { finalUrl, urlError } = useMemo(() => {
    const raw = baseUrl.trim();
    if (!raw) return { finalUrl: '', urlError: null };

    const withProtocol =
      raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;

    try {
      const parsed = new URL(withProtocol);
      const normalize = (val: string) => {
        const cleaned = val.trim().replace(/\s+/g, '_');
        return forceLowercase ? cleaned.toLowerCase() : cleaned;
      };

      if (utmSource.trim()) parsed.searchParams.set('utm_source', normalize(utmSource));
      if (utmMedium.trim()) parsed.searchParams.set('utm_medium', normalize(utmMedium));
      if (utmCampaign.trim()) parsed.searchParams.set('utm_campaign', normalize(utmCampaign));
      if (utmTerm.trim()) parsed.searchParams.set('utm_term', normalize(utmTerm));
      if (utmContent.trim()) parsed.searchParams.set('utm_content', normalize(utmContent));
      if (utmId.trim()) parsed.searchParams.set('utm_id', normalize(utmId));

      return { finalUrl: parsed.toString(), urlError: null };
    } catch {
      return {
        finalUrl: '',
        urlError: 'Please enter a valid destination website URL (e.g., https://example.com).',
      };
    }
  }, [baseUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, utmId, forceLowercase]);

  useEffect(() => {
    if (!finalUrl) {
      setQrDataUrl('');
      return;
    }
    QRCode.toDataURL(finalUrl, { width: 220, margin: 2 }).then(setQrDataUrl).catch(() => {});
  }, [finalUrl]);

  const handleReset = () => {
    setUtmSource('');
    setUtmMedium('');
    setUtmCampaign('');
    setUtmTerm('');
    setUtmContent('');
    setUtmId('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 mr-1">Channel Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('google', 'cpc', 'search_brand_q4', 'responsive_ad_a')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-slate-300 text-slate-700 hover:border-blue-500 cursor-pointer"
          >
            Google Ads (CPC)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('newsletter', 'email', 'weekly_digest', 'header_link')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-slate-300 text-slate-700 hover:border-blue-500 cursor-pointer"
          >
            Email Newsletter
          </button>
          <button
            type="button"
            onClick={() => applyPreset('linkedin', 'paid_social', 'b2b_lead_gen', 'carousel_v1')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-white border border-slate-300 text-slate-700 hover:border-blue-500 cursor-pointer"
          >
            LinkedIn Social
          </button>
        </div>

        <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={forceLowercase}
            onChange={(e) => setForceLowercase(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
          />
          <span>Enforce lowercase & underscores</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="utm-base-url" className="block text-xs sm:text-sm font-semibold text-slate-800 mb-1">
            Destination Website URL *
          </label>
          <input
            id="utm-base-url"
            type="url"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://example.com/landing-page"
            className="w-full px-3.5 py-2.5 text-sm font-mono rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label htmlFor="utm-source" className="block text-xs font-medium text-slate-700 mb-1">
            Campaign Source (<code className="font-mono text-blue-600">utm_source</code>) *
          </label>
          <input
            id="utm-source"
            type="text"
            value={utmSource}
            onChange={(e) => setUtmSource(e.target.value)}
            placeholder="e.g., google, newsletter, linkedin"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
          />
        </div>

        <div>
          <label htmlFor="utm-medium" className="block text-xs font-medium text-slate-700 mb-1">
            Campaign Medium (<code className="font-mono text-blue-600">utm_medium</code>) *
          </label>
          <input
            id="utm-medium"
            type="text"
            value={utmMedium}
            onChange={(e) => setUtmMedium(e.target.value)}
            placeholder="e.g., cpc, email, social, banner"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
          />
        </div>

        <div>
          <label htmlFor="utm-campaign" className="block text-xs font-medium text-slate-700 mb-1">
            Campaign Name (<code className="font-mono text-blue-600">utm_campaign</code>) *
          </label>
          <input
            id="utm-campaign"
            type="text"
            value={utmCampaign}
            onChange={(e) => setUtmCampaign(e.target.value)}
            placeholder="e.g., spring_sale_2026"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
          />
        </div>

        <div>
          <label htmlFor="utm-content" className="block text-xs font-medium text-slate-700 mb-1">
            Campaign Content (<code className="font-mono text-slate-500">utm_content</code>)
          </label>
          <input
            id="utm-content"
            type="text"
            value={utmContent}
            onChange={(e) => setUtmContent(e.target.value)}
            placeholder="e.g., hero_button, sidebar_banner"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
          />
        </div>

        <div>
          <label htmlFor="utm-term" className="block text-xs font-medium text-slate-700 mb-1">
            Campaign Term (<code className="font-mono text-slate-500">utm_term</code>)
          </label>
          <input
            id="utm-term"
            type="text"
            value={utmTerm}
            onChange={(e) => setUtmTerm(e.target.value)}
            placeholder="e.g., pdf+merger+software"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
          />
        </div>

        <div>
          <label htmlFor="utm-id" className="block text-xs font-medium text-slate-700 mb-1">
            Campaign ID (<code className="font-mono text-slate-500">utm_id</code>)
          </label>
          <input
            id="utm-id"
            type="text"
            value={utmId}
            onChange={(e) => setUtmId(e.target.value)}
            placeholder="e.g., cmp_9042"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white text-slate-900"
          />
        </div>
      </div>

      {urlError && (
        <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm">
          {urlError}
        </div>
      )}

      {finalUrl && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-slate-900">
                Generated UTM Tracking URL
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Clear Parameters
              </Button>
            </div>

            <div className="p-3.5 rounded-lg bg-white border border-slate-200 font-mono text-xs sm:text-sm text-slate-900 break-all">
              {finalUrl}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  navigator.clipboard.writeText(finalUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1600);
                }}
                leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {copied ? 'Copied Campaign Link!' : 'Copy Campaign URL'}
              </Button>
            </div>
          </div>

          {qrDataUrl && (
            <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-col items-center text-center gap-2">
              <img
                src={qrDataUrl}
                alt="Campaign QR Code"
                referrerPolicy="no-referrer"
                className="w-28 h-28 object-contain"
              />
              <span className="text-[11px] font-medium text-slate-500">Campaign QR Code</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
