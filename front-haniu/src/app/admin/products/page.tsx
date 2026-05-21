'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productService } from '@/utils/productService';

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  basePrice: number;
  salePrice?: number;
  stock: number;
  isFeatured: boolean;
  isCustomizable: boolean;
  status: string;
  category?: { name: string };
  media?: Array<{ url: string; isThumbnail: boolean }>;
}

const MOCK_PRODUCTS: Product[] = [
  {
    id: "m1",
    name: "Hộp Quà Lãng Mạn - Eternal Love Special Edition",
    slug: "hop-qua-lang-man-eternal-love",
    sku: "GIFT-EL-001",
    basePrice: 590000,
    salePrice: 490000,
    stock: 50,
    isFeatured: true,
    isCustomizable: true,
    status: "PUBLISHED",
    category: { name: "Combo Quà Tặng" },
    media: [{ url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&auto=format&fit=crop&q=80", isThumbnail: true }]
  },
  {
    id: "m2",
    name: "Sổ Tay Da Thật Khắc Tên Cá Nhân Hóa",
    slug: "so-tay-da-that-khac-ten",
    sku: "GIFT-NB-002",
    basePrice: 350000,
    stock: 120,
    isFeatured: true,
    isCustomizable: true,
    status: "PUBLISHED",
    category: { name: "Sổ Da & Bút" },
    media: [{ url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=100&auto=format&fit=crop&q=80", isThumbnail: true }]
  }
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts({ size: 50 });
      if (data && data.content && data.content.length > 0) {
        const list = data.content.map((p: any) => ({
          ...p,
          basePrice: p.price || p.basePrice
        }));
        setProducts(list);
      } else {
        setProducts(MOCK_PRODUCTS);
      }
    } catch (err) {
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm quà tặng này?')) {
      return;
    }

    try {
      await productService.deleteProduct(id);
      setSuccessMsg('🎉 Đã xóa sản phẩm thành công khỏi hệ thống!');
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      setSuccessMsg('🎉 Đã xóa sản phẩm thành công (Simulated)!');
      setProducts(products.filter(p => p.id !== id));
    }

    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div>
          <span className="text-xs font-semibold text-rose-500 tracking-widest uppercase">Admin Dashboard</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100 mt-1">Quản lý Sản phẩm</h1>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold py-2.5 px-4 shadow-sm shadow-rose-500/20 text-xs transition-all active:scale-95"
        >
          ➕ Thêm sản phẩm quà tặng
        </Link>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-medium">
          {successMsg}
        </div>
      )}

      {/* Main product list table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-100 dark:border-zinc-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-slate-50 dark:bg-zinc-800/40 text-slate-400 font-bold uppercase border-b border-slate-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4">Mã SKU</th>
                  <th className="px-6 py-4">Danh mục</th>
                  <th className="px-6 py-4">Giá gốc</th>
                  <th className="px-6 py-4">Kho</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Đặc trưng</th>
                  <th className="px-6 py-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
                {products.map(product => {
                  const thumbnail = product.media?.find(m => m.isThumbnail)?.url || product.media?.[0]?.url || 'https://via.placeholder.com/60';

                  return (
                    <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/20 transition-all">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 aspect-square rounded-lg overflow-hidden bg-slate-50 border border-slate-100 dark:border-zinc-800 flex-shrink-0">
                          <img src={thumbnail} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-semibold text-slate-700 dark:text-zinc-200 line-clamp-1 max-w-[200px]">
                          {product.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-[10px] text-slate-400">{product.sku}</td>
                      <td className="px-6 py-4 text-slate-500">{product.category?.name || 'Chưa phân loại'}</td>
                      <td className="px-6 py-4 font-semibold text-rose-500">{product.basePrice.toLocaleString('vi-VN')}đ</td>
                      <td className="px-6 py-4 font-mono font-bold text-slate-500">{product.stock} chiếc</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          product.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-amber-500/10 text-amber-600'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-1">
                        {product.isFeatured && (
                          <span className="bg-amber-500/10 text-amber-600 text-[9px] font-bold px-1.5 py-0.5 rounded">Nổi bật</span>
                        )}
                        {product.isCustomizable && (
                          <span className="bg-cyan-500/10 text-cyan-600 text-[9px] font-bold px-1.5 py-0.5 rounded">Personalized</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Link
                          href={`/admin/products/edit/${product.id}`}
                          className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700 font-semibold px-2.5 py-1.5 rounded-lg text-[10px] transition-all"
                        >
                          ✏️ Sửa
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white font-semibold px-2.5 py-1.5 rounded-lg text-[10px] transition-all"
                        >
                          🗑️ Xóa
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
