'use client';

import React from 'react';
import { Product } from '@/store/product';
import Link from 'next/link';
import Icon from '@/components/common/Icons';

interface ProductsTableProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
  onRequestDelete: (product: Product) => void;
  formatVND: (amount: number | undefined | null) => string;
  loading: boolean;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  selectedProduct,
  onSelectProduct,
  onRequestDelete,
  formatVND,
  loading
}) => {
  if (loading && products.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-12 flex flex-col items-center justify-center gap-3 flex-1">
        <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
        <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">Đang tải danh sách sản phẩm...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl p-16 text-center space-y-2 flex-1 flex flex-col items-center justify-center">
        <Icon name="gift" size={36} className="mx-auto text-slate-300 dark:text-zinc-600" />
        <p className="text-sm font-bold text-slate-700 dark:text-zinc-200">Không tìm thấy sản phẩm nào</p>
        <p className="text-xs text-slate-400 dark:text-zinc-500">Thử thay đổi bộ lọc hoặc thêm mới sản phẩm.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs flex-1 min-h-0 flex flex-col">
      <div className="overflow-y-auto overflow-x-auto scrollbar-none flex-1 min-h-0">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-zinc-800 border-b border-slate-200/80 dark:border-zinc-800 shadow-xs">
            <tr className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500">
              <th className="py-3.5 px-4 bg-slate-50 dark:bg-zinc-800">Sản phẩm</th>
              <th className="py-3.5 px-4 bg-slate-50 dark:bg-zinc-800">Danh mục & SKU</th>
              <th className="py-3.5 px-4 text-right bg-slate-50 dark:bg-zinc-800">Giá bán</th>
              <th className="py-3.5 px-4 text-center bg-slate-50 dark:bg-zinc-800">Tồn kho</th>
              <th className="py-3.5 px-4 text-center bg-slate-50 dark:bg-zinc-800">Trạng thái</th>
              <th className="py-3.5 px-4 text-center bg-slate-50 dark:bg-zinc-800">Tác vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
            {products.map((product) => {
              const isSelected = selectedProduct?.id === product.id;
              const isLowStock = (product.stock || 0) <= 10;
              const thumbnail = product.media?.find(m => m.isThumbnail)?.url || product.media?.[0]?.url || 'https://placehold.co/100x100?text=Gift';

              return (
                <tr
                  key={product.id}
                  onClick={() => onSelectProduct(product)}
                  className={`cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-rose-50/70 dark:bg-rose-950/25'
                      : 'hover:bg-slate-50/80 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  {/* Thumbnail & Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-slate-200/60 dark:border-zinc-700">
                        <img src={thumbnail} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0 max-w-md lg:max-w-lg">
                        <span className="font-bold text-slate-800 dark:text-zinc-100 truncate">
                          {product.name}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {product.isFeatured && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              Nổi bật
                            </span>
                          )}
                          {product.isCustomizable && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                              Khắc laser
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category & SKU */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-700 dark:text-zinc-300">
                        {product.category?.name || 'Chưa phân loại'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500">
                        SKU: {product.sku || 'N/A'}
                      </span>
                    </div>
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 text-right">
                    <span className="font-mono font-black text-slate-900 dark:text-zinc-100 text-xs">
                      {formatVND(product.basePrice)}
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                        isLowStock
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black'
                          : 'text-slate-700 dark:text-zinc-300'
                      }`}
                    >
                      {product.stock ?? 0}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    {product.status === 'PUBLISHED' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Mở bán
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                        Tạm ẩn
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/products/${product.slug || product.id}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 transition-colors"
                        title="Xem trang sản phẩm"
                      >
                        <Icon name="eye" size={13} />
                      </Link>

                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Icon name="edit" size={13} />
                      </Link>

                      <button
                        onClick={() => onRequestDelete(product)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
                        title="Xóa sản phẩm"
                      >
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
