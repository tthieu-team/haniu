'use client';

import { useState, useEffect } from 'react';
import { useStoryStore } from '@/store/story';
import { FileUploadInput } from '../layout-config/components/FileUploadInput';
import Icon from '@/components/common/Icons';

export default function AdminStoryPage() {
  const { story, loading, fetchStory, updateStory } = useStoryStore();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    videoPlaceholderUrl: '',
    videoTitle: '',
  });

  useEffect(() => {
    const loadStory = async () => {
      const data = await fetchStory();
      if (data) {
        setFormData({
          title: data.title || '',
          subtitle: data.subtitle || '',
          content: data.content || '',
          videoPlaceholderUrl: data.videoPlaceholderUrl || '',
          videoTitle: data.videoTitle || '',
        });
      }
    };
    loadStory();
  }, [fetchStory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await updateStory(formData);
      setSuccessMsg('Cập nhật Câu chuyện thương hiệu thành công! 🎉');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi cập nhật câu chuyện.');
    }
  };

  if (loading && !story) {
    return <div className="p-8 text-center text-slate-400">Đang tải cấu hình câu chuyện...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
          Quản lý Câu chuyện Thương hiệu (Story Section)
        </h1>
        <p className="text-xs text-slate-400">
          Chỉnh sửa nội dung giới thiệu, hình ảnh, và video chế tác thủ công xuất hiện trên trang chủ.
        </p>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-semibold flex items-center gap-2 animate-fade-in">
          <Icon name="check" size={16} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-xl font-semibold flex items-center gap-2 animate-fade-in">
          <Icon name="close" size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase block">Tiêu đề phụ (Subtitle)</label>
                <input
                  type="text"
                  required
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none"
                  placeholder="Ví dụ: CÂU CHUYỆN THƯƠNG HIỆU"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase block">Tiêu đề chính (Title)</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none"
                  placeholder="Ví dụ: Nghệ Thuật Từ Những Bàn Tay"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase block">Tiêu đề nút xem video</label>
                <input
                  type="text"
                  required
                  value={formData.videoTitle}
                  onChange={(e) => setFormData({ ...formData, videoTitle: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none"
                  placeholder="Ví dụ: Xem video Behind the Scenes"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase block">Nội dung câu chuyện</label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none leading-relaxed"
                  placeholder="Nhập nội dung giới thiệu chi tiết về xưởng sản xuất, bàn tay nghệ nhân..."
                />
              </div>

              <div>
                <FileUploadInput
                  label="Ảnh bìa Video chế tác (Video Placeholder)"
                  value={formData.videoPlaceholderUrl}
                  onChange={(url) => setFormData({ ...formData, videoPlaceholderUrl: url })}
                  accept="image/*"
                  type="image"
                  placeholder="Đường dẫn ảnh cover của video..."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Icon name="save" size={14} />
              <span>Lưu thay đổi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
