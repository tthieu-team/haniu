'use client';

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
}

export default function VariantManager({ variantsList, setVariantsList, basePrice }: VariantManagerProps) {
  const addVariant = () => setVariantsList([...variantsList, {
    sku: '', name: '', color: '', size: '', material: '', price: basePrice, stock: 10
  }]);
  const removeVariant = (idx: number) => setVariantsList(variantsList.filter((_, i) => i !== idx));

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6 text-xs font-semibold">
      <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-2">
        <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400">Các biến thể sản phẩm</h3>
        <button
          type="button"
          onClick={addVariant}
          className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1"
        >
          <Icon name="plus" size={12} /> Thêm biến thể mới
        </button>
      </div>

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
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-800"
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
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-800"
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
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-800"
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
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-800"
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
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-800"
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
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-800"
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
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-800"
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
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-800 font-semibold text-rose-500"
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
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-800"
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
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 dark:bg-zinc-800"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
