export interface OcrImageDiagnostics {
  width: number;
  height: number;
  megapixels: string;
  averageLuminance: number;
  contrastScore: number;
  polarity: 'light-background' | 'dark-background';
  resolutionStatus: 'optimal' | 'acceptable' | 'low';
  recommendations: string[];
}

export interface OcrExtractionOptions {
  normalizeContrast: boolean;
  invertDarkBackground: boolean;
  languageHint: string;
}

export interface OcrExtractionResult {
  status: 'success' | 'provider_not_connected' | 'error';
  providerUsed: 'browser-text-detector' | 'external-api' | 'none';
  extractedText?: string;
  detectedBlocksCount?: number;
  diagnostics: OcrImageDiagnostics;
  preprocessedDataUrl: string;
  message: string;
}

export async function analyzeAndPreprocessImage(
  file: File,
  options: OcrExtractionOptions
): Promise<{ diagnostics: OcrImageDiagnostics; preprocessedDataUrl: string; bitmap: ImageBitmap }> {
  const bitmap = await createImageBitmap(file);
  const { width, height } = bitmap;

  const scale = Math.min(1, 800 / Math.max(width, height));
  const sampleW = Math.max(1, Math.round(width * scale));
  const sampleH = Math.max(1, Math.round(height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = sampleW;
  canvas.height = sampleH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not initialize 2D canvas context for OCR analysis.');
  }

  ctx.drawImage(bitmap, 0, 0, sampleW, sampleH);
  const imageData = ctx.getImageData(0, 0, sampleW, sampleH);
  const data = imageData.data;

  let sumLum = 0;
  const pixelCount = sampleW * sampleH;
  const luminances = new Float32Array(pixelCount);

  for (let i = 0; i < pixelCount; i++) {
    const idx = i * 4;
    const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
    luminances[i] = lum;
    sumLum += lum;
  }

  const avgLum = sumLum / pixelCount;
  let varianceSum = 0;
  for (let i = 0; i < pixelCount; i++) {
    const diff = luminances[i] - avgLum;
    varianceSum += diff * diff;
  }
  const stdDev = Math.sqrt(varianceSum / pixelCount);
  const contrastScore = Math.min(100, Math.round((stdDev / 85) * 100));
  const polarity: OcrImageDiagnostics['polarity'] =
    avgLum < 118 ? 'dark-background' : 'light-background';

  const minDim = Math.min(width, height);
  const resolutionStatus: OcrImageDiagnostics['resolutionStatus'] =
    minDim >= 900 ? 'optimal' : minDim >= 450 ? 'acceptable' : 'low';

  const recommendations: string[] = [];
  if (resolutionStatus === 'low') {
    recommendations.push(
      `Image dimensions (${width}×${height}px) are relatively small; higher resolution images (≥1000px) improve character accuracy.`
    );
  }
  if (contrastScore < 35) {
    recommendations.push(
      'Low luminance contrast detected between foreground text and background. Enable "Normalize Contrast" for cleaner thresholding.'
    );
  }
  if (polarity === 'dark-background' && !options.invertDarkBackground) {
    recommendations.push(
      'Dark background detected (common in dark-mode screenshots). Enabling "Invert Dark Background" converts light text to standard dark-on-light polarity.'
    );
  }
  if (recommendations.length === 0) {
    recommendations.push('Image resolution, polarity, and contrast are well-suited for optical character recognition.');
  }

  const outCanvas = document.createElement('canvas');
  outCanvas.width = width;
  outCanvas.height = height;
  const outCtx = outCanvas.getContext('2d');
  if (outCtx) {
    outCtx.drawImage(bitmap, 0, 0);
    if (options.normalizeContrast || options.invertDarkBackground) {
      const fullData = outCtx.getImageData(0, 0, width, height);
      const px = fullData.data;
      for (let i = 0; i < px.length; i += 4) {
        let gray = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
        if (options.invertDarkBackground) {
          gray = 255 - gray;
        }
        if (options.normalizeContrast) {
          gray = Math.max(0, Math.min(255, (gray - 128) * 1.45 + 128));
        }
        px[i] = gray;
        px[i + 1] = gray;
        px[i + 2] = gray;
      }
      outCtx.putImageData(fullData, 0, 0);
    }
  }

  return {
    diagnostics: {
      width,
      height,
      megapixels: ((width * height) / 1_000_000).toFixed(2),
      averageLuminance: Math.round(avgLum),
      contrastScore,
      polarity,
      resolutionStatus,
      recommendations,
    },
    preprocessedDataUrl: outCanvas.toDataURL('image/png'),
    bitmap,
  };
}

export async function runOcrService(
  file: File,
  options: OcrExtractionOptions
): Promise<OcrExtractionResult> {
  const { diagnostics, preprocessedDataUrl, bitmap } = await analyzeAndPreprocessImage(file, options);

  const configuredEndpoint = import.meta.env.VITE_OCR_API_ENDPOINT;
  if (configuredEndpoint && typeof configuredEndpoint === 'string' && configuredEndpoint.trim() !== '') {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('language', options.languageHint);

      const response = await fetch(configuredEndpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`OCR service responded with HTTP ${response.status}`);
      }

      const payload = (await response.json()) as { text?: string; blocks?: number };
      return {
        status: 'success',
        providerUsed: 'external-api',
        extractedText: payload.text || '',
        detectedBlocksCount: payload.blocks ?? 1,
        diagnostics,
        preprocessedDataUrl,
        message: 'Text extracted via configured external OCR endpoint.',
      };
    } catch (err) {
      return {
        status: 'error',
        providerUsed: 'external-api',
        diagnostics,
        preprocessedDataUrl,
        message:
          err instanceof Error
            ? `External OCR service request failed: ${err.message}`
            : 'External OCR service request failed.',
      };
    }
  }

  const win = window as unknown as {
    TextDetector?: new () => {
      detect: (source: ImageBitmap) => Promise<Array<{ rawValue: string }>>;
    };
  };

  if (typeof win.TextDetector === 'function') {
    try {
      const detector = new win.TextDetector();
      const blocks = await detector.detect(bitmap);
      const joined = blocks
        .map((b) => b.rawValue)
        .filter(Boolean)
        .join('\n');

      return {
        status: 'success',
        providerUsed: 'browser-text-detector',
        extractedText: joined,
        detectedBlocksCount: blocks.length,
        diagnostics,
        preprocessedDataUrl,
        message:
          blocks.length > 0
            ? `Detected ${blocks.length} text region(s) using your browser's built-in TextDetector engine.`
            : 'Browser TextDetector completed scan but found no recognizable text regions in this image.',
      };
    } catch {
      // Experimental fallback
    }
  }

  return {
    status: 'provider_not_connected',
    providerUsed: 'none',
    diagnostics,
    preprocessedDataUrl,
    message:
      'Client-side image pre-flight analysis and contrast normalization succeeded. Native browser TextDetector is not enabled in this browser environment, and no external OCR engine endpoint (VITE_OCR_API_ENDPOINT) is currently connected in src/services/ocrService.ts.',
  };
}
