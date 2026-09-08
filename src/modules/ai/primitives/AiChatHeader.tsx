import React from 'react';
import { AiChatActions } from './AiChatActions';

interface AiChatHeaderProps {
  repoFullName: string | undefined;
  activeModel: string;
  loading: boolean;
  isExpanded: boolean;
  canExport: boolean;
  onToggleExpand: () => void;
  onTriggerSecurityScan: () => void;
  onGeneratePrDraft: () => void;
  onTriggerContinuousDevelopment: () => void;
  onExportReport: () => void;
  onOpenModal: (name: string) => void;
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
  onTriggerContinuousDevelopment,
  onExportReport,
  onOpenModal,
  onClearChat,
}: AiChatHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-zinc-200 select-none text-xs">
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

      <AiChatActions
        repoFullName={repoFullName}
        loading={loading}
        isExpanded={isExpanded}
        canExport={canExport}
        onToggleExpand={onToggleExpand}
        onTriggerSecurityScan={onTriggerSecurityScan}
        onGeneratePrDraft={onGeneratePrDraft}
        onTriggerContinuousDevelopment={onTriggerContinuousDevelopment}
        onExportReport={onExportReport}
        onOpenModal={onOpenModal}
        onClearChat={onClearChat}
      />
    </div>
  );
}
