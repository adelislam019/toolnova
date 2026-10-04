import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const value = bytes / Math.pow(k, i);
  return `${value.toFixed(i === 0 ? 0 : 2)} ${sizes[i]}`;
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function replaceFileExtension(filename: string, newExt: string): string {
  const cleanExt = newExt.startsWith('.') ? newExt : `.${newExt}`;
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return `${filename}${cleanExt}`;
  return `${filename.substring(0, lastDot)}${cleanExt}`;
}

/**
 * Generates a real raster image File in memory using HTML5 Canvas.
 */
export async function createSampleImageFile(
  filename = 'sample-photo.png',
  mimeType = 'image/png',
  width = 1200,
  height = 800
): Promise<File> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#1e3a8a');
    grad.addColorStop(0.45, '#2563eb');
    grad.addColorStop(1, '#0f172a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(width * 0.75, height * 0.28, Math.min(width, height) * 0.16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.fillRect(width * 0.08, height * 0.52, width * 0.26, height * 0.36);

    ctx.fillStyle = '#ec4899';
    ctx.fillRect(width * 0.38, height * 0.6, width * 0.24, height * 0.28);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(width * 0.08, height * 0.1, width * 0.48, height * 0.32);

    ctx.fillStyle = '#0f172a';
    ctx.font = `bold ${Math.round(width * 0.032)}px sans-serif`;
    ctx.fillText('ToolNova Sample Image', width * 0.11, height * 0.21);

    ctx.fillStyle = '#475569';
    ctx.font = `${Math.round(width * 0.02)}px monospace`;
    ctx.fillText(`Resolution: ${width} x ${height} px`, width * 0.11, height * 0.29);
    ctx.fillText('100% Local Browser Processing', width * 0.11, height * 0.35);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to generate sample image blob.'));
          return;
        }
        resolve(new File([blob], filename, { type: mimeType }));
      },
      mimeType === 'image/heic' || mimeType === 'image/avif' ? 'image/png' : mimeType,
      0.92
    );
  });
}

/**
 * Generates a real JPEG file containing a genuine binary APP1 EXIF segment.
 */
export async function createSampleJpegWithExif(): Promise<File> {
  const baseFile = await createSampleImageFile('vacation-photo-gps.jpg', 'image/jpeg', 1000, 750);
  const arrayBuffer = await baseFile.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return baseFile;
  }

  const exifPayloadText =
    'Exif\0\0II*\0Apple iPhone 15 Pro\0GPS Latitude: 37.7749 N, Longitude: 122.4194 W\0Software: iOS 18.1';
  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(exifPayloadText);
  const segLength = payloadBytes.length + 2;

  const app1Segment = new Uint8Array(4 + payloadBytes.length);
  app1Segment[0] = 0xff;
  app1Segment[1] = 0xe1; // APP1 EXIF marker
  app1Segment[2] = (segLength >> 8) & 0xff;
  app1Segment[3] = segLength & 0xff;
  app1Segment.set(payloadBytes, 4);

  const combined = new Uint8Array(bytes.length + app1Segment.length);
  combined[0] = 0xff;
  combined[1] = 0xd8;
  combined.set(app1Segment, 2);
  combined.set(bytes.subarray(2), 2 + app1Segment.length);

  return new File([combined], 'iphone-photo-with-exif-gps.jpg', { type: 'image/jpeg' });
}

/**
 * Generates a real multi-page PDF File using pdf-lib.
 */
export async function createSamplePdfFile(
  filename = 'sample-document.pdf',
  pageCount = 4,
  docLabel = 'ToolNova Sample Document'
): Promise<File> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= pageCount; i++) {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();

    page.drawRectangle({
      x: 45,
      y: height - 130,
      width: width - 90,
      height: 75,
      color: rgb(0.95, 0.97, 1),
    });

    page.drawText(`${docLabel} — Page ${i} of ${pageCount}`, {
      x: 65,
      y: height - 88,
      size: 18,
      font: fontBold,
      color: rgb(0.1, 0.22, 0.55),
    });

    page.drawText(
      `Generated locally in your browser using pdf-lib. File: ${filename}`,
      {
        x: 65,
        y: height - 112,
        size: 10,
        font: fontRegular,
        color: rgb(0.35, 0.4, 0.5),
      }
    );

    page.drawText(
      `This is page ${i}. You can merge this PDF with other documents or split specific page ranges.`,
      {
        x: 50,
        y: height - 180,
        size: 12,
        font: fontRegular,
        color: rgb(0.15, 0.2, 0.25),
      }
    );
  }

  const pdfBytes = await pdfDoc.save();
  return new File([new Uint8Array(pdfBytes)], filename, { type: 'application/pdf' });
}
