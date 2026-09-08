import React from 'react';
import { MemoryNote } from '../logic/types';
import { Bookmark, Cpu, MessageSquare, User, Trash2, Calendar } from 'lucide-react';

export interface MemoryCardItemProps {
  key?: React.Key;
  memory: MemoryNote;
  onDelete: (id: string) => void;
}

export function MemoryCardItem({ memory, onDelete }: MemoryCardItemProps) {
  const getCategoryInfo = () => {
    switch (memory.category) {
      case 'repo_progress':
        return { icon: <Bookmark className="w-3.5 h-3.5 text-emerald-600" />, label: 'Progres Repo', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'tool_skill':
        return { icon: <Cpu className="w-3.5 h-3.5 text-purple-600" />, label: 'Tools & Skill', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      case 'conversation':
        return { icon: <MessageSquare className="w-3.5 h-3.5 text-blue-600" />, label: 'Percakapan', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      default:
        return { icon: <User className="w-3.5 h-3.5 text-amber-600" />, label: 'Preferensi', color: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
  };

  const cat = getCategoryInfo();

  return (
    <div className="p-3 bg-white rounded-xl border border-zinc-200 shadow-2xs flex flex-col gap-1.5 relative group hover:border-zinc-300 transition-colors">
      <div className="flex items-center justify-between gap-2 pr-6">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded border ${cat.color}`}>
            {cat.icon} {cat.label}
          </span>
          {memory.repoFullName && (
            <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[140px]">
              {memory.repoFullName}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[9.5px] text-zinc-400">
          <Calendar className="w-3 h-3" />
          <span>{new Date(memory.createdAt).toLocaleDateString('id-ID')}</span>
        </div>
      </div>

      <h4 className="font-bold text-xs text-zinc-900 leading-snug">{memory.title}</h4>
      <p className="text-[11.5px] text-zinc-600 leading-relaxed whitespace-pre-wrap">{memory.content}</p>

      {memory.tags.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap mt-0.5">
          {memory.tags.map((tag, idx) => (
            <span key={idx} className="text-[9.5px] bg-zinc-100 text-zinc-600 px-1.5 py-0.2 rounded">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <button
        onClick={() => onDelete(memory.id)}
        className="absolute top-2.5 right-2.5 text-zinc-300 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded cursor-pointer"
        title="Hapus memori"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
