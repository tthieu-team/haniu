'use client';

import { useState } from 'react';
import Icon from '@/components/common/Icons';
import { productService } from '@/services/product.service';

interface StudioPhotoboothProps {
  photoboothPhotoUrl: string;
  setPhotoboothPhotoUrl: (url: string) => void;
}

export default function StudioPhotobooth({
  photoboothPhotoUrl,
  setPhotoboothPhotoUrl,
}: StudioPhotoboothProps) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleStartCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
      });
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      alert('Không thể truy cập camera. Vui lòng kiểm tra quyền camera.');
    }
  };

  const handleStopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
    setStream(null);
  };

  const handleCapture = async () => {
    const video = document.querySelector('video');
    if (video) {
      const canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 640;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        ctx.lineWidth = 20;
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, canvas.height - 80, canvas.width, 80);
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'italic bold 20px serif';
        ctx.textAlign = 'center';
        ctx.fillText('Haniu Photobooth', canvas.width / 2, canvas.height - 35);

        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], 'photobooth.png', { type: 'image/png' });
            try {
              const data = await productService.uploadImage(file);
              if (data && data.url) {
                setPhotoboothPhotoUrl(data.url);
              }
            } catch (e) {
              setPhotoboothPhotoUrl(URL.createObjectURL(blob));
            }
          }
        });
      }
    }
    handleStopCamera();
  };

  return (
    <div className="bg-gradient-to-br from-rose-500/[0.02] to-amber-500/[0.02] border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl p-5 space-y-3 text-xs font-semibold w-full shadow-xs animate-fade-in text-slate-800 dark:text-zinc-100">
      <label className="block text-slate-500 dark:text-zinc-400 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
        <Icon name="🖼️" size={14} className="text-rose-500" /> Studio Photobooth Haniu - In ảnh tặng kèm
      </label>

      {photoboothPhotoUrl ? (
        <div className="space-y-3 text-center">
          <div className="relative inline-block border-8 border-white dark:border-zinc-850 shadow-md rounded-lg overflow-hidden bg-slate-50">
            <img src={photoboothPhotoUrl} className="w-40 h-52 object-cover" alt="Photobooth print" />
            <button
              type="button"
              onClick={() => setPhotoboothPhotoUrl('')}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-650 transition-colors cursor-pointer"
            >
              <Icon name="close" size={12} />
            </button>
            <p className="font-serif italic text-[10px] text-slate-500 dark:text-zinc-400 py-1 bg-white dark:bg-zinc-855">Haniu Studio Print</p>
          </div>
          <p className="text-emerald-500 text-[10px] font-bold">✓ Đã đính kèm ảnh chụp photobooth của bạn!</p>
        </div>
      ) : isCameraActive ? (
        <div className="space-y-3 text-center">
          <div className="relative mx-auto w-64 h-48 bg-black rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800">
            <video
              ref={(el) => {
                if (el && stream) {
                  el.srcObject = stream;
                  el.play().catch(console.error);
                }
              }}
              className="w-full h-full object-cover scale-x-[-1]"
              playsInline
              muted
            />
            <div className="absolute inset-0 border-[6px] border-white/80 pointer-events-none" />
            <div className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
              <span className="px-2 py-0.5 bg-black/60 text-white text-[9px] rounded-md font-mono">Haniu Cam Live</span>
            </div>
          </div>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={handleStopCamera}
              className="px-3 py-1.5 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 rounded-xl text-[10px] font-bold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleCapture}
              className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-bold cursor-pointer"
            >
              📸 Chụp Ngay
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center p-4 border-2 border-dashed border-rose-200/50 rounded-2xl bg-white dark:bg-zinc-900/40">
          <p className="text-slate-550 dark:text-zinc-400 mb-3 text-[11px] leading-relaxed">
            Bạn muốn gửi quà kèm 1 bức ảnh kỷ niệm tự chụp? Bật camera tự sướng ngay tại nhà, Haniu sẽ in màu ảnh xinh xắn để đặt vào hộp quà cho bạn.
          </p>
          <button
            type="button"
            onClick={handleStartCamera}
            className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 mx-auto text-[10px] cursor-pointer"
          >
            <Icon name="camera" size={12} /> Bật Camera & Chụp ảnh
          </button>
        </div>
      )}
    </div>
  );
}
