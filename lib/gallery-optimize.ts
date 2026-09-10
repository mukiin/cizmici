import sharp from "sharp";

const MAX_EDGE = 1280;
const WEBP_QUALITY = 68;

/**
 * Kompresuje upload u mali WebP (bez EXIF), max 1280px na dužoj strani.
 */
export async function optimizeGalleryImage(input: Buffer) {
  const image = sharp(input, { failOn: "none" }).rotate();
  const meta = await image.metadata();

  const optimized = await image
    .resize({
      width: MAX_EDGE,
      height: MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  return {
    buffer: optimized.data,
    width: optimized.info.width,
    height: optimized.info.height,
    bytes: optimized.data.byteLength,
    mimeType: "image/webp" as const,
    sourceFormat: meta.format,
  };
}
