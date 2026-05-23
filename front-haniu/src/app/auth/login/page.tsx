'use client';

import LoginForm from '@/components/auth/LoginForm';
import SocialLogin from '@/components/auth/SocialLogin';
import AuthFooter from '@/components/auth/AuthFooter';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="w-full max-w-[420px] mx-auto space-y-4 xl:space-y-6">
      {/* 1. Main Login Card */}
      <LoginForm />

      {/* 2. Switch Route Link */}
      <div className="text-center text-xs text-slate-500 dark:text-zinc-400">
        Bạn chưa có tài khoản Haniu?{' '}
        <Link
          href="/auth/register"
          className="font-black text-rose-500 hover:text-rose-600 transition-colors"
        >
          Đăng ký miễn phí
        </Link>
      </div>

      {/* 3. Social login integrations */}
      <SocialLogin />

      {/* 4. Support and policies footer */}
      <AuthFooter />
    </div>
  );
}
