'use client';

import React, { useState } from 'react';
import Icon from '@/components/common/Icons';
import { productService } from '@/services/product.service';

interface AssetLibraryTabProps {
  assets: any;
  onAddAsset: (type: 'backgrounds' | 'stickers' | 'logos', item: any) => void;
  onDeleteAsset: (type: 'backgrounds' | 'stickers' | 'logos', id: string) => void;
}

export const AssetLibraryTab: React.FC<AssetLibraryTabProps> = ({
  assets,
  onAddAsset,
  onDeleteAsset
}) => {
  const [uploadingSticker, setUploadingSticker] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleUploadSticker = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = prompt('Nhập tên sticker:', file.name.split('.')[0]);
    if (!name) return;

    try {
      setUploadingSticker(true);
      const res = await productService.uploadImage(file);
      if (res && res.url) {
        onAddAsset('stickers', { name, url: res.url, category: 'Custom' });
      } else {
        alert('Tải ảnh lên thất bại!');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi xảy ra khi tải ảnh lên.');
    } finally {
      setUploadingSticker(false);
      e.target.value = ''; // Reset input
    }
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const name = prompt('Nhập tên watermark/logo:', file.name.split('.')[0]);
    if (!name) return;

    try {
      setUploadingLogo(true);
      const res = await productService.uploadImage(file);
      if (res && res.url) {
        onAddAsset('logos', { name, url: res.url, category: 'Watermark' });
      } else {
        alert('Tải ảnh lên thất bại!');
      }
    } catch (err: any) {
      alert(err.message || 'Lỗi xảy ra khi tải ảnh lên.');
    } finally {
      setUploadingLogo(false);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-black uppercase text-slate-800 dark:text-zinc-200">Kho Tài Nguyên Sticker & Logos</h3>
        <p className="text-[11px] text-slate-400 dark:text-zinc-500">Tải lên hoặc xem trước các tài nguyên sticker, hình nền và con dấu dùng chung.</p>
      </div>

      {/* Stickers */}
      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase text-slate-700 dark:text-zinc-350 border-b border-slate-100 dark:border-zinc-800 pb-1">
          🎨 Thư Viện Stickers Hỗ Trợ Dán
        </h4>

        <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {assets.stickers?.map((stk: any) => (
            <div key={stk.id} className="bg-slate-50 dark:bg-zinc-850 border border-slate-150 dark:border-zinc-800 p-3 rounded-2xl flex flex-col items-center justify-center relative group min-h-[110px]">
              <img src={stk.url} alt={stk.name} className="w-12 h-12 object-contain hover:scale-110 transition-transform" />
              <p className="text-[8px] font-bold text-slate-450 dark:text-zinc-500 text-center truncate mt-2 max-w-[75px]" title={stk.name}>
                {stk.name}
              </p>
              
              <div className="flex gap-1.5 mt-1.5">
                <button
                  onClick={() => {
                    const newName = prompt('Đổi tên sticker:', stk.name);
                    if (newName && newName !== stk.name) {
                      onAddAsset('stickers', { ...stk, name: newName });
                    }
                  }}
                  className="p-1 rounded bg-slate-200 dark:bg-zinc-750 text-slate-650 dark:text-zinc-350 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                  title="Sửa tên sticker"
                >
                  <Icon name="edit" size={8} />
                </button>
                <button 
                  onClick={() => {
                    if (confirm(`Bạn có muốn xóa sticker "${stk.name}" không?`)) {
                      onDeleteAsset('stickers', stk.id);
                    }
                  }}
                  className="p-1 rounded bg-red-100 dark:bg-red-950/20 text-red-650 dark:text-red-400 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                  title="Xóa sticker"
                >
                  <Icon name="close" size={8} />
                </button>
              </div>
            </div>
          ))}

          <input
            type="file"
            accept="image/*"
            id="sticker-file-upload"
            className="hidden"
            onChange={handleUploadSticker}
            disabled={uploadingSticker}
          />
          <label 
            htmlFor="sticker-file-upload"
            className="bg-dashed border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/5 rounded-2xl flex flex-col items-center justify-center p-3 text-slate-400 hover:text-rose-500 cursor-pointer aspect-square transition-all min-h-[110px]"
          >
            {uploadingSticker ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500 mb-1" />
                <span className="text-[8px] font-black uppercase tracking-wider">Tải lên...</span>
              </>
            ) : (
              <>
                <Icon name="plus" size={18} className="mb-1" />
                <span className="text-[9px] font-black uppercase tracking-wider">Thêm mới</span>
              </>
            )}
          </label>
        </div>
      </div>

      {/* Logos */}
      <div className="space-y-4 pt-4">
        <h4 className="text-xs font-black uppercase text-slate-700 dark:text-zinc-350 border-b border-slate-100 dark:border-zinc-800 pb-1">
          🖋️ Chữ Ký Thương Hiệu / Logos Watermarks
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {assets.logos?.map((lg: any) => (
            <div key={lg.id} className="bg-slate-50 dark:bg-zinc-850 border border-slate-150 dark:border-zinc-800 p-4 rounded-xl flex items-center justify-between group">
              <div className="min-w-0 flex-1 pr-2">
                <p className="text-xs font-bold text-slate-700 dark:text-zinc-350 truncate">{lg.name}</p>
                <p className="text-[10px] font-mono text-slate-450 dark:text-zinc-500 mt-0.5 truncate" title={lg.url}>{lg.url}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const newName = prompt('Đổi tên logo/watermark:', lg.name);
                    if (newName && newName !== lg.name) {
                      onAddAsset('logos', { ...lg, name: newName });
                    }
                  }}
                  className="p-1.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                  title="Sửa tên logo"
                >
                  <Icon name="edit" size={10} />
                </button>
                <button 
                  onClick={() => {
                    if (confirm(`Bạn có muốn xóa logo "${lg.name}" không?`)) {
                      onDeleteAsset('logos', lg.id);
                    }
                  }}
                  className="p-1.5 rounded bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                  title="Xóa logo"
                >
                  <Icon name="trash" size={10} />
                </button>
              </div>
            </div>
          ))}

          <input
            type="file"
            accept="image/*"
            id="logo-file-upload"
            className="hidden"
            onChange={handleUploadLogo}
            disabled={uploadingLogo}
          />
          <label 
            htmlFor="logo-file-upload"
            className="border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-rose-500 hover:bg-rose-500/5 rounded-xl flex flex-col items-center justify-center p-4 text-slate-400 hover:text-rose-500 cursor-pointer transition-all min-h-[70px]"
          >
            {uploadingLogo ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-rose-500 mb-1" />
                <span className="text-[8px] font-black uppercase tracking-wider">Tải lên...</span>
              </>
            ) : (
              <>
                <Icon name="plus" size={16} className="mb-1" />
                <span className="text-[10px] font-black uppercase tracking-wider">Thêm logo mới</span>
              </>
            )}
          </label>
        </div>
      </div>
    </div>
  );
};
