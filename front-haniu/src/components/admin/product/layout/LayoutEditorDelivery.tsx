'use client';

import React from 'react';
import Icon from '@/components/common/Icons';

interface DeliveryPolicyLine {
  label: string;
  value: string;
}

interface DeliveryPolicyConfig {
  useGlobalConfig: boolean;
  show: boolean;
  list: {
    lines: DeliveryPolicyLine[];
    bulletPoints: string[];
  };
}

interface LayoutEditorDeliveryProps {
  deliveryPolicyConfig: DeliveryPolicyConfig;
  newDelivLabel: string;
  newDelivVal: string;
  newDelivBullet: string;
  setNewDelivLabel: (val: string) => void;
  setNewDelivVal: (val: string) => void;
  setNewDelivBullet: (val: string) => void;
  onToggleShow: (val: boolean) => void;
  onUpdateList: (list: { lines: DeliveryPolicyLine[]; bulletPoints: string[] }) => void;
}

export default function LayoutEditorDelivery({
  deliveryPolicyConfig,
  newDelivLabel,
  newDelivVal,
  newDelivBullet,
  setNewDelivLabel,
  setNewDelivVal,
  setNewDelivBullet,
  onToggleShow,
  onUpdateList
}: LayoutEditorDeliveryProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-slate-500 font-semibold">Hiển thị Khối chính sách Giao hàng</label>
          <button
            type="button"
            onClick={() => onToggleShow(!deliveryPolicyConfig.show)}
            className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              deliveryPolicyConfig.show ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                deliveryPolicyConfig.show ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {deliveryPolicyConfig.show && (
          <div className="space-y-6 border-t border-slate-50 dark:border-zinc-800/80 pt-4">
            {/* Table Lines */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-450 block border-b pb-1">
                Bảng thời gian giao hàng dự kiến
              </span>

              <div className="space-y-2">
                {deliveryPolicyConfig.list.lines.map((line, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={line.label}
                      onChange={(e) => {
                        const lines = [...deliveryPolicyConfig.list.lines];
                        lines[idx] = { ...lines[idx], label: e.target.value };
                        onUpdateList({ ...deliveryPolicyConfig.list, lines });
                      }}
                      className="w-1/3 bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-zinc-100"
                      placeholder="Khu vực"
                    />
                    <input
                      type="text"
                      value={line.value}
                      onChange={(e) => {
                        const lines = [...deliveryPolicyConfig.list.lines];
                        lines[idx] = { ...lines[idx], value: e.target.value };
                        onUpdateList({ ...deliveryPolicyConfig.list, lines });
                      }}
                      className="flex-1 bg-white dark:bg-zinc-850 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-zinc-100"
                      placeholder="Thời gian"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const lines = deliveryPolicyConfig.list.lines.filter((_, i) => i !== idx);
                        onUpdateList({ ...deliveryPolicyConfig.list, lines });
                      }}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDelivLabel}
                  onChange={(e) => setNewDelivLabel(e.target.value)}
                  placeholder="Khu vực (VD: Miền Nam)..."
                  className="w-1/3 bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs"
                />
                <input
                  type="text"
                  value={newDelivVal}
                  onChange={(e) => setNewDelivVal(e.target.value)}
                  placeholder="Thời gian (VD: 3 - 5 ngày)..."
                  className="flex-1 bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newDelivLabel.trim() || !newDelivVal.trim()) return;
                    onUpdateList({
                      ...deliveryPolicyConfig.list,
                      lines: [
                        ...deliveryPolicyConfig.list.lines,
                        { label: newDelivLabel.trim(), value: newDelivVal.trim() }
                      ]
                    });
                    setNewDelivLabel('');
                    setNewDelivVal('');
                  }}
                  className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  Thêm dòng
                </button>
              </div>
            </div>

            {/* Bullet Points */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-450 block border-b pb-1">Các lưu ý riêng</span>

              <div className="space-y-2">
                {deliveryPolicyConfig.list.bulletPoints.map((point, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const bulletPoints = [...deliveryPolicyConfig.list.bulletPoints];
                        bulletPoints[idx] = e.target.value;
                        onUpdateList({ ...deliveryPolicyConfig.list, bulletPoints });
                      }}
                      className="flex-1 bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-zinc-100"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const bulletPoints = deliveryPolicyConfig.list.bulletPoints.filter((_, i) => i !== idx);
                        onUpdateList({ ...deliveryPolicyConfig.list, bulletPoints });
                      }}
                      className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all cursor-pointer"
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDelivBullet}
                  onChange={(e) => setNewDelivBullet(e.target.value)}
                  placeholder="Lưu ý riêng..."
                  className="flex-1 bg-white dark:bg-zinc-855 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-1.5 text-xs"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newDelivBullet.trim()) return;
                    onUpdateList({
                      ...deliveryPolicyConfig.list,
                      bulletPoints: [...deliveryPolicyConfig.list.bulletPoints, newDelivBullet.trim()]
                    });
                    setNewDelivBullet('');
                  }}
                  className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  Thêm lưu ý
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
