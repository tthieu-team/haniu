'use client';

import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function BlogSection() {
  const blog = useHomeLayoutStore((state) => state.blog);
  const isVisible = useHomeLayoutStore((state) => state.visibility.blog);

  if (!isVisible) return null;

  return (
    <section id="blog" className="py-16 bg-slate-50 dark:bg-zinc-900/10 border-y border-slate-100 dark:border-zinc-900 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[10px] font-bold tracking-widest text-rose-500 uppercase block">
            Gift Inspiration
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">
            {blog.title}
          </h2>
          <p className="text-sm text-slate-400 dark:text-zinc-400 font-light">
            {blog.subtitle}
          </p>
        </div>

        {/* Blog items grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blog.items.map((post) => (
            <article
              key={post.id}
              className="group bg-white dark:bg-zinc-900/60 border border-slate-150/60 dark:border-zinc-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-rose-500/10 transition-all duration-300 flex flex-col h-full"
            >
              {/* Featured Image */}
              <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-100 dark:border-zinc-800">
                  <span className="text-[9px] font-semibold text-slate-550 dark:text-zinc-350 tracking-wider">
                    {post.date}
                  </span>
                </div>
              </div>

              {/* Text details */}
              <div className="p-6 flex flex-col justify-between flex-1 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-100 group-hover:text-rose-500 transition-colors line-clamp-2 leading-snug">
                    <a href={post.href}>{post.title}</a>
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-400 font-light line-clamp-3 leading-relaxed">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href={post.href}
                    className="inline-flex items-center text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-450 dark:hover:text-rose-400 transition-colors group/link"
                  >
                    <span>Đọc tiếp</span>
                    <Icon
                      name="→"
                      size={12}
                      className="ml-1.5 transform group-hover/link:translate-x-1 transition-transform"
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
