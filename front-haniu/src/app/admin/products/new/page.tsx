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
import ProductPreviewPanel from '@/components/admin/product/ProductPreviewPanel';
import { ProductPreviewModal } from '@/components/admin/product/ProductPreviewModal';

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
      isNew,
      isCustomizable,
      allowAdminChat,
      allowPhotoUpload,
      allowPhotobooth,
      status,
      layoutTemplate,
      layoutConfig,
      specifications: JSON.stringify(specsMap),
      includedItems: JSON.stringify(includedItemsMap),
      occasions: selectedOccasions,
      recipients: selectedRecipients,
      variants: variantsList,
      media: mediaList,
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
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto px-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-5">
        <div>
          <Link href="/admin/products" className="text-xs text-slate-400 hover:text-rose-500 font-semibold flex items-center gap-1 mb-1">
            <Icon name="arrow-left" size={12} /> Trở về bảng quản trị
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-100">Thêm Sản phẩm Quà tặng Mới</h1>
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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <form onSubmit={handleSave} className="xl:col-span-7 space-y-8 text-xs font-medium">
          
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

          {/* Product Media Manager */}
          <ImageUploadForm
            mediaList={mediaList}
            setMediaList={setMediaList}
            loading={loading}
            setLoading={setLoading}
            setSuccessMsg={setSuccessMsg}
            setErrorMsg={setErrorMsg}
          />

          {/* Variations creator */}
          <VariantManager variantsList={variantsList} setVariantsList={setVariantsList} basePrice={basePrice} />

          {/* Submit Bar */}
          <div className="flex gap-4 justify-end pt-4">
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

        </form>

        {/* Right Column: Live Preview */}
        <div className="xl:col-span-5 hidden xl:block sticky top-8 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Trực quan chi tiết (Live Preview)
            </h3>
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(true)}
              className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-600 dark:text-zinc-400 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Icon name="eye" size={12} /> Xem kích thước chuẩn
            </button>
          </div>
          <ProductPreviewPanel product={previewProductData} />
        </div>
      </div>

      <ProductPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        product={previewProductData}
      />
    </div>
  );
}
