'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '@/components/common/Icons';

interface CameraViewProps {
  onCapture: (blob: Blob, dataUrl: string) => void;
  onReady?: () => void;
  isCapturing: boolean;
  filter?: string;
  mirrored?: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({
  onCapture,
  onReady,
  isCapturing,
  filter = 'none',
  mirrored = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Trình duyệt không hỗ trợ truy cập Camera');
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
          setError('Quyền truy cập Camera bị từ chối. Vui lòng cấp quyền trong cài đặt trình duyệt.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('Không tìm thấy Camera kết nối với thiết bị.');
        } else {
          setError(err.message || 'Lỗi không xác định khi truy cập Camera');
        }
        setLoading(false);
      }
    };

    startCamera();

    const handleDisconnect = () => setError('Camera đã bị ngắt kết nối.');
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
      videoRef.current.play().catch(e => console.warn("Video play failed:", e));
    }
  }, [stream]);

  // Handle capture trigger from parent
  useEffect(() => {
    if (isCapturing && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        // Handle mirroring
        if (mirrored) {
          context.translate(canvas.width, 0);
          context.scale(-1, 1);
        }

        // Apply same filter to capture
        context.filter = filter;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Reset transform
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.filter = 'none';

        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        canvas.toBlob((blob) => {
          if (blob) onCapture(blob, dataUrl);
        }, 'image/jpeg', 0.95);
      }
    }
  }, [isCapturing, onCapture, mirrored, filter]);

  return (
    <div 
      className="relative w-full h-full bg-background overflow-hidden flex items-center justify-center cursor-pointer"
      onClick={() => {
        if (videoRef.current?.paused) {
          videoRef.current.play().catch(console.error);
        }
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
            setError('Trình duyệt chặn phát Video tự động. Vui lòng nhấn vào màn hình để bắt đầu.');
          });
        }}
        animate={{
          scale: isCapturing ? [1, 0.98, 1] : 1,
          filter: filter
        }}
        className={`w-full h-full object-cover transition-transform duration-300 ${mirrored ? 'scale-x-[-1]' : ''}`}
      />

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
            <p className="text-foreground font-medium text-xs tracking-wider animate-pulse">Khởi tạo Camera...</p>
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
            <h3 className="text-sm font-bold text-foreground mb-1">Không thể mở camera</h3>
            <p className="text-muted-color text-[10px] max-w-xs leading-normal">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-primary-color hover:bg-primary-color/90 text-white rounded-xl text-[10px] font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Icon name="refresh" size={12} /> Thử lại
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
