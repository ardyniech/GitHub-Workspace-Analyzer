import React from 'react';

const CATEGORIES = [
  { id: 'all', label: 'Semua' },
  { id: 'security', label: 'Keamanan' },
  { id: 'architecture', label: 'Arsitektur' },
  { id: 'cicd', label: 'CI/CD' },
  { id: 'testing', label: 'Pengujian' },
  { id: 'performance', label: 'Performa' },
];

interface CategoryFilterTabsProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryFilterTabs({ selectedCategory, onSelectCategory }: CategoryFilterTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg text-[9.5px] overflow-x-auto hide-scrollbar">
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelectCategory(c.id)}
          className={`px-2 py-0.5 rounded-md font-semibold cursor-pointer transition-all whitespace-nowrap ${
            selectedCategory === c.id
              ? 'bg-white text-zinc-900 shadow-2xs font-bold'
              : 'text-zinc-500 hover:text-zinc-800'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
