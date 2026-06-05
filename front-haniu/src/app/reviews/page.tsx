'use client';

import React, { useState, useEffect } from 'react';
import { useHomeLayoutStore, DEFAULT_STATE } from '@/store/homeLayout';
import { getFullImageUrl } from '@/lib/api';
import Icon from '@/components/common/Icons';

interface DbReview {
  id: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  user: {
    fullName: string;
  };
  product: {
    name: string;
    slug: string;
  };
}

export default function ReviewsPage() {
  const [mounted, setMounted] = useState(false);
  const [dbReviews, setDbReviews] = useState<DbReview[]>([]);
  const [loading, setLoading] = useState(true);

  const { socialProof } = useHomeLayoutStore();
  const activeSocialProof = mounted ? socialProof : DEFAULT_STATE.socialProof;

  useEffect(() => {
    setMounted(true);

    const loadDbReviews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/reviews/all-approved`);
        if (res.ok) {
          const data = await res.json();
          setDbReviews(data || []);
        }
      } catch (err) {
        console.error('Failed to load db reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDbReviews();
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center py-32 bg-slate-50/50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
      </div>
    );
  }

  // Combine Testimonials and Product Reviews for calculation
  const allRatings: number[] = [
    ...(activeSocialProof.reviews || []).map(r => r.rating),
    ...dbReviews.map(r => r.rating)
  ];

  const totalReviewsCount = allRatings.length || 1;
  const averageRating = (allRatings.reduce((sum, val) => sum + val, 0) / totalReviewsCount) || 5;

  const starDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = allRatings.filter(r => r === star).length;
    const percentage = Math.round((count / totalReviewsCount) * 100);
    return { star, count, percentage };
  });

  // Generate AggregateRating Schema
  const reviewsSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': 'Haniu Gift Shop Customer Reviews',
    'image': 'https://haniu.vn/logo.png',
    'description': 'Đánh giá thực tế từ khách hàng đã mua và sử dụng sản phẩm quà tặng tại Haniu.',
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': averageRating.toFixed(1),
      'reviewCount': totalReviewsCount,
      'bestRating': '5',
      'worstRating': '1'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />

      <div className="bg-slate-50/50 dark:bg-zinc-950 min-h-screen pt-4 pb-12 space-y-16 animate-fade-in font-sans">
        
        {/* Banner Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[32px] overflow-hidden bg-slate-100/60 dark:bg-zinc-950 text-slate-800 dark:text-white p-6 sm:p-10 lg:p-12 shadow-lg border border-slate-200 dark:border-zinc-900">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent opacity-60 dark:opacity-40 pointer-events-none" />
            <div className="relative z-10 max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 border border-rose-500/25">
                <Icon name="star" size={10} className="animate-pulse" /> REVIEWS
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight py-1 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-rose-500">
                Đánh Giá Khách Hàng
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-light tracking-wide max-w-xl">
                Những cảm nhận chân thực nhất từ hơn {activeSocialProof.reviewsCount || '1.250+'} khách hàng đã gửi gắm niềm tin trao tặng yêu thương tại Haniu.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs Navigation */}
          <nav className="text-xs text-slate-400 dark:text-zinc-500 flex items-center gap-1.5 font-medium">
            <a href="/" className="hover:text-rose-500 transition-colors">Trang chủ</a>
            <span>&gt;</span>
            <span className="text-slate-600 dark:text-zinc-300">Đánh giá của khách hàng</span>
          </nav>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Summary Ratings Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left: Overall Rating Card */}
            <div className="lg:col-span-4 bg-white dark:bg-zinc-900 rounded-[36px] border border-slate-200 dark:border-zinc-800 p-8 shadow-xs text-center flex flex-col justify-center space-y-4">
              <span className="text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider block">
                Điểm Đánh Giá Trung Bình
              </span>
              <div className="space-y-1">
                <span className="text-6xl font-black text-slate-800 dark:text-white block font-serif">
                  {averageRating.toFixed(1)}
                </span>
                <div className="flex justify-center text-amber-500 gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Icon 
                      key={idx} 
                      name="★" 
                      size={20} 
                      className={idx < Math.round(averageRating) ? 'text-amber-500' : 'text-slate-200 dark:text-zinc-800'} 
                    />
                  ))}
                </div>
                <span className="text-slate-400 dark:text-zinc-500 text-[10px] block pt-1.5">
                  Dựa trên {totalReviewsCount} lượt đánh giá thực tế
                </span>
              </div>
            </div>

            {/* Right: Stars Distribution Card */}
            <div className="lg:col-span-8 bg-white dark:bg-zinc-900 rounded-[36px] border border-slate-200 dark:border-zinc-800 p-8 shadow-xs flex flex-col justify-center space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800 pb-2">
                Chi tiết phân bổ đánh giá
              </h3>
              <div className="space-y-3">
                {starDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-zinc-400">
                    <span className="w-10 shrink-0 font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                      {star} <span className="text-amber-500">★</span>
                    </span>
                    <div className="flex-1 h-2 rounded-full bg-slate-200/60 dark:bg-zinc-800/60 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-amber-400 to-rose-500 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="w-12 text-right shrink-0 font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                      {count} ({percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonial & Product Reviews Combined Feed */}
          <div className="space-y-6">
            <h3 className="font-black text-slate-800 dark:text-white text-base">
              Ý kiến phản hồi gần đây
            </h3>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Testimonials from homeLayout store */}
                {(activeSocialProof.reviews || []).map((rev) => (
                  <div 
                    key={rev.id}
                    className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-[32px] shadow-xs space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <img 
                            src={rev.avatar} 
                            alt={rev.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200/50 dark:border-zinc-800"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">{rev.name}</h4>
                            <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold block">{rev.role}</span>
                          </div>
                        </div>
                        <div className="flex text-amber-500 gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Icon 
                              key={idx} 
                              name="★" 
                              size={12} 
                              className={idx < rev.rating ? 'text-amber-500' : 'text-slate-200 dark:text-zinc-800'} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 font-light leading-relaxed whitespace-pre-line">
                        "{rev.content}"
                      </p>
                    </div>
                    <div className="text-[8px] font-black uppercase tracking-wider text-rose-500 bg-rose-500/5 dark:bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/10 w-max">
                      Trải nghiệm cửa hàng
                    </div>
                  </div>
                ))}

                {/* Dynamic DB Product Reviews */}
                {dbReviews.map((rev) => (
                  <div 
                    key={rev.id}
                    className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-[32px] shadow-xs space-y-4 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 animate-fade-in"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white text-xs shrink-0">
                            {rev.user.fullName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">{rev.user.fullName}</h4>
                            <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-bold block">
                              Đã mua {rev.product.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex text-amber-500 gap-0.5">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Icon 
                              key={idx} 
                              name="★" 
                              size={12} 
                              className={idx < rev.rating ? 'text-amber-500' : 'text-slate-200 dark:text-zinc-800'} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 font-light leading-relaxed whitespace-pre-line">
                        "{rev.comment}"
                      </p>

                      {/* Review Images */}
                      {rev.images && rev.images.length > 0 && (
                        <div className="flex gap-2 flex-wrap pt-1.5">
                          {rev.images.map((img, index) => (
                            <img 
                              key={index} 
                              src={getFullImageUrl(img)} 
                              alt={`Review ${index}`} 
                              className="w-12 h-12 rounded-lg object-cover border border-slate-200/40 dark:border-zinc-800/40"
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[8px] font-bold text-slate-400 dark:text-zinc-500">
                      <span>
                        {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-rose-500 bg-rose-500/5 dark:bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/10 block w-max">
                        Đánh giá sản phẩm
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && dbReviews.length === 0 && (
              <div className="text-center text-slate-400 text-xs py-8 border border-dashed border-slate-200 dark:border-zinc-800 rounded-[28px] font-light">
                Chưa có đánh giá sản phẩm động nào được duyệt.
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
