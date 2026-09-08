import React, { useState } from 'react';
import { useKnowledgeBase } from '../logic/useKnowledgeBase';
import { KnowledgeRuleCard } from './KnowledgeRuleCard';
import { AddCustomRuleForm } from './AddCustomRuleForm';
import { Button } from '../../../shared/atoms/Button';
import { BookOpen, Search, Plus, X, BrainCircuit, Filter } from 'lucide-react';

interface KnowledgeBaseModalProps {
  onClose: () => void;
}

export function KnowledgeBaseModal({ onClose }: KnowledgeBaseModalProps) {
  const { rules, totalCount, filter, setFilter, addCustom, updateOverride, toggleStatus } = useKnowledgeBase();
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">Knowledge Base Agent & Best Practices Manifest</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Kelola, tinjau, dan override standar koding internal yang dipelajari AI Agent ({totalCount} Aturan Aktif)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Controls: Search, Filter & Add Custom */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Cari standar koding atau rasional..."
                value={filter.searchQuery}
                onChange={(e) => setFilter({ ...filter, searchQuery: e.target.value })}
                className="w-full pl-8 pr-3 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-xs"
              />
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setShowAddForm(!showAddForm)}
              icon={<Plus className="w-3.5 h-3.5" />}
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold h-7 text-[10px]"
            >
              {showAddForm ? 'Tutup Form' : 'Tambah Standar'}
            </Button>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'architecture', label: 'Arsitektur' },
              { id: 'type_safety', label: 'Type Safety' },
              { id: 'ui_ux', label: 'UI/UX' },
              { id: 'error_handling', label: 'Error' },
              { id: 'performance', label: 'Performa' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter({ ...filter, category: cat.id })}
                className={`px-2.5 py-0.5 text-[9.5px] font-bold rounded-full transition-all shrink-0 cursor-pointer ${
                  filter.category === cat.id
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form or Rules List */}
        {showAddForm ? (
          <AddCustomRuleForm
            onAdd={(cat, rule, rat, impact) => {
              addCustom(cat, rule, rat, impact);
              setShowAddForm(false);
            }}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 min-h-[220px]">
            {rules.length === 0 ? (
              <div className="text-center py-10 text-zinc-400">Tidak ada standar koding yang cocok dengan kriteria pencarian.</div>
            ) : (
              rules.map((rule) => (
                <KnowledgeRuleCard
                  key={rule.id}
                  rule={rule}
                  onUpdate={updateOverride}
                  onToggle={toggleStatus}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
