import React from 'react';
import { Button } from '../../../shared/atoms/Button';
import { Trash2, ShieldAlert, GitPullRequest, Maximize2, Minimize2, Download, Mic } from 'lucide-react';

interface AiChatHeaderProps {
  repoFullName: string | undefined;
  activeModel: string;
  loading: boolean;
  isExpanded: boolean;
  canExport: boolean;
  onToggleExpand: () => void;
  onTriggerSecurityScan: () => void;
  onGeneratePrDraft: () => void;
  onExportReport: () => void;
  onOpenVoice: () => void;
  onClearChat: () => void;
}

export function AiChatHeader({
  repoFullName,
  activeModel,
  loading,
  isExpanded,
  canExport,
  onToggleExpand,
  onTriggerSecurityScan,
  onGeneratePrDraft,
  onExportReport,
  onOpenVoice,
  onClearChat,
}: AiChatHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-200 select-none">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm tracking-tight text-zinc-900">
            {isExpanded ? 'Asisten AI Agent Studio (Mode Lega)' : 'Asisten AI Copilot'}
          </span>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            ⚡ {activeModel}
          </span>
        </div>
        <span className="text-[11px] text-zinc-500 font-medium">
          {repoFullName ? `Menganalisis ${repoFullName}` : 'Pilih repositori untuk memulai'}
        </span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenVoice}
          disabled={!repoFullName}
          icon={<Mic className="w-3.5 h-3.5 text-purple-600" />}
          className="h-7.5 text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 font-bold border border-purple-200"
          title="Percakapan Suara Real-time (gemini-3.1-flash-live-preview)"
        >
          Suara Real-Time
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGeneratePrDraft}
          disabled={loading || !repoFullName}
          icon={<GitPullRequest className="w-3.5 h-3.5 text-emerald-600" />}
          className="h-7.5 text-xs text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-bold border border-emerald-300"
        >
          Draft PR
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onTriggerSecurityScan}
          disabled={loading || !repoFullName}
          icon={<ShieldAlert className="w-3.5 h-3.5 text-amber-600" />}
          className="h-7.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 font-semibold border border-amber-300"
        >
          Scan Keamanan
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onExportReport}
          disabled={!canExport}
          icon={<Download className="w-3.5 h-3.5 text-blue-600" />}
          className="h-7.5 text-xs text-blue-700 bg-blue-50 hover:bg-blue-100 font-semibold border border-blue-200"
          title="Unduh ringkasan hasil analisis dalam format Markdown (.md)"
        >
          Export
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpand}
          icon={isExpanded ? <Minimize2 className="w-3.5 h-3.5 text-zinc-600" /> : <Maximize2 className="w-3.5 h-3.5 text-zinc-600" />}
          className="h-7.5 text-xs text-zinc-700 hover:bg-zinc-100 font-semibold border border-zinc-200"
        >
          {isExpanded ? 'Kecilkan' : 'Perbesar'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          icon={<Trash2 className="w-3.5 h-3.5 text-zinc-400 hover:text-red-600" />}
          onClick={onClearChat}
          className="h-7.5 text-zinc-500 hover:text-red-600 hover:bg-red-50"
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
