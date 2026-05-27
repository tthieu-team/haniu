'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Tự động scroll về đầu trang (0, 0) mỗi khi pathname thay đổi.
 * Không có giao diện – chỉ là side effect.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
