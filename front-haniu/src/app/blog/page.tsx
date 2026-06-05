'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { postService, PostPayload } from '@/services/post.service';
import Icon from '@/components/common/Icons';

export default function BlogListPage() {
  const [posts, setPosts] = useState<PostPayload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await postService.getActivePosts();
        setPosts(data || []);
      } catch (err) {
        console.error('Failed to load blog posts:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="bg-slate-50/50 dark:bg-zinc-950 min-h-screen pt-4 pb-12 space-y-16 animate-fade-in">
      
      {/* Banner Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] overflow-hidden bg-slate-100/60 dark:bg-zinc-950 text-slate-800 dark:text-white p-6 sm:p-10 lg:p-12 shadow-lg border border-slate-200 dark:border-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent opacity-60 dark:opacity-40 pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 border border-rose-500/25">
              <Icon name="book" size={10} className="animate-pulse" /> HANIU JOURNAL
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight py-1 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-rose-500">
              Góc Chia Sẻ Kinh Nghiệm
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-350 leading-relaxed font-light tracking-wide max-w-xl">
              Nơi tổng hợp những ý tưởng quà tặng độc học, những câu chuyện truyền cảm hứng và cẩm nang cá nhân hóa quà tặng.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-zinc-500 py-32 bg-white dark:bg-zinc-900 rounded-[36px] border border-slate-200 dark:border-zinc-800 shadow-xs">
            <Icon name="book" size={32} className="mx-auto text-slate-400 mb-3" />
            <p className="text-xs text-slate-400 font-light">Chưa có bài viết nào được đăng tải. Quay lại sau nhé!</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* Featured Post Card */}
            {featuredPost && (
              <div className="relative group bg-white dark:bg-zinc-900 rounded-[40px] border border-slate-200 dark:border-zinc-800 shadow-xs overflow-hidden transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Image side */}
                  <Link href={`/blog/${featuredPost.slug}`} className="lg:col-span-7 relative aspect-video lg:aspect-auto min-h-[300px] overflow-hidden bg-slate-100 dark:bg-zinc-800 block">
                    {featuredPost.imageUrl ? (
                      <img 
                        src={featuredPost.imageUrl} 
                        alt={featuredPost.title} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-zinc-700">
                        <Icon name="book" size={48} />
                      </div>
                    )}
                    <span className="absolute top-6 left-6 bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg">
                      NỔI BẬT
                    </span>
                  </Link>

                  {/* Content side */}
                  <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {featuredPost.publishedAt && (
                        <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">
                          {new Date(featuredPost.publishedAt).toLocaleDateString('vi-VN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                      <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-zinc-200 leading-tight group-hover:text-rose-500 transition-colors">
                        <Link href={`/blog/${featuredPost.slug}`}>
                          {featuredPost.title}
                        </Link>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-light leading-relaxed">
                        {featuredPost.summary}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-bold text-slate-400 dark:text-zinc-500">
                      <span className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px]">✍️</span>
                        <span>Haniu Editorial</span>
                      </span>
                      <Link 
                        href={`/blog/${featuredPost.slug}`} 
                        className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-[10px] font-black tracking-wider uppercase transition-all shadow-md shadow-rose-500/10 cursor-pointer"
                      >
                        Đọc bài viết →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Posts Grid */}
            {regularPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
                {regularPosts.map((post) => (
                  <article 
                    key={post.id}
                    className="bg-white dark:bg-zinc-900 rounded-[32px] border border-slate-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                  >
                    {/* Cover image */}
                    <Link href={`/blog/${post.slug}`} className="block relative aspect-1.8 overflow-hidden bg-slate-100 dark:bg-zinc-800">
                      {post.imageUrl ? (
                        <img 
                           src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-zinc-600">
                          <Icon name="book" size={32} />
                        </div>
                      )}
                      {post.publishedAt && (
                        <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-3 py-1.5 rounded-full border border-white/10">
                          {new Date(post.publishedAt).toLocaleDateString('vi-VN', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </span>
                      )}
                    </Link>

                    {/* Content body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-zinc-200 group-hover:text-rose-500 transition-colors line-clamp-2">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-zinc-400 font-light leading-relaxed line-clamp-3">
                          {post.summary}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                        <span className="flex items-center gap-1.5">
                          <Icon name="user" size={10} />
                          <span>Haniu Editor</span>
                        </span>
                        <Link 
                          href={`/blog/${post.slug}`} 
                          className="text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <span>Đọc tiếp →</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
