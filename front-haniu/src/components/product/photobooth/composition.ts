import { CapturedPhoto, PhotoboothConfig, Sticker } from './types';

export const generateComposition = async (
  photos: CapturedPhoto[],
  config: PhotoboothConfig,
  stickers: Sticker[] = []
): Promise<Blob> => {
  const { template } = config;
  const canvas = document.createElement('canvas');
  canvas.width = template.canvasWidth;
  canvas.height = template.canvasHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  console.log('generateComposition CONFIG:', {
    frameColor: config.frameColor,
    backgroundImage: config.backgroundImage ? 'Length: ' + config.backgroundImage.length : 'none',
    borderSize: config.borderSize,
    templateBackground: template.background
  });

  // 1. Draw Background
  ctx.fillStyle = config.frameColor || template.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (config.backgroundImage) {
    const bgImg = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(new Image());
      img.src = config.backgroundImage!;
    });
    if (bgImg.complete && bgImg.naturalWidth > 0) {
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    }
  }

  // 2. Load and Draw Photos into slots
  const photoImages = await Promise.all(
    photos.map(p => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => {
          console.error(`Failed to load photo: ${p.url}`);
          resolve(new Image());
        };
        img.src = p.url;
      });
    })
  );

  const inset = config.borderSize !== undefined ? config.borderSize : 15;
  const minX = template.slots.length > 0 ? Math.min(...template.slots.map(s => s.x)) : 40;
  const offset = inset < 15 ? (inset - 15) * (minX / 15) : (inset - 15) * 2.67;
  
  template.slots.forEach((slot, index) => {
    if (photoImages[index]) {
      const img = photoImages[index];
      // Adjust slots dynamically based on borderSize slider
      const slotX = Math.max(0, slot.x + offset);
      const slotY = Math.max(0, slot.y + offset);
      const slotW = slot.width - offset * 2;
      const slotH = slot.height - offset * 2;

      ctx.save();
      // Create clipping region for the slot
      ctx.beginPath();
      ctx.rect(slotX, slotY, slotW, slotH);
      ctx.clip();

      // Cover logic
      const scale = Math.max(slotW / img.width, slotH / img.height);
      const x = slotX + (slotW - img.width * scale) / 2;
      const y = slotY + (slotH - img.height * scale) / 2;

      // Apply Filter if any
      if (config.filter !== 'none') {
        ctx.filter = config.filter;
      }

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      ctx.restore();
    }
  });

  const ICON_SVGS: Record<string, string> = {
    heart: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    sparkles: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    gem: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></svg>`,
    gift: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8V22"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 4.8 0 0 1 12 8a4.8 4.8 0 0 1 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>`,
    party: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2v4M22 6h-4M6 6H2M18 16.28A6 6 0 0 1 12 22a6 6 0 0 1-6-5.72V10h12Z"/><path d="M12 10a4 4 0 0 0-4 4v2h8v-2a4 4 0 0 0-4-4Z"/></svg>`,
    cake: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a855f7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16h18"/><path d="M12 2v3"/><path d="M8 2v3"/><path d="M16 2v3"/></svg>`,
    camera: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    leaf: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.58 0 8a7 7 0 0 1-8 10Z"/><path d="M9 22c0-3 1.5-6 3.5-8"/></svg>`
  };

  const isEmoji = (url: string) => !url.startsWith('http') && !url.startsWith('data:') && !url.startsWith('/') && !url.startsWith('icon:');

  for (let i = 0; i < stickers.length; i++) {
    const s = stickers[i];
    
    ctx.save();
    const posX = (s.x / 100) * canvas.width;
    const posY = (s.y / 100) * canvas.height;
    ctx.translate(posX, posY);
    ctx.rotate(s.rotation);

    if (s.url.startsWith('icon:')) {
      const iconKey = s.url.replace('icon:', '');
      const svgString = ICON_SVGS[iconKey];
      if (svgString) {
        let finalSvg = svgString;
        if (s.color) {
          finalSvg = finalSvg.replace(/stroke="#[0-9a-fA-F]{6}"/g, `stroke="${s.color}"`);
          finalSvg = finalSvg.replace(/fill="#[0-9a-fA-F]{6}"/g, `fill="${s.color}"`);
        }
        const svgUrl = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(finalSvg)));
        const img = await new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(new Image());
          img.src = svgUrl;
        });

        if (img.complete && img.naturalWidth > 0) {
          const targetWidth = canvas.width * 0.15 * s.scale;
          const intrinsicScale = targetWidth / img.width;
          ctx.scale(intrinsicScale, intrinsicScale);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
        }
      }
    } else if (isEmoji(s.url)) {
      // Draw Emoji as Text
      const fontSize = canvas.width * 0.12 * s.scale;
      ctx.font = `${fontSize}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 15;
      ctx.fillText(s.url, 0, 0);
    } else {
      // Draw Image Sticker
      const img = await new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(new Image());
        img.src = s.url;
      });

      if (img.complete && img.naturalWidth > 0) {
        const targetWidth = canvas.width * 0.18 * s.scale;
        const intrinsicScale = targetWidth / img.width;
        ctx.scale(intrinsicScale, intrinsicScale);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
      }
    }
    ctx.restore();
  }

  // 4. Draw Premium Branding (Adjusted to Haniu with drag-drop coordinates and fonts)
  ctx.save();
  const bottomY = canvas.height - 80;

  const resolveFont = (fontKey?: string) => {
    switch (fontKey) {
      case 'dancing-script': return '"Dancing Script", cursive';
      case 'patrick-hand': return '"Patrick Hand", cursive';
      case 'mali': return '"Mali", cursive';
      case 'cormorant-garamond': return '"Cormorant Garamond", serif';
      case 'be-vietnam-pro': return '"Be Vietnam Pro", sans-serif';
      default: return '"Be Vietnam Pro", sans-serif';
    }
  };
  
  // Subtle Divider (Draw only if custom positions aren't overriding it entirely)
  const isCustomized = config.userNameX !== undefined || config.userNameY !== undefined || config.dateX !== undefined || config.dateY !== undefined;
  if (!isCustomized) {
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.moveTo(100, bottomY - 20);
    ctx.lineTo(canvas.width - 100, bottomY - 20);
    ctx.stroke();
  }

  // Branding Text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // User Name / Main Brand
  if (config.userName !== '') {
    const uFont = resolveFont(config.userNameFont || 'cormorant-garamond');
    ctx.fillStyle = config.userNameColor || '#e11d48';
    ctx.font = `bold ${config.userNameSize || 36}px ${uFont}`;
    
    const userX = config.userNameX !== undefined ? (config.userNameX / 100) * canvas.width : canvas.width / 2;
    const userY = config.userNameY !== undefined ? (config.userNameY / 100) * canvas.height : bottomY + 10;
    
    const brandTitle = config.userName || 'HANIU STUDIO';
    ctx.fillText(brandTitle, userX, userY);
  }

  // Date / Tagline
  if (config.showDate) {
    const dFont = resolveFont(config.dateFont || 'be-vietnam-pro');
    ctx.fillStyle = config.dateColor || '#64748b';
    ctx.font = `500 ${config.dateSize || 18}px ${dFont}`;
    
    const dX = config.dateX !== undefined ? (config.dateX / 100) * canvas.width : canvas.width / 2;
    const dY = config.dateY !== undefined ? (config.dateY / 100) * canvas.height : bottomY + 50;
    
    const tagline = new Date().toLocaleDateString('vi-VN');
    ctx.fillText(tagline, dX, dY);
  }
  
  ctx.restore();

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Canvas toBlob failed'));
      }
    }, 'image/png');
  });
};
