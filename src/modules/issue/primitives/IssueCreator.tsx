import React, { useState } from 'react';
import { useIssue } from '../logic/useIssue';
import { Button } from '../../../shared/atoms/Button';
import { Input } from '../../../shared/atoms/Input';
import { PlusCircle, MessageSquarePlus } from 'lucide-react';

interface IssueCreatorProps {
  repoFullName: string;
}

export function IssueCreator({ repoFullName }: IssueCreatorProps) {
  const { createNewIssue, loading } = useIssue(repoFullName);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Judul tidak boleh kosong.');
      return;
    }
    setError('');
    try {
      await createNewIssue(title.trim(), body.trim());
      setTitle('');
      setBody('');
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || 'Gagal membuat issue.');
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="secondary"
        size="sm"
        icon={<PlusCircle className="w-3.5 h-3.5" />}
        onClick={() => setIsOpen(true)}
        className="w-full h-8"
      >
        Buat Issue Baru
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 p-3 border border-zinc-150 rounded-lg bg-zinc-50/50">
      <h4 className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
        <MessageSquarePlus className="w-3.5 h-3.5 text-zinc-500" />
        <span>Buat Issue Baru</span>
      </h4>
      <Input
        id="issue-title"
        placeholder="Judul Issue"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={error}
        disabled={loading}
      />
      <div className="flex flex-col gap-1">
        <label htmlFor="issue-body" className="text-xs font-semibold text-zinc-600">
          Deskripsi
        </label>
        <textarea
          id="issue-body"
          placeholder="Detail issue..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full bg-zinc-50 border text-zinc-900 border-zinc-200 hover:border-zinc-300 focus:border-zinc-900 focus:bg-white text-xs rounded-lg p-2 transition-all duration-200 outline-none min-h-[60px] resize-none"
          disabled={loading}
        />
      </div>
      <div className="flex gap-1.5 justify-end mt-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(false)}
          disabled={loading}
          className="h-8"
        >
          Batal
        </Button>
        <Button type="submit" size="sm" disabled={loading} className="h-8">
          {loading ? 'Membuat...' : 'Kirim'}
        </Button>
      </div>
    </form>
  );
}
