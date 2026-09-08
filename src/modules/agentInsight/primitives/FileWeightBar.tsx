import React from 'react';
import { FileWeightItem } from '../logic/types';
import { FileCode, Layers, Cpu, FileText, CheckCircle2 } from 'lucide-react';

interface FileWeightBarProps {
  key?: React.Key;
  item: FileWeightItem;
}

export function FileWeightBar({ item }: FileWeightBarProps) {
  const getBadgeColor = (cat: string) => {
    switch (cat) {
      case 'core_logic': return 'bg-indigo-100 text-indigo-800';
      case 'ui_layout': return 'bg-blue-100 text-blue-800';
      case 'config': return 'bg-emerald-100 text-emerald-800';
      case 'schema': return 'bg-purple-100 text-purple-800';
      default: return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/90 hover:border-zinc-300 transition-all flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="font-mono font-bold text-xs text-zinc-900 truncate">{item.path}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded capitalize ${getBadgeColor(item.category)}`}>
            {item.category.replace('_', ' ')}
          </span>
          <span className="text-[10px] font-extrabold text-indigo-950 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
            {item.weightPct}% Weight
          </span>
        </div>
      </div>

      <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
        <div className="bg-indigo-600 h-full rounded-full transition-all duration-500" style={{ width: `${item.weightPct}%` }} />
      </div>

      <p className="text-[10.5px] text-zinc-600 leading-normal">{item.relevanceReason}</p>

      <div className="flex items-center justify-between pt-1 border-t border-zinc-200/60 text-[9.5px] text-zinc-500 font-mono">
        <span>Alokasi Toko Konteks: {item.tokenCount} tokens</span>
        <span className="text-emerald-700 font-bold flex items-center gap-1">
          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Loaded in Active Window
        </span>
      </div>
    </div>
  );
}
