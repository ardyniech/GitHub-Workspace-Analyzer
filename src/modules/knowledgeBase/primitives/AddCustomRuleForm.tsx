import React, { useState } from 'react';
import { ExtendedStyleRule } from '../logic/types';
import { Button } from '../../../shared/atoms/Button';
import { Plus, Check, X } from 'lucide-react';

interface AddCustomRuleFormProps {
  onAdd: (category: ExtendedStyleRule['category'], rule: string, rationale: string, impact: number) => void;
  onCancel: () => void;
}

export function AddCustomRuleForm({ onAdd, onCancel }: AddCustomRuleFormProps) {
  const [category, setCategory] = useState<ExtendedStyleRule['category']>('architecture');
  const [ruleText, setRuleText] = useState('');
  const [rationale, setRationale] = useState('');
  const [impact, setImpact] = useState(90);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleText.trim() || !rationale.trim()) return;
    onAdd(category, ruleText.trim(), rationale.trim(), impact);
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 bg-purple-50/80 rounded-xl border border-purple-200 flex flex-col gap-2">
      <div className="flex items-center justify-between border-b border-purple-200 pb-1.5">
        <span className="text-[11px] font-bold text-purple-900 uppercase">Tambah Standar Koding Kustom Baru</span>
        <button type="button" onClick={onCancel} className="text-zinc-400 hover:text-zinc-700 cursor-pointer">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold text-zinc-600 block mb-0.5">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-xs font-semibold"
          >
            <option value="architecture">Arsitektur</option>
            <option value="type_safety">Type Safety</option>
            <option value="ui_ux">UI / UX Ergonomic</option>
            <option value="error_handling">Error Handling</option>
            <option value="performance">Performa</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-600 block mb-0.5">Impact Score (1-100)</label>
          <input
            type="number"
            min="1"
            max="100"
            value={impact}
            onChange={(e) => setImpact(Number(e.target.value))}
            className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-xs font-mono"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-zinc-600 block mb-0.5">Aturan / Standar Koding</label>
        <input
          type="text"
          placeholder="Contoh: Wajib gunakan Memoization pada Komponen Grafik Recharts"
          value={ruleText}
          onChange={(e) => setRuleText(e.target.value)}
          className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-xs font-bold"
        />
      </div>

      <div>
        <label className="text-[10px] font-bold text-zinc-600 block mb-0.5">Rasional & Alasan Teknis</label>
        <textarea
          placeholder="Jelaskan alasan teknis agar AI Agent memahami urgensi standar ini..."
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          className="w-full px-2 py-1 bg-white border border-zinc-300 rounded text-xs h-14"
        />
      </div>

      <div className="flex items-center justify-end gap-2 pt-1">
        <Button size="sm" variant="ghost" onClick={onCancel} className="h-6 text-[10px]">Batal</Button>
        <Button size="sm" variant="primary" type="submit" icon={<Plus className="w-3 h-3" />} className="h-6 text-[10px] bg-purple-700 hover:bg-purple-800 text-white font-bold">
          Tambahkan Standar
        </Button>
      </div>
    </form>
  );
}
