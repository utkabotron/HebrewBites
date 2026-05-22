import { fromPath } from 'pdf2pic';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname } from 'node:path';

interface RenderArgs {
  pdfPath: string;
  pageNumber: number;
  outPath: string;
  zoomLevel: number;
  maxImageSize: number;
}

/**
 * Render one PDF page → PNG.
 * - `zoomLevel=2.0` matches vibe-kp's PDF_ZOOM_LEVEL (~144 DPI).
 * - Caps the longer side at `maxImageSize` to match vibe-kp's PDF_MAX_IMAGE_SIZE behavior.
 *
 * Returns the absolute path to the written PNG. If the PNG already exists and is non-empty,
 * the render is skipped (cheap caching during iteration on prompts/schemas).
 */
export async function renderPdfPage(args: RenderArgs): Promise<string> {
  const { pdfPath, pageNumber, outPath, zoomLevel, maxImageSize } = args;

  if (!existsSync(pdfPath)) {
    throw new Error(`PDF not found: ${pdfPath}`);
  }

  if (existsSync(outPath) && statSync(outPath).size > 0) {
    return outPath;
  }

  mkdirSync(dirname(outPath), { recursive: true });

  // pdf2pic uses DPI; convert zoom multiplier to DPI assuming 72 DPI base.
  const density = Math.round(72 * zoomLevel);

  // Strip the .png extension — pdf2pic appends it from `format`.
  const outDir = dirname(outPath);
  const fileBase = outPath.replace(/\.png$/i, '').split('/').pop()!;

  const convert = fromPath(pdfPath, {
    density,
    saveFilename: fileBase,
    savePath: outDir,
    format: 'png',
    width: maxImageSize,
    height: maxImageSize,
    preserveAspectRatio: true,
  });

  const result = await convert(pageNumber, { responseType: 'image' });

  if (!result || !result.path) {
    throw new Error(`pdf2pic returned no path for ${pdfPath} page ${pageNumber}`);
  }

  // pdf2pic may write to a slightly different filename (suffix .1.png, etc.) —
  // normalize to the requested outPath if needed.
  return result.path;
}
