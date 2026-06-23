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

  // Helper to resolve font families
  const resolveFont = (fontKey?: string) => {
    switch (fontKey) {
      case 'dancing-script': return '"Dancing Script", cursive';
      case 'patrick-hand': return '"Patrick Hand", cursive';
      case 'mali': return '"Mali", cursive';
      case 'cormorant-garamond': return '"Cormorant Garamond", serif';
      case 'be-vietnam-pro': return '"Be Vietnam Pro", sans-serif';
      default: return fontKey || '"Be Vietnam Pro", sans-serif';
    }
  };

  // 1. Draw Background
  const isImageUrl = (src?: string) => src && (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:'));
  
  let bgFillColor = template.background || '#ffffff';
  if (config.frameColor && config.frameColor !== '#ffffff') {
    bgFillColor = config.frameColor;
  }
  
  if ((template as any).backgroundType === 'gradient' && (template as any).backgroundGradient && (!config.frameColor || config.frameColor === '#ffffff')) {
    const grad = (template as any).backgroundGradient;
    const angleRad = ((grad.angle || 45) * Math.PI) / 180;
    
    // Calculate start and end coordinates of the gradient line inside the canvas
    const x1 = canvas.width / 2 - Math.cos(angleRad) * (canvas.width / 2);
    const y1 = canvas.height / 2 - Math.sin(angleRad) * (canvas.height / 2);
    const x2 = canvas.width / 2 + Math.cos(angleRad) * (canvas.width / 2);
    const y2 = canvas.height / 2 + Math.sin(angleRad) * (canvas.height / 2);
    
    const canvasGrad = ctx.createLinearGradient(x1, y1, x2, y2);
    canvasGrad.addColorStop(0, grad.color1 || '#fda4af');
    canvasGrad.addColorStop(1, grad.color2 || '#f43f5e');
    ctx.fillStyle = canvasGrad;
  } else {
    ctx.fillStyle = bgFillColor;
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const bgSource = config.backgroundImage || (isImageUrl(template.background) ? template.background : null);
  if (bgSource) {
    const bgImg = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(new Image());
      img.src = bgSource;
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

  // 3. Draw Design Layers or default slots
  if (template.layers && template.layers.length > 0) {
    const frameLayers = template.layers
      .filter((l: any) => l.type === 'frame')
      .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    // Custom template drawing
    for (let layer of template.layers) {
      if (layer.visible === false) continue;
      
      const posX = (layer.x / 100) * canvas.width;
      const posY = (layer.y / 100) * canvas.height;
      const rectW = (layer.width / 100) * canvas.width;
      const rectH = (layer.height / 100) * canvas.height;

      if (layer.type === 'frame') {
        const frameIndex = frameLayers.indexOf(layer);
        if (frameIndex !== -1 && photoImages[frameIndex]) {
          const img = photoImages[frameIndex];
          ctx.save();
          
          if (layer.rotation) {
            ctx.translate(posX + rectW / 2, posY + rectH / 2);
            ctx.rotate((layer.rotation * Math.PI) / 180);
            ctx.translate(-(posX + rectW / 2), -(posY + rectH / 2));
          }
          
          ctx.globalAlpha = (layer.opacity ?? 100) / 100;
          
          // Save the state with rotation/alpha but without clipping
          ctx.save();
          
          ctx.beginPath();
          const scaleFactor = canvas.width / (template.canvasWidth * 0.25 || 300);
          const radius = (layer.cornerRadius ?? 8) * scaleFactor;
          const frameShape = layer.frameShape || 'rect';

          if (frameShape === 'circle') {
            const radius = Math.min(rectW, rectH) / 2;
            ctx.roundRect(posX, posY, rectW, rectH, radius);
            ctx.clip();
          } else if (frameShape === 'triangle') {
            ctx.moveTo(posX + rectW / 2, posY);
            ctx.lineTo(posX, posY + rectH);
            ctx.lineTo(posX + rectW, posY + rectH);
            ctx.closePath();
            ctx.clip();
          } else if (frameShape === 'heart') {
            // Polygon points matching CSS heart clip-path exactly
            const pts = [
              [50, 24], [62, 10], [78, 10], [90, 20], [94, 40], [82, 65],
              [50, 95], [18, 65], [6, 40], [10, 20], [26, 10], [38, 24]
            ];
            ctx.moveTo(posX + (pts[0][0] / 100) * rectW, posY + (pts[0][1] / 100) * rectH);
            for (let k = 1; k < pts.length; k++) {
              ctx.lineTo(posX + (pts[k][0] / 100) * rectW, posY + (pts[k][1] / 100) * rectH);
            }
            ctx.closePath();
            ctx.clip();
          } else if (frameShape === 'star') {
            // Polygon points matching CSS star clip-path exactly
            const pts = [
              [50, 0], [61, 35], [98, 35], [68, 57], [79, 91],
              [50, 70], [21, 91], [32, 57], [2, 35], [39, 35]
            ];
            ctx.moveTo(posX + (pts[0][0] / 100) * rectW, posY + (pts[0][1] / 100) * rectH);
            for (let k = 1; k < pts.length; k++) {
              ctx.lineTo(posX + (pts[k][0] / 100) * rectW, posY + (pts[k][1] / 100) * rectH);
            }
            ctx.closePath();
            ctx.clip();
          } else if (frameShape === 'custom-path' && (layer.framePath || layer.framePolygon)) {
            if (layer.framePath) {
              const currentTransform = ctx.getTransform();
              ctx.translate(posX, posY);
              ctx.scale(rectW / 100, rectH / 100);
              const p2d = new Path2D(layer.framePath);
              ctx.clip(p2d);
              ctx.setTransform(currentTransform);
            } else {
              try {
                const pairs = layer.framePolygon.split(',').map((p: string) => {
                  const parts = p.trim().split(/\s+/);
                  const xVal = parseFloat(parts[0].replace('%', ''));
                  const yVal = parseFloat(parts[1].replace('%', ''));
                  return [xVal, yVal];
                });
                ctx.moveTo(posX + (pairs[0][0] / 100) * rectW, posY + (pairs[0][1] / 100) * rectH);
                for (let k = 1; k < pairs.length; k++) {
                  ctx.lineTo(posX + (pairs[k][0] / 100) * rectW, posY + (pairs[k][1] / 100) * rectH);
                }
              } catch (err) {
                ctx.rect(posX, posY, rectW, rectH);
              }
              ctx.closePath();
              ctx.clip();
            }
          } else {
            // rect, roundRect or custom (custom is drawn rectangular first then overlaid)
            if (radius > 0 && frameShape !== 'custom') {
              ctx.roundRect(posX, posY, rectW, rectH, radius);
            } else {
              ctx.rect(posX, posY, rectW, rectH);
            }
            ctx.clip();
          }

          // Rotate back to draw the image upright
          if (layer.rotation) {
            ctx.translate(posX + rectW / 2, posY + rectH / 2);
            ctx.rotate(-(layer.rotation * Math.PI) / 180);
            ctx.translate(-(posX + rectW / 2), -(posY + rectH / 2));
          }

          const scale = Math.max(rectW / img.width, rectH / img.height);
          const x = posX + (rectW - img.width * scale) / 2;
          const y = posY + (rectH - img.height * scale) / 2;

          if (config.filter !== 'none') {
            ctx.filter = config.filter;
          }

          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

          // Rotate back to rotated state for borders and custom overlays
          if (layer.rotation) {
            ctx.translate(posX + rectW / 2, posY + rectH / 2);
            ctx.rotate((layer.rotation * Math.PI) / 180);
            ctx.translate(-(posX + rectW / 2), -(posY + rectH / 2));
          }

          // Draw Frame border INSIDE the clipped region so exactly half (the inner side) is visible
          const borderWidth = (layer.borderSize ?? 4) * scaleFactor;
          if (borderWidth > 0 && frameShape !== 'custom') {
            ctx.save();
            ctx.strokeStyle = layer.borderColor || '#ffffff';
            ctx.lineWidth = borderWidth * 2;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            
            if (frameShape === 'circle') {
              const radius = Math.min(rectW, rectH) / 2;
              ctx.roundRect(posX, posY, rectW, rectH, radius);
            } else if (frameShape === 'triangle') {
              ctx.moveTo(posX + rectW / 2, posY);
              ctx.lineTo(posX, posY + rectH);
              ctx.lineTo(posX + rectW, posY + rectH);
              ctx.closePath();
            } else if (frameShape === 'heart') {
              const pts = [
                [50, 24], [62, 10], [78, 10], [90, 20], [94, 40], [82, 65],
                [50, 95], [18, 65], [6, 40], [10, 20], [26, 10], [38, 24]
              ];
              ctx.moveTo(posX + (pts[0][0] / 100) * rectW, posY + (pts[0][1] / 100) * rectH);
              for (let k = 1; k < pts.length; k++) {
                ctx.lineTo(posX + (pts[k][0] / 100) * rectW, posY + (pts[k][1] / 100) * rectH);
              }
              ctx.closePath();
            } else if (frameShape === 'star') {
              const pts = [
                [50, 0], [61, 35], [98, 35], [68, 57], [79, 91],
                [50, 70], [21, 91], [32, 57], [2, 35], [39, 35]
              ];
              ctx.moveTo(posX + (pts[0][0] / 100) * rectW, posY + (pts[0][1] / 100) * rectH);
              for (let k = 1; k < pts.length; k++) {
                ctx.lineTo(posX + (pts[k][0] / 100) * rectW, posY + (pts[k][1] / 100) * rectH);
              }
              ctx.closePath();
            } else if (frameShape === 'custom-path' && (layer.framePath || layer.framePolygon)) {
              if (layer.framePath) {
                const currentTransform = ctx.getTransform();
                const avgScale = (rectW / 100 + rectH / 100) / 2;
                ctx.lineWidth = (borderWidth * 2) / (avgScale || 1);
                ctx.translate(posX, posY);
                ctx.scale(rectW / 100, rectH / 100);
                const p2d = new Path2D(layer.framePath);
                ctx.stroke(p2d);
                ctx.setTransform(currentTransform);
              } else {
                try {
                  const pairs = layer.framePolygon.split(',').map((p: string) => {
                    const parts = p.trim().split(/\s+/);
                    const xVal = parseFloat(parts[0].replace('%', ''));
                    const yVal = parseFloat(parts[1].replace('%', ''));
                    return [xVal, yVal];
                  });
                  ctx.moveTo(posX + (pairs[0][0] / 100) * rectW, posY + (pairs[0][1] / 100) * rectH);
                  for (let k = 1; k < pairs.length; k++) {
                    ctx.lineTo(posX + (pairs[k][0] / 100) * rectW, posY + (pairs[k][1] / 100) * rectH);
                  }
                } catch (err) {
                  ctx.rect(posX, posY, rectW, rectH);
                }
                ctx.closePath();
              }
            } else {
              if (radius > 0) {
                ctx.roundRect(posX, posY, rectW, rectH, radius);
              } else {
                ctx.rect(posX, posY, rectW, rectH);
              }
            }
            ctx.stroke();
            ctx.restore();
          }

          // Restore state to remove clipping but preserve rotation/opacity
          ctx.restore();

          // If custom shape overlay is selected, render it on top of the clipped photo slot (rotated!)
          if (frameShape === 'custom' && layer.frameMaskUrl) {
            const maskImg = await new Promise<HTMLImageElement>((resolve) => {
              const i = new Image();
              i.crossOrigin = "anonymous";
              i.onload = () => resolve(i);
              i.onerror = () => resolve(new Image());
              i.src = layer.frameMaskUrl;
            });
            if (maskImg.complete && maskImg.naturalWidth > 0) {
              ctx.drawImage(maskImg, posX, posY, rectW, rectH);
            }
          }

          // Finally restore state back to original unrotated context
          ctx.restore();
        }
      } else if (layer.type === 'text') {
        ctx.save();
        if (layer.rotation) {
          ctx.translate(posX + rectW / 2, posY + rectH / 2);
          ctx.rotate((layer.rotation * Math.PI) / 180);
          ctx.translate(-(posX + rectW / 2), -(posY + rectH / 2));
        }
        ctx.globalAlpha = (layer.opacity ?? 100) / 100;
        const uFont = resolveFont(layer.fontFamily);
        ctx.fillStyle = layer.fontColor || '#1e293b';
        const scaledFontSize = (layer.fontSize || 24) * (canvas.width / 400);
        ctx.font = `${layer.fontStyle || 'normal'} ${layer.fontWeight || 'bold'} ${scaledFontSize}px ${uFont}`;
        ctx.textAlign = (layer.align || 'center') as CanvasTextAlign;
        ctx.textBaseline = 'middle';

        if (layer.shadowColor) {
          ctx.shadowColor = layer.shadowColor;
          ctx.shadowBlur = layer.shadowBlur || 0;
          ctx.shadowOffsetX = layer.shadowOffsetX || 0;
          ctx.shadowOffsetY = layer.shadowOffsetY || 0;
        }

        const strokeSize = layer.strokeSize || 0;
        const strokeColor = layer.strokeColor || '#ffffff';
        const textX = layer.align === 'left' ? posX : (layer.align === 'right' ? posX + rectW : posX + rectW / 2);
        const textY = posY + rectH / 2;

        if (strokeSize > 0) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeSize * (canvas.width / 400);
          ctx.strokeText(layer.text || '', textX, textY);
        }
        ctx.fillText(layer.text || '', textX, textY);
        ctx.restore();
      } else if (layer.type === 'overlay' && layer.url) {
        const img = await new Promise<HTMLImageElement>((resolve) => {
          const i = new Image();
          i.crossOrigin = "anonymous";
          i.onload = () => resolve(i);
          i.onerror = () => resolve(new Image());
          i.src = layer.url;
        });
        if (img.complete && img.naturalWidth > 0) {
          ctx.save();
          ctx.translate(posX + rectW / 2, posY + rectH / 2);
          if (layer.rotation) {
            ctx.rotate((layer.rotation * Math.PI) / 180);
          }
          if (layer.flipX || layer.flipY) {
            ctx.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);
          }
          ctx.globalAlpha = (layer.opacity ?? 100) / 100;
          ctx.drawImage(img, -rectW / 2, -rectH / 2, rectW, rectH);
          ctx.restore();
        }
      } else if ((layer.type === 'sticker' || layer.type === 'logo') && layer.url) {
        const img = await new Promise<HTMLImageElement>((resolve) => {
          const i = new Image();
          i.crossOrigin = "anonymous";
          i.onload = () => resolve(i);
          i.onerror = () => resolve(new Image());
          i.src = layer.url;
        });
        if (img.complete && img.naturalWidth > 0) {
          ctx.save();
          ctx.translate(posX + rectW / 2, posY + rectH / 2);
          if (layer.rotation) {
            ctx.rotate((layer.rotation * Math.PI) / 180);
          }
          if (layer.flipX || layer.flipY) {
            ctx.scale(layer.flipX ? -1 : 1, layer.flipY ? -1 : 1);
          }
          ctx.globalAlpha = (layer.opacity ?? 100) / 100;
          
          // Preserve aspect ratio (object-contain logic)
          const imgRatio = img.naturalWidth / img.naturalHeight;
          const rectRatio = rectW / rectH;
          let drawW = rectW;
          let drawH = rectH;
          if (imgRatio > rectRatio) {
            drawH = rectW / imgRatio;
          } else {
            drawW = rectH * imgRatio;
          }
          
          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();
        }
      } else if (layer.type === 'logo' && !layer.url) {
        ctx.save();
        if (layer.rotation) {
          ctx.translate(posX + rectW / 2, posY + rectH / 2);
          ctx.rotate((layer.rotation * Math.PI) / 180);
          ctx.translate(-(posX + rectW / 2), -(posY + rectH / 2));
        }
        ctx.globalAlpha = (layer.opacity ?? 100) / 100;
        const scaledSize = (layer.size || 20) * (canvas.width / 400);
        ctx.font = `bold ${scaledSize}px ${resolveFont('be-vietnam-pro')}`;
        ctx.fillStyle = layer.color || '#475569';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.logoText || '', posX + rectW / 2, posY + rectH / 2);
        ctx.restore();
      } else if (layer.type === 'shape') {
        ctx.save();
        ctx.translate(posX + rectW / 2, posY + rectH / 2);
        if (layer.rotation) {
          ctx.rotate((layer.rotation * Math.PI) / 180);
        }
        ctx.globalAlpha = (layer.opacity ?? 100) / 100;
        ctx.fillStyle = layer.fillColor || '#fda4af';

        const scaleFactor = canvas.width / (template.canvasWidth * 0.25 || 300);

        // Draw shape background path
        ctx.beginPath();
        const hasCustomPath = (layer.shapeType === 'custom-path' || layer.frameShape === 'custom-path') && (layer.framePath || layer.framePolygon);
        let customPathDrawn = false;

        if (hasCustomPath) {
          if (layer.framePath) {
            const currentTransform = ctx.getTransform();
            ctx.translate(-rectW / 2, -rectH / 2);
            ctx.scale(rectW / 100, rectH / 100);
            const p2d = new Path2D(layer.framePath);
            ctx.fill(p2d);
            
            const borderSize = layer.borderSize ?? 0;
            if (borderSize > 0) {
              ctx.strokeStyle = layer.borderColor || '#f43f5e';
              const avgScale = (rectW / 100 + rectH / 100) / 2;
              ctx.lineWidth = (borderSize * scaleFactor) / (avgScale || 1);
              ctx.stroke(p2d);
            }
            ctx.setTransform(currentTransform);
            customPathDrawn = true;
          } else if (layer.framePolygon) {
            try {
              const pairs = layer.framePolygon.split(',').map((p: string) => {
                const parts = p.trim().split(/\s+/);
                const xVal = parseFloat(parts[0].replace('%', ''));
                const yVal = parseFloat(parts[1].replace('%', ''));
                return [xVal, yVal];
              });
              ctx.moveTo(-rectW / 2 + (pairs[0][0] / 100) * rectW, -rectH / 2 + (pairs[0][1] / 100) * rectH);
              for (let k = 1; k < pairs.length; k++) {
                ctx.lineTo(-rectW / 2 + (pairs[k][0] / 100) * rectW, -rectH / 2 + (pairs[k][1] / 100) * rectH);
              }
            } catch (err) {
              ctx.rect(-rectW / 2, -rectH / 2, rectW, rectH);
            }
            ctx.closePath();
          }
        } else if (layer.shapeType === 'circle') {
          const radius = Math.min(rectW, rectH) / 2;
          ctx.roundRect(-rectW / 2, -rectH / 2, rectW, rectH, radius);
        } else if (layer.shapeType === 'triangle') {
          ctx.moveTo(0, -rectH / 2);
          ctx.lineTo(-rectW / 2, rectH / 2);
          ctx.lineTo(rectW / 2, rectH / 2);
          ctx.closePath();
        } else if (layer.shapeType === 'heart') {
          const pts = [
            [50, 24], [62, 10], [78, 10], [90, 20], [94, 40], [82, 65],
            [50, 95], [18, 65], [6, 40], [10, 20], [26, 10], [38, 24]
          ];
          ctx.moveTo(-rectW / 2 + (pts[0][0] / 100) * rectW, -rectH / 2 + (pts[0][1] / 100) * rectH);
          for (let k = 1; k < pts.length; k++) {
            ctx.lineTo(-rectW / 2 + (pts[k][0] / 100) * rectW, -rectH / 2 + (pts[k][1] / 100) * rectH);
          }
          ctx.closePath();
        } else if (layer.shapeType === 'star') {
          const pts = [
            [50, 0], [61, 35], [98, 35], [68, 57], [79, 91],
            [50, 70], [21, 91], [32, 57], [2, 35], [39, 35]
          ];
          ctx.moveTo(-rectW / 2 + (pts[0][0] / 100) * rectW, -rectH / 2 + (pts[0][1] / 100) * rectH);
          for (let k = 1; k < pts.length; k++) {
            ctx.lineTo(-rectW / 2 + (pts[k][0] / 100) * rectW, -rectH / 2 + (pts[k][1] / 100) * rectH);
          }
          ctx.closePath();
        } else {
          // rect shape has rounded rect background
          const radius = (layer.cornerRadius ?? 8) * scaleFactor;
          ctx.roundRect(-rectW / 2, -rectH / 2, rectW, rectH, radius);
        }

        if (!customPathDrawn) {
          ctx.fill();

          // Stroke border
          const borderSize = layer.borderSize ?? 0;
          if (borderSize > 0) {
            ctx.strokeStyle = layer.borderColor || '#f43f5e';
            ctx.lineWidth = borderSize * scaleFactor;
            ctx.stroke();
          }
        }

        ctx.restore();
      }
    }
  } else {
    // Default fallback drawing of slots
    const inset = config.borderSize !== undefined ? config.borderSize : 15;
    const minX = template.slots.length > 0 ? Math.min(...template.slots.map(s => s.x)) : 40;
    const offset = inset < 15 ? (inset - 15) * (minX / 15) : (inset - 15) * 2.67;

    template.slots.forEach((slot, index) => {
      if (photoImages[index]) {
        const img = photoImages[index];
        const slotX = Math.max(0, slot.x + offset);
        const slotY = Math.max(0, slot.y + offset);
        const slotW = slot.width - offset * 2;
        const slotH = slot.height - offset * 2;

        const scaleFactor = canvas.width / (template.canvasWidth * 0.25 || 300);
        const radius = (slot.cornerRadius ?? 8) * scaleFactor;
        const frameShape = slot.frameShape || 'rect';

        ctx.save();
        if (slot.rotation) {
          ctx.translate(slotX + slotW / 2, slotY + slotH / 2);
          ctx.rotate((slot.rotation * Math.PI) / 180);
          ctx.translate(-(slotX + slotW / 2), -(slotY + slotH / 2));
        }
        ctx.save(); // Save 2 for clipping path
        ctx.beginPath();
        if (frameShape === 'circle') {
          const radius = Math.min(slotW, slotH) / 2;
          ctx.roundRect(slotX, slotY, slotW, slotH, radius);
          ctx.clip();
        } else if (frameShape === 'triangle') {
          ctx.moveTo(slotX + slotW / 2, slotY);
          ctx.lineTo(slotX, slotY + slotH);
          ctx.lineTo(slotX + slotW, slotY + slotH);
          ctx.closePath();
          ctx.clip();
        } else if (frameShape === 'heart') {
          const pts = [
            [50, 24], [62, 10], [78, 10], [90, 20], [94, 40], [82, 65],
            [50, 95], [18, 65], [6, 40], [10, 20], [26, 10], [38, 24]
          ];
          ctx.moveTo(slotX + (pts[0][0] / 100) * slotW, slotY + (pts[0][1] / 100) * slotH);
          for (let k = 1; k < pts.length; k++) {
            ctx.lineTo(slotX + (pts[k][0] / 100) * slotW, slotY + (pts[k][1] / 100) * slotH);
          }
          ctx.closePath();
          ctx.clip();
        } else if (frameShape === 'star') {
          const pts = [
            [50, 0], [61, 35], [98, 35], [68, 57], [79, 91],
            [50, 70], [21, 91], [32, 57], [2, 35], [39, 35]
          ];
          ctx.moveTo(slotX + (pts[0][0] / 100) * slotW, slotY + (pts[0][1] / 100) * slotH);
          for (let k = 1; k < pts.length; k++) {
            ctx.lineTo(slotX + (pts[k][0] / 100) * slotW, slotY + (pts[k][1] / 100) * slotH);
          }
          ctx.closePath();
          ctx.clip();
        } else if (frameShape === 'custom-path' && (slot.framePath || slot.framePolygon)) {
          if (slot.framePath) {
            const currentTransform = ctx.getTransform();
            ctx.translate(slotX, slotY);
            ctx.scale(slotW / 100, slotH / 100);
            const p2d = new Path2D(slot.framePath);
            ctx.clip(p2d);
            ctx.setTransform(currentTransform);
          } else if (slot.framePolygon) {
            try {
              const pairs = slot.framePolygon.split(',').map((p: string) => {
                const parts = p.trim().split(/\s+/);
                const xVal = parseFloat(parts[0].replace('%', ''));
                const yVal = parseFloat(parts[1].replace('%', ''));
                return [xVal, yVal];
              });
              ctx.moveTo(slotX + (pairs[0][0] / 100) * slotW, slotY + (pairs[0][1] / 100) * slotH);
              for (let k = 1; k < pairs.length; k++) {
                ctx.lineTo(slotX + (pairs[k][0] / 100) * slotW, slotY + (pairs[k][1] / 100) * slotH);
              }
            } catch (err) {
              ctx.rect(slotX, slotY, slotW, slotH);
            }
            ctx.closePath();
            ctx.clip();
          }
        } else {
          if (radius > 0 && frameShape !== 'custom') {
            ctx.roundRect(slotX, slotY, slotW, slotH, radius);
          } else {
            ctx.rect(slotX, slotY, slotW, slotH);
          }
          ctx.clip();
        }

        // Rotate back to draw the image upright
        if (slot.rotation) {
          ctx.translate(slotX + slotW / 2, slotY + slotH / 2);
          ctx.rotate(-(slot.rotation * Math.PI) / 180);
          ctx.translate(-(slotX + slotW / 2), -(slotY + slotH / 2));
        }

        const scale = Math.max(slotW / img.width, slotH / img.height);
        const x = slotX + (slotW - img.width * scale) / 2;
        const y = slotY + (slotH - img.height * scale) / 2;

        if (config.filter !== 'none') {
          ctx.filter = config.filter;
        }

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        // Restore Save 2 to remove clipping path, but keep rotation
        ctx.restore();

        // Rotate back to rotated state for borders and custom overlays
        if (slot.rotation) {
          ctx.translate(slotX + slotW / 2, slotY + slotH / 2);
          ctx.rotate((slot.rotation * Math.PI) / 180);
          ctx.translate(-(slotX + slotW / 2), -(slotY + slotH / 2));
        }

        // Draw Custom frame overlay if any
        if (frameShape === 'custom' && slot.frameMaskUrl) {
          // Draw mask on top
        }

        // Draw Border
        const borderWidth = (slot.borderSize ?? 4) * scaleFactor;
        if (borderWidth > 0 && frameShape !== 'custom') {
          ctx.save();
          ctx.strokeStyle = slot.borderColor || '#ffffff';
          ctx.lineWidth = borderWidth;
          ctx.lineJoin = 'round';
          ctx.beginPath();
          
          if (frameShape === 'circle') {
            const radius = Math.min(slotW - borderWidth, slotH - borderWidth) / 2;
            ctx.roundRect(slotX + borderWidth / 2, slotY + borderWidth / 2, slotW - borderWidth, slotH - borderWidth, radius);
          } else if (frameShape === 'triangle') {
            ctx.moveTo(slotX + slotW / 2, slotY + borderWidth);
            ctx.lineTo(slotX + borderWidth, slotY + slotH - borderWidth);
            ctx.lineTo(slotX + slotW - borderWidth, slotY + slotH - borderWidth);
            ctx.closePath();
          } else if (frameShape === 'heart') {
            const pts = [
              [50, 24], [62, 10], [78, 10], [90, 20], [94, 40], [82, 65],
              [50, 95], [18, 65], [6, 40], [10, 20], [26, 10], [38, 24]
            ];
            ctx.moveTo(slotX + (pts[0][0] / 100) * slotW, slotY + (pts[0][1] / 100) * slotH);
            for (let k = 1; k < pts.length; k++) {
              ctx.lineTo(slotX + (pts[k][0] / 100) * slotW, slotY + (pts[k][1] / 100) * slotH);
            }
            ctx.closePath();
          } else if (frameShape === 'star') {
            const pts = [
              [50, 0], [61, 35], [98, 35], [68, 57], [79, 91],
              [50, 70], [21, 91], [32, 57], [2, 35], [39, 35]
            ];
            ctx.moveTo(slotX + (pts[0][0] / 100) * slotW, slotY + (pts[0][1] / 100) * slotH);
            for (let k = 1; k < pts.length; k++) {
              ctx.lineTo(slotX + (pts[k][0] / 100) * slotW, slotY + (pts[k][1] / 100) * slotH);
            }
            ctx.closePath();
          } else if (frameShape === 'custom-path' && (slot.framePath || slot.framePolygon)) {
            if (slot.framePath) {
              const currentTransform = ctx.getTransform();
              const avgScale = (slotW / 100 + slotH / 100) / 2;
              ctx.lineWidth = borderWidth / (avgScale || 1);
              ctx.translate(slotX, slotY);
              ctx.scale(slotW / 100, slotH / 100);
              const p2d = new Path2D(slot.framePath);
              ctx.stroke(p2d);
              ctx.setTransform(currentTransform);
            } else if (slot.framePolygon) {
              try {
                const pairs = slot.framePolygon.split(',').map((p: string) => {
                  const parts = p.trim().split(/\s+/);
                  const xVal = parseFloat(parts[0].replace('%', ''));
                  const yVal = parseFloat(parts[1].replace('%', ''));
                  return [xVal, yVal];
                });
                ctx.moveTo(slotX + (pairs[0][0] / 100) * slotW, slotY + (pairs[0][1] / 100) * slotH);
                for (let k = 1; k < pairs.length; k++) {
                  ctx.lineTo(slotX + (pairs[k][0] / 100) * slotW, slotY + (pairs[k][1] / 100) * slotH);
                }
              } catch (err) {
                ctx.rect(slotX + borderWidth/2, slotY + borderWidth/2, slotW - borderWidth, slotH - borderWidth);
              }
              ctx.closePath();
            }
          } else {
            if (radius > 0) {
              ctx.roundRect(slotX + borderWidth/2, slotY + borderWidth/2, slotW - borderWidth, slotH - borderWidth, radius);
            } else {
              ctx.rect(slotX + borderWidth/2, slotY + borderWidth/2, slotW - borderWidth, slotH - borderWidth);
            }
          }
          ctx.stroke();
          ctx.restore();
        }
        ctx.restore(); // Restore Save 1: Back to original unrotated context
      }
    });
  }

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

  // 3.5. Draw Template Overlay
  if ((template as any).overlay) {
    const overlayImg = await new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.error("Failed to load template overlay image");
        resolve(new Image());
      };
      img.src = (template as any).overlay;
    });
    if (overlayImg.complete && overlayImg.naturalWidth > 0) {
      ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
    }
  }

  // 4. Draw Premium Branding (Adjusted to Haniu with drag-drop coordinates and fonts)
  ctx.save();
  const bottomY = canvas.height - 80;

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
    }, 'image/jpeg', 0.85);
  });
};
