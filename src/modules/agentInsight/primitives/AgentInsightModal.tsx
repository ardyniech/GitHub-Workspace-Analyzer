import React, { useState } from 'react';
import { computeSemanticContext, filterFileWeightsByCategory } from '../logic/insightEngine';
import { FileWeightBar } from './FileWeightBar';
import { Button } from '../../../shared/atoms/Button';
import { Compass, Cpu, Layers, RefreshCw, X, Sparkles, Binary } from 'lucide-react';

interface AgentInsightModalProps {
  repoFullName: string | undefined;
  onClose: () => void;
}

export function AgentInsightModal({ repoFullName, onClose }: AgentInsightModalProps) {
  const [context, setContext] = useState(computeSemanticContext(repoFullName));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredFiles, setFilteredFiles] = useState(filterFileWeightsByCategory('all', repoFullName));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const refreshed = computeSemanticContext(repoFullName);
      setContext(refreshed);
      setFilteredFiles(filterFileWeightsByCategory(selectedCategory, repoFullName));
      setIsRefreshing(false);
    }, 250);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setFilteredFiles(filterFileWeightsByCategory(cat, repoFullName));
  };

  const tokenUsagePct = Math.round((context.totalContextTokens / context.maxContextTokens) * 100);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-hidden text-xs">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">Agent Insight & Semantic Context Panel</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Transparansi bobot berkas dan konteks semantik yang digunakan AI dalam mengambil keputusan rekayasa
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 bg-indigo-50/80 rounded-xl border border-indigo-200 flex flex-col gap-0.5">
            <span className="text-[9.5px] font-bold text-indigo-700 uppercase">Context Window Usage</span>
            <span className="text-base font-extrabold text-indigo-950">{context.totalContextTokens.toLocaleString()} / {context.maxContextTokens.toLocaleString()} tokens</span>
            <span className="text-[9px] text-indigo-700 font-medium">Beban Konteks: {tokenUsagePct}%</span>
          </div>

          <div className="p-2.5 bg-purple-50/80 rounded-xl border border-purple-200 flex flex-col gap-0.5">
            <span className="text-[9.5px] font-bold text-purple-700 uppercase">Primary Focus</span>
            <span className="text-xs font-black text-purple-950 truncate">{context.primaryFocus}</span>
            <span className="text-[9px] text-purple-700 font-medium">Top Category: {context.topCategory}</span>
          </div>

          <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-col gap-0.5">
            <span className="text-[9.5px] font-bold text-emerald-700 uppercase">Tracked Files</span>
            <span className="text-base font-extrabold text-emerald-950">{context.files.length} Berkas Kunci</span>
            <span className="text-[9px] text-emerald-700 font-medium">Active Semantic Graph</span>
          </div>
        </div>

        <div className="p-2.5 bg-zinc-900 text-white rounded-xl text-[11px] leading-relaxed flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300">Rasionalitas Penalar Konteks Semantik: </span>
            <span className="text-zinc-200">{context.reasoningOverview}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
            {['all', 'core_logic', 'ui_layout', 'config', 'schema', 'docs'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-2 py-0.5 text-[9.5px] font-bold capitalize rounded-md transition-all cursor-pointer ${
                  selectedCategory === cat ? 'bg-white text-indigo-800 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={handleRefresh}
            icon={<RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />}
            className="h-6 text-[10px] font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100"
          >
            Pindai Ulang
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 min-h-[200px]">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-10 text-zinc-400">Tidak ada berkas untuk kategori semantik ini.</div>
          ) : (
            filteredFiles.map((item) => <FileWeightBar key={item.path} item={item} />)
          )}
        </div>
      </div>
    </div>
  );
}
