'use client';

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import AuthFooter from '@/components/auth/AuthFooter';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-[420px] mx-auto space-y-4 xl:space-y-6">
      {/* 1. Main Forgot Password Card */}
      <ForgotPasswordForm />

      {/* 2. Switch Route Link */}
      <div className="text-center text-xs text-slate-500 dark:text-zinc-400">
        Quay lại{' '}
        <Link
          href="/auth/login"
          className="font-black text-rose-500 hover:text-rose-600 transition-colors"
        >
          Đăng nhập
        </Link>
      </div>

      {/* 3. Support and policies footer */}
      <AuthFooter />
    </div>
  );
}
