'use client';

import React, { useState } from 'react';
import { useHomeLayoutStore } from '@/store/homeLayout';
import Icon from '@/components/common/Icons';

export function ProductDetailsTab() {
  const { productDetails, updateProductDetails } = useHomeLayoutStore();

  const config = productDetails || {
    showPromotions: true,
    promotions: [],
    showWhyChooseUs: true,
    whyChooseUs: [],
    showDeliveryPolicy: true,
    deliveryPolicy: { lines: [], bulletPoints: [] },
    showBrandCommitment: true,
    brandCommitment: [],
  };

  // State controls for adding temporary inputs
  const [newPromo, setNewPromo] = useState('');
  const [newCommitment, setNewCommitment] = useState('');
  const [newWhyIcon, setNewWhyIcon] = useState('✨');
  const [newWhyText, setNewWhyText] = useState('');
  const [newDeliveryLabel, setNewDeliveryLabel] = useState('');
  const [newDeliveryValue, setNewDeliveryValue] = useState('');
  const [newDeliveryBullet, setNewDeliveryBullet] = useState('');

  const handleToggle = (key: 'showPromotions' | 'showWhyChooseUs' | 'showDeliveryPolicy' | 'showBrandCommitment') => {
    updateProductDetails({ [key]: !config[key] });
  };

  // Promotions List operations
  const addPromotion = () => {
    if (!newPromo.trim()) return;
    updateProductDetails({
      promotions: [...config.promotions, newPromo.trim()]
    });
    setNewPromo('');
  };

  const removePromotion = (index: number) => {
    updateProductDetails({
      promotions: config.promotions.filter((_, i) => i !== index)
    });
  };

  const updatePromotionText = (index: number, val: string) => {
    const list = [...config.promotions];
    list[index] = val;
    updateProductDetails({ promotions: list });
  };

  // WhyChooseUs operations
  const addWhyChooseUs = () => {
    if (!newWhyText.trim()) return;
    updateProductDetails({
      whyChooseUs: [...config.whyChooseUs, { icon: newWhyIcon.trim(), text: newWhyText.trim() }]
    });
    setNewWhyText('');
    setNewWhyIcon('✨');
  };

  const removeWhyChooseUs = (index: number) => {
    updateProductDetails({
      whyChooseUs: config.whyChooseUs.filter((_, i) => i !== index)
    });
  };

  const updateWhyItem = (index: number, field: 'icon' | 'text', val: string) => {
    const list = [...config.whyChooseUs];
    list[index] = { ...list[index], [field]: val };
    updateProductDetails({ whyChooseUs: list });
  };

  // Delivery Policy operations
  const addDeliveryLine = () => {
    if (!newDeliveryLabel.trim() || !newDeliveryValue.trim()) return;
    const lines = [...(config.deliveryPolicy?.lines || [])];
    lines.push({ label: newDeliveryLabel.trim(), value: newDeliveryValue.trim() });
    updateProductDetails({
      deliveryPolicy: {
        ...config.deliveryPolicy,
        lines
      }
    });
    setNewDeliveryLabel('');
    setNewDeliveryValue('');
  };

  const removeDeliveryLine = (index: number) => {
    updateProductDetails({
      deliveryPolicy: {
        ...config.deliveryPolicy,
        lines: (config.deliveryPolicy?.lines || []).filter((_, i) => i !== index)
      }
    });
  };

  const addDeliveryBullet = () => {
    if (!newDeliveryBullet.trim()) return;
    const bulletPoints = [...(config.deliveryPolicy?.bulletPoints || [])];
    bulletPoints.push(newDeliveryBullet.trim());
    updateProductDetails({
      deliveryPolicy: {
        ...config.deliveryPolicy,
        bulletPoints
      }
    });
    setNewDeliveryBullet('');
  };

  const removeDeliveryBullet = (index: number) => {
    updateProductDetails({
      deliveryPolicy: {
        ...config.deliveryPolicy,
        bulletPoints: (config.deliveryPolicy?.bulletPoints || []).filter((_, i) => i !== index)
      }
    });
  };

  // Brand Commitment operations
  const addBrandCommitment = () => {
    if (!newCommitment.trim()) return;
    updateProductDetails({
      brandCommitment: [...config.brandCommitment, newCommitment.trim()]
    });
    setNewCommitment('');
  };

  const removeBrandCommitment = (index: number) => {
    updateProductDetails({
      brandCommitment: config.brandCommitment.filter((_, i) => i !== index)
    });
  };

  const updateCommitmentText = (index: number, val: string) => {
    const list = [...config.brandCommitment];
    list[index] = val;
    updateProductDetails({ brandCommitment: list });
  };

  return (
    <div className="space-y-8 divide-y divide-slate-150 dark:divide-zinc-800 text-xs font-semibold">
      
      {/* 1. Promotions section */}
      <div className="pb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
              Khối Ưu Đãi Hôm Nay (Promotions)
            </h4>
            <p className="text-[10px] text-slate-450 mt-0.5">Quản lý nội dung các dòng ưu đãi hiển thị trong chi tiết sản phẩm.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.showPromotions}
              onChange={() => handleToggle('showPromotions')}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-350 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
          </label>
        </div>

        {config.showPromotions && (
          <div className="space-y-3 bg-slate-50/50 dark:bg-zinc-850 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
            <div className="space-y-2">
              {config.promotions.map((promo, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={promo}
                    onChange={(e) => updatePromotionText(idx, e.target.value)}
                    className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => removePromotion(idx)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newPromo}
                onChange={(e) => setNewPromo(e.target.value)}
                placeholder="Thêm ưu đãi mới (ví dụ: Tặng thiệp viết tay miễn phí)..."
                className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5"
              />
              <button
                type="button"
                onClick={addPromotion}
                className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all active:scale-95 cursor-pointer"
              >
                Thêm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Why Choose Us section */}
      <div className="py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
              Khối Lý Do Nên Chọn Haniu (Why Choose Us)
            </h4>
            <p className="text-[10px] text-slate-450 mt-0.5">Bố cục các cam kết chất lượng kèm icon xinh xắn.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.showWhyChooseUs}
              onChange={() => handleToggle('showWhyChooseUs')}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-350 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
          </label>
        </div>

        {config.showWhyChooseUs && (
          <div className="space-y-3 bg-slate-50/50 dark:bg-zinc-850 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
            <div className="space-y-3">
              {config.whyChooseUs.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={item.icon}
                    onChange={(e) => updateWhyItem(idx, 'icon', e.target.value)}
                    className="w-12 text-center bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-2 py-1.5"
                    placeholder="Icon"
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateWhyItem(idx, 'text', e.target.value)}
                    className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5"
                    placeholder="Nội dung"
                  />
                  <button
                    type="button"
                    onClick={() => removeWhyChooseUs(idx)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newWhyIcon}
                onChange={(e) => setNewWhyIcon(e.target.value)}
                placeholder="Icon (ví dụ: 🌹)"
                className="w-20 text-center bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-2 py-1.5"
              />
              <input
                type="text"
                value={newWhyText}
                onChange={(e) => setNewWhyText(e.target.value)}
                placeholder="Lý do (ví dụ: Hoa sáp thơm bền màu tới 3 năm)..."
                className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5"
              />
              <button
                type="button"
                onClick={addWhyChooseUs}
                className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all active:scale-95 cursor-pointer"
              >
                Thêm
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Delivery Policy section */}
      <div className="py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
              Khối Chính Sách Giao Hàng (Delivery Policy)
            </h4>
            <p className="text-[10px] text-slate-450 mt-0.5">Quản lý mốc thời gian giao hàng và các lưu ý đồng kiểm.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.showDeliveryPolicy}
              onChange={() => handleToggle('showDeliveryPolicy')}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-350 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
          </label>
        </div>

        {config.showDeliveryPolicy && (
          <div className="space-y-4 bg-slate-50/50 dark:bg-zinc-850 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
            {/* Delivery Lines */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block border-b pb-1">Thời gian vận chuyển</span>
              
              <div className="space-y-2">
                {(config.deliveryPolicy?.lines || []).map((line, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={line.label}
                      onChange={(e) => {
                        const list = [...config.deliveryPolicy.lines];
                        list[idx].label = e.target.value;
                        updateProductDetails({ deliveryPolicy: { ...config.deliveryPolicy, lines: list } });
                      }}
                      className="w-1/3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5"
                    />
                    <input
                      type="text"
                      value={line.value}
                      onChange={(e) => {
                        const list = [...config.deliveryPolicy.lines];
                        list[idx].value = e.target.value;
                        updateProductDetails({ deliveryPolicy: { ...config.deliveryPolicy, lines: list } });
                      }}
                      className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5"
                    />
                    <button
                      type="button"
                      onClick={() => removeDeliveryLine(idx)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newDeliveryLabel}
                  onChange={(e) => setNewDeliveryLabel(e.target.value)}
                  placeholder="Khu vực (Hà Nội)..."
                  className="w-1/3 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5"
                />
                <input
                  type="text"
                  value={newDeliveryValue}
                  onChange={(e) => setNewDeliveryValue(e.target.value)}
                  placeholder="Thời gian (2 - 4h)..."
                  className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5"
                />
                <button
                  type="button"
                  onClick={addDeliveryLine}
                  className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all active:scale-95 cursor-pointer"
                >
                  Thêm dòng
                </button>
              </div>
            </div>

            {/* Delivery Bullet points */}
            <div className="space-y-3.5 pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block border-b pb-1">Các lưu ý đồng kiểm & Đóng gói</span>
              
              <div className="space-y-2">
                {(config.deliveryPolicy?.bulletPoints || []).map((point, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const list = [...config.deliveryPolicy.bulletPoints];
                        list[idx] = e.target.value;
                        updateProductDetails({ deliveryPolicy: { ...config.deliveryPolicy, bulletPoints: list } });
                      }}
                      className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5"
                    />
                    <button
                      type="button"
                      onClick={() => removeDeliveryBullet(idx)}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newDeliveryBullet}
                  onChange={(e) => setNewDeliveryBullet(e.target.value)}
                  placeholder="Lưu ý (ví dụ: Được đồng kiểm trước khi thanh toán)..."
                  className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5"
                />
                <button
                  type="button"
                  onClick={addDeliveryBullet}
                  className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all active:scale-95 cursor-pointer"
                >
                  Thêm lưu ý
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 4. Brand Commitment section */}
      <div className="py-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
              Khối Cam Kết Từ Haniu (Brand Commitment)
            </h4>
            <p className="text-[10px] text-slate-450 mt-0.5">Quản lý nội dung các dòng cam kết chất lượng của thương hiệu.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.showBrandCommitment}
              onChange={() => handleToggle('showBrandCommitment')}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-350 dark:bg-zinc-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-500" />
          </label>
        </div>

        {config.showBrandCommitment && (
          <div className="space-y-3 bg-slate-50/50 dark:bg-zinc-850 p-4 rounded-2xl border border-slate-100 dark:border-zinc-800">
            <div className="space-y-2">
              {config.brandCommitment.map((comm, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={comm}
                    onChange={(e) => updateCommitmentText(idx, e.target.value)}
                    className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => removeBrandCommitment(idx)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newCommitment}
                onChange={(e) => setNewCommitment(e.target.value)}
                placeholder="Thêm cam kết mới (ví dụ: Hình ảnh sản phẩm thật tự chụp 100%)..."
                className="flex-1 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 focus:border-rose-500 focus:outline-none rounded-xl px-3 py-1.5"
              />
              <button
                type="button"
                onClick={addBrandCommitment}
                className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all active:scale-95 cursor-pointer"
              >
                Thêm
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
