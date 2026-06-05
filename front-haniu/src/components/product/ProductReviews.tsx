'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { fetchApi, API_BASE_URL } from '@/lib/api';
import { productService } from '@/services/product.service';

interface Review {
  id: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
  images?: string[];
  videos?: string[];
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

  // Eligibility states
  const [isEligible, setIsEligible] = useState(false);
  const [pendingOrderItemId, setPendingOrderItemId] = useState<string | null>(null);

  // Form states
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideos, setUploadedVideos] = useState<string[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchApi(`/api/v1/reviews/product/${productId}`);
      if (Array.isArray(data)) {
        setReviews(data);
        
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

  const checkEligibility = async () => {
    if (!isAuthenticated) {
      setIsEligible(false);
      setPendingOrderItemId(null);
      return;
    }
    try {
      const data = await fetchApi(`/api/v1/reviews/product/${productId}/check-eligible`);
      if (data && data.eligible) {
        setIsEligible(true);
        setPendingOrderItemId(data.pendingOrderItemId);
      } else {
        setIsEligible(false);
        setPendingOrderItemId(null);
      }
    } catch (err) {
      console.error('Failed to check eligibility:', err);
      setIsEligible(false);
      setPendingOrderItemId(null);
    }
  };

  useEffect(() => {
    if (productId) {
      loadReviews();
      checkEligibility();
    }
  }, [productId, isAuthenticated]);

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingMedia(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await productService.uploadImage(file);
        if (res && res.url) {
          if (type === 'image') {
            setUploadedImages(prev => [...prev, res.url]);
          } else {
            setUploadedVideos(prev => [...prev, res.url]);
          }
        }
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi tải tệp lên');
    } finally {
      setUploadingMedia(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !pendingOrderItemId) return;

    setSubmitting(true);
    setMsg({ text: '', type: '' });

    try {
      const res = await fetchApi(`/api/v1/reviews/product/${productId}`, {
        method: 'POST',
        body: JSON.stringify({
          rating,
          comment,
          orderItemId: pendingOrderItemId,
          images: uploadedImages,
          videos: uploadedVideos
        })
      });

      if (res) {
        setMsg({
          text: '🎉 Đánh giá của bạn đã được gửi thành công và đang chờ kiểm duyệt từ quản trị viên!',
          type: 'success'
        });
        setComment('');
        setRating(5);
        setUploadedImages([]);
        setUploadedVideos([]);
        checkEligibility(); // Re-verify eligibility (in case user has another purchased order item)
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

  const getFullUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${API_BASE_URL}${url}`;
  };

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-slate-50 dark:border-zinc-800 pb-8">
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
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 divide-y divide-slate-50 dark:divide-zinc-800">
            {reviews.map(review => (
              <div key={review.id} className="pt-4 first:pt-0 space-y-2 text-xs">
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
                
                {/* Media rendering */}
                {(review.images && review.images.length > 0 || review.videos && review.videos.length > 0) && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {review.images?.map((img, i) => (
                      <a key={i} href={getFullUrl(img)} target="_blank" rel="noopener noreferrer" className="relative group overflow-hidden rounded-lg w-20 h-20 border border-slate-100 dark:border-zinc-800">
                        <img src={getFullUrl(img)} alt="Review Attachment" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                      </a>
                    ))}
                    {review.videos?.map((vid, i) => (
                      <div key={i} className="relative rounded-lg w-32 h-20 overflow-hidden border border-slate-100 dark:border-zinc-800 bg-black">
                        <video src={getFullUrl(vid)} controls className="w-full h-full object-contain" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Form */}
      <div className="border-t border-slate-50 dark:border-zinc-800 pt-8 space-y-4">
        <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-sm">Viết đánh giá của bạn</h4>
        
        {!isAuthenticated ? (
          <div className="bg-slate-50 dark:bg-zinc-800/40 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 text-center text-xs space-y-2">
            <p className="text-slate-500 dark:text-zinc-400">Bạn cần đăng nhập tài khoản để có thể đánh giá sản phẩm này.</p>
            <Link
              href="/login"
              className="inline-block px-4 py-2 bg-rose-500 text-white font-bold rounded-lg hover:bg-rose-600 shadow-sm transition-all"
            >
              Đăng nhập ngay
            </Link>
          </div>
        ) : !isEligible ? (
          <div className="bg-slate-50 dark:bg-zinc-800 p-5 rounded-2xl border border-slate-100 dark:border-zinc-800 text-center text-xs text-slate-500 dark:text-zinc-400 italic">
            Chỉ khách hàng đã mua sản phẩm này và đã giao hàng thành công mới có thể gửi đánh giá. Mỗi lượt mua hàng cho phép gửi 1 đánh giá.
          </div>
        ) : (
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
                className="w-full text-base md:text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            {/* Media Upload Fields */}
            <div className="space-y-2 text-xs">
              <span className="text-xs text-slate-500 dark:text-zinc-400 font-semibold block">Tải ảnh hoặc video đánh giá:</span>
              <div className="flex flex-wrap gap-4 items-center">
                <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 border border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer font-semibold transition-colors">
                  <span>📸 Thêm ảnh</span>
                  <input type="file" accept="image/*" multiple onChange={e => handleMediaUpload(e, 'image')} className="hidden" />
                </label>
                <label className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 border border-slate-200 dark:border-zinc-700 rounded-xl cursor-pointer font-semibold transition-colors">
                  <span>🎥 Thêm video</span>
                  <input type="file" accept="video/*" multiple onChange={e => handleMediaUpload(e, 'video')} className="hidden" />
                </label>
                {uploadingMedia && <span className="text-rose-500 animate-pulse">Đang tải tệp lên...</span>}
              </div>

              {/* Upload Previews */}
              {(uploadedImages.length > 0 || uploadedVideos.length > 0) && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {uploadedImages.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 border border-slate-200 dark:border-zinc-700 rounded-lg overflow-hidden group bg-slate-50">
                      <img src={getFullUrl(img)} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-700 opacity-90 transition-opacity">×</button>
                    </div>
                  ))}
                  {uploadedVideos.map((vid, i) => (
                    <div key={i} className="relative w-28 h-16 border border-slate-200 dark:border-zinc-700 rounded-lg overflow-hidden group bg-black flex items-center">
                      <video src={getFullUrl(vid)} className="w-full h-full object-contain" />
                      <button type="button" onClick={() => removeVideo(i)} className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-700 opacity-90 transition-opacity">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {msg.text && (
              <div className={`p-3 rounded-xl text-xs font-semibold ${
                msg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {msg.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !comment.trim() || uploadingMedia}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer animate-fade-in"
            >
              {submitting ? 'Đang gửi...' : 'Gửi nhận xét'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
