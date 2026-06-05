'use client';

import { useState, useEffect } from 'react';
import { useHomeLayoutStore, DEFAULT_STATE } from '@/store/homeLayout';
import { getFullImageUrl } from '@/lib/api';
import Icon from '@/components/common/Icons';

export default function StorySection() {
  const [mounted, setMounted] = useState(false);
  const story = useHomeLayoutStore((state) => state.story);
  const isVisible = useHomeLayoutStore((state) => state.visibility.story);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isVisible) return null;

  const videoUrl = getFullImageUrl(story.videoUrl);
  const placeholderUrl = getFullImageUrl(story.videoPlaceholderUrl);

  const handlePlayVideo = () => {
    setVideoError(false);
    setIsPlaying(true);
  };

  return (
    <section id="story" className="py-10 sm:py-16 border-t border-slate-200 dark:border-zinc-800/80 scroll-mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left text */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
              <Icon name="✨" size={10} className="animate-pulse" /> {story.subtitle}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 dark:text-zinc-100 tracking-tight leading-tight">
              {story.title}
              {story.titleHighlight && (
                <>
                  <br className="hidden md:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500 font-serif italic font-light">
                    {story.titleHighlight}
                  </span>
                </>
              )}
              {story.titlePart2 && <> {story.titlePart2}</>}
            </h2>
          </div>
          <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-light whitespace-pre-line tracking-wide">
            {story.content}
          </p>
        </div>

        {/* Right media mockup */}
        <div className="lg:col-span-7">
          <div className="relative group overflow-hidden rounded-[36px] border border-slate-200 dark:border-zinc-800 shadow-2xl aspect-video bg-zinc-950 ring-4 ring-slate-100/50 dark:ring-zinc-900/40">
            {isPlaying ? (
              (!videoUrl || videoError) ? (
                <div className="absolute inset-0 flex flex-col justify-center items-center gap-2 bg-zinc-950 p-6 text-center text-white">
                  <Icon name="alert-triangle" size={32} className="text-amber-500 animate-bounce" />
                  <span className="text-xs font-bold text-zinc-300">Không thể phát video</span>
                  <span className="text-[10px] text-zinc-400 max-w-xs break-all mt-1">
                    {!videoUrl 
                      ? 'Đường dẫn video chưa được thiết lập hoặc đang trống.' 
                      : `Không tải được tài nguyên từ máy chủ. Vui lòng kiểm tra lại đường dẫn video hoặc khởi động lại máy chủ backend.`}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono break-all mt-1 bg-zinc-900 px-2.5 py-1.5 rounded-lg max-w-sm">
                    URL: {videoUrl || 'trống'}
                  </span>
                  <button
                    onClick={() => {
                      setVideoError(false);
                      setIsPlaying(false);
                    }}
                    className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold rounded-xl cursor-pointer transition-colors border border-zinc-700"
                  >
                    Quay lại
                  </button>
                </div>
              ) : (
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  controls
                  autoPlay
                  playsInline
                  onError={() => setVideoError(true)}
                />
              )
            ) : (
              <>
                <img
                  src={placeholderUrl}
                  alt="Crafts behind Haniu"
                  className="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-60 transition-all duration-1000 ease-out"
                />
                {/* Play Button visual overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 bg-zinc-950/20 group-hover:bg-zinc-950/40 transition-colors duration-500">
                  <button
                    onClick={handlePlayVideo}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 scale-95 group-hover:scale-105 transition-all duration-500 cursor-pointer ring-4 ring-white/30 group-hover:ring-white/50 flex"
                    title="Phát video"
                  >
                    <Icon name="play" size={22} className="text-white m-auto pl-1" />
                  </button>
                  <span className="text-[10px] font-extrabold tracking-widest text-white uppercase bg-black/60 backdrop-blur-md px-4.5 py-2.5 rounded-2xl border border-white/10 shadow-lg">
                    {story.videoTitle}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
