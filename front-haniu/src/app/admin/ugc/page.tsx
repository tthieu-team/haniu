'use client';

import { useState, useEffect } from 'react';
import { useUgcStore } from '@/store/ugc';
import { UgcItemPayload } from '@/services/ugc.service';
import { FileUploadInput } from '../layout-config/components/FileUploadInput';
import Icon from '@/components/common/Icons';

export default function AdminUgcPage() {
  const { ugcItems, loading, fetchUgcItems, createUgcItem, updateUgcItem, deleteUgcItem } = useUgcStore();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUgc, setCurrentUgc] = useState<UgcItemPayload>({
    imageUrl: '',
    link: '',
    active: true
  });

  const loadUgc = async () => {
    await fetchUgcItems();
  };

  useEffect(() => {
    loadUgc();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentUgc.id) {
        await updateUgcItem(currentUgc.id, currentUgc);
        alert('Cập nhật hình ảnh thành công! 🎉');
      } else {
        await createUgcItem(currentUgc);
        alert('Thêm hình ảnh UGC thành công! 🚀');
      }
      setIsEditing(false);
      loadUgc();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu hình ảnh!');
    }
  };

  const handleEdit = (u: UgcItemPayload) => {
    setCurrentUgc(u);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hình ảnh này khỏi Feed?')) return;
    try {
      await deleteUgcItem(id);
      loadUgc();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa hình ảnh!');
    }
  };

  const handleCreateNew = () => {
    setCurrentUgc({
      imageUrl: '',
      link: '',
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
            Quản lý Instagram Moments (UGC Feed)
          </h1>
          <p className="text-xs text-slate-400">
            Cập nhật khoảnh khắc trải nghiệm, nơ gói quà của khách hàng, ảnh chụp thực tế chia sẻ qua Instagram/Tiktok.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-500/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Icon name="plus" size={14} />
          <span>Thêm ảnh Moments mới</span>
        </button>
      </div>

      {/* Editing Form */}
      {isEditing && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800/80 shadow-sm space-y-6 animate-fade-in">
          <h3 className="font-bold text-slate-800 dark:text-white text-base">
            {currentUgc.id ? 'Biên tập ảnh Feed' : 'Thêm ảnh Feed mới'}
          </h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-bold uppercase block mb-1">Link bài viết (Instagram/Tiktok/Facebook)</label>
                <input
                  type="text"
                  value={currentUgc.link || ''}
                  onChange={e => setCurrentUgc({ ...currentUgc, link: e.target.value })}
                  className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-slate-700 dark:text-white focus:border-rose-500 focus:outline-none"
                  placeholder="https://instagram.com/p/..."
                />
              </div>

              <div className="flex flex-col justify-end pb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="ugc_active"
                    checked={currentUgc.active}
                    onChange={e => setCurrentUgc({ ...currentUgc, active: e.target.checked })}
                    className="rounded border-slate-350 bg-slate-50 text-rose-500 focus:ring-rose-500 h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="ugc_active" className="text-xs text-slate-700 dark:text-zinc-300 font-bold uppercase">
                    Hiển thị công khai lên website
                  </label>
                </div>
              </div>
            </div>

            <div>
              <FileUploadInput
                label="Chọn hình ảnh đăng tải"
                value={currentUgc.imageUrl}
                onChange={url => setCurrentUgc({ ...currentUgc, imageUrl: url })}
                accept="image/*"
                type="image"
                placeholder="Tải lên ảnh hoặc điền link ảnh..."
              />
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
                {currentUgc.id ? 'Cập nhật' : 'Thêm vào Feed'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* UGC Cards Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Đang tải danh sách hình ảnh...</div>
      ) : ugcItems.length === 0 ? (
        <div className="p-8 text-center text-slate-400">Chưa có ảnh nào được tải lên Feed.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {ugcItems.map(item => (
            <div
              key={item.id}
              className="group bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl p-3.5 shadow-sm hover:shadow-lg transition-all duration-300 relative space-y-3"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-950">
                <img
                  src={item.imageUrl}
                  alt="Customer moment"
                  className="w-full h-full object-cover"
                />
                
                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-10">
                  <button
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-xl bg-white text-slate-700 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer shadow"
                    title="Chỉnh sửa"
                  >
                    <Icon name="edit" size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id!)}
                    className="p-2 rounded-xl bg-white text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer shadow"
                    title="Xóa"
                  >
                    <Icon name="trash" size={12} />
                  </button>
                </div>
              </div>

              {/* Info text */}
              <div className="flex items-center justify-between text-[10px]">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-rose-500 font-medium truncate max-w-[80px]"
                >
                  Link Instagram
                </a>
                <span className={`px-1.5 py-0.5 rounded ${
                  item.active ? 'bg-green-100 text-green-700' : 'bg-slate-150 text-slate-500'
                } font-bold text-[8px]`}>
                  {item.active ? 'Hiển thị' : 'Ẩn'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
