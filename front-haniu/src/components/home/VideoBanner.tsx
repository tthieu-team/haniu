'use client';

import { useEffect, useState } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import { getFullImageUrl } from '@/lib/api';
import { useTranslate } from '@/lib/translator';

export default function VideoBanner() {
  const [mounted, setMounted] = useState(false);
  const config = useHomeLayoutStore((state) => state.videoBanner);
  const isVisible = useHomeLayoutStore((state) => state.visibility.videoBanner);
  const translate = useTranslate();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isVisible) return null;

  const videoUrl = getFullImageUrl(config.videoUrl);
  const placeholderImage = getFullImageUrl(config.placeholderImage);

  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] overflow-hidden rounded-3xl shadow-xl bg-zinc-950 border border-zinc-800/40">
      {/* Video Loop Element */}
      {videoUrl && (
        <video
          key={videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          poster={placeholderImage}
          src={videoUrl}
        />
      )}

      {/* Dark overlay with gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/70" />

      {/* Content wrapper */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 max-w-3xl mx-auto space-y-6">
        <span className="text-[10px] font-bold tracking-widest text-amber-300 uppercase bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 backdrop-blur-xs">
          Cinematic Experience
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl text-white drop-shadow-md leading-tight">
          {translate(config.title)}
        </h2>
        <p className="text-sm sm:text-base text-zinc-300 font-light leading-relaxed max-w-xl">
          {translate(config.subtitle)}
        </p>
        <div className="pt-4">
          <a
            href={config.buttonHref}
            className="inline-flex items-center justify-center rounded-2xl bg-white hover:bg-rose-50 text-zinc-950 font-bold px-8 py-4 text-xs tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
          >
            {translate(config.buttonText)}
          </a>
        </div>
      </div>
    </section>
  );
}
