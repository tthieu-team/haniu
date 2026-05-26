'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/common/Icons';
import { authService } from '@/services/auth.service';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');

  // Reset fields
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Statuses
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Password strength meter
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { label: '', score: 0, colorClass: 'bg-slate-200', barWidth: 'w-0' };
    if (pass.length < 6) return { label: 'Yếu (Tối thiểu 6 ký tự)', score: 1, colorClass: 'bg-rose-500', barWidth: 'w-1/3' };

    let score = 1;
    if (/\d/.test(pass)) score++;
    if (/[A-Z]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    if (score === 2) {
      return { label: 'Trung bình', score: 2, colorClass: 'bg-amber-500', barWidth: 'w-2/3' };
    }
    return { label: 'Mạnh', score: 3, colorClass: 'bg-emerald-500', barWidth: 'w-full' };
  };

  const strength = getPasswordStrength(newPassword);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isPasswordMatch = newPassword === confirmPassword;

  const handleSendEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Vui lòng nhập địa chỉ email.');
      return;
    }
    if (!isEmailValid(email)) {
      setErrorMsg('Định dạng email chưa chính xác.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');
      await authService.forgotPassword(email);
      setStep('reset');
      setCountdown(59);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Không thể gửi mã đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Vui lòng nhập đủ 6 chữ số mã OTP.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới tối thiểu 6 ký tự.');
      return;
    }
    if (!isPasswordMatch) {
      setErrorMsg('Mật khẩu xác nhận chưa trùng khớp.');
      return;
    }

    try {
      setLoading(true);
      setErrorMsg('');

      const payload = {
        email,
        code: otpCode,
        newPassword
      };

      await authService.resetPassword(payload);
      setSuccess(true);

      setTimeout(() => {
        router.push('/auth/login');
      }, 2000);

    } catch (err: any) {
      setErrorMsg(err?.message || 'Mã OTP không đúng hoặc đã hết hạn.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      await authService.forgotPassword(email);
      setCountdown(59);
    } catch (err: any) {
      setErrorMsg(err?.message || 'Không thể gửi lại mã OTP. Vui lòng thử lại.');
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
          <h3 className="mt-6 text-lg font-bold text-slate-800 dark:text-white text-center">
            Đặt lại mật khẩu thành công!
          </h3>
          <p className="mt-1 text-xs text-slate-400 dark:text-zinc-500 text-center">
            Mật khẩu mới đã được lưu. Đang chuyển bạn về trang đăng nhập...
          </p>
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-4 xl:mb-6">
        <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          {step === 'email' ? 'Quên mật khẩu' : 'Đặt lại mật khẩu'}
        </h1>
        <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
          {step === 'email'
            ? 'Nhập email liên kết với tài khoản của bạn để nhận OTP'
            : `Nhập mã xác thực gửi tới ${email}`}
        </p>
      </div>

      {/* Error Message Box */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 mb-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-xl text-xs font-bold border border-rose-100 dark:border-rose-900/30 animate-shake">
          <span className="shrink-0 text-base">✕</span>
          <span className="leading-relaxed">{errorMsg}</span>
        </div>
      )}

      {step === 'email' ? (
        <form onSubmit={handleSendEmailSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="relative border border-slate-200 dark:border-zinc-800 focus-within:border-rose-500 rounded-2xl transition-colors bg-slate-50/50 dark:bg-zinc-950/40">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Icon name="mail" size={15} />
              </span>
              <input
                type="email"
                id="email"
                placeholder=" "
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full pl-11 pr-4 pt-5 pb-1.5 text-base lg:text-xs bg-transparent focus:outline-none text-slate-800 dark:text-white"
              />
              <label
                htmlFor="email"
                className="absolute left-11 top-3.5 text-xs text-slate-400 pointer-events-none transition-all duration-200 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-rose-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1.5"
              >
                Địa chỉ Email của bạn
              </label>
            </div>
            {email && (
              <div className="px-1 text-[10px] font-bold">
                {isEmailValid(email) ? (
                  <span className="text-emerald-500 flex items-center gap-1">✓ Email hợp lệ</span>
                ) : (
                  <span className="text-rose-500 flex items-center gap-1">✕ Email không đúng định dạng</span>
                )}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isEmailValid(email)}
            className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:from-slate-300 disabled:to-slate-350 text-white font-bold text-xs rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Đang gửi yêu cầu...' : 'Gửi mã xác thực'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit} className="space-y-4 animate-fade-in">
          {/* OTP Code */}
          <div className="relative border border-slate-200 dark:border-zinc-800 focus-within:border-rose-500 rounded-2xl transition-colors bg-slate-50/50 dark:bg-zinc-950/40">
            <input
              type="text"
              id="otp"
              maxLength={6}
              placeholder=" "
              required
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
              className="peer w-full px-4 pt-5 pb-1.5 text-center text-base lg:text-sm font-black tracking-[0.5em] bg-transparent focus:outline-none text-slate-800 dark:text-white"
            />
            <label
              htmlFor="otp"
              className="absolute left-0 right-0 mx-auto w-fit top-3.5 text-xs text-slate-400 pointer-events-none transition-all duration-200 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-rose-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1.5"
            >
              Nhập mã OTP 6 chữ số
            </label>
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <div className="relative border border-slate-200 dark:border-zinc-800 focus-within:border-rose-500 rounded-2xl transition-colors bg-slate-50/50 dark:bg-zinc-950/40">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Icon name="shield" size={15} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="newPassword"
                placeholder=" "
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="peer w-full pl-11 pr-11 pt-5 pb-1.5 text-base lg:text-xs bg-transparent focus:outline-none text-slate-800 dark:text-white"
              />
              <label
                htmlFor="newPassword"
                className="absolute left-11 top-3.5 text-xs text-slate-400 pointer-events-none transition-all duration-200 peer-focus:text-[10px] peer-focus:top-1.5 peer-focus:text-rose-500 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:top-1.5"
              >
                Mật khẩu mới
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 cursor-pointer"
              >
                <Icon name="eye" size={15} />
              </button>
            </div>
            {newPassword && (
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

          {/* Confirm Password */}
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
                Nhập lại mật khẩu mới
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

          {/* Countdown & Resend */}
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

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setErrorMsg('');
              }}
              className="flex-1 py-3 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-850 text-slate-600 dark:text-zinc-300 font-bold text-xs rounded-2xl transition-all cursor-pointer text-center"
            >
              Quay lại
            </button>
            <button
              type="submit"
              disabled={loading || otpCode.length < 6 || !isPasswordMatch}
              className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 disabled:from-slate-300 disabled:to-slate-350 text-white font-bold text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
