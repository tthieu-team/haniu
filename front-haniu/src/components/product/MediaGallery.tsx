'use client';

import { useState, useEffect } from 'react';
import { getFullImageUrl } from '@/lib/api';

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

  const [activeMedia, setActiveMedia] = useState<any>(() => {
    if (combinedMedia.length > 0) {
      return combinedMedia.find(m => m.isThumbnail) || combinedMedia[0];
    }
    return null;
  });

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
  }, [mediaList, videoUrl, activeMedia]);

  if (combinedMedia.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 dark:bg-zinc-800 rounded-3xl overflow-hidden flex items-center justify-center text-slate-400">
        <span>No image or video available</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="aspect-square bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-sm relative">
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
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Sub thumbnails */}
      {combinedMedia.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {combinedMedia.map((med, idx) => (
            <button
              key={med.id || idx}
              onClick={() => setActiveMedia(med)}
              className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 bg-white ${
                activeMedia?.url === med.url ? 'border-rose-500 shadow-sm' : 'border-transparent opacity-80 hover:opacity-100'
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
    </div>
  );
}
