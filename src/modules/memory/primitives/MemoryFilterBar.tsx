import React from 'react';
import { Button } from '../../../shared/atoms/Button';
import { Search, Plus, Trash2 } from 'lucide-react';

interface MemoryFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  totalCount: number;
  isAdding: boolean;
  setIsAdding: (val: boolean) => void;
  onClearAll: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Semua' },
  { id: 'repo_progress', label: 'Progres Repo' },
  { id: 'tool_skill', label: 'Tools & Skill' },
  { id: 'conversation', label: 'Percakapan' },
  { id: 'user_preference', label: 'Preferensi' },
];

export function MemoryFilterBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  totalCount,
  isAdding,
  setIsAdding,
  onClearAll,
}: MemoryFilterBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari memori atau tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-xs outline-none focus:border-purple-400"
          />
        </div>
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsAdding(!isAdding)}
            icon={<Plus className="w-3.5 h-3.5" />}
            className="text-[10.5px] h-7 px-2 font-bold"
          >
            Tambah Catatan
          </Button>
          {totalCount > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearAll}
              icon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
              className="text-[10.5px] h-7 px-2 text-red-600 hover:bg-red-50"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-0.5">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`text-[10.5px] px-2.5 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-zinc-900 text-white'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
