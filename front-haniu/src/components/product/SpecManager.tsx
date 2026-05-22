'use client';

import Icon from '@/components/common/Icons';

interface SpecInput {
  key: string;
  value: string;
}

interface SpecManagerProps {
  specs: SpecInput[];
  setSpecs: (specs: SpecInput[]) => void;
}

export default function SpecManager({ specs, setSpecs }: SpecManagerProps) {
  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (idx: number) => setSpecs(specs.filter((_, i) => i !== idx));

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800 shadow-sm space-y-6 text-xs font-semibold">
      <div className="flex justify-between items-center border-b border-slate-50 dark:border-zinc-800 pb-2">
        <h3 className="font-bold text-sm tracking-wider uppercase text-slate-400">Thông số kỹ thuật động (JSONB)</h3>
        <button
          type="button"
          onClick={addSpec}
          className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1"
        >
          <Icon name="plus" size={12} /> Thêm thông số mới
        </button>
      </div>

      <div className="space-y-3">
        {specs.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Tên cột thuộc tính (VD: Chất liệu, Xuất xứ)"
              value={item.key}
              onChange={(e) => {
                const newSpecs = [...specs];
                newSpecs[idx].key = e.target.value;
                setSpecs(newSpecs);
              }}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800"
            />
            <input
              type="text"
              placeholder="Giá trị tương ứng (VD: Thủy tinh, Pháp)"
              value={item.value}
              onChange={(e) => {
                const newSpecs = [...specs];
                newSpecs[idx].value = e.target.value;
                setSpecs(newSpecs);
              }}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 dark:border-zinc-800 dark:bg-zinc-800"
            />
            <button
              type="button"
              onClick={() => removeSpec(idx)}
              className="text-rose-500 hover:text-rose-700 font-bold w-6 h-6 flex items-center justify-center rounded-full hover:bg-rose-50 dark:hover:bg-rose-950/20"
            >
              <Icon name="close" size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
