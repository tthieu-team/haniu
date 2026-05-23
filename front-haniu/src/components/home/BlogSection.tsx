'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function BlogSection() {
  const blog = useHomeLayoutStore((state) => state.blog);
  const isVisible = useHomeLayoutStore((state) => state.visibility.blog);

  if (!isVisible) return null;

  return (
    <section id="blog" className="py-10 sm:py-16 bg-slate-50/50 dark:bg-zinc-900/10 border-y border-slate-200 dark:border-zinc-800/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Title */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto px-3 sm:px-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 dark:bg-rose-500/10 border border-rose-500/20">
            <Icon name="✨" size={10} className="animate-pulse" /> GIFT INSPIRATION
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-zinc-100 leading-tight">
            Góc Chia Sẻ{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500">
              Kinh Nghiệm
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed font-light">
            {blog.subtitle}
          </p>
        </div>

        {/* Blog items grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {blog.items.slice(0, 4).map((post, idx) => (
            <article
              key={post.id}
              className={`group bg-white/70 dark:bg-zinc-900/40 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-2xl sm:rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex-col h-full ${
                idx === 3 ? 'hidden md:hidden min-[0px]:flex' : 'flex'
              }`}
            >
              {/* Featured Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-[0.5deg] transition-all duration-1000 ease-out"
                />
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-2 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200/50 dark:border-zinc-800/80 shadow-md">
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-600 dark:text-zinc-350 tracking-wider">
                    {post.date}
                  </span>
                </div>
              </div>

              {/* Text details */}
              <div className="p-3.5 sm:p-6 md:p-8 flex flex-col justify-between flex-1 space-y-3 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-3.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-zinc-100 group-hover:text-rose-500 transition-colors line-clamp-2 leading-snug tracking-wide">
                    <a href={post.href}>{post.title}</a>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-zinc-400 font-light line-clamp-2 sm:line-clamp-3 leading-normal sm:leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-1 sm:pt-2">
                  <a
                    href={post.href}
                    className="inline-flex items-center text-[10px] sm:text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-455 dark:hover:text-rose-400 transition-colors group/link"
                  >
                    <span>Đọc tiếp</span>
                    <Icon
                      name="→"
                      size={12}
                      className="ml-1 transform group-hover/link:translate-x-1.5 transition-transform duration-300 w-3 h-3 sm:w-4.5 sm:h-4.5"
                    />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
