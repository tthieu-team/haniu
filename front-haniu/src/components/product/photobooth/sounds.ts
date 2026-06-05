'use client';

const sounds = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  shutter: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Use preview mp3 fallback if kai.mp3 isn't there
  countdown: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  hadilao: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
};

export const playSound = (type: keyof typeof sounds) => {
  if (typeof window === 'undefined') return;
  const audio = new Audio(sounds[type]);
  audio.play().catch(() => {
    // Ignore autoplay blocks
  });
};
