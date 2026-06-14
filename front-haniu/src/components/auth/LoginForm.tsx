'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/common/Icons';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth';
import { useCartStore } from '@/store/cart';

export default function LoginForm() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status and Validation states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Real-time validations
  const isEmailValid = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };
  const isPhoneValid = (val: string) => {
    const phoneRegex = /^(0|84)[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(val);
  };
  const isIdentifierValid = emailOrPhone ? (isEmailValid(emailOrPhone) || isPhoneValid(emailOrPhone)) : null;
  const isPasswordValid = password ? password.length >= 6 : null;

  const handlePasswordLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin đăng nhập.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const payload = {
        email: emailOrPhone,
        password: password
      };

      await authService.login(payload);

      setSuccess(true);
      setTimeout(() => {
        const { user } = useAuthStore.getState();
        if (user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/');
        }
      }, 1500);

    } catch (err: any) {
      setErrorMsg(err?.message || 'Email hoặc mật khẩu không chính xác.');

      // Fallback for demo/development if backend is not seeded/reachable
      if (emailOrPhone === 'admin@haniu.vn' || emailOrPhone === 'test@haniu.vn' || emailOrPhone === '0987654321') {
        if (password === '123456') {
          setErrorMsg('');
          setSuccess(true);
          const isDemoAdmin = emailOrPhone === 'admin@haniu.vn';
          const { setAuth } = useAuthStore.getState();
          setAuth('mock-jwt-token', 'mock-refresh-token', {
            fullName: isDemoAdmin ? 'Haniu Admin' : 'Nguyễn Văn Haniu',
            role: isDemoAdmin ? 'ADMIN' : 'USER'
          });
          try {
            useCartStore.getState().mergeCarts();
          } catch (e) {
            console.error('Failed to merge carts on mock login', e);
          }
          setTimeout(() => {
            if (isDemoAdmin) {
              router.push('/admin');
            } else {
              router.push('/');
            }
          }, 1500);
          return;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto p-6 sm:p-8 bg-white/85 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-2xl dark:shadow-black/50 transition-all duration-300 relative overflow-hidden">
      
      {/* Success Animation Overlay */}
      {success && (
        <div className="absolute inset-0 bg-white/95 dark:bg-zinc-900/95 z-50 flex flex-col items-center justify-center p-6 animate-fade-in">
          <div className="relative flex items-center justify-center w-20 h-20 bg-emerald-100 dark:bg-emerald-950/50 rounded-full animate-bounce">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping" />
          </div>
          <h3 className="mt-6 text-lg font-bold text-slate-800 dark:text-white">
            Đăng nhập thành công!
          </h3>
          <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">
            Đang chuyển hướng bạn đến trang chủ...
          </p>
        </div>
      )}

      {/* Header Form */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          Chào mừng quay lại
        </h1>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1.5 leading-relaxed">
          Đăng nhập bằng tài khoản và mật khẩu của bạn để mua sắm và nhận đặc quyền.
        </p>
      </div>

      {/* Error Message Box */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3.5 mb-5 bg-rose-50 dark:bg-rose-955/20 text-rose-500 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-900/30 animate-shake">
          <span className="shrink-0 text-base">✕</span>
          <span className="leading-relaxed">{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePasswordLoginSubmit} className="space-y-4">
        {/* Email / Phone Field */}
        <div className="space-y-1">
          <div className="relative border border-slate-200 dark:border-zinc-850 focus-within:border-rose-500 rounded-2xl transition-colors bg-slate-50/50 dark:bg-zinc-950/40">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Icon name="mail" size={15} />
            </span>
            <input
              type="text"
              id="identifier"
              placeholder=" "
              required
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="peer w-full pl-11 pr-4 pt-5 pb-1.5 text-sm bg-transparent focus:outline-none text-slate-800 dark:text-white"
            />
            <label
              htmlFor="identifier"
              className="absolute left-11 top-3.5 text-xs text-slate-400 pointer-events-none transition-all duration-200 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-rose-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1.5"
            >
              Email hoặc Số điện thoại
            </label>
          </div>
          {/* Real-time Indicator */}
          {emailOrPhone && (
            <div className="px-1 text-[10px] font-bold">
              {isIdentifierValid ? (
                <span className="text-emerald-500 flex items-center gap-1">✓ Định dạng hợp lệ</span>
              ) : (
                <span className="text-rose-500 flex items-center gap-1">✕ Email/SĐT chưa đúng định dạng</span>
              )}
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="relative border border-slate-200 dark:border-zinc-850 focus-within:border-rose-500 rounded-2xl transition-colors bg-slate-50/50 dark:bg-zinc-950/40">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Icon name="shield" size={15} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder=" "
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full pl-11 pr-11 pt-5 pb-1.5 text-sm bg-transparent focus:outline-none text-slate-800 dark:text-white"
            />
            <label
              htmlFor="password"
              className="absolute left-11 top-3.5 text-xs text-slate-400 pointer-events-none transition-all duration-200 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-rose-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1.5"
            >
              Mật khẩu
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 cursor-pointer"
            >
              <Icon name="eye" size={15} />
            </button>
          </div>
          {/* Real-time Indicator */}
          {password && (
            <div className="px-1 text-[10px] font-bold">
              {isPasswordValid ? (
                <span className="text-emerald-500 flex items-center gap-1">✓ Mật khẩu hợp lệ</span>
              ) : (
                <span className="text-rose-500 flex items-center gap-1">✕ Mật khẩu tối thiểu 6 ký tự</span>
              )}
            </div>
          )}
        </div>

        {/* Remember and Forgot Password */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 text-slate-550 dark:text-zinc-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded border-slate-200 dark:border-zinc-800 text-rose-500 focus:ring-rose-500/50 w-4 h-4 cursor-pointer"
            />
            <span>Ghi nhớ đăng nhập</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="font-bold text-rose-500 hover:text-rose-600 transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 mt-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:from-slate-300 disabled:to-slate-350 text-white font-bold text-xs rounded-2xl shadow-lg shadow-rose-500/10 hover:shadow-rose-500/25 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Đang đăng nhập...</span>
            </>
          ) : (
            <span>Đăng nhập</span>
          )}
        </button>
      </form>
    </div>
  );
}
