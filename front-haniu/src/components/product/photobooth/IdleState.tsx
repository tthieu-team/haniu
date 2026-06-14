'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/common/Icons';
import { useTranslate } from '@/lib/translator';

interface IdleStateProps {
  onStart: () => void;
}

export const IdleState: React.FC<IdleStateProps> = ({ onStart }) => {
  const trans = useTranslate();
  return (
    <div
      className="relative w-full h-full cursor-pointer overflow-hidden group bg-background transition-colors duration-500 flex flex-col items-center justify-center min-h-[500px]"
      onClick={onStart}
    >
      {/* Grid lines background */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-20 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-br from-primary-color/[0.03] via-transparent to-primary-color/[0.01] dark:from-primary-color/10 dark:to-transparent" />
 
      {/* Main Content Card */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center w-full max-w-lg">
        <motion.div
          animate={{
            y: [0, -8, 0],
            scale: [1, 1.01, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[24px] sm:rounded-[32px] bg-card-bg flex items-center justify-center border border-border-color shadow-2xl relative group-hover:border-primary-color/50 transition-all duration-500">
            <div className="absolute -inset-1 bg-gradient-to-br from-primary-color to-primary-color/50 rounded-[25px] sm:rounded-[33px] blur-lg opacity-10 dark:opacity-25 group-hover:opacity-40 transition-opacity" />
            <div className="absolute inset-3 sm:inset-4 rounded-[16px] sm:rounded-[20px] border border-border-color/50 flex items-center justify-center bg-background/50">
              <Icon name="camera" className="w-10 h-10 sm:w-14 sm:h-14 text-foreground group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            {/* Scanning light bar effect */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[2px] bg-primary-color/50 shadow-[0_0_15px_var(--primary)] z-20 pointer-events-none"
            />
          </div>
        </motion.div>
 
        <div className="space-y-3">
          <motion.h1
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl sm:text-5xl font-black tracking-tighter text-foreground uppercase font-sans"
          >
            Haniu <span className="bg-gradient-to-r from-primary-color to-primary-color/75 bg-clip-text text-transparent">Studio</span> Photobooth
          </motion.h1>
          <p className="text-[11px] sm:text-xs font-bold text-muted-color uppercase tracking-[0.25em] leading-none">
            {trans("Lưu giữ khoảnh khắc ngọt ngào")}
          </p>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="h-1.5 w-16 sm:w-20 bg-gradient-to-r from-primary-color to-primary-color/70 mx-auto rounded-full mt-3"
          />
        </div>
 
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <span className="text-[11px] sm:text-xs font-bold text-primary-color uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            {trans("Chạm màn hình để bắt đầu")}
          </span>
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <motion.div 
                key={i}
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                className="w-1 h-1 rounded-full bg-primary-color"
              />
            ))}
          </div>
        </motion.div>
      </div>
 
      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-10 h-10 border-t-2 border-l-2 border-border-color rounded-tl-xl group-hover:border-primary-color transition-all duration-500" />
      <div className="absolute top-8 right-8 w-10 h-10 border-t-2 border-r-2 border-border-color rounded-tr-xl group-hover:border-primary-color transition-all duration-500" />
      <div className="absolute bottom-8 left-8 w-10 h-10 border-b-2 border-l-2 border-border-color rounded-bl-xl group-hover:border-primary-color transition-all duration-500" />
      <div className="absolute bottom-8 right-8 w-10 h-10 border-b-2 border-r-2 border-border-color rounded-br-xl group-hover:border-primary-color transition-all duration-500" />
    </div>
  );
};
