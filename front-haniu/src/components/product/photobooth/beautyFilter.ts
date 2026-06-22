/**
 * Instagram-style Beauty Filter for Photobooth
 * 
 * Uses Canvas 2D filter API (hardware-accelerated) for:
 * 1. Skin smoothing (selective blur blend)
 * 2. Sharpening (unsharp mask via overlay blend)
 * 3. Color grading (brightness, contrast, saturation, warmth)
 * 4. Subtle vignette
 */

interface BeautyOptions {
  /** Skin smoothing intensity 0-1 (default 0.4) */
  smoothing?: number;
  /** Sharpening intensity 0-1 (default 0.25) */
  sharpening?: number;
  /** Brightness multiplier (default 1.06) */
  brightness?: number;
  /** Contrast multiplier (default 1.08) */
  contrast?: number;
  /** Saturation multiplier (default 1.15) */
  saturation?: number;
  /** Warmth shift 0-1 (default 0.04) */
  warmth?: number;
  /** Vignette intensity 0-1 (default 0.12) */
  vignette?: number;
}

const DEFAULT_OPTIONS: Required<BeautyOptions> = {
  smoothing: 0.4,
  sharpening: 0.25,
  brightness: 1.06,
  contrast: 1.08,
  saturation: 1.15,
  warmth: 0.04,
  vignette: 0.12,
};

// ─── Main Beauty Filter Pipeline ────────────────────────────────
export async function applyBeautyFilter(
  imageData: string | Blob,
  options?: BeautyOptions
): Promise<{ blob: Blob; dataUrl: string }> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Load image
  const img = await loadImage(imageData);
  const w = img.width;
  const h = img.height;

  // ─── Step 1: Skin Smoothing (edge-preserving blur blend) ────
  const smoothCanvas = document.createElement('canvas');
  smoothCanvas.width = w;
  smoothCanvas.height = h;
  const smoothCtx = smoothCanvas.getContext('2d')!;

  // Draw original
  smoothCtx.drawImage(img, 0, 0, w, h);

  if (opts.smoothing > 0) {
    // Create blurred version using canvas filter
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = w;
    blurCanvas.height = h;
    const blurCtx = blurCanvas.getContext('2d')!;
    
    const blurRadius = Math.max(1, Math.round(Math.min(w, h) * 0.006 * opts.smoothing));
    blurCtx.filter = `blur(${blurRadius}px)`;
    blurCtx.drawImage(img, 0, 0, w, h);
    blurCtx.filter = 'none';

    // Edge-preserving blend: mix blurred into original selectively
    // Only smooth where color difference is small (skin areas)
    const origData = smoothCtx.getImageData(0, 0, w, h);
    const blurData = blurCtx.getImageData(0, 0, w, h);
    const orig = origData.data;
    const blur = blurData.data;
    const intensity = opts.smoothing;
    const threshold = 35;

    for (let i = 0; i < orig.length; i += 4) {
      const dr = orig[i] - blur[i];
      const dg = orig[i + 1] - blur[i + 1];
      const db = orig[i + 2] - blur[i + 2];
      const diff = Math.abs(dr) + Math.abs(dg) + Math.abs(db);

      // Smooth blend factor: fully smoothed in flat areas, original at edges
      const blend = Math.max(0, 1 - diff / threshold) * intensity;

      orig[i] = orig[i] + (blur[i] - orig[i]) * blend;
      orig[i + 1] = orig[i + 1] + (blur[i + 1] - orig[i + 1]) * blend;
      orig[i + 2] = orig[i + 2] + (blur[i + 2] - orig[i + 2]) * blend;
      // alpha unchanged
    }

    smoothCtx.putImageData(origData, 0, 0);
  }

  // ─── Step 2: Sharpening (unsharp mask) ─────────────────────
  if (opts.sharpening > 0) {
    const sharpBlurCanvas = document.createElement('canvas');
    sharpBlurCanvas.width = w;
    sharpBlurCanvas.height = h;
    const sharpBlurCtx = sharpBlurCanvas.getContext('2d')!;
    
    const sharpRadius = Math.max(0.5, Math.min(w, h) * 0.002);
    sharpBlurCtx.filter = `blur(${sharpRadius}px)`;
    sharpBlurCtx.drawImage(smoothCanvas, 0, 0, w, h);
    sharpBlurCtx.filter = 'none';

    const currentData = smoothCtx.getImageData(0, 0, w, h);
    const blurredData = sharpBlurCtx.getImageData(0, 0, w, h);
    const cur = currentData.data;
    const blr = blurredData.data;
    const amount = opts.sharpening * 0.5;

    for (let i = 0; i < cur.length; i += 4) {
      cur[i] = Math.min(255, Math.max(0, cur[i] + (cur[i] - blr[i]) * amount));
      cur[i + 1] = Math.min(255, Math.max(0, cur[i + 1] + (cur[i + 1] - blr[i + 1]) * amount));
      cur[i + 2] = Math.min(255, Math.max(0, cur[i + 2] + (cur[i + 2] - blr[i + 2]) * amount));
    }

    smoothCtx.putImageData(currentData, 0, 0);
  }

  // ─── Step 3: Color Grading (brightness, contrast, saturation) ─
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = w;
  colorCanvas.height = h;
  const colorCtx = colorCanvas.getContext('2d')!;

  // Use CSS filter for brightness/contrast/saturation (hardware-accelerated)
  colorCtx.filter = `brightness(${opts.brightness}) contrast(${opts.contrast}) saturate(${opts.saturation})`;
  colorCtx.drawImage(smoothCanvas, 0, 0, w, h);
  colorCtx.filter = 'none';

  // Warmth: subtle color shift
  if (opts.warmth > 0) {
    const warmData = colorCtx.getImageData(0, 0, w, h);
    const d = warmData.data;
    const warmAmount = opts.warmth;
    for (let i = 0; i < d.length; i += 4) {
      d[i] = Math.min(255, d[i] + warmAmount * 12);     // Red up
      d[i + 1] = Math.min(255, d[i + 1] + warmAmount * 4); // Green slight up
      d[i + 2] = Math.max(0, d[i + 2] - warmAmount * 8);   // Blue down
    }
    colorCtx.putImageData(warmData, 0, 0);
  }

  // ─── Step 4: Soft S-Curve (Instagram tone) ─────────────────
  const toneData = colorCtx.getImageData(0, 0, w, h);
  const td = toneData.data;

  // Pre-compute lookup table for S-curve
  const lut = new Uint8Array(256);
  for (let i = 0; i < 256; i++) {
    const x = i / 255;
    // Gentle S-curve: lift shadows, compress highlights
    const curved = x < 0.5
      ? 0.5 * Math.pow(2 * x, 1.12)
      : 1 - 0.5 * Math.pow(2 * (1 - x), 1.12);
    lut[i] = Math.min(255, Math.max(0, Math.round(curved * 255)));
  }

  for (let i = 0; i < td.length; i += 4) {
    td[i] = lut[td[i]];
    td[i + 1] = lut[td[i + 1]];
    td[i + 2] = lut[td[i + 2]];
  }
  colorCtx.putImageData(toneData, 0, 0);

  // ─── Step 5: Vignette ──────────────────────────────────────
  if (opts.vignette > 0) {
    const gradient = colorCtx.createRadialGradient(
      w / 2, h / 2, Math.min(w, h) * 0.35,
      w / 2, h / 2, Math.max(w, h) * 0.75
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, `rgba(0,0,0,${opts.vignette})`);
    colorCtx.fillStyle = gradient;
    colorCtx.fillRect(0, 0, w, h);
  }

  // ─── Output ────────────────────────────────────────────────
  const dataUrl = colorCanvas.toDataURL('image/jpeg', 0.95);
  const blob = await new Promise<Blob>((resolve, reject) => {
    colorCanvas.toBlob(b => {
      if (b) resolve(b);
      else reject(new Error('Beauty filter: toBlob failed'));
    }, 'image/jpeg', 0.95);
  });

  return { blob, dataUrl };
}

function loadImage(src: string | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Cleanup object URL if we created one
      if (src instanceof Blob) {
        URL.revokeObjectURL(img.src);
      }
      resolve(img);
    };
    img.onerror = () => {
      if (src instanceof Blob) {
        URL.revokeObjectURL(img.src);
      }
      reject(new Error('Failed to load image for beauty filter'));
    };
    if (src instanceof Blob) {
      img.src = URL.createObjectURL(src);
    } else {
      img.src = src;
    }
  });
}
