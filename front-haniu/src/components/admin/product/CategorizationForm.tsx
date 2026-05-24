'use client';

import { useState, useEffect } from 'react';
import { catalogService, Occasion, Recipient } from '@/services/catalog.service';

interface CategorizationFormProps {
  selectedOccasions: string[];
  setSelectedOccasions: (v: string[] | ((prev: string[]) => string[])) => void;
  selectedRecipients: string[];
  setSelectedRecipients: (v: string[] | ((prev: string[]) => string[])) => void;
}

const DEFAULT_OCCASIONS = [
  { id: "123e4567-e89b-12d3-a456-426614174001", name: "Lễ Tình Nhân (Valentine)" },
  { id: "123e4567-e89b-12d3-a456-426614174002", name: "Sinh Nhật" },
  { id: "123e4567-e89b-12d3-a456-426614174003", name: "Ngày Nhà Giáo 20-11" },
  { id: "123e4567-e89b-12d3-a456-426614174004", name: "Quốc Khánh 2-9" }
];

const DEFAULT_RECIPIENTS = [
  { id: "223e4567-e89b-12d3-a456-426614174001", name: "Bạn Gái" },
  { id: "223e4567-e89b-12d3-a456-426614174002", name: "Bạn Trai" },
  { id: "223e4567-e89b-12d3-a456-426614174003", name: "Thầy Cô" },
  { id: "223e4567-e89b-12d3-a456-426614174004", name: "Đối Tác" }
];

export default function CategorizationForm({
  selectedOccasions,
  setSelectedOccasions,
  selectedRecipients,
  setSelectedRecipients,
}: CategorizationFormProps) {
  const [occasionsList, setOccasionsList] = useState<any[]>(DEFAULT_OCCASIONS);
  const [recipientsList, setRecipientsList] = useState<any[]>(DEFAULT_RECIPIENTS);

  useEffect(() => {
    async function loadData() {
      try {
        const occs = await catalogService.getAllOccasions();
        const recs = await catalogService.getAllRecipients();
        
        if (occs && occs.length > 0) {
          setOccasionsList(occs);
        } else {
          setOccasionsList(DEFAULT_OCCASIONS);
        }
        
        if (recs && recs.length > 0) {
          setRecipientsList(recs);
        } else {
          setRecipientsList(DEFAULT_RECIPIENTS);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu phân loại:', err);
      }
    }
    loadData();
  }, []);

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

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6 text-xs font-semibold">
      <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 border-b border-slate-50 dark:border-zinc-800 pb-2">
        Phân loại Dịp lễ & Người nhận
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
            Thích hợp các Dịp lễ nào?
          </label>
          <div className="space-y-2">
            {occasionsList.map(occ => (
              <label key={occ.id} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedOccasions.includes(occ.id)}
                  onChange={() => toggleOccasion(occ.id)}
                  className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-slate-600 dark:text-zinc-300 font-medium">{occ.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
            Thích hợp tặng cho Đối tượng nào?
          </label>
          <div className="space-y-2">
            {recipientsList.map(rec => (
              <label key={rec.id} className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedRecipients.includes(rec.id)}
                  onChange={() => toggleRecipient(rec.id)}
                  className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                />
                <span className="text-slate-600 dark:text-zinc-300 font-medium">{rec.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
