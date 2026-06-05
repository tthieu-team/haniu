'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/common/Icons';

import { PhotoboothStep, PhotoboothMode, PhotoboothConfig, CapturedPhoto, Sticker } from './types';
import { IdleState } from './IdleState';
import { ModeSelector } from './ModeSelector';
import { CameraView } from './CameraView';
import { CountdownTimer } from './CountdownTimer';
import { ReviewScreen } from './ReviewScreen';
import { StickerEditor } from './StickerEditor';
import { ResultView } from './ResultView';
import { generateComposition } from './composition';
import { DEFAULT_TEMPLATES } from './templates';
import { playSound } from './sounds';

interface PhotoboothSystemProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const PhotoboothSystem: React.FC<PhotoboothSystemProps> = ({ onCapture, onClose }) => {
  const [step, setStep] = useState<PhotoboothStep>('idle');
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [cameraReady, setCameraReady] = useState(false);
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [config, setConfig] = useState<PhotoboothConfig>({
    mode: 'grid-4',
    template: DEFAULT_TEMPLATES['grid-4'],
    filter: 'none',
    frameStyle: 'white',
    countdown: 3,
    userName: '',
    showDate: true
  });

  // Cleanup Result URL
  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  // Idle Timer
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const IDLE_TIMEOUT = 180000; // 3 minutes

  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (step !== 'idle' && step !== 'result' && step !== 'capturing') {
      idleTimerRef.current = setTimeout(() => {
        handleRestart();
        setStep('timeout');
      }, IDLE_TIMEOUT);
    }
  }, [step]);

  useEffect(() => {
    resetIdleTimer();
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [resetIdleTimer]);

  const handleStart = () => {
    playSound('click');
    setCameraReady(false);
    setStep('select-mode');
  };

  const handleModeSelect = (mode: PhotoboothMode, userName: string) => {
    playSound('click');
    const template = DEFAULT_TEMPLATES[mode] || DEFAULT_TEMPLATES['grid-4'];
    setConfig(prev => ({ ...prev, mode, template, userName }));
    setPhotos([]);
    setStep('countdown');
  };

  const handleCapture = useCallback((blob: Blob, url: string) => {
    if (photos.length >= config.template.slots.length && retakeIndex === null) return;

    const newPhoto = { id: Math.random().toString(36).substr(2, 9), url, blob };

    if (retakeIndex !== null) {
      setPhotos(prev => {
        const next = [...prev];
        next[retakeIndex] = newPhoto;
        return next;
      });
      setRetakeIndex(null);
      setStep('review');
    } else {
      setPhotos(prev => [...prev, newPhoto]);
      setIsCapturing(false);
    }
  }, [retakeIndex, photos.length, config.template.slots.length]);

  useEffect(() => {
    if ((step === 'countdown' || step === 'capturing') && retakeIndex === null) {
      if (photos.length >= config.template.slots.length) {
        setStep('review');
        playSound('success');
      } else if (step === 'capturing') {
        const timer = setTimeout(() => {
          setStep('countdown');
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [photos.length, config.template.slots.length, step, retakeIndex]);

  const handleFinishCountdown = () => {
    setIsCapturing(true);
    setStep('capturing');
  };

  const handleRetakeSingle = (index: number) => {
    playSound('click');
    setRetakeIndex(index);
    setStep('countdown');
  };

  const handleConfirmReview = async () => {
    playSound('click');
    try {
      const blob = await generateComposition(photos, config);
      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
      setStep('editing');
    } catch (err) {
      console.error(err);
      setErrorMessage('Không thể ghép bản phối ảnh. Vui lòng chụp lại.');
      setStep('error');
    }
  };

  const handleStickerComplete = async (newStickers: Sticker[]) => {
    playSound('click');
    setStickers(newStickers);
    try {
      const finalBlob = await generateComposition(photos, config, newStickers);
      const url = URL.createObjectURL(finalBlob);
      setResultBlob(finalBlob);
      setResultUrl(url);
      setStep('result');
    } catch (err) {
      console.error(err);
      alert('Gặp lỗi khi tạo ảnh thành phẩm với sticker.');
    }
  };

  const handleRestart = () => {
    playSound('click');
    setPhotos([]);
    setResultBlob(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl('');
    setStickers([]);
    setErrorMessage(null);
    setCameraReady(false);
    setStep('idle');
  };

  const handleConfirmFinal = (blob: Blob) => {
    playSound('click');
    const file = new File([blob], `haniu-photobooth-${Date.now()}.png`, { type: 'image/png' });
    onCapture(file);
    onClose();
  };

  return (
    <div 
      className="w-full h-full min-h-0 flex flex-col bg-background relative font-sans text-foreground overflow-hidden select-none" 
      onMouseMove={resetIdleTimer} 
      onClick={resetIdleTimer}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--card)_0%,var(--background)_100%)] pointer-events-none" />

      {/* Close button inside modal photobooth system */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 bg-card-bg hover:bg-accent-color/20 border border-border-color rounded-full transition-all text-muted-color hover:text-foreground cursor-pointer"
        title="Đóng Photobooth"
      >
        <Icon name="close" size={16} />
      </button>

      <AnimatePresence mode="wait">
        {step === 'idle' && (
          <motion.div key="idle" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IdleState onStart={handleStart} />
          </motion.div>
        )}

        {step === 'select-mode' && (
          <motion.div key="mode" className="w-full h-full" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }}>
            <ModeSelector onSelect={handleModeSelect} />
          </motion.div>
        )}

        {(step === 'countdown' || step === 'capturing') && (
          <motion.div key="camera" className="w-full h-full relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CameraView
              isCapturing={isCapturing}
              onCapture={handleCapture}
              onReady={() => setCameraReady(true)}
              filter={config.filter}
            />

            {step === 'countdown' && cameraReady && (
              <CountdownTimer seconds={config.countdown} onFinish={handleFinishCountdown} />
            )}

            {/* Photo capture process counter indicators */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <div className="flex gap-1.5">
                {config.template.slots.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: i === photos.length ? [1, 1.2, 1] : 1,
                      backgroundColor: i < photos.length ? "var(--primary)" : "rgba(255,255,255,0.2)"
                    }}
                    transition={{ repeat: i === photos.length ? Infinity : 0, duration: 1.5 }}
                    className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-xs"
                  />
                ))}
              </div>
              <p className="text-[9px] font-black uppercase tracking-wider text-white/50">
                {retakeIndex !== null ? `CHỤP LẠI ẢNH ${retakeIndex + 1}` : `ẢNH ${photos.length + 1} / ${config.template.slots.length}`}
              </p>
            </div>

            {/* Quick Filters */}
            <div className="absolute bottom-6 left-6 flex gap-2">
              {[
                { id: 'none', filterStyle: 'none' },
                { id: 'sepia', filterStyle: 'sepia(0.6)' },
                { id: 'grayscale', filterStyle: 'grayscale(1)' },
                { id: 'warm', filterStyle: 'contrast(1.1) saturate(1.2)' }
              ].map((f, i) => (
                <button
                  key={i}
                  onClick={() => setConfig(prev => ({ ...prev, filter: f.filterStyle }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${
                    config.filter === f.filterStyle ? 'border-primary-color scale-105 shadow-md' : 'border-white/20 hover:border-white/40'
                  }`}
                  style={{ filter: f.filterStyle, backgroundColor: '#333' }}
                  title="Chọn bộ lọc"
                />
              ))}
            </div>
          </motion.div>
        )}

        {step === 'review' && (
          <motion.div key="review" className="w-full h-full" initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <ReviewScreen
              photos={photos}
              template={config.template}
              onRetake={handleRetakeSingle}
              onRetakeAll={handleRestart}
              onConfirm={handleConfirmReview}
            />
          </motion.div>
        )}

        {step === 'editing' && resultUrl && (
          <motion.div key="editing" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <StickerEditor
              imageUrl={resultUrl}
              onConfirm={handleStickerComplete}
              onCancel={() => setStep('review')}
            />
          </motion.div>
        )}

        {step === 'result' && resultUrl && (
          <motion.div key="result" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ResultView
              imageBlob={resultBlob!}
              imageUrl={resultUrl}
              onRestart={handleRestart}
              onConfirm={handleConfirmFinal}
            />
          </motion.div>
        )}

        {step === 'error' && (
          <motion.div key="error" className="w-full h-full flex flex-col items-center justify-center p-6 bg-background text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 bg-primary-color/10 rounded-full flex items-center justify-center mb-4 border border-primary-color/20">
              <Icon name="alert" size={32} className="text-primary-color" />
            </div>
            <h2 className="text-xl font-black text-foreground mb-2 uppercase tracking-wide font-sans">Đã xảy ra lỗi</h2>
            <p className="text-muted-color mb-6 text-xs max-w-xs">{errorMessage}</p>
            <button 
              onClick={handleRestart} 
              className="px-6 py-2 bg-primary-color hover:bg-primary-color/90 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all"
            >
              Quay lại trang chính
            </button>
          </motion.div>
        )}

        {step === 'timeout' && (
          <motion.div key="timeout" className="w-full h-full flex flex-col items-center justify-center p-6 bg-background text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 bg-primary-color/10 rounded-full flex items-center justify-center mb-4 border border-primary-color/20">
              <Icon name="hourglass" size={32} className="text-primary-color" />
            </div>
            <h2 className="text-xl font-black text-foreground mb-2 uppercase tracking-wide font-sans">Hết thời gian chờ</h2>
            <p className="text-muted-color mb-6 text-xs max-w-xs">Hệ thống đã tự động làm mới để phục vụ lượt chụp tiếp theo.</p>
            <button 
              onClick={handleRestart} 
              className="px-6 py-2 bg-primary-color hover:bg-primary-color/90 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all"
            >
              Tôi đã quay lại
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default PhotoboothSystem;
