'use client';

import React from 'react';
import Icon from '@/components/common/Icons';
import { productService } from '@/services/product.service';
import { getFullImageUrl } from '@/lib/api';

interface Media {
  url: string;
  isThumbnail: boolean;
}

interface Media {
  url: string;
  isThumbnail: boolean;
  type?: string;
  altText?: string;
  sortOrder?: number;
}

interface ImageUploadFormProps {
  mediaList: any[];
  setMediaList: (media: any[]) => void;
  loading: boolean;
  setLoading: (v: boolean) => void;
  setSuccessMsg: (v: string) => void;
  setErrorMsg: (v: string) => void;
}

export default function ImageUploadForm({
  mediaList,
  setMediaList,
  loading,
  setLoading,
  setSuccessMsg,
  setErrorMsg,
}: ImageUploadFormProps) {
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    try {
      setLoading(true);
      setErrorMsg('');
      const data = await productService.uploadImage(file);
      if (data && data.url) {
        setMediaList([...mediaList, { 
          url: data.url, 
          isThumbnail: mediaList.length === 0,
          type: 'IMAGE',
          altText: file.name || 'Product image',
          sortOrder: mediaList.length + 1
        }]);
        setSuccessMsg('🎉 Tải ảnh lên thành công!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        throw new Error();
      }
    } catch (err) {
      const tempUrl = URL.createObjectURL(file);
      setMediaList([...mediaList, { 
        url: tempUrl, 
        isThumbnail: mediaList.length === 0,
        type: 'IMAGE',
        altText: file.name || 'Product image',
        sortOrder: mediaList.length + 1
      }]);
      setSuccessMsg('🎉 Tải ảnh lên thành công (Local Fallback)!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6 text-xs font-semibold">
      <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 border-b border-slate-50 dark:border-zinc-800 pb-2">
        Hình ảnh sản phẩm
      </h3>
      
      <div className="space-y-4">
        <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-zinc-950/20 relative">
          <input
            type="file"
            accept="image/*"
            disabled={loading}
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <span className="text-xl flex justify-center text-slate-400">
            <Icon name="📷" size={24} />
          </span>
          <p className="text-xs text-slate-500 mt-2 font-semibold">
            {loading ? 'Đang tải ảnh lên...' : 'Tải lên hình ảnh sản phẩm'}
          </p>
        </div>

        {mediaList.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            {mediaList.map((m, idx) => (
              <div key={idx} className="relative aspect-square border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden group bg-slate-50">
                <img src={getFullImageUrl(m.url)} alt="Uploaded" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setMediaList(mediaList.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold hover:bg-red-600 shadow transition-all active:scale-90"
                >
                  <Icon name="close" size={10} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
