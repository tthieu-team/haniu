'use client';

import React, { useState } from 'react';
import { productService } from '@/services/product.service';
import Icon from '@/components/common/Icons';

interface FileUploadInputProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  type?: 'image' | 'video' | 'auto';
  placeholder?: string;
}

function isVideoUrl(url: string) {
  if (!url) return false;
  const cleanUrl = url.split('?')[0].split('#')[0].toLowerCase();
  return (
    cleanUrl.endsWith('.mp4') ||
    cleanUrl.endsWith('.webm') ||
    cleanUrl.endsWith('.ogg') ||
    cleanUrl.endsWith('.mov') ||
    url.includes('/uploads/products/videos') ||
    url.includes('/uploads/files/products/videos') ||
    url.includes('video')
  );
}

export function FileUploadInput({
  value,
  onChange,
  label,
  accept = 'image/*',
  type = 'image',
  placeholder = 'Đường dẫn URL hoặc tải lên tệp...',
}: FileUploadInputProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const isVideoFile = file.type.startsWith('video/');
      const res = isVideoFile 
        ? await productService.uploadVideo(file)
        : await productService.uploadImage(file);
      if (res && res.url) {
        onChange(res.url);
      } else {
        throw new Error('Không nhận được URL tải lên.');
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải tệp lên Cloud.');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = async () => {
    if (!value) return;
    if (confirm('Bạn muốn xóa tệp này khỏi hệ thống?')) {
      try {
        await productService.deleteFile(value);
      } catch (err) {
        console.error('Lỗi khi xóa tệp trên server:', err);
      }
      onChange('');
    }
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="text-[10px] text-slate-500 font-bold uppercase block dark:text-zinc-455">
          {label}
        </label>
      )}
      
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white font-medium"
        />
        
        <label className="shrink-0 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 border border-slate-200 dark:border-zinc-750 px-3 py-2 rounded-xl cursor-pointer text-xs font-semibold text-slate-700 dark:text-zinc-200 active:scale-95 transition-all">
          {uploading ? (
            <svg className="animate-spin h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <span className="flex items-center gap-1.5">
              <Icon name="camera" size={14} />
              <span>Tải lên</span>
            </span>
          )}
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 flex items-center justify-center bg-red-50 hover:bg-red-100 dark:bg-red-950/20 border border-red-200 dark:border-red-950/40 text-red-650 dark:text-red-400 px-3 py-2 rounded-xl cursor-pointer text-xs font-semibold active:scale-95 transition-all"
            title="Xóa file khỏi server"
          >
            <Icon name="trash" size={14} />
          </button>
        )}
      </div>

      {error && <p className="text-[10px] text-red-500 font-medium">{error}</p>}

      {/* Preview container */}
      {value && (
        <div className="mt-2 inline-block">
          {(type === 'video' || (type === 'auto' && isVideoUrl(value))) ? (
            <video
              src={value}
              className="max-h-24 max-w-[240px] rounded-xl object-cover border border-slate-200 dark:border-zinc-800 shadow-xs"
              controls
              onError={(e) => {
                const target = e.target as HTMLVideoElement;
                if (!target.src.startsWith('http') && !target.src.startsWith('data:')) {
                  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                  target.src = `${API_BASE}${value.startsWith('/') ? '' : '/'}${value}`;
                }
              }}
            />
          ) : (
            <img
              src={value}
              alt="Preview"
              className="max-h-24 max-w-[240px] rounded-xl object-cover border border-slate-200 dark:border-zinc-800 shadow-xs"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.startsWith('http') && !target.src.startsWith('data:')) {
                  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
                  target.src = `${API_BASE}${value.startsWith('/') ? '' : '/'}${value}`;
                }
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}
