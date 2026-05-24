'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/services/catalog.service';
import { productService } from '@/services/product.service';
import { getFullImageUrl } from '@/lib/api';
import Icon from '@/components/common/Icons';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: Category) => Promise<void>;
  editingCategory: Category | null;
  allCategories: Category[];
}

export default function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  editingCategory,
  allCategories,
}: CategoryFormModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  // SEO fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [seoExpanded, setSeoExpanded] = useState(false);

  // Status states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setName(editingCategory.name);
        setSlug(editingCategory.slug);
        setParentId(editingCategory.parent?.id || '');
        setDescription(editingCategory.description || '');
        setSortOrder(editingCategory.sortOrder ?? 0);
        setIsActive(editingCategory.isActive ?? true);
        setIsFeatured(editingCategory.isFeatured ?? false);
        setImageUrl(editingCategory.imageUrl || '');
        setBannerUrl(editingCategory.bannerUrl || '');
        setSeoTitle(editingCategory.seoTitle || '');
        setSeoDescription(editingCategory.seoDescription || '');
        setSeoKeywords(editingCategory.seoKeywords || '');
      } else {
        setName('');
        setSlug('');
        setParentId('');
        setDescription('');
        setSortOrder(0);
        setIsActive(true);
        setIsFeatured(false);
        setImageUrl('');
        setBannerUrl('');
        setSeoTitle('');
        setSeoDescription('');
        setSeoKeywords('');
      }
      setErrorMsg('');
      setSeoExpanded(false);
    }
  }, [isOpen, editingCategory]);

  if (!isOpen) return null;

  const toSlug = (str: string) => {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    str = str.replace(/đ/g, 'd');
    str = str.replace(/[^a-z0-9 -]/g, '');
    str = str.replace(/\s+/g, '-');
    str = str.replace(/-+/g, '-');
    return str.trim();
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(toSlug(val));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isBanner = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (isBanner) setUploadingBanner(true);
      else setUploadingImage(true);
      
      setErrorMsg('');
      const res = await productService.uploadImage(file);
      if (res && res.url) {
        if (isBanner) setBannerUrl(res.url);
        else setImageUrl(res.url);
      } else {
        setErrorMsg('Tải ảnh lên thất bại, không nhận được đường dẫn hình ảnh.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi xảy ra khi tải ảnh lên.');
    } finally {
      if (isBanner) setUploadingBanner(false);
      else setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Tên danh mục không được trống.');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Slug không được trống.');
      return;
    }

    const payload: Category = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
      sortOrder,
      isActive,
      isFeatured,
      imageUrl: imageUrl.trim() || undefined,
      bannerUrl: bannerUrl.trim() || undefined,
      seoTitle: seoTitle.trim() || undefined,
      seoDescription: seoDescription.trim() || undefined,
      seoKeywords: seoKeywords.trim() || undefined,
      parent: parentId ? { id: parentId, name: '', slug: '', isActive: true } : null,
    };

    if (editingCategory) {
      payload.id = editingCategory.id;
    }

    try {
      setSubmitLoading(true);
      setErrorMsg('');
      await onSave(payload);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi lưu thông tin danh mục.');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Filter candidates for parent category selection (remove self to avoid cyclic dependency)
  const parentCandidates = allCategories.filter(
    (c) => !editingCategory || c.id !== editingCategory.id
  );

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-xl rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-2xl p-6 relative flex flex-col max-h-[90vh] overflow-y-auto scrollbar-none animate-in fade-in zoom-in-95 duration-200 text-xs font-semibold text-slate-800 dark:text-zinc-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-655 dark:hover:text-white w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-850 flex items-center justify-center cursor-pointer"
        >
          <Icon name="close" size={14} />
        </button>

        <h3 className="text-lg font-bold text-slate-850 dark:text-white border-b border-slate-100 dark:border-zinc-850 pb-3 mb-5">
          {editingCategory ? 'Cập nhật Danh Mục' : 'Tạo Danh Mục Mới'}
        </h3>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-xl font-medium mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Main Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-450 block mb-1 uppercase tracking-wider">Tên danh mục *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Ví dụ: Hoa Cưới Cầm Tay"
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-[10px] text-slate-455 block mb-1 uppercase tracking-wider">Slug (Đường dẫn tĩnh) *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                placeholder="hoa-cuoi-cam-tay"
                className="w-full text-xs font-mono bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Hierarchy and Sorting */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-slate-450 block mb-1 uppercase tracking-wider">Danh mục cha</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer"
              >
                <option value="">-- Không có (Danh mục gốc) --</option>
                {parentCandidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-450 block mb-1 uppercase tracking-wider">Thứ tự hiển thị</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
                placeholder="0"
                min={0}
                className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] text-slate-450 block mb-1 uppercase tracking-wider">Mô tả danh mục</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả tóm tắt nội dung danh mục sản phẩm..."
              className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 h-16 resize-none"
            />
          </div>

          {/* Image & Banner Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-450 block uppercase tracking-wider">Ảnh đại diện (Square)</label>
              <div className="flex gap-3 items-center">
                {imageUrl ? (
                  <div className="relative shrink-0 border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden w-16 h-16 bg-slate-100">
                    <img src={getFullImageUrl(imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-655 border-none text-[8px]"
                      title="Xóa ảnh"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-slate-50 dark:bg-zinc-800 border border-dashed border-slate-200 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-1 shrink-0">
                    <Icon name="camera" size={14} />
                    <span className="text-[7px] font-bold">Chưa có ảnh</span>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    id="category-image-upload"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="category-image-upload"
                    className="px-3 py-1.5 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 font-bold rounded-lg cursor-pointer transition-all inline-flex items-center gap-1 active:scale-95 text-[10px]"
                  >
                    {uploadingImage ? (
                      <>
                        <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-slate-600" />
                        Tải lên...
                      </>
                    ) : (
                      <>
                        <Icon name="camera" size={10} /> Tải ảnh lên
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Banner URL */}
            <div className="space-y-2">
              <label className="text-[10px] text-slate-450 block uppercase tracking-wider">Ảnh Banner (Landscape)</label>
              <div className="flex gap-3 items-center">
                {bannerUrl ? (
                  <div className="relative shrink-0 border border-slate-200 dark:border-zinc-700 rounded-xl overflow-hidden w-24 h-16 bg-slate-100">
                    <img src={getFullImageUrl(bannerUrl)} alt="Preview Banner" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setBannerUrl('')}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-655 border-none text-[8px]"
                      title="Xóa ảnh"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-16 bg-slate-50 dark:bg-zinc-800 border border-dashed border-slate-200 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center text-slate-400 gap-1 shrink-0">
                    <Icon name="camera" size={14} />
                    <span className="text-[7px] font-bold">Chưa có banner</span>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    id="category-banner-upload"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                    disabled={uploadingBanner}
                  />
                  <label
                    htmlFor="category-banner-upload"
                    className="px-3 py-1.5 border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 font-bold rounded-lg cursor-pointer transition-all inline-flex items-center gap-1 active:scale-95 text-[10px]"
                  >
                    {uploadingBanner ? (
                      <>
                        <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-slate-600" />
                        Tải lên...
                      </>
                    ) : (
                      <>
                        <Icon name="camera" size={10} /> Tải banner
                      </>
                    )}
                  </label>
                </div>
              </div>
            </div>

          </div>

          {/* Toggle buttons (Active / Featured) */}
          <div className="flex gap-6 items-center pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="catIsActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded border-slate-300 text-rose-500 focus:ring-rose-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="catIsActive" className="text-slate-700 dark:text-zinc-300 font-bold cursor-pointer select-none">
                Kích hoạt danh mục
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="catIsFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-slate-300 text-rose-500 focus:ring-rose-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="catIsFeatured" className="text-slate-700 dark:text-zinc-300 font-bold cursor-pointer select-none">
                Đánh dấu nổi bật (Featured)
              </label>
            </div>
          </div>

          {/* SEO section */}
          <div className="border border-slate-100 dark:border-zinc-800 rounded-2xl overflow-hidden mt-4">
            <button
              type="button"
              onClick={() => setSeoExpanded(!seoExpanded)}
              className="w-full flex items-center justify-between p-3 bg-slate-50 dark:bg-zinc-850 hover:bg-slate-100/50 dark:hover:bg-zinc-800/40 transition-colors font-bold text-slate-700 dark:text-zinc-200 cursor-pointer border-none"
            >
              <span className="flex items-center gap-1.5">
                <Icon name="sparkles" size={14} className="text-rose-500" />
                Cấu hình SEO (Tìm kiếm nâng cao)
              </span>
              <Icon name={seoExpanded ? 'chevron-up' : 'chevron-down'} size={14} />
            </button>

            {seoExpanded && (
              <div className="p-4 bg-white dark:bg-zinc-900 border-t border-slate-100 dark:border-zinc-800 space-y-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">SEO Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Mặc định sử dụng tên danh mục"
                    className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">SEO Description</label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Mô tả cho kết quả tìm kiếm Google..."
                    className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500 h-16 resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 uppercase tracking-wider">SEO Keywords</label>
                  <input
                    type="text"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    placeholder="hoa cuoi, hoa cam tay, qua cuoi (cách nhau bởi dấu phẩy)"
                    className="w-full text-xs bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-slate-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-zinc-850 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitLoading || uploadingImage || uploadingBanner}
              className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-md shadow-rose-500/10 transition-all cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {submitLoading ? (
                <>
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <Icon name="save" size={12} /> Lưu thay đổi
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
