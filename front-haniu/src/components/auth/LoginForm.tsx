'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/common/Icons';
import { authService } from '@/services/auth.service';

export default function LoginForm() {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP Login specific states
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Status and Validation states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

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
        username: emailOrPhone,
        password: password
      };

      await authService.login(payload);

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (err: any) {
      setErrorMsg(err?.message || 'Email hoặc mật khẩu không chính xác.');

      // Fallback for demo/development if backend is not seeded/reachable
      if (emailOrPhone === 'test@haniu.vn' || emailOrPhone === '0987654321') {
        if (password === '123456') {
          setErrorMsg('');
          setSuccess(true);
          const { setAuth } = require('@/store/auth').useAuthStore.getState();
          setAuth('mock-jwt-token', { fullName: 'Nguyễn Văn Haniu', role: 'USER' });
          setTimeout(() => {
            router.push('/');
          }, 1500);
          return;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!isPhoneValid(emailOrPhone)) {
      setErrorMsg('Vui lòng nhập số điện thoại hợp lệ để nhận mã OTP.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      // Simulating API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtpSent(true);
      setCountdown(59);

    } catch (err: any) {
      setErrorMsg('Lỗi gửi OTP. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      // Simulating OTP verification API call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Seed mock auth
      const { setAuth } = require('@/store/auth').useAuthStore.getState();
      setAuth('mock-otp-jwt-token', { fullName: 'Khách hàng OTP', role: 'USER' });

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (err: any) {
      setErrorMsg('Mã OTP không đúng hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] mx-auto p-4 sm:p-5 xl:p-6 bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-xl dark:shadow-black/50 transition-all duration-300 relative overflow-hidden">

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
      <div className="text-center mb-4 xl:mb-6">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          Chào mừng quay lại
        </h1>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
          Đăng nhập để trải nghiệm đặc quyền mua sắm quà tặng
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex p-1.5 bg-slate-50 dark:bg-zinc-950 rounded-2xl mb-4 xl:mb-6 border border-slate-100 dark:border-zinc-850">
        <button
          type="button"
          onClick={() => {
            setLoginMode('password');
            setErrorMsg('');
            setOtpSent(false);
          }}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all duration-350 ${loginMode === 'password'
              ? 'bg-white dark:bg-zinc-850 text-rose-500 shadow-sm'
              : 'text-slate-500 dark:text-zinc-400 hover:text-rose-455'
            }`}
        >
          Bằng Mật khẩu
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginMode('otp');
            setErrorMsg('');
          }}
          className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all duration-350 ${loginMode === 'otp'
              ? 'bg-white dark:bg-zinc-850 text-rose-500 shadow-sm'
              : 'text-slate-500 dark:text-zinc-400 hover:text-rose-455'
            }`}
        >
          Nhận mã OTP
        </button>
      </div>

      {/* Error Message Box */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-xl text-xs font-bold border border-rose-100 dark:border-rose-900/30 animate-shake">
          <span className="shrink-0 text-base">✕</span>
          <span className="leading-relaxed">{errorMsg}</span>
        </div>
      )}

      {/* Login by Password */}
      {loginMode === 'password' && (
        <form onSubmit={handlePasswordLoginSubmit} className="space-y-4">
          {/* Email / Phone Field */}
          <div className="space-y-1">
            <div className="relative border border-slate-200 dark:border-zinc-800 focus-within:border-rose-500 rounded-2xl transition-colors bg-slate-50/50 dark:bg-zinc-950/40">
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
                className="peer w-full pl-11 pr-4 pt-5 pb-1.5 text-base lg:text-xs bg-transparent focus:outline-none text-slate-800 dark:text-white"
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
            <div className="relative border border-slate-200 dark:border-zinc-800 focus-within:border-rose-500 rounded-2xl transition-colors bg-slate-50/50 dark:bg-zinc-950/40">
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
                className="peer w-full pl-11 pr-11 pt-5 pb-1.5 text-base lg:text-xs bg-transparent focus:outline-none text-slate-800 dark:text-white"
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
            <label className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 cursor-pointer select-none">
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
            className="w-full py-3.5 mt-1 xl:mt-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:from-slate-300 disabled:to-slate-350 text-white font-bold text-xs rounded-2xl shadow-lg shadow-rose-500/10 hover:shadow-rose-500/25 hover:scale-[1.01] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
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
      )}

      {/* Login by OTP */}
      {loginMode === 'otp' && (
        <div className="space-y-4">
          {!otpSent ? (
            <div className="space-y-4">
              <div className="relative border border-slate-200 dark:border-zinc-800 focus-within:border-rose-500 rounded-2xl transition-colors bg-slate-50/50 dark:bg-zinc-950/40">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Icon name="phone" size={15} />
                </span>
                <input
                  type="tel"
                  id="phone"
                  placeholder=" "
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="peer w-full pl-11 pr-4 pt-5 pb-1.5 text-base lg:text-xs bg-transparent focus:outline-none text-slate-800 dark:text-white"
                />
                <label
                  htmlFor="phone"
                  className="absolute left-11 top-3.5 text-xs text-slate-400 pointer-events-none transition-all duration-200 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-rose-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1.5"
                >
                  Số điện thoại đăng nhập
                </label>
              </div>

              {emailOrPhone && (
                <div className="px-1 text-[10px] font-bold">
                  {isPhoneValid(emailOrPhone) ? (
                    <span className="text-emerald-500 flex items-center gap-1">✓ Số điện thoại hợp lệ</span>
                  ) : (
                    <span className="text-rose-500 flex items-center gap-1">✕ Số điện thoại không đúng định dạng VN</span>
                  )}
                </div>
              )}

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading || !isPhoneValid(emailOrPhone)}
                className="w-full py-3.5 mt-1 xl:mt-2 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-350 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Đang gửi mã...' : 'Gửi mã OTP'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleOtpLoginSubmit} className="space-y-4">
              <div className="text-center p-3 bg-rose-50/50 dark:bg-zinc-950/60 rounded-2xl border border-rose-100/50 dark:border-zinc-850">
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Mã OTP đã được gửi đến SĐT: <strong className="text-slate-800 dark:text-white">{emailOrPhone}</strong>
                </p>
              </div>

              {/* OTP Code Fields */}
              <div className="space-y-1">
                <div className="relative border border-slate-200 dark:border-zinc-800 focus-within:border-rose-500 rounded-2xl transition-colors bg-slate-50/50 dark:bg-zinc-950/40">
                  <input
                    type="text"
                    id="otpCode"
                    maxLength={6}
                    placeholder=" "
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    className="peer w-full px-4 pt-5 pb-1.5 text-center text-base lg:text-sm font-black tracking-[0.5em] bg-transparent focus:outline-none text-slate-800 dark:text-white"
                  />
                  <label
                    htmlFor="otpCode"
                    className="absolute left-0 right-0 mx-auto w-fit top-3.5 text-xs text-slate-400 pointer-events-none transition-all duration-200 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-rose-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1.5"
                  >
                    Nhập mã 6 chữ số
                  </label>
                </div>
              </div>

              {/* Countdown and Resend */}
              <div className="flex justify-center text-xs">
                {countdown > 0 ? (
                  <span className="text-slate-400">Gửi lại mã sau <strong className="text-rose-500">{countdown}s</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    className="font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    Gửi lại mã OTP
                  </button>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || otpCode.length < 6}
                className="w-full py-3.5 mt-1 xl:mt-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:from-slate-300 disabled:to-slate-350 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Đang xác thực...' : 'Đăng nhập nhanh'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
