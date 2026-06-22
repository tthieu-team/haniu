'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';
import type { FaceFilterType } from './types';
import {
  initFaceLandmarker,
  destroyFaceLandmarker,
  detectFaceLandmarks,
  renderFaceFilter,
} from './FaceFilterEngine';
import type { FaceLandmarker } from '@mediapipe/tasks-vision';

interface CameraViewProps {
  onCapture: (blob: Blob, dataUrl: string) => void;
  onReady?: () => void;
  isCapturing: boolean;
  mirrored?: boolean;
  faceFilter?: FaceFilterType;
  onFaceFilterLoading?: (loading: boolean) => void;
  aspectRatio?: string;
  frameShape?: string;
  framePath?: string;
  framePolygon?: string;
  cornerRadius?: number;
  borderColor?: string;
  borderSize?: number;
}

export const CameraView: React.FC<CameraViewProps> = ({
  onCapture,
  onReady,
  isCapturing,
  mirrored = true,
  faceFilter = 'none',
  onFaceFilterLoading,
  aspectRatio = 'free',
  frameShape = 'rect',
  framePath,
  framePolygon,
  cornerRadius = 16,
  borderColor = '#ffffff',
  borderSize = 4,
}) => {
  const trans = useTranslate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [containerSize, setContainerSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Face filter state
  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const faceFilterRef = useRef<FaceFilterType>(faceFilter);
  const frameCountRef = useRef<number>(0);
  const cachedLandmarksRef = useRef<any[] | null>(null);

  // Keep ref in sync with prop so the render loop always reads the latest value
  useEffect(() => {
    faceFilterRef.current = faceFilter;
  }, [faceFilter]);

  // Track container size for crop mask
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerSize({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ─── Camera Initialization ─────────────────────────────────
  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error(trans('Trình duyệt không hỗ trợ truy cập Camera'));
        }

        const s = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false,
        });
        currentStream = s;
        setStream(s);

        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err: any) {
        console.error('Error accessing camera:', err);
        if (err.name === 'NotAllowedError') {
          setError(trans('Quyền truy cập Camera bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.'));
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError(trans('Không tìm thấy Camera kết nối với thiết bị.'));
        } else {
          setError(err.message || trans('Lỗi không xác định khi truy cập Camera'));
        }
        setLoading(false);
      }
    };

    startCamera();

    const handleDisconnect = () => setError(trans('Camera đã bị ngắt kết nối.'));
    if (navigator.mediaDevices && navigator.mediaDevices.addEventListener) {
      navigator.mediaDevices.addEventListener('devicechange', handleDisconnect);
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
      }
      if (navigator.mediaDevices && navigator.mediaDevices.removeEventListener) {
        navigator.mediaDevices.removeEventListener('devicechange', handleDisconnect);
      }
    };
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      const video = videoRef.current;
      // Only attempt play when video has enough data to start
      const attemptPlay = () => {
        video.play().catch(e => {
          // AbortError is expected when component re-renders trigger a new load
          if (e.name !== 'AbortError') {
            console.warn("Video play failed:", e);
          }
        });
      };
      if (video.readyState >= 2) {
        attemptPlay();
      } else {
        video.addEventListener('loadeddata', attemptPlay, { once: true });
        return () => video.removeEventListener('loadeddata', attemptPlay);
      }
    }
  }, [stream]);

  // ─── FaceLandmarker Preload (eager) ─────────────────────────
  // Start loading the AI model as soon as camera stream is available.
  // This ensures zero lag when user picks a face filter.
  useEffect(() => {
    if (stream && !faceLandmarkerRef.current) {
      onFaceFilterLoading?.(true);
      initFaceLandmarker().then((landmarker) => {
        faceLandmarkerRef.current = landmarker;
        onFaceFilterLoading?.(false);
      });
    }
  }, [stream]);

  // ─── Compute object-cover crop offset ──────────────────────
  // The video element uses object-fit: cover, which means the displayed
  // area is a center-cropped portion of the native video. To correctly
  // position the overlay canvas, we need to calculate the offset and
  // scale used by the browser.
  function getVideoCoverRect(video: HTMLVideoElement) {
    const containerW = video.clientWidth;
    const containerH = video.clientHeight;
    const videoW = video.videoWidth || containerW;
    const videoH = video.videoHeight || containerH;

    const containerAspect = containerW / containerH;
    const videoAspect = videoW / videoH;

    let drawW: number, drawH: number, offsetX: number, offsetY: number;

    if (videoAspect > containerAspect) {
      // Video is wider — crop sides
      drawH = containerH;
      drawW = containerH * videoAspect;
      offsetX = (containerW - drawW) / 2;
      offsetY = 0;
    } else {
      // Video is taller — crop top/bottom
      drawW = containerW;
      drawH = containerW / videoAspect;
      offsetX = 0;
      offsetY = (containerH - drawH) / 2;
    }

    return { drawW, drawH, offsetX, offsetY, containerW, containerH, videoW, videoH };
  }

  // ─── Face Filter Render Loop ───────────────────────────────
  useEffect(() => {
    const video = videoRef.current;
    const overlayCanvas = overlayCanvasRef.current;

    if (!video || !overlayCanvas) return;

    const ctx = overlayCanvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const renderLoop = () => {
      if (!running) return;

      const currentFilter = faceFilterRef.current;

      if (
        currentFilter !== 'none' &&
        faceLandmarkerRef.current &&
        video.readyState >= 2
      ) {
        // Sync overlay canvas pixel size to container
        const containerW = video.clientWidth;
        const containerH = video.clientHeight;

        if (overlayCanvas.width !== containerW || overlayCanvas.height !== containerH) {
          overlayCanvas.width = containerW;
          overlayCanvas.height = containerH;
        }

        ctx.clearRect(0, 0, containerW, containerH);

        // Throttle detection: run every 2nd frame to reduce lag
        frameCountRef.current++;
        let landmarks = cachedLandmarksRef.current;

        if (frameCountRef.current % 2 === 0 || !landmarks) {
          const now = performance.now();
          const timestamp = Math.max(now, lastTimestampRef.current + 1);
          lastTimestampRef.current = timestamp;

          const detected = detectFaceLandmarks(
            faceLandmarkerRef.current,
            video,
            timestamp
          );
          if (detected) {
            landmarks = detected;
            cachedLandmarksRef.current = detected;
          }
        }

        if (landmarks) {
          // Calculate object-cover transform
          const cover = getVideoCoverRect(video);

          ctx.save();

          // The overlay canvas has CSS scale-x-[-1] (same as video) which already
          // mirrors the display. We do NOT apply ctx.scale(-1,1) here — that would
          // double-mirror. Instead we just map landmarks through object-cover coords.
          const mappedLandmarks = landmarks.map((lm: any) => ({
            x: (cover.offsetX + lm.x * cover.drawW) / containerW,
            y: (cover.offsetY + lm.y * cover.drawH) / containerH,
            z: lm.z,
          }));

          renderFaceFilter(
            ctx,
            mappedLandmarks,
            currentFilter,
            containerW,
            containerH,
            video
          );

          ctx.restore();
        }
      } else if (currentFilter === 'none') {
        // Clear when filter is off
        if (overlayCanvas.width > 0) {
          ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      running = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [mirrored]); // Only depend on mirrored — faceFilter is read from ref

  // ─── Cleanup FaceLandmarker on unmount ─────────────────────
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      destroyFaceLandmarker();
    };
  }, []);

  // ─── Handle Capture ────────────────────────────────────────
  useEffect(() => {
    if (isCapturing && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 480;

        // Calculate crop region based on aspect ratio
        let cropX = 0, cropY = 0, cropW = vw, cropH = vh;
        if (aspectRatio !== 'free') {
          const [rw, rh] = aspectRatio.split(':').map(Number);
          const targetRatio = rw / rh;
          const videoRatio = vw / vh;
          if (targetRatio > videoRatio) {
            // Video is taller — crop top/bottom
            cropW = vw;
            cropH = vw / targetRatio;
            cropX = 0;
            cropY = (vh - cropH) / 2;
          } else {
            // Video is wider — crop sides
            cropH = vh;
            cropW = vh * targetRatio;
            cropY = 0;
            cropX = (vw - cropW) / 2;
          }
        }

        canvas.width = Math.round(cropW);
        canvas.height = Math.round(cropH);

        // Handle mirroring
        if (mirrored) {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }

        // Draw cropped video frame
        context.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, canvas.width, canvas.height);

        // Reset transform for face filter rendering
        context.setTransform(1, 0, 0, 1, 0, 0);

        // Render face filter onto capture canvas
        if (faceFilter !== 'none' && faceLandmarkerRef.current && video.readyState >= 2) {
          const timestamp = performance.now();
          const safeTs = Math.max(timestamp, lastTimestampRef.current + 1);
          lastTimestampRef.current = safeTs;

          const landmarks = detectFaceLandmarks(
            faceLandmarkerRef.current,
            video,
            safeTs
          );

          if (landmarks) {
            context.save();

            if (mirrored) {
              context.translate(canvas.width, 0);
              context.scale(-1, 1);
            }

            // Remap landmarks from full video space to cropped canvas space
            const mappedLandmarks = landmarks.map((lm: any) => ({
              x: (lm.x * vw - cropX) / cropW,
              y: (lm.y * vh - cropY) / cropH,
              z: lm.z,
            }));

            renderFaceFilter(
              context,
              mappedLandmarks,
              faceFilter,
              canvas.width,
              canvas.height,
              video
            );

            context.restore();
          }
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        canvas.toBlob((blob) => {
          if (blob) onCapture(blob, dataUrl);
        }, 'image/jpeg', 0.95);
      }
    }
  }, [isCapturing, onCapture, mirrored, faceFilter, aspectRatio]);

  const [rw, rh] = (aspectRatio && aspectRatio !== 'free') ? aspectRatio.split(':').map(Number) : [0, 0];
  const targetRatio = rw && rh ? rw / rh : 0;
  const cW = containerSize.w;
  const cH = containerSize.h;
  const containerRatio = cW / cH;

  let cutW = cW;
  let cutH = cH;
  if (targetRatio > 0 && cW > 0 && cH > 0) {
    if (targetRatio > containerRatio) {
      cutW = cW;
      cutH = cW / targetRatio;
    } else {
      cutH = cH;
      cutW = cH * targetRatio;
    }
  }
  const cutX = (cW - cutW) / 2;
  const cutY = (cH - cutH) / 2;

  const borderRadius = frameShape === 'circle' ? '999px' : (frameShape !== 'rect' && frameShape !== 'custom' && frameShape !== 'custom-path' ? '0px' : `${cornerRadius ?? 16}px`);
  
  const clipPath = frameShape === 'custom-path' && (framePath || framePolygon)
    ? (framePath ? 'url(#clip-camera)' : `polygon(${framePolygon})`)
    : (frameShape !== 'rect' && frameShape !== 'circle' && frameShape !== 'custom'
       ? (frameShape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
          : frameShape === 'heart' ? 'polygon(50% 24%, 62% 10%, 78% 10%, 90% 20%, 94% 40%, 82% 65%, 50% 95%, 18% 65%, 6% 40%, 10% 20%, 26% 10%, 38% 24%)'
          : frameShape === 'star' ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
          : 'none')
       : 'none');

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-background overflow-hidden flex items-center justify-center cursor-pointer"
      onClick={() => {
        if (videoRef.current?.paused) {
          videoRef.current.play().catch(console.error);
        }
      }}
    >
      {frameShape === 'custom-path' && framePath && (
        <svg width="0" height="0" className="absolute">
          <defs>
            <clipPath id="clip-camera" clipPathUnits="objectBoundingBox">
              <path d={framePath} transform="scale(0.01)" />
            </clipPath>
          </defs>
        </svg>
      )}

      <div
        className="absolute overflow-hidden flex items-center justify-center bg-zinc-950 shadow-2xl z-[5]"
        style={{
          left: cutX,
          top: cutY,
          width: cutW,
          height: cutH,
          borderRadius,
          clipPath,
          borderWidth: (frameShape === 'rect' || frameShape === 'circle') ? `${borderSize ?? 4}px` : '0px',
          borderColor: borderColor || '#ffffff',
          borderStyle: (borderSize ?? 4) > 0 ? 'solid' : 'none',
        }}
      >
        <motion.video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onCanPlay={() => {
            videoRef.current?.play().then(() => {
              setLoading(false);
              onReady?.();
              setError(null);
            }).catch(e => {
              console.error("Autoplay failed:", e);
              setLoading(false);
              setError(trans('Trình duyệt chặn phát Video tự động. Vui lòng nhấn vào màn hình để bắt đầu.'));
            });
          }}
          animate={{
            scale: isCapturing ? [1, 0.98, 1] : 1,
          }}
          className={`w-full h-full object-cover transition-transform duration-300 ${mirrored ? 'scale-x-[-1]' : ''}`}
        />

        {/* Face Filter Overlay Canvas — positioned to exactly overlap the video */}
        <canvas
          ref={overlayCanvasRef}
          className={`absolute inset-0 w-full h-full pointer-events-none z-[5] ${mirrored ? 'scale-x-[-1]' : ''}`}
        />

        {/* SVG Border Stroke for custom shapes/polygons */}
        {frameShape !== 'rect' && frameShape !== 'circle' && frameShape !== 'custom' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-[15]" viewBox="0 0 100 100" preserveAspectRatio="none">
            {frameShape === 'custom-path' && framePath ? (
              <path 
                d={framePath}
                fill="none"
                stroke={borderColor || '#ffffff'}
                strokeWidth={(borderSize ?? 4) * 2}
                vectorEffect="non-scaling-stroke"
              />
            ) : (
              <polygon 
                points={
                  frameShape === 'triangle' ? '50 0, 0 100, 100 100'
                  : frameShape === 'heart' ? '50 24, 62 10, 78 10, 90 20, 94 40, 82 65, 50 95, 18 65, 6 40, 10 20, 26 10, 38 24'
                  : frameShape === 'custom-path' && framePolygon ? framePolygon.replace(/%/g, '')
                  : '50 0, 61 35, 98 35, 68 57, 79 91, 50 70, 21 91, 32 57, 2 35, 39 35'
                }
                fill="none"
                stroke={borderColor || '#ffffff'}
                strokeWidth={(borderSize ?? 4) * 2}
                vectorEffect="non-scaling-stroke"
              />
            )}
          </svg>
        )}
      </div>

      {/* Aspect Ratio Crop Mask */}
      {aspectRatio !== 'free' && containerSize.w > 0 && (
        <div className="absolute inset-0 z-[4] pointer-events-none">
          <svg width={cW} height={cH} className="absolute inset-0">
            <defs>
              <mask id="crop-mask">
                <rect width={cW} height={cH} fill="white" />
                <rect x={cutX} y={cutY} width={cutW} height={cutH} fill="black" rx="2" />
              </mask>
            </defs>
            <rect width={cW} height={cH} fill="rgba(0,0,0,0.55)" mask="url(#crop-mask)" />
          </svg>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10"
          >
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-color mb-4" />
            <p className="text-foreground font-medium text-xs tracking-wider animate-pulse">{trans('Khởi tạo Camera...')}</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-background z-10 p-6 text-center"
          >
            <div className="w-14 h-14 bg-primary-color/10 rounded-full flex items-center justify-center mb-4 border border-primary-color/25">
              <Icon name="camera" size={24} className="text-primary-color" />
            </div>
            <h3 className="text-sm font-bold text-foreground mb-1">{trans('Không thể mở camera')}</h3>
            <p className="text-muted-color text-[10px] max-w-xs leading-normal">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-primary-color hover:bg-primary-color/90 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Icon name="refresh" size={12} /> {trans('Thử lại')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simulated Flash */}
      <AnimatePresence>
        {isCapturing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Tech corner brackets */}
      <div className="absolute inset-6 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-border-color rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-border-color rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-border-color rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-border-color rounded-br-lg" />
      </div>

      {/* Camera status badge */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <div className="px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5 shadow-md">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-color animate-pulse" />
          <span className="text-[8px] text-white font-black tracking-wider uppercase">LIVE • HANIU CAM</span>
        </div>
      </div>
    </div>
  );
};
