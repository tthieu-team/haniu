'use client';

import { useState, useEffect } from 'react';
import { useTestimonialStore } from '@/store/testimonial';
import { TestimonialPayload } from '@/services/testimonial.service';
import { FileUploadInput } from '../layout-config/components/FileUploadInput';
import Icon from '@/components/common/Icons';

export default function AdminTestimonialsPage() {
  const { testimonials, loading, fetchTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = useTestimonialStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<TestimonialPayload>({
    name: '',
    role: '',
    content: '',
    rating: 5,
    avatar: '',
    active: true
  });

  const loadTestimonials = async () => {
    await fetchTestimonials();
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentTestimonial.id) {
        await updateTestimonial(currentTestimonial.id, currentTestimonial);
        alert('Cập nhật đánh giá thành công! 🎉');
      } else {
        await createTestimonial(currentTestimonial);
        alert('Tạo đánh giá mới thành công! 🚀');
      }
      setIsEditing(false);
      loadTestimonials();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu đánh giá!');
    }
  };

  const handleEdit = (t: TestimonialPayload) => {
    setCurrentTestimonial(t);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
    try {
      await deleteTestimonial(id);
      loadTestimonials();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa đánh giá!');
    }
  };

  const handleCreateNew = () => {
    setCurrentTestimonial({
      name: '',
      role: '',
      content: '',
      rating: 5,
      avatar: '',
      active: true
    });
    setIsEditing(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white">
            Quản lý Đánh giá Khách hàng (Testimonials)
          </h1>
          <p className="text-xs text-slate-400">
            Xem ý kiến phản hồi, chỉnh sửa đánh giá tiêu biểu và quản lý độ tin cậy hiển thị ở trang chủ.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Icon name="plus" size={14} />
          <span>Thêm đánh giá mới</span>
        </button>
      </div>

      {/* Editing Form */}
      {isEditing && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-sm space-y-6 animate-fade-in">
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            {currentTestimonial.id ? 'Biên tập đánh giá' : 'Tạo đánh giá mới'}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Tên khách hàng</label>
                <input
                  type="text"
                  required
                  value={currentTestimonial.name}
                  onChange={e => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none"
                  placeholder="Ví dụ: Nguyễn Thu Trang"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Mô tả / Vai trò</label>
                <input
                  type="text"
                  required
                  value={currentTestimonial.role || ''}
                  onChange={e => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none"
                  placeholder="Ví dụ: Khách mua quà kỷ niệm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Số sao (Rating 1-5)</label>
                <select
                  value={currentTestimonial.rating}
                  onChange={e => setCurrentTestimonial({ ...currentTestimonial, rating: Number(e.target.value) })}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none"
                >
                  <option value={1}>1 Sao ★</option>
                  <option value={2}>2 Sao ★★</option>
                  <option value={3}>3 Sao ★★★</option>
                  <option value={4}>4 Sao ★★★★</option>
                  <option value={5}>5 Sao ★★★★★</option>
                </select>
              </div>

              <div className="flex flex-col justify-end pb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="testimonial_active"
                    checked={currentTestimonial.active}
                    onChange={e => setCurrentTestimonial({ ...currentTestimonial, active: e.target.checked })}
                    className="rounded border-slate-350 bg-slate-50 text-rose-500 focus:ring-rose-500 h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="testimonial_active" className="text-xs text-slate-700 dark:text-zinc-300 font-bold uppercase">
                    Hiển thị ở trang chủ
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FileUploadInput
                  label="Ảnh đại diện (Avatar)"
                  value={currentTestimonial.avatar || ''}
                  onChange={url => setCurrentTestimonial({ ...currentTestimonial, avatar: url })}
                  accept="image/*"
                  type="image"
                  placeholder="Tải lên ảnh..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Nội dung bình luận</label>
                <textarea
                  required
                  value={currentTestimonial.content || ''}
                  onChange={e => setCurrentTestimonial({ ...currentTestimonial, content: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none h-24"
                  placeholder="Nhập nội dung chia sẻ cảm xúc của khách hàng..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-850/50 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 cursor-pointer"
              >
                {currentTestimonial.id ? 'Cập nhật đánh giá' : 'Thêm đánh giá'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800/85 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Đang tải danh sách đánh giá...</div>
        ) : testimonials.length === 0 ? (
          <div className="p-8 text-center text-slate-400">Chưa có đánh giá nào được nhập.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-zinc-800/50 border-b border-slate-100 dark:border-zinc-800 text-slate-500 dark:text-zinc-450 font-bold">
                  <th className="p-4 w-20">Avatar</th>
                  <th className="p-4 w-44">Tên khách hàng</th>
                  <th className="p-4 w-48">Mô tả / Vai trò</th>
                  <th className="p-4 w-28">Đánh giá sao</th>
                  <th className="p-4">Ý kiến phản hồi</th>
                  <th className="p-4 w-24">Trạng thái</th>
                  <th className="p-4 text-center w-24">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map(t => (
                  <tr key={t.id} className="border-b border-slate-50 dark:border-zinc-800/60 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30">
                    <td className="p-4">
                      {t.avatar ? (
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200/50 dark:border-zinc-800"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[10px] text-slate-400">
                          No Pic
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-700 dark:text-zinc-300">{t.name}</td>
                    <td className="p-4 text-slate-500 dark:text-zinc-450">{t.role}</td>
                    <td className="p-4 text-amber-500 font-bold">
                      {Array.from({ length: t.rating }).map((_, i) => '★').join('')}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-zinc-400 italic line-clamp-2 leading-relaxed mt-2.5">
                      "{t.content}"
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        t.active ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-slate-500/10 text-slate-500'
                      }`}>
                        {t.active ? 'Hiện' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="p-4 text-center space-x-1">
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-1.5 bg-slate-50 dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-750 text-slate-600 dark:text-zinc-300 rounded-lg cursor-pointer"
                        title="Sửa đánh giá"
                      >
                        <Icon name="edit" size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id!)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg cursor-pointer"
                        title="Xóa đánh giá"
                      >
                        <Icon name="trash" size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
