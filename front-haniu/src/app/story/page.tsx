'use client';

import React, { useState, useEffect } from 'react';
import { useHomeLayoutStore, DEFAULT_STATE } from '@/store/homeLayout';
import { getFullImageUrl } from '@/lib/api';
import Icon from '@/components/common/Icons';
import Link from 'next/link';

export default function StoryPage() {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const { story, footer } = useHomeLayoutStore();
  const activeStory = mounted ? story : DEFAULT_STATE.story;
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

  const videoUrl = getFullImageUrl(activeStory.videoUrl);
  const placeholderUrl = getFullImageUrl(activeStory.videoPlaceholderUrl);

  // SEO Schema Markup (JSON-LD) for Search Engine Optimization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Haniu Gift Shop',
    'url': typeof window !== 'undefined' ? window.location.origin : 'https://haniu.vn',
    'logo': typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : 'https://haniu.vn/logo.png',
    'description': 'Câu chuyện thương hiệu Haniu - Hành trình kiến tạo quà tặng thủ công cá nhân hóa nghệ thuật.',
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': activeFooter.phone,
      'contactType': 'customer service',
      'email': activeFooter.email,
      'areaServed': 'VN',
      'availableLanguage': 'Vietnamese'
    }
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': 'Câu Chuyện Chế Tác Thủ Công & Cá Nhân Hóa Haniu',
    'description': activeStory.content,
    'image': placeholderUrl || 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200',
    'author': {
      '@type': 'Organization',
      'name': 'Haniu Team'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Haniu Gift Shop',
      'logo': {
        '@type': 'ImageObject',
        'url': typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : 'https://haniu.vn/logo.png'
      }
    }
  };

  const philosophies = [
    {
      icon: '🎨',
      title: 'Tôn Vinh Nghệ Thuật Việt',
      desc: 'Mỗi sản phẩm Haniu không đơn thuần là một món quà tiêu dùng, mà là kết tinh nghệ thuật từ sự mài giũa, khâu tay tỉ mỉ của nghệ nhân Việt. Chúng tôi giữ trọn vẹn nét đẹp mộc mạc nguyên bản của gỗ sồi tự nhiên, chất da bò thật và lớp men sứ truyền thống.'
    },
    {
      icon: '✨',
      title: 'Cá Nhân Hóa Độc Bản',
      desc: 'Haniu ứng dụng công nghệ khắc laser hiện đại chuẩn xác đến từng micron để giúp bạn ghi dấu ấn cá nhân - những cái tên thân thương, ngày kỷ niệm khó phai hay những thông điệp chân thành - biến mỗi món quà thành một chương câu chuyện độc nhất vô nhị.'
    },
    {
      icon: '🌱',
      title: 'Trách Nhiệm & Bền Vững',
      desc: 'Chúng tôi ưu tiên sử dụng nguyên vật liệu hữu cơ thân thiện với môi trường, cam kết quy trình sản xuất giảm thiểu rác thải nhựa và các hộp quà được thiết kế thông minh để tái sử dụng làm khay đựng đồ dùng cá nhân xinh xắn tại nhà.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Tuyển Chọn Chất Liệu',
      desc: 'Chỉ những khối gỗ sồi tự nhiên đạt tuổi thọ, các tấm da bò nhập khẩu nguyên miếng mềm mịn và phôi sứ nung nhiệt cao khử độc mới được lựa chọn để chuẩn bị chế tác tại xưởng Haniu.'
    },
    {
      number: '02',
      title: 'Tạo Tác Thủ Công',
      desc: 'Các nghệ nhân Haniu tiến hành xẻ gỗ, mài bóng các góc cạnh, khâu tay tỉ mỉ từng đường kim mũi chỉ trên bìa da để tạo nên phom dáng hoàn chỉnh với độ bền vượt thời gian.'
    },
    {
      number: '03',
      title: 'Khắc Laser Nghệ Thuật',
      desc: 'Kỹ thuật viên sử dụng máy khắc laser công nghệ cao để chuyển tải trọn vẹn bản vẽ thiết kế cá nhân hóa lên bề mặt sản phẩm, tạo độ sâu và sắc nét tuyệt đối cho từng ký tự.'
    },
    {
      number: '04',
      title: 'Đóng Hộp Nghệ Thuật',
      desc: 'Sản phẩm hoàn thiện được đặt chỉn chu trong hộp lót lụa/rơm giấy thơm nhẹ, thắt nơ ruy băng nghệ thuật thủ công đi kèm thiệp tay ý nghĩa để sẵn sàng trao gửi bất ngờ.'
    }
  ];

  return (
    <>
      {/* Schema Markup for Search Engines (AEO/SEO optimization) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <main className="bg-slate-50/50 dark:bg-zinc-950 min-h-screen py-12 space-y-20 animate-fade-in font-sans">
        
        {/* Banner Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[40px] overflow-hidden bg-slate-100/60 dark:bg-zinc-950 text-slate-800 dark:text-white p-8 sm:p-16 lg:p-20 shadow-xl dark:shadow-2xl border border-slate-200 dark:border-zinc-900">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent opacity-60 dark:opacity-40 pointer-events-none" />
            <div className="relative z-10 max-w-3xl space-y-6">
              <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.25em] text-rose-500 bg-rose-500/10 border border-rose-500/25">
                <Icon name="sparkles" size={10} className="animate-pulse" /> {activeStory.subtitle || 'OUR JOURNEY'}
              </span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-rose-500">
                {activeStory.title}
                {activeStory.titleHighlight && (
                  <>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500 font-serif italic font-light">
                      {activeStory.titleHighlight}
                    </span>
                  </>
                )}
                {activeStory.titlePart2 && <> {activeStory.titlePart2}</>}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-300 leading-relaxed font-light tracking-wide max-w-xl">
                Khám phá câu chuyện phía sau những hộp quà trao tay - hành trình của sự chân thành, nhiệt huyết nghệ nhân và công nghệ chế tác tinh xảo tại Haniu.
              </p>
            </div>
          </div>
        </div>

        {/* Brand Mission & Showcase Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content text */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold tracking-widest text-rose-500 uppercase block">
                  SỨ MỆNH HANIU
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-zinc-200 tracking-tight leading-tight">
                  Biến những món quà bình thường thành kỷ vật vô giá
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 leading-relaxed font-light whitespace-pre-line tracking-wide">
                {activeStory.content}
              </p>
              <div className="pt-6 grid grid-cols-2 gap-4 border-t border-slate-200/50 dark:border-zinc-800">
                <div className="bg-white dark:bg-zinc-900/40 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
                  <span className="text-2xl block mb-1">🪵</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block mb-1">Chất Liệu Tự Nhiên</span>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-light leading-relaxed">
                    Sử dụng gỗ sồi bền bỉ, da bò thật mềm mại và sứ men hỏa biến tinh xảo.
                  </p>
                </div>
                <div className="bg-white dark:bg-zinc-900/40 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
                  <span className="text-2xl block mb-1">⚡</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block mb-1">Khắc Laser Cá Nhân Hóa</span>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-light leading-relaxed">
                    Ghi lại dấu ấn cá nhân hoàn toàn miễn phí cho tất cả các đơn hàng quà tặng.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Video / Mockup */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="relative group overflow-hidden rounded-[36px] border border-slate-200 dark:border-zinc-800 shadow-2xl aspect-video bg-zinc-950 ring-4 ring-slate-100/50 dark:ring-zinc-900/40">
                {isPlaying ? (
                  (!videoUrl || videoError) ? (
                    <div className="absolute inset-0 flex flex-col justify-center items-center gap-2 bg-zinc-950 p-6 text-center text-white">
                      <Icon name="alert-triangle" size={32} className="text-amber-500 animate-bounce" />
                      <span className="text-xs font-bold text-zinc-300">Không thể phát video</span>
                      <span className="text-[10px] text-zinc-400 max-w-xs break-all mt-1">
                        {!videoUrl 
                          ? 'Đường dẫn video chưa được thiết lập hoặc đang trống.' 
                          : `Không tải được tài nguyên từ máy chủ. Vui lòng kiểm tra lại đường dẫn video.`}
                      </span>
                      <button
                        onClick={() => {
                          setVideoError(false);
                          setIsPlaying(false);
                        }}
                        className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold rounded-xl cursor-pointer transition-colors border border-zinc-700"
                      >
                        Quay lại
                      </button>
                    </div>
                  ) : (
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      autoPlay
                      playsInline
                      onError={() => setVideoError(true)}
                    />
                  )
                ) : (
                  <>
                    <img
                      src={placeholderUrl || 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=1200&auto=format&fit=crop&q=80'}
                      alt="Hành trình chế tác Haniu"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-70 transition-all duration-1000 ease-out"
                    />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 bg-zinc-950/20 group-hover:bg-zinc-950/40 transition-colors duration-500">
                      <button
                        onClick={() => {
                          setVideoError(false);
                          setIsPlaying(true);
                        }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 scale-95 group-hover:scale-105 transition-all duration-500 cursor-pointer ring-4 ring-white/30 group-hover:ring-white/50"
                        title="Phát video câu chuyện"
                      >
                        <Icon name="play" size={24} className="text-white ml-1" />
                      </button>
                      <span className="text-[10px] font-extrabold tracking-widest text-white uppercase bg-black/60 backdrop-blur-md px-4.5 py-2.5 rounded-2xl border border-white/10 shadow-lg">
                        {activeStory.videoTitle || 'Xem video Behind the Scenes'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Our Philosophy Section */}
        <div className="bg-white dark:bg-zinc-900/40 py-16 border-y border-slate-200/50 dark:border-zinc-800/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <span className="text-[10px] font-extrabold tracking-widest text-rose-500 uppercase block">
                GIÁ TRỊ CỐT LÕI
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                Triết Lý Thiết Kế Của Chúng Tôi
              </h2>
              <p className="text-xs text-slate-400 dark:text-zinc-500 font-light leading-relaxed">
                Những nguyên tắc bất biến dẫn dắt mọi quyết định sáng tạo và chế tác tại Haniu.
              </p>
              <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-rose-500 mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {philosophies.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white dark:bg-zinc-900 p-8 rounded-[36px] border border-slate-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <span className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 text-xl font-bold">
                      {item.icon}
                    </span>
                    <h3 className="font-black text-slate-800 dark:text-zinc-200 text-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Crafting Steps Section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-extrabold tracking-widest text-rose-500 uppercase block">
              QUY TRÌNH CHẾ TÁC
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Tỉ Mỉ Trong Từng Đường Nét
            </h2>
            <p className="text-xs text-slate-400 dark:text-zinc-500 font-light leading-relaxed">
              Mỗi món quà là một chuỗi nỗ lực không ngừng nghỉ để mang tới sự hoàn mỹ tối đa cho người nhận.
            </p>
            <div className="w-12 h-1 bg-gradient-to-r from-amber-500 to-rose-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white dark:bg-zinc-900 p-6 rounded-[32px] border border-slate-200 dark:border-zinc-800 shadow-xs space-y-4 hover:border-rose-500/20 dark:hover:border-rose-500/20 transition-all duration-300 relative overflow-hidden"
              >
                <span className="absolute right-4 top-2 text-7xl font-black text-slate-100/60 dark:text-zinc-800/50 font-serif select-none pointer-events-none">
                  {item.number}
                </span>
                <div className="space-y-2 relative z-10">
                  <h3 className="font-bold text-slate-800 dark:text-zinc-200 text-xs sm:text-sm">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action CTA section */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[40px] overflow-hidden bg-slate-100/60 dark:bg-zinc-950 text-slate-800 dark:text-white p-8 sm:p-16 text-center shadow-xl dark:shadow-2xl border border-slate-200 dark:border-zinc-900">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-transparent opacity-60 dark:opacity-40 pointer-events-none" />
            <div className="relative z-10 max-w-xl mx-auto space-y-6">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-400 to-rose-500 leading-tight">
                Kiến Tạo Hộp Quà Độc Bản Cho Riêng Bạn
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-300 leading-relaxed font-light">
                Gửi tên, thông điệp khắc laser riêng biệt của bạn và duyệt mô phỏng 3D miễn phí cùng đội ngũ thiết kế của Haniu.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
                <Link 
                  href="/products" 
                  className="px-6 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-500/10 block text-center cursor-pointer"
                >
                  Khám phá bộ sưu tập quà
                </Link>
                <Link 
                  href="/contact" 
                  className="px-6 py-3.5 rounded-2xl border border-zinc-800 dark:border-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-900 text-slate-700 dark:text-zinc-300 text-xs font-bold transition-all block text-center cursor-pointer"
                >
                  Tư vấn thiết kế riêng
                </Link>
              </div>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
