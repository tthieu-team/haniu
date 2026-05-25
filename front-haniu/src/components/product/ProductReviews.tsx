'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { fetchApi } from '@/lib/api';

interface Review {
  id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  user?: {
    fullName: string;
    email: string;
  };
}

interface ProductReviewsProps {
  productId: string;
  onReviewsUpdated?: (avgRating: number, count: number) => void;
}

export default function ProductReviews({ productId, onReviewsUpdated }: ProductReviewsProps) {
  const { isAuthenticated, user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const loadReviews = async () => {
    setLoading(true);
    try {
      // Fetch approved reviews first
      const data = await fetchApi(`/api/v1/reviews/product/${productId}`);
      if (Array.isArray(data)) {
        setReviews(data);
        
        // Calculate average and trigger callback
        if (data.length > 0) {
          const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
          const avg = sum / data.length;
          onReviewsUpdated?.(avg, data.length);
        } else {
          onReviewsUpdated?.(5, 0);
        }
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      loadReviews();
    }
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await fetchApi(`/api/v1/reviews/product/${productId}`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment })
      });

      if (res) {
        setMsg({
          text: '🎉 Đánh giá của bạn đã được gửi thành công và đang chờ kiểm duyệt từ quản trị viên!',
          type: 'success'
        });
        setComment('');
        setRating(5);
        // Reload reviews to reflect updates if any approved or wait for admin
        loadReviews();
      }
    } catch (err: any) {
      setMsg({
        text: err.message || 'Gửi đánh giá thất bại. Vui lòng thử lại sau.',
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Stats calculation
  const totalCount = reviews.length;
  const averageRating = totalCount > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount 
    : 5;

  const starPercentages = [5, 4, 3, 2, 1].map(star => {
    if (totalCount === 0) return 0;
    const count = reviews.filter(r => r.rating === star).length;
    return Math.round((count / totalCount) * 100);
  });

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-6 md:p-8 space-y-8 shadow-sm">
      <h3 className="font-extrabold text-slate-800 dark:text-zinc-200 text-lg uppercase tracking-tight">Đánh giá sản phẩm</h3>

      {/* Stats Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-slate-50 dark:border-zinc-850 pb-8">
        <div className="text-center space-y-1">
          <div className="text-5xl font-black text-slate-800 dark:text-white">{averageRating.toFixed(1)}</div>
          <div className="flex justify-center text-amber-500 text-base">
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star}>{star <= Math.round(averageRating) ? '★' : '☆'}</span>
            ))}
          </div>
          <p className="text-slate-400 text-xs">Dựa trên {totalCount} nhận xét từ khách hàng</p>
        </div>

        <div className="md:col-span-2 space-y-2 text-xs">
          {[5, 4, 3, 2, 1].map((star, idx) => {
            const percentage = starPercentages[idx];
            return (
              <div key={star} className="flex items-center gap-3">
                <span className="w-12 text-slate-500 font-medium text-right shrink-0">{star} sao</span>
                <div className="flex-1 h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-slate-400 font-medium text-left shrink-0">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-6">
        <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-sm">Tất cả nhận xét ({totalCount})</h4>
        
        {loading ? (
          <div className="text-center text-slate-400 py-6 text-xs">Đang tải đánh giá...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-slate-400 py-8 text-xs italic">
            Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên nhận xét!
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 divide-y divide-slate-50 dark:divide-zinc-850">
            {reviews.map(review => (
              <div key={review.id} className="pt-4 first:pt-0 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700 dark:text-zinc-200">
                    {review.user?.fullName || 'Khách hàng Haniu'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                <div className="flex text-amber-500 text-[10px]">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star}>{star <= review.rating ? '★' : '☆'}</span>
                  ))}
                </div>
                <p className="text-slate-600 dark:text-zinc-350 leading-relaxed font-normal">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Form */}
      <div className="border-t border-slate-50 dark:border-zinc-850 pt-8 space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-sm">Viết đánh giá của bạn</h4>
        
        {isAuthenticated ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold">Chọn số sao:</span>
              <div className="flex text-amber-500 text-xl cursor-pointer">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="hover:scale-115 transition-transform"
                  >
                    {star <= (hoverRating ?? rating) ? '★' : '☆'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-500 dark:text-zinc-400 block font-semibold">Nội dung đánh giá</label>
              <textarea
                required
                rows={4}
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm thực tế của bạn về chất liệu, mức độ hoàn thiện sản phẩm..."
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            {msg.text && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                msg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-650'
              }`}>
                {msg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !comment.trim()}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Đang gửi...' : 'Gửi nhận xét'}
            </button>
          </form>
        ) : (
          <div className="bg-slate-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 text-center text-xs space-y-2">
            <p className="text-slate-500 dark:text-zinc-400">Bạn cần đăng nhập tài khoản để có thể đánh giá sản phẩm này.</p>
            <Link
              href="/login"
              className="inline-block px-4 py-2 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600 shadow-sm transition-all"
            >
              Đăng nhập ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
