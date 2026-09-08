import React, { useState } from 'react';
import { useAgentMemory } from '../logic/useAgentMemory';
import { MemoryCardItem } from './MemoryCardItem';
import { AddMemoryForm } from './AddMemoryForm';
import { MemoryFilterBar } from './MemoryFilterBar';
import { Brain, X } from 'lucide-react';
import { MemoryNote } from '../logic/types';

interface AgentMemoryModalProps {
  currentRepoFullName?: string;
  onClose: () => void;
}

export function AgentMemoryModal({ currentRepoFullName, onClose }: AgentMemoryModalProps) {
  const {
    memories,
    totalCount,
    searchQuery,
    selectedCategory,
    setSearchQuery,
    setSelectedCategory,
    addManualMemory,
    deleteMemory,
    clearAll,
  } = useAgentMemory(currentRepoFullName);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<MemoryNote['category']>('user_preference');

  const handleSaveNew = () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    addManualMemory({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      repoFullName: currentRepoFullName,
      tags: ['Manual', 'Custom'],
    });
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full p-4 border border-zinc-200 shadow-2xl flex flex-col gap-3 max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-zinc-900 leading-none">Memori & Pengetahuan AI Agent</h3>
              <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                Mengingat progres repositori, kapabilitas tools/skill, dan percakapan
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar */}
        <MemoryFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          totalCount={totalCount}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
          onClearAll={clearAll}
        />

        {/* Add New Note Box */}
        {isAdding && (
          <AddMemoryForm
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            newContent={newContent}
            setNewContent={setNewContent}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            onSave={handleSaveNew}
            onCancel={() => setIsAdding(false)}
          />
        )}

        {/* Memories List */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 min-h-[160px]">
          {memories.length === 0 ? (
            <div className="py-12 text-center text-zinc-400 text-xs flex flex-col items-center gap-1.5">
              <Brain className="w-6 h-6 stroke-1 opacity-40" />
              <span>Tidak ada catatan memori yang sesuai kriteria.</span>
            </div>
          ) : (
            memories.map((mem) => (
              <MemoryCardItem key={mem.id} memory={mem} onDelete={deleteMemory} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
