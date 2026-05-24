'use client';

import { useState, useEffect } from 'react';
import { catalogService } from '@/services/catalog.service';

interface AttributeDefinition {
  id: string;
  name: string;
  code: string;
  type: 'TEXT' | 'NUMBER' | 'BOOLEAN' | 'SELECT' | 'MULTI_SELECT';
  options?: string; // JSON string array
  isRequired: boolean;
  isFilterable: boolean;
}

interface CategoryAttributesFormProps {
  categoryId: string;
  attributes: Record<string, string>;
  setAttributes: (attrs: Record<string, string>) => void;
}

export default function CategoryAttributesForm({
  categoryId,
  attributes,
  setAttributes,
}: CategoryAttributesFormProps) {
  const [definitions, setDefinitions] = useState<AttributeDefinition[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadDefinitions() {
      if (!categoryId) {
        setDefinitions([]);
        return;
      }

      try {
        setLoading(true);
        // Fetch attribute definitions for category + global ones
        const data = await catalogService.getAttributeDefinitions(categoryId);
        setDefinitions(data || []);
      } catch (err) {
        console.error('Lỗi khi tải cấu hình thuộc tính:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDefinitions();
  }, [categoryId]);

  const handleValueChange = (name: string, value: string) => {
    setAttributes({
      ...attributes,
      [name]: value,
    });
  };

  const handleMultiSelectChange = (name: string, option: string, checked: boolean) => {
    const currentVal = attributes[name] || '';
    let selectedList = currentVal ? currentVal.split(',').map(s => s.trim()) : [];
    if (checked) {
      if (!selectedList.includes(option)) {
        selectedList.push(option);
      }
    } else {
      selectedList = selectedList.filter(item => item !== option);
    }
    handleValueChange(name, selectedList.join(', '));
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-rose-500" />
        <span className="ml-2 text-xs text-slate-400">Đang tải cấu hình thuộc tính...</span>
      </div>
    );
  }

  if (definitions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6 text-xs font-semibold">
      <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400 border-b border-slate-50 dark:border-zinc-800 pb-2">
        Thuộc tính sản phẩm chi tiết (Category Attributes)
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {definitions.map((def) => {
          let parsedOptions: string[] = [];
          if (def.options) {
            try {
              parsedOptions = JSON.parse(def.options);
            } catch (e) {
              console.error('Failed to parse options for attribute:', def.name, e);
            }
          }

          const value = attributes[def.name] || '';

          return (
            <div key={def.id} className="space-y-2">
              <label className="block text-slate-600 dark:text-zinc-400">
                {def.name} {def.isRequired && <span className="text-rose-500">*</span>}
              </label>

              {def.type === 'TEXT' && (
                <input
                  type="text"
                  required={def.isRequired}
                  placeholder={`Nhập ${def.name.toLowerCase()}...`}
                  value={value}
                  onChange={(e) => handleValueChange(def.name, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-850 shadow-sm font-medium"
                />
              )}

              {def.type === 'NUMBER' && (
                <input
                  type="number"
                  required={def.isRequired}
                  placeholder="0"
                  value={value}
                  onChange={(e) => handleValueChange(def.name, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-850 shadow-sm font-medium"
                />
              )}

              {def.type === 'BOOLEAN' && (
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input
                    type="checkbox"
                    checked={value === 'true'}
                    onChange={(e) => handleValueChange(def.name, e.target.checked ? 'true' : 'false')}
                    className="rounded border-slate-300 text-rose-500 focus:ring-rose-500"
                  />
                  <span className="text-slate-500 font-medium">Bật / Có</span>
                </label>
              )}

              {def.type === 'SELECT' && (
                <select
                  required={def.isRequired}
                  value={value}
                  onChange={(e) => handleValueChange(def.name, e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-850 shadow-sm font-medium"
                >
                  <option value="">Chọn {def.name.toLowerCase()}</option>
                  {parsedOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {def.type === 'MULTI_SELECT' && (
                <div className="flex flex-wrap gap-3 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/20">
                  {parsedOptions.map((opt) => {
                    const isChecked = value.split(',').map(s => s.trim()).includes(opt);
                    return (
                      <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => handleMultiSelectChange(def.name, opt, e.target.checked)}
                          className="rounded border-slate-300 text-rose-500 focus:ring-rose-500 text-[10px]"
                        />
                        <span className="text-slate-600 dark:text-zinc-300 font-medium">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
