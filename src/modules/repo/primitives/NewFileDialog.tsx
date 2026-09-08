import React, { useState } from 'react';
import { X, FilePlus } from 'lucide-react';
import { Button } from '../../../shared/atoms/Button';
import { Input } from '../../../shared/atoms/Input';

interface NewFileDialogProps {
  currentPath: string;
  onConfirm: (fullPath: string) => void;
  onCancel: () => void;
}

export function NewFileDialog({ currentPath, onConfirm, onCancel }: NewFileDialogProps) {
  const [fileName, setFileName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fileName.trim();
    if (!cleanName) return;
    const fullPath = currentPath ? `${currentPath}/${cleanName}` : cleanName;
    onConfirm(fullPath);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-zinc-200 rounded-xl shadow-xl max-w-sm w-full p-4 flex flex-col gap-3 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilePlus className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-zinc-900">Buat Berkas Baru</h3>
          </div>
          <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-700 p-1 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] text-zinc-500">
          Direktori: <span className="font-mono text-zinc-800">{currentPath || 'root (akar repositori)'}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            id="new-file-name"
            placeholder="contoh: index.ts, styles.css, README.md"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="text-xs font-mono"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" type="button" onClick={onCancel} className="text-xs">
              Batal
            </Button>
            <Button size="sm" type="submit" disabled={!fileName.trim()} className="text-xs font-bold bg-zinc-900 text-white">
              Lanjut ke Editor
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
