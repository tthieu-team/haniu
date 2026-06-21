'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';

import { PhotoboothStep, PhotoboothMode, PhotoboothConfig, CapturedPhoto, Sticker, FaceFilterType } from './types';
import { IdleState } from './IdleState';
import { ModeSelector } from './ModeSelector';
import { CameraView } from './CameraView';
import { CountdownTimer } from './CountdownTimer';
import { ReviewScreen } from './ReviewScreen';
import { StickerEditor } from './StickerEditor';
import { FrameEditor } from './FrameEditor';
import { ResultView } from './ResultView';
import { generateComposition } from './composition';
import { DEFAULT_TEMPLATES } from './templates';
import { playSound } from './sounds';
import { StartModeOverlay } from './StartModeOverlay';
import { FaceFilterSelector } from './FaceFilterSelector';
import { photoboothService } from '@/services/photobooth.service';
import { usePhotoboothStore } from '@/store/photobooth';
import { PhotoboothTemplate } from './types';


interface PhotoboothSystemProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const PhotoboothSystem: React.FC<PhotoboothSystemProps> = ({ onCapture, onClose }) => {
  const trans = useTranslate();
  const [step, setStep] = useState<PhotoboothStep>('idle');
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string>('');
  const [cleanFrameUrl, setCleanFrameUrl] = useState<string>('');
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [cameraReady, setCameraReady] = useState(false);
  const [retakeIndex, setRetakeIndex] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [captureMode, setCaptureMode] = useState<'auto' | 'manual'>('auto');
  const [hasSelectedCaptureMode, setHasSelectedCaptureMode] = useState(false);
  const [waitingForNextCapture, setWaitingForNextCapture] = useState(false);

  // Face Filter state
  const [faceFilter, setFaceFilter] = useState<FaceFilterType>('none');
  const [faceFilterLoading, setFaceFilterLoading] = useState(false);

  // Aspect Ratio state
  const [aspectRatio, setAspectRatio] = useState<string>('template');



  const { activeTemplates, settings, fetchPhotoboothData } = usePhotoboothStore();

  const [config, setConfig] = useState<PhotoboothConfig>({
    mode: 'grid-4',
    template: DEFAULT_TEMPLATES['grid-4'],
    filter: 'none',
    frameStyle: 'white',
    countdown: 5,
    userName: '',
    showDate: true
  });

  useEffect(() => {
    fetchPhotoboothData();
  }, [fetchPhotoboothData]);

  useEffect(() => {
    if (settings) {
      setConfig(prev => ({
        ...prev,
        countdown: settings.countdown,
        frameColor: settings.defaultFrameColor,
        userName: settings.watermarkText,
        showDate: settings.showDate
      }));
    }
  }, [settings]);

  useEffect(() => {
    if (activeTemplates && activeTemplates.length > 0) {
      const defaultTpl = activeTemplates[0];
      setConfig(prev => ({
        ...prev,
        mode: defaultTpl.id as any,
        template: defaultTpl
      }));
    }
  }, [activeTemplates]);


  // Cleanup Result URLs on unmount
  const resultUrlRef = useRef(resultUrl);
  const cleanFrameUrlRef = useRef(cleanFrameUrl);

  useEffect(() => {
    resultUrlRef.current = resultUrl;
  }, [resultUrl]);

  useEffect(() => {
    cleanFrameUrlRef.current = cleanFrameUrl;
  }, [cleanFrameUrl]);

  useEffect(() => {
    return () => {
      if (resultUrlRef.current) URL.revokeObjectURL(resultUrlRef.current);
      if (cleanFrameUrlRef.current) URL.revokeObjectURL(cleanFrameUrlRef.current);
    };
  }, []);

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

  const handleModeSelect = (mode: string, userName: string) => {
    playSound('click');
    const customTpl = activeTemplates.find(t => t.id === mode);
    let template: PhotoboothTemplate;
    
    if (customTpl) {
      template = customTpl;
    } else {
      template = DEFAULT_TEMPLATES[mode] || DEFAULT_TEMPLATES['grid-4'];
    }

    setConfig(prev => ({ ...prev, mode: mode as any, template, userName: userName || prev.userName }));
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
      if (captureMode === 'manual' && photos.length + 1 < config.template.slots.length) {
        setWaitingForNextCapture(true);
      }
    }
  }, [retakeIndex, photos.length, config.template.slots.length, captureMode]);

  useEffect(() => {
    if ((step === 'countdown' || step === 'capturing') && retakeIndex === null) {
      if (photos.length >= config.template.slots.length) {
        setStep('review');
        playSound('success');
      } else if (step === 'capturing') {
        if (captureMode === 'auto') {
          const timer = setTimeout(() => {
            setStep('countdown');
          }, 1500);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [photos.length, config.template.slots.length, step, retakeIndex, captureMode]);

  const handleFinishCountdown = () => {
    setIsCapturing(true);
    setStep('capturing');
  };

  const handleRetakeSingle = (index: number) => {
    playSound('click');
    setRetakeIndex(index);
    setWaitingForNextCapture(true);
    setStep('countdown');
  };

  const handleConfirmReview = async () => {
    playSound('click');
    try {
      const blob = await generateComposition(photos, config);
      const url = URL.createObjectURL(blob);
      if (cleanFrameUrl) URL.revokeObjectURL(cleanFrameUrl);
      if (resultUrl && resultUrl !== cleanFrameUrl) URL.revokeObjectURL(resultUrl);
      setCleanFrameUrl(url);
      setResultBlob(blob);
      setResultUrl(url);
      setStep('design-menu');
    } catch (err) {
      console.error(err);
      setErrorMessage('Không thể ghép bản phối ảnh. Vui lòng chụp lại.');
      setStep('error');
    }
  };

  const handleFrameConfirm = async (updatedConfig: PhotoboothConfig) => {
    playSound('click');
    setConfig(updatedConfig);
    try {
      const cleanBlob = await generateComposition(photos, updatedConfig);
      const cleanUrl = URL.createObjectURL(cleanBlob);
      if (cleanFrameUrl) URL.revokeObjectURL(cleanFrameUrl);
      setCleanFrameUrl(cleanUrl);

      const finalBlob = await generateComposition(photos, updatedConfig, stickers);
      const finalUrl = URL.createObjectURL(finalBlob);
      if (resultUrl && resultUrl !== cleanFrameUrl) URL.revokeObjectURL(resultUrl);
      setResultBlob(finalBlob);
      setResultUrl(finalUrl);
      setStep('design-menu');
    } catch (err) {
      console.error(err);
      setErrorMessage('Không thể cập nhật thiết kế khung. Vui lòng chọn lại.');
      setStep('error');
    }
  };

  const handleStickerComplete = async (newStickers: Sticker[]) => {
    playSound('click');
    setStickers(newStickers);
    try {
      const finalBlob = await generateComposition(photos, config, newStickers);
      const url = URL.createObjectURL(finalBlob);
      if (resultUrl && resultUrl !== cleanFrameUrl) URL.revokeObjectURL(resultUrl);
      setResultBlob(finalBlob);
      setResultUrl(url);
      setStep('design-menu');
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
    if (cleanFrameUrl) URL.revokeObjectURL(cleanFrameUrl);
    setCleanFrameUrl('');
    setStickers([]);
    setErrorMessage(null);
    setCameraReady(false);
    setStep('idle');
    setCaptureMode('auto');
    setHasSelectedCaptureMode(false);
    setWaitingForNextCapture(false);
    setFaceFilter('none');
    setAspectRatio('free');
  };

  const handleConfirmFinal = (blob: Blob, shouldClose: boolean = true) => {
    playSound('click');
    const file = new File([blob], `haniu-photobooth-${Date.now()}.png`, { type: 'image/png' });
    onCapture(file);
    if (shouldClose) {
      onClose();
    } else {
      handleRestart();
      setStep('select-mode');
    }
  };

  return (
    <div
      className="w-full h-full min-h-0 flex flex-col bg-background relative font-sans text-foreground overflow-hidden select-none"
      onMouseMove={resetIdleTimer}
      onClick={resetIdleTimer}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,var(--card)_0%,var(--background)_100%)] pointer-events-none z-0" />

      {/* Close button inside modal photobooth system */}
      {step !== 'editing' && step !== 'result' && step !== 'edit-frame' && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-card-bg hover:bg-accent-color/20 border border-border-color rounded-full transition-all text-muted-color hover:text-foreground cursor-pointer"
          title={trans("Đóng Photobooth")}
        >
          <Icon name="close" size={16} />
        </button>
      )}

      <AnimatePresence mode="wait">
        {step === 'idle' && (
          <motion.div key="idle" className="w-full h-full relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <IdleState onStart={handleStart} />
          </motion.div>
        )}

        {step === 'select-mode' && (
          <motion.div key="mode" className="w-full h-full relative z-10" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }}>
            <ModeSelector onSelect={handleModeSelect} customTemplates={activeTemplates} />
          </motion.div>
        )}

        {(step === 'countdown' || step === 'capturing') && (
          <motion.div key="camera" className="w-full h-full relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {(() => {
              const currentSlotIndex = retakeIndex !== null ? retakeIndex : photos.length;
              const currentSlot = config.template.slots[currentSlotIndex] || config.template.slots[0];
              const slotRatio = currentSlot ? `${currentSlot.width}:${currentSlot.height}` : 'free';
              const resolvedAspectRatio = aspectRatio === 'template' ? slotRatio : aspectRatio;
              return (
                <CameraView
                  isCapturing={isCapturing}
                  onCapture={handleCapture}
                  onReady={() => setCameraReady(true)}
                  faceFilter={faceFilter}
                  onFaceFilterLoading={setFaceFilterLoading}
                  aspectRatio={resolvedAspectRatio}
                />
              );
            })()}

            {/* Face AI Loading Overlay — block interaction until model is ready */}
            {faceFilterLoading && cameraReady && (
              <div className="absolute inset-0 z-45 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 max-w-xs shadow-2xl"
                >
                  <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-3 border-white/10" />
                    <div className="absolute inset-0 rounded-full border-3 border-t-rose-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-lg">🤖</div>
                  </div>
                  <div className="text-center">
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      {trans('Đang tải Face AI')}
                    </h4>
                    <p className="text-[9px] text-zinc-400 mt-1">
                      {trans('Mô hình nhận diện khuôn mặt đang được khởi tạo...')}
                    </p>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
                      initial={{ width: '10%' }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 8, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              </div>
            )}

            {!hasSelectedCaptureMode && cameraReady && !faceFilterLoading && (
              <StartModeOverlay
                onSelect={(mode) => {
                  setCaptureMode(mode);
                  setHasSelectedCaptureMode(true);
                  if (mode === 'manual') {
                    setWaitingForNextCapture(true);
                  }
                }}
              />
            )}

            {step === 'countdown' && cameraReady && hasSelectedCaptureMode && !waitingForNextCapture && (
              <CountdownTimer seconds={config.countdown} onFinish={handleFinishCountdown} />
            )}

            {waitingForNextCapture && (
              <div className="absolute inset-x-0 top-0 bottom-24 z-30 flex flex-col items-center justify-center p-4 pointer-events-none">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-5 pointer-events-auto"
                >
                  {/* Photo count indicator */}
                  <div className="px-4 py-2 bg-black/70 backdrop-blur-md rounded-full border border-white/10 shadow-lg">
                    <p className="text-[10px] font-black text-white uppercase tracking-wider">
                      {trans('ẢNH')} {photos.length} / {config.template.slots.length} ✓
                    </p>
                  </div>

                  {/* Large shutter button */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      playSound('click');
                      setWaitingForNextCapture(false);
                      setStep('countdown');
                    }}
                    className="w-20 h-20 rounded-full bg-white/90 border-4 border-rose-500 shadow-2xl shadow-rose-500/30 flex items-center justify-center cursor-pointer transition-colors hover:bg-white active:bg-rose-50"
                  >
                    <div className="w-14 h-14 rounded-full bg-rose-500 flex items-center justify-center">
                      <Icon name="camera" size={24} className="text-white" />
                    </div>
                  </motion.button>

                  <p className="text-[9px] font-bold text-white/60 uppercase tracking-wider text-center">
                    {trans('Nhấn để chụp tấm tiếp theo')}
                  </p>
                </motion.div>
              </div>
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
                {retakeIndex !== null ? `${trans("CHỤP LẠI ẢNH")} ${retakeIndex + 1}` : `${trans("ẢNH")} ${photos.length + 1} / ${config.template.slots.length}`}
              </p>
            </div>



            {/* Bottom Controls: 2 rows */}
            <div className="absolute bottom-4 left-4 right-4 z-40 flex flex-col gap-2.5">
              {/* Row 1: Face Filters */}
              <div className="flex justify-center">
                <FaceFilterSelector
                  activeFilter={faceFilter}
                  onSelect={setFaceFilter}
                  isLoading={faceFilterLoading}
                />
              </div>
              {/* Row 2: Aspect Ratio */}
              <div className="flex justify-center gap-1.5 flex-wrap">
                {[
                  { id: 'template', label: 'Theo khung' },
                  { id: 'free', label: 'Tự do' },
                  { id: '1:1', label: '1:1' },
                  { id: '3:4', label: '3:4' },
                  { id: '4:3', label: '4:3' },
                  { id: '9:16', label: '9:16' },
                  { id: '16:9', label: '16:9' },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setAspectRatio(r.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border ${
                      aspectRatio === r.id
                        ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30 scale-105'
                        : 'bg-black/50 text-white/70 border-white/10 hover:bg-black/70 hover:text-white backdrop-blur-sm'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 'review' && (
          <motion.div key="review" className="w-full h-full relative z-10" initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <ReviewScreen
              photos={photos}
              template={config.template}
              onRetake={handleRetakeSingle}
              onRetakeAll={handleRestart}
              onConfirm={handleConfirmReview}
            />
          </motion.div>
        )}

        {step === 'design-menu' && (
          <motion.div key="design-menu" className="w-full h-full flex flex-col items-center justify-start sm:justify-center p-4 sm:p-6 md:p-8 relative z-10 overflow-y-auto custom-scrollbar" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-full max-w-4xl bg-card-bg border border-border-color rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              
              {/* Left Column: Image Preview */}
              {resultUrl && (
                <div className="w-full md:w-[320px] shrink-0 bg-black/5 dark:bg-black/30 rounded-2xl p-1.5 border border-border-color/60 shadow-inner overflow-y-auto max-h-[400px] custom-scrollbar flex flex-col items-center justify-start">
                  <div className="w-full flex justify-center">
                    <img 
                      src={resultUrl} 
                      alt="Composition Preview" 
                      className="w-full h-auto object-contain rounded-lg shadow-lg border border-white/5 transition-transform duration-300 hover:scale-102"
                    />
                  </div>
                  {/* Khoảng trống để cuộn qua phần chân ảnh */}
                  <div className="h-36 w-full shrink-0" />
                </div>
              )}

              {/* Right Column: Controls */}
              <div className="flex-1 flex flex-col justify-start gap-6 w-full">
                <div className="text-center md:text-left pb-2">
                  <span className="inline-block px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-450 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
                    {trans("BƯỚC CHỈNH SỬA HÌNH ẢNH 🎨")}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-foreground uppercase tracking-tight font-sans">{trans("Chọn chế độ thiết kế")}</h2>
                  <p className="text-[11px] text-muted-color mt-1 max-w-md">{trans("Lựa chọn một trong các tính năng bên dưới để bắt đầu trang trí bức ảnh kỷ niệm của bạn.")}</p>
                </div>

                {/* Grid of Options */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full px-2 sm:px-0">
                  <button
                    onClick={() => setStep('edit-frame')}
                    className="aspect-square rounded-2xl sm:rounded-3xl border border-dashed border-rose-300 hover:border-rose-500 hover:bg-rose-500/5 text-slate-800 dark:text-zinc-100 flex flex-col items-center justify-center gap-1.5 sm:gap-3 p-2.5 sm:p-6 text-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs w-full"
                  >
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                      <Icon name="palette" size={20} className="sm:scale-125" />
                    </div>
                    <div>
                      <p className="font-black text-[9px] sm:text-[12px] uppercase tracking-wide">{trans("Chữ ký & Ngày")}</p>
                      <p className="text-[7.5px] sm:text-[9px] text-muted-color font-normal mt-0.5 sm:mt-1 leading-tight line-clamp-2 sm:line-clamp-none">{trans("Thêm chữ ký cá nhân và ngày chụp kỷ niệm vào bức ảnh.")}</p>
                    </div>
                  </button>

                  <button
                    onClick={() => setStep('editing')}
                    className="aspect-square rounded-2xl sm:rounded-3xl border border-dashed border-rose-300 hover:border-rose-500 hover:bg-rose-500/5 text-slate-800 dark:text-zinc-100 flex flex-col items-center justify-center gap-1.5 sm:gap-3 p-2.5 sm:p-6 text-center transition-all cursor-pointer hover:scale-105 active:scale-95 shadow-xs w-full"
                  >
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                      <Icon name="heart" size={20} className="sm:scale-125" />
                    </div>
                    <div>
                      <p className="font-black text-[9px] sm:text-[12px] uppercase tracking-wide">{trans("Trang trí Sticker")}</p>
                      <p className="text-[7.5px] sm:text-[9px] text-muted-color font-normal mt-0.5 sm:mt-1 leading-tight line-clamp-2 sm:line-clamp-none">{trans("Dán nhãn biểu tượng đáng yêu của Haniu hoặc emoji.")}</p>
                    </div>
                  </button>
                </div>

                {/* Actions Footer */}
                <div className="pt-4 border-t border-border-color w-full flex flex-col gap-2.5">
                  <button
                    onClick={() => setStep('result')}
                    className="w-full h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[11px] uppercase tracking-wider shadow-md shadow-rose-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                  >
                    <Icon name="check" size={14} />
                    {trans("Xem kết quả & Hoàn tất")}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirmFinal(resultBlob!, false)}
                      className="flex-1 h-9 rounded-xl border border-border-color hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-350 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      <Icon name="camera" size={12} className="text-rose-500" />
                      {trans("Lưu & Chụp tiếp")}
                    </button>

                    <button
                      onClick={() => setStep('review')}
                      className="flex-1 h-9 rounded-xl border border-border-color hover:bg-slate-50 dark:hover:bg-zinc-800 text-muted-color font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer"
                    >
                      {trans("Quay lại Review")}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {step === 'edit-frame' && (
          <motion.div key="edit-frame" className="w-full h-full relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FrameEditor
              photos={photos}
              config={config}
              stickers={stickers}
              onConfirm={handleFrameConfirm}
              onCancel={() => setStep('design-menu')}
            />
          </motion.div>
        )}

        {step === 'editing' && (cleanFrameUrl || resultUrl) && (
          <motion.div key="editing" className="w-full h-full relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <StickerEditor
              imageUrl={cleanFrameUrl || resultUrl}
              initialStickers={stickers}
              onConfirm={handleStickerComplete}
              onCancel={() => setStep('design-menu')}
            />
          </motion.div>
        )}

        {step === 'result' && resultUrl && (
          <motion.div key="result" className="w-full h-full relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ResultView
              imageBlob={resultBlob!}
              imageUrl={resultUrl}
              onRestart={handleRestart}
              onConfirm={handleConfirmFinal}
              onBackToEdit={() => setStep('design-menu')}
            />
          </motion.div>
        )}

        {step === 'error' && (
          <motion.div key="error" className="w-full h-full flex flex-col items-center justify-center p-6 bg-background text-center relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 bg-primary-color/10 rounded-full flex items-center justify-center mb-4 border border-primary-color/20">
              <Icon name="alert" size={32} className="text-primary-color" />
            </div>
            <h2 className="text-xl font-black text-foreground mb-2 uppercase tracking-wide font-sans">{trans("Đã xảy ra lỗi")}</h2>
            <p className="text-muted-color mb-6 text-xs max-w-xs">{errorMessage}</p>
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all"
            >
              {trans("Quay lại trang chính")}
            </button>
          </motion.div>
        )}

        {step === 'timeout' && (
          <motion.div key="timeout" className="w-full h-full flex flex-col items-center justify-center p-6 bg-background text-center relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="w-16 h-16 bg-primary-color/10 rounded-full flex items-center justify-center mb-4 border border-primary-color/20">
              <Icon name="hourglass" size={32} className="text-primary-color" />
            </div>
            <h2 className="text-xl font-black text-foreground mb-2 uppercase tracking-wide font-sans">{trans("Hết thời gian chờ")}</h2>
            <p className="text-muted-color mb-6 text-xs max-w-xs">{trans("Hệ thống đã tự động làm mới để phục vụ lượt chụp tiếp theo.")}</p>
            <button
              onClick={handleRestart}
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-sm transition-all"
            >
              {trans("Tôi đã quay lại")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default PhotoboothSystem;
