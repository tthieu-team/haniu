'use client';

import { useState } from 'react';
import Icon from '@/components/common/Icons';
import { productService } from '@/services/product.service';

interface VariantInput {
  sku: string;
  name: string;
  color: string;
  size: string;
  material: string;
  price: number;
  salePrice?: number;
  stock: number;
  weight?: number;
  imageUrl?: string;
}

interface VariantManagerProps {
  variantsList: VariantInput[];
  setVariantsList: (list: VariantInput[]) => void;
  basePrice: number;
  productName?: string;
  categoryName?: string;
  productDescription?: string;
}

export default function VariantManager({
  variantsList,
  setVariantsList,
  basePrice,
  productName = '',
  categoryName = '',
  productDescription = ''
}: VariantManagerProps) {


  // AI states
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');

  const addVariant = () => setVariantsList([...variantsList, {
    sku: `SKU-VAR-${Math.floor(1000 + Math.random() * 9000)}`, name: '', color: '', size: '', material: '', price: basePrice, stock: 10
  }]);

  const removeVariant = (idx: number) => setVariantsList(variantsList.filter((_, i) => i !== idx));

  const clearAllVariants = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ biến thể hiện tại?')) {
      setVariantsList([]);
    }
  };

  // Generate SKU helper
  const createSku = (pName: string, color: string, size: string) => {
    const clean = (str: string) => str.toLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a")
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
      .replace(/ì|í|ị|ỉ|ĩ/g, "i")
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o")
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9]/g, "");

    const baseSku = clean(pName || 'GIFT').substring(0, 4).toUpperCase();
    const cSku = color ? clean(color).substring(0, 3).toUpperCase() : '';
    const sSku = size ? clean(size).substring(0, 2).toUpperCase() : '';
    const rand = Math.floor(100 + Math.random() * 900);
    return `HNU-${baseSku}${cSku ? `-${cSku}` : ''}${sSku ? `-${sSku}` : ''}-${rand}`;
  };



  // Generate variations using Groq AI
  const handleGenerateAiVariants = async () => {
    if (!productName.trim()) {
      alert('Vui lòng điền "Tên sản phẩm" ở phần thông tin cơ bản trước khi sử dụng AI.');
      return;
    }

    try {
      setIsAiGenerating(true);
      setAiError('');

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_variants',
          name: productName,
          categoryName,
          description: productDescription,
          basePrice,
          customPrompt: aiCustomPrompt
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to generate variants');
      }

      const data = await res.json();

      if (data && Array.isArray(data.variants)) {
        // Map elements to ensure all required fields are present
        const generated: VariantInput[] = data.variants.map((v: any) => ({
          sku: v.sku || createSku(productName, v.color || '', v.size || ''),
          name: v.name || `${v.color || ''} ${v.size || ''}`.trim() || 'Biến thể mới',
          color: v.color || '',
          size: v.size || '',
          material: v.material || '',
          price: typeof v.price === 'number' ? v.price : basePrice,
          stock: typeof v.stock === 'number' ? v.stock : 10,
          weight: v.weight,
          imageUrl: v.imageUrl
        }));
        setVariantsList([...variantsList, ...generated]);
      } else {
        throw new Error('Dữ liệu trả về từ AI không đúng cấu trúc variants.');
      }

    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Lỗi khi gọi AI');
    } finally {
      setIsAiGenerating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6 text-xs font-semibold">
      <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-2">
        <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400">Các biến thể sản phẩm</h3>
        <div className="flex gap-4">
          {variantsList.length > 0 && (
            <button
              type="button"
              onClick={clearAllVariants}
              className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1"
            >
              <Icon name="trash" size={12} /> Xóa tất cả
            </button>
          )}
          <button
            type="button"
            onClick={addVariant}
            className="text-xs text-indigo-500 font-bold hover:underline flex items-center gap-1"
          >
            <Icon name="plus" size={12} /> Thêm thủ công
          </button>
        </div>
      </div>

      {/* Generator Tools Card */}
      <div className="bg-slate-50/50 dark:bg-zinc-950/20 p-5 rounded-2xl border border-slate-150/40 dark:border-zinc-800/80 space-y-5">
        <h4 className="font-bold text-xs text-slate-600 dark:text-zinc-350 flex items-center gap-1.5 border-b border-slate-100 dark:border-zinc-800 pb-2">
          🛠️ Công cụ tạo biến thể nhanh
        </h4>



        {/* Section 3: AI Assistant Generator */}
        <div className="space-y-3">
          <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-350 block">
            ✨ Cách 3: Gợi ý biến thể bằng AI (Đọc thông tin sản phẩm và tự tạo)
          </span>
          <div className="space-y-1.5">
            <label className="text-[10px] text-slate-450 dark:text-zinc-500 block">Yêu cầu/Hướng dẫn cho AI (Tùy chọn)</label>
            <textarea
              placeholder="VD: Chỉ tạo các biến thể bằng chất liệu Gỗ, màu Đỏ và Vàng. Hoặc tự tạo các biến thể bán chạy nhất cho bình giữ nhiệt..."
              value={aiCustomPrompt}
              onChange={(e) => setAiCustomPrompt(e.target.value)}
              rows={2}
              className="w-full bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs font-semibold leading-relaxed"
            />
          </div>
          <div className="flex justify-end pt-1">
            <button
              type="button"
              disabled={isAiGenerating}
              onClick={handleGenerateAiVariants}
              className="px-4 py-2 bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl active:scale-95 transition-all text-[11px] flex items-center gap-1.5 shadow-md shadow-indigo-500/10 cursor-pointer disabled:opacity-50"
            >
              {isAiGenerating ? (
                <>
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                  Đang gợi ý...
                </>
              ) : (
                <>
                  <Icon name="sparkles" size={12} /> Sinh biến thể bằng AI ✨
                </>
              )}
            </button>
          </div>
        </div>

        {aiError && (
          <p className="text-[11px] text-red-500 font-bold bg-red-500/10 p-2.5 rounded-xl border border-red-500/20">
            ⚠️ {aiError}
          </p>
        )}
      </div>

      {/* Variants list */}
      <div className="space-y-4">
        {variantsList.map((item, idx) => (
          <div key={idx} className="p-4 border border-slate-200 dark:border-zinc-800 rounded-2xl bg-slate-50/50 dark:bg-zinc-950/10 space-y-4 relative">
            <button
              type="button"
              onClick={() => removeVariant(idx)}
              className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 font-bold flex items-center gap-1"
            >
              <Icon name="close" size={12} /> Xóa biến thể
            </button>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Tên biến thể *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Hộp đỏ Size S"
                  value={item.name || ''}
                  onChange={(e) => {
                    const list = [...variantsList];
                    list[idx].name = e.target.value;
                    setVariantsList(list);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-850 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Mã SKU biến thể *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: SKU-MUG-RED-S"
                  value={item.sku || ''}
                  onChange={(e) => {
                    const list = [...variantsList];
                    list[idx].sku = e.target.value;
                    setVariantsList(list);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-855 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Kích thước (Size)</label>
                <input
                  type="text"
                  placeholder="Size S, M, L"
                  value={item.size || ''}
                  onChange={(e) => {
                    const list = [...variantsList];
                    list[idx].size = e.target.value;
                    setVariantsList(list);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-850 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Màu sắc</label>
                <input
                  type="text"
                  placeholder="Đỏ, Xanh"
                  value={item.color || ''}
                  onChange={(e) => {
                    const list = [...variantsList];
                    list[idx].color = e.target.value;
                    setVariantsList(list);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-855 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800/40">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Chất liệu</label>
                <input
                  type="text"
                  placeholder="Gỗ, Sứ, Da..."
                  value={item.material || ''}
                  onChange={(e) => {
                    const list = [...variantsList];
                    list[idx].material = e.target.value;
                    setVariantsList(list);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-850 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Trọng lượng (kg)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.5"
                  value={item.weight || ''}
                  onChange={(e) => {
                    const list = [...variantsList];
                    list[idx].weight = e.target.value ? parseFloat(e.target.value) : undefined;
                    setVariantsList(list);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-855 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase block">Đường dẫn ảnh biến thể</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="https://..."
                    value={item.imageUrl || ''}
                    onChange={(e) => {
                      const list = [...variantsList];
                      list[idx].imageUrl = e.target.value;
                      setVariantsList(list);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-850 font-medium"
                  />
                  <div className="relative shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        const file = files[0];
                        try {
                          const data = await productService.uploadImage(file);
                          if (data && data.url) {
                            const list = [...variantsList];
                            list[idx].imageUrl = data.url;
                            setVariantsList(list);
                          }
                        } catch (err) {
                          console.error("Failed to upload variant image:", err);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Icon name="camera" size={12} /> Tải ảnh
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100 dark:border-zinc-800/40">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Giá bán lẻ (đ) *</label>
                <input
                  type="number"
                  required
                  value={item.price}
                  onChange={(e) => {
                    const list = [...variantsList];
                    list[idx].price = parseFloat(e.target.value);
                    setVariantsList(list);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-850 font-semibold text-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase">Giá KM (đ)</label>
                <input
                  type="number"
                  value={item.salePrice || ''}
                  onChange={(e) => {
                    const list = [...variantsList];
                    list[idx].salePrice = e.target.value ? parseFloat(e.target.value) : undefined;
                    setVariantsList(list);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-855 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase font-semibold">Tồn kho *</label>
                <input
                  type="number"
                  required
                  value={item.stock}
                  onChange={(e) => {
                    const list = [...variantsList];
                    list[idx].stock = parseInt(e.target.value);
                    setVariantsList(list);
                  }}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-850 font-semibold"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
