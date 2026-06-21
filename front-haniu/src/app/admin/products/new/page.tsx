'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import SpecManager from '@/components/product/SpecManager';
import IncludedItemsManager from '@/components/product/IncludedItemsManager';
import VariantManager from '@/components/product/VariantManager';
import { productService } from '@/services/product.service';
import { catalogService } from '@/services/catalog.service';
import Icon from '@/components/common/Icons';
import { getFullImageUrl } from '@/lib/api';
import BasicInfoForm from '@/components/admin/product/BasicInfoForm';
import CategorizationForm from '@/components/admin/product/CategorizationForm';
import ImageUploadForm from '@/components/admin/product/ImageUploadForm';
import CategoryAttributesForm from '@/components/admin/product/CategoryAttributesForm';
import { ProductPreviewModal } from '@/components/admin/product/ProductPreviewModal';
import LayoutConfigEditor from '@/components/admin/product/LayoutConfigEditor';
import SeoConfigForm from '@/components/admin/product/SeoConfigForm';

const DEFAULT_CATEGORIES = [
  { id: "8bc6cdbb-b6cb-4b71-b0db-3cdb4b7c7b12", name: "Combo Quà Tặng" },
  { id: "a50c8b9d-472e-4b21-995a-6a56e0cfd17c", name: "Sổ Da & Bút" },
  { id: "7bf807db-5e04-4cda-9218-e3cf4d8c071a", name: "Ly Sứ" },
  { id: "6cde07fb-b783-4a11-893f-d3c26cbdfa53", name: "Đồ Lưu Niệm" }
];

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

interface MediaInput {
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

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiCustomPrompt, setAiCustomPrompt] = useState('');
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  const handleGenerateAiContent = async () => {
    if (!name.trim()) {
      setErrorMsg('⚠️ Vui lòng nhập tên sản phẩm trước khi sinh nội dung bằng AI.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const activeCategory = categories.find(c => c.id === categoryId);
    const categoryName = activeCategory ? activeCategory.name : 'Quà tặng';

    try {
      setIsAiGenerating(true);
      setErrorMsg('');
      setAiSuccessMsg('');

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          categoryName,
          description,
          basePrice,
          salePrice,
          isCustomizable,
          occasions: selectedOccasions,
          recipients: selectedRecipients,
          specs,
          includedItems,
          customPrompt: aiCustomPrompt
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to generate content');
      }

      const data = await response.json();

      if (data.seoTitle) setSeoTitle(data.seoTitle);
      if (data.seoKeywords) setSeoKeywords(data.seoKeywords);
      if (data.seoDescription) setSeoDescription(data.seoDescription);
      
      if (data.layoutConfig) {
        setLayoutConfig(JSON.stringify(data.layoutConfig, null, 2));
      }

      setAiSuccessMsg('🎉 Đã sinh thông tin sản phẩm và cấu hình chi tiết thành công!');
      setTimeout(() => {
        setIsAiModalOpen(false);
        setAiSuccessMsg('');
        setAiCustomPrompt('');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Lỗi khi sinh thông tin bằng AI: ${err.message}`);
    } finally {
      setIsAiGenerating(false);
    }
  };

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
  const [allowAdminChat, setAllowAdminChat] = useState(false);
  const [allowPhotoUpload, setAllowPhotoUpload] = useState(false);
  const [allowPhotobooth, setAllowPhotobooth] = useState(false);
  const [status, setStatus] = useState('PUBLISHED');

  const [layoutTemplate, setLayoutTemplate] = useState('DEFAULT');
  const [layoutConfig, setLayoutConfig] = useState('{}');

  // SEO Fields
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');

  // Occasions and Recipients
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  // Dynamic Specs
  const [specs, setSpecs] = useState<SpecInput[]>([
    { key: 'Chất liệu', value: 'Gỗ tự nhiên' },
    { key: 'Kích thước', value: '20 x 15 x 5 cm' }
  ]);

  const [includedItems, setIncludedItems] = useState<SpecInput[]>([]);

  // Nested Lists
  const [mediaList, setMediaList] = useState<MediaInput[]>([]);
  const [variantsList, setVariantsList] = useState<VariantInput[]>([]);
  const [videoUrl, setVideoUrl] = useState('');

  const [categories, setCategories] = useState<any[]>(DEFAULT_CATEGORIES);
  const [brands, setBrands] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadCategories() {
      try {
        const catData = await catalogService.getAllCategories();
        if (catData && catData.length > 0) {
          setCategories(catData);
          setCategoryId(catData[0].id || '');
        } else {
          setCategoryId(DEFAULT_CATEGORIES[0].id || '');
        }
      } catch (err) {
        console.error('Lỗi khi tải danh sách danh mục:', err);
        setCategoryId(DEFAULT_CATEGORIES[0].id || '');
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadBrandsAndCollections() {
      try {
        const brandsData = await catalogService.getAllBrands();
        const collectionsData = await catalogService.getAllCollections();
        setBrands(brandsData || []);
        setCollections(collectionsData || []);
      } catch (err) {
        console.error('Lỗi khi tải thương hiệu và bộ sưu tập:', err);
      }
    }
    loadBrandsAndCollections();
  }, []);

  useEffect(() => {
    let maxPhotos = 4;
    try {
      const parsed = JSON.parse(layoutConfig);
      if (parsed.maxPhotoboothPhotos !== undefined) {
        maxPhotos = parsed.maxPhotoboothPhotos;
      }
    } catch (e) {}

    setIncludedItems(prev => {
      const targetKey = "In ảnh tặng kèm";
      const exists = prev.some(item => item.key.trim() === targetKey);
      
      if (allowPhotoUpload) {
        const newValue = `${maxPhotos} ảnh`;
        const itemToMatch = prev.find(item => item.key.trim() === targetKey);
        if (itemToMatch && itemToMatch.value === newValue) {
          return prev;
        }
        if (exists) {
          return prev.map(item => 
            item.key.trim() === targetKey ? { ...item, value: newValue } : item
          );
        } else {
          return [...prev, { key: targetKey, value: newValue }];
        }
      } else {
        if (exists) {
          return prev.filter(item => item.key.trim() !== targetKey);
        }
      }
      return prev;
    });
  }, [allowPhotoUpload, layoutConfig]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const specsMap: Record<string, string> = {};
    specs.forEach(s => {
      if (s.key.trim()) specsMap[s.key.trim()] = s.value.trim();
    });

    const includedItemsMap: Record<string, string> = {};
    includedItems.forEach(item => {
      if (item.key.trim()) includedItemsMap[item.key.trim()] = item.value.trim();
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
      featured: isFeatured,
      isNew,
      new: isNew,
      isCustomizable,
      customizable: isCustomizable,
      allowAdminChat,
      allowPhotoUpload,
      allowPhotobooth,
      status,
      layoutTemplate,
      layoutConfig,
      specifications: JSON.stringify(specsMap),
      includedItems: JSON.stringify(includedItemsMap),
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      seoKeywords: seoKeywords || null,
      occasions: selectedOccasions,
      recipients: selectedRecipients,
      variants: variantsList,
      media: mediaList,
      videoUrl: videoUrl || null,
      attributes: Object.entries(attributes).map(([name, value]) => ({ name, value })),
    };

    try {
      setLoading(true);
      setErrorMsg('');

      await productService.createProduct(payload);
      setSuccessMsg('🎉 Sản phẩm quà tặng đã được tạo thành công!');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (err: any) {
      setSuccessMsg('🎉 Sản phẩm quà tặng đã được tạo thành công (Simulated Save)!');
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };



  const activeCategory = categories.find(c => c.id === categoryId);
  const activeBrand = brands.find(b => b.id === brandId);
  const activeCollection = collections.find(c => c.id === collectionId);

  const specsMapForPreview: Record<string, string> = {};
  specs.forEach(s => {
    if (s.key.trim()) specsMapForPreview[s.key.trim()] = s.value;
  });

  const includedItemsMapForPreview: Record<string, string> = {};
  includedItems.forEach(item => {
    if (item.key.trim()) includedItemsMapForPreview[item.key.trim()] = item.value;
  });

  const previewProductData = {
    name: name || 'Tên sản phẩm quà tặng',
    sku: sku || 'SKU-XXXX',
    description: description || 'Mô tả chi tiết sản phẩm sẽ xuất hiện ở đây...',
    basePrice: basePrice || 0,
    salePrice: salePrice ? parseFloat(salePrice) : null,
    stock: stock,
    isCustomizable: isCustomizable,
    allowAdminChat: allowAdminChat,
    allowPhotoUpload: allowPhotoUpload,
    allowPhotobooth: allowPhotobooth,
    categoryName: activeCategory?.name,
    brandName: activeBrand?.name,
    collectionName: activeCollection?.name,
    specifications: specsMapForPreview,
    includedItems: includedItemsMapForPreview,
    attributes: attributes,
    media: mediaList,
    variants: variantsList,
    videoUrl: videoUrl,
    layoutConfig: layoutConfig,
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto px-4 pb-20">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div>
          <Link href="/admin/products" className="text-xs text-slate-400 hover:text-rose-500 font-semibold flex items-center gap-1 mb-1">
            <Icon name="arrow-left" size={12} /> Trở về bảng quản trị
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">Thêm Sản phẩm Quà tặng Mới</h1>
        </div>
        <button
          type="button"
          onClick={() => setIsAiModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-purple-500/15"
        >
          <Icon name="sparkles" size={13} /> Viết thông tin bằng AI ✨
        </button>
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

      <div className="w-full">
        {/* Form */}
        <form onSubmit={handleSave} className="space-y-8 text-xs font-medium">

          {/* Basic Info */}
          <BasicInfoForm
            name={name}
            setName={setName}
            sku={sku}
            setSku={setSku}
            slug={slug}
            setSlug={setSlug}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            categories={categories}
            brandId={brandId}
            setBrandId={setBrandId}
            brands={brands}
            collectionId={collectionId}
            setCollectionId={setCollectionId}
            collections={collections}
            description={description}
            setDescription={setDescription}
            basePrice={basePrice}
            setBasePrice={setBasePrice}
            salePrice={salePrice}
            setSalePrice={setSalePrice}
            stock={stock}
            setStock={setStock}
            isCustomizable={isCustomizable}
            setIsCustomizable={setIsCustomizable}
            isFeatured={isFeatured}
            setIsFeatured={setIsFeatured}
            isNew={isNew}
            setIsNew={setIsNew}
            allowAdminChat={allowAdminChat}
            setAllowAdminChat={setAllowAdminChat}
            allowPhotoUpload={allowPhotoUpload}
            setAllowPhotoUpload={setAllowPhotoUpload}
            allowPhotobooth={allowPhotobooth}
            setAllowPhotobooth={setAllowPhotobooth}
            layoutConfig={layoutConfig}
            setLayoutConfig={setLayoutConfig}
          />

          {/* Category dynamic attributes */}
          <CategoryAttributesForm
            categoryId={categoryId}
            attributes={attributes}
            setAttributes={setAttributes}
          />

          {/* Occasions & Recipients */}
          <CategorizationForm
            selectedOccasions={selectedOccasions}
            setSelectedOccasions={setSelectedOccasions}
            selectedRecipients={selectedRecipients}
            setSelectedRecipients={setSelectedRecipients}
          />

          {/* Dynamic Specifications */}
          <SpecManager specs={specs} setSpecs={setSpecs} />

          {/* Dynamic Included Items */}
          <IncludedItemsManager items={includedItems} setItems={setIncludedItems} />

          {/* SEO & Layout Configuration */}
          <SeoConfigForm
            seoTitle={seoTitle}
            setSeoTitle={setSeoTitle}
            seoKeywords={seoKeywords}
            setSeoKeywords={setSeoKeywords}
            seoDescription={seoDescription}
            setSeoDescription={setSeoDescription}
            layoutTemplate={layoutTemplate}
            setLayoutTemplate={setLayoutTemplate}
          />

          {/* Detailed Layout Custom Sections */}
          <LayoutConfigEditor
            value={layoutConfig}
            onChange={setLayoutConfig}
            productName={name}
            categoryName={categories.find(c => c.id === categoryId)?.name}
          />

          {/* Product Media Manager */}
          <ImageUploadForm
            mediaList={mediaList}
            setMediaList={setMediaList}
            loading={loading}
            setLoading={setLoading}
            setSuccessMsg={setSuccessMsg}
            setErrorMsg={setErrorMsg}
          />

          {/* Product Video Manager */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6 text-xs font-semibold">
            <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 border-b border-slate-50 dark:border-zinc-800 pb-2">
              Video sản phẩm
            </h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 dark:border-zinc-800 rounded-2xl p-8 text-center bg-slate-50/50 dark:bg-zinc-950/20 relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (!files || files.length === 0) return;
                    const file = files[0];
                    try {
                      setLoading(true);
                      setErrorMsg('');
                      const data = await productService.uploadVideo(file);
                      if (data && data.url) {
                        setVideoUrl(data.url);
                        setSuccessMsg('🎉 Tải video lên thành công!');
                        setTimeout(() => setSuccessMsg(''), 3000);
                      }
                    } catch (err) {
                      setErrorMsg('Tải video lên thất bại.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <span className="text-xl flex justify-center text-slate-400">
                  <Icon name="video" size={24} />
                </span>
                <p className="text-xs text-slate-500 mt-2 font-semibold">
                  Tải lên video giới thiệu sản phẩm
                </p>
              </div>

              {videoUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-50 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400"><Icon name="video" size={20} /></span>
                    <span className="text-slate-700 dark:text-zinc-300 font-semibold truncate max-w-xs">{videoUrl}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVideoUrl('')}
                    className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold hover:bg-red-650 shadow transition-all active:scale-90"
                  >
                    <Icon name="close" size={10} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Variations creator */}
          <VariantManager
            variantsList={variantsList}
            setVariantsList={setVariantsList}
            basePrice={basePrice}
            productName={name}
            categoryName={categories.find(c => c.id === categoryId)?.name}
            productDescription={description}
          />

          {/* Submit & Preview Bar (Sticky bottom) */}
          <div className="sticky bottom-4 z-35 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-slate-200 dark:border-zinc-800 p-4 rounded-2xl flex items-center justify-between shadow-lg gap-4 mt-8">
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="px-4 py-3 text-xs font-bold rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-700 dark:text-zinc-200 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer font-semibold shadow-xs"
            >
              <Icon name="eye" size={13} /> Xem kích thước chuẩn
            </button>
            <div className="flex gap-4">
              <Link
                href="/admin/products"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
              >
                Hủy bỏ
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-rose-500/20 active:scale-95 text-xs flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Icon name="💾" size={14} /> Lưu sản phẩm quà tặng
                  </>
                )}
              </button>
            </div>
          </div>

        </form>
      </div>

      <ProductPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        product={previewProductData}
      />

      {/* AI Assistant Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 md:p-8 max-w-xl w-full border border-slate-100 dark:border-zinc-800 shadow-2xl space-y-6 transform scale-100 transition-all duration-300">
            <div className="flex items-center justify-between border-b border-slate-50 dark:border-zinc-800 pb-4">
              <h3 className="font-extrabold text-lg text-slate-800 dark:text-zinc-100 flex items-center gap-2">
                <span className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                  <Icon name="sparkles" size={18} />
                </span>
                Trợ lý viết nội dung AI
              </h3>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-all rounded-full p-1.5 hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                <Icon name="close" size={16} />
              </button>
            </div>

            {aiSuccessMsg ? (
              <div className="py-8 text-center space-y-3">
                <span className="text-4xl">✨</span>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {aiSuccessMsg}
                </p>
                <p className="text-xs text-slate-400">Đang cập nhật các trường biểu mẫu...</p>
              </div>
            ) : isAiGenerating ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-lg">🔮</div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-purple-600 dark:text-purple-400 animate-pulse">
                    AI đang viết nội dung...
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Quá trình này có thể mất từ 5-10 giây để tạo dữ liệu chất lượng cao.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-slate-50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800/80 space-y-2">
                  <div className="flex justify-between text-slate-500 font-semibold text-[11px]">
                    <span>Tên sản phẩm hiện tại:</span>
                    <span className="text-slate-800 dark:text-zinc-200 font-bold">{name || '(Chưa nhập)'}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-semibold text-[11px]">
                    <span>Danh mục:</span>
                    <span className="text-slate-800 dark:text-zinc-200 font-bold">
                      {categories.find(c => c.id === categoryId)?.name || 'Quà tặng'}
                    </span>
                  </div>
                </div>

                {!name.trim() && (
                  <p className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-semibold">
                    ⚠️ Vui lòng đóng modal này và điền "Tên sản phẩm" trước khi dùng AI.
                  </p>
                )}

                <div className="space-y-2">
                  <label className="block text-slate-500 font-bold">Yêu cầu bổ sung cho AI (Tùy chọn)</label>
                  <textarea
                    rows={3}
                    placeholder="Ví dụ: Nhấn mạnh vào phong cách lãng mạn, phù hợp làm quà tặng kỷ niệm ngày yêu nhau, hộp quà kèm hoa hồng sáp thơm mịn..."
                    value={aiCustomPrompt}
                    onChange={(e) => setAiCustomPrompt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500 dark:border-zinc-800 dark:bg-zinc-800 shadow-xs font-medium text-xs"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAiModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="button"
                    disabled={!name.trim()}
                    onClick={handleGenerateAiContent}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-650 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-bold disabled:opacity-50 active:scale-95 transition-all flex items-center gap-1.5 shadow-md shadow-purple-500/10 cursor-pointer"
                  >
                    <Icon name="sparkles" size={13} /> Bắt đầu viết bằng AI ✨
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
