import React from 'react';
import { VoiceCommandIntent } from '../logic/types';
import { RepoTreeEntry } from '../../repo/storage/gitTreeApi';
import { dispatcher } from '../../../core/dispatcher';
import { Search, ShieldAlert, FileText, FileCode, ArrowRight } from 'lucide-react';

interface VoiceIntentCardProps {
  intent: VoiceCommandIntent;
  searchResults?: RepoTreeEntry[];
  onOpenFile?: (path: string) => void;
}

export function VoiceIntentCard({ intent, searchResults = [], onOpenFile }: VoiceIntentCardProps) {
  const getIcon = () => {
    switch (intent.type) {
      case 'ANALYZE_REPO':
        return <ShieldAlert className="w-4 h-4 text-purple-600" />;
      case 'SEARCH_FILE':
        return <Search className="w-4 h-4 text-blue-600" />;
      case 'CREATE_ISSUE':
        return <FileText className="w-4 h-4 text-emerald-600" />;
      default:
        return <Search className="w-4 h-4 text-zinc-500" />;
    }
  };

  const handleSelectFile = (path: string) => {
    dispatcher.emit('notify:push', { type: 'info', title: 'Membuka Berkas', message: `Berkas: ${path}` });
    dispatcher.emit('repo:open_file', { path });
    if (onOpenFile) onOpenFile(path);
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-zinc-900">
          {getIcon()}
          <span>{intent.label}</span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700 font-semibold">
          {Math.round(intent.confidence * 100)}% Cocok
        </span>
      </div>

      <p className="text-zinc-600 text-[11px] leading-relaxed">{intent.description}</p>

      {/* Specific Parameters details */}
      {intent.type === 'CREATE_ISSUE' && intent.params.issueTitle && (
        <div className="p-2 bg-white rounded-lg border border-zinc-200/80 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-zinc-500 uppercase">Judul Issue Terdeteksi:</span>
          <span className="font-semibold text-zinc-900 text-xs">{intent.params.issueTitle}</span>
        </div>
      )}

      {/* File Search Results List */}
      {searchResults.length > 0 && (
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-[10.5px] font-bold text-zinc-700">Berkas Ditemukan ({searchResults.length}):</span>
          <div className="max-h-36 overflow-y-auto flex flex-col gap-1 pr-1">
            {searchResults.map((file) => (
              <div
                key={file.sha}
                onClick={() => handleSelectFile(file.path)}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-zinc-200 hover:border-blue-200 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <FileCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="font-mono text-[11px] text-zinc-800 truncate">{file.path}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-zinc-400 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
