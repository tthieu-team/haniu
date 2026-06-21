'use client';

import { useState, useEffect } from 'react';
import { getFullImageUrl } from '@/lib/api';
import { createPortal } from 'react-dom';

interface Media {
  id?: string;
  url: string;
  type: string;
  altText?: string;
  isThumbnail: boolean;
}

interface MediaGalleryProps {
  mediaList?: Media[];
  name: string;
  videoUrl?: string | null;
}

export default function MediaGallery({ mediaList, name, videoUrl }: MediaGalleryProps) {
  const combinedMedia = [
    ...(videoUrl ? [{ url: videoUrl, type: 'VIDEO', isThumbnail: false, id: 'video-main' }] : []),
    ...(mediaList || [])
  ];

  const [touchStartX, setTouchStartX] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const [activeMedia, setActiveMedia] = useState<any>(() => {
    if (combinedMedia.length > 0) {
      return combinedMedia.find(m => m.isThumbnail) || combinedMedia[0];
    }
    return null;
  });

  const handlePrev = () => {
    if (combinedMedia.length <= 1) return;
    const currentIndex = combinedMedia.findIndex(m => m.url === activeMedia?.url);
    const prevIndex = (currentIndex - 1 + combinedMedia.length) % combinedMedia.length;
    setActiveMedia(combinedMedia[prevIndex]);
  };

  const handleNext = () => {
    if (combinedMedia.length <= 1) return;
    const currentIndex = combinedMedia.findIndex(m => m.url === activeMedia?.url);
    const nextIndex = (currentIndex + 1) % combinedMedia.length;
    setActiveMedia(combinedMedia[nextIndex]);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.changedTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
  };

  useEffect(() => {
    if (combinedMedia.length > 0) {
      const thumb = combinedMedia.find(m => m.isThumbnail) || combinedMedia[0];
      setActiveMedia(thumb);
    } else {
      setActiveMedia(null);
    }
  }, [mediaList, videoUrl]);

  // Auto-slide effect
  useEffect(() => {
    if (combinedMedia.length <= 1) return;
    if (isFullscreen) return; // Pause auto-slide when viewing fullscreen
    if (activeMedia?.type === 'VIDEO') return; // Pause auto-slide when viewing video

    const interval = setInterval(() => {
      setActiveMedia((current: any) => {
        if (!current) return combinedMedia[0];
        const currentIndex = combinedMedia.findIndex(m => m.url === current.url);
        if (currentIndex === -1) return combinedMedia[0];
        const nextIndex = (currentIndex + 1) % combinedMedia.length;
        return combinedMedia[nextIndex];
      });
    }, 4000); // transition every 4 seconds

    return () => clearInterval(interval);
  }, [mediaList, videoUrl, activeMedia, isFullscreen]);

  if (combinedMedia.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 dark:bg-zinc-800 rounded-3xl overflow-hidden flex items-center justify-center text-slate-400">
        <span>No image or video available</span>
      </div>
    );
  }

  const toggleZoom = () => {
    setZoomScale(prev => (prev === 1 ? 2.5 : 1));
  };

  const handleDoubleClick = () => {
    toggleZoom();
  };

  return (
    <div className="space-y-6">
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => setIsFullscreen(true)}
        className="group aspect-square bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-sm relative select-none cursor-zoom-in"
      >
        {activeMedia?.type === 'VIDEO' ? (
          <video
            src={getFullImageUrl(activeMedia.url)}
            controls
            autoPlay
            muted
            className="w-full h-full object-contain bg-black"
          />
        ) : (
          <img
            src={getFullImageUrl(activeMedia?.url || '')}
            alt={name}
            className="w-full h-full object-cover pointer-events-none"
          />
        )}

        {/* Swipe dots indicators for mobile */}
        {combinedMedia.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 sm:hidden">
            {combinedMedia.map((_, idx) => {
              const isActive = combinedMedia[idx].url === activeMedia?.url;
              return (
                <span 
                  key={idx} 
                  onClick={(e) => { e.stopPropagation(); setActiveMedia(combinedMedia[idx]); }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${isActive ? 'w-4 bg-rose-500' : 'w-1.5 bg-slate-300 dark:bg-zinc-700'}`}
                />
              );
            })}
          </div>
        )}

        {/* Desktop slider arrows */}
        {combinedMedia.length > 1 && (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-slate-200/50 dark:border-zinc-850 transition-all opacity-0 group-hover:opacity-100 max-sm:hidden cursor-pointer active:scale-95"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md hover:bg-white dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 w-10 h-10 rounded-full flex items-center justify-center shadow-md border border-slate-200/50 dark:border-zinc-850 transition-all opacity-0 group-hover:opacity-100 max-sm:hidden cursor-pointer active:scale-95"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Sub thumbnails */}
      {combinedMedia.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {combinedMedia.map((med, idx) => (
            <button
              key={med.id || idx}
              onClick={() => setActiveMedia(med)}
              className={`flex-shrink-0 relative w-20 aspect-square rounded-xl overflow-hidden border-2 bg-white transition-all ${
                activeMedia?.url === med.url ? 'border-rose-500 shadow-sm scale-95' : 'border-transparent opacity-85 hover:opacity-100'
              }`}
            >
              {med.type === 'VIDEO' ? (
                <div className="relative w-full h-full bg-slate-950 flex items-center justify-center">
                  <video src={getFullImageUrl(med.url)} className="w-full h-full object-cover opacity-60 animate-pulse" preload="metadata" muted />
                  <span className="absolute inset-0 flex items-center justify-center text-white bg-black/30">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              ) : (
                <img src={getFullImageUrl(med.url)} alt="sub" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Overlay Media Viewer with pinch-to-zoom simulation */}
      {isFullscreen && mounted && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/98 backdrop-blur-lg flex flex-col justify-between select-none animate-fade-in"
          onClick={() => { setIsFullscreen(false); setZoomScale(1); }}
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 z-50 bg-gradient-to-b from-black/60 to-transparent w-full">
            <span className="text-white text-xs font-bold font-sans tracking-widest bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
              {combinedMedia.findIndex(m => m.url === activeMedia?.url) + 1} / {combinedMedia.length}
            </span>
            <div className="flex items-center gap-3">
              {activeMedia?.type !== 'VIDEO' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
                  className="bg-white/10 hover:bg-white/20 active:scale-90 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/5"
                  title="Zoom In/Out"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    {zoomScale === 1 ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    )}
                  </svg>
                </button>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); setIsFullscreen(false); setZoomScale(1); }}
                className="bg-white/10 hover:bg-white/20 active:scale-90 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer border border-white/5"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <div 
            onTouchStart={handleTouchStart}
            onTouchEnd={(e) => {
              if (zoomScale === 1) {
                handleTouchEnd(e);
              }
            }}
            className="flex-1 w-full h-full relative flex items-center justify-center overflow-auto px-4"
          >
            <div 
              className="relative max-w-full max-h-[80vh] flex items-center justify-center transition-all duration-300 ease-out"
              style={{ transform: `scale(${zoomScale})` }}
              onClick={(e) => e.stopPropagation()}
            >
              {activeMedia?.type === 'VIDEO' ? (
                <video
                  src={getFullImageUrl(activeMedia.url)}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
                />
              ) : (
                <img
                  src={getFullImageUrl(activeMedia?.url || '')}
                  alt={name}
                  onDoubleClick={handleDoubleClick}
                  className={`max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl select-none transition-transform duration-300 ${zoomScale > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
                />
              )}
            </div>

            {/* Overlay Navigation Arrows */}
            {combinedMedia.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); setZoomScale(1); handlePrev(); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 active:scale-90 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all border border-white/5 cursor-pointer max-sm:hidden"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setZoomScale(1); handleNext(); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 active:scale-90 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all border border-white/5 cursor-pointer max-sm:hidden"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Footer dot indicators */}
          {combinedMedia.length > 1 && (
            <div className="py-6 flex justify-center gap-2 z-50 bg-gradient-to-t from-black/60 to-transparent w-full">
              {combinedMedia.map((_, idx) => {
                const isActive = combinedMedia[idx].url === activeMedia?.url;
                return (
                  <span 
                    key={idx} 
                    onClick={(e) => { e.stopPropagation(); setZoomScale(1); setActiveMedia(combinedMedia[idx]); }}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${isActive ? 'w-6 bg-rose-500' : 'w-2 bg-zinc-650 hover:bg-zinc-400'}`}
                  />
                );
              })}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
