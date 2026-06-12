'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/common/Icons';
import { authService } from '@/services/auth.service';
import { useCartStore } from '@/store/cart';

export default function RegisterForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Verification step states
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Status & loading states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Password strength meter logic
  const getPasswordStrength = (pass: string): { label: string; score: number; colorClass: string; barWidth: string } => {
    if (!pass) return { label: '', score: 0, colorClass: 'bg-slate-200', barWidth: 'w-0' };
    if (pass.length < 6) return { label: 'Yếu (Tối thiểu 6 ký tự)', score: 1, colorClass: 'bg-rose-500', barWidth: 'w-1/3' };

    let score = 1;
    // Has digits
    if (/\d/.test(pass)) score++;
    // Has uppercase or special chars
    if (/[A-Z]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 2) {
      return { label: 'Trung bình', score: 2, colorClass: 'bg-amber-500', barWidth: 'w-2/3' };
    }
    return { label: 'Mạnh', score: 3, colorClass: 'bg-emerald-500', barWidth: 'w-full' };
  };

  const strength = getPasswordStrength(password);

  // Count down for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Validation functions
  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isPhoneValid = (val: string) => /^(0|84)[3|5|7|8|9][0-9]{8}$/.test(val);
  const isEmailOrPhoneValid = isEmailValid(emailOrPhone) || isPhoneValid(emailOrPhone);
  const isPasswordMatch = password === confirmPassword;

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailOrPhone || !password || !confirmPassword) {
      setErrorMsg('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }
    if (!isEmailValid(emailOrPhone)) {
      setErrorMsg('Vui lòng đăng ký bằng địa chỉ Email hợp lệ để nhận mã xác thực OTP.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Mật khẩu tối thiểu phải từ 6 ký tự.');
      return;
    }
    if (!isPasswordMatch) {
      setErrorMsg('Mật khẩu nhập lại không trùng khớp.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Bạn cần đồng ý với các Điều khoản & Chính sách.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const res = await authService.register(payload);
      if (res?.accessToken) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setStep('verify');
        setCountdown(59);
      }

    } catch (err: any) {
      setErrorMsg(err?.message || 'Đăng ký không thành công. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      await authService.resendOtp(emailOrPhone);
      setCountdown(59);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Không thể gửi lại OTP. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      await authService.verifyEmail({
        email: emailOrPhone,
        code: otpCode
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (err: any) {
      setErrorMsg(err?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
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
            Tạo tài khoản thành công!
          </h3>
          <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500">
            Đang đăng nhập tự động và chuyển hướng...
          </p>
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-4 xl:mb-6">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          {step === 'form' ? 'Tạo tài khoản mới' : 'Xác thực tài khoản'}
        </h1>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
          {step === 'form'
            ? 'Đăng ký nhanh chóng để nhận nhiều ưu đãi quà tặng hấp dẫn'
            : `Nhập mã OTP được gửi tới ${emailOrPhone}`}
        </p>
      </div>

      {/* Error Message Box */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-xl text-xs font-bold border border-rose-100 dark:border-rose-900/30 animate-shake">
          <span className="shrink-0 text-base">✕</span>
          <span className="leading-relaxed">{errorMsg}</span>
        </div>
      )}

      {step === 'form' ? (
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5 xl:space-y-4">
          {/* Full Name field */}
          <div className="relative border border-slate-200 dark:border-zinc-800 focus-within:border-rose-500 rounded-2xl transition-colors bg-slate-50/50 dark:bg-zinc-950/40">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <Icon name="user" size={15} />
            </span>
            <input
              type="text"
              id="fullName"
              placeholder=" "
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="peer w-full pl-11 pr-4 pt-5 pb-1.5 text-base lg:text-xs bg-transparent focus:outline-none text-slate-800 dark:text-white"
            />
            <label
              htmlFor="fullName"
              className="absolute left-11 top-3.5 text-xs text-slate-400 pointer-events-none transition-all duration-200 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-rose-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1.5"
            >
              Họ và tên
            </label>
          </div>

          {/* Email / Phone Field */}
          <div className="space-y-1">
            <div className="relative border border-slate-200 dark:border-zinc-800 focus-within:border-rose-500 rounded-2xl transition-colors bg-slate-50/50 dark:bg-zinc-950/40">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Icon name="mail" size={15} />
              </span>
              <input
                type="text"
                id="emailOrPhone"
                placeholder=" "
                required
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="peer w-full pl-11 pr-4 pt-5 pb-1.5 text-base lg:text-xs bg-transparent focus:outline-none text-slate-800 dark:text-white"
              />
              <label
                htmlFor="emailOrPhone"
                className="absolute left-11 top-3.5 text-xs text-slate-400 pointer-events-none transition-all duration-200 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-rose-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1.5"
              >
                Email hoặc Số điện thoại
              </label>
            </div>
            {emailOrPhone && (
              <div className="px-1 text-[10px] font-bold">
                {isEmailOrPhoneValid ? (
                  <span className="text-emerald-500 flex items-center gap-1">✓ Định dạng hợp lệ</span>
                ) : (
                  <span className="text-rose-500 flex items-center gap-1">✕ Nhập đúng định dạng Email/SĐT</span>
                )}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
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
            {/* Strength Meter Graphic */}
            {password && (
              <div className="space-y-1 px-1">
                <div className="h-1 w-full bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${strength.colorClass} ${strength.barWidth}`} />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>Độ mạnh:</span>
                  <span className={strength.score === 1 ? 'text-rose-500' : strength.score === 2 ? 'text-amber-500' : 'text-emerald-500'}>
                    {strength.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1">
            <div className="relative border border-slate-200 dark:border-zinc-800 focus-within:border-rose-500 rounded-2xl transition-colors bg-slate-50/50 dark:bg-zinc-950/40">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Icon name="shield" size={15} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                placeholder=" "
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="peer w-full pl-11 pr-4 pt-5 pb-1.5 text-base lg:text-xs bg-transparent focus:outline-none text-slate-800 dark:text-white"
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-11 top-3.5 text-xs text-slate-400 pointer-events-none transition-all duration-200 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-rose-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1.5"
              >
                Nhập lại mật khẩu
              </label>
            </div>
            {confirmPassword && (
              <div className="px-1 text-[10px] font-bold">
                {isPasswordMatch ? (
                  <span className="text-emerald-500 flex items-center gap-1">✓ Trùng khớp</span>
                ) : (
                  <span className="text-rose-500 flex items-center gap-1">✕ Chưa trùng khớp</span>
                )}
              </div>
            )}
          </div>

          {/* Terms Agreement Check */}
          <label className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-zinc-400 cursor-pointer pt-1 select-none">
            <input
              type="checkbox"
              checked={agreeTerms}
              required
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="rounded border-slate-200 dark:border-zinc-800 text-rose-500 focus:ring-rose-500/50 w-4 h-4 mt-0.5 cursor-pointer shrink-0"
            />
            <span className="leading-tight">
              Tôi đồng ý với{' '}
              <Link href="/terms" className="font-bold text-rose-500 hover:underline">
                Điều khoản dịch vụ
              </Link>{' '}
              &{' '}
              <Link href="/privacy" className="font-bold text-rose-500 hover:underline">
                Chính sách bảo mật
              </Link>{' '}
              của Haniu.
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-1 xl:mt-2 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:from-slate-300 disabled:to-slate-350 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifySubmit} className="space-y-5 animate-fade-in">
          <div className="text-center p-4 bg-amber-50/40 dark:bg-zinc-950/60 rounded-2xl border border-amber-100/50 dark:border-zinc-850">
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Mã kích hoạt OTP đã được gửi. Bạn vui lòng nhập mã bên dưới để hoàn tất xác thực đăng ký.
            </p>
          </div>

          <div className="relative border border-slate-200 dark:border-zinc-800 focus-within:border-rose-500 rounded-2xl transition-colors bg-slate-50/50 dark:bg-zinc-950/40">
            <input
              type="text"
              id="verifyCode"
              maxLength={6}
              placeholder=" "
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className="peer w-full px-4 pt-5 pb-1.5 text-center text-base lg:text-sm font-black tracking-[0.5em] bg-transparent focus:outline-none text-slate-800 dark:text-white"
            />
            <label
              htmlFor="verifyCode"
              className="absolute left-0 right-0 mx-auto w-fit top-3.5 text-xs text-slate-400 pointer-events-none transition-all duration-200 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-rose-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1.5"
            >
              Nhập mã 6 chữ số
            </label>
          </div>

          <div className="flex justify-center text-xs">
            {countdown > 0 ? (
              <span className="text-slate-400">Gửi lại mã sau <strong className="text-rose-500">{countdown}s</strong></span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="font-bold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
              >
                Gửi lại mã OTP
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setStep('form');
                setErrorMsg('');
              }}
              className="flex-1 py-3 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-600 dark:text-zinc-300 font-bold text-xs rounded-2xl transition-all cursor-pointer text-center"
            >
              Quay lại
            </button>
            <button
              type="submit"
              disabled={loading || otpCode.length < 6}
              className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-350 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Đang xác thực...' : 'Kích hoạt tài khoản'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
