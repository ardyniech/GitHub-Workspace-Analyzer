import React from 'react';
import { Button } from '../../../shared/atoms/Button';
import { MemoryNote } from '../logic/types';

interface AddMemoryFormProps {
  newTitle: string;
  setNewTitle: (val: string) => void;
  newContent: string;
  setNewContent: (val: string) => void;
  newCategory: MemoryNote['category'];
  setNewCategory: (val: MemoryNote['category']) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function AddMemoryForm({
  newTitle,
  setNewTitle,
  newContent,
  setNewContent,
  newCategory,
  setNewCategory,
  onSave,
  onCancel,
}: AddMemoryFormProps) {
  return (
    <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200 flex flex-col gap-2">
      <span className="font-bold text-xs text-purple-900">Catat Pengetahuan Baru ke Memori Agent:</span>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Judul / Topik..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 p-1.5 bg-white border border-purple-200 rounded-lg text-xs outline-none"
        />
        <select
          value={newCategory}
          onChange={(e: any) => setNewCategory(e.target.value)}
          className="p-1.5 bg-white border border-purple-200 rounded-lg text-xs outline-none"
        >
          <option value="repo_progress">Progres Repo</option>
          <option value="tool_skill">Tools & Skill</option>
          <option value="conversation">Percakapan</option>
          <option value="user_preference">Preferensi</option>
        </select>
      </div>
      <textarea
        placeholder="Detail instruksi, konteks khusus, atau catatan progres..."
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        className="w-full h-16 p-1.5 bg-white border border-purple-200 rounded-lg text-xs outline-none resize-none"
      />
      <div className="flex justify-end gap-1.5">
        <Button size="sm" variant="ghost" onClick={onCancel} className="text-[10.5px] h-6 px-2">
          Batal
        </Button>
        <Button size="sm" variant="primary" onClick={onSave} className="text-[10.5px] h-6 px-2 bg-purple-700 hover:bg-purple-800 text-white font-bold">
          Simpan ke Memori
        </Button>
      </div>
    </div>
  );
}
