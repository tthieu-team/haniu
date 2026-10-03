'use client';

import React, { useState, useEffect } from 'react';
import { Occasion } from '@/services/catalog.service';
import { productService } from '@/services/product.service';
import { getFullImageUrl } from '@/lib/api';
import Icon from '@/components/common/Icons';

interface OccasionFormModalProps {
  isOpen: boolean;
  editingItem: Occasion | null;
  onClose: () => void;
  onSave: (payload: Occasion) => Promise<void>;
}

const toSlug = (str: string) => {
  str = str.toLowerCase();
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/[^a-z0-9 -]/g, "");
  str = str.replace(/\s+/g, "-");
  str = str.replace(/-+/g, "-");
  return str.trim();
};

export const OccasionFormModal: React.FC<OccasionFormModalProps> = ({
  isOpen,
  editingItem,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isActive, setIsActive] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setSlug(editingItem.slug);
      setDescription(editingItem.description || '');
      setImageUrl(editingItem.imageUrl || '');
      setStartDate(editingItem.startDate || '');
      setEndDate(editingItem.endDate || '');
      setIsActive(editingItem.isActive ?? true);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setImageUrl('');
      setStartDate('');
      setEndDate('');
      setIsActive(true);
    }
    setErrorMsg('');
  }, [editingItem, isOpen]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingItem) {
      setSlug(toSlug(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErrorMsg('');
      const res = await productService.uploadImage(file);
      if (res && res.url) {
        setImageUrl(res.url);
      } else {
        setErrorMsg('Tải ảnh lên thất bại, không tìm thấy URL.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi tải lên hình ảnh.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Tên dịp lễ không được để trống.');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Slug không được để trống.');
      return;
    }

    const payload: Occasion = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      imageUrl: imageUrl.trim() || undefined,
      startDate: startDate.trim() || undefined,
      endDate: endDate.trim() || undefined,
      isActive,
    };

    if (editingItem?.id) {
      payload.id = editingItem.id;
    }

    try {
      setSubmitLoading(true);
      setErrorMsg('');
      await onSave(payload);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi lưu dịp lễ.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-2xl p-6 relative flex flex-col max-h-[90vh] overflow-y-auto scrollbar-none animate-in fade-in zoom-in-95 duration-200 text-xs font-semibold">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800 flex items-center justify-center cursor-pointer"
        >
          <Icon name="close" size={14} />
        </button>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-zinc-800 pb-3 mb-5">
          {editingItem ? 'Cập nhật Dịp Lễ & Sự Kiện' : 'Tạo Dịp Lễ / Sự Kiện Mới'}
        </h3>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl font-medium mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
              Tên dịp lễ / Sự kiện *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ví dụ: Lễ Tốt Nghiệp, Valentine 14/2, 20/10"
              className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
              Slug (Đường dẫn tĩnh) *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(toSlug(e.target.value))}
              placeholder="le-tot-nghiep"
              className="w-full text-xs font-mono bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Date range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
                Ngày bắt đầu (MM-DD)
              </label>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="10-15 (Tùy chọn)"
                className="w-full text-xs font-mono bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
                Ngày kết thúc (MM-DD)
              </label>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="10-21 (Tùy chọn)"
                className="w-full text-xs font-mono bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
              Mô tả dịp lễ
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ý nghĩa hoặc gợi ý set quà tặng phù hợp..."
              className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 h-20 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">
              Hình ảnh minh họa
            </label>
            <div className="flex gap-4 items-center">
              {imageUrl ? (
                <div className="relative shrink-0 border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden w-16 h-16 bg-slate-100 dark:bg-zinc-800">
                  <img src={getFullImageUrl(imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 border-none text-[8px]"
                    title="Xóa ảnh"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-800 border border-dashed border-slate-200 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-1 shrink-0">
                  <Icon name="camera" size={16} />
                  <span className="text-[8px] font-bold">Chưa có ảnh</span>
                </div>
              )}

              <div className="flex-1 space-y-1">
                <input
                  type="file"
                  accept="image/*"
                  id="upload-occasion-thumb"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
                <label
                  htmlFor="upload-occasion-thumb"
                  className="px-3.5 py-1.5 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 font-bold rounded-lg cursor-pointer transition-all inline-flex items-center gap-1.5 active:scale-95"
                >
                  {uploading ? (
                    <>
                      <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-slate-600" />
                      Đang tải lên...
                    </>
                  ) : (
                    <>
                      <Icon name="camera" size={12} /> Chọn ảnh minh họa
                    </>
                  )}
                </label>
                <p className="text-[10px] text-slate-400 font-medium">Tỷ lệ khuyên dùng 1:1 hoặc 4:3</p>
              </div>
            </div>
          </div>

          {/* Status active */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={!!isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-slate-300 text-rose-500 focus:ring-rose-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isActive" className="text-slate-700 dark:text-zinc-300 font-bold cursor-pointer">
              Kích hoạt hiển thị (Công khai trên bộ lọc tìm kiếm quà)
            </label>
          </div>

          {/* Submit buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitLoading || uploading}
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-600/20 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {submitLoading ? (
                <>
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Icon name="save" size={12} /> Lưu dịp lễ
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
