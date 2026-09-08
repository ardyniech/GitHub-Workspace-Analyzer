import React, { useState } from 'react';
import { ShieldCheck, Plus, Sparkles } from 'lucide-react';
import { Button } from '../../../shared/atoms/Button';

interface SnapshotCreatorProps {
  isOperating: boolean;
  onCreateSnapshot: (label: string) => Promise<void>;
}

export function SnapshotCreator({ isOperating, onCreateSnapshot }: SnapshotCreatorProps) {
  const [label, setLabel] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOperating || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onCreateSnapshot(label || 'Snapshot Pra-Perubahan');
      setLabel('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
    >
      <div className="flex items-center gap-2 flex-1">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Beri label titik pemulihan baru (opsional)..."
          disabled={isOperating || isSubmitting}
          className="w-full text-[11px] bg-white border border-zinc-200 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium placeholder:text-zinc-400"
        />
      </div>

      <Button
        type="submit"
        size="sm"
        disabled={isOperating || isSubmitting}
        icon={
          isSubmitting ? (
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )
        }
        className="h-8 text-[10px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-3 rounded-lg shrink-0 whitespace-nowrap shadow-2xs"
      >
        {isSubmitting ? 'Menyimpan...' : 'Buat Restore Point'}
      </Button>
    </form>
  );
}
