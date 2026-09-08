import React, { FC } from 'react';
import { PeerReviewFinding } from '../logic/types';
import { Bug, Sparkles, Layers, ShieldAlert, CheckCircle2, Wrench } from 'lucide-react';
import { Button } from '../../../shared/atoms/Button';

export interface PeerReviewFindingItemProps {
  key?: React.Key;
  finding: PeerReviewFinding;
  onApplyFix?: (finding: PeerReviewFinding) => void;
}

export const PeerReviewFindingItem: FC<PeerReviewFindingItemProps> = ({ finding, onApplyFix }) => {
  const getCategoryBadge = () => {
    switch (finding.category) {
      case 'logic_bug':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-red-100 text-red-800 font-semibold px-1.5 py-0.2 rounded border border-red-200">
            <Bug className="w-3 h-3 text-red-600" /> Logika Bug
          </span>
        );
      case 'redundancy':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-800 font-semibold px-1.5 py-0.2 rounded border border-amber-200">
            <Layers className="w-3 h-3 text-amber-600" /> Redundansi
          </span>
        );
      case 'security_flaw':
        return (
          <span className="flex items-center gap-1 text-[10px] bg-rose-100 text-rose-800 font-semibold px-1.5 py-0.2 rounded border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-600" /> Keamanan
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.2 rounded border border-blue-200">
            <Sparkles className="w-3 h-3 text-blue-600" /> Standar Gaya
          </span>
        );
    }
  };

  return (
    <div className="p-2.5 bg-white rounded-xl border border-zinc-200 shadow-xs flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          {getCategoryBadge()}
          <span className="font-bold text-xs text-zinc-900 truncate">{finding.title}</span>
        </div>
        {finding.lineNumber && (
          <span className="text-[10px] font-mono text-zinc-400">Baris {finding.lineNumber}</span>
        )}
      </div>

      <p className="text-[11.5px] text-zinc-600 leading-relaxed">{finding.description}</p>

      {finding.snippet && (
        <div className="p-1.5 bg-zinc-900 text-zinc-200 font-mono text-[10.5px] rounded-lg border border-zinc-800 overflow-x-auto">
          <code>{finding.snippet}</code>
        </div>
      )}

      {finding.suggestion && (
        <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-[11px] text-emerald-900 flex items-start justify-between gap-1.5">
          <div className="flex items-start gap-1.5 flex-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Saran Solusi: </span>
              <span>{finding.suggestion}</span>
            </div>
          </div>
          {onApplyFix && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onApplyFix(finding)}
              icon={<Wrench className="w-3 h-3 text-emerald-700" />}
              className="h-6 text-[10px] px-2 text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 font-bold shrink-0"
              title="Minta AI Agent menerapkan perbaikan ini ke editor"
            >
              Terapkan
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
