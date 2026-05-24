'use client';

import { useState, useEffect } from 'react';
import { getFullImageUrl } from '@/lib/api';

interface Media {
  id: string;
  url: string;
  type: string;
  altText?: string;
  isThumbnail: boolean;
}

interface MediaGalleryProps {
  mediaList?: Media[];
  name: string;
}

export default function MediaGallery({ mediaList, name }: MediaGalleryProps) {
  const [activeImage, setActiveImage] = useState(() => {
    if (mediaList && mediaList.length > 0) {
      return mediaList.find(m => m.isThumbnail)?.url || mediaList[0].url;
    }
    return '';
  });

  useEffect(() => {
    if (mediaList && mediaList.length > 0) {
      const thumb = mediaList.find(m => m.isThumbnail)?.url || mediaList[0].url;
      setActiveImage(thumb);
    }
  }, [mediaList]);

  if (!mediaList || mediaList.length === 0) {
    return (
      <div className="aspect-square bg-slate-100 dark:bg-zinc-800 rounded-3xl overflow-hidden flex items-center justify-center text-slate-400">
        <span>No image available</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="aspect-square bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-zinc-800 shadow-sm relative">
        <img
          src={getFullImageUrl(activeImage)}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Sub thumbnails */}
      {mediaList.length > 1 && (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {mediaList.map((med, idx) => (
            <button
              key={med.id || idx}
              onClick={() => setActiveImage(med.url)}
              className={`relative w-20 aspect-square rounded-xl overflow-hidden border-2 bg-white ${
                activeImage === med.url ? 'border-rose-500 shadow-sm' : 'border-transparent opacity-80 hover:opacity-100'
              }`}
            >
              <img src={getFullImageUrl(med.url)} alt="sub" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
