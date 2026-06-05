'use client';

import React, { useState, useEffect } from 'react';
import { useHomeLayoutStore, DEFAULT_STATE } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const { brandIntro, footer } = useHomeLayoutStore();

  const activeIntro = mounted ? brandIntro : DEFAULT_STATE.brandIntro;
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

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Haniu Gift Shop',
    'url': typeof window !== 'undefined' ? window.location.origin : 'https://haniu.vn',
    'logo': typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : 'https://haniu.vn/logo.png',
    'description': activeIntro.description,
    'foundingDate': '2020',
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': activeFooter.phone,
      'contactType': 'customer service',
      'email': activeFooter.email
    }
  };

  const coreValues = [
    {
      icon: '✨',
      title: 'Cá Nhân Hóa Độc Bản',
      desc: 'Mỗi cá nhân là một câu chuyện riêng biệt. Chúng tôi mang đến công nghệ khắc laser chuẩn xác giúp ghi dấu ấn cá nhân lên từng sản phẩm từ gỗ, da, đến gốm sứ.'
    },
    {
      icon: '🎨',
      title: 'Nghệ Thuật Chế Tác Thủ Công',
      desc: 'Không sản xuất hàng loạt bằng máy móc công nghiệp. Sản phẩm tại Haniu được mài giũa, khâu tay và kiểm duyệt tỉ mỉ qua đôi bàn tay lành nghề của nghệ nhân Việt.'
    },
    {
      icon: '💎',
      title: 'Chất Liệu Tuyển Chọn Premium',
      desc: 'Haniu cam kết chỉ sử dụng nguyên liệu cao cấp nhất: Gỗ sồi tự nhiên, da bò thật nguyên tấm nhập khẩu và gốm sứ tráng men hỏa biến tinh xảo từ làng nghề truyền thống.'
    },
    {
      icon: '🌱',
      title: 'Trách Nhiệm & Bền Vững',
      desc: 'Chúng tôi ưu tiên sử dụng các vật liệu tự nhiên, thân thiện với môi trường, hạn chế tối đa rác thải nhựa trong khâu đóng gói nhằm hướng tới tương lai bền vững.'
    }
  ];

  const timelineSteps = [
    { year: '2020', title: 'Khởi Đầu Sáng Tạo', desc: 'Haniu được thành lập tại một xưởng gỗ thủ công nhỏ ở Hà Nội với sứ mệnh biến quà tặng thành kỷ vật lưu niệm.' },
    { year: '2022', title: 'Cột Mốc 10.000+ Khách Hàng', desc: 'Trở thành thương hiệu quà tặng khắc tên được yêu thích hàng đầu cho giới trẻ và cặp đôi trên các nền tảng số.' },
    { year: '2024', title: 'Vươn Tầm Doanh Nghiệp', desc: 'Ra mắt dòng sản phẩm B2B cao cấp phục vụ đại hội, quà tặng doanh nghiệp cho các tập đoàn đa quốc gia.' },
    { year: '2026', title: 'Đổi Mới Trải Nghiệm Khách Hàng', desc: 'Nâng cấp công nghệ và mở rộng hệ thống đại lý trên toàn quốc.' }
  ];

  return (
    <>
      <div className="space-y-24 pt-4 pb-12">
        {/* Banner Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[32px] overflow-hidden bg-slate-100/60 dark:bg-zinc-950 text-slate-800 dark:text-white p-6 sm:p-10 lg:p-12 shadow-lg border border-slate-200 dark:border-zinc-900">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent opacity-60 dark:opacity-40 pointer-events-none" />
            <div className="relative z-10 max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 border border-rose-500/25">
                <Icon name="gem" size={10} className="animate-pulse" /> {activeIntro.subtitle || 'VỀ HANIU'}
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight py-1 text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-rose-500">
                {activeIntro.title}
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-350 leading-relaxed font-light whitespace-pre-line tracking-wide">
                {activeIntro.description}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {activeIntro.stats?.map((stat, idx) => (
              <div 
                key={idx} 
                className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-xs text-center space-y-2 hover:-translate-y-1 transition-all duration-300 group"
              >
                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-br from-amber-500 to-rose-500 bg-clip-text text-transparent block group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Giá Trị Cốt Lõi Của Chúng Tôi
            </h2>
            <p className="text-xs text-slate-400 font-light">
              Những nguyên tắc nền tảng định hình nên phong cách thiết kế và dịch vụ chăm sóc tại Haniu Gift Shop.
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-rose-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreValues.map((value, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-zinc-900 p-8 rounded-[36px] border border-slate-200 dark:border-zinc-800 shadow-xs flex gap-5 hover:border-rose-500/10 dark:hover:border-rose-500/10 transition-colors animate-fade-in"
              >
                <span className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                  <Icon name={value.icon} size={20} className="text-rose-500" />
                </span>
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-sm">
                    {value.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-light leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline / Journey Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Hành Trình Kiến Tạo
            </h2>
            <p className="text-xs text-slate-400 font-light">
              Nhìn lại những cột mốc phát triển đáng nhớ để trở thành thương hiệu uy tín như hôm nay.
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-rose-500 mx-auto rounded-full" />
          </div>

          <div className="relative border-l border-slate-200 dark:border-zinc-800 max-w-4xl mx-auto pl-6 sm:pl-10 space-y-8 py-2">
            {timelineSteps.map((step, idx) => (
              <div key={idx} className="relative space-y-2">
                <span className="absolute -left-[32px] sm:-left-[48px] top-0.5 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-4 border-rose-500 flex items-center justify-center ring-4 ring-rose-500/15" />
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-[28px] border border-slate-200 dark:border-zinc-800 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-rose-500 bg-rose-500/10 px-3 py-1 rounded-full">
                      {step.year}
                    </span>
                    <h4 className="font-bold text-slate-800 dark:text-zinc-200 text-xs sm:text-sm">
                      {step.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-light mt-2 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
