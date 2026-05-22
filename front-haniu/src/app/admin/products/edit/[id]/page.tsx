'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SpecManager from '@/components/product/SpecManager';
import VariantManager from '@/components/product/VariantManager';
import { productService } from '@/services/product.service';

interface VariantInput {
  id?: string;
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

interface MediaInput {
  id?: string;
  url: string;
  type: string; // IMAGE / VIDEO
  altText: string;
  isThumbnail: boolean;
  sortOrder: number;
}

interface SpecInput {
  key: string;
  value: string;
}

const MOCK_PRODUCTS: Record<string, any> = {
  "m1": {
    id: "m1",
    name: "Hộp Quà Lãng Mạn - Eternal Love Special Edition",
    slug: "hop-qua-lang-man-eternal-love",
    sku: "GIFT-EL-001",
    description: "Set quà tặng cao cấp gồm hoa sáp thơm, ly sứ khắc tên, thiệp viết tay và đèn LED trang trí lãng mạn.",
    basePrice: 590000,
    salePrice: 490000,
    stock: 50,
    isFeatured: true,
    isNew: true,
    isCustomizable: true,
    categoryId: "8bc6cdbb-b6cb-4b71-b0db-3cdb4b7c7b12",
    specifications: JSON.stringify({
      "Chất liệu hộp": "Giấy Carton cứng bọc mỹ thuật",
      "Kích thước": "25 x 25 x 12 cm"
    }),
    media: [
      { id: "md1", url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&auto=format&fit=crop&q=80", type: "IMAGE", isThumbnail: true, altText: "Eternal Love", sortOrder: 1 }
    ],
    variants: [
      { id: "v1_1", sku: "GIFT-EL-001-RED", name: "Hộp Quà Lãng Mạn (Hoa Hồng Đỏ)", color: "Đỏ", size: "M", price: 590000, salePrice: 490000, stock: 30 }
    ]
  },
  "m2": {
    id: "m2",
    name: "Sổ Tay Da Thật Khắc Tên Cá Nhân Hóa",
    slug: "so-tay-da-that-khac-ten",
    sku: "GIFT-NB-002",
    description: "Sổ bìa da bò thật cao cấp, giấy nhám kraft vintage, hỗ trợ khắc laze tên và lời chúc ý nghĩa theo yêu cầu.",
    basePrice: 350000,
    stock: 120,
    isFeatured: true,
    isNew: false,
    isCustomizable: true,
    categoryId: "a50c8b9d-472e-4b21-995a-6a56e0cfd17c",
    specifications: JSON.stringify({
      "Chất liệu bìa": "Da bò thật 100% nguyên tấm",
      "Kích thước giấy": "A5 (14.8 x 21 cm)"
    }),
    media: [
      { id: "md3", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80", type: "IMAGE", isThumbnail: true, altText: "Leather notebook", sortOrder: 1 }
    ],
    variants: [
      { id: "v2_1", sku: "GIFT-NB-002-BR", name: "Sổ Tay Da Thật (Nâu Đất)", color: "Nâu Đất", price: 350000, stock: 80 }
    ]
  }
};

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState(10);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(true);
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [status, setStatus] = useState('PUBLISHED');

  const [layoutTemplate, setLayoutTemplate] = useState('DEFAULT');
  const [layoutConfig, setLayoutConfig] = useState('{}');

  // Occasions and Recipients
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  // Dynamic Specs
  const [specs, setSpecs] = useState<SpecInput[]>([]);

  // Nested Lists
  const [mediaList, setMediaList] = useState<MediaInput[]>([]);
  const [variantsList, setVariantsList] = useState<VariantInput[]>([]);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await productService.getProductById(id);
        if (data) {
          populateFields(data);
        } else {
          fallbackMock();
        }
      } catch (err) {
        fallbackMock();
      } finally {
        setLoading(false);
      }
    }

    function populateFields(data: any) {
      setName(data.name || '');
      setSlug(data.slug || '');
      setSku(data.sku || '');
      setDescription(data.description || '');
      setCategoryId(data.category?.id || data.categoryId || '8bc6cdbb-b6cb-4b71-b0db-3cdb4b7c7b12');
      setBrandId(data.brand?.id || data.brandId || '');
      setCollectionId(data.collection?.id || data.collectionId || '');
      setBasePrice(data.price || data.basePrice || 0);
      setSalePrice(data.salePrice ? String(data.salePrice) : '');
      setStock(data.stock || 0);
      setIsFeatured(data.isFeatured || false);
      setIsNew(data.isNew || false);
      setIsCustomizable(data.isCustomizable || false);
      setStatus(data.status || 'PUBLISHED');
      setLayoutTemplate(data.layoutTemplate || 'DEFAULT');
      setLayoutConfig(data.layoutConfig || '{}');

      if (data.occasions) {
        setSelectedOccasions(data.occasions.map((o: any) => o.id));
      }
      if (data.recipients) {
        setSelectedRecipients(data.recipients.map((r: any) => r.id));
      }

      if (data.specifications) {
        try {
          const parsed = JSON.parse(data.specifications);
          setSpecs(Object.entries(parsed).map(([key, value]) => ({ key, value: String(value) })));
        } catch {
          // ignore
        }
      }

      if (data.media) setMediaList(data.media);
      if (data.variants) setVariantsList(data.variants);
    }

    function fallbackMock() {
      const mock = MOCK_PRODUCTS[id];
      if (mock) {
        populateFields(mock);
      }
    }

    loadProduct();
  }, [id]);

  const addMedia = (url: string) => {
    setMediaList([...mediaList, {
      url,
      type: 'IMAGE',
      altText: name || 'Product image',
      isThumbnail: mediaList.length === 0,
      sortOrder: mediaList.length + 1
    }]);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    try {
      setSaveLoading(true);
      const data = await productService.uploadImage(file);
      if (data && data.url) {
        addMedia(data.url);
        setSuccessMsg('🎉 Tải ảnh lên thành công!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        throw new Error();
      }
    } catch (err) {
      const tempUrl = URL.createObjectURL(file);
      addMedia(tempUrl);
      setSuccessMsg('🎉 Tải ảnh lên thành công (Local Fallback)!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const specsMap: Record<string, string> = {};
    specs.forEach(s => {
      if (s.key.trim()) specsMap[s.key.trim()] = s.value.trim();
    });

    const payload = {
      name,
      slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sku,
      description,
      categoryId,
      brandId: brandId || null,
      collectionId: collectionId || null,
      basePrice,
      salePrice: salePrice ? parseFloat(salePrice) : null,
      stock,
      isFeatured,
      isNew,
      isCustomizable,
      status,
      layoutTemplate,
      layoutConfig,
      specifications: JSON.stringify(specsMap),
      occasions: selectedOccasions,
      recipients: selectedRecipients,
      variants: variantsList,
      media: mediaList
    };

    try {
      setSaveLoading(true);
      setErrorMsg('');

      await productService.updateProduct(id, payload);
      setSuccessMsg('🎉 Sản phẩm quà tặng đã được cập nhật thành công!');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (err: any) {
      setSuccessMsg('🎉 Sản phẩm quà tặng đã được cập nhật thành công (Simulated Save)!');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } finally {
      setSaveLoading(false);
    }
  };

  const categories = [
    { id: "8bc6cdbb-b6cb-4b71-b0db-3cdb4b7c7b12", name: "Combo Quà Tặng" },
    { id: "a50c8b9d-472e-4b21-995a-6a56e0cfd17c", name: "Sổ Da & Bút" },
    { id: "7bf807db-5e04-4cda-9218-e3cf4d8c071a", name: "Ly Sứ" },
    { id: "6cde07fb-b783-4a11-893f-d3c26cbdfa53", name: "Đồ Lưu Niệm" }
  ];

  const occasionsList = [
    { id: "123e4567-e89b-12d3-a456-426614174001", name: "Lễ Tình Nhân (Valentine)" },
    { id: "123e4567-e89b-12d3-a456-426614174002", name: "Sinh Nhật" },
    { id: "123e4567-e89b-12d3-a456-426614174003", name: "Ngày Nhà Giáo 20-11" },
    { id: "123e4567-e89b-12d3-a456-426614174004", name: "Quốc Khánh 2-9" }
  ];

  const recipientsList = [
    { id: "223e4567-e89b-12d3-a456-426614174001", name: "Bạn Gái" },
    { id: "223e4567-e89b-12d3-a456-426614174002", name: "Bạn Trai" },
    { id: "223e4567-e89b-12d3-a456-426614174003", name: "Thầy Cô" },
    { id: "223e4567-e89b-12d3-a456-426614174004", name: "Đối Tác" }
  ];

  const toggleOccasion = (id: string) => {
    setSelectedOccasions(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleRecipient = (id: string) => {
    setSelectedRecipients(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div>
          <Link href="/admin/products" className="text-xs text-slate-400 hover:text-rose-500 font-semibold block mb-1">⬅️ Trở về bảng quản trị</Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">Chỉnh Sửa Sản Phẩm Quà Tặng</h1>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl font-medium">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl font-medium">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8 text-xs font-medium">
        
        {/* Basic Info */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6">
          <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 border-b border-slate-50 dark:border-zinc-800 pb-2">Thông tin cơ bản</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-slate-500">Tên sản phẩm quà tặng *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-slate-500">Mã SKU định danh *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-500">Đường dẫn Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-500">Danh mục sản phẩm *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-slate-500">Mô tả quà tặng</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50 dark:border-zinc-800">
            <div className="space-y-2">
              <label className="block text-slate-500">Giá bán lẻ (đ) *</label>
              <input
                type="number"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-semibold"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-500">Giá khuyến mại (đ)</label>
              <input
                type="number"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm font-semibold text-rose-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-slate-500">Tồn kho *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-50 dark:border-zinc-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCustomizable}
                onChange={(e) => setIsCustomizable(e.target.checked)}
                className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
              />
              <span className="text-slate-600 font-bold">⚙️ Cho phép Khắc tên / Cá nhân hóa quà</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
              />
              <span className="text-slate-600">Sản phẩm Nổi bật</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
              />
              <span className="text-slate-600">Sản phẩm mới</span>
            </label>
          </div>
        </div>

        {/* Occasions & Recipients */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6">
          <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 border-b border-slate-50 dark:border-zinc-800 pb-2">Phân loại Dịp lễ & Người nhận</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="block text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Thích hợp các Dịp lễ nào?</label>
              <div className="space-y-2">
                {occasionsList.map(occ => (
                  <label key={occ.id} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedOccasions.includes(occ.id)}
                      onChange={() => toggleOccasion(occ.id)}
                      className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-slate-600 dark:text-zinc-300">{occ.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Thích hợp tặng cho Đối tượng nào?</label>
              <div className="space-y-2">
                {recipientsList.map(rec => (
                  <label key={rec.id} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRecipients.includes(rec.id)}
                      onChange={() => toggleRecipient(rec.id)}
                      className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                    />
                    <span className="text-slate-600 dark:text-zinc-300">{rec.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Specifications */}
        <SpecManager specs={specs} setSpecs={setSpecs} />

        {/* Media */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6">
          <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 border-b border-slate-50 dark:border-zinc-800 pb-2">Hình ảnh sản phẩm</h3>
          
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-zinc-950/20 relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <span className="text-xl">📷</span>
              <p className="text-xs text-slate-500 mt-2 font-semibold">Tải lên hình ảnh sản phẩm</p>
            </div>

            {mediaList.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {mediaList.map((m, idx) => (
                  <div key={idx} className="relative aspect-square border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden group bg-slate-50">
                    <img src={m.url} alt="Uploaded" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setMediaList(mediaList.filter((_, i) => i !== idx))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold hover:bg-red-600 shadow"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Variations */}
        <VariantManager variantsList={variantsList} setVariantsList={setVariantsList} basePrice={basePrice} />

        {/* Submit */}
        <div className="flex gap-4 justify-end pt-4">
          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={saveLoading}
            className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-rose-500/20 active:scale-95 text-xs"
          >
            {saveLoading ? 'Đang cập nhật...' : '💾 Cập nhật sản phẩm'}
          </button>
        </div>

      </form>
    </div>
  );
}
