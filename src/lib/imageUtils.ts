/**
 * Resizes and compresses an image file using canvas before upload.
 * Returns a Blob at reduced dimensions and JPEG quality.
 */
export async function compressImage(
  file: File,
  maxWidth = 1280,
  quality = 0.82,
): Promise<Blob> {
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // For small images, keep as-is
  if (file.size < 150_000) {
    return file;
  }

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, maxWidth / bitmap.width);
  const targetWidth = Math.round(bitmap.width * scale);
  const targetHeight = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close?.();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
  bitmap.close?.();

  const blob = await new Promise<Blob>((resolve) => {
    canvas.toBlob(
      (b) => resolve(b ?? file),
      'image/jpeg',
      quality,
    );
  });

  return blob;
}
