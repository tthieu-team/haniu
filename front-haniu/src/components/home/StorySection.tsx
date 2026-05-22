'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function StorySection() {
  const story = useHomeLayoutStore((state) => state.story);
  const isVisible = useHomeLayoutStore((state) => state.visibility.story);

  if (!isVisible) return null;

  return (
    <section className="py-20 border-t border-slate-100 dark:border-zinc-800/80">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left text */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-widest text-amber-500 uppercase block">
              {story.subtitle}
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100 sm:text-4xl">
              {story.title}
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-light whitespace-pre-line">
            {story.content}
          </p>
        </div>

        {/* Right media mockup */}
        <div className="lg:col-span-6">
          <div className="relative group overflow-hidden rounded-3xl border border-slate-150 dark:border-zinc-800 shadow-xl aspect-video bg-zinc-950">
            <img
              src={story.videoPlaceholderUrl}
              alt="Crafts behind Haniu"
              className="w-full h-full object-cover opacity-80 group-hover:scale-[1.03] transition-transform duration-700"
            />
            {/* Play Button visual overlay */}
            <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 bg-zinc-950/20 group-hover:bg-zinc-950/40 transition-colors duration-500">
              <span className="w-16 h-16 rounded-full bg-white text-zinc-900 flex items-center justify-center shadow-2xl scale-95 group-hover:scale-100 transition-all duration-300 cursor-pointer">
                <Icon name="play" size={20} className="fill-current text-zinc-900 ml-1" />
              </span>
              <span className="text-xs font-bold tracking-wider text-white uppercase bg-zinc-900/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10">
                {story.videoTitle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
