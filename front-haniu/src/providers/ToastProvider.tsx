'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  X,
  Sparkles
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  title?: string;
  duration?: number; // default 10000 (10 seconds)
}

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration: number;
}

export interface ToastContextType {
  showToast: (type: ToastType, message: string, options?: ToastOptions) => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Individual Toast Card with Pause-on-Hover, Close Button & Smooth Progress Bar
const ToastItem: React.FC<{
  toast: Toast;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  const [isPaused, setIsPaused] = useState(false);
  const remainingTimeRef = useRef<number>(toast.duration);

  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, remainingTimeRef.current);

    return () => {
      clearTimeout(timer);
      const elapsed = Date.now() - startTime;
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
    };
  }, [isPaused, toast.id, onClose]);

  const getStyleConfig = () => {
    switch (toast.type) {
      case 'success':
        return {
          gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
          border: 'border-emerald-500/30 dark:border-emerald-500/40',
          badgeBg: 'bg-emerald-500 text-white shadow-emerald-500/25',
          progressBar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
          titleColor: 'text-emerald-700 dark:text-emerald-300',
          defaultTitle: 'Thành công',
          IconComponent: CheckCircle2,
        };
      case 'error':
        return {
          gradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
          border: 'border-rose-500/30 dark:border-rose-500/40',
          badgeBg: 'bg-rose-500 text-white shadow-rose-500/25',
          progressBar: 'bg-gradient-to-r from-rose-500 to-pink-500',
          titleColor: 'text-rose-700 dark:text-rose-300',
          defaultTitle: 'Cần lưu ý / Lỗi',
          IconComponent: AlertCircle,
        };
      case 'warning':
        return {
          gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
          border: 'border-amber-500/30 dark:border-amber-500/40',
          badgeBg: 'bg-amber-500 text-white shadow-amber-500/25',
          progressBar: 'bg-gradient-to-r from-amber-500 to-yellow-400',
          titleColor: 'text-amber-700 dark:text-amber-300',
          defaultTitle: 'Cảnh báo',
          IconComponent: AlertTriangle,
        };
      case 'info':
      default:
        return {
          gradient: 'from-sky-500/10 via-sky-500/5 to-transparent',
          border: 'border-sky-500/30 dark:border-sky-500/40',
          badgeBg: 'bg-sky-500 text-white shadow-sky-500/25',
          progressBar: 'bg-gradient-to-r from-sky-500 to-indigo-500',
          titleColor: 'text-sky-700 dark:text-sky-300',
          defaultTitle: 'Thông báo',
          IconComponent: Info,
        };
    }
  };

  const config = getStyleConfig();
  const Icon = config.IconComponent;
  const title = toast.title || config.defaultTitle;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
      role="alert"
      className={`group relative overflow-hidden bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border ${config.border} shadow-2xl rounded-2xl p-3 sm:p-3.5 transition-all duration-300 pointer-events-auto select-none w-full animate-toast-slide-in hover:scale-[1.01]`}
    >
      {/* Background Soft Accent Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} pointer-events-none opacity-60`} />

      <div className="relative z-10 flex items-start gap-2.5 sm:gap-3">
        {/* Type Icon Badge */}
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${config.badgeBg} transition-transform group-hover:rotate-6`}>
          <Icon className="w-4 h-4" strokeWidth={2.5} />
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-1.5 mb-0.5">
            <h4 className={`text-[11px] sm:text-xs font-black uppercase tracking-wider ${config.titleColor}`}>
              {title}
            </h4>
            {toast.type === 'success' && (
              <Sparkles size={12} className="text-amber-400 animate-pulse shrink-0" />
            )}
          </div>
          <p className="text-xs sm:text-[13px] font-medium sm:font-semibold text-slate-700 dark:text-zinc-200 leading-snug sm:leading-relaxed break-words">
            {toast.message}
          </p>
        </div>

        {/* Action Close Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose(toast.id);
          }}
          className="absolute -top-0.5 -right-0.5 w-7 h-7 rounded-full bg-slate-100/90 hover:bg-slate-200 dark:bg-zinc-800/90 dark:hover:bg-zinc-700 text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-90"
          title="Đóng thông báo"
          aria-label="Đóng thông báo"
        >
          <X size={14} strokeWidth={2.4} />
        </button>
      </div>

      {/* 10s Countdown Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100 dark:bg-zinc-800 overflow-hidden">
        <div
          className={`h-full ${config.progressBar}`}
          style={{
            width: '100%',
            animation: isPaused ? 'none' : `toastProgress ${toast.duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
};

export const toast = {
  show: (type: ToastType, message: string, options?: ToastOptions) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('haniu-toast', { detail: { type, message, options } }));
    }
  },
  success: (message: string, options?: ToastOptions) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('haniu-toast', { detail: { type: 'success', message, options } }));
    }
  },
  error: (message: string, options?: ToastOptions) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('haniu-toast', { detail: { type: 'error', message, options } }));
    }
  },
  warning: (message: string, options?: ToastOptions) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('haniu-toast', { detail: { type: 'warning', message, options } }));
    }
  },
  info: (message: string, options?: ToastOptions) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('haniu-toast', { detail: { type: 'info', message, options } }));
    }
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
      // Mặc định 10 giây (10000ms) để người dùng có đầy đủ thời gian đọc và tương tác
      const duration = options?.duration ?? 10000;
      const title = options?.title;

      setToasts((prev) => [...prev, { id, type, message, title, duration }]);
    },
    []
  );

  useEffect(() => {
    const handleCustomToast = (e: any) => {
      if (e?.detail) {
        const { type, message, options } = e.detail;
        showToast(type || 'info', message, options);
      }
    };
    window.addEventListener('haniu-toast', handleCustomToast);
    return () => window.removeEventListener('haniu-toast', handleCustomToast);
  }, [showToast]);

  const success = useCallback(
    (message: string, options?: ToastOptions) => showToast('success', message, options),
    [showToast]
  );
  const error = useCallback(
    (message: string, options?: ToastOptions) => showToast('error', message, options),
    [showToast]
  );
  const warning = useCallback(
    (message: string, options?: ToastOptions) => showToast('warning', message, options),
    [showToast]
  );
  const info = useCallback(
    (message: string, options?: ToastOptions) => showToast('info', message, options),
    [showToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, success, error, warning, info }}>
      {children}

      {/* Global Corner Toast Container: Fixed on the top right, strictly below the header */}
      {mounted && (
        <div
          id="global-toast-container"
          className="fixed top-24 sm:top-28 md:top-32 right-3 sm:right-6 md:right-8 z-[9999999] flex flex-col items-end gap-2.5 pointer-events-none w-[300px] max-w-[calc(100vw-1.5rem)] sm:w-[350px] md:w-[380px]"
        >
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: toast.show,
      success: toast.success,
      error: toast.error,
      warning: toast.warning,
      info: toast.info,
    };
  }
  return context;
};


