import React, { useState } from 'react';
import { computeProactiveSummary, fetchFilteredProactiveActions, markActionVerified, markActionLearned } from '../logic/proactiveEngine';
import { ProactiveActionCard } from './ProactiveActionCard';
import { Button } from '../../../shared/atoms/Button';
import { Wand2, ShieldCheck, CheckCircle2, Sparkles, X, RefreshCw, Layers } from 'lucide-react';

interface ProactiveActionsModalProps {
  onClose: () => void;
}

export function ProactiveActionsModal({ onClose }: ProactiveActionsModalProps) {
  const [summary, setSummary] = useState(computeProactiveSummary());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [actions, setActions] = useState(fetchFilteredProactiveActions('all'));
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshList = (filter = categoryFilter) => {
    setIsRefreshing(true);
    setTimeout(() => {
      setSummary(computeProactiveSummary());
      setActions(fetchFilteredProactiveActions(filter));
      setIsRefreshing(false);
    }, 250);
  };

  const handleFilterChange = (filter: string) => {
    setCategoryFilter(filter);
    refreshList(filter);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-hidden text-xs">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">AI Proactive Actions & Autonomous Decisions Panel</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Riwayat perbaikan mandiri yang dilakukan AI Agent tanpa perintah eksplisit pengguna
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <div className="p-2 bg-purple-50 rounded-xl border border-purple-200 flex flex-col gap-0.5">
            <span className="text-[9.5px] font-bold text-purple-700 uppercase">Aksi Otonom</span>
            <span className="text-base font-extrabold text-purple-900">{summary.totalActions}</span>
          </div>
          <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col gap-0.5">
            <span className="text-[9.5px] font-bold text-emerald-700 uppercase">Terverifikasi</span>
            <span className="text-base font-extrabold text-emerald-900">{summary.verifiedCount}</span>
          </div>
          <div className="p-2 bg-indigo-50 rounded-xl border border-indigo-200 flex flex-col gap-0.5">
            <span className="text-[9.5px] font-bold text-indigo-700 uppercase">Dipelajari</span>
            <span className="text-base font-extrabold text-indigo-900">{summary.learnedCount}</span>
          </div>
          <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 flex flex-col gap-0.5">
            <span className="text-[9.5px] font-bold text-amber-700 uppercase">High Impact</span>
            <span className="text-base font-extrabold text-amber-900">{summary.highImpactCount}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg border border-zinc-200">
            {['all', 'type_safety', 'architecture', 'ergonomics', 'performance'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleFilterChange(cat)}
                className={`px-2 py-0.5 text-[9.5px] font-bold capitalize rounded-md transition-all cursor-pointer ${
                  categoryFilter === cat ? 'bg-white text-purple-800 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => refreshList()}
            icon={<RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-purple-600' : ''}`} />}
            className="h-6 text-[10px] font-bold text-purple-800 bg-purple-50 hover:bg-purple-100"
          >
            Segarkan
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 min-h-[220px]">
          {actions.length === 0 ? (
            <div className="text-center py-10 text-zinc-400">Tidak ada aksi otonom untuk kategori ini.</div>
          ) : (
            actions.map((item) => (
              <ProactiveActionCard
                key={item.id}
                action={item}
                onVerify={(id) => { markActionVerified(id); refreshList(); }}
                onLearn={(id) => { markActionLearned(id); refreshList(); }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
