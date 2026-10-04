export type ToolCategory =
  | 'Image Tools'
  | 'PDF Tools'
  | 'OCR & Privacy'
  | 'Developer Tools'
  | 'Marketing Tools';

export type CategorySlug =
  | 'image-tools'
  | 'pdf-tools'
  | 'ocr-privacy'
  | 'developer-tools'
  | 'marketing-tools';

export type ToolIconName =
  | 'FileImage'
  | 'Image'
  | 'Layers'
  | 'Minimize2'
  | 'Maximize2'
  | 'FileCode'
  | 'Camera'
  | 'Palette'
  | 'FileText'
  | 'FilePlus2'
  | 'Scissors'
  | 'Monitor'
  | 'ScanText'
  | 'Crop'
  | 'ShieldCheck'
  | 'QrCode'
  | 'AppWindow'
  | 'Braces'
  | 'Link2'
  | 'Megaphone';

export interface ToolStep {
  title: string;
  description: string;
}

export interface ToolBenefit {
  title: string;
  description: string;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolConfig {
  slug: string;
  name: string;
  h1Title: string;
  category: ToolCategory;
  categorySlug: CategorySlug;
  secondaryCategories?: ToolCategory[];
  description: string;
  metaTitle: string;
  metaDescription: string;
  icon: ToolIconName;
  route: string;
  keywords: string[];
  relatedTools: string[];
  isPopular?: boolean;
  processingType: 'client-side' | 'modular-service';
  howItWorks: ToolStep[];
  benefits: ToolBenefit[];
  seoContent: {
    heading: string;
    paragraphs: string[];
  };
  faqs: ToolFAQ[];
}

export interface CategoryInfo {
  name: ToolCategory;
  slug: CategorySlug;
  route: string;
  shortDescription: string;
  description: string;
}

export const TOOL_CATEGORIES: CategoryInfo[] = [
  {
    name: 'Image Tools',
    slug: 'image-tools',
    route: '/category/image-tools',
    shortDescription: 'Convert, compress, resize, and extract palettes from modern image formats.',
    description:
      'Browser-based image conversion, compression, resizing, and color extraction utilities supporting HEIC, WebP, AVIF, PNG, JPG, and SVG.',
  },
  {
    name: 'PDF Tools',
    slug: 'pdf-tools',
    route: '/category/pdf-tools',
    shortDescription: 'Combine, split, and generate clean PDF documents directly in your browser.',
    description:
      'Fast client-side PDF utilities to merge documents, split pages, or convert images and screenshots into standard PDF files without watermarks.',
  },
  {
    name: 'OCR & Privacy',
    slug: 'ocr-privacy',
    route: '/category/ocr-privacy',
    shortDescription: 'Strip hidden EXIF metadata and prepare images or screenshots for text extraction.',
    description:
      'Protect your privacy by stripping embedded camera and GPS metadata from photos, or inspect and process images for optical character recognition.',
  },
  {
    name: 'Developer Tools',
    slug: 'developer-tools',
    route: '/category/developer-tools',
    shortDescription: 'Format JSON, encode URLs, and generate complete multi-size favicon packages.',
    description:
      'Essential everyday web development tools for validating JSON payloads, inspecting URL parameters, and building production favicon bundles.',
  },
  {
    name: 'Marketing Tools',
    slug: 'marketing-tools',
    route: '/category/marketing-tools',
    shortDescription: 'Build standardized UTM tracking links and customizable SVG/PNG QR codes.',
    description:
      'Streamline campaign attribution and offline-to-online engagement with instant QR code generation and structured UTM parameter builders.',
  },
];

export const TOOLS_CONFIG: ToolConfig[] = [
  // 1. HEIC to JPG
  {
    slug: 'heic-to-jpg',
    name: 'HEIC to JPG',
    h1Title: 'HEIC to JPG Converter',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    description: 'Convert Apple iPhone and iPad HEIC photos to universally compatible JPG images in your browser.',
    metaTitle: 'HEIC to JPG Converter — Free Online Tool | ToolNova',
    metaDescription:
      'Convert iPhone HEIC and HEIF photos to standard JPG format directly in your browser. Adjust image quality with no signup or watermarks.',
    icon: 'FileImage',
    route: '/tools/heic-to-jpg',
    keywords: ['heic to jpg', 'heic to jpeg', 'iphone photo converter', 'apple heic converter', 'heif to jpg'],
    relatedTools: ['webp-to-jpg', 'avif-to-jpg', 'image-compressor', 'exif-remover'],
    isPopular: true,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Select your HEIC file',
        description: 'Drag and drop an Apple .heic or .heif photo, or load our built-in sample image to test.',
      },
      {
        title: 'Set JPEG output quality',
        description: 'Choose your preferred compression quality (default 90% balances visual sharpness and file size).',
      },
      {
        title: 'Download converted JPG',
        description: 'Click Convert to decode the image in your browser and download your standard .jpg file.',
      },
    ],
    benefits: [
      {
        title: 'Universal compatibility',
        description: 'Open iPhone photos on Windows versions, older CMS platforms, and web forms that reject HEIC files.',
      },
      {
        title: 'Browser-based decoding',
        description: 'Your personal photos are decoded locally inside your browser tab without queuing on remote servers.',
      },
      {
        title: 'Adjustable quality control',
        description: 'Fine-tune the JPEG quality slider from 10% to 100% to meet upload size limits on portals.',
      },
      {
        title: 'Automatic metadata clean-up',
        description: 'Canvas re-encoding produces a clean standard JPEG ready for web publishing.',
      },
    ],
    seoContent: {
      heading: 'Why convert HEIC images to standard JPG?',
      paragraphs: [
        'High Efficiency Image Container (HEIC) is the default photo capture format on modern iPhones and iPads running iOS 11 or later. While HEIC uses advanced HEVC compression to store high-resolution photography at roughly half the file size of JPEG, many desktop applications, government portals, and older Windows setups still do not natively support .heic uploads.',
        'ToolNova’s HEIC to JPG converter decodes HEIC containers directly inside your web browser using WebAssembly and HTML5 Canvas APIs. You can adjust the target JPEG quality ratio before exporting, ensuring your converted image meets both compatibility and file-size requirements without installing desktop software.',
      ],
    },
    faqs: [
      {
        question: 'Are my iPhone HEIC photos uploaded to a server?',
        answer: 'No. Decoding and JPEG encoding run locally inside your browser using client-side JavaScript and WebAssembly.',
      },
      {
        question: 'Does converting HEIC to JPG reduce image quality?',
        answer: 'At 90%–95% JPEG quality, there is no perceptible visual difference for everyday viewing and web publishing.',
      },
      {
        question: 'What is the maximum file size supported?',
        answer: 'You can convert HEIC files up to 50 MB depending on your device’s available browser memory.',
      },
      {
        question: 'Can I test the tool if I do not have a HEIC file right now?',
        answer: 'Yes. Click the "Load Sample Image" button inside the tool workspace to test the conversion workflow immediately.',
      },
    ],
  },
  // 2. WebP to JPG
  {
    slug: 'webp-to-jpg',
    name: 'WebP to JPG',
    h1Title: 'WebP to JPG Converter',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    description: 'Convert modern Google WebP images into standard JPG files for editing, printing, and legacy uploads.',
    metaTitle: 'WebP to JPG Converter — Fast Browser Tool | ToolNova',
    metaDescription:
      'Convert WebP images to universally supported JPG format online. Customize background color and JPEG quality locally in your browser.',
    icon: 'Image',
    route: '/tools/webp-to-jpg',
    keywords: ['webp to jpg', 'webp to jpeg', 'convert webp', 'google webp converter', 'save webp as jpg'],
    relatedTools: ['webp-to-png', 'avif-to-jpg', 'heic-to-jpg', 'image-compressor'],
    isPopular: true,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Upload a WebP image',
        description: 'Select any .webp image from your computer or mobile device, or load the sample image.',
      },
      {
        title: 'Choose quality and background fill',
        description: 'Adjust the JPEG quality slider and pick a background fill color for transparent WebP regions.',
      },
      {
        title: 'Download your JPG',
        description: 'Preview the converted result with exact file size statistics and save the .jpg file immediately.',
      },
    ],
    benefits: [
      {
        title: 'Transparent background fill',
        description: 'Since JPG does not support alpha transparency, you can choose white, black, or any custom hex matte color.',
      },
      {
        title: 'Zero server round-trips',
        description: 'Conversion uses your browser’s native image decoder and HTML5 Canvas for instant results.',
      },
      {
        title: 'Compatible with all editors',
        description: 'Import downloaded web graphics into older desktop publishing suites or print workflows.',
      },
      {
        title: 'Live size comparison',
        description: 'See exact before-and-after byte counts and pixel dimensions before downloading.',
      },
    ],
    seoContent: {
      heading: 'Converting WebP graphics to standard JPEG format',
      paragraphs: [
        'WebP was developed to deliver smaller image payloads across modern websites, which means most images saved from web pages today arrive with a .webp extension. However, many print shops, presentation tools, email marketing platforms, and legacy photo editors still require traditional .jpg files.',
        'Because WebP supports alpha channel transparency while JPEG does not, our converter automatically composites transparent pixels onto a clean customizable background color (defaulting to pure white) before encoding your final JPG.',
      ],
    },
    faqs: [
      {
        question: 'What happens to transparent areas when converting WebP to JPG?',
        answer: 'JPG does not support transparency. Transparent pixels are filled with your chosen background color (white by default). If you need to keep transparency, use our WebP to PNG tool instead.',
      },
      {
        question: 'Is there any watermark added to the output JPG?',
        answer: 'Never. All ToolNova image conversions are completely free of watermarks or branding.',
      },
      {
        question: 'How fast is the WebP to JPG conversion?',
        answer: 'Because processing happens directly inside your browser’s graphics context, most images convert in under 100 milliseconds.',
      },
    ],
  },
  // 3. WebP to PNG
  {
    slug: 'webp-to-png',
    name: 'WebP to PNG',
    h1Title: 'WebP to PNG Converter',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    description: 'Convert WebP images to lossless PNG format while preserving full alpha channel transparency.',
    metaTitle: 'WebP to PNG Converter — Keep Transparency | ToolNova',
    metaDescription:
      'Convert WebP files to lossless PNG online in your browser. Preserves full alpha transparency for logos, icons, and UI graphics.',
    icon: 'Layers',
    route: '/tools/webp-to-png',
    keywords: ['webp to png', 'transparent webp to png', 'lossless image converter', 'convert webp png'],
    relatedTools: ['webp-to-jpg', 'svg-to-png', 'image-resizer', 'favicon-generator'],
    isPopular: false,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Drop your WebP graphic',
        description: 'Select a .webp image from your device or click "Load Sample Image" to test.',
      },
      {
        title: 'Lossless alpha rendering',
        description: 'The browser decodes full RGBA pixel data onto an uncompressed canvas buffer.',
      },
      {
        title: 'Save lossless PNG',
        description: 'Download your .png file with intact transparency and crisp edges.',
      },
    ],
    benefits: [
      {
        title: 'Preserves alpha transparency',
        description: 'Ideal for logos, UI decals, product cutouts, and stickers downloaded from the web.',
      },
      {
        title: 'Lossless pixel fidelity',
        description: 'Avoids introducing JPEG compression artifacts around sharp typography or line art.',
      },
      {
        title: 'Instant local processing',
        description: 'Works offline once loaded and never transmits your design assets over the network.',
      },
      {
        title: 'Checkerboard transparency preview',
        description: 'Inspect transparent regions clearly against a subtle studio checkerboard grid.',
      },
    ],
    seoContent: {
      heading: 'When to choose WebP to PNG over WebP to JPG',
      paragraphs: [
        'When working with user interface assets, company logos, screenshots with text, or transparent product photography, converting WebP to PNG is superior to JPG. PNG uses lossless DEFLATE compression and supports an 8-bit alpha channel, ensuring every semi-transparent shadow and crisp edge remains intact.',
        'Note that because PNG is a lossless archival format whereas WebP often uses predictive compression, the resulting PNG file size may be larger than the source WebP file. You can always run the output through our Image Compressor if you need a tighter file size.',
      ],
    },
    faqs: [
      {
        question: 'Why is my converted PNG file larger than the original WebP?',
        answer: 'WebP uses advanced lossy or predictive compression, whereas PNG stores lossless pixel data. This increase in byte size is normal and guarantees zero additional quality loss.',
      },
      {
        question: 'Does this converter keep semi-transparent shadows?',
        answer: 'Yes. Full 32-bit RGBA color and alpha values are preserved pixel-for-pixel.',
      },
      {
        question: 'Can I use this on mobile devices?',
        answer: 'Yes, the converter works in Safari on iOS, Chrome on Android, and all modern desktop browsers.',
      },
    ],
  },
  // 4. Image Compressor
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    h1Title: 'Online Image Compressor',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    description: 'Reduce JPG, PNG, and WebP file sizes with adjustable quality and live savings metrics.',
    metaTitle: 'Image Compressor — Reduce Photo Size Online | ToolNova',
    metaDescription:
      'Compress JPG, PNG, and WebP images directly in your browser. Control compression quality, compare file sizes, and optimize web performance.',
    icon: 'Minimize2',
    route: '/tools/image-compressor',
    keywords: ['image compressor', 'compress jpg', 'reduce image size', 'optimize images for web', 'shrink photo size'],
    relatedTools: ['image-resizer', 'webp-to-jpg', 'heic-to-jpg', 'exif-remover'],
    isPopular: true,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Upload JPG, PNG, or WebP',
        description: 'Select an image file up to 50 MB or load the sample high-resolution graphic.',
      },
      {
        title: 'Tune quality and output format',
        description: 'Set your quality target (10%–95%), optional max width constraint, and preferred output format.',
      },
      {
        title: 'Compare savings and download',
        description: 'Review the exact kilobytes saved and percentage reduction before downloading.',
      },
    ],
    benefits: [
      {
        title: 'Improve Core Web Vitals',
        description: 'Smaller images dramatically improve Largest Contentful Paint (LCP) and page load speed.',
      },
      {
        title: 'Meet strict portal upload limits',
        description: 'Quickly bring passport photos, receipts, or attachments under 500 KB or 1 MB limits.',
      },
      {
        title: 'Format switching built in',
        description: 'Optionally output as WebP or JPEG during compression for maximum byte reduction.',
      },
      {
        title: 'Complete data privacy',
        description: 'Sensitive documents and ID photos are compressed locally in your browser memory.',
      },
    ],
    seoContent: {
      heading: 'How client-side image compression optimizes web performance',
      paragraphs: [
        'Unoptimized images are the single largest contributor to slow page loads and high mobile bandwidth usage. By selectively quantizing chrominance information and stripping redundant metadata blocks, you can routinely reduce image payloads by 50% to 80% with negligible visual impact.',
        'ToolNova’s Image Compressor gives you granular control over both compression quality and maximum pixel dimensions. For PNG files that need drastic size reduction, switching the output format to WebP or JPEG inside the compressor yields immediate multi-megabyte savings.',
      ],
    },
    faqs: [
      {
        question: 'What quality setting is best for website images?',
        answer: 'A quality setting between 75% and 82% usually delivers the best balance between crisp visual detail and a compact file size.',
      },
      {
        question: 'Why does compressing a PNG to PNG sometimes save less space?',
        answer: 'Standard browser PNG encoding is lossless. For dramatic size reduction on photographic PNGs, select WebP (supports transparency) or JPEG as the target output format in the tool options.',
      },
      {
        question: 'Are my images stored anywhere?',
        answer: 'No. All compression calculations occur locally inside your browser.',
      },
    ],
  },
  // 5. Image Resizer
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    h1Title: 'Online Image Resizer',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    description: 'Resize images by exact pixel dimensions or percentage while locking aspect ratio.',
    metaTitle: 'Image Resizer — Resize Photos by Pixels or % | ToolNova',
    metaDescription:
      'Resize JPG, PNG, and WebP images online to exact pixel dimensions or percentages. Lock aspect ratio or choose social media presets in your browser.',
    icon: 'Maximize2',
    route: '/tools/image-resizer',
    keywords: ['image resizer', 'resize photo pixels', 'change image dimensions', 'scale image online', 'social media image size'],
    relatedTools: ['image-compressor', 'svg-to-png', 'favicon-generator', 'webp-to-png'],
    isPopular: true,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Upload your image',
        description: 'Choose any JPG, PNG, or WebP image to inspect its current width and height in pixels.',
      },
      {
        title: 'Enter target dimensions or preset',
        description: 'Type exact Width × Height pixels, pick a quick percentage (25%, 50%, 75%), or select a standard preset.',
      },
      {
        title: 'Resize and download',
        description: 'Generate the resized graphic with high-quality smoothing and download it in one click.',
      },
    ],
    benefits: [
      {
        title: 'Aspect ratio lock',
        description: 'Automatically calculates proportional height when you change width so photos never look stretched.',
      },
      {
        title: 'One-click standard presets',
        description: 'Jump straight to 1920×1080 (Full HD), 1200×630 (Open Graph Share Card), or 1080×1080 (Square).',
      },
      {
        title: 'High-quality canvas interpolation',
        description: 'Uses high-quality image smoothing for clean downscaling of photography and UI screenshots.',
      },
      {
        title: 'Instant dimension inspection',
        description: 'Verify both original and output pixel resolutions with tabular precision.',
      },
    ],
    seoContent: {
      heading: 'Resizing images accurately for web, social media, and print',
      paragraphs: [
        'Modern smartphone cameras routinely shoot 12-megapixel to 48-megapixel photos measuring over 4000 pixels wide. Uploading a 4000px image into a 600px blog column wastes bandwidth and slows down rendering across mobile networks.',
        'With ToolNova’s Image Resizer, you can specify exact pixel dimensions or scale by percentage while keeping your original aspect ratio locked. Whether you are preparing an Open Graph social preview card (1200×630) or scaling down product thumbnails, the entire operation finishes instantly in your browser.',
      ],
    },
    faqs: [
      {
        question: 'How do I prevent my image from looking stretched?',
        answer: 'Keep the "Lock Aspect Ratio" toggle enabled. When enabled, changing the width automatically adjusts the height proportionally.',
      },
      {
        question: 'What happens if I upscale a small image to a larger size?',
        answer: 'The tool will enlarge the pixel dimensions using smooth interpolation, though upscaling raster images cannot invent new optical detail.',
      },
      {
        question: 'Can I also change the output format while resizing?',
        answer: 'Yes, you can export your resized image as PNG, JPEG, or WebP.',
      },
    ],
  },
  // 6. SVG to PNG
  {
    slug: 'svg-to-png',
    name: 'SVG to PNG',
    h1Title: 'SVG to PNG Converter',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    description: 'Render vector SVG files or raw SVG markup into crisp, high-resolution PNG images at any scale.',
    metaTitle: 'SVG to PNG Converter — High-Res Vector Rasterizer | ToolNova',
    metaDescription:
      'Convert SVG vector files or pasted SVG code into high-resolution PNG images online. Scale 1x, 2x, 4x or custom dimensions with transparency.',
    icon: 'FileCode',
    route: '/tools/svg-to-png',
    keywords: ['svg to png', 'convert vector to png', 'rasterize svg', 'svg code to png', 'high res svg export'],
    relatedTools: ['favicon-generator', 'webp-to-png', 'image-resizer', 'image-color-palette'],
    isPopular: false,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Upload an .svg file or paste SVG code',
        description: 'Drop a vector .svg file or paste raw <svg> XML markup directly into the editor.',
      },
      {
        title: 'Select scale multiplier or dimensions',
        description: 'Choose 1x, 2x, 4x, or 8x retina scale, and select transparent or solid background fill.',
      },
      {
        title: 'Render and download PNG',
        description: 'Rasterize the vector paths at crisp resolution and download your .png image.',
      },
    ],
    benefits: [
      {
        title: 'Crisp Retina / 4K scaling',
        description: 'Because SVG is resolution-independent, scaling up to 4x or 8x produces razor-sharp edges before PNG rasterization.',
      },
      {
        title: 'Supports file upload & raw code',
        description: 'Paste inline SVG icons directly from your code editor or Figma export without saving a file first.',
      },
      {
        title: 'Custom background or transparent',
        description: 'Keep the alpha background transparent or composite onto a solid brand color.',
      },
      {
        title: 'Safe local rendering',
        description: 'SVG markup is sanitized and rendered inside an isolated client-side image context.',
      },
    ],
    seoContent: {
      heading: 'Rasterizing SVG vectors into high-DPI PNG graphics',
      paragraphs: [
        'Scalable Vector Graphics (SVG) are ideal for responsive websites and icon systems, but many slide deck editors, email clients, social media platforms, and document processors do not allow .svg uploads. Converting your SVG to a PNG at 2x or 4x scale ensures your logo or diagram stays sharp on high-DPI Retina displays.',
        'ToolNova parses your SVG’s viewBox and width/height attributes automatically, allowing you to multiply the base resolution cleanly before exporting to a lossless PNG.',
      ],
    },
    faqs: [
      {
        question: 'Can I paste raw <svg> code instead of uploading a file?',
        answer: 'Yes. Switch to the "Paste SVG Code" tab or paste your XML markup directly into the code box to render it immediately.',
      },
      {
        question: 'Why does scaling to 4x look sharper than resizing a PNG?',
        answer: 'SVG stores mathematical vector paths rather than fixed pixels. Scaling the vector before rasterizing calculates clean curves at the target resolution.',
      },
      {
        question: 'Are external fonts inside SVGs supported?',
        answer: 'System and standard web fonts render automatically. For custom brand typefaces, convert text to outlines/paths in your vector editor before exporting.',
      },
    ],
  },
  // 7. AVIF to JPG
  {
    slug: 'avif-to-jpg',
    name: 'AVIF to JPG',
    h1Title: 'AVIF to JPG Converter',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    description: 'Convert next-gen AVIF images into widely supported standard JPG files right in your browser.',
    metaTitle: 'AVIF to JPG Converter — Free Browser Tool | ToolNova',
    metaDescription:
      'Convert AVIF images to standard JPG format online in seconds. Adjust JPEG quality and background matte color with local browser processing.',
    icon: 'Camera',
    route: '/tools/avif-to-jpg',
    keywords: ['avif to jpg', 'avif to jpeg', 'convert avif', 'next-gen image converter', 'open avif file'],
    relatedTools: ['webp-to-jpg', 'heic-to-jpg', 'image-compressor', 'webp-to-png'],
    isPopular: false,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Select your AVIF file',
        description: 'Drop an .avif image from your device or load our sample image to test.',
      },
      {
        title: 'Configure JPEG quality',
        description: 'Select your target quality level (10%–100%) and background matte color.',
      },
      {
        title: 'Download standard JPG',
        description: 'Decode the AV1 image frame locally and save your universally compatible .jpg file.',
      },
    ],
    benefits: [
      {
        title: 'Open AVIF anywhere',
        description: 'Convert AV1-encoded images from CDNs and modern websites so they open in any desktop app.',
      },
      {
        title: 'Native browser hardware decoding',
        description: 'Leverages modern browser AVIF decoders for fast, zero-upload conversion.',
      },
      {
        title: 'Custom background matte',
        description: 'Replaces any transparent AVIF alpha pixels with clean white or your chosen hex color.',
      },
      {
        title: 'No software installation',
        description: 'Avoid installing codec packs or command-line tools just to open downloaded images.',
      },
    ],
    seoContent: {
      heading: 'Bridging AVIF next-generation compression with universal JPEG compatibility',
      paragraphs: [
        'AVIF (AV1 Image File Format) offers remarkable compression efficiency and HDR support, making it increasingly popular across news sites, CDNs, and e-commerce catalogs. However, when you save an image from the web and it downloads as an .avif file, many older photo editors and upload forms refuse to recognize it.',
        'Our AVIF to JPG tool uses your browser’s built-in AV1 image decoder to render the frame onto an HTML5 Canvas and export a clean baseline JPEG file that works everywhere.',
      ],
    },
    faqs: [
      {
        question: 'Which browsers support client-side AVIF to JPG conversion?',
        answer: 'Chrome, Edge, Firefox, and Safari (iOS 16+ / macOS Ventura+) all include native AVIF decoding support.',
      },
      {
        question: 'Does converting AVIF to JPG keep image dimensions the same?',
        answer: 'Yes. The output JPG retains the exact pixel width and height of your source AVIF image.',
      },
      {
        question: 'Is this converter free to use?',
        answer: 'Yes, it is completely free with no watermarks, file limits, or registration.',
      },
    ],
  },
  // 8. Image Color Palette
  {
    slug: 'image-color-palette',
    name: 'Image Color Palette',
    h1Title: 'Image Color Palette Extractor',
    category: 'Image Tools',
    categorySlug: 'image-tools',
    description: 'Extract dominant HEX, RGB, and HSL color palettes from any photograph or design inspiration.',
    metaTitle: 'Image Color Palette Generator — Extract HEX & RGB | ToolNova',
    metaDescription:
      'Extract dominant colors from any image in your browser. Copy HEX, RGB, and HSL color codes or export your palette as CSS variables, JSON, or PNG.',
    icon: 'Palette',
    route: '/tools/image-color-palette',
    keywords: ['image color palette', 'extract colors from image', 'hex color picker from photo', 'palette generator', 'css color palette'],
    relatedTools: ['svg-to-png', 'favicon-generator', 'image-resizer', 'qr-code-generator'],
    isPopular: false,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Upload an image or photo',
        description: 'Drop any photograph, brand logo, or UI screenshot—or click "Load Sample Artwork".',
      },
      {
        title: 'Analyze pixel distribution',
        description: 'Choose 5, 8, or 12 palette swatches. The color quantization engine clusters dominant hues locally.',
      },
      {
        title: 'Copy codes or export palette',
        description: 'Click any swatch to copy its HEX/RGB/HSL value, or export as CSS custom properties or a PNG swatch card.',
      },
    ],
    benefits: [
      {
        title: 'HEX, RGB & HSL formats',
        description: 'View and copy color values in all three standard web design notations with one click.',
      },
      {
        title: 'Export CSS variables & JSON',
        description: 'Generate ready-to-paste :root { --color-1: #... } declarations for your stylesheets.',
      },
      {
        title: 'Downloadable PNG palette card',
        description: 'Export a clean visual swatch sheet with hex labels for moodboards and client presentations.',
      },
      {
        title: 'Coverage percentage metrics',
        description: 'See the relative dominance of each extracted hue across the image canvas.',
      },
    ],
    seoContent: {
      heading: 'Extracting harmonious color systems from photography and art',
      paragraphs: [
        'Designers and front-end developers frequently build UI color tokens and brand themes inspired by real-world photography, product packaging, or artwork. Manually sampling single pixels with an eyedropper often grabs noisy compression artifacts rather than the true perceived color.',
        'ToolNova’s Image Color Palette Extractor samples thousands of pixels across your image and groups them into distinct perceptual color clusters. You can immediately copy individual HEX, RGB, or HSL codes or export a complete CSS custom property block for your project.',
      ],
    },
    faqs: [
      {
        question: 'How does the color extraction algorithm work?',
        answer: 'The tool downsamples the image onto an offscreen canvas, filters out near-transparent pixels, and clusters pixel RGB vectors by perceptual color distance to surface the most representative dominant and accent colors.',
      },
      {
        question: 'Can I export the palette for my code project?',
        answer: 'Yes. You can copy ready-to-use CSS variables (:root), export a JSON array, or download a PNG visual swatch sheet.',
      },
      {
        question: 'Are uploaded moodboard images kept private?',
        answer: 'Yes. Pixel analysis runs 100% locally in your browser using Canvas getImageData().',
      },
    ],
  },
  // 9. JPG/PNG to PDF
  {
    slug: 'jpg-png-to-pdf',
    name: 'JPG/PNG to PDF',
    h1Title: 'JPG & PNG to PDF Converter',
    category: 'PDF Tools',
    categorySlug: 'pdf-tools',
    description: 'Combine one or multiple JPG, PNG, or WebP images into a clean, multi-page PDF document.',
    metaTitle: 'JPG & PNG to PDF Converter — Free Browser Tool | ToolNova',
    metaDescription:
      'Convert single or multiple JPG and PNG images into a PDF document directly in your browser. Choose A4, US Letter, or fit-to-image page sizes.',
    icon: 'FileText',
    route: '/tools/jpg-png-to-pdf',
    keywords: ['jpg to pdf', 'png to pdf', 'images to pdf', 'combine photos into pdf', 'convert picture to pdf'],
    relatedTools: ['screenshot-to-pdf', 'merge-pdf', 'split-pdf', 'image-compressor'],
    isPopular: true,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Add one or more images',
        description: 'Select JPG, PNG, or WebP images from your device and arrange them in your desired page order.',
      },
      {
        title: 'Configure page size & margins',
        description: 'Pick A4, US Letter, or Fit-to-Image dimensions, along with Portrait/Landscape orientation and margin size.',
      },
      {
        title: 'Generate & download PDF',
        description: 'Click "Create PDF" to assemble the multi-page PDF locally and download it immediately.',
      },
    ],
    benefits: [
      {
        title: 'Multi-image page ordering',
        description: 'Combine scanned receipts, multi-page forms, or photo portfolios into a single organized PDF.',
      },
      {
        title: 'Standard print page sizes',
        description: 'Format pages cleanly for A4, US Letter, or exact image pixel dimensions.',
      },
      {
        title: 'Zero watermarks or page limits',
        description: 'Generated PDFs are clean standard documents with no branding stamps added.',
      },
      {
        title: '100% local PDF assembly',
        description: 'Your personal documents and ID scans never leave your device.',
      },
    ],
    seoContent: {
      heading: 'Combining photos and scanned documents into a single PDF',
      paragraphs: [
        'Submitting expense receipts, signed contracts, or homework assignments photographed on a phone is much easier when all pages are packaged into a single PDF file. Uploading separate image attachments often leads to out-of-order pages or rejected form submissions.',
        'Using client-side PDF generation powered by pdf-lib, ToolNova embeds your images into a compliant PDF container directly inside your browser. You can reorder pages, set clean print margins, and choose between A4, US Letter, or native image dimensions.',
      ],
    },
    faqs: [
      {
        question: 'Can I combine both JPG and PNG files into the same PDF?',
        answer: 'Yes. You can mix JPG, PNG, and WebP images in a single batch and reorder them before generating the PDF.',
      },
      {
        question: 'Are my document photos uploaded to an external server?',
        answer: 'No. The PDF file is constructed directly in your browser memory.',
      },
      {
        question: 'Which page size should I choose for printing?',
        answer: 'Choose "A4" for Europe, UK, Australia, and international standard paper, or "US Letter" for the United States and Canada.',
      },
    ],
  },
  // 10. Merge PDF
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    h1Title: 'Merge PDF Files Online',
    category: 'PDF Tools',
    categorySlug: 'pdf-tools',
    description: 'Combine multiple PDF documents into a single unified PDF file in your chosen order.',
    metaTitle: 'Merge PDF — Combine Multiple PDFs in Browser | ToolNova',
    metaDescription:
      'Merge two or more PDF files into one document directly in your browser. Reorder PDFs, inspect page counts, and download with no watermarks.',
    icon: 'FilePlus2',
    route: '/tools/merge-pdf',
    keywords: ['merge pdf', 'combine pdf files', 'join pdf online', 'pdf merger browser', 'bind pdf documents'],
    relatedTools: ['split-pdf', 'jpg-png-to-pdf', 'screenshot-to-pdf', 'image-compressor'],
    isPopular: true,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Select multiple PDF files',
        description: 'Upload two or more .pdf documents from your device, or generate sample PDFs to test.',
      },
      {
        title: 'Reorder your documents',
        description: 'Use the move up/down controls to arrange the exact sequence in which files should be merged.',
      },
      {
        title: 'Merge and download',
        description: 'Click "Merge PDFs" to combine all pages into one seamless PDF file and save it locally.',
      },
    ],
    benefits: [
      {
        title: 'Strict document privacy',
        description: 'Financial statements, legal contracts, and invoices are merged locally in your browser without cloud uploads.',
      },
      {
        title: 'Page count verification',
        description: 'See the exact page count of every uploaded file and the total combined page count.',
      },
      {
        title: 'Preserves vector text & links',
        description: 'Pages are copied natively at the PDF object level rather than rasterized, keeping text sharp and searchable.',
      },
      {
        title: 'Fast & watermark-free',
        description: 'Merge multi-page documents in milliseconds with zero branding or sign-up gates.',
      },
    ],
    seoContent: {
      heading: 'How browser-based PDF merging protects confidential documents',
      paragraphs: [
        'Most people merge PDFs when handling sensitive paperwork—such as tax returns, employment contracts, bank statements, or academic applications. Sending those files to a remote third-party server introduces unnecessary privacy risk.',
        'ToolNova’s Merge PDF tool parses and combines PDF page trees locally within your browser’s JavaScript sandbox. Because pages are copied at the structural PDF object level, all selectable text, vector diagrams, and layout fidelity remain untouched.',
      ],
    },
    faqs: [
      {
        question: 'Does merging PDFs flatten or blur selectable text?',
        answer: 'No. Our merger copies the native PDF page objects directly, preserving all vector fonts, searchable text, and resolution.',
      },
      {
        question: 'How many PDF files can I merge at once?',
        answer: 'You can merge as many PDF files as your browser memory allows—typically dozens of standard documents at once.',
      },
      {
        question: 'What if a PDF file is password-protected?',
        answer: 'Encrypted or password-locked PDFs must be unlocked before they can be merged by client-side tools.',
      },
    ],
  },
  // 11. Split PDF
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    h1Title: 'Split PDF & Extract Pages',
    category: 'PDF Tools',
    categorySlug: 'pdf-tools',
    description: 'Extract specific page ranges from a PDF or split every page into separate PDF files.',
    metaTitle: 'Split PDF — Extract Pages from PDF in Browser | ToolNova',
    metaDescription:
      'Split PDF files or extract specific page ranges (e.g., 1-3, 5) directly in your browser. Download extracted PDFs or a ZIP of individual pages.',
    icon: 'Scissors',
    route: '/tools/split-pdf',
    keywords: ['split pdf', 'extract pdf pages', 'separate pdf pages', 'cut pdf online', 'remove pages from pdf'],
    relatedTools: ['merge-pdf', 'jpg-png-to-pdf', 'screenshot-to-pdf', 'exif-remover'],
    isPopular: false,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Upload a multi-page PDF',
        description: 'Choose any .pdf document to inspect its total page count, or load our 5-page sample PDF.',
      },
      {
        title: 'Choose split mode or page range',
        description: 'Select "Extract Page Range" (e.g., 1-2, 4) for a single output PDF, or "Split All Pages" for individual files.',
      },
      {
        title: 'Download extracted PDF or ZIP',
        description: 'Save your newly extracted PDF document or download a .zip archive containing each separated page.',
      },
    ],
    benefits: [
      {
        title: 'Flexible range syntax',
        description: 'Specify single pages and ranges like "1, 3-5, 8" to build a custom subset document.',
      },
      {
        title: 'Batch ZIP export',
        description: 'Burst a multi-page PDF into individual 1-page PDFs neatly packaged in a single ZIP download.',
      },
      {
        title: 'Local browser execution',
        description: 'Extract a single relevant page from a large confidential report without uploading the file.',
      },
      {
        title: 'Original vector quality',
        description: 'Extracted pages retain 100% of their original formatting, fonts, and embedded graphics.',
      },
    ],
    seoContent: {
      heading: 'Extracting pages and splitting large PDF documents locally',
      paragraphs: [
        'Whether you need to send only the signature page of an agreement, separate a batch scan into individual invoices, or trim chapters from a report, splitting a PDF shouldn’t require expensive desktop software.',
        'ToolNova lets you either extract custom page ranges into a new streamlined PDF file or burst every page of your document into standalone PDF files bundled inside a convenient ZIP archive—all processed locally inside your browser.',
      ],
    },
    faqs: [
      {
        question: 'How do I format the page range input?',
        answer: 'Use commas to separate pages and hyphens for ranges. For example, typing "1, 3-5" extracts pages 1, 3, 4, and 5 into a new PDF.',
      },
      {
        question: 'Does splitting a PDF modify my original file?',
        answer: 'No. Your original file on your computer or phone remains untouched; the tool generates a brand-new download.',
      },
      {
        question: 'Are my PDF contents private?',
        answer: 'Yes. Page extraction runs entirely in your browser tab with no server upload.',
      },
    ],
  },
  // 12. Screenshot to PDF
  {
    slug: 'screenshot-to-pdf',
    name: 'Screenshot to PDF',
    h1Title: 'Screenshot to PDF Converter',
    category: 'PDF Tools',
    categorySlug: 'pdf-tools',
    description: 'Turn desktop or mobile screenshots into clean, shareable PDF documents with optional headers.',
    metaTitle: 'Screenshot to PDF Converter — Paste or Upload | ToolNova',
    metaDescription:
      'Convert desktop and mobile screenshots into clean PDF documents online. Paste from clipboard or upload images, add optional headers, and export.',
    icon: 'Monitor',
    route: '/tools/screenshot-to-pdf',
    keywords: ['screenshot to pdf', 'paste screenshot to pdf', 'screen capture to pdf', 'save screenshot as pdf'],
    relatedTools: ['jpg-png-to-pdf', 'screenshot-to-text', 'merge-pdf', 'image-resizer'],
    isPopular: false,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Upload or paste screenshots',
        description: 'Select screenshot files or press Ctrl+V / Cmd+V to paste directly from your clipboard.',
      },
      {
        title: 'Choose layout & optional caption',
        description: 'Pick exact pixel fit or framed A4/Letter pages, and optionally include a document title header.',
      },
      {
        title: 'Export clean PDF',
        description: 'Download a crisp PDF containing all your screen captures in sequence.',
      },
    ],
    benefits: [
      {
        title: 'Direct clipboard paste support',
        description: 'Take a screenshot and press Ctrl+V / Cmd+V right on the page without saving temporary files first.',
      },
      {
        title: 'Bug report & QA friendly',
        description: 'Add an optional title/timestamp header to document UI states, receipts, or confirmation screens.',
      },
      {
        title: 'Fit-to-screen or print-framed',
        description: 'Export at exact screen pixel dimensions or centered neatly on standard A4 / US Letter pages.',
      },
      {
        title: 'Private by design',
        description: 'Internal dashboard captures and order confirmations stay inside your local browser session.',
      },
    ],
    seoContent: {
      heading: 'Archiving screenshots as structured PDF documentation',
      paragraphs: [
        'Capturing confirmation numbers, software bug sequences, or chat receipts often produces a folder of scattered PNG files. Packaging those screen captures into a single chronologically ordered PDF makes sharing with teammates, clients, or support desks effortless.',
        'Our Screenshot to PDF tool supports direct clipboard pasting alongside standard file selection, allowing you to capture and assemble documentation in seconds.',
      ],
    },
    faqs: [
      {
        question: 'Can I paste a screenshot directly from my clipboard?',
        answer: 'Yes! After taking a screenshot to your clipboard, click anywhere on the tool workspace and press Ctrl+V (Windows/Linux) or Cmd+V (Mac).',
      },
      {
        question: 'Will text in my screenshot remain sharp in the PDF?',
        answer: 'Yes. PNG screenshots are embedded without lossy re-compression so UI typography stays razor-sharp.',
      },
      {
        question: 'Can I combine multiple screenshots into a multi-page PDF?',
        answer: 'Yes. Add as many screenshots as you need, reorder them, and export them as one multi-page PDF.',
      },
    ],
  },
  // 13. Image to Text
  {
    slug: 'image-to-text',
    name: 'Image to Text',
    h1Title: 'Image to Text (OCR) Workspace',
    category: 'OCR & Privacy',
    categorySlug: 'ocr-privacy',
    description: 'Inspect image OCR readiness and extract text via browser detection or modular OCR service integration.',
    metaTitle: 'Image to Text (OCR) — Document & Photo OCR | ToolNova',
    metaDescription:
      'Analyze image resolution and contrast for Optical Character Recognition (OCR) and extract text via browser detection or modular OCR engines.',
    icon: 'ScanText',
    route: '/tools/image-to-text',
    keywords: ['image to text', 'ocr online', 'extract text from image', 'photo to text', 'optical character recognition'],
    relatedTools: ['screenshot-to-text', 'exif-remover', 'jpg-png-to-pdf', 'image-compressor'],
    isPopular: false,
    processingType: 'modular-service',
    howItWorks: [
      {
        title: 'Select a document or photo',
        description: 'Upload a JPG, PNG, or WebP image containing printed text, or load our sample document image.',
      },
      {
        title: 'Run pre-flight & OCR pipeline',
        description: 'The tool validates image resolution, contrast, and checks for native browser Shape Detection or connected OCR provider.',
      },
      {
        title: 'Inspect results or diagnostics',
        description: 'Copy detected text blocks or review transparent service connection status and image quality metrics.',
      },
    ],
    benefits: [
      {
        title: 'Transparent modular architecture',
        description: 'Uses native browser TextDetector where supported and provides a clean service adapter (`ocrService.ts`) for external OCR engines—never faking results.',
      },
      {
        title: 'Pre-flight OCR quality analysis',
        description: 'Calculates actual pixel dimensions, aspect ratio, luminance contrast, and estimated DPI suitability before recognition.',
      },
      {
        title: 'Zero silent data leaks',
        description: 'Never transmits document images to hidden third-party servers without an explicitly configured endpoint.',
      },
      {
        title: 'Preprocessing controls',
        description: 'Includes high-contrast grayscale preprocessing preview to improve character legibility.',
      },
    ],
    seoContent: {
      heading: 'How Optical Character Recognition (OCR) and image preparation work',
      paragraphs: [
        'Accurate Optical Character Recognition (OCR) depends heavily on input image geometry, luminance contrast between foreground ink and paper background, and effective horizontal resolution (ideally 300 DPI or higher for small printed serif type).',
        'ToolNova’s Image to Text workspace performs immediate client-side pre-flight diagnostics on your uploaded image—measuring contrast ratios and resolution adequacy—and attempts native browser text detection (via the W3C Shape Detection API where enabled) or routes through a cleanly isolated OCR service module without ever generating fake placeholder text.',
      ],
    },
    faqs: [
      {
        question: 'Does this tool invent or fake OCR text if no external engine is connected?',
        answer: 'Never. If your browser does not enable the native TextDetector API and no external OCR endpoint is configured, the tool transparently reports the modular service status alongside real pre-flight image diagnostics.',
      },
      {
        question: 'How can developers connect a custom OCR backend?',
        answer: 'The OCR pipeline is isolated in src/services/ocrService.ts, making it straightforward to connect Cloudflare Workers AI, Google Cloud Vision, or a self-hosted Tesseract worker.',
      },
      {
        question: 'What image resolution works best for OCR?',
        answer: 'Images with at least 1000px width and clear contrast between text and background yield the highest recognition accuracy.',
      },
    ],
  },
  // 14. Screenshot to Text
  {
    slug: 'screenshot-to-text',
    name: 'Screenshot to Text',
    h1Title: 'Screenshot to Text (OCR) Extractor',
    category: 'OCR & Privacy',
    categorySlug: 'ocr-privacy',
    description: 'Paste or upload screen captures to run OCR readiness diagnostics and modular text extraction.',
    metaTitle: 'Screenshot to Text — Screen Capture OCR Tool | ToolNova',
    metaDescription:
      'Upload or paste screenshots to inspect UI text contrast, preprocess captures, and run browser or modular OCR text extraction.',
    icon: 'Crop',
    route: '/tools/screenshot-to-text',
    keywords: ['screenshot to text', 'copy text from screenshot', 'screen ocr', 'extract text from screen capture'],
    relatedTools: ['image-to-text', 'screenshot-to-pdf', 'exif-remover', 'json-formatter'],
    isPopular: false,
    processingType: 'modular-service',
    howItWorks: [
      {
        title: 'Paste (Ctrl+V) or upload a screenshot',
        description: 'Paste a screen capture directly from your clipboard or select a PNG/JPG screenshot file.',
      },
      {
        title: 'Analyze UI text contrast & scale',
        description: 'Run client-side luminance and pixel density analysis optimized for dark-mode and light-mode UI screenshots.',
      },
      {
        title: 'Execute OCR service pipeline',
        description: 'Extract text via native browser detection if available or inspect the modular OCR service adapter status.',
      },
    ],
    benefits: [
      {
        title: 'Direct clipboard paste workflow',
        description: 'Press Ctrl+V or Cmd+V right on the page to load your latest screen snip.',
      },
      {
        title: 'Dark-mode inversion preview',
        description: 'Toggle grayscale/inversion preprocessing to normalize dark-mode code or terminal screenshots for OCR engines.',
      },
      {
        title: 'Honest, non-simulated status',
        description: 'Clearly distinguishes between native browser detection and external OCR service configuration.',
      },
      {
        title: 'Local diagnostic metrics',
        description: 'Inspect pixel dimensions, contrast score, and dark/light background polarity in real time.',
      },
    ],
    seoContent: {
      heading: 'Optimizing UI and code screenshots for text recognition',
      paragraphs: [
        'Unlike scanned paper documents, digital screenshots have crisp anti-aliased subpixel fonts, low pixel heights (often 12px–16px), and frequently use dark-mode color schemes. Many OCR engines trained on black-ink-on-white-paper struggle with light text on dark terminal backgrounds unless the image polarity is normalized first.',
        'Our Screenshot to Text workspace detects whether your screenshot uses a dark or light background, provides one-click contrast normalization, and interfaces cleanly with browser detection or our modular OCR service layer.',
      ],
    },
    faqs: [
      {
        question: 'Can I paste a screenshot directly without saving a file?',
        answer: 'Yes. Press Ctrl+V (or Cmd+V on Mac) anywhere on the tool page to load an image directly from your clipboard.',
      },
      {
        question: 'Why does dark-mode preprocessing matter for screenshot OCR?',
        answer: 'Many OCR models perform significantly better when dark backgrounds with light text are inverted into dark text on a light background.',
      },
      {
        question: 'Are pasted screenshots uploaded anywhere by default?',
        answer: 'No. Pre-flight diagnostics and image normalization run 100% locally in your browser.',
      },
    ],
  },
  // 15. EXIF Remover
  {
    slug: 'exif-remover',
    name: 'EXIF Remover',
    h1Title: 'EXIF Metadata Remover & Inspector',
    category: 'OCR & Privacy',
    categorySlug: 'ocr-privacy',
    description: 'Inspect and strip hidden EXIF metadata, GPS coordinates, and camera serial tags from photos.',
    metaTitle: 'EXIF Remover — Strip Photo Metadata & GPS Online | ToolNova',
    metaDescription:
      'Remove hidden EXIF metadata, GPS location coordinates, and camera details from JPG, PNG, and WebP photos directly in your browser.',
    icon: 'ShieldCheck',
    route: '/tools/exif-remover',
    keywords: ['exif remover', 'remove photo metadata', 'strip gps from photo', 'clean image metadata', 'privacy photo cleaner'],
    relatedTools: ['heic-to-jpg', 'image-compressor', 'webp-to-jpg', 'image-to-text'],
    isPopular: false,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Select a photo to inspect',
        description: 'Drop a JPG, PNG, or WebP photo—or click "Load Sample Photo with EXIF" to see binary segment detection in action.',
      },
      {
        title: 'Review detected metadata segments',
        description: 'Inspect file properties and binary JPEG APP1 (EXIF/XMP), ICC Profile, and comment markers.',
      },
      {
        title: 'Strip metadata & download clean photo',
        description: 'Generate a clean pixel-only image buffer with all EXIF, GPS, and camera tags scrubbed.',
      },
    ],
    benefits: [
      {
        title: 'Protect home & travel location privacy',
        description: 'Prevents strangers from reading embedded GPS latitude/longitude coordinates when you post photos online.',
      },
      {
        title: 'Scrub camera & device identifiers',
        description: 'Removes smartphone model names, lens serial numbers, capture timestamps, and editing software tags.',
      },
      {
        title: 'Binary marker inspection',
        description: 'Scans JPEG binary headers locally to show exactly which metadata segments were found and removed.',
      },
      {
        title: '100% local privacy',
        description: 'Your uncleaned photo never leaves your device; scrubbing happens entirely inside your browser.',
      },
    ],
    seoContent: {
      heading: 'Why removing EXIF metadata before sharing photos online is critical',
      paragraphs: [
        'Every time you take a picture with a smartphone or digital camera, the device embeds Exchangeable Image File (EXIF) metadata inside the file header. This hidden data routinely includes exact GPS coordinates where the photo was taken, the exact date and time, device make and model, and software history.',
        'While major social networks strip some metadata, forums, classified ad sites, blogs, and direct file shares preserve the full EXIF payload. ToolNova’s EXIF Remover inspects the binary structure of your image locally and reconstructs a clean, metadata-free copy ready for safe sharing.',
      ],
    },
    faqs: [
      {
        question: 'Does removing EXIF data change how my photo looks?',
        answer: 'No. Only non-visual metadata headers (like GPS tags, camera settings, and timestamps) are removed while the visual image stays intact.',
      },
      {
        question: 'How does the tool verify that EXIF tags were removed?',
        answer: 'Our binary parser scans both the original file and the cleaned output buffer for JPEG APP1 (0xFFE1 EXIF/XMP) and comment (0xFFFE) segments, confirming zero metadata segments remain.',
      },
      {
        question: 'Is my original photo uploaded to a server?',
        answer: 'Never. All binary scanning and metadata scrubbing occur locally inside your browser.',
      },
    ],
  },
  // 16. QR Code Generator
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    h1Title: 'Custom QR Code Generator',
    category: 'Marketing Tools',
    categorySlug: 'marketing-tools',
    secondaryCategories: ['Developer Tools'],
    description: 'Generate customizable PNG and vector SVG QR codes for URLs, Wi-Fi networks, text, and emails.',
    metaTitle: 'QR Code Generator — Free SVG & PNG QR Codes | ToolNova',
    metaDescription:
      'Create custom QR codes for links, Wi-Fi, and text in your browser. Customize colors, error correction, and download high-res PNG or vector SVG.',
    icon: 'QrCode',
    route: '/tools/qr-code-generator',
    keywords: ['qr code generator', 'create qr code free', 'svg qr code', 'wifi qr code generator', 'no expiration qr code'],
    relatedTools: ['utm-builder', 'url-encoder-decoder', 'favicon-generator', 'svg-to-png'],
    isPopular: false,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Choose content type & enter data',
        description: 'Enter a website URL, plain text, Wi-Fi network credentials, or email address.',
      },
      {
        title: 'Customize colors, size & error correction',
        description: 'Pick foreground and background colors, pixel resolution (up to 1024px), and error correction level (L, M, Q, H).',
      },
      {
        title: 'Download PNG or vector SVG',
        description: 'Save your static QR code immediately as a high-res PNG or print-ready vector SVG.',
      },
    ],
    benefits: [
      {
        title: 'Static QR codes that never expire',
        description: 'Encodes your URL or data directly into the QR matrix—no redirect tracking servers or paid subscriptions required.',
      },
      {
        title: 'Print-ready SVG & high-res PNG',
        description: 'Export scalable vector SVG files for packaging, flyers, and signage alongside raster PNGs.',
      },
      {
        title: 'Built-in Wi-Fi QR mode',
        description: 'Let guests join your Wi-Fi network by scanning a code without typing complex passwords.',
      },
      {
        title: '4 error correction levels',
        description: 'Choose up to High (30% Reed-Solomon recovery) so codes remain scannable even if partially scuffed.',
      },
    ],
    seoContent: {
      heading: 'Creating permanent, standards-compliant QR codes for print and web',
      paragraphs: [
        'Many online QR code generators secretly wrap your URL inside a proprietary redirect link that stops working after a 14-day trial. ToolNova generates true static ISO/IEC 18004 QR codes that encode your exact destination URL or payload directly into the barcode modules.',
        'Because the data is embedded directly in the visual pattern, your QR codes work forever with zero scan limits and zero third-party dependencies. For professional print production, use the SVG download option to scale your QR code to any physical size without pixelation.',
      ],
    },
    faqs: [
      {
        question: 'Do QR codes created on ToolNova ever expire?',
        answer: 'No. We generate standard static QR codes that encode your data directly into the pattern. They will work forever with unlimited scans.',
      },
      {
        question: 'Which Error Correction Level should I choose?',
        answer: 'Level M (15%) is ideal for most uses. Choose Level Q (25%) or Level H (30%) if the QR code will be printed outdoors where wear or smudges may occur.',
      },
      {
        question: 'Can I use custom brand colors?',
        answer: 'Yes. Just make sure the foreground color is significantly darker than the background color so smartphone cameras can read the contrast.',
      },
    ],
  },
  // 17. Favicon Generator
  {
    slug: 'favicon-generator',
    name: 'Favicon Generator',
    h1Title: 'Favicon & App Icon Generator',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Generate a complete favicon bundle (ICO, 16×16, 32×32, Apple Touch, Android PWA) from an image or text.',
    metaTitle: 'Favicon Generator — Create ICO, PNG & Webmanifest | ToolNova',
    metaDescription:
      'Generate a complete website favicon package from any image or monogram text. Download favicon.ico, Apple Touch Icon, Android icons, and HTML code.',
    icon: 'AppWindow',
    route: '/tools/favicon-generator',
    keywords: ['favicon generator', 'png to ico', 'apple touch icon generator', 'website icon maker', 'pwa icon generator'],
    relatedTools: ['svg-to-png', 'image-resizer', 'image-color-palette', 'json-formatter'],
    isPopular: false,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Upload a logo or design a text monogram',
        description: 'Upload a square PNG/SVG/JPG image, or switch to the Text Badge maker to style custom initials and colors.',
      },
      {
        title: 'Preview across browser tabs & mobile',
        description: 'Inspect how your icon looks at 16×16, 32×32, 48×48, 180×180 (iOS), 192×192, and 512×512 pixels.',
      },
      {
        title: 'Download ZIP bundle & copy HTML tags',
        description: 'Download all icon files (including favicon.ico and site.webmanifest) in one ZIP or individually.',
      },
    ],
    benefits: [
      {
        title: 'Complete multi-platform asset pack',
        description: 'Generates favicon.ico, 16×16, 32×32, apple-touch-icon.png (180×180), and Android Chrome 192/512 icons at once.',
      },
      {
        title: 'Built-in monogram badge designer',
        description: 'Launching a project without a logo? Create a clean 1–2 letter monogram icon with custom radius and colors in seconds.',
      },
      {
        title: 'Ready-to-paste HTML & Webmanifest',
        description: 'Includes the exact <link rel="icon"> tags and site.webmanifest JSON required by modern browsers.',
      },
      {
        title: 'Real binary .ico generation',
        description: 'Packs a valid ICO binary header directly in your browser without external server dependencies.',
      },
    ],
    seoContent: {
      heading: 'Why modern web apps need multiple favicon sizes and a webmanifest',
      paragraphs: [
        'A single 16×16 favicon.ico file is no longer sufficient for modern devices. Desktop browsers on Retina displays look for 32×32 PNGs, iOS Safari requires a 180×180 apple-touch-icon.png when users pin a site to their home screen, and Android Progressive Web Apps (PWAs) require 192×192 and 512×512 icons referenced inside a site.webmanifest file.',
        'ToolNova automates this entire workflow in your browser: upload a single source image (or craft a quick typographic badge) and download a single ZIP archive containing every required icon file and HTML snippet.',
      ],
    },
    faqs: [
      {
        question: 'What files are included in the downloaded Favicon ZIP package?',
        answer: 'The ZIP includes favicon.ico, favicon-16x16.png, favicon-32x32.png, favicon-48x48.png, apple-touch-icon.png (180x180), android-chrome-192x192.png, android-chrome-512x512.png, and site.webmanifest.',
      },
      {
        question: 'What image size is best to upload?',
        answer: 'A square image measuring at least 512×512 pixels (PNG or SVG) produces the sharpest results across all icon sizes.',
      },
      {
        question: 'Can I generate a favicon if I do not have a logo image yet?',
        answer: 'Yes! Use the built-in "Text / Monogram" mode to type 1–3 characters, pick your brand colors and corner rounding, and export the full icon suite.',
      },
    ],
  },
  // 18. JSON Formatter
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    h1Title: 'JSON Formatter, Validator & Minifier',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Validate, pretty-print, sort keys, and minify JSON payloads with detailed syntax error diagnostics.',
    metaTitle: 'JSON Formatter & Validator — Beautify & Minify | ToolNova',
    metaDescription:
      'Format, validate, sort keys, and minify JSON online in your browser. Pinpoint syntax errors and inspect payload metrics with 100% local privacy.',
    icon: 'Braces',
    route: '/tools/json-formatter',
    keywords: ['json formatter', 'json validator', 'json beautifier', 'minify json', 'pretty print json online'],
    relatedTools: ['url-encoder-decoder', 'utm-builder', 'favicon-generator', 'qr-code-generator'],
    isPopular: false,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Paste or upload JSON data',
        description: 'Paste raw or minified JSON into the editor, upload a .json file, or load our sample API payload.',
      },
      {
        title: 'Choose formatting & key sorting',
        description: 'Select 2 spaces, 4 spaces, or tabs, optionally sort object keys alphabetically, or minify to a single line.',
      },
      {
        title: 'Inspect, copy, or download',
        description: 'Verify syntax validity, view structural statistics (depth, key count, byte size), and copy or save your .json file.',
      },
    ],
    benefits: [
      {
        title: 'Safe for production API payloads',
        description: 'Debug sensitive webhook payloads and configuration files locally without sending data to external logging servers.',
      },
      {
        title: 'Alphabetical key sorting',
        description: 'Recursively sort object keys A–Z to make comparing two JSON configuration files effortless in git diffs.',
      },
      {
        title: 'Structural telemetry metrics',
        description: 'Instantly view total object keys, array items, maximum nesting depth, and byte size savings.',
      },
      {
        title: 'Pinpoint syntax error feedback',
        description: 'Clearly surfaces parser error messages when a trailing comma or missing quote breaks your JSON.',
      },
    ],
    seoContent: {
      heading: 'Formatting and validating JSON safely in client-side environments',
      paragraphs: [
        'Developers spend hours every week inspecting minified API responses, debugging webhook payloads, and cleaning up configuration files. Pasting customer records or internal API tokens into server-backed JSON formatters can violate company security policies.',
        'ToolNova’s JSON Formatter runs strictly inside your local browser JavaScript engine. In addition to standard 2-space and 4-space pretty-printing and one-line minification, it includes recursive alphabetical key sorting so you can normalize JSON objects before running diffs.',
      ],
    },
    faqs: [
      {
        question: 'Is my JSON data sent to any server when validating?',
        answer: 'No. Parsing and formatting use your browser’s native JSON engine locally in memory.',
      },
      {
        question: 'What does "Sort Keys Alphabetically" do?',
        answer: 'It recursively orders all object keys from A to Z at every nesting level while keeping array element order intact.',
      },
      {
        question: 'Can I upload a .json file from my computer?',
        answer: 'Yes. You can either paste text directly or upload a .json file and download the formatted output.',
      },
    ],
  },
  // 19. URL Encoder/Decoder
  {
    slug: 'url-encoder-decoder',
    name: 'URL Encoder/Decoder',
    h1Title: 'URL Encoder, Decoder & Query Parser',
    category: 'Developer Tools',
    categorySlug: 'developer-tools',
    description: 'Percent-encode or decode URLs and inspect query string parameters in an interactive breakdown table.',
    metaTitle: 'URL Encoder & Decoder — Percent Encoding & Parser | ToolNova',
    metaDescription:
      'Encode and decode URLs online using RFC 3986 percent-encoding. Compare encodeURIComponent vs encodeURI and inspect query string parameters.',
    icon: 'Link2',
    route: '/tools/url-encoder-decoder',
    keywords: ['url encoder', 'url decoder', 'percent encoding online', 'encodeuricomponent', 'query string parser'],
    relatedTools: ['utm-builder', 'json-formatter', 'qr-code-generator', 'favicon-generator'],
    isPopular: false,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Enter a URL or text string',
        description: 'Paste any encoded or unencoded URL, query parameter value, or load a sample complex link.',
      },
      {
        title: 'Select Component vs Full URI mode',
        description: 'Switch between Component mode (encodes :, /, ?, &) and Full URI mode (preserves valid URL structure).',
      },
      {
        title: 'Copy output & inspect parsed query params',
        description: 'Copy the encoded/decoded result and view every query parameter neatly parsed into a key-value table.',
      },
    ],
    benefits: [
      {
        title: 'Component vs Full URI clarity',
        description: 'Eliminates confusion between encodeURIComponent (for query values) and encodeURI (for complete links).',
      },
      {
        title: 'Automatic query parameter breakdown',
        description: 'When you paste a full URL, the tool automatically extracts protocol, hostname, path, and all query key-value pairs.',
      },
      {
        title: 'RFC 3986 strict encoding option',
        description: 'Properly percent-encodes reserved characters including !, \', (, ), and * for strict OAuth and signature compliance.',
      },
      {
        title: 'Instant bidirectional conversion',
        description: 'Encode, decode, or swap input and output with a single click.',
      },
    ],
    seoContent: {
      heading: 'Understanding URL percent-encoding and query string parsing',
      paragraphs: [
        'URLs can only be transmitted over the internet using the ASCII character-set. Characters outside this set—as well as reserved delimiters like ?, &, =, +, and spaces when used inside parameter values—must be converted into a valid percent-encoded format (such as %20 for a space or %26 for an ampersand).',
        'ToolNova’s URL Encoder/Decoder gives you explicit control over whether you are encoding a parameter value (RFC 3986 component mode) or a complete web address, while simultaneously parsing any query string into a readable table for fast debugging.',
      ],
    },
    faqs: [
      {
        question: 'What is the difference between Component mode and Full URL mode?',
        answer: 'Component mode (encodeURIComponent) encodes characters like :, /, ?, and & so a value can be safely placed inside a query parameter. Full URL mode (encodeURI) leaves those structural characters intact so the link remains a working web address.',
      },
      {
        question: 'Why are spaces sometimes encoded as + and sometimes as %20?',
        answer: 'Standard RFC 3986 URI encoding uses %20 for spaces, whereas application/x-www-form-urlencoded query strings often represent spaces with +. Our decoder handles both seamlessly.',
      },
      {
        question: 'Does this tool log the URLs I paste?',
        answer: 'No. All string encoding, decoding, and URL parsing happen locally in your browser.',
      },
    ],
  },
  // 20. UTM Builder
  {
    slug: 'utm-builder',
    name: 'UTM Builder',
    h1Title: 'UTM Campaign URL Builder',
    category: 'Marketing Tools',
    categorySlug: 'marketing-tools',
    secondaryCategories: ['Developer Tools'],
    description: 'Build clean, standardized UTM tracking URLs for Google Analytics, ad campaigns, and newsletters.',
    metaTitle: 'UTM Builder — Campaign Tracking Link Generator | ToolNova',
    metaDescription:
      'Generate clean UTM tracking links for Google Analytics 4 and marketing campaigns. Apply channel presets, enforce lowercase rules, and export QR codes.',
    icon: 'Megaphone',
    route: '/tools/utm-builder',
    keywords: ['utm builder', 'campaign url builder', 'utm link generator', 'google analytics utm', 'marketing attribution link'],
    relatedTools: ['qr-code-generator', 'url-encoder-decoder', 'json-formatter', 'image-resizer'],
    isPopular: false,
    processingType: 'client-side',
    howItWorks: [
      {
        title: 'Enter destination URL & channel preset',
        description: 'Input your landing page URL and optionally pick a quick preset (Google CPC, Newsletter, Paid Social, etc.).',
      },
      {
        title: 'Fill in campaign parameters',
        description: 'Specify utm_source, utm_medium, utm_campaign, and optional utm_term, utm_content, and utm_id fields.',
      },
      {
        title: 'Copy tracking link or download QR code',
        description: 'Copy your properly encoded campaign URL and optionally generate a matching QR code on the spot.',
      },
    ],
    benefits: [
      {
        title: 'Automatic lowercase & hyphen normalization',
        description: 'Prevents fragmented analytics reporting caused by inconsistent capitalization (e.g., "Email" vs "email").',
      },
      {
        title: 'Preserves existing URL query parameters',
        description: 'Safely appends UTM parameters alongside existing query strings and hash fragments (#section).',
      },
      {
        title: 'One-click channel presets',
        description: 'Populate best-practice source/medium pairs for Google Ads, Meta Social, LinkedIn, and Email newsletters.',
      },
      {
        title: 'Instant campaign QR code included',
        description: 'Automatically previews a downloadable QR code for your UTM link for print mailers and event booths.',
      },
    ],
    seoContent: {
      heading: 'Best practices for consistent UTM campaign tracking',
      paragraphs: [
        'Urchin Tracking Module (UTM) parameters are the universal standard for measuring marketing attribution across Google Analytics 4 (GA4), PostHog, Plausible, and custom BI pipelines. However, analytics data quickly becomes messy when team members mix uppercase and lowercase tags or use spaces instead of underscores/hyphens.',
        'ToolNova’s UTM Builder validates your destination URL, properly encodes all parameter values, optionally enforces lowercase formatting, and generates both the shareable tracking link and a ready-to-print QR code in real time.',
      ],
    },
    faqs: [
      {
        question: 'Which UTM parameters are required?',
        answer: 'For accurate attribution in analytics platforms, you should always include Website URL, Campaign Source (utm_source), Campaign Medium (utm_medium), and Campaign Name (utm_campaign).',
      },
      {
        question: 'Why should I keep UTM parameters lowercase?',
        answer: 'Analytics tools are case-sensitive. "utm_source=LinkedIn" and "utm_source=linkedin" will show up as two separate rows in your reports unless normalized to lowercase.',
      },
      {
        question: 'What happens if my destination URL already has a ?query=value parameter?',
        answer: 'Our builder parses the URL using the standard URL API and appends the UTM parameters with & while preserving your existing query parameters and #hash anchors.',
      },
    ],
  },
];

export const HOMEPAGE_FAQS: ToolFAQ[] = [
  {
    question: 'Are ToolNova tools free to use without creating an account?',
    answer:
      'Yes. All 20 tools on ToolNova are completely free to use with no account registration, no email gates, and no watermarks on your downloaded files.',
  },
  {
    question: 'How does ToolNova protect the privacy of my files?',
    answer:
      'Wherever technically possible—including all image converters, compressors, resizers, EXIF removers, PDF mergers/splitters, QR generators, JSON formatters, and URL builders—processing happens directly inside your web browser using HTML5 Canvas, WebAssembly, and local JavaScript APIs. Your files stay in your device memory rather than being uploaded to a remote server.',
  },
  {
    question: 'Do the tools work on mobile phones and tablets?',
    answer:
      'Yes. Every tool interface is built mobile-first and works seamlessly on iOS Safari, Android Chrome, iPadOS, and desktop browsers across Windows, macOS, and Linux.',
  },
  {
    question: 'Are there watermarks added to converted images or PDFs?',
    answer:
      'Never. Every converted image, compressed graphic, merged PDF, and generated QR code is delivered cleanly with zero watermarks or branding stamps.',
  },
  {
    question: 'Why do some tools like OCR show a modular service layer?',
    answer:
      'We believe in strict technical honesty. Tools that can run reliably in any browser (like image, PDF, EXIF, and developer utilities) run 100% locally right now. For advanced Optical Character Recognition (OCR), the tool provides real client-side image readiness diagnostics, supports native browser TextDetector APIs where enabled, and isolates an extensible service interface so external OCR engines can be connected cleanly without ever faking results.',
  },
];

export function getToolBySlug(slug: string): ToolConfig | undefined {
  return TOOLS_CONFIG.find((tool) => tool.slug === slug);
}

export function getPopularTools(): ToolConfig[] {
  return TOOLS_CONFIG.filter((tool) => tool.isPopular);
}

export function getToolsByCategory(category: ToolCategory): ToolConfig[] {
  return TOOLS_CONFIG.filter(
    (tool) => tool.category === category || tool.secondaryCategories?.includes(category)
  );
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return TOOL_CATEGORIES.find((cat) => cat.slug === slug);
}

export function getRelatedToolsFor(tool: ToolConfig): ToolConfig[] {
  const explicit = tool.relatedTools
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is ToolConfig => Boolean(t));

  if (explicit.length >= 4) {
    return explicit.slice(0, 4);
  }

  const sameCategory = TOOLS_CONFIG.filter(
    (t) => t.slug !== tool.slug && t.category === tool.category && !explicit.some((e) => e.slug === t.slug)
  );

  return [...explicit, ...sameCategory].slice(0, 4);
}

export function searchTools(query: string, categoryFilter?: ToolCategory | 'All'): ToolConfig[] {
  const normalizedQuery = query.trim().toLowerCase();

  return TOOLS_CONFIG.filter((tool) => {
    const matchesCategory =
      !categoryFilter ||
      categoryFilter === 'All' ||
      tool.category === categoryFilter ||
      tool.secondaryCategories?.includes(categoryFilter);

    if (!matchesCategory) return false;
    if (!normalizedQuery) return true;

    const inName = tool.name.toLowerCase().includes(normalizedQuery);
    const inH1 = tool.h1Title.toLowerCase().includes(normalizedQuery);
    const inCategory = tool.category.toLowerCase().includes(normalizedQuery);
    const inDescription = tool.description.toLowerCase().includes(normalizedQuery);
    const inKeywords = tool.keywords.some((kw) => kw.toLowerCase().includes(normalizedQuery));

    return inName || inH1 || inCategory || inDescription || inKeywords;
  });
}
