'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import Icon from '@/components/common/Icons';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, [removeToast]);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-500/90 border-emerald-400/30 text-white shadow-emerald-500/20',
          icon: 'checkmark-circle-outline'
        };
      case 'error':
        return {
          bg: 'bg-rose-500/90 border-rose-400/30 text-white shadow-rose-500/20',
          icon: 'alert-circle-outline'
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/90 border-amber-400/30 text-white shadow-amber-500/20',
          icon: 'warning-outline'
        };
      case 'info':
      default:
        return {
          bg: 'bg-indigo-500/90 border-indigo-400/30 text-white shadow-indigo-500/20',
          icon: 'information-circle-outline'
        };
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          const styles = getToastStyles(toast.type);
          return (
            <div
              key={toast.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md shadow-lg pointer-events-auto transition-all duration-300 animate-slide-in-right ${styles.bg}`}
              style={{
                animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
              }}
            >
              <Icon name={styles.icon as any} size={18} className="shrink-0" />
              <p className="text-xs font-semibold leading-relaxed pr-2">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-auto opacity-70 hover:opacity-100 transition-opacity p-0.5 shrink-0"
              >
                <Icon name="close" size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Global CSS for slides */}
      <style jsx global>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%) scale(0.9);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
