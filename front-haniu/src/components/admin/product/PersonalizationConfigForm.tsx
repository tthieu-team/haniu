'use client';

import { useState } from 'react';
import Icon from '@/components/common/Icons';
import { productService } from '@/services/product.service';

interface PersonalizationConfigFormProps {
  layoutConfig?: string;
  setLayoutConfig?: (v: string) => void;
}

export default function PersonalizationConfigForm({
  layoutConfig = '{}',
  setLayoutConfig
}: PersonalizationConfigFormProps) {
  const [newGiftOption, setNewGiftOption] = useState('');
  const [newGiftIcon, setNewGiftIcon] = useState('🎁');
  const [newGiftImage, setNewGiftImage] = useState('');

  // Parse layoutConfig safely
  let parsedConfig: any = {};
  try {
    if (layoutConfig) {
      parsedConfig = typeof layoutConfig === 'string' ? JSON.parse(layoutConfig) : layoutConfig;
    }
  } catch (e) {
    console.error(e);
  }

  const customizationConfig = parsedConfig.customizationConfig || {
    showEngraving: true,
    showEngravingMockup: true,
    engravingLabel: "Khắc chữ / Tên theo yêu cầu (Miễn phí)",
    engravingPlaceholder: "Nhập tên hoặc lời chúc muốn khắc (tối đa 50 ký tự)",
    engravingMaxLength: 50,
    showCardMessage: true,
    showCardMessageMockup: true,
    cardMessageLabel: "Lời nhắn trên thiệp chúc mừng",
    cardMessagePlaceholder: "Nhập nội dung thư chúc mừng gửi tới người nhận...",
    showGiftWrap: true,
    giftWrapLabel: "Chọn ruy băng nơ / hộp gói",
    giftWrapOptions: [
      "Ruy băng Đỏ Lãng Mạn",
      "Ruy băng Vàng Hoàng Gia",
      "Gói bọc giấy Kraft Hoài Cổ"
    ]
  };

  const handleCustomizationChange = (field: string, val: any) => {
    if (!setLayoutConfig) return;
    const updatedCustom = {
      ...customizationConfig,
      [field]: val
    };
    const newConfig = {
      ...parsedConfig,
      customizationConfig: updatedCustom
    };
    setLayoutConfig(JSON.stringify(newConfig, null, 2));
  };

  return (
    <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-zinc-800 animate-fade-in text-slate-800 dark:text-zinc-100">
      <div className="border-l-4 border-amber-500 pl-4 space-y-1">
        <h4 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          Cấu hình các trường hiển thị Cá nhân hóa
        </h4>
        <p className="text-[10px] text-slate-400">
          Thiết lập ẩn/hiện, nhãn gợi ý và giới hạn cho từng trường thông tin quà tặng của khách hàng.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* 1. Engraving Field */}
        <div className="bg-slate-50/50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1">
              ✍️ Trường Khắc chữ / Tên
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-450 dark:text-zinc-500 font-semibold">Bật/Tắt trường:</span>
              <button
                type="button"
                onClick={() => handleCustomizationChange('showEngraving', !customizationConfig.showEngraving)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  customizationConfig.showEngraving ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  customizationConfig.showEngraving ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {customizationConfig.showEngraving && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-8 space-y-1">
                  <label className="text-[10px] text-slate-400">Tiêu đề trường (Label)</label>
                  <input
                    type="text"
                    value={customizationConfig.engravingLabel}
                    onChange={(e) => handleCustomizationChange('engravingLabel', e.target.value)}
                    className="w-full bg-white dark:bg-zinc-850 text-slate-850 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 font-medium text-xs"
                  />
                </div>
                <div className="md:col-span-4 space-y-1">
                  <label className="text-[10px] text-slate-400">Ký tự tối đa (Max length)</label>
                  <input
                    type="number"
                    value={customizationConfig.engravingMaxLength}
                    onChange={(e) => handleCustomizationChange('engravingMaxLength', parseInt(e.target.value) || 50)}
                    className="w-full bg-white dark:bg-zinc-855 text-slate-850 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 font-medium text-xs"
                  />
                </div>
                <div className="md:col-span-12 space-y-1">
                  <label className="text-[10px] text-slate-400">Gợi ý nhập liệu (Placeholder)</label>
                  <input
                    type="text"
                    value={customizationConfig.engravingPlaceholder}
                    onChange={(e) => handleCustomizationChange('engravingPlaceholder', e.target.value)}
                    className="w-full bg-white dark:bg-zinc-850 text-slate-850 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 font-medium text-xs"
                  />
                </div>
              </div>

              {/* Real-time laser simulation toggle inside engraving settings */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-350 block">🔥 Mô phỏng Xem khắc Laser Realtime</span>
                  <span className="text-[9px] text-slate-450 dark:text-zinc-500 block">Hiển thị tab "Xem khắc Laser" trong khu vực mô phỏng</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCustomizationChange('showEngravingMockup', customizationConfig.showEngravingMockup !== false ? false : true)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    customizationConfig.showEngravingMockup !== false ? 'bg-amber-500' : 'bg-slate-200 dark:bg-zinc-800'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    customizationConfig.showEngravingMockup !== false ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 2. Card Message Field */}
        <div className="bg-slate-50/50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1">
              ✉️ Trường Thiệp chúc mừng
            </label>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-450 dark:text-zinc-550 font-semibold">Bật/Tắt trường:</span>
              <button
                type="button"
                onClick={() => handleCustomizationChange('showCardMessage', !customizationConfig.showCardMessage)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  customizationConfig.showCardMessage ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
                }`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  customizationConfig.showCardMessage ? 'translate-x-4' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          {customizationConfig.showCardMessage && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Tiêu đề trường (Label)</label>
                <input
                  type="text"
                  value={customizationConfig.cardMessageLabel}
                  onChange={(e) => handleCustomizationChange('cardMessageLabel', e.target.value)}
                  className="w-full bg-white dark:bg-zinc-855 text-slate-850 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 font-medium text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Gợi ý nhập liệu (Placeholder)</label>
                <input
                  type="text"
                  value={customizationConfig.cardMessagePlaceholder}
                  onChange={(e) => handleCustomizationChange('cardMessagePlaceholder', e.target.value)}
                  className="w-full bg-white dark:bg-zinc-850 text-slate-850 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 font-medium text-xs"
                />
              </div>

              {/* Real-time handwritten card toggle inside card message settings */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-slate-700 dark:text-zinc-350 block">✍️ Mô phỏng Xem thiệp viết tay Realtime</span>
                  <span className="text-[9px] text-slate-450 dark:text-zinc-500 block">Hiển thị tab "Xem thiệp viết tay" trong khu vực mô phỏng</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCustomizationChange('showCardMessageMockup', customizationConfig.showCardMessageMockup !== false ? false : true)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    customizationConfig.showCardMessageMockup !== false ? 'bg-amber-500' : 'bg-slate-200 dark:bg-zinc-800'
                  }`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    customizationConfig.showCardMessageMockup !== false ? 'translate-x-4' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Gift Wrap Dropdown Field */}
        <div className="bg-slate-50/50 dark:bg-zinc-800/30 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-zinc-200 uppercase tracking-wider flex items-center gap-1">
              🎁 Trường Chọn gói quà / Ruy băng
            </label>
            <button
              type="button"
              onClick={() => handleCustomizationChange('showGiftWrap', !customizationConfig.showGiftWrap)}
              className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                customizationConfig.showGiftWrap ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
              }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                customizationConfig.showGiftWrap ? 'translate-x-4' : 'translate-x-0'
              }`} />
            </button>
          </div>

          {customizationConfig.showGiftWrap && (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-zinc-800">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400">Tiêu đề trường (Label)</label>
                <input
                  type="text"
                  value={customizationConfig.giftWrapLabel}
                  onChange={(e) => handleCustomizationChange('giftWrapLabel', e.target.value)}
                  className="w-full bg-white dark:bg-zinc-855 text-slate-850 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 font-medium text-xs"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Danh sách tùy chọn gói quà</label>
                <div className="space-y-3">
                  {(customizationConfig.giftWrapOptions || []).map((opt: any, idx: number) => {
                    const isObj = typeof opt === 'object' && opt !== null;
                    const name = isObj ? opt.name : String(opt);
                    const icon = isObj ? opt.icon : '🎁';
                    const imageUrl = isObj ? opt.imageUrl : '';

                    const updateOption = (fields: any) => {
                      const list = [...(customizationConfig.giftWrapOptions || [])];
                      list[idx] = { name, icon, imageUrl, ...fields };
                      handleCustomizationChange('giftWrapOptions', list);
                    };

                    return (
                      <div key={idx} className="p-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-zinc-950/10 space-y-2 relative">
                        <button
                          type="button"
                          onClick={() => {
                            const list = (customizationConfig.giftWrapOptions || []).filter((_: any, i: number) => i !== idx);
                            handleCustomizationChange('giftWrapOptions', list);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
                        >
                          <Icon name="trash" size={12} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pr-8">
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 uppercase block font-semibold">Tên tùy chọn</label>
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => updateOption({ name: e.target.value })}
                              className="w-full bg-white dark:bg-zinc-850 text-slate-850 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 uppercase block font-semibold">Icon / Emoji</label>
                            <input
                              type="text"
                              value={icon}
                              onChange={(e) => updateOption({ icon: e.target.value })}
                              className="w-full bg-white dark:bg-zinc-855 text-slate-850 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 uppercase block font-semibold">Ảnh đại diện</label>
                            <div className="flex gap-1.5 items-center">
                              <input
                                type="text"
                                placeholder="https://..."
                                value={imageUrl}
                                onChange={(e) => updateOption({ imageUrl: e.target.value })}
                                className="flex-1 bg-white dark:bg-zinc-850 text-slate-850 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-semibold"
                              />
                              <div className="relative shrink-0">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const files = e.target.files;
                                    if (!files || files.length === 0) return;
                                    try {
                                      const data = await productService.uploadImage(files[0]);
                                      if (data && data.url) {
                                        updateOption({ imageUrl: data.url });
                                      }
                                    } catch (err) {
                                      console.error("Failed option upload:", err);
                                    }
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <button type="button" className="p-1 px-2 rounded-lg border border-slate-250 hover:bg-slate-100 text-[10px] font-bold cursor-pointer">
                                  Tải ảnh
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 border border-dashed border-slate-200 dark:border-zinc-850 rounded-xl space-y-2 bg-white dark:bg-zinc-900/50">
                  <label className="text-[10px] text-slate-405 font-bold block uppercase tracking-wider">Thêm mẫu gói quà mới</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newGiftOption}
                      onChange={(e) => setNewGiftOption(e.target.value)}
                      placeholder="Tên mẫu quà (VD: Hộp hoa hồng đỏ)"
                      className="w-full bg-white dark:bg-zinc-855 text-slate-850 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-semibold"
                    />
                    <input
                      type="text"
                      value={newGiftIcon}
                      onChange={(e) => setNewGiftIcon(e.target.value)}
                      placeholder="Icon (VD: 🎀)"
                      className="w-full bg-white dark:bg-zinc-855 text-slate-850 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-semibold"
                    />
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="text"
                        value={newGiftImage}
                        onChange={(e) => setNewGiftImage(e.target.value)}
                        placeholder="Đường dẫn ảnh (Tùy chọn)"
                        className="flex-1 bg-white dark:bg-zinc-855 text-slate-850 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-semibold"
                      />
                      <div className="relative shrink-0">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const files = e.target.files;
                            if (!files || files.length === 0) return;
                            try {
                              const data = await productService.uploadImage(files[0]);
                              if (data && data.url) {
                                setNewGiftImage(data.url);
                              }
                            } catch (err) {
                              console.error("Failed option upload:", err);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <button type="button" className="p-1 px-2 rounded-lg border border-slate-250 hover:bg-slate-100 text-[10px] font-bold cursor-pointer">
                          Tải ảnh
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!newGiftOption.trim()) return;
                        const newOpt = {
                          name: newGiftOption.trim(),
                          icon: newGiftIcon.trim(),
                          imageUrl: newGiftImage.trim()
                        };
                        handleCustomizationChange('giftWrapOptions', [...(customizationConfig.giftWrapOptions || []), newOpt]);
                        setNewGiftOption('');
                        setNewGiftIcon('🎁');
                        setNewGiftImage('');
                      }}
                      className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold cursor-pointer text-xs"
                    >
                      Thêm tùy chọn mới
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
