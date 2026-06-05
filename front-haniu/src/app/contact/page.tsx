'use client';

import React, { useState, useEffect } from 'react';
import { useHomeLayoutStore, DEFAULT_STATE } from '@/store/homeLayout';
import { contactService, ContactSubmissionPayload } from '@/services/contact.service';
import Icon from '@/components/common/Icons';

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState<ContactSubmissionPayload>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { footer } = useHomeLayoutStore();
  const activeFooter = mounted ? footer : DEFAULT_STATE.footer;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center py-32 bg-slate-50/50 dark:bg-zinc-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      await contactService.submitContact(formData);
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err: any) {
      console.error('Failed to submit contact:', err);
      setError(err.message || 'Có lỗi xảy ra khi gửi thông tin liên hệ. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50/50 dark:bg-zinc-950 min-h-screen pt-4 pb-12 space-y-16 animate-fade-in font-sans">
      
      {/* Banner Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[32px] overflow-hidden bg-slate-100/60 dark:bg-zinc-950 text-slate-800 dark:text-white p-6 sm:p-10 lg:p-12 shadow-lg border border-slate-200 dark:border-zinc-900">
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent opacity-60 dark:opacity-40 pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 border border-rose-500/25">
              <Icon name="map-pin" size={10} className="animate-pulse" /> CONTACT US
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight py-1 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-rose-500">
              Liên Hệ Với Haniu
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-355 leading-relaxed font-light tracking-wide max-w-xl">
              Gửi phản hồi, yêu cầu đặt hàng thiết kế riêng hoặc thắc mắc của bạn cho chúng tôi. Đội ngũ Haniu sẽ phản hồi sớm nhất trong vòng 2 giờ.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Contact details & Map */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-[36px] border border-slate-200 dark:border-zinc-800 p-8 shadow-xs space-y-6">
              <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800 pb-3">
                Thông Tin Chi Tiết
              </h3>
              
              <div className="space-y-5 text-xs font-light text-slate-500 dark:text-zinc-400">
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center shrink-0">
                    <Icon name="map-pin" size={16} />
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-zinc-300 block mb-0.5">Địa chỉ cửa hàng</span>
                    <p className="leading-relaxed">{activeFooter.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center shrink-0">
                    <Icon name="phone" size={16} />
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-zinc-300 block mb-0.5">Số điện thoại</span>
                    <a href={`tel:${activeFooter.phone}`} className="hover:text-rose-500 transition-colors font-medium text-slate-800 dark:text-zinc-200">{activeFooter.phone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-2xl bg-rose-50/80 dark:bg-rose-950/20 text-rose-500 flex items-center justify-center shrink-0">
                    <Icon name="mail" size={16} />
                  </span>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-zinc-300 block mb-0.5">Hòm thư điện tử</span>
                    <a href={`mailto:${activeFooter.email}`} className="hover:text-rose-500 transition-colors font-medium text-slate-800 dark:text-zinc-200">{activeFooter.email}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded map mockup/placeholder */}
            <div className="relative overflow-hidden rounded-[36px] border border-slate-200 dark:border-zinc-800 shadow-md aspect-video bg-slate-100 dark:bg-zinc-900 flex items-center justify-center">
              <div className="absolute inset-0 bg-rose-500/5 dark:bg-rose-500/5 pointer-events-none" />
              <div className="text-center space-y-2 z-10 px-6">
                <Icon name="map-pin" size={28} className="text-rose-500 mx-auto animate-bounce" />
                <span className="font-bold text-xs text-slate-800 dark:text-zinc-250 block">Haniu Gift Shop Map</span>
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 block max-w-xs mx-auto leading-relaxed">
                  {activeFooter.address}
                </span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeFooter.address)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block mt-3 px-4.5 py-2.5 bg-slate-900 dark:bg-zinc-800 hover:bg-rose-500 hover:dark:bg-rose-600 text-white rounded-xl text-[10px] font-bold shadow-sm transition-all cursor-pointer"
                >
                  Xem Bản Đồ Lớn
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7 bg-white dark:bg-zinc-900 rounded-[36px] border border-slate-200 dark:border-zinc-800 p-8 sm:p-10 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-xs uppercase tracking-wider border-b border-slate-100 dark:border-zinc-800 pb-3">
              Gửi tin nhắn trực tuyến
            </h3>

            {success && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-2xl font-semibold flex items-center gap-2 animate-fade-in">
                <Icon name="check" size={16} />
                <span>Gửi lời nhắn thành công! Haniu sẽ liên hệ lại với bạn sớm nhất. 🎉</span>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs rounded-2xl font-semibold flex items-center gap-2 animate-fade-in">
                <Icon name="close" size={16} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-slate-850 dark:text-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/20"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-slate-850 dark:text-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/20"
                    placeholder="0987.654.321"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">Địa chỉ Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/20"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">Tiêu đề liên hệ</label>
                <input
                  type="text"
                  value={formData.subject || ''}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/20"
                  placeholder="Ví dụ: Đặt hàng quà doanh nghiệp, Hợp tác..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-400 font-bold uppercase block">Nội dung lời nhắn *</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-slate-800 dark:text-white focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500/20"
                  placeholder="Hãy mô tả chi tiết yêu cầu hoặc phản hồi của bạn..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4.5 w-4.5 border-b-2 border-white" />
                ) : (
                  <>
                    <Icon name="mail" size={14} />
                    <span>Gửi tin nhắn liên hệ</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
