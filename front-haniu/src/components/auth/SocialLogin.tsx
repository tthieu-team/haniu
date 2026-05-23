'use client';

import React from 'react';

export default function SocialLogin() {
  const handleSocialClick = (platform: string) => {
    alert(`Đăng nhập bằng ${platform} hiện đang được cấu hình. Hệ thống sẽ chuyển hướng trong giây lát.`);
  };

  return (
    <div className="w-full space-y-4">
      {/* Divider */}
      <div className="relative flex items-center justify-center my-4 xl:my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-100 dark:border-zinc-800"></div>
        </div>
        <span className="relative px-4 text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-widest bg-white dark:bg-zinc-900">
          Hoặc tiếp tục với
        </span>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-3 gap-3">
        {/* Google Button */}
        <button
          type="button"
          onClick={() => handleSocialClick('Google')}
          className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200/80 dark:border-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-300 group cursor-pointer shadow-sm"
          title="Đăng nhập bằng Google"
        >
          <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.79 5.79 0 0 1 8.2 12.725a5.79 5.79 0 0 1 5.79-5.79c1.498 0 2.857.562 3.902 1.49l3.003-3.003C19.068 3.738 16.732 2.735 13.99 2.735a9.96 9.96 0 0 0-9.96 9.96a9.96 9.96 0 0 0 9.96 9.96c5.54 0 9.68-3.902 9.68-9.68c0-.62-.062-1.22-.166-1.78l-1.285.09Z"
            />
          </svg>
        </button>

        {/* Facebook Button */}
        <button
          type="button"
          onClick={() => handleSocialClick('Facebook')}
          className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200/80 dark:border-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-300 group cursor-pointer shadow-sm"
          title="Đăng nhập bằng Facebook"
        >
          <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </button>

        {/* Apple Button */}
        <button
          type="button"
          onClick={() => handleSocialClick('Apple')}
          className="flex items-center justify-center py-2.5 px-4 rounded-xl border border-slate-200/80 dark:border-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-300 group cursor-pointer shadow-sm"
          title="Đăng nhập bằng Apple"
        >
          <svg className="h-5 w-5 transition-transform duration-300 group-hover:scale-110 fill-slate-800 dark:fill-white" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.64.74-1.2 1.88-1.05 2.99 1.12.09 2.26-.57 3-.1.05.04.05.03 0 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
